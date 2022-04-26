const baseURL = "http://localhost:3000/computadores";
const msgAlert = document.querySelector(".msg-alert");

async function findAllComputadores() {
  const response = await fetch(`${baseURL}/all-computadores`);

  const computadores = await response.json();

  computadores.forEach(function (computador) {
    document.querySelector("#computadorList").insertAdjacentHTML(
      "beforeend",
      `
    <div class="ComputadorListaItem" id="ComputadorListaItem_${computador._id}">
        <div>
            <div class="ComputadorListaItem__nome">${computador.nome}</div>
            <div class="ComputadorListaItem__preco">R$ ${computador.preco}</div>
            <div class="ComputadorListaItem__descricao">${computador.descricao}</div>

            <div class="ComputadorListaItem__acoes Acoes">
              <button class="Acoes__editar btn" onclick="abrirModal('${computador._id}')">Editar</button> 
              <button class="Acoes__apagar btn" onclick="abrirModalDelete('${computador._id}')">Apagar</button> 
            </div>
        </div>
        
        <img class="ComputadorListaItem__foto" src="${computador.foto}" alt="Computador ${computador.nome}" />

        
    </div>
    `
    );
  });
}

findAllComputadores();

async function findByIdComputadores() {
  const id = document.querySelector("#idComputador").value;

  if (id == "") {
    localStorage.setItem("message", "Digite um ID para pesquisar");
    localStorage.setItem("type", "danger");

    msgAlert.innerText = localStorage.getItem("message");
    msgAlert.classList.add(localStorage.getItem("type"));

    closeMessageAlert();
    return;
  }

  const response = await fetch(`${baseURL}/one-computador/${id}`);
  const computador = await response.json();

  if (computador.message != undefined) {
    localStorage.setItem("message", computador.message);
    localStorage.setItem("type", "danger");

    showMessageAlert();
    return;
  }

  const computadorEscolhidoDiv = document.querySelector("#computadorEscolhido");

  computadorEscolhidoDiv.innerHTML = `
  <div class="ComputadorCardItem" id="ComputadorListaItem_${computador._id}">
  <div>
      <div class="ComputadorCardItem__nome">${computador.nome}</div>
      <div class="ComputadorCardItem__preco">R$ ${computador.preco}</div>
      <div class="ComputadorCardItem__descricao">${computador.descricao}</div>
      
      <div class="ComputadorListaItem__acoes Acoes">
        <button class="Acoes__editar btn" onclick="abrirModal('${computador._id}')">Editar</button> 
        <button class="Acoes__apagar btn" onclick="abrirModalDelete('${computador._id}')">Apagar</button>
      </div>
  </div>
  <img class="ComputadorCardItem__foto" src="${computador.foto}" alt="Computador ${computador.nome}" />
</div>`;
}

async function abrirModal(id = "") {
  if (id != "") {
    document.querySelector("#title-header-modal").innerText =
      "Atualizar um Computador";
    document.querySelector("#button-form-modal").innerText = "Atualizar";

    const response = await fetch(`${baseURL}/one-computador/${id}`);
    const computador = await response.json();

    document.querySelector("#nome").value = computador.nome;
    document.querySelector("#preco").value = computador.preco;
    document.querySelector("#descricao").value = computador.descricao;
    document.querySelector("#foto").value = computador.foto;
    document.querySelector("#id").value = computador._id;
  } else {
    document.querySelector("#title-header-modal").innerText =
      "Cadastrar um Computador";
    document.querySelector("#button-form-modal").innerText = "Cadastrar";
  }

  document.querySelector("#overlay").style.display = "flex";
}

function fecharModal() {
  document.querySelector(".modal-overlay").style.display = "none";

  document.querySelector("#id").value = "";
  document.querySelector("#nome").value = "";
  document.querySelector("#preco").value = "";
  document.querySelector("#descricao").value = "";
  document.querySelector("#foto").value = "";
}

async function submitComputador() {
  const id = document.querySelector("#id").value;
  const nome = document.querySelector("#nome").value;
  const preco = document.querySelector("#preco").value;
  const descricao = document.querySelector("#descricao").value;
  const foto = document.querySelector("#foto").value;

  const computador = {
    id,
    nome,
    preco,
    descricao,
    foto,
  };

  const modoEdicaoAtivado = id != "";

  const endpoint =
    baseURL +
    (modoEdicaoAtivado ? `/update-computador/${id}` : `/create-computador`);

  const response = await fetch(endpoint, {
    method: modoEdicaoAtivado ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(computador),
  });

  const novoComputador = await response.json();

  if (novoComputador.message != undefined) {
    localStorage.setItem("message", novoComputador.message);
    localStorage.setItem("type", "danger");

    showMessageAlert();
    return;
  }

  if (modoEdicaoAtivado) {
    localStorage.setItem("message", "Computador atualizado com sucesso!");
    localStorage.setItem("type", "success");
  } else {
    localStorage.setItem("message", "Computador criado com sucesso!");
    localStorage.setItem("type", "success");
  }

  document.location.reload(true);

  fecharModal();
}

function abrirModalDelete(id) {
  document.querySelector("#overlay-delete").style.display = "flex";

  const btnSim = document.querySelector(".btn_delete_yes");

  btnSim.addEventListener("click", function () {
    deleteComputador(id);
  });
}

function fecharModalDelete() {
  document.querySelector("#overlay-delete").style.display = "none";
}

async function deleteComputador(id) {
  const response = await fetch(`${baseURL}/delete-computador/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });

  const result = await response.json();

  localStorage.setItem("message", result.message);
  localStorage.setItem("type", "success");

  document.location.reload(true);

  fecharModalDelete();
}

function closeMessageAlert() {
  setTimeout(function () {
    msgAlert.innerText = "";
    msgAlert.classList.remove(localStorage.getItem("type"));
    localStorage.clear();
  }, 3000);
}

function showMessageAlert() {
  msgAlert.innerText = localStorage.getItem("message");
  msgAlert.classList.add(localStorage.getItem("type"));
  closeMessageAlert();
}

showMessageAlert();

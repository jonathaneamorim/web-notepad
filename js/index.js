class Notas {
    constructor(notaId, name,text) {
        this.notaId = notaId;
        this.name = name;
        this.text = text;
    }
}

var contador = 0;
var notas = [];


var bloco_principal = document.querySelector('#bloco-principal');
var blocoEdicao = document.querySelector('#blocoEdicao');
var listNotas = document.querySelector('#listNotas');
var addNota = document.querySelector('#addNota');
var editVoltarButton = document.querySelector('#editVoltarButton');
var notaNameAddModal = document.querySelector('#notaName');
var notaTextEdit = document.querySelector('#notaTextEdit');
var notaNameEdit = document.querySelector('#notaNameEdit');
var deleteConfirm = document.querySelector('#deleteConfirm');
var salvarNomeEdit = document.querySelector('#salvarNomeEdit');


// ----- EVENTOS -----
document.addEventListener('DOMContentLoaded', () => {
    var dadosStorage = localStorage.getItem("dados");
    if(dadosStorage) {
        dadosStorage = JSON.parse(dadosStorage);
        notas = dadosStorage;
        var lastId = notas[notas.length - 1].notaId;
        contador = lastId + 1;
        listarNotas();
    }
    
    if(notas.length == 0) {
        mensagemNaoPossuiNotas();
    }
})

addNota.addEventListener('submit', () => {
    var novanota = new Notas(contador, notaNameAddModal.value,'');
    notas.push(novanota);
    hideAddModal();
    listarNotas();
    abrirEdicaoDaNota(novanota);
    salvarListaLocalStorage();
    contador++;
})


// ----- FUNÇÕES ------
function limparTelaEdicao() {
    notaNameEdit.value = '';
    notaTextEdit.value = '';
}

function alterarBlocoEdit() {
    bloco_principal.style.display = 'none';
    blocoEdicao.style.display = 'inherit';
}

function alterarBlocoPrincipal() {
    blocoEdicao.style.display = 'none';
    bloco_principal.style.display = 'inherit';
}

function exibeBotaoSalvarNomeEdit() {
    document.querySelector('#salvarNomeEdit').style.display = 'inherit';
}

function escondeBotaoSalvarNomeEdit() {
    document.querySelector('#salvarNomeEdit').style.display = 'none';
}

// Precisava de uma forma de fechar a modal do bootstrap direto pelo JS
//Fonte: https://tech.auct.eu/bootstrap-5-hide-existing-modal-using-javascript/
function hideAddModal() {
    bootstrap.Modal.getInstance(document.getElementById('addNotaModal')).hide();
    notaNameAddModal.value = '';
}

function hideConfirmDeleteModal() {
    bootstrap.Modal.getInstance(document.getElementById('confirmDeleteNotaModal')).hide();
}

// Fonte: https://stackoverflow.com/questions/62827002/bootstrap-v5-manually-call-a-modal-mymodal-show-not-working-vanilla-javascrip
function showConfirmDeleteModal() {
    var myModal = new bootstrap.Modal(document.getElementById('confirmDeleteNotaModal'));
    myModal.show();
}


function inserirDadosEdicao(nota) {
    notaNameEdit.value = nota.name;
    notaTextEdit.value = nota.text;
}


function deletarNota(id) {
    showConfirmDeleteModal();
    deleteConfirm.onclick = () => {
        var posicao = notas.findIndex(n => n.notaId == id);
        notas.splice(posicao, 1);
        listarNotas();
        salvarListaLocalStorage();
        hideConfirmDeleteModal();

        if(notas.length === 0) {
            localStorage.clear();
            mensagemNaoPossuiNotas();
        }
    }
}

function editarNota(id) {
    abrirEdicaoDaNota(notas.find(n => n.notaId == id));
    salvarListaLocalStorage();
    listarNotas();
}

// Assim como em outras linguagens no JS é possivel utilizar expressão Lambda para realizar consultas. 
// O método find percorre o array procurando o primeiro objeto que atenda a condição. 
// Onde n Representa UM dos objetos do array e realiza uma comparação com o notaId do objeto nota da função
// Como já possuia conhecimento prévio de expressões Lambda vindas do c#, utilizei no projeto.
function abrirEdicaoDaNota(nota) {
    limparTelaEdicao();
    alterarBlocoEdit();
    inserirDadosEdicao(nota);

    editVoltarButton.onclick = () => {
        notas.find(n => n.notaId == nota.notaId).text = notaTextEdit.value;
        alterarBlocoPrincipal();
        listarNotas();
        salvarListaLocalStorage();
    }
    salvarNomeEdit.onclick = () => {
        notas.find(n => n.notaId == nota.notaId).name = notaNameEdit.value;
        escondeBotaoSalvarNomeEdit();
    }
}

function salvarListaLocalStorage() {
    localStorage.setItem("dados", JSON.stringify(notas));
}

// Listagem das notas preparada
function listarNotas() {
    var temp = '';
        notas.forEach(nota => {
            temp += 
            `<li class="d-flex justify-content-between list-group-item align-items-center">
                    <p class="m-0 p-0 fs-5 text">${nota.name}</p>
                        <div class="d-flex align-items-center justify-content-center gap-3">
                            <button id="editar" onclick="editarNota(${nota.notaId})" class="btn btn-primary d-flex align-items-center justify-content-center editarButtonClass">Editar
                                <img width="20px" src="media/editButton.svg" alt="Editar">
                            </button>
                        <button id="remover" value="${nota.notaId}" onclick="deletarNota(${nota.notaId})" class="btn btn-primary d-flex align-items-center justify-content-center">Remover
                            <img width="20px" src="media/removeButton.svg" alt="Remover">
                        </button>
                    </div>
                </li>`
            });
    listNotas.innerHTML = temp;
}

function mensagemNaoPossuiNotas() {
    listNotas.innerHTML = `
    <div class="w-100 h-100 d-flex align-items-center justify-content-center flex-column">
        <p class="fw-lighter fs-3 text fst-italic m-0 text-center">Você ainda não possui notas!</p>
        <p class="fw-lighter fs-5 text fst-italic text-center">Clique no icone de adicionar para criar uma nota</p>
    </div>`
}
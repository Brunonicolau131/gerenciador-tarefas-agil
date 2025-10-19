const btnAdicionar = document.getElementById("btn-adicionar");
const tituloTarefa = document.getElementById("titulo-tarefa");
const descricaoTarefa = document.getElementById("descricao-tarefa");
const listaTarefas = document.getElementById("lista-tarefas");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

// Salvar tarefas no localStorage
function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Criar elemento de tarefa
function criarTarefaElemento(tarefa) {
    const divTarefa = document.createElement("div");
    divTarefa.className = "tarefa";

    const h3 = document.createElement("h3");
    h3.textContent = tarefa.titulo;

    const p = document.createElement("p");
    p.textContent = tarefa.descricao;

    // Subtarefas
    const divSubtarefas = document.createElement("div");
    divSubtarefas.className = "subtarefas";

    tarefa.subtarefas.forEach((sub, index) => {
        const divSub = document.createElement("div");
        divSub.className = "subtarefa";

        const check = document.createElement("input");
        check.type = "checkbox";
        check.checked = sub.concluida;
        check.onchange = () => {
            sub.concluida = check.checked;
            atualizarStatusTarefa(tarefa);
            salvarTarefas();
            renderizarTarefas();
        };

        const span = document.createElement("span");
        span.textContent = sub.titulo;

        const btnRemoverSub = document.createElement("button");
        btnRemoverSub.textContent = "X";
        btnRemoverSub.className = "remove-subtarefa";
        btnRemoverSub.onclick = () => {
            tarefa.subtarefas.splice(index, 1);
            atualizarStatusTarefa(tarefa);
            salvarTarefas();
            renderizarTarefas();
        };

        divSub.appendChild(check);
        divSub.appendChild(span);
        divSub.appendChild(btnRemoverSub);
        divSubtarefas.appendChild(divSub);
    });

    // Adicionar subtarefa
    const addSubDiv = document.createElement("div");
    addSubDiv.className = "add-subtarefa";

    const inputSub = document.createElement("input");
    inputSub.placeholder = "Nova subtarefa";

    const btnAddSub = document.createElement("button");
    btnAddSub.textContent = "Adicionar Subtarefa";
    btnAddSub.onclick = () => {
        if (inputSub.value.trim() !== "") {
            tarefa.subtarefas.push({titulo: inputSub.value, concluida: false});
            inputSub.value = "";
            atualizarStatusTarefa(tarefa);
            salvarTarefas();
            renderizarTarefas();
        }
    };

    addSubDiv.appendChild(inputSub);
    addSubDiv.appendChild(btnAddSub);

    // Botão remover tarefa
    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover Tarefa";
    btnRemover.className = "remove-tarefa";
    btnRemover.onclick = () => {
        tarefas = tarefas.filter(t => t.id !== tarefa.id);
        salvarTarefas();
        renderizarTarefas();
    };

    divTarefa.appendChild(h3);
    divTarefa.appendChild(p);
    divTarefa.appendChild(divSubtarefas);
    divTarefa.appendChild(addSubDiv);
    divTarefa.appendChild(btnRemover);

    return divTarefa;
}

// Atualizar status da tarefa principal
function atualizarStatusTarefa(tarefa) {
    tarefa.concluida = tarefa.subtarefas.length > 0 && tarefa.subtarefas.every(sub => sub.concluida);
}

// Renderizar tarefas
function renderizarTarefas() {
    listaTarefas.innerHTML = "";
    tarefas.forEach(tarefa => {
        listaTarefas.appendChild(criarTarefaElemento(tarefa));
    });
}

// Adicionar nova tarefa
btnAdicionar.onclick = () => {
    if (tituloTarefa.value.trim() === "") return alert("Digite um título para a tarefa");

    const novaTarefa = {
        id: Date.now(),
        titulo: tituloTarefa.value,
        descricao: descricaoTarefa.value,
        subtarefas: [],
        concluida: false
    };

    tarefas.push(novaTarefa);
    salvarTarefas();
    renderizarTarefas();

    tituloTarefa.value = "";
    descricaoTarefa.value = "";
};

//

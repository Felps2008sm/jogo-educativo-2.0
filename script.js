// =============================
// 🧠 PALAVRAS POR NÍVEL
// =============================
const banco = {
    pre: [
        { w: "GATO", en: "CAT", img: "🐱" },
        { w: "BOLA", en: "BALL", img: "⚽" },
        { w: "CASA", en: "HOUSE", img: "🏠" }
    ],
    facil: [
        { w: "PATO", en: "DUCK", img: "🦆" },
        { w: "PEIXE", en: "FISH", img: "🐟" },
        { w: "FLOR", en: "FLOWER", img: "🌸" }
    ],
    medio: [
        { w: "MACACO", en: "MONKEY", img: "🐵" },
        { w: "CAVALO", en: "HORSE", img: "🐴" },
        { w: "ESCOLA", en: "SCHOOL", img: "🏫" }
    ],
    dificil: [
        { w: "ELEFANTE", en: "ELEPHANT", img: "🐘" },
        { w: "COMPUTADOR", en: "COMPUTER", img: "💻" },
        { w: "TARTARUGA", en: "TURTLE", img: "🐢" }
    ]
};

let nivelIdade = localStorage.getItem("nivelIdade") || "pre";
let palavras = banco[nivelIdade];

// =============================
// 🎮 VARIÁVEIS
// =============================
let atual;
let xp = 0;
let nivel = 1;
let vidas = 3;
let acertosSeguidos = 0;
let ultimaPalavra = null;

let nomeJogador = localStorage.getItem("nome") || "";
let conquistas = JSON.parse(localStorage.getItem("conquistas")) || [];

// =============================
// 💾 PROGRESSO
// =============================
function salvarProgresso() {
    const dados = { nome: nomeJogador, xp, nivel, vidas, nivelIdade };
    localStorage.setItem("progresso", JSON.stringify(dados));
}

function carregarProgresso() {
    try {
        const dados = JSON.parse(localStorage.getItem("progresso"));
        if (!dados) return;

        nomeJogador = dados.nome || "";
        xp = dados.xp || 0;
        nivel = dados.nivel || 1;
        vidas = dados.vidas || 3;
        nivelIdade = dados.nivelIdade || "pre";
        palavras = banco[nivelIdade];
    } catch {
        console.warn("Erro ao carregar progresso");
    }
}

// =============================
// 🎯 NÍVEL
// =============================
function selecionarNivel(nivel) {
    nivelIdade = nivel;
    palavras = banco[nivel];
    localStorage.setItem("nivelIdade", nivel);
}

// =============================
// 🔧 UTIL
// =============================
function normalizar(t) {
    return t.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// =============================
// 🔄 NOVA PALAVRA
// =============================
function novaPalavra() {
    do {
        atual = palavras[Math.floor(Math.random() * palavras.length)];
    } while (atual === ultimaPalavra);

    ultimaPalavra = atual;

    document.getElementById("emoji").innerText = atual.img;
    document.getElementById("emojiEN").innerText = atual.img;
    document.getElementById("palavraEN").innerText = atual.en;

    document.getElementById("resposta").value = "";
    document.getElementById("respostaEN").value = "";
}

// =============================
// ✅ VERIFICAR
// =============================
function verificar(tipo, inputId, feedbackId) {
    const r = normalizar(document.getElementById(inputId).value);
    const c = normalizar(tipo === "pt" ? atual.w : atual.en);

    r === c ? acerto(feedbackId) : erro(feedbackId, tipo === "pt" ? atual.w : atual.en);
}

// =============================
// 🏆 CONQUISTAS
// =============================
function desbloquearConquista(nome) {
    if (!conquistas.includes(nome)) {
        conquistas.push(nome);
        localStorage.setItem("conquistas", JSON.stringify(conquistas));
        alert("🏆 " + nome);
    }
}

function verificarConquistas() {
    if (xp >= 100) desbloquearConquista("Primeiros passos");
    if (xp >= 500) desbloquearConquista("Aprendiz");
    if (xp >= 1000) desbloquearConquista("Mestre");

    if (acertosSeguidos >= 10) desbloquearConquista("Combo insano 🔥");
    if (nivel >= 5) desbloquearConquista("Subindo rápido 🚀");
}

// =============================
// ✅ ACERTO
// =============================
function acerto(id) {
    document.getElementById("somAcerto").play();

    acertosSeguidos++;
    xp += 10 + (acertosSeguidos * 2);

    // dificuldade automática
    if (acertosSeguidos === 5) selecionarNivel("facil");
    if (acertosSeguidos === 10) selecionarNivel("medio");
    if (acertosSeguidos === 15) selecionarNivel("dificil");

    if (xp >= nivel * 100) {
        nivel++;
        alert("⭐ Subiu de nível!");
    }

    verificarConquistas();

    mostrarAcerto(id);
    salvarRanking();
    salvarProgresso();
    atualizarUI();

    setTimeout(() => {
        const aba = document.querySelector(".aba.ativa")?.id;

        if (aba === "montar") novaPalavraMontar();
        else if (aba === "reverso") novaPerguntaReversa();
        else novaPalavra();
    }, 800);
}

// =============================
// ❌ ERRO
// =============================
function erro(id, correta) {
    document.getElementById("somErro").play();

    vidas--;
    acertosSeguidos = 0;

    if (vidas <= 0) {
        alert("💀 Game Over");
        xp = 0;
        nivel = 1;
        vidas = 3;
    }

    mostrarErro(id, correta);
    salvarProgresso();
    atualizarUI();
}

// =============================
// 🎯 UI
// =============================
function atualizarUI() {
    document.getElementById("xp").innerText = xp;
    document.getElementById("nivel").innerText = nivel;
    document.getElementById("vidas").innerText = vidas;
}

// =============================
// 📑 ABAS
// =============================
function trocarAba(id) {
    document.querySelectorAll(".aba").forEach(a => a.classList.remove("ativa"));
    document.getElementById(id).classList.add("ativa");

    if (id === "ranking") mostrarRanking();
    if (id === "montar") novaPalavraMontar();
    if (id === "reverso") novaPerguntaReversa();
    if (id === "portugues" || id === "ingles") novaPalavra();
}

// =============================
// 💬 FEEDBACK
// =============================
function mostrarAcerto(id) {
    const frases = ["Mandou bem! 🚀", "Acertou! 😎", "Boa! 💥"];
    const el = document.getElementById(id);
    el.innerHTML = frases[Math.floor(Math.random() * frases.length)];
    el.style.color = "#00ff88";
}

function mostrarErro(id, correta) {
    const el = document.getElementById(id);
    el.innerHTML = `❌ Era: <b>${correta}</b>`;
    el.style.color = "#ff4d4d";
}

// =============================
// ✍️ MONTAR PALAVRA
// =============================
let palavraMontar = "";
let respostaUsuario = "";

function novaPalavraMontar() {
    const item = palavras[Math.floor(Math.random() * palavras.length)];
    palavraMontar = item.w;

    document.getElementById("emojiMontar").innerText = item.img;
    gerarLetras(palavraMontar);
    limpar();
}

function gerarLetras(palavra) {
    const container = document.getElementById("letras");
    container.innerHTML = "";

    let letras = palavra.split("").sort(() => Math.random() - 0.5);

    letras.forEach(letra => {
        const btn = document.createElement("button");
        btn.innerText = letra;
        btn.onclick = () => selecionarLetra(letra);
        container.appendChild(btn);
    });
}

function selecionarLetra(letra) {
    respostaUsuario += letra;
    document.getElementById("respostaMontada").innerText = respostaUsuario;
}

function limpar() {
    respostaUsuario = "";
    document.getElementById("respostaMontada").innerText = "";
}

function verificarMontagem() {
    if (respostaUsuario === palavraMontar) {
        acerto("feedbackMontar");
    } else {
        erro("feedbackMontar", palavraMontar);
    }
}

// =============================
// 🌎 MODO REVERSO
// =============================
let respostaCorretaEmoji = "";

function novaPerguntaReversa() {
    const correta = palavras[Math.floor(Math.random() * palavras.length)];
    respostaCorretaEmoji = correta.img;

    document.getElementById("palavraReverso").innerText = correta.en;

    let opcoes = [correta];

    while (opcoes.length < 4) {
        let aleatoria = palavras[Math.floor(Math.random() * palavras.length)];
        if (!opcoes.includes(aleatoria)) opcoes.push(aleatoria);
    }

    opcoes.sort(() => Math.random() - 0.5);

    const container = document.getElementById("opcoesEmoji");
    container.innerHTML = "";

    opcoes.forEach(op => {
        const btn = document.createElement("button");
        btn.innerText = op.img;
        btn.onclick = () => verificarReverso(op.img);
        container.appendChild(btn);
    });
}

function verificarReverso(resposta) {
    resposta === respostaCorretaEmoji
        ? acerto("feedbackReverso")
        : erro("feedbackReverso", "🙂");
}

// =============================
// 🏆 RANKING
// =============================
function salvarRanking() {
    if (!nomeJogador) return;

    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    const jogador = ranking.find(j => j.nome === nomeJogador);

    if (jogador) jogador.xp = xp;
    else ranking.push({ nome: nomeJogador, xp });

    ranking.sort((a, b) => b.xp - a.xp);

    localStorage.setItem("ranking", JSON.stringify(ranking));
}

function mostrarRanking() {
    const lista = document.getElementById("listaRanking");
    lista.innerHTML = "";

    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    ranking.forEach(j => {
        const li = document.createElement("li");
        li.innerText = `${j.nome} - ${j.xp} XP`;
        lista.appendChild(li);
    });
}

// =============================
// 🚀 INICIAR
// =============================
window.onload = () => {
    carregarProgresso();
    atualizarUI();
    novaPalavra();
};
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

let nomeJogador = localStorage.getItem("nome") || "";

// =============================
// 💾 PROGRESSO
// =============================
function salvarProgresso() {
    const dados = {
        nome: nomeJogador,
        xp,
        nivel,
        vidas,
        nivelIdade
    };
    localStorage.setItem("progresso", JSON.stringify(dados));
}

function carregarProgresso() {
    const dados = JSON.parse(localStorage.getItem("progresso"));

    if (dados) {
        nomeJogador = dados.nome || "";
        xp = dados.xp || 0;
        nivel = dados.nivel || 1;
        vidas = dados.vidas || 3;
        nivelIdade = dados.nivelIdade || "pre";
        palavras = banco[nivelIdade];
    }
}

// =============================
// 🎯 TROCAR NÍVEL
// =============================
function selecionarNivel(nivel) {
    nivelIdade = nivel;
    palavras = banco[nivel];

    localStorage.setItem("nivelIdade", nivel);

    alert("Nível selecionado: " + nivel);

    novaPalavra();
    novaPalavraMontar();
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
    atual = palavras[Math.floor(Math.random() * palavras.length)];

    document.getElementById("emoji").innerText = atual.img;
    document.getElementById("emojiEN").innerText = atual.img;
    document.getElementById("palavraEN").innerText = atual.en;

    document.getElementById("resposta").value = "";
    document.getElementById("respostaEN").value = "";
}

// =============================
// 🇧🇷 PORTUGUÊS
// =============================
function verificarPT() {
    const r = normalizar(document.getElementById("resposta").value);
    const c = normalizar(atual.w);

    r === c ? acerto("feedback") : erro("feedback", atual.w);
}

// =============================
// 🌎 INGLÊS
// =============================
function verificarEN() {
    const r = normalizar(document.getElementById("respostaEN").value);
    const c = normalizar(atual.w);

    r === c ? acerto("feedbackEN") : erro("feedbackEN", atual.w);
}

// =============================
// ✅ ACERTO
// =============================
function acerto(id) {
    document.getElementById("somAcerto").play();

    xp += 10;

    if (xp >= nivel * 100) {
        nivel++;
        alert("⭐ Subiu de nível!");
    }

    mostrarAcerto(id);
    salvarRanking();
    salvarProgresso();
    atualizarUI();

    setTimeout(() => {
        const aba = document.querySelector(".aba.ativa")?.id;

        if (aba === "montar") {
            novaPalavraMontar();
        } else {
            novaPalavra();
        }
    }, 800);
}

// =============================
// ❌ ERRO
// =============================
function erro(id, correta) {
    document.getElementById("somErro").play();

    vidas--;

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
    if (id === "portugues" || id === "ingles") novaPalavra();
}

// =============================
// 💬 FEEDBACK
// =============================
function mostrarAcerto(id) {
    const el = document.getElementById(id);
    el.innerHTML = "😊 ✅ Muito bem!";
    el.style.color = "#00ff88";
    animarCard(true);
}

function mostrarErro(id, correta) {
    const el = document.getElementById(id);
    el.innerHTML = `😢 ❌ Era: <b>${correta}</b>`;
    el.style.color = "#ff4d4d";
    animarCard(false);
}

// =============================
// ✨ ANIMAÇÃO
// =============================
function animarCard(acerto) {
    const card = document.querySelector(".card");
    if (!card) return;

    card.classList.remove("acerto", "erro");
    void card.offsetWidth;
    card.classList.add(acerto ? "acerto" : "erro");
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

    let letras = palavra.split("");

    for (let i = letras.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letras[i], letras[j]] = [letras[j], letras[i]];
    }

    letras.forEach(letra => {
        const btn = document.createElement("button");
        btn.innerText = letra;
        btn.className = "letra";
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
        mostrarAcerto("feedbackMontar");
        salvarProgresso();
        setTimeout(novaPalavraMontar, 800);
    } else {
        mostrarErro("feedbackMontar", palavraMontar);
    }
}

// =============================
// 🏆 RANKING
// =============================
function salvarNome() {
    nomeJogador = document.getElementById("nomeJogador").value;
    localStorage.setItem("nome", nomeJogador);
    salvarProgresso();
}

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

function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.classList.toggle("ativo");
}

document.addEventListener("DOMContentLoaded", () => {
    const botao = document.querySelector(".menu-toggle");
    const menu = document.getElementById("menu");

    if (botao && menu) {
        botao.addEventListener("click", () => {
            menu.classList.toggle("ativo");
        });
    }
});
const banco = {
    pre: [
        { w:"GATO", en:"CAT", img:"🐱" },
        { w:"BOLA", en:"BALL", img:"⚽" }
    ],
    facil: [
        { w:"PATO", en:"DUCK", img:"🦆" }
    ],
    medio: [
        { w:"MACACO", en:"MONKEY", img:"🐵" }
    ],
    dificil: [
        { w:"ELEFANTE", en:"ELEPHANT", img:"🐘" }
    ]
};

let palavras = banco.pre;
let atual;
let xp = 0;
let nivel = 1;
let vidas = 3;
let respostaUsuario = "";

// ================= ABA
function trocarAba(id){
    document.querySelectorAll(".aba").forEach(a=>a.classList.remove("ativa"));
    document.getElementById(id).classList.add("ativa");

    if(id==="ingles"||id==="portugues") novaPalavra();
    if(id==="montar") novaMontar();
    if(id==="reverso") novaReversa();
}

// ================= NIVEL
function selecionarNivel(n){
    palavras = banco[n];
    novaPalavra();
}

// ================= PALAVRA
function novaPalavra(){
    atual = palavras[Math.floor(Math.random()*palavras.length)];

    document.getElementById("emoji").innerText = atual.img;
    document.getElementById("emojiEN").innerText = atual.img;
    document.getElementById("palavraEN").innerText = atual.en;

    document.getElementById("resposta").value = "";
    document.getElementById("respostaEN").value = "";
}

// ================= VERIFICAR
function verificar(tipo){
    let r = tipo==="pt"
        ? document.getElementById("resposta").value.toUpperCase()
        : document.getElementById("respostaEN").value.toUpperCase();

    let c = tipo==="pt" ? atual.w : atual.en;

    if(r === c) acerto(tipo);
    else erro(tipo,c);
}

// ================= ACERTO
function acerto(tipo){
    xp += 10;
    document.getElementById("somAcerto").play();

    if(tipo==="pt")
        document.getElementById("feedback").innerText="✅";
    else
        document.getElementById("feedbackEN").innerText="✅";

    atualizar();
}

// ================= ERRO
function erro(tipo,c){
    vidas--;
    document.getElementById("somErro").play();

    if(tipo==="pt")
        document.getElementById("feedback").innerText="❌ "+c;
    else
        document.getElementById("feedbackEN").innerText="❌ "+c;

    atualizar();
}

// ================= UI
function atualizar(){
    document.getElementById("xp").innerText = xp;
    document.getElementById("nivel").innerText = nivel;
    document.getElementById("vidas").innerText = vidas;
}

// ================= MONTAR
function novaMontar(){
    const item = palavras[Math.floor(Math.random()*palavras.length)];
    atual = item;
    respostaUsuario="";

    document.getElementById("emojiMontar").innerText=item.img;

    let letras = item.w.split("").sort(()=>Math.random()-0.5);

    let cont = document.getElementById("letras");
    cont.innerHTML="";

    letras.forEach(l=>{
        let b=document.createElement("button");
        b.innerText=l;
        b.onclick=()=> {
            respostaUsuario+=l;
            document.getElementById("respostaMontada").innerText=respostaUsuario;
        };
        cont.appendChild(b);
    });
}

function verificarMontagem(){
    if(respostaUsuario===atual.w)
        document.getElementById("feedbackMontar").innerText="✅";
    else
        document.getElementById("feedbackMontar").innerText="❌ "+atual.w;
}

function limpar(){
    respostaUsuario="";
    document.getElementById("respostaMontada").innerText="";
}

// ================= REVERSO
function novaReversa(){
    const correta = palavras[Math.floor(Math.random()*palavras.length)];

    document.getElementById("palavraReverso").innerText = correta.en;

    let cont = document.getElementById("opcoesEmoji");
    cont.innerHTML="";

    palavras.forEach(p=>{
        let b=document.createElement("button");
        b.innerText=p.img;

        b.onclick=()=>{
            if(p===correta){
                document.getElementById("feedbackReverso").innerText="✅";
                xp+=10;
            } else {
                document.getElementById("feedbackReverso").innerText="❌";
            }
            atualizar();
        };

        cont.appendChild(b);
    });
}

// ================= START
window.onload = ()=>{
    novaPalavra();
    atualizar();
};
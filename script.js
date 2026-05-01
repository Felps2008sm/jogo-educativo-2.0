const banco = {
    pre: [{ w:"GATO",en:"CAT",img:"🐱"}],
    facil: [{ w:"PATO",en:"DUCK",img:"🦆"}],
    medio: [{ w:"MACACO",en:"MONKEY",img:"🐵"}],
    dificil: [{ w:"ELEFANTE",en:"ELEPHANT",img:"🐘"}]
};

let palavras = banco.pre;
let atual;
let xp=0,nivel=1,vidas=3;
let acertosSeguidos=0;

// ================= TROCAR ABA
function trocarAba(id){
    document.querySelectorAll(".aba").forEach(a=>a.classList.remove("ativa"));
    document.getElementById(id).classList.add("ativa");

    if(id==="reverso") novaPerguntaReversa();
    if(id==="ingles"||id==="portugues") novaPalavra();
}

// ================= NIVEL
function selecionarNivel(n){
    palavras=banco[n];
}

// ================= NOVA PALAVRA
function novaPalavra(){
    atual=palavras[Math.floor(Math.random()*palavras.length)];

    document.getElementById("emoji").innerText=atual.img;
    document.getElementById("emojiEN").innerText=atual.img;
    document.getElementById("palavraEN").innerText=atual.en;
}

// ================= VERIFICAR
function verificar(tipo,input,fb){
    const r=document.getElementById(input).value.toUpperCase();
    const c= tipo==="pt"?atual.w:atual.en;

    if(r===c) acerto(fb);
    else erro(fb,c);
}

// ================= ACERTO
function acerto(id){
    xp+=10;
    acertosSeguidos++;

    if(acertosSeguidos===5) palavras=banco.facil;
    if(acertosSeguidos===10) palavras=banco.medio;

    document.getElementById("somAcerto").play();
    document.getElementById(id).innerText="✅";

    atualizarUI();
}

// ================= ERRO
function erro(id,c){
    vidas--;
    acertosSeguidos=0;

    document.getElementById("somErro").play();
    document.getElementById(id).innerText="❌ "+c;

    atualizarUI();
}

// ================= UI
function atualizarUI(){
    xpEl.innerText=xp;
    nivelEl.innerText=nivel;
    vidasEl.innerText=vidas;
}

// ================= REVERSO
function novaPerguntaReversa(){
    const correta=palavras[Math.floor(Math.random()*palavras.length)];

    document.getElementById("palavraReverso").innerText=correta.en;

    let opcoes=[correta];
    while(opcoes.length<4){
        opcoes.push(correta);
    }

    const cont=document.getElementById("opcoesEmoji");
    cont.innerHTML="";

    opcoes.forEach(op=>{
        const b=document.createElement("button");
        b.innerText=op.img;
        b.onclick=()=> {
            if(op===correta) acerto("feedbackReverso");
            else erro("feedbackReverso",correta.img);
        };
        cont.appendChild(b);
    });
}

// ================= START
window.onload=()=>{
    novaPalavra();
    atualizarUI();
};
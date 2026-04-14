/* ===================== */
/* ELEMENTOS             */
/* ===================== */
const cards = document.querySelectorAll(".card");
let current = 0;

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const pantallaFinal = document.getElementById("pantallaFinal");
const videoFinal = document.getElementById("videoFinal");

/* ===================== */
/* BOTONES               */
/* ===================== */
function actualizarBotones(){

  // ANTERIOR
  prevBtn.style.visibility = (current === 0) ? "hidden" : "visible";

  // SIGUIENTE (si NO estamos en pantalla final)
  if(pantallaFinal.style.display === "flex"){
    nextBtn.style.visibility = "hidden";
  } else {
    nextBtn.style.visibility = "visible";
  }
}

/* ===================== */
/* VIDEOS                */
/* ===================== */
function detenerVideos(){
  document.querySelectorAll(".card video").forEach(v=>{
    v.pause();
    v.currentTime = 0;
  });
}

function reproducirVideo(){
  const video = cards[current].querySelector(".card-back video");
  if(video){
    video.play();
  }
}

/* ===================== */
/* CAMBIAR TARJETA       */
/* ===================== */
function showCard(index){

  cards.forEach(c => {
    c.classList.remove("active");
    c.classList.remove("flipped");
  });

  current = index;

  cards[current].classList.add("active");

  detenerVideos();
  actualizarBotones();
}

/* ===================== */
/* PANTALLA FINAL        */
/* ===================== */
function mostrarFinal(){

  document.querySelector(".book").style.display = "none";
  document.querySelector(".controls").style.display = "none";

  pantallaFinal.style.display = "flex";

  videoFinal.currentTime = 0;
  videoFinal.play();

  actualizarBotones();
}

/* ===================== */
/* BOTÓN SIGUIENTE       */
/* ===================== */
nextBtn.addEventListener("click", () => {

  const card = cards[current];

  // 1) si NO está girada → girar
  if(!card.classList.contains("flipped")){
    card.classList.add("flipped");
    reproducirVideo();
    return;
  }

  // 2) si es la última tarjeta → pantalla final
  if(current === cards.length - 1){
    mostrarFinal();
    return;
  }

  // 3) avanzar a la siguiente tarjeta
  showCard(current + 1);
});

/* ===================== */
/* BOTÓN ANTERIOR        */
/* ===================== */
prevBtn.addEventListener("click", () => {

  const card = cards[current];

  // si está girada → volver al frente
  if(card.classList.contains("flipped")){
    card.classList.remove("flipped");
    detenerVideos();
    return;
  }

  // si no → ir a la anterior
  if(current > 0){
    showCard(current - 1);
  }
});

/* ===================== */
/* INICIO                */
/* ===================== */
window.onload = () => {
  actualizarBotones();
};

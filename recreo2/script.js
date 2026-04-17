/* ============================================================
   ELEMENTOS
============================================================ */
const cards         = document.querySelectorAll(".card");
const dots          = document.querySelectorAll(".dot");
const nextBtn       = document.getElementById("nextBtn");
const prevBtn       = document.getElementById("prevBtn");
const pantallaFinal = document.getElementById("pantallaFinal");
const videoFinal    = document.getElementById("videoFinal");
const btnVolver     = document.getElementById("btnVolver");

let current  = 0;
let animando = false;
const DURACION = 700;

/* ============================================================
   INDICADOR DE PUNTOS
============================================================ */
function actualizarDots() {
  dots.forEach((d, i) => d.classList.toggle("active", i === current));
}

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    if (animando || pantallaFinal.style.display === "flex") return;
    if (i === current) return;
    cambiarPagina(i, i > current ? "siguiente" : "anterior");
  });
});

/* ============================================================
   BOTONES DE NAVEGACIÓN
============================================================ */
function actualizarBotones() {
  prevBtn.style.visibility = current === 0 ? "hidden" : "visible";
  nextBtn.style.visibility = pantallaFinal.style.display === "flex" ? "hidden" : "visible";
}

/* ============================================================
   CAMBIO DE PÁGINA
============================================================ */
function cambiarPagina(nuevoIndex, dir) {
  if (animando) return;
  animando = true;

  const cardActual = cards[current];
  const cardNueva  = cards[nuevoIndex];

  // Cerrar cualquier video abierto
  cerrarVideoEnTarjeta(cardActual);

  const animSalir  = dir === "siguiente" ? "anim-salir"     : "anim-salir-inv";
  const animEntrar = dir === "siguiente" ? "anim-entrar"    : "anim-entrar-inv";

  cardNueva.style.display = "block";
  cardActual.classList.add(animSalir);

  setTimeout(() => {
    cardNueva.classList.add(animEntrar);
  }, 80);

  setTimeout(() => {
    cardActual.classList.remove("active", animSalir);
    cardActual.style.display = "";
    cardNueva.classList.remove(animEntrar);
    cardNueva.classList.add("active");
    current  = nuevoIndex;
    animando = false;
    actualizarBotones();
    actualizarDots();
  }, DURACION + 80);
}

/* ============================================================
   BOTONES SIGUIENTE / ANTERIOR
============================================================ */
nextBtn.addEventListener("click", () => {
  if (animando) return;
  if (current === cards.length - 1) { mostrarFinal(); return; }
  cambiarPagina(current + 1, "siguiente");
});

prevBtn.addEventListener("click", () => {
  if (animando || current === 0) return;
  cambiarPagina(current - 1, "anterior");
});

/* ============================================================
   TECLADO
============================================================ */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); nextBtn.click(); }
  if (e.key === "ArrowLeft")                   { e.preventDefault(); prevBtn.click(); }
  if (e.key === "Escape") cerrarVideoEnTarjeta(cards[current]);
});

/* ============================================================
   VIDEO OVERLAY — botón VER VIDEO
============================================================ */
document.querySelectorAll(".btn-video").forEach(btn => {
  btn.addEventListener("click", () => {
    const card    = btn.closest(".card-face");
    const overlay = card.querySelector(".video-overlay");
    const video   = overlay.querySelector("video");
    const src     = btn.dataset.video;

    // Cargar fuente si todavía no está asignada
    if (video.src !== location.href.replace(/[^/]*$/, "") + src &&
        !video.src.endsWith(src)) {
      video.src = src;
    }

    overlay.classList.add("activo");
    video.currentTime = 0;
    video.play();

    // Al terminar, cerrar automáticamente
    video.onended = () => cerrarOverlay(overlay, video);
  });
});

/* ============================================================
   BOTÓN CERRAR VIDEO
============================================================ */
document.querySelectorAll(".btn-cerrar-video").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const overlay = btn.closest(".video-overlay");
    const video   = overlay.querySelector("video");
    cerrarOverlay(overlay, video);
  });
});

function cerrarOverlay(overlay, video) {
  video.pause();
  video.currentTime = 0;
  overlay.classList.remove("activo");
}

function cerrarVideoEnTarjeta(card) {
  card.querySelectorAll(".video-overlay").forEach(overlay => {
    const video = overlay.querySelector("video");
    if (video) cerrarOverlay(overlay, video);
  });
}

/* ============================================================
   PANTALLA FINAL
============================================================ */
function mostrarFinal() {
  document.querySelector(".escenario").style.display  = "none";
  document.querySelector(".controls").style.display   = "none";
  document.querySelector(".encabezado").style.display = "none";
  pantallaFinal.style.display = "flex";
  videoFinal.currentTime = 0;
  videoFinal.play();
  actualizarBotones();
}

/* ============================================================
   BOTÓN VOLVER A EMPEZAR
============================================================ */
if (btnVolver) {
  btnVolver.addEventListener("click", () => {
    pantallaFinal.style.display = "none";
    videoFinal.pause();
    videoFinal.currentTime = 0;

    document.querySelector(".escenario").style.display  = "";
    document.querySelector(".controls").style.display   = "";
    document.querySelector(".encabezado").style.display = "";

    cards.forEach(c => {
      c.classList.remove("active", "anim-salir", "anim-entrar", "anim-salir-inv", "anim-entrar-inv");
      c.style.display = "";
      cerrarVideoEnTarjeta(c);
    });

    current = 0;
    cards[0].classList.add("active");
    actualizarBotones();
    actualizarDots();
  });
}

/* ============================================================
   INICIO
============================================================ */
window.onload = () => {
  actualizarBotones();
  actualizarDots();
};

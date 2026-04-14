/* ============================================================
   ELEMENTOS
============================================================ */
const cards      = document.querySelectorAll(".card");
const dots       = document.querySelectorAll(".dot");
const nextBtn    = document.getElementById("nextBtn");
const prevBtn    = document.getElementById("prevBtn");
const pantallaFinal = document.getElementById("pantallaFinal");
const videoFinal    = document.getElementById("videoFinal");
const btnVolver     = document.getElementById("btnVolver");
const hint          = document.getElementById("hint");

let current     = 0;
let animando    = false;  // bloquea clics durante la animación
const DURACION  = 700;   // debe coincidir con la duración CSS (ms)

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
  prevBtn.style.visibility =
    (current === 0) ? "hidden" : "visible";

  nextBtn.style.visibility =
    (pantallaFinal.style.display === "flex") ? "hidden" : "visible";
}

/* ============================================================
   CAMBIO DE PÁGINA CON EFECTO DE GIRO
   dir: "siguiente" | "anterior"
============================================================ */
function cambiarPagina(nuevoIndex, dir) {
  if (animando) return;
  animando = true;

  const cardActual = cards[current];
  const cardNueva  = cards[nuevoIndex];

  // Detener cualquier video en la tarjeta actual
  detenerVideoEnTarjeta(cardActual);

  // Clases de animación según dirección
  const animSalir  = dir === "siguiente" ? "anim-salir"      : "anim-salir-inv";
  const animEntrar = dir === "siguiente" ? "anim-entrar"     : "anim-entrar-inv";

  // Preparar la nueva tarjeta (visible pero transparente al inicio de la animación)
  cardNueva.style.display = "block";

  // Animar salida de la tarjeta actual
  cardActual.classList.add(animSalir);

  // Animar entrada de la nueva tarjeta (con un pequeño retraso para que
  // la salida arranque primero)
  setTimeout(() => {
    cardNueva.classList.add(animEntrar);
  }, 80);

  // Al terminar la animación: limpiar clases y actualizar estado
  setTimeout(() => {
    cardActual.classList.remove("active", animSalir);
    cardActual.style.display = "";

    cardNueva.classList.remove(animEntrar);
    cardNueva.classList.add("active");

    current = nuevoIndex;
    animando = false;
    actualizarBotones();
    actualizarDots();
  }, DURACION + 80);
}

/* ============================================================
   BOTÓN SIGUIENTE
============================================================ */
nextBtn.addEventListener("click", () => {
  if (animando) return;

  if (current === cards.length - 1) {
    mostrarFinal();
    return;
  }

  cambiarPagina(current + 1, "siguiente");
});

/* ============================================================
   BOTÓN ANTERIOR
============================================================ */
prevBtn.addEventListener("click", () => {
  if (animando || current === 0) return;
  cambiarPagina(current - 1, "anterior");
});

/* ============================================================
   TECLADO (flechas) — cómodo para proyector
============================================================ */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); nextBtn.click(); }
  if (e.key === "ArrowLeft")                   { e.preventDefault(); prevBtn.click(); }
});

/* ============================================================
   VIDEO OVERLAY — clic sobre la imagen
============================================================ */
document.querySelectorAll(".lado-imagen").forEach(lado => {
  const video = lado.querySelector("video");
  if (!video) return;

  lado.addEventListener("click", () => {

    // Si el video ya está activo → detenerlo y volver a la imagen
    if (lado.classList.contains("video-activo")) {
      cerrarVideo(lado, video);
      return;
    }

    // Cerrar cualquier otro video abierto en la misma tarjeta (por las dudas)
    const card = lado.closest(".card");
    card.querySelectorAll(".lado-imagen.video-activo").forEach(otro => {
      const otroVideo = otro.querySelector("video");
      cerrarVideo(otro, otroVideo);
    });

    // Activar el video de esta imagen
    lado.classList.add("video-activo");
    video.currentTime = 0;
    video.play();

    // Ocultar el hint tras el primer uso
    if (hint) hint.classList.add("oculto");

    // Cuando el video termina, volver a mostrar la imagen automáticamente
    video.onended = () => cerrarVideo(lado, video);
  });
});

function cerrarVideo(lado, video) {
  video.pause();
  video.currentTime = 0;
  lado.classList.remove("video-activo");
}

function detenerVideoEnTarjeta(card) {
  card.querySelectorAll(".lado-imagen").forEach(lado => {
    const video = lado.querySelector("video");
    if (video) cerrarVideo(lado, video);
  });
}

/* ============================================================
   PANTALLA FINAL
============================================================ */
function mostrarFinal() {
  document.querySelector(".escenario").style.display  = "none";
  document.querySelector(".controls").style.display   = "none";
  document.querySelector(".encabezado").style.display = "none";
  if (hint) hint.style.display = "none";

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
    if (hint) { hint.style.display = ""; hint.classList.remove("oculto"); }

    // Resetear todas las tarjetas
    cards.forEach((c, i) => {
      c.classList.remove("active", "anim-salir", "anim-entrar", "anim-salir-inv", "anim-entrar-inv");
      c.style.display = "";
      detenerVideoEnTarjeta(c);
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

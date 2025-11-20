// /front-end/js/detalle-evento.js

const EVENTOS = {
  feria_cafe_frailes: {
    id: "feria_cafe_frailes",
    titulo: "Feria del Café Frailes",
    tipo: "Feria gastronómica y cultural",
    fecha: "19 de enero",
    hora: "De 8:00 a.m. a 6:00 p.m.",
    modalidad: "Presencial",
    lugar: "Frailes, Costa Rica (campo ferial)",
    mapaUrl: "https://maps.app.goo.gl/EGnr9qVPeUfKpebx6",
    costo: "No especificado (consultar organización)",
    cupos: null,
    nivel: "Público general",
    imagen: "/imgs/cafe.webp",
    descripcion:
      "Disfruta la magia del café y la tradición en Frailes: un día completo de actividades culturales, música, gastronomía y ambiente familiar.",
    aprendizajes: [
      "Conectar con las tradiciones y raíces culturales de Frailes.",
      "Disfrutar actividades típicas como cimarrona, mascaradas y bailes folklóricos.",
      "Vivir una experiencia completa alrededor del café y la comunidad."
    ],
    programa: [
      "8:00 a.m. – Apertura del campo ferial: última oportunidad para disfrutar de stands y exhibiciones.",
      "9:00 a.m. – Misa: espacio para quienes deseen participar de esta tradición.",
      "9:00 a.m. – Actividades para la niñez: juegos y dinámicas para los más pequeños.",
      "10:00 a.m. – Cimarrona y mascaradas: recorrido desde el templo, lleno de música y alegría.",
      "11:00 a.m. – Bailes folklóricos: homenaje a las tradiciones y raíces culturales de Frailes.",
      "11:00 a.m. – Final de las competencias Bloom Battles: talento y emoción en una competencia especial.",
      "12:00 m.d. – Concierto con Romanza en Trío: experiencia musical para deleitar los sentidos.",
      "2:30 p.m. – Concierto bailable con Son de Colombia: ritmo y pasión para seguir disfrutando la feria.",
      "6:00 p.m. – Actividad de cierre: evento especial para despedir la feria."
    ],
    infoExtra:
      "Se recomienda llegar con tiempo para encontrar parqueo y disfrutar el programa completo. Revisa el enlace de Google Maps para ubicar el campo ferial. Llevar ropa cómoda, protección solar y algo de abrigo para la tarde."
  },

  masterclass_panes_pizza_focaccia: {
    id: "masterclass_panes_pizza_focaccia",
    titulo: "Masterclass: Panes, Pizza & Focaccia",
    tipo: "Masterclass online de panadería",
    fecha: "Miércoles 10 de diciembre de 2025",
    hora: "17:00 h (Argentina / Chile / Uruguay)",
    modalidad: "Online",
    lugar: "Clase virtual (plataforma online)",
    costo: "No especificado (incluye recetario descargable)",
    cupos: null,
    nivel: "Principiantes e intermedios",
    imagen: "/imgs/panpizzayfocaccia.jpg",
    descripcion:
      "Masterclass online ideal para quienes quieren entender de verdad cómo funciona la masa madre, la biga y otros prefermentos. Aprenderás a preparar panes, pizzas y focaccia desde cero, amasando, fermentando y horneando en vivo.",
    aprendizajes: [
      "Entender qué es y cómo funciona la masa madre, la biga y otros prefermentos.",
      "Aprender el paso a paso de amasado, fermentación y horneado en vivo.",
      "Llevar tus masas al siguiente nivel con recetas claras y consejos prácticos.",
      "Aplicar secretos de panadería profesional a panes, pizzas y focaccia."
    ],
    programa: [
      "Introducción a los prefermentos: masa madre, biga y otros.",
      "Bloque Masa Madre: Pan de campo, baguettes, pan integral de trigo y centeno.",
      "Bloque Biga: Pizza romana, focaccia, ciabatta.",
      "Bloque Soft: Pan de molde y pan de burger.",
      "Espacio interactivo para preguntas y resolución de dudas.",
      "Cierre y explicación del recetario descargable y acceso a la grabación."
    ],
    infoExtra:
      "La masterclass es interactiva: podrás hacer preguntas en vivo y aclarar todas tus dudas. Incluye recetario descargable y la clase queda grabada para que puedas verla de nuevo cuando quieras. Ideal tanto para quienes recién empiezan como para quienes ya tienen experiencia."
  }
};

// --------- LÓGICA PARA CARGAR EL EVENTO EN EL HTML ---------

function obtenerIdEventoDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function crearListaDesdeArray(lista, ulElement) {
  ulElement.innerHTML = "";
  lista.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    ulElement.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const eventId = obtenerIdEventoDesdeURL();
  const evento = EVENTOS[eventId];

  const tituloEl = document.getElementById("event-title");
  const breadcrumbEl = document.getElementById("breadcrumb-event-title");
  const tipoEl = document.getElementById("event-type");
  const fechaEl = document.getElementById("event-date");
  const horaEl = document.getElementById("event-time");
  const modalidadEl = document.getElementById("event-mode");
  const lugarEl = document.getElementById("event-location");
  const costoEl = document.getElementById("event-price");
  const cuposEl = document.getElementById("event-seats");
  const nivelEl = document.getElementById("event-level");
  const descripcionEl = document.getElementById("event-description");
  const aprendizajesUl = document.getElementById("event-learning-points");
  const programaUl = document.getElementById("event-program");
  const infoExtraEl = document.getElementById("event-extra-info");
  const imagenEl = document.getElementById("event-image");

  if (!evento) {
    if (tituloEl) tituloEl.textContent = "Evento no encontrado";
    if (descripcionEl) {
      descripcionEl.textContent =
        "No se encontró información para este evento. Verifica el enlace o regresa a la página de eventos.";
    }
    return;
  }

  if (tituloEl) tituloEl.textContent = evento.titulo;
  if (breadcrumbEl) breadcrumbEl.textContent = evento.titulo;
  if (tipoEl) tipoEl.textContent = evento.tipo;
  if (fechaEl) fechaEl.textContent = evento.fecha;
  if (horaEl) horaEl.textContent = evento.hora;
  if (modalidadEl) modalidadEl.textContent = evento.modalidad;
  if (lugarEl) lugarEl.textContent = evento.lugar;
  if (costoEl) costoEl.textContent = evento.costo || "No especificado";
  if (cuposEl) cuposEl.textContent = evento.cupos ?? "No especificado";
  if (nivelEl) nivelEl.textContent = evento.nivel || "Público general";
  if (descripcionEl) descripcionEl.textContent = evento.descripcion;
  if (infoExtraEl) infoExtraEl.textContent = evento.infoExtra;

  if (imagenEl && evento.imagen) {
    imagenEl.src = evento.imagen;
    imagenEl.alt = `Imagen del evento: ${evento.titulo}`;
  }

  if (evento.aprendizajes && Array.isArray(evento.aprendizajes) && aprendizajesUl) {
    crearListaDesdeArray(evento.aprendizajes, aprendizajesUl);
  }

  if (evento.programa && Array.isArray(evento.programa) && programaUl) {
    crearListaDesdeArray(evento.programa, programaUl);
  }

  // Si quisieras usar el enlace de Google Maps en algún botón o texto adicional,
  // podrías hacerlo aquí usando evento.mapaUrl.
});

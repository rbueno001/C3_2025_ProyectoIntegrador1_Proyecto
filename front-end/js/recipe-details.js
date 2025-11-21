// /front-end/js/recipe-detail.js

// /front-end/js/recipe-detail.js

const RECETAS = {
  queque_naranja: {
    id: "queque_naranja",
    titulo: "Queque de Naranja",
    autor: "Chef Invitado",
    tipo: "Postre",
    dificultad: "Media",
    ocasion: "Cualquier ocasión",
    tiempo: "Aproximadamente 1 hora 30 minutos (30 min preparación + 45-60 min horneado)",
    porciones: "1 queque grande (aprox. 12 porciones)",
    descripcion:
      "Queque de naranja esponjoso y aromático, preparado con jugo de naranja 100% natural y ralladura fresca para un sabor auténtico.",
    imagen: "/imgs/quequedenaranja.png",
    ingredientes: [
      "200 g de margarina a temperatura ambiente",
      "2 tazas de azúcar blanca",
      "5 yemas de huevo",
      "Ralladura de 3 naranjas",
      "3 tazas de harina sin preparar",
      "3 cucharaditas de polvo de hornear",
      "1 1/2 tazas de jugo de naranja natural",
      "5 claras de huevo batidas a punto de nieve",
      "1 taza de chips de chocolate (opcional)"
    ],
    pasos: [
      "Precalienta el horno a 180°C (350°F).",
      "Engrasa y enharina un molde para queque o forra el fondo con papel manteca.",
      "Asegúrate de que la margarina esté a temperatura ambiente para que sea más fácil de batir.",
      "Lava bien las naranjas, ralla la cáscara y exprímelas hasta obtener 1 1/2 tazas de jugo de naranja natural.",
      "En un bowl mediano, cierne la harina junto con el polvo de hornear; mezcla bien y reserva.",
      "En otro bowl, bate la margarina con el azúcar hasta obtener una mezcla cremosa.",
      "Agrega las yemas una a una, batiendo bien después de cada adición, e incorpora la ralladura de naranja.",
      "Alterna agregando el jugo de naranja y la mezcla de harina cernida, mezclando suavemente hasta integrar todo.",
      "Incorpora las claras batidas a punto de nieve con movimientos envolventes; si deseas, agrega los chips de chocolate al final.",
      "Vierte la mezcla en el molde preparado y hornea de 45 a 60 minutos, o hasta que al insertar un palillo en el centro salga limpio.",
      "Retira del horno, deja enfriar unos minutos en el molde, luego desmolda y deja enfriar por completo antes de cortar."
    ]
  },

  huevos_rancheros: {
    id: "huevos_rancheros",
    titulo: "Huevos Rancheros",
    autor: "Chef Invitado",
    tipo: "Desayuno",
    dificultad: "Media",
    ocasion: "Desayuno o brunch",
    tiempo: "35 minutos (15 min preparación + 20 min cocción)",
    porciones: "2 porciones (2 huevos por persona)",
    descripcion:
      "Clásico desayuno mexicano: tortillas de maíz con huevos fritos cubiertos con salsa ranchera casera, acompañados de queso fresco, aguacate y cilantro.",
    imagen: "/imgs/huevosrancheros.jpg",
    ingredientes: [
      "2 cucharadas de aceite vegetal (para la salsa)",
      "1/2 cebolla blanca o amarilla, picada",
      "1 diente de ajo, picado finamente",
      "1 chile serrano o jalapeño, sin semillas y picado (opcional, al gusto)",
      "3 tomates rojos maduros o 1 lata (400 g) de tomates enteros pelados",
      "2 cucharadas de caldo de pollo o agua",
      "1/4 taza de cilantro picado",
      "Sal y pimienta al gusto",
      "4 huevos grandes",
      "4 tortillas de maíz",
      "Aceite o manteca para freír",
      "Queso fresco desmenuzado (Panela, Cotija, Feta, etc.) para decorar (opcional)",
      "Aguacate en rebanadas (opcional)",
      "Cilantro fresco para decorar (opcional)",
      "Crema agria o mexicana (opcional)"
    ],
    pasos: [
      "Si usas tomates frescos, lávalos y haz una cruz superficial en la base. Ásalos en un comal o sartén sin aceite hasta que la piel se queme un poco y se ablanden, o hiérvelos 5 minutos.",
      "En una sartén mediana, calienta 2 cucharadas de aceite a fuego medio. Agrega la cebolla y el chile picado y sofríe 3-4 minutos hasta que estén suaves.",
      "Añade el ajo y cocina 1 minuto más, hasta que esté fragante.",
      "Transfiere la mezcla a la licuadora. Agrega los tomates (asados o en lata), el caldo y el cilantro. Licúa hasta obtener una salsa semi-líquida con algo de textura.",
      "Regresa la salsa a la sartén, sazona con sal y pimienta y deja hervir. Luego baja el fuego y cocina a fuego lento 8-10 minutos hasta que espese ligeramente. Mantén caliente.",
      "En otra sartén, calienta aceite o manteca a fuego medio-alto. Fríe las tortillas de maíz una por una durante unos 30 segundos por lado, hasta que estén ligeramente doradas pero aún flexibles. Escúrrelas sobre papel absorbente.",
      "En la misma sartén (añade un poco más de aceite si es necesario), casca los huevos con cuidado y fríelos a fuego medio hasta que las claras cuajen y las orillas estén ligeramente crujientes, dejando la yema líquida si quieres el estilo tradicional.",
      "Coloca dos tortillas calientes en cada plato. Pon un huevo frito sobre cada tortilla.",
      "Baña generosamente los huevos y las tortillas con la salsa ranchera caliente.",
      "Decora con queso fresco desmenuzado, rebanadas de aguacate, cilantro y, si deseas, una cucharada de crema agria. Sirve de inmediato."
    ]
  },

  pollo_asado: {
    id: "pollo_asado",
    titulo: "Pollo Asado con Papas y Verduras",
    autor: "Chef Invitado",
    tipo: "Plato fuerte",
    dificultad: "Media",
    ocasion: "Almuerzo o cena",
    tiempo: "45 minutos a 1 hora de cocción",
    porciones: "4 porciones",
    descripcion:
      "Pollo asado al horno acompañado de papas, zanahorias y cebolla, sazonado con especias y romero para un plato completo y muy aromático.",
    imagen: "/imgs/polloasado.jpg",
    ingredientes: [
      "4-6 piezas de pollo (muslos con contramuslos o piernas)",
      "1 kg de papas, cortadas en gajos o cubos gruesos",
      "2 zanahorias grandes, peladas y cortadas en trozos",
      "1 cebolla roja o amarilla, cortada en gajos gruesos",
      "3 cucharadas de aceite de oliva",
      "1 sobre de sazonador completo para pollo (o mezcla de ajo en polvo, cebolla en polvo, pimentón dulce, sal y pimienta)",
      "1 ramita de romero fresco (opcional)"
    ],
    pasos: [
      "Precalienta el horno a 200°C (400°F). Lava bien las papas; no es necesario pelarlas si están limpias.",
      "En una bandeja grande para horno, coloca las papas, zanahorias y cebolla. Añade el aceite de oliva y la mitad del sazonador. Mezcla bien con las manos para que las verduras se impregnen.",
      "Coloca las piezas de pollo sobre las verduras. Úntalas con un poco más de aceite si es necesario y espolvorea el resto de los condimentos por encima, frotando bien.",
      "Si usas romero fresco, coloca la ramita sobre el pollo y las verduras.",
      "Hornea durante 45 minutos a 1 hora, sin abrir el horno durante los primeros 30 minutos para que el pollo se dore bien.",
      "El pollo estará listo cuando la piel esté dorada y crujiente, y al pinchar una papa con un tenedor, esta esté tierna.",
      "Saca la bandeja del horno y deja reposar unos 5 minutos. Lleva la bandeja directamente a la mesa y sirve caliente."
    ]
  },

  canelones: {
    id: "canelones",
    titulo: "Canelones Rellenos de Carne con Bechamel",
    autor: "Recetas de Esbieta",
    tipo: "Pasta",
    dificultad: "Media",
    ocasion: "Comida especial",
    tiempo: "1 hora 50 minutos (50 min preparación + 1 hora cocción)",
    porciones: "4 porciones",
    descripcion:
      "Canelones rellenos con una mezcla de carnes de res, cerdo y pollo, cubiertos con salsa bechamel y queso parmesano, gratinados al horno al estilo casero italiano.",
    imagen: "/imgs/canelones.png",
    ingredientes: [
      "Placas o láminas de canelones (precocidas o según indicaciones del paquete)",

      // Relleno
      "500 g de carne picada o molida de res",
      "500 g de carne de cerdo en trozos",
      "300 g de pollo en trozos",
      "1 cebolla",
      "1 rama de apio",
      "1 zanahoria",
      "150 ml de vino blanco",
      "3 cucharadas de salsa de tomate",
      "1 huevo",
      "3-4 cucharadas de queso parmesano rallado",
      "2-3 cucharadas de aceite",
      "Agua (cantidad necesaria para guisar)",
      "Sal, pimienta negra molida, nuez moscada y romero al gusto",

      // Bechamel
      "45 g de mantequilla",
      "35 g de harina de trigo",
      "500 ml de leche",
      "Sal y nuez moscada al gusto",

      // Para gratinar
      "Mantequilla para engrasar la fuente",
      "Queso parmesano o grana padano rallado para gratinar"
    ],
    pasos: [
      "Pica finamente la cebolla y el apio. Ralla la zanahoria con un rallador de agujero grande.",
      "En una sartén amplia a fuego alto, añade 2-3 cucharadas de aceite y dora la carne de cerdo y el pollo. Retira y reserva.",
      "En la misma sartén, dora la carne picada de res. Al principio soltará agua; deja que se evapore y continúa cocinando hasta que tome color.",
      "Agrega las verduras (cebolla, apio y zanahoria) a la carne de res y rehoga unos 5 minutos.",
      "Incorpora nuevamente la carne de cerdo y el pollo. Añade el vino blanco y cocina hasta que el alcohol se evapore.",
      "Agrega las 3 cucharadas de salsa de tomate, sal al gusto y mezcla bien.",
      "Añade agua hasta cubrir el guiso y coloca una ramita de romero. Cocina a fuego bajo con la tapa entreabierta durante aproximadamente 1 hora, removiendo de vez en cuando. Si se seca demasiado, añade un poco más de agua.",
      "Cuando la carne esté muy blanda, apaga el fuego y deja enfriar el relleno.",
      "Una vez frío, añade el huevo, 3-4 cucharadas de parmesano rallado, una pizca de nuez moscada y pimienta negra. Tritura con batidora hasta obtener una mezcla fina, tipo paté.",
      "Prepara las láminas de canelones según las instrucciones del paquete (si son precocidas, solo hidrátalas como indique el fabricante).",
      "Rellena cada lámina de canelón con la mezcla de carne y enróllalas formando los canelones.",

      // Bechamel
      "Para la bechamel, derrite 45 g de mantequilla a fuego medio en una olla, cuidando que no se queme.",
      "Añade 35 g de harina de trigo y rehoga un par de minutos, mezclando bien.",
      "Incorpora poco a poco los 500 ml de leche a temperatura ambiente, sin dejar de remover, hasta que la salsa espese.",
      "Agrega sal y una pizca de nuez moscada. Cocina 2 minutos más después de que empiece a borbotear para que la harina se termine de cocer. Reserva.",

      // Montaje
      "Engrasa una fuente para horno con mantequilla y cubre el fondo con una capa de bechamel.",
      "Coloca los canelones rellenos sobre la bechamel y vierte más bechamel por encima y entre los rollos, de modo que queden bien cubiertos.",
      "Espolvorea generosamente con queso parmesano o grana padano rallado.",
      "Hornea a 200°C con calor arriba y abajo durante 30-40 minutos, o hasta que la superficie esté dorada. El horno debe estar precalentado al menos 20 minutos.",
      "Retira del horno, deja reposar unos minutos y sirve caliente."
    ]
  },

  ensalada_amaranto: {
    id: "ensalada_amaranto",
    titulo: "Ensalada de Amaranto con Aguacate y Mango",
    autor: "Chef Invitado",
    tipo: "Ensalada",
    dificultad: "Fácil",
    ocasion: "Almuerzo ligero o cena fresca",
    tiempo: "30-35 minutos (incluye cocción del amaranto)",
    porciones: "3 porciones",
    descripcion:
      "Ensalada fresca y nutritiva a base de amaranto cocido, aguacate, mango, vegetales crujientes y un aderezo de limón, aceite de oliva y miel.",
    imagen: "/imgs/ensalada de aramanto.jpg",
    ingredientes: [
      "1 taza de amaranto, bien enjuagado",
      "2 tazas de agua o caldo de verduras",
      "1 aguacate maduro, en cubos",
      "1 mango maduro pero firme, en cubos",
      "1/2 pepino, en cubos pequeños",
      "1/4 de taza de cebolla roja, picada finamente",
      "1/4 de taza de cilantro fresco, picado grueso",
      "1/4 de taza de nueces o almendras fileteadas, tostadas ligeramente",
      "1/2 taza de garbanzos cocidos (opcional)",
      "Queso feta o de cabra desmenuzado (opcional)",
      "Jugo de 2 limones",
      "3 cucharadas de aceite de oliva virgen extra",
      "1 cucharadita de miel",
      "Sal y pimienta negra recién molida al gusto"
    ],
    pasos: [
      "Enjuaga muy bien el amaranto bajo agua fría usando un colador de malla fina, ya que los granos son muy pequeños.",
      "Coloca el amaranto en una olla con las 2 tazas de agua o caldo. Lleva a ebullición.",
      "Cuando hierva, tapa la olla, baja el fuego al mínimo y cocina de 20 a 25 minutos sin destapar, para evitar que el agua se evapore demasiado rápido.",
      "Apaga el fuego y deja reposar, siempre tapado, durante 10 minutos. Luego destapa y esponja el amaranto con un tenedor. Deja enfriar.",
      "Mientras el amaranto se enfría, prepara el aderezo: en un frasco con tapa mezcla el jugo de limón, el aceite de oliva, la miel, la sal y la pimienta.",
      "Cierra el frasco y agita vigorosamente hasta que el aderezo esté bien emulsionado. Prueba y ajusta la sazón si es necesario.",
      "En un bowl grande coloca el amaranto ya frío. Agrega el aguacate, el mango, el pepino, la cebolla roja y el cilantro.",
      "Vierte aproximadamente la mitad del aderezo sobre la mezcla y revuelve suavemente para integrar todo sin aplastar el aguacate.",
      "Añade las nueces o almendras tostadas y, si deseas, los garbanzos y el queso feta o de cabra justo antes de servir.",
      "Sirve de inmediato con el aderezo restante aparte, por si alguien desea añadir más."
    ]
  }
};



// Cuando el DOM esté listo:
document.addEventListener("DOMContentLoaded", () => {
  console.log("👉 JS de detalle-receta cargado");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  console.log("ID de la receta en la URL:", id);

  const container = document.getElementById("recipe-container");
  const errorBox = document.getElementById("recipe-error");

  if (!id || !RECETAS[id]) {
    // Si no hay receta válida, mostramos mensaje de error
    container.classList.add("d-none");
    errorBox.classList.remove("d-none");
    return;
  }

  const r = RECETAS[id];

  // Rellenar el HTML
  document.getElementById("recipe-image").src = r.imagen;
  document.getElementById("recipe-image").alt = r.titulo;
  document.getElementById("recipe-title").textContent = r.titulo;
  document.getElementById("recipe-author").textContent = r.autor;

  document.getElementById("recipe-type").textContent = r.tipo;
  document.getElementById("recipe-difficulty").textContent = r.dificultad;
  document.getElementById("recipe-occasion").textContent = r.ocasion;

  document.getElementById("recipe-description").textContent = r.descripcion;
  document.getElementById("recipe-time").textContent = r.tiempo;
  document.getElementById("recipe-servings").textContent = r.porciones;

  document.getElementById("recipe-ingredients").innerHTML =
    r.ingredientes.map(i => `<li>• ${i}</li>`).join("");

  document.getElementById("recipe-steps").innerHTML =
    r.pasos.map((p, idx) => `<li><strong>Paso ${idx + 1}:</strong> ${p}</li>`).join("");
});

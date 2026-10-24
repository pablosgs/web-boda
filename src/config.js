// Datos que se repiten en todas las páginas. Cambiarlos aquí los cambia en toda la web.

// Apariencia: estilo (css/estilos.css), paleta (css/paletas.css) y tipografía
// (css/tipografias.css). El probador (?estilos) copia este bloque listo para pegar.
export const apariencia = {
  estilo: "invitacion",
  tema: "marfil",
  tipo: "elegante"
};

export const boda = {
  nombres: ["Ane", "Pablo"],
  lugar: "Finca Machoenia, Urrugne",
  // Fecha y hora de la ceremonia (la usa la cuenta atrás).
  fecha: "2027-07-03T12:30:00",
  fechaTexto: "3 de julio de 2027",
  fechaCorta: "03.07.2027",
  // Fecha límite que se muestra en la página de confirmación.
  confirmarAntesDe: "1 de mayo de 2027"
};

// Secciones de la portada y páginas propias. Se usan en el menú y en el índice.
export const navegacion = [
  { id: "dia", texto: "El día", icono: "brindis" },
  { id: "transporte", texto: "Transporte", icono: "autobus" },
  { id: "alojamiento", texto: "Alojamiento", icono: "alojamiento" },
  { id: "contactos", texto: "Contactos", icono: "telefono" },
  { id: "regalo", texto: "Regalo", icono: "regalo" },
  { ruta: "/confirmar/", texto: "Confirmar asistencia", icono: "sobre" }
];

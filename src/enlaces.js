// Devuelve el href de un elemento de navegacion (config.js).
// En la portada las secciones se enlazan con #id para no recargar la página
// (y no perder los parámetros del probador); desde otras páginas, con /#id.
export function enlace(item, rutaActual) {
  if (item.ruta) return item.ruta;
  return rutaActual === "/" ? "#" + item.id : "/#" + item.id;
}

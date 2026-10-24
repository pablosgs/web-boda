// Configuración de Astro. La web sigue siendo 100 % estática: Astro solo
// genera el HTML en dist/ a partir de src/ y copia public/ tal cual.
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  // Cada página se genera como carpeta/index.html (/confirmar/).
  build: {
    format: "directory",
    // Nunca meter CSS en línea: la CSP de _headers solo permite style-src 'self'.
    inlineStylesheets: "never"
  },
  trailingSlash: "ignore",
  // La barra de herramientas de desarrollo inyecta scripts; no hace falta.
  devToolbar: {
    enabled: false
  }
});

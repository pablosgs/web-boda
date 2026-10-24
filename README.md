# Web de la boda (privada)

Web con la información para los invitados y un formulario para confirmar asistencia. Se genera con **Astro** como HTML estático: sin analítica, sin cookies y sin recursos de terceros. El formulario lo recoge **Netlify Forms**, y desde su panel las respuestas se descargan en un CSV que se abre con Excel.

```
Repositorio GitHub privado → Netlify (compila Astro y recoge el formulario) → Dominio propio → Invitados
                                                                             (comprado en Cloudflare)
```

**Estado actual: web abierta.** Cualquiera que tenga el enlace puede verla, pero no aparece en buscadores.

---

## Índice

1. [Estructura](#1-estructura)
2. [Instalación](#2-instalación)
3. [Probar en local](#3-probar-en-local)
4. [Personalizar el contenido](#4-personalizar-el-contenido)
5. [Estilos, paletas y tipografías](#5-estilos-paletas-y-tipografías)
6. [Añadir páginas](#6-añadir-páginas)
7. [El formulario de confirmación](#7-el-formulario-de-confirmación)
8. [Imágenes](#8-imágenes)
9. [GitHub (repositorio privado)](#9-github-repositorio-privado)
10. [Desplegar en Netlify](#10-desplegar-en-netlify)
11. [Ver las respuestas y sacar el Excel](#11-ver-las-respuestas-y-sacar-el-excel)
12. [Comprar un dominio en Cloudflare y conectarlo](#12-comprar-un-dominio-en-cloudflare-y-conectarlo)
13. [Más adelante: pasar a Cloudflare Pages](#13-más-adelante-pasar-a-cloudflare-pages)
14. [Medidas de privacidad](#14-medidas-de-privacidad)
15. [Comprobaciones tras publicar](#15-comprobaciones-tras-publicar)
16. [Mantenimiento y después de la boda](#16-mantenimiento-y-después-de-la-boda)
17. [Checklist de privacidad](#17-checklist-de-privacidad)

---

## 1. Estructura

```
.
├── README.md                 ← este documento (NO se publica)
├── package.json              ← dependencias (solo Astro) y comandos npm
├── astro.config.mjs          ← configuración de Astro
├── netlify.toml              ← configuración de despliegue en Netlify
├── licencias/                ← licencias de las fuentes (NO se publica)
├── scripts/
│   ├── limpiar-imagenes.sh   ← borra metadatos de public/img
│   └── pre-commit            ← hook que bloquea commits de imágenes con metadatos
├── src/                      ← páginas (Astro las convierte en HTML)
│   ├── config.js             ← apariencia, nombres, fecha, menú: TODO lo que se repite
│   ├── enlaces.js            ← ayuda para los enlaces del menú
│   ├── layouts/Base.astro    ← <head>, menú, pie y probador comunes a todas las páginas
│   ├── components/
│   │   ├── Menu.astro        ← menú desplegable
│   │   ├── Cabecera.astro    ← cabecera reducida de las páginas interiores
│   │   └── Probador.astro    ← panel de ?estilos
│   └── pages/                ← cada archivo es una página
│       ├── index.astro       ← portada   → /
│       ├── confirmar.astro   ← formulario → /confirmar/
│       ├── gracias.astro     ← tras enviar → /gracias/
│       └── 404.astro         ← página no encontrada
├── public/                   ← se copia TAL CUAL a la web
│   ├── robots.txt
│   ├── _headers              ← cabeceras de seguridad (Netlify y Cloudflare usan el mismo formato)
│   ├── css/                  ← paletas.css, tipografias.css, style.css, estilos.css
│   ├── js/script.js          ← todo el JavaScript
│   ├── fonts/                ← fuentes alojadas localmente (sin Google Fonts)
│   └── img/                  ← portada, favicon e iconos SVG
└── dist/                     ← web generada por `npm run build` (NO se sube a git)
```

**Qué se publica:** solo `dist/`, que Astro genera a partir de `src/` y `public/`. El README, `src/`, los scripts y las licencias nunca quedan accesibles en la web.

**Reglas que se mantienen:**

- No hay CSS ni JS en línea en el HTML. Todo el CSS está en `public/css/` y todo el JS en `public/js/script.js`. Así funciona una Content-Security-Policy estricta (`script-src 'self'; style-src 'self'`).
- En los `.astro` no se usan bloques `<style>` ni `<script>` procesados por Astro. El único script se carga con `<script is:inline src="/js/script.js">`, que es un archivo externo.
- `astro.config.mjs` tiene `inlineStylesheets: "never"` y desactiva la barra de desarrollo de Astro.

---

## 2. Instalación

Requisitos: **Node.js 22.23 o superior** (tienes el 24). Python ya no hace falta; la carpeta `.venv` se puede borrar.

```powershell
# Desde la carpeta del proyecto, una sola vez:
npm install

# Astro envía estadísticas de uso anónimas por defecto. Para desactivarlas en tu equipo:
npx astro telemetry disable
```

En Netlify ya están desactivadas mediante `ASTRO_TELEMETRY_DISABLED` en `netlify.toml`.

---

## 3. Probar en local

### Mientras editas

```powershell
npm run dev
```

Abre **http://localhost:4321**. Al guardar cualquier archivo, la página se recarga sola.

- http://localhost:4321/?estilos: probador de estilos (ver sección 5)
- http://localhost:4321/confirmar/: formulario (también enlazado desde el botón «Confirmar asistencia» de la portada)
- http://localhost:4321/no-existe: página 404

Para pararlo, pulsa `Ctrl+C`.

### La versión final, igual que en Netlify

```powershell
npm run build      # genera dist/
npm run preview    # sirve dist/ en http://localhost:4321
```

Conviene hacerlo antes de publicar: si `npm run build` falla aquí, también fallará en Netlify.

### En el móvil

```powershell
npm run dev -- --host
```

Astro muestra una dirección `Network: http://192.168.x.x:4321`. Ábrela desde un móvil conectado a la misma wifi. La primera vez, el Firewall de Windows puede pedir permiso.

Para hacer una prueba rápida sin móvil, abre las herramientas de desarrollo con F12 y activa el modo dispositivo con `Ctrl+Shift+M`.

### Qué NO se puede probar en local

- **El envío del formulario.** Netlify Forms solo funciona en la web publicada. En local puedes revisar el diseño, los campos obligatorios y que la parte «Si vienes» se oculte al marcar «No podré ir», pero no el envío. Para probar el envío, publica (sección 10) y rellena el formulario en la web real o en un *deploy preview*.
- **Las cabeceras de `_headers`** (CSP, etc.). Se comprueban tras publicar (sección 15).

### Comprobaciones rápidas

```powershell
node --check public/js/script.js
npm run build
# No debe aparecer nada: ni estilos, ni scripts en línea, ni atributos on*
Select-String -Path dist\*.html, dist\*\*.html -Pattern 'style=|onclick|<script>|<style'
```

---

## 4. Personalizar el contenido

### Datos comunes: `src/config.js`

```js
export const apariencia = { estilo: "invitacion", tema: "marfil", tipo: "elegante" };

export const boda = {
  nombres: ["Ane", "Pablo"],
  lugar: "Finca Machoenia, Urrugne",
  fecha: "2027-07-03T12:30:00",       // la usa la cuenta atrás
  fechaTexto: "3 de julio de 2027",
  fechaCorta: "03.07.2027",
  confirmarAntesDe: "1 de mayo de 2027"
};

export const navegacion = [ /* elementos del menú y del índice */ ];
```

Lo que cambies aquí se aplica a todas las páginas: título, portada, pie, menú y cabecera.

### Texto de cada página: `src/pages/*.astro`

Los horarios, el transporte, los hoteles, los contactos y el IBAN están en `src/pages/index.astro`. Por encima de la línea `---` el archivo es HTML normal.

- Para comentar un bloque, usa `{/* … */}` en lugar de `<!-- … -->`. Así no llega al HTML publicado.
- Los enlaces a mapas usan OpenStreetMap (`https://www.openstreetmap.org/search?query=...`), con `target="_blank" rel="noopener noreferrer"`. Revisa el de la finca: todavía apunta a la dirección de ejemplo.
- Publica solo direcciones de lugares públicos, nunca domicilios particulares.
- Nombres: mejor solo los de pila, sin apellidos.

---

## 5. Estilos, paletas y tipografías

La apariencia se controla con tres valores en `src/config.js`. Astro los pone en la etiqueta `<html>` de **todas** las páginas:

```js
export const apariencia = { estilo: "invitacion", tema: "marfil", tipo: "elegante" };
```

El estilo por defecto es **Invitación** (`invitacion`, con la paleta `marfil` y la tipografía `elegante`).

- **Estilo** (`data-estilo`, en `public/css/estilos.css`): composición y decoración.
- **Paleta** (`data-tema`, en `public/css/paletas.css`): colores.
- **Tipografía** (`data-tipo`, en `public/css/tipografias.css`): fuentes.

Se combinan libremente: 24 estilos × 29 paletas × 17 tipografías.

### Invitación: separación entre secciones

El estilo `invitacion` tiene seis variantes que solo cambian cómo se separan las secciones. Ahora mismo el probador muestra **solo estas seis**; los demás estilos están comentados en `src/components/Probador.astro` (su CSS sigue en `estilos.css`, así que basta con sacarlos del comentario para recuperarlos).

| `estilo` | Separación |
|---|---|
| `invitacion` | Ramita en verde salvia |
| `invitacion-rombo` | Filete doble con un rombo en el centro |
| `invitacion-montanas` | Las montañas de la portada en pequeño |
| `invitacion-pinos` | Tres pinos a plumilla |
| `invitacion-filete` | Una línea fina a todo el ancho |
| `invitacion-tarjetas` | Título y párrafo fuera; la información concreta dentro de una tarjeta con borde y sombra suave. Título centrado |
| `invitacion-tarjetas-linea` | Tarjetas, con el título a la izquierda seguido de una línea: «EL DÍA ———» |
| `invitacion-tarjetas-centrado` | Tarjetas, con el título centrado entre dos líneas: «——— EL DÍA ———» |
| `invitacion-tarjetas-subrayado` | Tarjetas, con el título a la izquierda y una línea completa debajo |
| `invitacion-tarjetas-numerado` | Tarjetas, con número, título y línea: «01 EL DÍA ———» (el número solo en la portada) |

En el CSS, las reglas comunes usan `html[data-estilo^="invitacion"]` (empieza por «invitacion»), de modo que todo lo demás es idéntico en las seis.

### Probar al vuelo

Abre cualquier página con `?estilos` al final:

```
http://localhost:4321/?estilos
```

Aparece un panel abajo a la derecha que permite:

- Cambiar estilo, paleta y tipografía en directo. Al cambiar de estilo se aplican su paleta y tipografía recomendadas; desmarca la casilla para mantener las tuyas.
- Probar una combinación al azar.
- **Copiar configuración**: copia la línea `export const apariencia = {…}`, lista para pegar en `src/config.js`.
- Plegar el panel para ver la página entera.

La URL se actualiza con la combinación (`?estilos&estilo=postal&tema=arena&tipo=maquina`), así que puedes enviársela a tu pareja. La combinación **se mantiene al navegar** entre la portada y el formulario.

Sin `?estilos`, el panel no aparece. Cuando decidáis, pegad la configuración en `src/config.js`. Si queréis, quitad después `<Probador />` de `src/layouts/Base.astro`.

### Estilos

| `estilo` | Descripción | Recomendado con |
|---|---|---|
| `sereno` | Dos columnas en escritorio, líneas finas | `salvia` + `instrument` |
| `dibujado` | Invitación ilustrada: nombres rotulados con «+», cronología con iconos, foto que se funde con el fondo, menú desplegable | `terracota` + `mano` |
| `postal` | Secciones como postales ligeramente giradas, sello de correos, horas en matasellos, foto tipo polaroid | `arena` + `maquina` |
| `deco` | Marco doble con esquinas, rombos, foto en arco, mayúsculas espaciadas | `medianoche` + `deco` |
| `botanico` | Flor en la portada, ramas como separadores, foto ovalada, títulos en cursiva | `menta` + `caligrafia` |
| `moderno` | Nombres enormes alineados a la izquierda, líneas gruesas, foto en blanco y negro | `rojizo` + `grotesca` |
| `verbena` | Banderines de fiesta, tarjetas redondeadas, horas en etiquetas | `mandarina` + `redonda` |
| `azulejo` | Cenefas de azulejo en portada, pie y marco de la foto | `cielo` + `suave` |
| **Artesanales** | | |
| `acuarela` | Manchas de acuarela en el fondo y tras los títulos, foto con bordes difuminados, tarjetas de formas orgánicas | `cielo` + `pincel` |
| `kraft` | Papel de estraza, secciones como etiquetas con ojal, títulos como sellos, foto con cinta, regalo como entrada con muescas | `kraft` + `rotulador` |
| `bordado` | Textura de lino, bandas de punto de cruz, foto en bastidor, puntadas en bordes y separadores | `lino` + `lapiz` |
| `cuaderno` | Hoja de libreta con renglones y margen, títulos con fosforito, pósits, foto pegada con cinta washi | `anil` + `cuaderno` |
| `serigrafia` | Impresión riso: tintas desajustadas, trama de puntos, foto en dos tintas, sombras planas | `riso` + `grabado` |
| `puntilla` | Festones de encaje en tarjetas, foto con borde de blonda, separadores de puntos y corazón | `rosa` + `pluma` |
| **Papelería** | | |
| `invitacion` | Como una tarjeta de invitación: montañas y pinos a plumilla en la portada, nombres en mayúsculas espaciadas, fecha entre filetes, horarios con la hora a la izquierda y línea vertical, regalo y botones sin relleno | `marfil` + `elegante` |

Los estilos `dibujado`, `postal`, `botanico`, `verbena`, `acuarela`, `kraft`, `bordado`, `cuaderno` y `puntilla` sustituyen el índice por un menú desplegable con iconos.

### Paletas

| `tema` | | `tema` | |
|---|---|---|---|
| `salvia` | Verde salvia y latón | `cielo` | Azulado |
| `terracota` | Amarronado, crema y barro | `cantabrico` | Azul marino y arena |
| `mostaza` | Amarillento | `mediterraneo` | Blanco cal y cobalto |
| `mandarina` | Anaranjado | `menta` | Verde agua |
| `rojizo` | Teja y granate | `arena` | Papel envejecido, tinta de sello |
| `burdeos` | Vino y rosa | `editorial` | Blanco, negro y oliva |
| `rosa` | Rosa empolvado | `noche` | Oscuro, verde y oro |
| `lavanda` | Violeta suave | `medianoche` | Oscuro, azul noche y oro |
| `kraft` | Papel de estraza y sello rojo | `anil` | Tinta de pluma azul |
| `lino` | Tela cruda e hilo de óxido | `riso` | Rosa flúor y azul de imprenta |
| `campina1` | Crema y verde bosque, detalles en óxido | `campina2` | Crema, líneas de barro y bloque en óxido |
| `campina3` | Fondo salvia y tarjetas de trigo | `campina4` | Fondo casi blanco y tarjetas de trigo |
| `prado1` | Blanco roto y salvia | `prado2` | Lino y oliva |
| `prado3` | Beige y verde bosque | `prado4` | Blanco roto y eucalipto |
| `marfil` | Marfil `#f6f3ea`, salvia `#8f9f88` y verde bosque `#4e5f3f` | | |

Las cuatro `campina` usan los mismos cinco colores (`#a0520e`, `#c97c5d`, `#ead2ac`, `#c0caad`, `#3e5641`) repartidos de forma distinta.

### Tipografías

| `tipo` | Fuentes |
|---|---|
| `instrument` | Instrument Serif + Instrument Sans |
| `clasica` | Cormorant Garamond + EB Garamond |
| `elegante` | Cormorant Garamond (nombres y títulos) + DM Sans (texto) |
| `suave` | Fraunces + Figtree |
| `editorial` | Bodoni Moda + Jost |
| `caligrafia` | Pinyon Script (nombres) + Cormorant + Figtree |
| `mano` | Caveat Brush (nombres) + Amatic SC (títulos) + Patrick Hand (texto) |
| `maquina` | Special Elite + Courier Prime |
| `deco` | Poiret One + Josefin Sans |
| `grotesca` | Syne + Space Grotesk |
| `redonda` | Fredoka + Nunito |
| **Artesanales** | |
| `cuaderno` | Caveat + Kalam (bolígrafo) |
| `rotulador` | Permanent Marker + Architects Daughter |
| `pincel` | Kaushan Script + Delius |
| `lapiz` | Reenie Beanie + Indie Flower |
| `pluma` | Sacramento + Kalam (caligrafía a plumilla) |
| `grabado` | Londrina Solid + Mali (imprenta tallada) |

Las fuentes solo se descargan si la combinación elegida las usa, así que tenerlas todas no hace la web más lenta.

### Crear una paleta, tipografía o estilo nuevo

- **Paleta:** copia un bloque `html[data-tema="..."]` de `paletas.css`, cambia el nombre y los colores, y añade su `<option>` en `<select id="probador-tema">` de `src/components/Probador.astro`.
- **Tipografía:** añade los `@font-face` y un bloque `html[data-tipo="..."]` en `tipografias.css`, los `.woff2` en `public/fonts/`, la licencia en `licencias/` y su `<option>` en el probador.
- **Estilo:** añade un bloque `html[data-estilo="..."]` en `estilos.css` y su `<option>` en `<select id="probador-estilo">`, con `data-tema` y `data-tipo` recomendados.

### Ilustración de portada

El estilo `dibujado` luce más con una ilustración tipo acuarela del lugar que con una foto. Funde la parte superior de la imagen con el fondo, así que conviene que tenga cielo o fondo claro arriba. Guárdala como `public/img/portada.jpg` y límpiale los metadatos (sección 8).

---

## 6. Añadir páginas

Cada archivo de `src/pages/` es una página: `src/pages/nosotros.astro` se publica en `/nosotros/`. Puedes partir de `gracias.astro`:

```astro
---
import Base from "../layouts/Base.astro";
import Cabecera from "../components/Cabecera.astro";
---
<Base titulo="Nosotros">
  <Cabecera />
  <main>
    <section class="seccion" id="nosotros" aria-labelledby="nosotros-titulo">
      <span class="icono seccion__icono" data-icono="flor" aria-hidden="true"></span>
      <h1 class="seccion__titulo" id="nosotros-titulo">Nosotros</h1>
      <p class="seccion__intro">…</p>
      <div class="seccion__contenido">
        …
      </div>
    </section>
  </main>
</Base>
```

Para que aparezca en el menú y en el índice de la portada, añádela a `navegacion` en `src/config.js`:

```js
{ ruta: "/nosotros/", texto: "Nosotros", icono: "flor" }
```

Usa las mismas clases (`seccion`, `seccion__titulo`, `seccion__intro`…) para que los estilos la decoren sin tocar el CSS. Mete la información concreta (todo lo que va después del párrafo de introducción) dentro de `<div class="seccion__contenido">`: es lo que los estilos de tarjetas encierran en la tarjeta. Nada de `style=""`, `<style>` ni `<script>` en las páginas.

---

## 7. El formulario de confirmación

Está en `src/pages/confirmar.astro` y se publica en `/confirmar/`. Se enlaza desde el botón «Confirmar asistencia» de la portada y desde el menú.

### Cómo funciona

1. El `<form>` lleva `data-netlify="true"` y `name="confirmacion"`.
2. Al desplegar, Netlify lee el HTML, detecta el formulario y crea en su panel un formulario llamado **confirmacion**.
3. Cuando un invitado pulsa «Enviar», el navegador hace un POST normal a la propia web. Netlify guarda la respuesta y muestra `/gracias/`.

No se carga ningún script de Netlify ni de terceros. El envío funciona aunque el navegador tenga JavaScript desactivado.

### Campos (cada `name` es una columna del Excel)

| Columna | Pregunta | Obligatorio |
|---|---|---|
| `nombre` | Nombre y apellidos | Sí |
| `asistencia` | ¿Vendrás? (Sí / No) | Sí |
| `acompanantes` | ¿Cuántas personas venís contigo? (0–10) | No |
| `nombres_acompanantes` | Nombres de tus acompañantes | No |
| `autobus_ida` | Autobús de ida (Sí / No) | No |
| `autobus_vuelta` | Autobús de vuelta (23:00 / 02:00 / No) | No |
| `alimentacion` | ¿Alguna restricción en la comida? | No |
| `mensaje` | ¿Quieres decirnos algo? | No |

Si alguien marca «No podré ir», el JavaScript oculta y desactiva el bloque «Si vienes», así que esos campos llegan vacíos.

### Cambiar preguntas

Edita `confirmar.astro` y vuelve a desplegar. Netlify añade las columnas nuevas automáticamente. Ten en cuenta que:

- Cada campo necesita un `name` único, sin espacios ni tildes (`autobus_ida`, no `Autobús ida`).
- No pidas datos que no necesitéis: ni dirección, ni teléfono, ni DNI, ni datos de salud detallados. «Sin gluten» basta; no hace falta el diagnóstico.
- Si cambias el `name` del formulario, Netlify crea un formulario nuevo y las respuestas antiguas quedan en el anterior.

### Anti-spam

- **Honeypot:** el campo invisible `sitio-web` (atributo `netlify-honeypot`). Las personas no lo ven; los robots lo rellenan y Netlify descarta el envío.
- **Akismet:** Netlify pasa además cada envío por el filtro de spam Akismet (servicio de Automattic). No se puede desactivar. Los envíos marcados como spam van a una pestaña aparte del panel; revísala de vez en cuando por si se cuela alguno real.
- No se usa reCAPTCHA, porque cargaría scripts de Google.

### Privacidad del formulario

- Las respuestas se guardan en los servidores de Netlify, en **EE. UU.**
- El formulario avisa: «Solo usaremos estos datos para organizar la boda y los borraremos después». Cumplidlo (sección 16).
- La CSP permite enviar formularios solo a la propia web (`form-action 'self'`).

---

## 8. Imágenes

`public/img/portada.jpg` es una ilustración provisional. Para usar fotos propias:

1. Guarda los originales **fuera del repositorio** (o en `originales/`, que está en `.gitignore`).
2. Redimensiona una copia (1800 px de ancho es suficiente) y guárdala en `public/img/`.
3. Elimina los metadatos (en Git Bash):

   ```bash
   ./scripts/limpiar-imagenes.sh
   # equivale a:
   exiftool -all= -overwrite_original public/img/*.jpg
   ```

4. Comprueba que no queda nada:

   ```bash
   exiftool -a -G1 -gps:all -exif:all -xmp:all -iptc:all public/img/*
   ```

   No debe aparecer GPS, modelo de cámara, fechas de captura ni software.

5. (Recomendado) Instala el hook que impide subir imágenes con metadatos por descuido:

   ```bash
   cp scripts/pre-commit .git/hooks/pre-commit
   chmod +x .git/hooks/pre-commit
   ```

Evita también que la propia foto delate información: matrículas, portales con número, carteles de calle o reflejos.

---

## 9. GitHub (repositorio privado)

### 9.1 Identidad

- En GitHub → Settings → Emails:
  - Activa **Keep my email addresses private**.
  - Activa **Block command line pushes that expose my email**.
  - Copia tu dirección `ID+usuario@users.noreply.github.com`.

### 9.2 Configurar git solo para este repositorio

```bash
git config user.name "boda"
git config user.email "ID+usuario@users.noreply.github.com"
```

Sin `--global`, el cambio no afecta a otros proyectos.

### 9.3 Subir cambios

```bash
git add .
git commit -m "Describe el cambio"
git push
```

`node_modules/`, `dist/` y `.astro/` están en `.gitignore`: no se suben, porque Netlify los genera en cada despliegue.

---

## 10. Desplegar en Netlify

### Opción A: conectado a GitHub (recomendada)

Cada `git push` publica la web automáticamente.

1. Crea una cuenta en https://app.netlify.com con un **correo secundario**. Puedes entrar con GitHub, pero entonces Netlify verá tu cuenta de GitHub.
2. **Add new project → Import an existing project → GitHub**.
3. Al autorizar la app de Netlify en GitHub, elige **Only select repositories** y marca solo este repositorio.
4. Configuración del build. Se rellena sola a partir de `netlify.toml`; comprueba que coincide:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Branch to deploy: `main`
5. **Deploy**.
6. **Project configuration → General → Project details → Change project name**: pon un nombre neutro. La web quedará en `NOMBRE.netlify.app`.

### Opción B: desde tu equipo (sin conectar GitHub)

```powershell
npm run build
npx netlify-cli login
npx netlify-cli deploy --dir dist            # crea una vista previa para revisar
npx netlify-cli deploy --dir dist --prod     # publica
```

La primera vez te preguntará si quieres crear un proyecto nuevo. Repite los dos últimos comandos cada vez que cambies algo.

### 10.1 Activar la detección de formularios (imprescindible)

**Project configuration → Forms → Enable form detection.**

Sin este paso Netlify no detecta el formulario y los envíos se pierden. Después de activarlo, **vuelve a desplegar**: Deploys → Trigger deploy → Deploy project. A partir de ahí aparecerá «confirmacion» en la pestaña **Forms**.

### 10.2 Ajustes recomendados

- **Project configuration → Forms → Form notifications → Add notification → Email notification**: un email a vuestra dirección con cada respuesta. Es opcional.
- **Project configuration → Build & deploy → Branches and deploy contexts**: con *Deploy previews* activados, cada Pull Request crea una copia pública de la web. Si no los usáis, pon *Branch deploys* en **None**.
- No actives Netlify Analytics ni añadas *Snippet injection* (scripts que Netlify inyecta en el HTML).
- La protección de la web con contraseña es de pago en Netlify. Con la web abierta, recuerda que el IBAN lo ve cualquiera que tenga el enlace.

### 10.3 Límites del plan gratuito

Desde abril de 2026, los envíos de formularios son gratuitos en los planes por créditos y no consumen créditos. El plan Free tiene 300 créditos al mes para despliegues y tráfico, de sobra para una web así. Si se agotan, Netlify **pausa la web** hasta el mes siguiente y mientras tanto no recibe envíos. Puedes revisar el consumo en Team → Usage & billing.

### 10.4 Probar el formulario publicado

1. Abre `https://NOMBRE.netlify.app/confirmar/` y envía una respuesta de prueba.
2. Debe aparecer la página «¡Gracias!».
3. En Netlify → **Forms → confirmacion**, la respuesta debe aparecer en la lista.
4. Bórrala antes de mandar la web a los invitados.

---

## 11. Ver las respuestas y sacar el Excel

### Ver y gestionar

Netlify → tu proyecto → **Forms → confirmacion**:

- **Verified submissions:** las respuestas válidas, la más reciente primero. Al pulsar una se ven todos sus campos.
- **Spam submissions:** las descartadas por el honeypot o por Akismet. Si una es real, márcala como *Not spam*.
- Cada respuesta se puede **borrar** individualmente.

Si alguien envía el formulario dos veces, aparecen dos filas; quedaos con la última, como se indica en la página de «¡Gracias!».

### Descargar en CSV

En **Forms → confirmacion**, pulsa **Download as CSV**. Descarga todas las respuestas válidas, con una columna por campo y la fecha de envío.

### Abrir el CSV en Excel sin estropear tildes ni columnas

En Excel en español, al hacer doble clic en el CSV a veces todo cae en una sola columna o las tildes salen mal («SÃ­»). Para evitarlo, impórtalo así:

1. Abre Excel con un libro en blanco.
2. **Datos → Obtener datos → De archivo → Desde texto/CSV** y elige el archivo.
3. **Origen del archivo: 65001: Unicode (UTF-8)**. **Delimitador: Coma**.
4. **Cargar**. Si quieres, guárdalo después como `.xlsx`.

Ideas para organizarlo:

- Filtra `asistencia` = «Sí» y suma `acompanantes` + el número de filas: es el total de invitados confirmados.
- Filtra `autobus_ida` y `autobus_vuelta` para saber cuántas plazas reservar en cada autobús.
- Usa una tabla dinámica (Insertar → Tabla dinámica) para obtener recuentos por opción.

Guardad los Excel en un sitio privado y borradlos después de la boda, igual que las respuestas de Netlify.

---

## 12. Comprar un dominio en Cloudflare y conectarlo

La web sigue alojada en Netlify; Cloudflare solo vende el dominio y gestiona sus DNS. Es buena combinación: Cloudflare cobra el dominio a precio de coste y oculta el WHOIS por defecto.

### 12.1 Elegir el nombre

- **Neutro:** sin nombres, apellidos, fechas reconocibles ni empresa. Por ejemplo, `olmos-abril.com`, `lafinca-info.com` o dos palabras al azar.
- El nombre **no es secreto**: al emitir el certificado HTTPS, el dominio aparece en los registros públicos de *Certificate Transparency*. Por eso importa que sea neutro.
- Para la cuenta de Cloudflare, usa el correo secundario.

### 12.2 Comprarlo

1. Crea una cuenta en https://dash.cloudflare.com.
2. **Domain Registration → Register Domains**. Busca el nombre y cómpralo. `.com` o `.net` son opciones seguras.
3. Los datos de contacto que pide la ICANN son obligatorios, pero Cloudflare los **oculta en el WHOIS** por defecto. Compruébalo en Domain Registration → Manage → Contacts.
4. El dominio queda en tu cuenta con los DNS de Cloudflare ya configurados. Con Cloudflare Registrar no se pueden cambiar los servidores DNS, pero no hace falta.

### 12.3 Añadir el dominio en Netlify

1. Netlify → tu proyecto → **Domain management → Add a domain → Add a domain you already own**.
2. Escribe `tudominio.com` y confirma. Netlify añade también `www.tudominio.com`.
3. Cuando ofrezca **Netlify DNS**, **no** lo actives: los DNS se quedan en Cloudflare. Netlify mostrará «Awaiting External DNS» y los registros que hay que crear.

### 12.4 Crear los registros DNS en Cloudflare

Cloudflare → tu dominio → **DNS → Records → Add record**:

| Tipo | Nombre | Destino | Proxy |
|---|---|---|---|
| `CNAME` | `@` | `apex-loadbalancer.netlify.com` | **DNS only** (nube gris) |
| `CNAME` | `www` | `NOMBRE.netlify.app` | **DNS only** (nube gris) |

- Netlify también acepta, para `@`, un registro `A` a `75.2.60.5`. Usa lo que te indique Netlify en el paso anterior si es distinto.
- La nube **gris** (*DNS only*) es importante. Con la nube naranja, Cloudflare se pone en medio, Netlify no puede emitir el certificado y pueden aparecer errores de redirección.
- Borra cualquier registro `A`, `AAAA` o `CNAME` previo para `@` o `www` que entre en conflicto.

### 12.5 HTTPS

1. Netlify → **Domain management → HTTPS → Verify DNS configuration**. Tarda de unos minutos a unas horas.
2. Cuando los DNS estén verificados, Netlify emite un certificado Let's Encrypt automáticamente.
3. Marca `tudominio.com` como **Primary domain**. `www` y `NOMBRE.netlify.app` redirigirán a él.

`_headers` ya envía `Strict-Transport-Security`, así que los navegadores usarán siempre HTTPS.

### 12.6 Ajustes del dominio en Cloudflare

- **Web Analytics**: desactivado para este dominio.
- Si en algún momento activas el proxy (nube naranja), revisa también la sección 13.4.

---

## 13. Más adelante: pasar a Cloudflare Pages

Si algún día preferís alojar la web en Cloudflare (por ejemplo, para usar Cloudflare Access gratis y restringir el acceso a los invitados), el código sirve tal cual. Lo único que no se puede llevar es **Netlify Forms**.

### 13.1 Antes de mudarte: el formulario

Netlify Forms solo funciona en Netlify. Hay dos opciones:

- **Mudarse después de cerrar las confirmaciones:** descargad el CSV final de Netlify y luego quitad la página `/confirmar/` (y su entrada en `navegacion`).
- **Sustituirlo por algo propio en Cloudflare:** una Pages Function (`functions/api/rsvp.js`) que guarda en una base de datos D1 (con ubicación en la UE) y una página `/admin` protegida con Cloudflare Access para ver las respuestas y descargar el CSV. Hay que programarlo, pero los datos quedan en la UE y sin Akismet.

### 13.2 Crear el proyecto en Cloudflare Pages

1. Dashboard → **Workers & Pages → Create → Pages → Connect to Git** y elige solo este repositorio.
2. Configuración del build:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Variables de entorno: `NODE_VERSION` = `24` y `ASTRO_TELEMETRY_DISABLED` = `1`
3. Deploy. `public/_headers` se aplica igual en Cloudflare.

Alternativa sin conectar GitHub:

```powershell
npm run build
npx wrangler pages deploy dist --project-name NOMBRE
```

### 13.3 Mover el dominio

1. Netlify → Domain management: quita el dominio del proyecto.
2. Cloudflare → DNS: borra los dos registros que apuntaban a Netlify.
3. Proyecto de Pages → **Custom domains → Set up a custom domain** → `tudominio.com` y `www.tudominio.com`. Cloudflare crea los registros y el certificado.
4. Cuando todo funcione, borra el proyecto de Netlify.

### 13.4 Ajustes de seguridad del dominio (con proxy de Cloudflare)

- **SSL/TLS → Overview**: modo **Full (strict)**.
- **SSL/TLS → Edge Certificates**: *Always Use HTTPS* activado, *Minimum TLS Version* 1.2.
- **Scrape Shield → Email Address Obfuscation**: desactivado, porque inyecta un script.
- **Speed → Optimization → Rocket Loader**: desactivado.
- **Web Analytics**: desactivado.

### 13.5 Cloudflare Access (opcional, para restringir la web)

Con la web en Cloudflare Pages podéis exigir que cada invitado entre con un código que recibe por email. Es gratis hasta 50 usuarios.

1. Dashboard → **Zero Trust** → plan **Free**. Elige un *team name* neutro: aparece en la URL de inicio de sesión.
2. Settings → Authentication → Login methods → **One-time PIN**.
3. Access → Applications → **Add an application → Self-hosted**:
   - Dominio: `tudominio.com` y `www.tudominio.com`.
   - Session duration: por ejemplo **1 month**.
   - Política **Allow** → Include → **Emails** (o una lista en My Team → Lists) con los correos de los invitados.
4. Protege también `NOMBRE.pages.dev`: en el proyecto de Pages, Settings → General → **Access policy** → Enable, y añade `NOMBRE.pages.dev` a la aplicación de Access.

Cada persona ocupa un asiento la primera vez que entra. Si hay más de 50, pedid un email por pareja o familia.

---

## 14. Medidas de privacidad

| Medida | Dónde |
|---|---|
| No indexar | `public/robots.txt` (`Disallow: /`), `<meta name="robots">` en `Base.astro`, cabecera `X-Robots-Tag` en `_headers` |
| Sin analítica ni seguimiento | No hay scripts de terceros, y la CSP bloquearía cualquiera |
| Sin dependencias externas | Fuentes en `public/fonts/`, sin CDN, sin Google Fonts, sin YouTube |
| No filtrar la URL al salir | `Referrer-Policy: no-referrer` y `rel="noreferrer"` en los enlaces |
| No incrustable | `X-Frame-Options: DENY` y `frame-ancestors 'none'` |
| Formularios solo hacia la propia web | `form-action 'self'` en la CSP |
| Sin caché en proxies ajenos | `Cache-Control: private, no-store` en las páginas |
| `404.html` propia | Evita que cualquier ruta devuelva la portada |
| Sin estructura interna expuesta | Solo se publica `dist/`, sin comentarios HTML en la salida |
| Sin metadatos en imágenes | `scripts/limpiar-imagenes.sh` + hook `pre-commit` |
| Telemetría de Astro desactivada | `npx astro telemetry disable` en local y `ASTRO_TELEMETRY_DISABLED` en `netlify.toml` |
| Formulario con datos mínimos | Sin dirección, teléfono ni datos de salud detallados; aviso de borrado |
| **Dónde están los datos del formulario** | En Netlify (EE. UU.), con filtro Akismet. Se borran después de la boda |

---

## 15. Comprobaciones tras publicar

```powershell
# Debe incluir X-Robots-Tag, Content-Security-Policy y Referrer-Policy
curl.exe -sI https://tudominio.com
```

En una ventana de incógnito:

- [ ] `https://tudominio.com/README.md` y `https://tudominio.com/src/config.js` dan 404.
- [ ] `https://tudominio.com/robots.txt` muestra `Disallow: /`.
- [ ] Sin `?estilos` no aparece el panel de estilos.
- [ ] El formulario se envía, muestra «¡Gracias!» y la respuesta aparece en Netlify → Forms.
- [ ] Al marcar «No podré ir», el bloque «Si vienes» desaparece.
- [ ] En las herramientas de desarrollo (F12 → pestaña Red), todas las peticiones van a tu dominio. Ninguna a Google, Facebook, CDN, etc.
- [ ] En la consola no hay errores de CSP.
- [ ] Descarga una imagen de la web y pásale `exiftool`: no debe tener metadatos.

---

## 16. Mantenimiento y después de la boda

- **Cada cambio:** editar → `npm run dev` para verlo → `./scripts/limpiar-imagenes.sh` si hay fotos nuevas → `npm run build` → `git commit` → `git push`. Netlify publica solo.
- **Actualizar Astro** de vez en cuando: `npm install astro@latest`, comprobar con `npm run build` y revisar la web.
- **Copia de seguridad:** el repositorio de GitHub es la copia principal. Además:

  ```bash
  git bundle create ../web-evento-$(date +%F).bundle --all
  ```

### Después de la boda

1. Descarga el CSV final si aún lo necesitáis.
2. Netlify → Forms → confirmacion → **borra todas las respuestas** (o el formulario entero desde Forms → *Options → Delete form*).
3. Borra los Excel y CSV que hayáis guardado.
4. Quita el dominio del proyecto de Netlify y borra el proyecto.
5. Deja caducar el dominio en Cloudflare (desactiva la renovación automática).
6. Archiva o borra el repositorio.

---

## 17. Checklist de privacidad

**Identidad**
- [ ] Dominio sin nombre, apellidos ni empresa
- [ ] Correo secundario para Netlify y Cloudflare
- [ ] Sin teléfonos ni direcciones personales en la web
- [ ] Usuario de GitHub, proyecto de Netlify y (si lo hay) team de Zero Trust con nombres neutros
- [ ] La web no se enlaza desde LinkedIn, Instagram, Facebook ni X

**Dominio**
- [ ] Privacidad WHOIS activada (por defecto en Cloudflare Registrar)
- [ ] Registros DNS hacia Netlify en modo *DNS only*

**Buscadores**
- [ ] `robots.txt` con `Disallow: /`
- [ ] `<meta name="robots" content="noindex, nofollow, noarchive">` en todas las páginas (lo pone `Base.astro`)
- [ ] Sin Google Search Console, sin `sitemap.xml`, sin solicitudes de indexación

**Seguimiento y dependencias**
- [ ] Sin Google Analytics, Tag Manager, Pixel, Clarity, Netlify Analytics ni Cloudflare Web Analytics
- [ ] Sin *Snippet injection* en Netlify
- [ ] Telemetría de Astro desactivada

**Formulario**
- [ ] Detección de formularios activada en Netlify y probada
- [ ] Solo los datos imprescindibles
- [ ] Respuestas y Excel borrados después de la boda

**Imágenes**
- [ ] Metadatos eliminados y comprobados
- [ ] Originales fuera del repositorio

**GitHub**
- [ ] Repositorio privado
- [ ] Email `noreply` en los commits

---

Fuentes tipográficas: todas con licencia libre para uso web (SIL Open Font License 1.1, salvo Special Elite y Permanent Marker, con licencia Apache 2.0). Ver `licencias/`.

# Web de la boda (privada)

Web estática con la información para los invitados. Sin backend, sin analítica, sin cookies y sin dependencias externas.

```
Repositorio GitHub privado → Cloudflare Pages → Dominio propio → Invitados
                                   (opcional: Cloudflare Access)
```

**Estado actual: web abierta.** Cualquiera que tenga el enlace puede verla; no aparece en buscadores. Si más adelante quieres restringir el acceso, la sección 8 explica cómo activar Cloudflare Access sin tocar el código.

---

## 1. Estructura

```
.
├── README.md                 ← este documento (NO se publica)
├── .gitignore
├── licencias/                ← licencias OFL de las fuentes (NO se publica)
├── scripts/
│   ├── limpiar-imagenes.sh   ← borra metadatos de public/img
│   └── pre-commit            ← hook que bloquea commits de imágenes con metadatos
└── public/                   ← ÚNICA carpeta que se publica
    ├── index.html            ← solo HTML
    ├── 404.html
    ├── robots.txt
    ├── _headers              ← cabeceras de seguridad para Cloudflare Pages
    ├── css/paletas.css       ← paletas de color
    ├── css/tipografias.css   ← fuentes y combinaciones tipográficas
    ├── css/style.css         ← maquetación base
    ├── css/estilos.css       ← estilos de diseño (decoración y composición)
    ├── js/script.js          ← todo el JavaScript
    ├── fonts/                ← fuentes alojadas localmente (sin Google Fonts)
    └── img/
        └── iconos/           ← dibujos de línea en SVG (iconos y adornos)
```

Todo lo publicado vive dentro de `public/`. Así el README, los scripts y el `.gitignore` nunca quedan accesibles en la web.

No hay CSS ni JS en línea en el HTML: esto permite una Content-Security-Policy estricta (`script-src 'self'; style-src 'self'`) que bloquea cualquier script o estilo que no sea vuestro.

---

## 2. Personalizar el contenido

Todo el texto está en `public/index.html`. Cambia:

- Nombres (en `<title>`, portada y pie). Recomendación: solo nombres de pila, sin apellidos.
- Fecha: el texto visible y el atributo `data-fecha="AAAA-MM-DDTHH:MM:SS"` (lo usa la cuenta atrás).
- Lugares, horarios, paradas, contactos e IBAN.
- Los enlaces a mapas usan OpenStreetMap (`https://www.openstreetmap.org/search?query=...`) en lugar de Google Maps. Son enlaces normales: no se carga nada de terceros hasta que alguien hace clic, y se abren con `rel="noopener noreferrer"`.

Direcciones: publica solo las de lugares públicos (iglesia, finca, paradas). Nunca domicilios particulares.

---

## 2 bis. Estilos, paletas y tipografías

La apariencia se controla con tres atributos independientes en la etiqueta `<html>` de `index.html` (y de `404.html`):

```html
<html lang="es" data-estilo="sereno" data-tema="salvia" data-tipo="instrument">
```

- **Estilo** (`data-estilo`, en `css/estilos.css`): composición y decoración.
- **Paleta** (`data-tema`, en `css/paletas.css`): colores.
- **Tipografía** (`data-tipo`, en `css/tipografias.css`): fuentes.

Se combinan libremente: 14 estilos × 20 paletas × 16 tipografías.

### Estilos

| `data-estilo` | Descripción | Recomendado con |
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
| `kraft` | Fondo de papel de estraza, secciones como etiquetas con ojal, títulos como sellos, foto con cinta, regalo como entrada con muescas | `kraft` + `rotulador` |
| `bordado` | Textura de lino, bandas de punto de cruz, foto en bastidor de bordar, puntadas en bordes y separadores | `lino` + `lapiz` |
| `cuaderno` | Hoja de libreta con renglones y margen, títulos subrayados con fosforito, pósits, foto pegada con cinta washi | `anil` + `cuaderno` |
| `serigrafia` | Impresión riso: tintas desajustadas, trama de puntos, foto en dos tintas, sombras planas | `riso` + `grabado` |
| `puntilla` | Festones de encaje en tarjetas, foto con borde de blonda, separadores de puntos y corazón | `rosa` + `pluma` |

Los estilos `dibujado`, `postal`, `botanico`, `verbena`, `acuarela`, `kraft`, `bordado`, `cuaderno` y `puntilla` sustituyen el índice por un menú desplegable con iconos.

Algunos estilos usan `color-mix()` de CSS para las transparencias; funciona en todos los navegadores actuales.

### Paletas

| `data-tema` | | `data-tema` | |
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

### Tipografías

| `data-tipo` | Fuentes |
|---|---|
| `instrument` | Instrument Serif + Instrument Sans |
| `clasica` | Cormorant Garamond + EB Garamond |
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

### Probar al vuelo

Abre la web con `?estilos` al final de la URL:

```
http://localhost:8000/?estilos
```

Aparece un panel abajo a la derecha para:

- Cambiar estilo, paleta y tipografía en directo. Al cambiar de estilo se aplican su paleta y tipografía recomendadas (desmarca la casilla para mantener las tuyas).
- Probar una combinación al azar.
- Copiar la etiqueta `<html>` lista para pegar.
- Plegar el panel para ver la página entera.

En los desplegables, los estilos y tipografías artesanales aparecen agrupados al principio.

La URL se actualiza con la combinación (`?estilos&estilo=postal&tema=arena&tipo=maquina`), así que puedes enviársela a tu pareja para que la vea igual.

Sin `?estilos` el panel no aparece. Cuando decidáis, pega la etiqueta en `index.html` y `404.html`; si quieres, borra también el bloque `<aside class="probador">`.

### Ilustración de portada

El estilo `dibujado` luce más con una ilustración tipo acuarela del lugar (como la web de referencia) que con una foto. Funde la parte superior de la imagen con el fondo, así que conviene que tenga cielo o fondo claro arriba. Guárdala como `public/img/portada.jpg` y límpiale los metadatos (sección 3).

### Crear una paleta o un estilo nuevo

- Paleta: copia un bloque `html[data-tema="..."]` de `paletas.css`, cambia nombre y colores, y añade su `<option>` en `<select id="probador-tema">`.
- Estilo: añade un bloque `html[data-estilo="..."]` en `estilos.css` y su `<option>` en `<select id="probador-estilo">` (con `data-tema` y `data-tipo` recomendados).

---

## 3. Imágenes

`public/img/portada.jpg` es una ilustración provisional. Para usar fotos propias:

1. Guarda los originales **fuera del repositorio** (o en `originales/`, que está en `.gitignore`).
2. Redimensiona una copia (1800 px de ancho es suficiente) y guárdala en `public/img/`.
3. Elimina los metadatos:

   ```bash
   ./scripts/limpiar-imagenes.sh
   # equivale a:
   exiftool -all= -overwrite_original public/img/*.jpg
   # o con ImageMagick:
   mogrify -strip public/img/*.jpg
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

Evita también que la propia foto delate información: matrículas, portales con número, carteles de calle, reflejos.

---

## 4. Probar en local

```bash
cd public
python3 -m http.server 8000
# abrir http://localhost:8000
```

Para probar también las cabeceras de `_headers` tal y como las aplica Cloudflare:

```bash
npx wrangler pages dev public
```

---

## 5. GitHub (repositorio privado)

### 5.1 Identidad

- Usa una cuenta de GitHub que no reutilice tu nombre de usuario de otros servicios (o tu cuenta habitual si no te importa que GitHub sepa que existe; el repo será privado).
- En GitHub → Settings → Emails:
  - Activa **Keep my email addresses private**.
  - Activa **Block command line pushes that expose my email**.
  - Copia tu dirección `ID+usuario@users.noreply.github.com`.

### 5.2 Configurar git solo para este repositorio

```bash
cd boda-web
git init
git config user.name "boda"
git config user.email "ID+usuario@users.noreply.github.com"
cp scripts/pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
git add .
git commit -m "Primera versión"
```

(Sin `--global`: no cambia tu configuración para otros proyectos.)

### 5.3 Crear el repositorio

1. GitHub → New repository → nombre neutro (p. ej. `web-evento`) → **Private** → sin README.
2. Sube el código:

   ```bash
   git branch -M main
   git remote add origin git@github.com:USUARIO/web-evento.git
   git push -u origin main
   ```

---

## 6. Dominio

1. Elige un dominio **neutro**: sin nombres, apellidos, fechas reconocibles ni empresa. Ejemplos del estilo: `olmos-abril.com`, `lafinca-info.com`, dos palabras al azar.
2. Lo más sencillo es comprarlo en **Cloudflare Registrar** (Dashboard → Domain Registration → Register Domains): precio de coste, DNS ya en Cloudflare y **redacción WHOIS activada por defecto**.
   - Si lo compras en otro registrador, activa la privacidad WHOIS y cambia los servidores DNS a los de Cloudflare.
   - Evita extensiones que publiquen datos del titular o exijan identificarte públicamente; `.com`/`.net` con Cloudflare Registrar son una opción segura.
3. Usa un correo secundario (no el principal) para la cuenta de Cloudflare y del dominio.

Ten en cuenta: al emitir un certificado HTTPS, el nombre del dominio aparece en los registros públicos de *Certificate Transparency*. El dominio no es secreto (y con la web abierta, cualquiera que lo descubra puede verla). Por eso importa que el nombre sea neutro.

---

## 7. Cloudflare Pages

### Opción A: conectado a GitHub (recomendada)

1. Cloudflare Dashboard → **Workers & Pages** → Create → **Pages** → **Connect to Git**.
2. Al autorizar la app de Cloudflare en GitHub, elige **Only select repositories** y marca solo este repositorio.
3. Configuración del build:
   - Framework preset: **None**
   - Build command: *(vacío)*
   - Build output directory: **`public`**
   - Production branch: `main`
4. Nombre del proyecto: neutro (acabará en `NOMBRE.pages.dev`).
5. Deploy.

### Opción B: subida directa (sin conectar GitHub a Cloudflare)

```bash
npx wrangler login
npx wrangler pages project create web-evento --production-branch main
npx wrangler pages deploy public --project-name web-evento
```

Repite el último comando cada vez que cambies algo. Cloudflare no tiene acceso a tu GitHub.

### 7.1 Ajustes del proyecto

- Proyecto → **Metrics / Web Analytics**: asegúrate de que está **desactivado**.
- Proyecto → Settings: no añadas variables de entorno ni funciones; no hacen falta.

### 7.2 Dominio personalizado

Proyecto → **Custom domains** → Set up a custom domain → tu dominio (y `www` si lo quieres). Cloudflare crea el registro DNS y el certificado.

---

## 8. Cloudflare Access (opcional)

Ahora mismo la web está abierta y esta sección no es necesaria. Úsala si decides que solo entren invitados autorizados. No requiere cambiar nada del código.

Con la web abierta, ten en cuenta que el número de cuenta y los horarios los verá cualquiera que reciba el enlace. Si eso te preocupa, valora quitar el IBAN de la web y darlo por otro canal.

### 8.1 Activar Zero Trust

1. Dashboard → **Zero Trust**. Elige el plan **Free** (hasta 50 usuarios). Puede que pida un método de pago aunque el plan sea gratuito.
2. **Team name**: ponlo neutro. Aparece en la URL de inicio de sesión (`TEAM.cloudflareaccess.com`) que verán los invitados.

### 8.2 Método de inicio de sesión

Zero Trust → Settings → Authentication → Login methods → **One-time PIN**. El invitado escribe su email y recibe un código. No hace falta que tenga cuenta en ningún sitio.

### 8.3 Aplicación para el dominio propio

Zero Trust → Access → Applications → **Add an application** → **Self-hosted**:

- Application name: neutro.
- Domain: `tudominio.com` (añade también `www.tudominio.com` si lo usas).
- Session duration: por ejemplo **1 month**, para que los invitados no tengan que repetir el código cada vez.
- Identity providers: solo **One-time PIN**; activa *Instant Auth* si solo hay uno.
- Personaliza la página de login con un texto neutro (sin nombres).

Política (Policies → Add a policy):

- Action: **Allow**
- Include → **Emails** → la lista de correos de los invitados.
  - Si son muchos, crea antes una lista en Zero Trust → My Team → **Lists** (tipo Email) y usa *Include → Emails in list*. Así solo actualizas la lista.

No añadas ninguna política *Bypass*.

### 8.4 Proteger también `*.pages.dev`

Cloudflare Access sobre tu dominio **no protege** la dirección `NOMBRE.pages.dev`, que sigue siendo pública. Hay que cerrarla también:

1. Proyecto de Pages → Settings → General → **Access policy** → Enable. Esto protege las vistas previas (`*.NOMBRE.pages.dev`).
2. En Zero Trust → Access → Applications, edita la aplicación que se ha creado para esas vistas previas y **añade también el dominio `NOMBRE.pages.dev`** (sin subdominio), o crea otra aplicación Self-hosted para ese dominio con la misma política.

### 8.5 Límite de usuarios

El plan gratuito admite 50 usuarios. Cada persona ocupa un asiento la primera vez que inicia sesión. Si hay más de 50 invitados con email, opciones:

- Pedir un email por pareja o familia.
- Liberar asientos de quienes ya han entrado (Zero Trust → My Team → Users → Remove).
- Pasar temporalmente a un plan de pago.

### 8.6 Datos que recoge Access

Cloudflare registra qué email ha iniciado sesión y cuándo (Zero Trust → Logs → Access). Es lo mínimo necesario para la autenticación. No añadas nada más.

---

## 9. Ajustes de seguridad del dominio

En el dashboard del dominio:

- **SSL/TLS** → Overview → modo **Full (strict)**.
- **SSL/TLS** → Edge Certificates:
  - **Always Use HTTPS**: activado.
  - **Minimum TLS Version**: 1.2.
  - **HSTS**: activado (max-age 6 meses o más). `_headers` ya envía `Strict-Transport-Security`.
- **Scrape Shield** → **Email Address Obfuscation**: desactivado (inyecta un script que no hace falta).
- **Speed / Optimization** → **Rocket Loader**: desactivado.
- **Web Analytics**: desactivado para este dominio.

---

## 10. Qué hace cada medida de privacidad

| Medida | Dónde |
|---|---|
| No indexar | `robots.txt` (`Disallow: /`), `<meta name="robots">` en cada página, cabecera `X-Robots-Tag` en `_headers` |
| Sin analítica ni seguimiento | No hay scripts de terceros; la CSP bloquearía cualquiera |
| Sin dependencias externas | Fuentes en `public/fonts/`, sin CDN, sin Google Fonts, sin YouTube |
| No filtrar la URL al salir | `Referrer-Policy: no-referrer` y `rel="noreferrer"` en enlaces |
| No incrustable | `X-Frame-Options: DENY` y `frame-ancestors 'none'` |
| Sin caché en proxies ajenos | `Cache-Control: private, no-store` en las páginas |
| Sin listado de directorios | Cloudflare Pages no lista directorios; `404.html` propia evita que cualquier ruta devuelva la portada |
| Sin estructura interna expuesta | Solo se publica `public/` |
| Sin metadatos en imágenes | `scripts/limpiar-imagenes.sh` + hook `pre-commit` |
| Acceso restringido (opcional) | Cloudflare Access en el dominio y en `pages.dev` |

---

## 11. Comprobaciones tras publicar

```bash
# Debe incluir X-Robots-Tag, Content-Security-Policy y Referrer-Policy
curl -sI https://tudominio.com | head -n 20
```

En una ventana de incógnito:

- [ ] `https://tudominio.com/README.md` da 404.
- [ ] `https://tudominio.com/robots.txt` muestra `Disallow: /`.
- [ ] Sin `?estilos` no aparece el panel de estilos.
- [ ] Si has activado Access: `https://tudominio.com` y `https://NOMBRE.pages.dev` piden el código por email y un email que no está en la lista no entra.
- [ ] En las herramientas de desarrollo (pestaña Red), todas las peticiones van a tu dominio. Ninguna a Google, Facebook, CDN, etc.
- [ ] En la pestaña Red, la respuesta de `index.html` incluye `X-Robots-Tag` y `Content-Security-Policy`.
- [ ] En la consola no hay errores de CSP.
- [ ] Descarga una imagen desde la web y pásale `exiftool`: sin metadatos.

---

## 12. Mantenimiento y copias de seguridad

- Cada cambio: editar → `./scripts/limpiar-imagenes.sh` si hay fotos nuevas → `git commit` → `git push` (opción A) o `wrangler pages deploy public` (opción B).
- Copias de seguridad: el repositorio de GitHub es la copia principal. Además, guarda de vez en cuando una copia local:

  ```bash
  git bundle create ../web-evento-$(date +%F).bundle --all
  ```

- Si usas Access, revisa de vez en cuando la lista de invitados autorizados.

### Después de la boda

1. Quita el dominio personalizado del proyecto de Pages.
2. Borra el proyecto de Pages (y las aplicaciones de Access, si las creaste).
3. Deja caducar el dominio o elimínalo.
4. Archiva o borra el repositorio.

---

## 13. Checklist de privacidad

**Identidad**
- [ ] Dominio sin nombre, apellidos ni empresa
- [ ] Correo secundario para Cloudflare y el dominio
- [ ] Sin teléfonos ni direcciones personales en la web
- [ ] Nombre de usuario de GitHub, proyecto de Pages y team de Zero Trust neutros
- [ ] La web no se enlaza desde LinkedIn, Instagram, Facebook ni X

**Dominio**
- [ ] Privacidad WHOIS activada
- [ ] DNS gestionado en Cloudflare

**Buscadores**
- [ ] `robots.txt` con `Disallow: /`
- [ ] `<meta name="robots" content="noindex, nofollow, noarchive">` en todas las páginas
- [ ] Sin Google Search Console, sin `sitemap.xml`, sin solicitudes de indexación

**Seguimiento y dependencias**
- [ ] Sin Google Analytics, Tag Manager, Pixel, Clarity ni Cloudflare Web Analytics
- [ ] Fuentes y recursos alojados localmente

**Imágenes**
- [ ] Metadatos eliminados y comprobados
- [ ] Originales fuera del repositorio

**GitHub**
- [ ] Repositorio privado
- [ ] Email `noreply` en los commits

**Seguridad**
- [ ] HTTPS obligatorio y HSTS
- [ ] (Opcional) Access en el dominio, `www` y `pages.dev`
- [ ] Copias de seguridad

---

Fuentes: todas con licencia libre para uso web (SIL Open Font License 1.1, salvo Special Elite y Permanent Marker, con licencia Apache 2.0). Ver `licencias/`.

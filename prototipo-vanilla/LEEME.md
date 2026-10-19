# Global Frío — Frontend

Landing publicitaria en HTML, CSS y JavaScript, sin build ni framework.

**Importante:** desde que el HTML se separó por componente, este sitio
**ya no se abre con doble clic** — necesita servirse por http/https (ver
"Cómo verlo en tu máquina" más abajo). El resto (CSS, JS, imágenes) nunca
tuvo este problema; solo lo introduce el HTML incluido por `fetch()`.

## Estructura

Organizado igual que el frontend Angular de la orquesta: un módulo por
dominio, y dentro de cada módulo, sus propios `Models` / `Services` /
`Components` — y **todo componente tiene su `.html`, `.css` y `.js` juntos
en una carpeta**, sin excepción, tal como `cl-home.component.html/.css/.ts`
en la orquesta.

```
frontend/
├── index.html                                       Esqueleto: solo <head>, marcadores
│                                                     [data-gf-incluir] y los <script>/<link>
├── css/
│   ├── industry.css                                 Design system: .btn .card .blueprint .duotone
│   ├── theme.css                                    Variables de marca y ambientes claro / oscuro
│   └── main.css                                     Base compartida: reset, .gf-wrap, .gf-kicker,
│                                                     .gf-title, .gf-lede, botones — lo que usa
│                                                     más de un componente
├── js/
│   ├── namespace.js                                 Declara window.GF.{Models,Services,Components,Nucleo}
│   ├── nucleo/                                      Infraestructura compartida (no es un módulo de
│   │   ├── incluir.service.js                        negocio, como guards/ e interceptors/ en la orquesta)
│   │   └── enlazar.service.js
│   │
│   ├── Modulo-cabecera/Components/header/
│   │   ├── header.component.html
│   │   ├── header.component.css
│   │   └── header.component.js                       Aplica el teléfono/WhatsApp en su CTA
│   │
│   ├── Modulo-hero/Components/hero/
│   │   ├── hero.component.html
│   │   ├── hero.component.css
│   │   └── hero.component.js                         Aplica el claim y el enlace de WhatsApp
│   │
│   ├── Modulo-servicios/                            Sección 01 — Servicios
│   │   ├── Models/servicio.model.js
│   │   ├── Services/servicios.service.js            Las 4 tarjetas
│   │   └── Components/servicios/
│   │       ├── servicios.component.html             Cabecera de sección + grid vacío
│   │       ├── servicios.component.css
│   │       └── servicios.component.js                Pinta el grid desde ServiciosService
│   │
│   ├── Modulo-trabajos/                             Sección 02 — Trabajos
│   │   ├── Models/trabajo.model.js
│   │   ├── Services/trabajos.service.js             Fichas de la galería
│   │   └── Components/trabajos/
│   │       ├── trabajos.component.html
│   │       ├── trabajos.component.css
│   │       └── trabajos.component.js
│   │
│   ├── Modulo-mantenimiento/                        Sección 03 — Mantenimiento
│   │   ├── Models/item-mantenimiento.model.js
│   │   ├── Services/mantenimiento.service.js        Puntos del checklist
│   │   └── Components/mantenimiento/
│   │       ├── mantenimiento.component.html
│   │       ├── mantenimiento.component.css
│   │       └── mantenimiento.component.js
│   │
│   ├── Modulo-ubicacion/Components/ubicacion/       Sección 04 — Ubicación
│   │   ├── ubicacion.component.html
│   │   ├── ubicacion.component.css
│   │   └── ubicacion.component.js                    Aplica dirección, teléfono, mapa
│   │
│   ├── Modulo-pie/Components/footer/                Pie de página
│   │   ├── footer.component.html
│   │   ├── footer.component.css
│   │   └── footer.component.js                       Aplica dirección y arma la lista de redes
│   │
│   ├── Modulo-contacto/                             Teléfono, dirección, redes → enlaces derivados
│   │   ├── Models/red-social.model.js
│   │   ├── Services/config.service.js
│   │   └── Components/modal/                         Único componente propio: el modal de contacto
│   │       ├── modal.component.html
│   │       ├── modal.component.css
│   │       └── modal.component.js                    Aplica sus datos + abre/cierra el modal
│   │
│   ├── Modulo-ambiente/                             Tema claro / oscuro
│   │   ├── Services/ambiente.service.js              Persistencia en localStorage
│   │   └── Components/ambiente/
│   │       └── ambiente.component.js                 Escucha el botón data-gf-ambiente (sin .html:
│   │                                                  no pinta su propia sección, solo el botón que
│   │                                                  ya exista en el HTML de otro componente)
│   │
│   └── app.js                                       Arranque: incluye los .html y luego llama
│                                                      .iniciar() de cada Component
└── assets/                                          Logo y fotografías
```

Cada componente que tiene datos de contacto en su plantilla (header, hero,
ubicación, pie, modal) se los aplica a sí mismo llamando a
`GF.Nucleo.EnlazarService.aplicar(suPropiaRaiz)` — nadie alcanza el DOM de
otro componente. `AmbienteComponent` es la única excepción sin `.html`
propio, porque no pinta una sección: solo escucha un botón opcional que
puede vivir en el HTML de cualquier otro componente.

## Cómo carga la página

`index.html` es un esqueleto con un `<div data-gf-incluir="Modulo-x/…">`
por cada componente que tiene su propia sección. En el arranque (`app.js`):

1. `GF.Nucleo.IncluirService.cargarTodos()` busca esos marcadores, pide
   cada `.html` por `fetch()` y lo pone en su lugar.
2. Recién entonces se encienden los `Components` (`HeaderComponent`,
   `ServiciosComponent`, etc.), que ya encuentran ese DOM en la página y
   aplican ahí mismo sus propios datos con `EnlazarService`.

Por eso el orden de los `<script>` en `index.html` es namespace → nucleo →
Models de todos los módulos → Services de todos los módulos → Components
de todos los módulos → `app.js`. Un Model no depende de nada; un Service
puede usar Models de su propio módulo; un Component usa Services (a veces
de otro módulo, como `HeaderComponent` usando el `ConfigService` de
Modulo-contacto para el enlace de WhatsApp).

El CSS de cada componente se referencia con `<link>` normal en el
`<head>` (no por `fetch`), así que esa parte sí funcionaría con doble clic
si no fuera por el HTML incluido.

## Cómo verlo en tu máquina

`fetch()` no puede leer archivos locales cuando abres `index.html` con
doble clic (protocolo `file://`); hace falta servir la carpeta por http.
Un solo comando alcanza, sin instalar nada de por vida:

```bash
npx serve .
# o, si tienes Python:
python -m http.server 8080
```

y abrir la URL que muestre (`http://localhost:...`). Publicado en
cualquier hosting (ver más abajo) esto ya no es un problema.

## Cómo editar lo más habitual

| Qué cambiar | Dónde |
| --- | --- |
| Teléfono, WhatsApp, dirección, redes | `js/Modulo-contacto/Services/config.service.js` |
| Tarjetas de servicios | `js/Modulo-servicios/Services/servicios.service.js` |
| Fichas de trabajos | `js/Modulo-trabajos/Services/trabajos.service.js` |
| Puntos del checklist de mantenimiento | `js/Modulo-mantenimiento/Services/mantenimiento.service.js` |
| Texto o marcado de una sección | `js/Modulo-<sección>/Components/<sección>/<sección>.component.html` |
| Estilo de una sección | `js/Modulo-<sección>/Components/<sección>/<sección>.component.css` |
| Cómo se pinta una sección en el DOM | `js/Modulo-<sección>/Components/<sección>/<sección>.component.js` |
| Colores, ambiente claro/oscuro | `css/theme.css` |
| Reset y utilidades compartidas (`.gf-wrap`, `.gf-kicker`, botones) | `css/main.css` |
| Fotos | reemplazar en `assets/` con el mismo nombre |

El teléfono se escribe una sola vez en `config.service.js`; de ahí salen el
enlace de WhatsApp con mensaje precargado, el `tel:`, el mapa y los textos
visibles.

## Secciones

1. Hero — titular, claim HVAC, tres cifras, botones (`Modulo-hero`)
2. `01 — Servicios` — cuatro tarjetas (`Modulo-servicios`)
3. `02 — Trabajos` — galería + celda de llamada a la acción (`Modulo-trabajos`)
4. `03 — Mantenimiento` — banda invertida con checklist (`Modulo-mantenimiento`)
5. `04 — Ubicación` — mapa de Google embebido y datos de contacto (`Modulo-ubicacion`)
6. Pie — logo, dirección, redes (`Modulo-pie`)

## Ambientes

`<html data-theme="oscuro">` (por defecto) o `data-theme="claro"`.
Para ofrecer el cambio al visitante, basta con añadir un botón con el
atributo `data-gf-ambiente`; `AmbienteComponent` ya lo escucha (y
`AmbienteService` guarda la elección).

## Publicar

Subir el contenido de esta carpeta a cualquier hosting estático
(Netlify, Vercel, Cloudflare Pages, o el `public_html` de un hosting
normal). No hay proceso de build — solo hace falta que el hosting sirva
los archivos por http/https, lo que ya hacen todos por defecto.

## Notas

- El mapa de Google y los enlaces de WhatsApp no funcionan dentro de vistas
  previas embebidas; sí funcionan al abrir el archivo o el dominio directamente.
- Los botones "Llamar ahora" y "Programar mantenimiento" abren el modal de
  contacto. "Cotizar por WhatsApp" abre el chat en una pestaña nueva.

## Contacto del negocio

- Edgar Sabalu — 904 209 489
- 4VJ7+W28 K, Ventanilla 07061, Perú
- Facebook: https://www.facebook.com/SYSFRIOSAB
- TikTok: https://www.tiktok.com/@edgarsabalu01

# HogarYa · prototipo v3.0 (estructura modular)

Prototipo web de una plataforma de contratación de servicios para el hogar.
APF2 · Interacción Hombre-Máquina · Grupo 13.



---

## 1. Cómo abrirlo

Levanta un servidor local en `http://localhost:8000` y abre el navegador. Deja esa ventana abierta (Usar preview/Live Server)
Equivalente a mano:

```powershell
cd HogarYa_prototipo_v3
python -m http.server 8000
# abre http://localhost:8000
```

> **¿Por qué hace falta un servidor?** El marcado de cada pantalla está en
> archivos `.html` aparte (`assets/views/`) y el navegador los lee con
> `fetch()`. Chrome bloquea esa lectura cuando la página se abre
> directamente desde el disco (`file://`). Si alguien abre `index.html`
> con doble clic, la aplicación lo detecta y le explica cómo usar el
> servidor, en vez de mostrar una página en blanco.

No hay proceso de compilación, ni `npm install`, ni dependencias: el
prototipo es HTML, CSS y JavaScript planos.

---

## 2. Idea central: el HTML es HTML

El marcado de cada pantalla **no está escrito dentro del JavaScript**.
Vive en archivos `.html` propios, dentro de `assets/views/`, como bloques
`<template>` que el código clona y rellena:

```html
<!-- assets/views/list.html -->
<template id="tpl-view-list">
  <section class="screen" aria-labelledby="title">
    <div class="chips" role="group" aria-label="Filtros y orden">
      <button class="chip" data-a="filt" data-f="today" data-key="f-today">Disponible hoy</button>
      …
```

```js
// assets/js/ui/views/list.js
var chips = root.querySelectorAll('.chips .chip');
chips[0].setAttribute('aria-pressed', String(S.filters.today));
```

Ventajas: el editor colorea y autocompleta el HTML, el marcado se lee sin
buscar dentro de cadenas de JavaScript, y la separación entre estructura
y lógica es real.

**Los iconos SVG** son la única excepción: viven en `core/icons.js` porque
son gráficos vectoriales reutilizados en más de 40 lugares, no estructura
de página.

---

## 3. Estructura de carpetas

```
HogarYa_prototipo_v3/
├── index.html                  punto de entrada: enlaza y monta
├── README.md
└── assets/
    ├── views/                  el marcado, un archivo por pantalla
    │   ├── comunes.html        cabecera, navegación, diálogo, barra de título, pie
    │   ├── items.html          elementos repetibles
    │   ├── bloques.html        bloques condicionales
    │   ├── home.html           Inicio
    │   ├── search.html         Resultados de búsqueda
    │   ├── list.html           Lista de profesionales
    │   ├── compare.html        Comparar
    │   ├── profile.html        Perfil del profesional
    │   ├── login.html          Ingresar / Crear cuenta
    │   ├── request.html        Solicitud en 3 pasos + confirmación
    │   ├── tracking.html       Seguimiento y Guardados
    │   ├── account.html        Mi perfil
    │   └── pro.html            Panel y Disponibilidad del profesional
    ├── css/                    estilos, uno por responsabilidad
    │   ├── fonts.css           declaraciones @font-face
    │   ├── tokens.css          variables de color, tema claro y oscuro
    │   ├── base.css            reinicio, tipografía base, foco, utilidades
    │   ├── layout.css          contenedor, cabecera, navegación, barras
    │   ├── components.css      botones, campos, tarjetas, chips, diálogos
    │   ├── views.css           piezas de una sola pantalla
    │   └── responsive.css      breakpoints, movimiento reducido, alto contraste
    ├── fonts/                  4 archivos woff2 (79 KB)
    └── js/                     lógica, un archivo por funcionalidad
        ├── core/               base de la aplicación
        │   ├── namespace.js    objeto global HY
        │   ├── util.js         utilidades (DOM, escape, formato, validación)
        │   ├── icons.js        catálogo de iconos SVG
        │   ├── data.js         catálogo de servicios y profesionales
        │   ├── state.js        estado y persistencia en localStorage
        │   └── router.js       navegación entre pantallas
        ├── ui/                 capa de interfaz
        │   ├── template.js     carga y relleno de las plantillas
        │   ├── feedback.js     toast y avisos para lectores de pantalla
        │   ├── theme.js        tema claro / oscuro / automático
        │   ├── chrome.js       cabecera, navegación, barra de título
        │   ├── cards.js        fragmentos compartidos entre pantallas
        │   ├── dialog.js       ventana modal y ayuda contextual
        │   ├── render.js       dibujo de la pantalla y restitución del foco
        │   └── views/          una vista por pantalla
        │       ├── home.js         Inicio
        │       ├── search.js       Resultados de búsqueda
        │       ├── list.js         Lista de profesionales
        │       ├── compare.js      Comparar
        │       ├── profile.js      Perfil del profesional
        │       ├── login.js        Ingresar / Crear cuenta
        │       ├── request.js      Solicitud en 3 pasos + confirmación
        │       ├── tracking.js     Seguimiento y Guardados
        │       ├── account.js      Mi perfil
        │       └── pro.js          Panel y Disponibilidad del profesional
        ├── actions.js          clics, cambios, envíos y teclado
        └── main.js             arranque: carga plantillas y dibuja la 1ª pantalla
```

---

## 4. Las plantillas

Las 47 plantillas viven en `assets/views/`, agrupadas por tipo.

| Prefijo | Significado | Dónde |
|---|---|---|
| `tpl-view-*` | pantalla completa | un archivo por pantalla |
| `tpl-item-*` | elemento repetible | `items.html` |
| `tpl-blk-*` | bloque condicional | `bloques.html` |
| `tpl-*` | pieza de la aplicación | `comunes.html` |

Los huecos se rellenan con dos mecanismos:

- **`data-slot="nombre"`** — marcador `<div>` que se reemplaza por el
  contenido, o se elimina si no aplica.
  `HY.put(raíz, 'foot', HY.footNode())` · `HY.drop(raíz, 'addrerr')`
- **selección directa** — se busca el nodo dentro del fragmento clonado
  y se le escriben el texto y los atributos.

Al arrancar, `ui/template.js` descarga los 13 archivos, los registra en el
documento y recién entonces se dibuja la primera pantalla.

---

## 5. Dónde cambiar cada cosa

| Quiero cambiar… | Archivo |
|---|---|
| El texto o la estructura de una pantalla | `assets/views/<pantalla>.html` |
| Los colores, tipografías, espacios o radios | `assets/css/tokens.css` |
| El comportamiento del tema | `assets/js/ui/theme.js` |
| Los servicios o los profesionales de ejemplo | `assets/js/core/data.js` |
| La lógica de una pantalla | `assets/js/ui/views/<pantalla>.js` |
| Un color de un componente | `assets/css/components.css` |
| La cabecera o la navegación inferior | `assets/css/layout.css` |
| La reacción a un clic o a un envío | `assets/js/actions.js` |

---

## 6. Cómo se relacionan las piezas

1. `main.js` conecta los eventos con `actions.js` y pide las plantillas.
2. `ui/template.js` descarga `assets/views/*.html` y las registra.
3. `HY.render()` pide la pantalla activa a `HY.views[<pantalla>]()` y
   monta cabecera + contenido + navegación dentro de `#shell`.
4. Cada vista clona su plantilla, la rellena y devuelve un fragmento.
5. `actions.js` cambia el estado y llama a `HY.go()`, `HY.back()` o
   `HY.render()` para redibujar.

El estado vive en un solo lugar: `HY.state()` devuelve el objeto vigente
(así también funciona después de "Reiniciar la demostración", que reemplaza
el estado por completo).

### Agregar una pantalla nueva

1. Escribe su `<template id="tpl-view-mipantalla">` en
   `assets/views/mipantalla.html`.
2. Añade `'mipantalla'` a la lista `FILES` de `ui/template.js`.
3. Crea `assets/js/ui/views/mipantalla.js`:

```js
(function (HY) {
  'use strict';
  HY.views.mipantalla = function () {
    var frag = HY.tpl('tpl-view-mipantalla');
    var root = frag.firstElementChild;
    root.prepend(HY.sbarNode('Mi pantalla'));
    return frag;
  };
})(window.HY);
```

4. Añade su título en `HY.TITLES` (`assets/js/ui/chrome.js`).
5. Enlaza el archivo en `index.html` (después de los demás `views/`).
6. Añade el acceso en `assets/js/actions.js` (`case 'miaccion': …`).

---

## 7. Convenciones

- **Un archivo, una responsabilidad.** Si un archivo supera unas 150
  líneas, conviene partirlo.
- **Encapsulamiento.** Cada archivo se envuelve en una función que recibe
  `HY`; nada se expone como variable global suelta. El único acceso
  externo es `window.__hy`, que sirve para depurar desde la consola.
- **Sin marcado en el JavaScript.** El HTML vive en `assets/views/`. En
  los `.js` solo se usan `textContent`, `setAttribute` y la API del DOM.
- **Sin dependencias.** Ni CDN, ni framework, ni paso de compilación.
- **Los datos viven en JavaScript**, no en archivos JSON: `fetch()` está
  bloqueado por el navegador al abrir el archivo desde el disco.
- **El orden de carga importa.** En `index.html` los estilos y los scripts
  se cargan en orden, porque ese orden define la prioridad y la
  disponibilidad de cada pieza.

---

## 8. Accesibilidad (WCAG 2.2 AA)

- Foco visible en todos los controles, con `outline` de 3 px.
- Enlace de salto al contenido y foco devuelto al cerrar cada diálogo.
- La pestaña activa de la navegación se marca con color **y** con una
  barra superior, no solo con color (1.4.1).
- Los campos con error se anuncian y enlazan a su mensaje (3.3.1).
- Objetivos táctiles de 44 px como mínimo (2.5.8).
- Modos `prefers-reduced-motion` y `forced-colors` contemplados.
- Si las plantillas no se pueden cargar, el aviso se anuncia con
  `role="status"` en lugar de dejar la pantalla en blanco.

### Accesibilidad y diseño inclusivo

- **Visual (Daltonismo):** Selector de paletas optimizadas para *Deuteranopía* (verde débil), *Protanopía* (rojo débil), *Tritanopía* (azul débil) y *Acromático/Monocromo*. No se depende únicamente del color (iconos y texto explícito acompañan cada estado).
- **Visual / Cognitiva (Baja visión y memoria de trabajo):** Selector de escala de fuente (`normal`, `large`, `xlarge`) con recalculación fluida sin desbordes; flujo en 3 pasos con resumen constante de elección ("Tu elección: ...").
- **Auditiva / Ubicua (Hipoacusia y entornos ruidosos):** Notificaciones y confirmaciones con *vibración háptica opcional* (`navigator.vibrate`) en la confirmación de solicitud y en la vista de perfil, permitiendo percibir y confirmar alertas sin requerir sonido alguno.
- **Motora:** Metas táctiles de 44 px mínimas, navegación total por teclado y trampa de foco accesible.

### Tema

Tres preferencias: **Claro**, **Oscuro** y **Automático** (sigue al
sistema). Se eligen con el botón sol/luna de la cabecera o en
*Mi perfil → Apariencia*, y se guardan en este navegador.

---

## 9. Verificación realizada

- `node --check` en los 25 archivos JavaScript: sin errores de sintaxis.
- Comparación automática contra `../HogarYa_prototipo_v3.html` con Chromium:
  23 estados de pantalla × 2 temas, con **0 diferencias** en el DOM
  generado (elementos, atributos y texto) y **0 diferencias de píxeles**
  en las capturas.
- axe-core: **0 violaciones** en 10 pantallas × 2 temas.
- Carga por HTTP: 0 errores de consola.
- Al abrir con doble clic (`file://`) se muestra el aviso con la
  instrucción de usar Live Server o Live Preview, no una página en blanco.
- Recorrido con teclado, trampa de foco del diálogo y cierre con Escape
  comprobados.
- El tema persiste tras recargar y el `<meta name="theme-color">` se
  actualiza con el tema activo.
- 47 plantillas definidas, 0 huérfanas y 0 referencias rotas.
- Revisión automática: ningún archivo `.js` contiene marcado HTML
  estructural (solo iconos SVG).

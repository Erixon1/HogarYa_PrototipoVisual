/* ============================================================
   HogarYa · diálogos
   Ventana modal para la ayuda contextual y las confirmaciones.
   Atrapa el foco, se cierra con Escape y devuelve el foco al
   elemento que la abrió.
   ============================================================ */
(function (HY) {
  'use strict';

  var dlgOpener = null, dlgOpenerKey = null;
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  HY.openDialog = function (spec) {
    var ae = document.activeElement;
    dlgOpener = ae && ae !== document.body ? ae : null;
    dlgOpenerKey = dlgOpener && dlgOpener.getAttribute ? dlgOpener.getAttribute('data-key') : null;

    var frag = HY.tpl('tpl-dialog');
    var dlg = frag.firstElementChild;
    dlg.setAttribute('role', spec.alert ? 'alertdialog' : 'dialog');
    dlg.querySelector('#dlg-t').textContent = spec.title;

    if (spec.desc) {
      dlg.setAttribute('aria-describedby', 'dlg-d');
      dlg.querySelector('#dlg-d').textContent = spec.desc;
    } else {
      dlg.querySelector('#dlg-d').remove();
    }

    if (spec.body) HY.put(dlg, 'body', spec.body);
    else HY.drop(dlg, 'body');

    var actions = dlg.querySelector('.stack');
    (spec.actions || []).forEach(function (a, i) {
      var b = HY.el('button', 'btn ' + a.kind, a.label);
      b.setAttribute('data-dlg', String(i));
      b.setAttribute('data-key', 'dlg-' + i);
      actions.appendChild(b);
    });

    var sc = HY.$('#scrim');
    sc.innerHTML = '';
    sc.appendChild(dlg);
    sc.hidden = false;
    HY.ui.dialog = spec;

    var first = sc.querySelector('[data-dlg="' + (spec.focusLast ? (spec.actions.length - 1) : 0) + '"]') || sc.querySelector('button,input');
    if (first) first.focus();
    HY.$('#shell').setAttribute('aria-hidden', 'true');
  };

  HY.closeDialog = function () {
    var sc = HY.$('#scrim');
    sc.hidden = true;
    sc.innerHTML = '';
    HY.ui.dialog = null;
    HY.$('#shell').removeAttribute('aria-hidden');

    var back = (dlgOpener && document.contains(dlgOpener)) ? dlgOpener : (dlgOpenerKey ? HY.$('[data-key="' + dlgOpenerKey + '"]') : null);
    if (back) back.focus();
    else { var t = HY.$('#title'); if (t) t.focus(); }
    dlgOpener = null;
    dlgOpenerKey = null;
  };

  /* ============================================================
     Guía interactiva paso a paso con foco en cada acción (Tour)
     ============================================================ */
  var tourState = { active: false, screen: null, index: 0, steps: [] };

  function removeTourElements() {
    var prev = document.querySelector('.guide-highlight');
    if (prev) prev.classList.remove('guide-highlight');
    var pop = document.getElementById('guide-popover');
    if (pop) pop.remove();
  }

  HY.closeTour = function () {
    tourState.active = false;
    removeTourElements();
    var t = HY.$('#title');
    if (t) t.focus();
    HY.say('Guía paso a paso finalizada.');
  };

  HY.showTourStep = function (idx) {
    var s = tourState.steps;
    if (!s || idx < 0 || idx >= s.length) {
      HY.closeTour();
      return;
    }
    tourState.index = idx;
    var item = s[idx];

    removeTourElements();

    var targetEl = document.querySelector(item.sel);
    if (targetEl) {
      targetEl.classList.add('guide-highlight');
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetEl.focus();
    }

    var pop = document.createElement('div');
    pop.id = 'guide-popover';
    pop.className = 'guide-popover';
    pop.setAttribute('role', 'region');
    pop.setAttribute('aria-label', 'Guía paso a paso');

    var hdr = document.createElement('div');
    hdr.className = 'guide-header';
    var tag = document.createElement('span');
    tag.className = 'guide-step-tag';
    tag.textContent = 'Paso ' + (idx + 1) + ' de ' + s.length;
    var title = document.createElement('strong');
    title.textContent = item.title;
    hdr.appendChild(tag);
    hdr.appendChild(title);

    var desc = document.createElement('p');
    desc.className = 'guide-desc';
    desc.textContent = item.desc;

    var act = document.createElement('div');
    act.className = 'guide-actions';

    if (idx > 0) {
      var prevBtn = document.createElement('button');
      prevBtn.className = 'btn secondary';
      prevBtn.textContent = 'Anterior';
      prevBtn.onclick = function () { HY.showTourStep(idx - 1); };
      act.appendChild(prevBtn);
    }

    var nextBtn = document.createElement('button');
    nextBtn.className = 'btn primary';
    nextBtn.textContent = idx === s.length - 1 ? '¡Listo!' : 'Siguiente paso';
    nextBtn.onclick = function () {
      if (idx === s.length - 1) HY.closeTour();
      else HY.showTourStep(idx + 1);
    };
    act.appendChild(nextBtn);

    var closeBtn = document.createElement('button');
    closeBtn.className = 'linkbtn';
    closeBtn.textContent = 'Salir de guía';
    closeBtn.onclick = function () { HY.closeTour(); };
    act.appendChild(closeBtn);

    pop.appendChild(hdr);
    pop.appendChild(desc);
    pop.appendChild(act);

    document.body.appendChild(pop);

    HY.say('Paso ' + (idx + 1) + ' de ' + s.length + ': ' + item.title + '. ' + item.desc);
  };

  HY.startTour = function (screenKey) {
    var TOURS = {
      home: [
        { sel: '#district', title: 'Elige tu distrito', desc: 'Selecciona la zona donde necesitas la atención para encontrar profesionales cercanos.' },
        { sel: '#q', title: 'Buscador de servicios', desc: 'Escribe el oficio o el problema directamente (ej.: gasfitero, cableado).' },
        { sel: '.cats', title: 'Categorías principales', desc: 'O toca directamente una de las categorías para explorar a los especialistas.' }
      ],
      list: [
        { sel: '[data-f="today"]', title: 'Filtro disponible hoy', desc: 'Activa este filtro si requieres atención de urgencia para el mismo día.' },
        { sel: '.cmp', title: 'Casilla comparar', desc: 'Marca hasta 2 profesionales para ver frente a frente sus precios y valoraciones.' },
        { sel: '.pro h3 a', title: 'Perfil del profesional', desc: 'Toca el nombre del especialista para revisar opiniones y contratarlo.' }
      ],
      profile: [
        { sel: '.stats', title: 'Reputación y experiencia', desc: 'Comprueba el promedio de estrellas y la cantidad de trabajos completados.' },
        { sel: '.card:nth-of-type(1)', title: 'Tarifario transparente', desc: 'Revisa el costo de la visita de diagnóstico y el estimado de mano de obra.' },
        { sel: '[data-key="solicitar"]', title: 'Solicitar servicio', desc: 'Inicia el formulario en 3 pasos. ¡No pagas nada al enviar la solicitud!' }
      ],
      req1: [
        { sel: '#g-day', title: 'Elige el día', desc: 'Selecciona una de las fechas disponibles para la visita técnica.' },
        { sel: '#g-hour', title: 'Elige el horario', desc: 'Escoge el rango de horas que mejor se acomode a tus horarios.' },
        { sel: '#sel', title: 'Resumen en tiempo real', desc: 'Aquí confirmas la selección que vas realizando antes de continuar.' },
        { sel: '[data-key="next1"]', title: 'Avanzar al paso 2', desc: 'Pulsa continuar para ingresar la dirección del domicilio.' }
      ],
      req2: [
        { sel: '#addr', title: 'Dirección del servicio', desc: 'Ingresa la calle, avenida, número y referencia de tu vivienda.' },
        { sel: '#prob', title: 'Describe el problema', desc: 'Opcionalmente añade detalles de la falla para que el técnico venga preparado.' },
        { sel: '[data-key="next2"]', title: 'Avanzar al resumen', desc: 'Continúa al paso final de revisión y confirmación.' }
      ],
      req3: [
        { sel: 'dl.kv', title: 'Revisión final', desc: 'Verifica los datos; puedes pulsar "Cambiar" si deseas modificar la fecha o dirección.' },
        { sel: '#sw-req-vib', title: 'Vibración opcional', desc: 'Activa este interruptor si deseas recibir confirmación háptica en tu dispositivo.' },
        { sel: '[data-key="confirm"]', title: 'Confirmar solicitud', desc: 'Envía la solicitud al profesional de forma segura.' }
      ],
      sent: [
        { sel: '.codebox', title: 'Código de solicitud', desc: 'Guarda este código para cualquier consulta o seguimiento de tu orden.' },
        { sel: '[data-key="seg"]', title: 'Ver seguimiento', desc: 'Accede a la línea de tiempo en tiempo real para ver el estado de tu técnico.' }
      ],
      requests: [
        { sel: '.timeline', title: 'Línea de tiempo', desc: 'Observa en tiempo real si el técnico aceptó, está en camino o finalizó.' }
      ],
      account: [
        { sel: '.a11y-panel', title: 'Opciones de accesibilidad', desc: 'Ajusta la paleta para daltonismo, tamaño de lectura y vibración táctil.' }
      ]
    };

    var steps = TOURS[screenKey] || TOURS.home;
    tourState.active = true;
    tourState.screen = screenKey;
    tourState.steps = steps;
    HY.showTourStep(0);
  };

  /* Ayuda contextual: permite leer el resumen o iniciar el tour interactivo enfocado */
  HY.helpFor = function () {
    var s = HY.state().screen;
    var H = {
      home: ['Cómo usar el inicio', ['Elige tu distrito.', 'Toca una categoría o escribe lo que buscas.', 'Verás a los profesionales con su precio y disponibilidad.']],
      search: ['Cómo usar los resultados', ['Toca un servicio para ver a sus profesionales.', 'Toca el nombre de una persona para abrir su perfil.']],
      list: ['Cómo comparar profesionales', ['Activa «Disponible hoy» para ver solo a quienes atienden hoy.', 'Marca «Comparar» en dos profesionales.', 'Toca «Comparar 2 seleccionados». El máximo es 2.', 'Toca el nombre de alguien para abrir su perfil.']],
      compare: ['Cómo leer la comparación', ['Cada fila compara un dato: precio, calificación, horario, experiencia y trabajos.', 'Toca «Ver perfil» para abrir el perfil de uno.']],
      profile: ['Cómo solicitar el servicio', ['Revisa precios, disponibilidad y opinión.', 'Toca «Solicitar este servicio». Si no ingresaste, te pediremos hacerlo y retomaremos tu solicitud.', 'No pagas nada al enviar la solicitud.']],
      login: ['Cómo ingresar', ['Elige si eres cliente o profesional.', 'Escribe tu correo y una contraseña de 6 caracteres o más.', 'También puedes usar la cuenta de ejemplo.']],
      req1: ['Paso 1: día y hora', ['Elige un día y una hora. Ambos son obligatorios.', 'Si olvidas uno, lo marcaremos en rojo junto al mensaje.', 'Después toca «Continuar».']],
      req2: ['Paso 2: dirección', ['Escribe la dirección donde irá el profesional.', 'Contar el problema es opcional, pero ayuda a prepararse.']],
      req3: ['Paso 3: revisar y confirmar', ['Revisa los datos. Con «Cambiar» corriges el día, la hora o la dirección.', 'Al confirmar, el profesional recibe tu solicitud.']],
      sent: ['Después de enviar', ['Guarda tu código.', 'En «Solicitudes» ves el estado: Enviada, Aceptada, En camino y Finalizada.']],
      requests: ['Seguimiento de solicitudes', ['La línea de tiempo muestra el estado actual.', 'Puedes cancelar mientras el servicio no haya finalizado.', 'Al finalizar, puedes calificar el servicio.']],
      favs: ['Guardados', ['Aquí están los profesionales que marcaste con el corazón.']],
      account: ['Tu perfil', ['Revisa tus datos o cierra sesión. Antes te pediremos confirmar.']],
      proHome: ['Cómo atender solicitudes', ['Toca «Aceptar» en una solicitud nueva.', 'Después toca «Marcar en camino» para avisar al cliente.', 'Al terminar, toca «Finalizar servicio».', '«Rechazar» pide confirmación antes de ejecutarse.']],
      proAvail: ['Disponibilidad y precio', ['Activa «Disponible hoy» y elige los días que atiendes.', 'Escribe el precio de visita solo con números.', 'Toca «Guardar cambios».']] };
    var h = H[s] || H.home;

    var body = HY.tpl('tpl-blk-help');
    var ol = body.querySelector('ol');
    h[1].forEach(function (step) { ol.appendChild(HY.el('li', null, step)); });

    HY.openDialog({
      title: h[0],
      body: body,
      actions: [
        {
          label: 'Iniciar guía paso a paso',
          kind: 'primary',
          fn: function () {
            setTimeout(function () { HY.startTour(s); }, 150);
          }
        },
        { label: 'Entendido', kind: 'secondary', fn: function () { } }
      ]
    });
  };

})(window.HY);

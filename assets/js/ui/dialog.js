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

  /* Ayuda contextual: cambia según la pantalla en la que se esté. */
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
      actions: [{ label: 'Entendido', kind: 'primary', fn: function () { } }]
    });
  };

})(window.HY);

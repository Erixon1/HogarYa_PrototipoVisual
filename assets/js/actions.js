/* ============================================================
   HogarYa · acciones
   Todo lo que responde a la interacción: clics, cambios de
   formulario, envíos y teclado. Cada acción llama a las vistas
   a través de HY.go / HY.render.
   ============================================================ */
(function (HY) {
  'use strict';

  /* ---------- ayudas ---------- */

  function focusFirstError(ids) {
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el) { el.focus(); el.scrollIntoView({ block: 'center', behavior: 'auto' }); return; }
    }
  }

  /* Prepara el borrador de una solicitud nueva. */
  function startRequest(id) {
    var S = HY.state();
    S.draft = { proId: id, day: '', hour: '', address: S.lastAddress || '', problem: '', fromSummary: false };
    HY.ui.errors = {};
  }

  /* Al entrar, se lleva a la pantalla correspondiente; si había una
     solicitud a medio completar, se retoma. */
  function afterLogin() {
    var ui = HY.ui;
    var r = ui.returnTo; ui.returnTo = null; ui.loginMsg = '';
    if (HY.isPro()) { HY.go('proHome', {}, { reset: true }); return; }
    if (r && r.screen === 'req1' && HY.state().draft) {
      var pid = HY.state().draft.proId;
      HY.go('req1', {}, { reset: true });
      HY.state().stack = [{ screen: 'profile', params: { id: pid } }];
      return;
    }
    HY.go('home', {}, { reset: true });
  }

  /* Crea la solicitud a partir del borrador del paso 3. */
  function doConfirm() {
    var S = HY.state();
    var d = S.draft, p = HY.pro(d.proId);
    var id = 'HY-' + (S.seq++);
    var u = S.user;
    var r = {
      id: id, cat: p.cat, proId: p.id, proName: p.name,
      client: u.name,
      clientShort: u.name.split(' ')[0] + ' ' + (u.name.split(' ')[1] || '').charAt(0) + '.',
      clientEmail: u.email, when: d.day + ', ' + d.hour, address: d.address, problem: d.problem,
      st: 0, closed: null, example: false, rated: 0
    };
    S.reqs.unshift(r);
    S.lastAddress = d.address;
    S.draft = null;
    HY.go('sent', { id: id }, { reset: true });
    HY.toast('Solicitud ' + id + ' enviada');
    if (HY.vibratePulse) HY.vibratePulse([100, 50, 150]);
  }

  /* Actualiza la línea "Tu elección: ..." del paso 1. */
  function updateSel() {
    var d = HY.state().draft, el = HY.$('#sel');
    if (!el) return;
    el.innerHTML = '';
    el.insertAdjacentHTML('afterbegin', HY.ic(d.day && d.hour ? 'check' : 'info'));
    el.appendChild(HY.el('span', null,
      'Tu elección: ' + (d.day || 'falta elegir el día') + ' · ' + (d.hour || 'falta elegir la hora')));
  }

  /* ---------- clics ---------- */

  function handleClick(e) {
    var ui = HY.ui, S = HY.state();

    /* Botón del diálogo: se cierra y luego se ejecuta la acción. */
    var d = e.target.closest('[data-dlg]');
    if (d && ui.dialog) {
      var spec = ui.dialog.actions[+d.getAttribute('data-dlg')];
      var fn = spec.fn;
      HY.closeDialog();
      if (fn) fn();
      return;
    }
    if (e.target.id === 'scrim' && ui.dialog) { HY.closeDialog(); return; }

    var t = e.target.closest('[data-a]');
    if (!t) return;
    var a = t.getAttribute('data-a'), id = t.getAttribute('data-id');

    switch (a) {
      case 'home': e.preventDefault(); HY.home(); break;
      case 'nav': HY.go(t.getAttribute('data-to'), {}, { reset: true }); break;
      case 'tab': HY.go(t.getAttribute('data-to'), {}, { reset: true }); break;
      case 'back': HY.back(); break;
      case 'help': HY.helpFor(); break;
      case 'theme-toggle': HY.setTheme(HY.themeNow() === 'dark' ? 'light' : 'dark'); break;
      case 'tofield':
        e.preventDefault();
        var fld = document.getElementById(id);
        if (fld) { fld.focus(); fld.scrollIntoView({ block: 'center', behavior: 'auto' }); }
        break;
      case 'cat':
        ui.notice = ''; S.compare = [];
        S.filters = { today: false, sort: null };
        HY.go('list', { cat: t.getAttribute('data-id') });
        break;
      case 'open':
        e.preventDefault();
        S.recent = [id].concat(S.recent.filter(function (x) { return x !== id; })).slice(0, 5);
        ui.notice = '';
        HY.go('profile', { id: id });
        break;
      case 'fav':
        var i = S.favs.indexOf(id);
        if (i > -1) { S.favs.splice(i, 1); HY.toast('Quitaste a ' + HY.pro(id).name + ' de guardados'); }
        else { S.favs.push(id); HY.toast('Guardaste a ' + HY.pro(id).name); }
        HY.render();
        break;
      case 'filt':
        var f = t.getAttribute('data-f');
        if (f === 'today') S.filters.today = !S.filters.today;
        else S.filters.sort = S.filters.sort === f ? null : f;
        HY.render();
        HY.say(HY.listFor(S.params.cat).length + ' profesionales encontrados');
        break;
      case 'clearf': S.filters = { today: false, sort: null }; HY.render(); break;
      case 'docompare': HY.go('compare', {}); break;
      case 'solicitar':
        startRequest(id);
        if (!S.user) {
          ui.returnTo = { screen: 'req1' };
          ui.mode = 'login';
          ui.loginMsg = 'Ingresa para solicitar el servicio. Al volver retomaremos tu solicitud.';
          ui.errors = {}; ui.vals = {};
          HY.go('login', {});
        } else HY.go('req1', {});
        break;
      case 'needlogin':
        ui.mode = 'login'; ui.loginMsg = ''; ui.errors = {}; ui.vals = {};
        HY.go('login', {});
        break;
      case 'edit1': S.draft.fromSummary = true; HY.go('req1', {}, { replace: true }); break;
      case 'edit2': S.draft.fromSummary = true; HY.go('req2', {}, { replace: true }); break;
      case 'confirm': doConfirm(); break;
      case 'demo':
        var role = (document.querySelector('input[name=role]:checked') || {}).value || 'cliente';
        S.user = role === 'profesional'
          ? { name: 'Carlos Ramírez', email: 'carlos@ejemplo.pe', role: 'profesional' }
          : { name: 'Rosa Quispe', email: 'rosa@ejemplo.pe', role: 'cliente' };
        HY.toast('Ingresaste como ' + S.user.name);
        afterLogin();
        break;
      case 'logout':
        HY.openDialog({
          title: '¿Cerrar sesión?',
          desc: 'Podrás volver a ingresar cuando quieras. Tus solicitudes se conservan.',
          actions: [
            {
              label: 'Sí, cerrar sesión', kind: 'primary', fn: function () {
                HY.state().user = null; HY.state().draft = null;
                HY.toast('Cerraste sesión');
                HY.go('home', {}, { reset: true });
              }
            },
            { label: 'No, volver', kind: 'secondary', fn: function () { } }
          ],
          focusLast: true, alert: true
        });
        break;
      case 'reset':
        HY.openDialog({
          title: '¿Reiniciar la demostración?',
          desc: 'Se borrarán las solicitudes que creaste y volverán los datos de ejemplo.',
          actions: [
            {
              label: 'Sí, reiniciar', kind: 'primary', fn: function () {
                HY._state = HY.seed();
                HY._state.stack = [];
                HY.ui.errors = {};
                try { localStorage.removeItem(HY.KEY); } catch (x) { }
                HY.toast('Datos de ejemplo restaurados');
                HY.go('home', {}, { reset: true });
              }
            },
            { label: 'No, volver', kind: 'secondary', fn: function () { } }
          ],
          focusLast: true, alert: true
        });
        break;
      case 'cancelreq':
        HY.openDialog({
          title: '¿Cancelar la solicitud?',
          desc: 'El profesional será avisado y tendrás que elegir otro si aún necesitas el servicio.',
          actions: [
            {
              label: 'Sí, cancelar', kind: 'danger', fn: function () {
                HY.reqById(id).closed = 'cancelada';
                HY.render();
                HY.toast('Solicitud ' + id + ' cancelada');
              }
            },
            { label: 'No, volver', kind: 'secondary', fn: function () { } }
          ],
          focusLast: true, alert: true
        });
        break;
      case 'rate':
        var body = HY.tpl('tpl-blk-rate');
        var stars = body.querySelector('#rate-g');
        [1, 2, 3, 4, 5].forEach(function (n) {
          stars.appendChild(HY.choice({ type: 'radio', name: 'stars', value: String(n), checked: n === 5, text: String(n) }));
        });
        HY.openDialog({
          title: 'Calificar servicio', body: body,
          actions: [
            { label: 'Enviar calificación', kind: 'primary', fn: function () { } },
            { label: 'Ahora no', kind: 'secondary', fn: function () { } }
          ]
        });
        ui.rateId = id;
        break;
      case 'accept': HY.reqById(id).st = 1; HY.render(); HY.toast('Aceptaste la solicitud ' + id + '. El cliente fue avisado.'); break;
      case 'onway': HY.reqById(id).st = 2; HY.render(); HY.toast('Marcaste en camino la solicitud ' + id + '. El cliente fue avisado.'); break;
      case 'finish': HY.reqById(id).st = 3; HY.render(); HY.toast('Finalizaste el servicio ' + id); break;
      case 'reject':
        HY.openDialog({
          title: '¿Rechazar la solicitud?',
          desc: 'El cliente será avisado y deberá elegir otro profesional.',
          actions: [
            {
              label: 'Sí, rechazar', kind: 'danger', fn: function () {
                HY.reqById(id).closed = 'rechazada';
                HY.render();
                HY.toast('Rechazaste la solicitud ' + id);
              }
            },
            { label: 'No, volver', kind: 'secondary', fn: function () { } }
          ],
          focusLast: true, alert: true
        });
        break;
      case 'sw':
        S.proCfg.avail = !S.proCfg.avail;
        HY.render();
        HY.say(S.proCfg.avail ? 'Disponible hoy activado' : 'Disponible hoy desactivado');
        break;
      case 'a11y-vib':
        var currentVib = HY.vibrationNow();
        HY.setVibration(!currentVib);
        HY.render();
        break;
      case 'day':
        var k = +t.getAttribute('data-i'), ix = S.proCfg.days.indexOf(k);
        if (ix > -1) S.proCfg.days.splice(ix, 1); else S.proCfg.days.push(k);
        HY.render();
        break;
    }
  }

  /* ---------- cambios en formularios ---------- */

  function handleChange(e) {
    var t = e.target, a = t.getAttribute && t.getAttribute('data-a');
    var ui = HY.ui, S = HY.state();
    if (t.name === 'stars') return;
    if (!a) return;

    if (a === 'district') { S.district = t.value; HY.render(); }
    if (a === 'theme') { HY.setTheme(t.value); return; }
    if (a === 'a11y-cb') { HY.setColorblind(t.value); return; }
    if (a === 'a11y-font') { HY.setFontSize(t.value); return; }
    if (a === 'mode') {
      ui.vals = {}; ui.errors = {};
      ui.mode = t.value;
      ui.role = (document.querySelector('input[name=role]:checked') || {}).value || 'cliente';
      HY.render();
    }
    if (a === 'cmp') {
      var id = t.getAttribute('data-id'), i = S.compare.indexOf(id);
      if (t.checked) {
        if (S.compare.length >= 2) {
          t.checked = false;
          ui.notice = 'Puedes comparar hasta 2 profesionales. Quita uno para elegir otro.';
          HY.render(); HY.say(ui.notice);
          return;
        }
        S.compare.push(id); ui.notice = '';
      } else if (i > -1) { S.compare.splice(i, 1); ui.notice = ''; }
      HY.render();
      HY.say(S.compare.length + ' seleccionados para comparar');
    }
    if (a === 'pickday') {
      S.draft.day = t.value;
      if (ui.errors.day) delete ui.errors.day;
      if (S.draft.day === 'Hoy' && S.draft.hour) {
        var p = HY.pro(S.draft.proId);
        if (p && p.when && p.when.indexOf('Hoy') === 0) {
          var minM = HY.hourToMinutes(p.when.replace('Hoy,', '').trim());
          if (HY.hourToMinutes(S.draft.hour) < minM) {
            S.draft.hour = ''; // resetea hora inválida
          }
        }
      }
      HY.render();
    }
    if (a === 'pickhour') {
      S.draft.hour = t.value;
      if (ui.errors.hour) { delete ui.errors.hour; HY.render(); } else updateSel();
    }
  }

  /* ---------- escritura en campos ---------- */

  function handleInput(e) {
    var t = e.target, a = t.getAttribute && t.getAttribute('data-a');
    if (a === 'price') {
      var v = t.value.trim(), m = HY.$('#price-e');
      var bad = v === '' || !/^\d{1,4}$/.test(v);
      if (bad) {
        var msg = v === ''
          ? 'Escribe el precio de visita. Solo números, por ejemplo 40.'
          : 'Escribe solo números, sin letras ni símbolos. Ejemplo: 40.';
        HY.ui.errors.price = msg;
        t.setAttribute('aria-invalid', 'true');
        m.hidden = false;
        m.querySelector('span').textContent = msg;
      } else {
        delete HY.ui.errors.price;
        t.removeAttribute('aria-invalid');
        m.hidden = true;
      }
    }
  }

  /* ---------- envíos de formulario ---------- */

  function handleSubmit(e) {
    var f = e.target, a = f.getAttribute('data-a');
    var ui = HY.ui;
    if (!a) return;
    e.preventDefault();

    if (a === 'search') {
      var q = HY.$('#q').value.trim();
      HY.state().query = q;
      if (!q) { HY.toast('Escribe qué servicio buscas'); HY.$('#q').focus(); return; }
      HY.go('search', {});
      return;
    }

    if (a === 'login') {
      var fd = new FormData(f);
      var vals = {
        name: (fd.get('name') || '').trim(),
        email: (fd.get('email') || '').trim(),
        pass: fd.get('pass') || ''
      };
      var role = fd.get('role') || 'cliente';
      var er = {};
      if (ui.mode === 'register' && vals.name.length < 2) er.name = 'Escribe tu nombre.';
      if (!HY.validateEmail(vals.email)) er.email = 'Escribe un correo válido, por ejemplo nombre@correo.com.';
      if (vals.pass.length < 6) er.pass = 'La contraseña debe tener al menos 6 caracteres.';
      ui.vals = { name: vals.name, email: vals.email, pass: '' };
      ui.role = role;
      ui.errors = er;
      if (Object.keys(er).length) {
        HY.render();
        HY.say('Hay errores en el formulario. ' + Object.values(er)[0]);
        focusFirstError(['name', 'email', 'pass'].filter(function (k) { return er[k]; }));
        return;
      }
      var nm = vals.name || vals.email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
      HY.state().user = { name: nm, email: vals.email.toLowerCase(), role: role };
      ui.errors = {};
      HY.toast('Ingresaste como ' + nm);
      afterLogin();
      return;
    }

    if (a === 'step1') {
      var d = HY.state().draft, er1 = {};
      if (!d.day) er1.day = 'Falta elegir el día. Toca uno de los días.';
      if (!d.hour) er1.hour = 'Falta elegir la hora. Toca una de las horas.';
      ui.errors = er1;
      if (Object.keys(er1).length) {
        HY.render();
        HY.say(Object.values(er1).join(' '));
        focusFirstError([er1.day ? 'day-first' : 'hour-first']);
        return;
      }
      if (d.fromSummary) { d.fromSummary = false; HY.go('req3', {}, { replace: true }); }
      else HY.go('req2', {}, { replace: false });
      return;
    }

    if (a === 'step2') {
      var d2 = HY.state().draft;
      d2.address = HY.$('#addr').value.trim();
      d2.problem = HY.$('#prob').value.trim();
      var er2 = {};
      if (!d2.address) er2.addr = 'Escribe tu dirección para que el profesional pueda llegar.';
      else if (d2.address.length < 8) er2.addr = 'La dirección es muy corta. Incluye calle y número, por ejemplo Av. Los Olivos 123.';
      ui.errors = er2;
      if (er2.addr) { HY.render(); HY.say(er2.addr); focusFirstError(['addr']); return; }
      d2.fromSummary = false;
      HY.go('req3', {}, { replace: false });
      return;
    }

    if (a === 'saveavail') {
      var p = HY.$('#price').value.trim();
      if (!/^\d{1,4}$/.test(p)) {
        var msg = p === ''
          ? 'Escribe el precio de visita. Solo números, por ejemplo 40.'
          : 'Escribe solo números, sin letras ni símbolos. Ejemplo: 40.';
        ui.errors.price = msg;
        HY.state().proCfg.price = p;
        HY.render();
        HY.say(msg);
        HY.$('#price').focus();
        return;
      }
      ui.errors = {};
      HY.state().proCfg.price = p;
      HY.render();
      HY.toast('Cambios guardados: visita a S/ ' + p);
      return;
    }
  }

  /* ---------- teclado (diálogo) ---------- */

  function handleKey(e) {
    if (!HY.ui.dialog) return;
    if (e.key === 'Escape') { e.preventDefault(); HY.closeDialog(); return; }
    if (e.key === 'Tab') {
      var sc = HY.$('#scrim');
      /* en un grupo de radios solo cuenta el marcado: es el único que recibe Tab */
      var f = HY.$$('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', sc)
        .filter(function (el) {
          return !(el.type === 'radio' && !el.checked && sc.querySelector('input[type=radio][name="' + el.name + '"]:checked'));
        });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  /* Calificación: se lee al cerrar el diálogo con "Enviar". */
  function handleRateClick(e) {
    var d = e.target.closest('[data-dlg]');
    if (d && HY.ui.dialog && HY.ui.rateId && HY.ui.dialog.title === 'Calificar servicio' && d.getAttribute('data-dlg') === '0') {
      var v = +((document.querySelector('input[name=stars]:checked') || {}).value || 5);
      HY.reqById(HY.ui.rateId).rated = v;
      var id = HY.ui.rateId;
      HY.ui.rateId = null;
      HY.closeDialog();
      HY.render();
      HY.toast('Gracias por calificar con ' + v + ' de 5');
      e.stopImmediatePropagation();
      return;
    }
  }

  HY.actions = {
    click: handleClick,
    change: handleChange,
    input: handleInput,
    submit: handleSubmit,
    key: handleKey,
    rateClick: handleRateClick
  };

})(window.HY);

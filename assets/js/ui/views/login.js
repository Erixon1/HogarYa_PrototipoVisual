/* ============================================================
   HogarYa · vista Ingresar / Crear cuenta
   Elige el rol (cliente o profesional) y valida los datos.
   ============================================================ */
(function (HY) {
  'use strict';

  HY.views.login = function () {
    var ui = HY.ui;
    var reg = ui.mode === 'register';
    var e = ui.errors;

    var frag = HY.tpl('tpl-view-login');
    var root = frag.firstElementChild;
    root.prepend(HY.sbarNode(reg ? 'Crear cuenta' : 'Ingresar', null));

    /* Aviso de contexto (por ejemplo: hay que entrar para solicitar) */
    if (ui.loginMsg) HY.put(root, 'notice', HY.noticeNode('info', 'info', ui.loginMsg));
    else HY.drop(root, 'notice');

    /* Ingresar / Crear cuenta */
    var seg = root.querySelector('.seg');
    [['login', 'Ingresar'], ['register', 'Crear cuenta']].forEach(function (o) {
      seg.appendChild(HY.choice({
        name: 'mode', value: o[0], checked: reg ? o[0] === 'register' : o[0] === 'login',
        dataA: 'mode', text: o[1]
      }));
    });

    /* Resumen de errores */
    var sum = HY.errSummaryNode([['name', e.name], ['email', e.email], ['pass', e.pass]]);
    if (sum) HY.put(root, 'errsum', sum); else HY.drop(root, 'errsum');

    /* Rol */
    var chips = root.querySelector('.chips');
    chips.appendChild(HY.choice({
      name: 'role', value: 'cliente', checked: (ui.role || 'cliente') === 'cliente', text: 'Cliente'
    }));
    chips.appendChild(HY.choice({
      name: 'role', value: 'profesional', checked: ui.role === 'profesional', text: 'Profesional'
    }));

    /* Nombre: solo al crear cuenta */
    if (reg) {
      var nf = HY.tpl('tpl-blk-name-field');
      var nameInput = nf.querySelector('#name');
      if (ui.vals && ui.vals.name) nameInput.setAttribute('value', ui.vals.name);
      if (e.name) {
        nameInput.setAttribute('aria-invalid', 'true');
        nameInput.setAttribute('aria-describedby', 'name-e');
        nf.querySelector('.field').appendChild(HY.errNode('name-e', e.name));
      }
      HY.put(root, 'name', nf);
    } else {
      HY.drop(root, 'name');
    }

    /* Correo */
    var email = root.querySelector('#email');
    if (ui.vals && ui.vals.email) email.setAttribute('value', ui.vals.email);
    if (e.email) {
      email.setAttribute('aria-invalid', 'true');
      email.setAttribute('aria-describedby', 'email-e');
      HY.put(root, 'emailerr', HY.errNode('email-e', e.email));
    } else {
      HY.drop(root, 'emailerr');
    }

    /* Contraseña */
    var pass = root.querySelector('#pass');
    pass.setAttribute('autocomplete', reg ? 'new-password' : 'current-password');
    if (e.pass) {
      pass.setAttribute('aria-invalid', 'true');
      pass.setAttribute('aria-describedby', 'pass-e');
      HY.put(root, 'passerr', HY.errNode('pass-e', e.pass));
    } else {
      HY.drop(root, 'passerr');
    }

    root.querySelector('[data-key="loginbtn"]').textContent = reg ? 'Crear cuenta' : 'Ingresar';

    HY.put(root, 'foot', HY.footNode());
    return frag;
  };

})(window.HY);

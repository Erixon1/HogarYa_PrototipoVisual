/* ============================================================
   HogarYa · estado
   Guarda la sesión, las solicitudes, los filtros y la pantalla
   actual. Se conserva en localStorage para que la demostración
   no se pierda al recargar.
   ============================================================ */
(function (HY) {
  'use strict';

  var KEY = 'hogarya-v3';
  HY.KEY = KEY;

  function seed() {
    return {
      user: null, district: 'Los Olivos', recent: [], favs: [], lastAddress: '', seq: 1002,
      reqs: [
        { id: 'HY-1001', cat: 'gasfiteria', proId: 'ga1', proName: 'Pedro Mendoza', client: 'Rosa Quispe', clientShort: 'Rosa Q.', clientEmail: '*', when: 'Hoy, 10:00 am', address: 'Jr. Las Flores 245, Los Olivos', problem: 'Fuga de agua en el caño del baño', st: 0, closed: null, example: true, rated: 0 },
        { id: 'HY-0999', cat: 'electricidad', proId: 'carlos', proName: 'Carlos Ramírez', client: 'Rosa Quispe', clientShort: 'Rosa Q.', clientEmail: 'rosa@ejemplo.pe', when: 'Hoy, 4:30 pm', address: 'Jr. Las Flores 245, Los Olivos', problem: 'Se cayó el tomacorriente de la cocina', st: 0, closed: null, example: true, rated: 0 },
        { id: 'HY-0998', cat: 'electricidad', proId: 'carlos', proName: 'Carlos Ramírez', client: 'Luis Paredes', clientShort: 'Luis P.', clientEmail: 'luis@ejemplo.pe', when: 'Mañana, 9:00 am', address: 'Av. Universitaria 1520, Los Olivos', problem: 'La luz del pasillo parpadea', st: 0, closed: null, example: true, rated: 0 },
        { id: 'HY-0997', cat: 'electricidad', proId: 'carlos', proName: 'Carlos Ramírez', client: 'Ana Torres', clientShort: 'Ana T.', clientEmail: 'ana@ejemplo.pe', when: 'Ayer, 10:00 am', address: 'Calle Los Cedros 88, Comas', problem: '', st: 2, closed: null, example: true, rated: 0 }
      ],
      proCfg: { avail: true, days: [0, 1, 2, 3, 4, 5], price: '40' },
      screen: 'home', params: {}, stack: [], compare: [], filters: { today: false, sort: null }, query: '', draft: null
    };
  }
  HY.seed = seed;

  function load() {
    try {
      var r = localStorage.getItem(KEY);
      if (!r) return null;
      var o = JSON.parse(r);
      return o && o.reqs ? o : null;
    } catch (e) { return null; }
  }

  /* Estado actual. Se lee siempre con HY.state() para obtener
     la versión vigente (cambia al reiniciar la demostración). */
  HY._state = load() || seed();
  HY.state = function () { return HY._state; };

  /* Guarda solo lo que tiene sentido conservar entre recargas:
     la navegación se reinicia siempre en el inicio. */
  HY.save = function () {
    try {
      var S = HY.state(), c = {};
      for (var k in S) c[k] = S[k];
      c.screen = HY.isPro() ? 'proHome' : 'home';
      c.params = {}; c.stack = []; c.compare = []; c.draft = null;
      localStorage.setItem(KEY, JSON.stringify(c));
    } catch (e) { /* almacenamiento no disponible: la app sigue igual */ }
  };

  /* Estado efímero de la interfaz: errores, avisos, modo del formulario. */
  HY.ui = { mode: 'login', errors: {}, tab: null, notice: '', lastDialogOpener: null, dialog: null, loginMsg: '' };

  /* Al arrancar siempre se vuelve a una pantalla limpia. */
  (function () {
    var S = HY._state;
    S.stack = []; S.compare = []; S.draft = null;
    S.screen = S.user && S.user.role === 'profesional' ? 'proHome' : 'home';
    S.params = {};
  })();

})(window.HY);

/* ============================================================
   HogarYa · plantillas
   Utilidades para trabajar con las plantillas <template> que
   viven en assets/views/: cargarlas, clonarlas y rellenar.
   ============================================================ */
(function (HY) {
  'use strict';

  /* Archivos de plantillas, en el orden en que conviene cargarlos. */
  var FILES = [
    'comunes', 'items', 'bloques',
    'home', 'search', 'list', 'compare', 'profile', 'login',
    'request', 'tracking', 'account', 'pro'
  ];

  /* Carga los archivos de plantillas y los registra en el documento para poder clonarlos después con HY.tpl(). */
  HY.loadTemplates = function () {
    return Promise.all(FILES.map(function (f) {
      return fetch('assets/views/' + f + '.html').then(function (r) {
        if (!r.ok) throw new Error('No se pudo cargar assets/views/' + f + '.html (' + r.status + ')');
        return r.text();
      });
    })).then(function (texts) {
      var holder = document.createElement('div');
      holder.id = 'templates';
      holder.setAttribute('aria-hidden', 'true');
      holder.style.display = 'none';
      holder.innerHTML = texts.join('\n');
      document.body.appendChild(holder);
      return holder;
    });
  };

  /* Clona una plantilla y devuelve un fragmento listo para usar. */
  HY.tpl = function (id) {
    var t = document.getElementById(id);
    return t ? t.content.cloneNode(true) : document.createDocumentFragment();
  };

  /* Primer elemento de un fragmento (la raíz de la plantilla). */
  HY.root = function (frag) {
    return frag.firstElementChild;
  };

  /* Escribe texto dentro de un fragmento. */
  HY.text = function (root, sel, txt) {
    var el = root.querySelector(sel);
    if (el) el.textContent = txt;
    return el;
  };

  /* Inserta un icono SVG como primer hijo del nodo indicado. */
  HY.icon = function (root, sel, name, cls) {
    var el = root.querySelector(sel);
    if (el) el.insertAdjacentHTML('afterbegin', HY.ic(name, cls));
    return el;
  };

  /* Reemplaza un marcador <div data-slot="..."> por el contenido dado. */
  HY.put = function (root, name, node) {
    var slot = root.querySelector('[data-slot="' + name + '"]');
    if (slot) slot.replaceWith(node);
    return slot;
  };

  /* Quita un marcador <div data-slot="..."> sin contenido. */
  HY.drop = function (root, name) {
    var slot = root.querySelector('[data-slot="' + name + '"]');
    if (slot) slot.remove();
  };

  /* Crea un elemento con clase y, opcionalmente, texto. */
  HY.el = function (tag, cls, txt) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (txt !== undefined) el.textContent = txt;
    return el;
  };

  /* Construye una opción (radio o casilla) con su etiqueta. */
  HY.choice = function (o) {
    var frag = HY.tpl('tpl-item-choice');
    var label = frag.firstElementChild;
    var input = label.querySelector('input');
    var span = label.querySelector('span');
    if (o.type) input.setAttribute('type', o.type);
    if (o.name) input.setAttribute('name', o.name);
    if (o.value !== undefined) input.setAttribute('value', o.value);
    if (o.checked) input.setAttribute('checked', '');
    if (o.id) input.setAttribute('id', o.id);
    if (o.dataA) input.setAttribute('data-a', o.dataA);
    if (o.dataKey) input.setAttribute('data-key', o.dataKey);
    if (o.dataId) input.setAttribute('data-id', o.dataId);
    if (o.dataF) input.setAttribute('data-f', o.dataF);
    if (o.ariaInvalid) input.setAttribute('aria-invalid', 'true');
    if (o.disabled) {
      input.setAttribute('disabled', '');
      label.setAttribute('aria-disabled', 'true');
      label.style.opacity = '0.45';
      label.style.cursor = 'not-allowed';
      if (o.disabledTitle) label.setAttribute('title', o.disabledTitle);
    }
    if (o.text !== undefined) span.textContent = o.text;
    return label;
  };

})(window.HY);

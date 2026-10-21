/* ============================================================
   HogarYa · datos ilustrativos
   Catálogo de servicios, profesionales, reseñas y listas de
   apoyo. Son datos de demostración: no representan personas ni
   empresas reales.
   ============================================================ */
(function (HY) {
  'use strict';

  var D = HY.data;

  D.CATS = [
    { id: 'electricidad', name: 'Electricidad', desc: 'Tomacorrientes, cortos, luces', icon: 'bolt', kw: 'electricista luz foco cable corto tomacorriente enchufe' },
    { id: 'gasfiteria', name: 'Gasfitería', desc: 'Fugas, caños, terma', icon: 'drop', kw: 'gasfitero agua caño fuga terma tuberia' },
    { id: 'limpieza', name: 'Limpieza', desc: 'Limpieza profunda', icon: 'spark', kw: 'limpiar aseo' },
    { id: 'pintura', name: 'Pintura', desc: 'Paredes y techos', icon: 'roller', kw: 'pintor pintar pared' },
    { id: 'cerrajeria', name: 'Cerrajería', desc: 'Chapas y llaves', icon: 'key', kw: 'cerrajero chapa llave puerta' },
    { id: 'carpinteria', name: 'Carpintería', desc: 'Muebles y puertas', icon: 'hammer', kw: 'carpintero madera mueble' },
    { id: 'jardineria', name: 'Jardinería', desc: 'Poda y mantenimiento', icon: 'leaf', kw: 'jardinero plantas poda' },
    { id: 'electrodomesticos', name: 'Electrodomésticos', desc: 'Reparación de equipos', icon: 'plug', kw: 'tecnico lavadora refrigeradora cocina' },
    { id: 'fumigacion', name: 'Fumigación', desc: 'Plagas y desinfección', icon: 'bug', kw: 'plagas cucarachas ratas' },
    { id: 'mudanzas', name: 'Mudanzas', desc: 'Traslado de muebles', icon: 'truck', kw: 'mudar traslado flete' }
  ];

  function mk(cat, id, name, r, jobs, yrs, price, labor, when, today) {
    return { id: id, cat: cat, name: name, rating: r, jobs: jobs, years: yrs, price: price, labor: labor, when: when, today: today };
  }

  D.PROS = [
    mk('electricidad', 'el1', 'Miguel Huamán', 4.8, 27, 14, 60, 120, 'Hoy, 5:00 pm', true),
    mk('electricidad', 'el2', 'María Salazar', 4.4, 206, 9, 30, 90, 'Hoy, 2:00 pm', true),
    mk('electricidad', 'el3', 'Jorge Rojas', 5.0, 223, 11, 35, 100, 'Mañana, 9:00 am', false),
    mk('gasfiteria', 'ga1', 'Pedro Mendoza', 4.6, 120, 6, 35, 90, 'Hoy, 10:00 am', true),
    mk('gasfiteria', 'ga2', 'Rosa Flores', 4.8, 87, 9, 40, 100, 'Hoy, 2:00 pm', true),
    mk('gasfiteria', 'ga3', 'Luis Campos', 4.3, 54, 4, 30, 80, 'Mañana, 8:00 am', false),
    mk('limpieza', 'li1', 'Lucía Ramos', 4.9, 164, 7, 45, 110, 'Hoy, 3:00 pm', true),
    mk('limpieza', 'li2', 'Sandra Vilca', 4.5, 98, 5, 40, 95, 'Hoy, 6:00 pm', true),
    mk('limpieza', 'li3', 'Marco Quispe', 4.2, 41, 3, 35, 85, 'Mañana, 10:00 am', false),
    mk('pintura', 'pi1', 'Daniel Ortiz', 4.7, 76, 12, 50, 140, 'Mañana, 8:00 am', false),
    mk('pintura', 'pi2', 'Carmen Ríos', 4.6, 59, 8, 45, 130, 'Hoy, 4:00 pm', true),
    mk('pintura', 'pi3', 'Julio Peña', 4.4, 33, 6, 40, 120, 'Hoy, 6:00 pm', true),
    mk('cerrajeria', 'ce1', 'Hugo Paredes', 4.8, 212, 10, 40, 80, 'Hoy, 12:00 m', true),
    mk('cerrajeria', 'ce2', 'Elena Cruz', 4.6, 90, 6, 35, 75, 'Hoy, 3:00 pm', true),
    mk('cerrajeria', 'ce3', 'Raúl Medina', 4.3, 44, 4, 30, 70, 'Mañana, 9:00 am', false),
    mk('carpinteria', 'ca1', 'Tomás Vega', 4.7, 68, 13, 55, 130, 'Mañana, 10:00 am', false),
    mk('carpinteria', 'ca2', 'Nora Díaz', 4.5, 52, 7, 50, 120, 'Hoy, 4:30 pm', true),
    mk('carpinteria', 'ca3', 'Iván Soto', 4.2, 29, 3, 45, 110, 'Hoy, 6:00 pm', true),
    mk('jardineria', 'ja1', 'Alberto León', 4.6, 81, 9, 40, 100, 'Hoy, 9:00 am', true),
    mk('jardineria', 'ja2', 'Rocío Castro', 4.8, 63, 6, 45, 105, 'Mañana, 8:00 am', false),
    mk('jardineria', 'ja3', 'Fabián Torres', 4.4, 37, 4, 35, 90, 'Hoy, 5:00 pm', true),
    mk('electrodomesticos', 'ed1', 'Víctor Arce', 4.7, 134, 11, 50, 100, 'Hoy, 11:00 am', true),
    mk('electrodomesticos', 'ed2', 'Patricia Lara', 4.5, 77, 8, 45, 95, 'Mañana, 9:00 am', false),
    mk('electrodomesticos', 'ed3', 'Sergio Núñez', 4.3, 48, 5, 40, 90, 'Hoy, 5:30 pm', true),
    mk('fumigacion', 'fu1', 'Gloria Mejía', 4.8, 102, 8, 60, 150, 'Mañana, 8:00 am', false),
    mk('fumigacion', 'fu2', 'Óscar Salas', 4.5, 66, 6, 55, 140, 'Hoy, 3:00 pm', true),
    mk('fumigacion', 'fu3', 'Diana Pinto', 4.4, 35, 4, 50, 130, 'Hoy, 5:00 pm', true),
    mk('mudanzas', 'mu1', 'Renzo Bravo', 4.6, 58, 7, 80, 200, 'Mañana, 7:00 am', false),
    mk('mudanzas', 'mu2', 'Katia Huerta', 4.7, 91, 9, 90, 220, 'Hoy, 4:00 pm', true),
    mk('mudanzas', 'mu3', 'Mario Cano', 4.3, 37, 5, 70, 180, 'Hoy, 6:00 pm', true)
  ];

  D.REVIEWS = {
    electricidad: 'Llegó puntual, explicó la falla y dejó todo ordenado.',
    gasfiteria: 'Resolvió la fuga el mismo día y cobró lo acordado.',
    limpieza: 'Dejó la casa impecable y avisó antes de llegar.',
    pintura: 'Cuidó los muebles y el acabado quedó parejo.',
    cerrajeria: 'Abrió la puerta sin dañarla y cambió la chapa.',
    carpinteria: 'Ajustó las puertas y el mueble quedó firme.',
    jardineria: 'Podó con cuidado y se llevó los residuos.',
    electrodomesticos: 'Diagnosticó la falla rápido y explicó el costo.',
    fumigacion: 'Explicó el proceso y las horas de espera.',
    mudanzas: 'Cuidaron los muebles y llegaron a la hora.'
  };

  D.DISTRICTS = ['Los Olivos', 'Comas', 'San Martín de Porres', 'Independencia', 'Carabayllo', 'Puente Piedra', 'Lima Cercado', 'San Miguel', 'Miraflores', 'Surco'];
  D.HOURS = ['8:00 am', '10:00 am', '12:00 m', '2:00 pm', '4:30 pm', '6:00 pm'];
  D.STAGES = ['Enviada', 'Aceptada', 'En camino', 'Finalizada'];
  D.DAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  D.WD = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  D.MON = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  HY.cat = function (id) { return HY.data.CATS.filter(function (c) { return c.id === id; })[0]; };
  HY.pro = function (id) { return HY.data.PROS.filter(function (p) { return p.id === id; })[0]; };

})(window.HY);

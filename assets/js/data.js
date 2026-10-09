/* ==========================================================================
   Instinto Fishing · Datos de la landing
   Todo lo editable (contacto, precios, promos, modelos y colores) vive acá.
   ========================================================================== */

window.GF = {
  config: {
    // WhatsApp de Michael Pintos (dueño), formato internacional sin "+", espacios ni el 0 inicial
    whatsapp: '59899291172',
    whatsappDisplay: '099 291 172',
    instagram: 'instinto_fishing',
    // Poné false para ocultar los precios por unidad en las tarjetas
    showPrices: true,
    // Descuento por cantidad: a partir de minQty señuelos (cualquier mezcla de modelos y colores)
    bulkDiscount: { minQty: 5, percent: 15 },
    freeShippingFrom: 15000,
    greeting: '¡Hola Instinto Fishing! ',
  },

  promos: [
    { qty: 30, price: 6500 },
    { qty: 50, price: 9900 },
    { qty: 100, price: 18500 },
  ],

  // Paleta de colores compartida: el número es el sufijo del código (CPC01, BAN01…)
  colors: {
    1:  { name: 'Cardenal', detail: 'Rojo con blanco', a: '#E3262B', b: '#F6F1EA' },
    2:  { name: 'Verde atigrado', detail: 'Verde con rayas negras', a: '#8FD61F', b: '#16191A', pattern: 'tiger' },
    3:  { name: 'Negro con naranja', detail: 'Cabeza negra, cuerpo naranja', a: '#16191A', b: '#F2481B' },
    4:  { name: 'Naranja con amarillo', detail: 'Cabeza naranja, cuerpo dorado', a: '#F4511E', b: '#F2B321' },
    5:  { name: 'Negro con anillas', detail: 'Negro con anillas amarillas', a: '#16191A', b: '#E5C24A', pattern: 'rings' },
    6:  { name: 'Plata con celeste', detail: 'Plateado con lomo celeste', a: '#CBD5DC', b: '#3BA7DF' },
    7:  { name: 'Amarillo atigrado', detail: 'Amarillo con rayas negras', a: '#E4F01C', b: '#16191A', pattern: 'tiger' },
    8:  { name: 'Blanco con azul', detail: 'Cabeza blanca, cuerpo azul', a: '#F4F6F9', b: '#1F4ED6' },
    9:  { name: 'Blanco con rosado', detail: 'Cabeza blanca, cuerpo rosado', a: '#F6F1F4', b: '#E5369A' },
    10: { name: 'Naranja con blanco', detail: 'Naranja y blanco con rayas negras', a: '#F7661F', b: '#F6F1EA', pattern: 'stripes' },
    11: { name: 'Rojo con verde', detail: 'Cabeza roja, cuerpo verde oscuro', a: '#E3262B', b: '#0F7A55' },
  },

  // Orden y datos tomados del catálogo Temporada 2026/2027
  models: [
    {
      id: 'cpc', code: 'CPC', name: 'Crank Pala Corta', price: 350, especie: 'Tararira',
      tagline: 'Compacto, de paleta corta y con rattling.',
      desc: 'Crank compacto con paleta corta para trabajar cerca de la superficie. Pensado para la tararira y con rattling para llamar su atención.',
      specs: { peso: '13 gr', medida: '7 cm', sonido: 'Rattling', tipo: 'Flota' },
      colors: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    },
    {
      id: 'ban', code: 'BAN', name: 'Banana', price: 420, especie: 'Dorado',
      tagline: 'Exclusivo para dorado, con anzuelos de titanio.',
      desc: 'Señuelo exclusivo, diseñado para la pesca del dorado. Cuenta con rattling, anillas reforzadas y anzuelos de titanio, ideales para la pesca más exigente.',
      specs: { peso: '28 gr', medida: '13 cm', sonido: 'Rattling', tipo: 'Flota' },
      colors: [1, 2, 3, 4, 5, 6, 7, 9, 10],
    },
    {
      id: 'cpl', code: 'CPL', name: 'Crank Pala Larga', price: 420, especie: 'Variada',
      tagline: 'Paleta larga para buscar más profundo.',
      desc: 'La versión de paleta larga del crank: baja más profundo para ir a buscar al pez donde está. Con rattling y apto para pesca variada.',
      specs: { peso: '30 gr', medida: '7,5 cm', sonido: 'Rattling', tipo: 'Flota' },
      colors: [1, 2, 3, 4, 5, 10, 11],
    },
    {
      id: 'sub', code: 'SUB', name: 'Sub Superficie', price: 420, especie: 'Variada',
      tagline: 'Para aguas bajas, justo bajo la superficie.',
      desc: 'Ideal para usar en lugares poco profundos, donde los depredadores esperan o descansan acechando a sus presas.',
      specs: { peso: '30 gr', medida: '8,5 cm', sonido: 'No', tipo: 'Flota' },
      colors: [1, 2, 3, 4, 5, 7, 8, 10, 11],
    },
    {
      id: 'pas', code: 'PAS', name: 'Paseante', price: 420, especie: 'Variada',
      tagline: 'Nado en zigzag en plena superficie.',
      desc: 'Señuelo de superficie con nado en zigzag. Ideal para lugares poco profundos, donde los depredadores esperan acechando a sus presas.',
      specs: { peso: '34 gr', medida: '12 cm', sonido: 'Rattling', tipo: 'Flota' },
      colors: [1, 2, 4, 5, 8, 9],
    },
    {
      id: 'min', code: 'MIN', name: 'Minnow', price: 350, especie: 'Tararira',
      tagline: 'Silueta de pececito, liviano y con rattling.',
      desc: 'Cuerpo alargado que imita a un pez pequeño. Ideal para lugares poco profundos, donde la tararira espera acechando a sus presas.',
      specs: { peso: '15 gr', medida: '10 cm', sonido: 'Rattling', tipo: 'Flota' },
      colors: [1, 2, 3, 4, 5, 8, 9, 10],
    },
    {
      id: 'ran', code: 'RAN', name: 'Rana', price: 350, especie: 'Tararira',
      tagline: 'Rana de superficie con faldas de silicona.',
      desc: 'Rana de superficie con faldas de silicona, para buscar a la tararira en lugares poco profundos, donde espera o descansa acechando a sus presas.',
      specs: { peso: '16 gr', medida: '7 cm', sonido: 'Rattling', tipo: 'Flota' },
      colors: [1, 2, 4],
    },
    {
      id: 'pom', code: 'POM', name: 'Popper Mediano', price: 350, especie: 'Tararira',
      tagline: 'El “plop” que despierta a la tararira.',
      desc: 'Modelo ideal para llamar la atención de los peces: con un leve movimiento de la caña genera el “plop” que los atrae al señuelo.',
      specs: { peso: '15 gr', medida: '8,5 cm', sonido: 'Plop', tipo: 'Flota' },
      colors: [2, 3, 4, 11],
    },
    {
      id: 'pog', code: 'POG', name: 'Popper Grande', price: 420, especie: 'Dorado',
      tagline: 'Popper de 13 cm y 52 gr para dorado.',
      desc: 'Popper grande para dorado. Ideal para llamar la atención de los peces y atraerlos al señuelo con un leve movimiento de la caña.',
      specs: { peso: '52 gr', medida: '13 cm', sonido: 'Rattling', tipo: 'Flota' },
      colors: [1, 2, 7],
    },
    {
      id: 'art', code: 'ART', name: 'Articulado', price: 420, especie: 'Variada',
      tagline: 'Cuerpo articulado de 15 cm. Se hunde.',
      desc: 'Cuerpo articulado de 15 cm que se hunde, para trabajarlo a media agua. Llama la atención de los peces con un leve movimiento de la caña.',
      specs: { peso: '34 gr', medida: '15 cm', sonido: 'No', tipo: 'Se hunde' },
      colors: [1, 2, 4, 6],
    },
    {
      id: 'whp', code: 'WHP', name: 'Whopper Popper', price: 350, especie: 'Tararira',
      tagline: 'Cola giratoria y sonido plop en superficie.',
      desc: 'Popper con cola giratoria que hace “plop” en superficie. Ideal para llamar la atención de los peces con un leve movimiento de la caña.',
      specs: { peso: '15 gr', medida: '11 cm', sonido: 'Plop', tipo: 'Flota' },
      colors: [1, 2, 3, 4, 5, 10, 11],
    },
    {
      id: 'moj', code: 'MOJ', name: 'Mojarra', price: 350, especie: 'Tararira',
      tagline: 'Paleta 2 para trolling o lance en profundidad.',
      desc: 'Con una paleta 2, es ideal para buscarlos a más profundidad, tanto en trolling como en lance.',
      specs: { peso: '15 gr', medida: '11 cm', sonido: 'Plop', tipo: 'Flota' },
      colors: [1, 2, 4, 5, 8, 11],
    },
  ],
};

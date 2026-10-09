# Instinto Fishing · Landing de señuelos

Sitio estático (HTML + CSS + JS, sin dependencias ni build). Se puede abrir `index.html` directo en el navegador o subir la carpeta tal cual a cualquier hosting (Netlify, Vercel, GitHub Pages, cPanel…).

## Qué editar

Todo el contenido variable está en **`assets/js/data.js`**:

- `config.whatsapp`: número en formato internacional sin `+` ni el 0 inicial (`099 291 172` → `59899291172`). Es el de Michael Pintos, dueño del negocio.
- `config.instagram`: usuario de Instagram sin `@` (hoy `instinto_fishing`, el link queda `instagram.com/instinto_fishing`).
- `config.showPrices`: `false` oculta los precios por unidad en las tarjetas.
- `config.bulkDiscount`: `{ minQty, percent }` — el descuento por cantidad (hoy 5 señuelos o más, 15% OFF). Se usa en el catálogo, en Promos y en el modal; cambiar los dos números acá alcanza para actualizarlo en todos lados.
- `promos`: cantidades y precios de las promos (30/50/100). El precio por señuelo y la etiqueta de envío gratis se calculan solos.
- `models`: los 12 modelos (nombre, precio, especie, specs, descripción y colores disponibles). Precio actual: $350 c/u para los que antes costaban $220–225, $420 c/u para el resto.
- `colors`: la paleta compartida de 11 colores. El número es el sufijo del código (`CPC01`, `BAN01`…).

## Imágenes

- `assets/img/lures/{codigo}.webp`: una foto por variante (77), recortadas del catálogo 2026/27. Para agregar un color nuevo, sumá la imagen con el código en minúsculas (`cpc12.webp`) y el número en `colors` del modelo.
- `assets/img/cutouts/`: señuelos con fondo transparente para las animaciones.
- `assets/img/hero.*`: foto principal. `og.jpg` es la imagen que aparece al compartir el link.

## Precios

Los precios de los señuelos ($350 / $420) ya son los definitivos de Instinto Fishing. Las promos de la sección Promos (30/50/100 señuelos) y el envío gratis desde $15.000 siguen siendo las cifras del catálogo mayorista de GO Fishing — confirmar si aplican igual antes de publicar.

El PDF del catálogo (el que usamos para sacar fotos y specs) también tiene estos precios actualizados — ver `Catálogo Instinto Fishing - precios actualizados.pdf` en el Escritorio. Ojo: la tapa y la contratapa de ese PDF todavía muestran la marca y el WhatsApp de GO Fishing (no se tocaron), solo se actualizó el precio de cada una de las 12 páginas de modelos.

## Sección Carpa (`#carpa`)

Trampa coreana y Harinado son productos a consulta (sin precio fijo todavía): el botón manda un WhatsApp con el pedido de información. Las dos tarjetas usan un ícono/gráfico propio, no son fotos reales del producto — se pueden reemplazar más adelante por fotos (ver `.carp-ico` en `styles.css`).

Las dos fotos de la derecha (`assets/img/carp-1.webp`, `carp-2.webp`) son fotos reales que mandó el cliente.

## Ubicación (`#ubicacion`)

El mapa embebido apunta al centro del pueblo "Aguas Corrientes, Canelones" (sin dirección puntual). Si tienen un local o punto de entrega con dirección exacta, cambiar el `q=` del iframe en `index.html` por esa dirección.

## Notas del catálogo

- En la hoja de Banana, el color 10 figura como `MIN10`; en la landing se usa `BAN10`.
- En Popper Mediano, el color 04 figura como `MOJ04`; en la landing se usa `POM04`.

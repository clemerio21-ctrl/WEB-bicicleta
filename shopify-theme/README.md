# Vortex Crew — Tema de Shopify

Versión del diseño de Vortex Crew construida como un tema real de Shopify (Online Store 2.0, Liquid), para instalar en tu tienda existente y ver cómo queda con tus productos y tu checkout reales — carrito y "Comprar ahora" funcionan de verdad, no son de ejemplo como en la demo estática.

## Cómo probarlo en tu tienda (sin tocar tu tienda actual)

1. En el admin de Shopify: **Tienda online → Temas**.
2. Bajá hasta la sección **"Biblioteca de temas"** y hacé clic en **"Agregar tema" → "Subir archivo zip"**.
3. Subí `vortex-crew-shopify-theme.zip` (está en la carpeta principal del proyecto, junto a esta carpeta `shopify-theme/`).
4. El tema se agrega como **borrador**, sin publicarse — tu tienda sigue mostrando el tema actual a los clientes. Podés previsualizarlo con el botón "Vista previa" y compartir ese link privado con quien quieras, sin que nadie más lo vea.
5. Recién si te gusta y querés dejarlo como tienda oficial, lo publicás desde ahí mismo.

## Qué configurar en el editor de temas para que se vea bien

El tema viene con contenido de ejemplo (textos, colores) pero **el video del hero no viene incluido** — hay que subirlo desde el editor:

1. **Tienda online → Personalizar** (con el tema recién subido seleccionado).
2. En la sección **"Hero de portada"** (la primera, arriba de todo): subí el video (`hero-video.mp4` está en `assets/videos/` de la carpeta principal del proyecto) y una foto de respaldo para celular en los campos correspondientes.
3. En **"Colección destacada"**: elegí qué colección de productos tuyos mostrar como destacados.
4. En **"Categorías"**: cada uno de los 3 bloques necesita que le asignes una colección tuya (así se arma el link y la foto).
5. En **"Sobre nosotros"**: cambiá la foto y el texto por el real de la marca.
6. Configuración del tema (ícono de ajustes, abajo a la izquierda del editor) → podés cambiar el **color de marca** (por defecto el naranja de Vortex) y subir un favicon.

## Detalles que conviene saber

- **Insignias "Nuevo" / "Más vendida"**: se activan agregando el tag `nuevo` o `más vendida` a un producto (Productos → [producto] → Etiquetas). No es automático por fecha, para que vos controles cuáles mostrar.
- **Filtro por talla y color** en las páginas de categoría: usa el sistema nativo de filtros de Shopify. Para que el filtro de color muestre el circulito de color en vez de una lista de texto, la opción del producto tiene que llamarse exactamente **"Color"**. Para el link de "Guía de talles", la opción tiene que llamarse **"Talla"** o **"Size"**. Cualquier otro nombre de opción igual funciona, solo se muestra como lista de texto genérica.
- **Colores de los círculos de talla/color**: hay una lista de nombres reconocidos en español e inglés (negro, blanco, gris, naranja, azul, rojo, verde, amarillo, rosa, café, morado, beige) en `snippets/color-swatch-hex.liquid`. Si usas un nombre de color que no está en la lista, se muestra un círculo gris neutro — se puede agregar más colores editando ese archivo.
- **Menús**: el header usa el menú "Menú principal" (`main-menu`) y el footer usa "Footer" (`footer`) — los que Shopify crea por defecto en cualquier tienda nueva. Si tu tienda antigua tiene otros nombres de menú, se cambia en el editor, en la sección Header/Footer.

## Qué no está incluido en esta pasada

Para enfocarnos en "cómo se ve" (que era el pedido), no se construyeron páginas de blog ni páginas de contenido genéricas (`templates/page.json`, `templates/blog.json`, `templates/article.json`) — Shopify muestra esas páginas con su diseño por defecto si las usás. Si más adelante se decide ir en serio con Shopify, se pueden agregar.

## Estructura del tema

```
layout/theme.liquid          Envoltorio de toda la tienda (head, header, footer, overlay de búsqueda)
sections/hero.liquid          Hero con video (editable desde el editor de temas)
sections/featured-collection  Grilla de productos destacados
sections/categories.liquid    Las 3 tarjetas de categoría
sections/about.liquid         Sobre nosotros
sections/newsletter.liquid    Formulario real de suscripción de Shopify
sections/main-product.liquid  Página de producto (variantes, carrito, Comprar ahora reales)
sections/main-collection.liquid  Categoría con orden y filtro nativos de Shopify
sections/main-cart.liquid     Carrito real
sections/main-search.liquid   Resultados de búsqueda reales
assets/theme.css              Mismos estilos de la demo, adaptados
assets/theme.js               Selector de variantes, carrito AJAX, menú, acordeón, etc.
```

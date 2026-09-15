// Crea una preferencia de pago en Mercado Pago y devuelve el link de checkout.
// Requiere la variable de entorno MP_ACCESS_TOKEN configurada en Vercel
// (Project Settings -> Environment Variables). Usar primero el Access Token
// de PRUEBA de Mercado Pago para testear con tarjetas de prueba antes de
// pasar a producción.

// El precio vive acá, no en el navegador, para que nadie pueda manipular
// el monto a pagar desde las herramientas de desarrollador.
var CATALOGO = {
  'polera-araucaria': { title: 'Polera Araucaria', price: 27990 }
};

// Costo de envío por zona (confirmado con el cliente). Igual que el precio
// del producto, se calcula acá y no se confía en nada que mande el navegador.
var COSTOS_ENVIO = { rm: 3990, otras: 6990 };

var stripControlChars = function (s) { return s.replace(/[\r\n\t]/g, ' '); };
var limpiar = function (v, max) { return stripControlChars((v || '').toString().trim()).slice(0, max); };

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  var accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    res.status(500).json({ error: 'Falta configurar MP_ACCESS_TOKEN en Vercel (Settings -> Environment Variables).' });
    return;
  }

  var body = req.body || {};
  var productId = body.productId;
  /* Object.prototype.hasOwnProperty evita que alguien pase productId como
     "constructor", "toString", etc. y reciba una propiedad heredada del
     objeto en vez de "no encontrado" (lo que mandaría un pago sin precio). */
  var item = (typeof productId === 'string' && Object.prototype.hasOwnProperty.call(CATALOGO, productId))
    ? CATALOGO[productId]
    : null;
  if (!item || typeof item.price !== 'number' || !(item.price > 0)) {
    res.status(400).json({ error: 'Producto no reconocido.' });
    return;
  }

  var zona = body.zona;
  var costoEnvio = Object.prototype.hasOwnProperty.call(COSTOS_ENVIO, zona) ? COSTOS_ENVIO[zona] : null;
  if (costoEnvio === null) {
    res.status(400).json({ error: 'Selecciona a qué zona enviamos tu pedido.' });
    return;
  }

  var nombre = limpiar(body.nombre, 100);
  var apellido = limpiar(body.apellido, 100);
  var direccion = limpiar(body.direccion, 200);
  var comuna = limpiar(body.comuna, 100);
  var telefono = limpiar(body.telefono, 40);
  if (!nombre || !apellido || !direccion || !comuna || !telefono) {
    res.status(400).json({ error: 'Completa todos los datos de entrega.' });
    return;
  }

  var proto = req.headers['x-forwarded-proto'] || 'https';
  var origin = proto + '://' + req.headers.host;

  try {
    var mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      },
      body: JSON.stringify({
        items: [
          {
            title: item.title,
            quantity: 1,
            unit_price: item.price,
            currency_id: 'CLP'
          }
        ],
        shipments: {
          cost: costoEnvio,
          mode: 'not_specified'
        },
        payer: {
          name: nombre,
          surname: apellido,
          phone: { number: telefono },
          address: { street_name: direccion + ', ' + comuna }
        },
        /* Queda guardado junto al pago en Mercado Pago (se puede consultar
           desde su panel o la API) para saber dónde despachar el pedido. */
        metadata: {
          nombre: nombre,
          apellido: apellido,
          direccion: direccion,
          comuna: comuna,
          telefono: telefono,
          zona: zona
        },
        back_urls: {
          success: origin + '/gracias.html',
          failure: origin + '/producto.html?pago=fallo',
          pending: origin + '/producto.html?pago=pendiente'
        },
        auto_return: 'approved'
      })
    });

    var data = await mpRes.json();

    if (!mpRes.ok) {
      res.status(502).json({ error: (data && data.message) || 'Mercado Pago rechazó la solicitud.' });
      return;
    }

    res.status(200).json({ url: data.sandbox_init_point || data.init_point });
  } catch (err) {
    res.status(500).json({ error: 'No se pudo contactar a Mercado Pago.' });
  }
};

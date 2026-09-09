// Crea una preferencia de pago en Mercado Pago y devuelve el link de checkout.
// Requiere la variable de entorno MP_ACCESS_TOKEN configurada en Vercel
// (Project Settings -> Environment Variables). Usar primero el Access Token
// de PRUEBA de Mercado Pago para testear con tarjetas de prueba antes de
// pasar a producción.

// El precio vive acá, no en el navegador, para que nadie pueda manipular
// el monto a pagar desde las herramientas de desarrollador.
var CATALOGO = {
  'tricota-aero': { title: 'Tricota Aero Manga Corta', price: 39990 }
};

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
  var item = CATALOGO[productId];
  if (!item) {
    res.status(400).json({ error: 'Producto no reconocido.' });
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
        back_urls: {
          success: origin + '/producto.html?pago=exito',
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

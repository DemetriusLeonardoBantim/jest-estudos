const express = require('express');
const cors = require('cors');

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const compras = [];

app.get('/cart', (request, response) => {
  return response.json(compras);
});

app.post('/cart', (request, response) => {
  const { nome, produto } = request.body;

  const compra = { id: uuid(), nome, produto };

  compras.push(compra);

  return response.json(compra);
});

app.put('/cart/:id', (request, response) => {
  const { id } = request.params;
  const { nome, produto } = request.body;
  const compraIndex = compras.findIndex((compra) => compra.id === id);

  if (compraIndex === -1) {
    return response.status(400).json({ error: 'Compra not found' });
  }

  const compra = {
    id,
    nome,
    produto,
  };
  compras[compraIndex] = compra;

  return response.json(compra);
});

app.delete('/cart/:id', (request, response) => {
  const { id } = request.params;

  const comprasIndex = compras.findIndex((compra) => compra.id === id);

  if (comprasIndex < 0) {
    return response.status(400).json({ error: 'Compra not found' });
  }

  compras.splice(comprasIndex, 1);

  return response.status(204).send();
});

module.exports = app;

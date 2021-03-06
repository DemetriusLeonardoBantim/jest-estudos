const request = require('supertest');
const app = require('../app.js');
const { validate: isUuid } = require('uuid');

// OK - A aplicacao deve permitir que um campo de compra seja criado, e retorne um json com o projeto criado
// OK - A aplicacao deve permitir que todas as compras sejam retornadas em um array
// OK -  A aplicacao deve permitir que sejam alterados o campo de compra
// OK -A aplicacao devera ser capaz de detelar o id da compra. Caso nao exista, retornar um erro com status 404

describe('Compras', () => {
  it('O usuario deve ser capaz de realizar compras', async () => {
    const response = await request(app)
      .post('/cart')
      .send({
        nome: 'Demetrius Leonardo',
        produto: ['Beterraba', 'Macarrao'],
      });

    expect(isUuid(response.body.id)).toBe(true);

    expect(response.body).toMatchObject({
      nome: 'Demetrius Leonardo',
      produto: ['Beterraba', 'Macarrao'],
    });
  });
  it('retornar um array com todas as compras efetuadas', async () => {
    const compra = await await request(app)
      .post('/cart')
      .send({
        nome: 'Demetrius Leonardo',
        produto: ['Beterraba', 'Macarrao'],
      });
    const response = await request(app).get('/cart');
    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          id: compra.body.id,
          nome: 'Demetrius Leonardo',
          produto: ['Beterraba', 'Macarrao'],
        },
      ])
    );
  });
  it('A aplicacao deve pertimir alteracoes na compra', async () => {
    const compra = await await request(app)
      .post('/cart')
      .send({
        nome: 'Demetrius Leonardo',
        produto: ['Beterraba', 'Macarrao'],
      });
    const response = await request(app)
      .put(`/cart/${compra.body.id}`)
      .send({
        nome: 'Demetrius',
        produto: ['Beterraba', 'Macarrao', 'Feijao'],
      });
    expect(isUuid(response.body.id)).toBe(true);

    expect(response.body).toMatchObject({
      nome: 'Demetrius',
      produto: ['Beterraba', 'Macarrao', 'Feijao'],
    });
  });
  it('podera deleter/cancelar a compra', async () => {
    const response = await request(app)
      .post('/cart')
      .send({
        nome: 'Demetrius Leonardo',
        produto: ['Beterraba', 'Macarrao'],
      });
    await request(app).delete(`/cart/${response.body.id}`).expect(204);
    const compras = await request(app).get('/cart');
    const compra = compras.body.find((r) => r.id === response.body.id);

    expect(compra).toBe(undefined);
  });
});

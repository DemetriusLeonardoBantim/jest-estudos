const request = require('supertest');
const app = require('../app.js');
const { validate: isUuid } = require('uuid');

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
});

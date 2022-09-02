process.env.NODE_ENV = 'test'; 

const request = require('supertest'); 
const app = require('../app'); 
const db = require('../db'); 

let testInvoice; 

beforeEach(async () => {
  await db.query(`Insert Into companies (code, name, description) Values ('test', 'Test Company', 'This is a test company') Returning code, name, description`); 
  const results = await db.query(`Insert Into invoices (comp_code, amt) Values ('test', 2000) Returning id, comp_code, amt, paid, add_date, paid_date`); 
  testInvoice = results.rows[0]; 
})

afterEach(async () => {
  await db.query(`Delete From invoices`);
  await db.query(`Delete From companies`);
})

afterAll(async () => {
  await db.end();
})

describe('GET /invoices', () => {
  test('Get all invoices', async () => {
    const res = await request(app).get('/invoices'); 

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ invoices: [{ comp_code: 'test', id: expect.any(Number) }] })
  })
})


describe('GET /invoices/:id', () => {
  test('Get a single company', async() => {
    const res = await request(app).get(`/invoices/${testInvoice.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ invoice: {
      "add_date": "2022-09-02T07:00:00.000Z",
      "amt": 2000,
      "comp_code": "test",
      "id": testInvoice.id,
      "paid": false,
      "paid_date": null,
    } }); 
  })
})

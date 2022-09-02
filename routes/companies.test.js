process.env.NODE_ENV = 'test'; 

const request = require('supertest'); 
const app = require('../app'); 
const db = require('../db'); 

let testCompany; 

beforeEach(async () => {
  const results = await db.query(`Insert Into companies (code, name, description) Values ('test', 'Test Company', 'This is a test company') Returning code, name, description`); 
  testCompany = results.rows[0]; 
})

afterEach(async () => {
  await db.query(`Delete From companies`);
})

afterAll(async () => {
  await db.end();
})

describe('GET /companies', () => {
  test('Get all companies', async () => {
    const res = await request(app).get('/companies'); 

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ companies: [testCompany] })
  })
})


describe('GET /companies/:code', () => {
  test('Get a single company', async() => {
    const res = await request(app).get(`/companies/${testCompany.code}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      { 
        "company": {
          code: "test",
          name: "Test Company", 
          description: "This is a test company",
          invoices: []
        }
      }
    ); 
  })
})

describe('POST /companies', () => {
  test('Creating a new company', async () => {
    const res = await request(app)
      .post(`/companies`)
      .send({ "code": "test2", name: "Test 2", description: "This is a test"});

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        company: {
          code: "test2",
          name: "Test 2", 
          description: "This is a test"
        }
      })
  })
})

describe('PATCH /campanies/:code', () => {
  test('Updating a company', async () => {
    const res = await request(app)
      .patch(`/companies/${testCompany.code}`)
      .send({ code: 'test', name: 'Testing Company', description: 'This is a test company' });

    expect(res.statusCode).toBe(200); 
  })
})

describe('DELETE /companies/:code', () => {
  test('Delete a single company', async () => {
    const res = await request(app).delete(`/companies/${testCompany.code}`);

    expect(res.statusCode).toBe(200); 
    expect(res.body).toEqual({ msg: 'Deleted' }); 
  })
})
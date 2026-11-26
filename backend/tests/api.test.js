const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

const api = '/api/v1';
let studentToken, recruiterToken, adminToken, jobId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
  await mongoose.connection.dropDatabase();
  await User.create({ name: 'Admin', email: 'admin@test.com', password: 'Admin@1234', role: 'admin' });
});
afterAll(async () => { await mongoose.connection.dropDatabase(); await mongoose.disconnect(); });

describe('Auth', () => {
  it('registers a student', async () => {
    const r = await request(app).post(`${api}/auth/register`).send({ name: 'Stu', email: 's@test.com', password: 'Password123' });
    expect(r.statusCode).toBe(201); studentToken = r.body.data.token;
    expect(r.body.data.user.role).toBe('student');
  });
  it('rejects duplicate email (409)', async () => {
    const r = await request(app).post(`${api}/auth/register`).send({ name: 'Stu', email: 's@test.com', password: 'Password123' });
    expect(r.statusCode).toBe(409);
  });
  it('cannot self-register as admin (400)', async () => {
    const r = await request(app).post(`${api}/auth/register`).send({ name: 'Bad', email: 'b@test.com', password: 'Password123', role: 'admin' });
    expect(r.statusCode).toBe(400);
  });
  it('rejects wrong password (401)', async () => {
    const r = await request(app).post(`${api}/auth/login`).send({ email: 's@test.com', password: 'wrongpass' });
    expect(r.statusCode).toBe(401);
  });
  it('blocks private route without token (401)', async () => {
    expect((await request(app).get(`${api}/auth/me`)).statusCode).toBe(401);
  });
});

describe('Jobs and RBAC', () => {
  beforeAll(async () => {
    const rec = await request(app).post(`${api}/auth/register`).send({ name: 'Rec', email: 'r@test.com', password: 'Password123', role: 'recruiter', company: 'Acme' });
    recruiterToken = rec.body.data.token;
    adminToken = (await request(app).post(`${api}/auth/login`).send({ email: 'admin@test.com', password: 'Admin@1234' })).body.data.token;
  });
  it('student cannot create a job (403)', async () => {
    const r = await request(app).post(`${api}/jobs`).set('Authorization', `Bearer ${studentToken}`)
      .send({ title: 'X', company: 'Y', requiredSkills: ['python'] });
    expect(r.statusCode).toBe(403);
  });
  it('validation error on empty skills (400)', async () => {
    const r = await request(app).post(`${api}/jobs`).set('Authorization', `Bearer ${recruiterToken}`)
      .send({ title: 'X', company: 'Y', requiredSkills: [] });
    expect(r.statusCode).toBe(400);
  });
  it('recruiter job starts as pending and is hidden from students', async () => {
    const c = await request(app).post(`${api}/jobs`).set('Authorization', `Bearer ${recruiterToken}`)
      .send({ title: 'Backend Dev', company: 'Acme', requiredSkills: ['python', 'sql'] });
    expect(c.statusCode).toBe(201); expect(c.body.data.status).toBe('pending'); jobId = c.body.data._id;
    const list = await request(app).get(`${api}/jobs`).set('Authorization', `Bearer ${studentToken}`);
    expect(list.body.data.length).toBe(0);
  });
  it('admin approves, then student sees it with pagination info', async () => {
    const u = await request(app).put(`${api}/jobs/${jobId}`).set('Authorization', `Bearer ${adminToken}`).send({ status: 'approved' });
    expect(u.statusCode).toBe(200);
    const list = await request(app).get(`${api}/jobs`).set('Authorization', `Bearer ${studentToken}`);
    expect(list.body.data.length).toBe(1); expect(list.body.pagination.total).toBe(1);
  });
  it('student cannot apply without a resume (400)', async () => {
    const r = await request(app).post(`${api}/jobs/${jobId}/apply`).set('Authorization', `Bearer ${studentToken}`);
    expect(r.statusCode).toBe(400);
  });
  it('unknown id returns 404 / bad id returns 400', async () => {
    expect((await request(app).put(`${api}/jobs/64b000000000000000000000`).set('Authorization', `Bearer ${adminToken}`).send({})).statusCode).toBe(404);
    expect((await request(app).put(`${api}/jobs/abc`).set('Authorization', `Bearer ${adminToken}`).send({})).statusCode).toBe(400);
  });
});

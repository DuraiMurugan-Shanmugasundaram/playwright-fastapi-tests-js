//Author - DuraiMurugan_Shanmugasundaram
import { test, expect } from '@playwright/test';
import { loadConfig } from '../utils/configLoader';
const config = loadConfig();

test('@CreateUser Create User with valid data - should return 201 and match input', async ({ request }) => {
  const payload = { name: 'Durai', email: 'durai@example.com' };
  const res = await request.post('/users', { data: payload });
  expect(res.status()).toBe(201);
  const json = await res.json();
  expect(json).toHaveProperty('id');
  expect(json.name).toBe(payload.name);
  expect(json.email).toBe(payload.email);
  expect(res.headers()['content-type']).toContain('application/json');
});

test('@Smoke Create User with missing email - should return 400 and error message', async ({ request }) => {
  const payload = { name: 'Durai' };
  const res = await request.post('/users', { data: payload });
  expect(res.status()).toBeGreaterThanOrEqual(400);
  const json = await res.json();
  expect(json).toHaveProperty('detail');
});

test('Create User with invalid email format - should return 400 with validation error', async ({ request }) => {
  const payload = { name: 'Durai', email: 'invalidemail' };
  const res = await request.post('/users', { data: payload });
  expect(res.status()).toBeGreaterThanOrEqual(400);
  const json = await res.json();
  expect(json).toHaveProperty('detail');
});

test('Read User by valid ID - should return 200 and correct user data', async ({ request }) => {
  const payload = { name: 'Durai', email: 'durai.read@example.com' };
  const create = await request.post('/users', { data: payload });
  const user = await create.json();
  const res = await request.get(`/users/${user.id}`);
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toMatchObject(payload);
  expect(json).toHaveProperty('id');
});

test('Read User with non-existing ID - should return 404 with detail', async ({ request }) => {
  const res = await request.get('/users/999999');
  expect(res.status()).toBe(404);
  const json = await res.json();
  expect(json).toHaveProperty('detail');
});

test('Update User with valid ID - should return 200 and updated info', async ({ request }) => {
  const payload = { name: 'Durai', email: 'durai.update@example.com' };
  const create = await request.post('/users', { data: payload });
  const user = await create.json();
  const update = await request.put(`/users/${user.id}`, {
    data: { ...payload, name: 'Updated Name' }
  });
  expect(update.status()).toBe(200);
  const json = await update.json();
  expect(json.name).toBe('Updated Name');
  expect(json.email).toBe(payload.email);
});

test('Update User with invalid ID - should return 404 and error', async ({ request }) => {
  const payload = { name: 'Nobody', email: 'nobody@example.com' };
  const res = await request.put('/users/999999', { data: payload });
  expect(res.status()).toBe(404);
  const json = await res.json();
  expect(json).toHaveProperty('detail');
});

test('Delete User by valid ID - should return 204 and no content', async ({ request }) => {
  const payload = { name: 'Delete Me', email: 'deleteme@example.com' };
  const create = await request.post('/users', { data: payload });
  const user = await create.json();
  const del = await request.delete(`/users/${user.id}`);
  expect(del.status()).toBe(204);
  expect(await del.text()).toBe('');
});

test('Delete User with invalid ID - should return 404 and error detail', async ({ request }) => {
  const res = await request.delete('/users/999999');
  expect(res.status()).toBe(404);
  const json = await res.json();
  expect(json).toHaveProperty('detail');
});


//As now the test data is passed directly inside the test files as "payload objects", like below 
//  --> const payload = { name: 'Durai', email: 'durai@example.com' };

//**Benefits of Moving to JSON-Based Test Data**//
//Migrating test inputs into external JSON files will help you:

// -->Separate logic from data
// -->Reuse test data across multiple tests
// -->Maintain large test data easily
// -->Enable data-driven testing using loops or test.describe()

//Code Example:
import { test, expect } from '@playwright/test';
import fs from 'fs';

const userData = JSON.parse(fs.readFileSync('./testdata/user.json', 'utf-8'));

for (const user of userData.positive) {
  test(`Create User with valid data - Positive: ${user.name}`, async ({ request }) => {
    const res = await request.post('/users', { data: { name: user.name, email: user.email } });
    expect(res.status()).toBe(user.expectedStatus);
    const json = await res.json();
    expect(json).toHaveProperty('id');
    expect(json.name).toBe(user.name);
    expect(json.email).toBe(user.email);
  });
}

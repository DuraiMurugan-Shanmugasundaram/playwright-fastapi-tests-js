
import { test, expect } from '@playwright/test';
import { loadConfig } from '../utils/configLoader';
const config = loadConfig();

test('Create User with valid data - should return 201 and match input @Create', async ({ request }) => {
  const payload = { name: 'Durai', email: 'durai@example.com' };
  const res = await request.post('/users', { data: payload });
  expect(res.status()).toBe(201);
  const json = await res.json();
  expect(json).toMatchObject(payload);
});

test('Create User with missing email - should return 400', async ({ request }) => {
  const payload = { name: 'Durai' };
  const res = await request.post('/users', { data: payload });
  expect(res.status()).toBeGreaterThanOrEqual(400);
});

test('Create User with invalid email format - should return 400', async ({ request }) => {
  const payload = { name: 'Durai', email: 'invalidemail' };
  const res = await request.post('/users', { data: payload });
  expect(res.status()).toBeGreaterThanOrEqual(400);
});

test('Read User by valid ID - should return 200 and correct user @Read', async ({ request }) => {
  const payload = { name: 'Durai', email: 'durai.read@example.com' };
  const create = await request.post('/users', { data: payload });
  const user = await create.json();
  const res = await request.get(`/users/${user.id}`);
  expect(res.status()).toBe(200);
  expect(await res.json()).toMatchObject(payload);
});

test('Read User with non-existing ID - should return 404', async ({ request }) => {
  const res = await request.get('/users/999999');
  expect(res.status()).toBe(404);
});

test('Update User with valid ID - should return 200 and updated name', async ({ request }) => {
  const payload = { name: 'Durai', email: 'durai.update@example.com' };
  const create = await request.post('/users', { data: payload });
  const user = await create.json();
  const update = await request.put(`/users/${user.id}`, {
    data: { ...payload, name: 'Updated Name' }
  });
  expect(update.status()).toBe(200);
  expect((await update.json()).name).toBe('Updated Name');
});

test('Update User with invalid ID - should return 404', async ({ request }) => {
  const payload = { name: 'Nobody', email: 'nobody@example.com' };
  const res = await request.put('/users/999999', { data: payload });
  expect(res.status()).toBe(404);
});

test('Delete User by valid ID - should return 204', async ({ request }) => {
  const payload = { name: 'Delete Me', email: 'deleteme@example.com' };
  const create = await request.post('/users', { data: payload });
  const user = await create.json();
  const del = await request.delete(`/users/${user.id}`);
  expect(del.status()).toBe(204);
});

test('Delete User with invalid ID - should return 404', async ({ request }) => {
  const res = await request.delete('/users/999999');
  expect(res.status()).toBe(404);
});

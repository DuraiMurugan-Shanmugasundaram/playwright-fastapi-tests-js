//Author - DuraiMurugan_Shanmugasundaram
import { test, expect } from '@playwright/test';
import { loadConfig } from '../utils/configLoader';
const config = loadConfig();

test('Create Book with valid data - should return 201 and match input', async ({ request }) => {
  const payload = { title: 'Effective Testing', author: 'Jane Doe', isbn: '9876543210' };
  const res = await request.post('/books', { data: payload });
  expect(res.status()).toBe(201);
  const json = await res.json();
  expect(json).toHaveProperty('id');
  expect(json.title).toBe(payload.title);
  expect(json.author).toBe(payload.author);
  expect(json.isbn).toBe(payload.isbn);
  expect(res.headers()['content-type']).toContain('application/json');
});

test('Create Book with missing title - should return 400 and error detail', async ({ request }) => {
  const payload = { author: 'Jane Doe', isbn: '9876543210' };
  const res = await request.post('/books', { data: payload });
  expect(res.status()).toBeGreaterThanOrEqual(400);
  const json = await res.json();
  expect(json).toHaveProperty('detail');
});

test('Create Book with invalid ISBN - should return 400 and error message', async ({ request }) => {
  const payload = { title: 'Bad ISBN', author: 'Jane Doe', isbn: 'badisbn' };
  const res = await request.post('/books', { data: payload });
  expect(res.status()).toBeGreaterThanOrEqual(400);
  const json = await res.json();
  expect(json).toHaveProperty('detail');
});

test('Read Book by valid ID - should return 200 and correct book', async ({ request }) => {
  const payload = { title: 'Read Test', author: 'Jane Doe', isbn: '1233211234' };
  const create = await request.post('/books', { data: payload });
  const book = await create.json();
  const res = await request.get(`/books/${book.id}`);
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json).toMatchObject(payload);
  expect(json).toHaveProperty('id');
});

test('Read Book with non-existing ID - should return 404 with detail', async ({ request }) => {
  const res = await request.get('/books/999999');
  expect(res.status()).toBe(404);
  const json = await res.json();
  expect(json).toHaveProperty('detail');
});

test('Update Book with valid data - should return 200 and updated info', async ({ request }) => {
  const payload = { title: 'Old Title', author: 'Jane', isbn: '5555555555' };
  const create = await request.post('/books', { data: payload });
  const book = await create.json();
  const update = await request.put(`/books/${book.id}`, {
    data: { ...payload, title: 'New Title' }
  });
  expect(update.status()).toBe(200);
  const json = await update.json();
  expect(json.title).toBe('New Title');
  expect(json.author).toBe(payload.author);
  expect(json.isbn).toBe(payload.isbn);
});

test('Update Book with invalid ID - should return 404 and error', async ({ request }) => {
  const payload = { title: 'Does Not Exist', author: 'Nobody', isbn: '1112223333' };
  const res = await request.put('/books/999999', { data: payload });
  expect(res.status()).toBe(404);
  const json = await res.json();
  expect(json).toHaveProperty('detail');
});

test('Delete Book by valid ID - should return 204 and no content', async ({ request }) => {
  const payload = { title: 'To Delete', author: 'Jane', isbn: '7777777777' };
  const create = await request.post('/books', { data: payload });
  const book = await create.json();
  const del = await request.delete(`/books/${book.id}`);
  expect(del.status()).toBe(204);
  expect(await del.text()).toBe('');
});

test('Delete Book with invalid ID - should return 404 and error detail', async ({ request }) => {
  const res = await request.delete('/books/999999');
  expect(res.status()).toBe(404);
  const json = await res.json();
  expect(json).toHaveProperty('detail');
});

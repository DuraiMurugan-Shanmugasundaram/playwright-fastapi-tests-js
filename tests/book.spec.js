//Author - DuraiMurugan_Shanmugasundaram
import { test, expect } from '@playwright/test';
import { loadConfig } from '../utils/configLoader';
const config = loadConfig();

test('@Create @Smoke Create Book with valid data - should return 201 and match input', async ({ request }) => {
  const payload = { title: 'Effective Testing', author: 'Jane Doe', isbn: '9876543210' };
  const res = await request.post('/books', { data: payload });
  expect(res.status()).toBe(201);
  const json = await res.json();
  expect(json).toMatchObject(payload);
});

test('@Create @Neg Create Book with missing title - should return 400', async ({ request }) => {
  const payload = { author: 'Jane Doe', isbn: '9876543210' };
  const res = await request.post('/books', { data: payload });
  expect(res.status()).toBeGreaterThanOrEqual(400);
});

test('Create Book with invalid ISBN - should return 400 @Neg', async ({ request }) => {
  const payload = { title: 'Bad ISBN', author: 'Jane Doe', isbn: 'badisbn' };
  const res = await request.post('/books', { data: payload });
  expect(res.status()).toBeGreaterThanOrEqual(400);
});

test('@Read Read Book by valid ID - should return 200 and correct book', async ({ request }) => {
  const payload = { title: 'Read Test', author: 'Jane Doe', isbn: '1233211234' };
  const create = await request.post('/books', { data: payload });
  const book = await create.json();
  const res = await request.get(`/books/${book.id}`);
  expect(res.status()).toBe(200);
  expect(await res.json()).toMatchObject(payload);
});

test('Read Book with non-existing ID - should return 404', async ({ request }) => {
  const res = await request.get('/books/999999');
  expect(res.status()).toBe(404);
});

test('Update Book with valid data - should return 200 and updated info', async ({ request }) => {
  const payload = { title: 'Old Title', author: 'Jane', isbn: '5555555555' };
  const create = await request.post('/books', { data: payload });
  const book = await create.json();
  const update = await request.put(`/books/${book.id}`, {
    data: { ...payload, title: 'New Title' }
  });
  expect(update.status()).toBe(200);
  expect((await update.json()).title).toBe('New Title');
});

test('Update Book with invalid ID - should return 404', async ({ request }) => {
  const payload = { title: 'Does Not Exist', author: 'Nobody', isbn: '1112223333' };
  const res = await request.put('/books/999999', { data: payload });
  expect(res.status()).toBe(404);
});

test('Delete Book by valid ID - should return 204', async ({ request }) => {
  const payload = { title: 'To Delete', author: 'Jane', isbn: '7777777777' };
  const create = await request.post('/books', { data: payload });
  const book = await create.json();
  const del = await request.delete(`/books/${book.id}`);
  expect(del.status()).toBe(204);
});

test('Delete Book with invalid ID - should return 404', async ({ request }) => {
  const res = await request.delete('/books/999999');
  expect(res.status()).toBe(404);
});

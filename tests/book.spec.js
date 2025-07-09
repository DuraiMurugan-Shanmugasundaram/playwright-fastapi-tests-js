//Author - DuraiMurugan_Shanmugasundaram
const { test, expect } = require('@playwright/test')
import { loadConfig } from '../utils/configLoader';
const config = loadConfig();

test.describe('Book API Tests - Chained CRUD', () => {
  let bookId;


test('@CreateBook @Positive @Smoke Create Book - valid input returns 201 and data', async ({ request }) => {
    const payload = { title: 'Chained Testing Book', author: 'Jane Doe', isbn: '1234567890' };
    const res = await request.post('/books', { data: payload });

    expect(res.status()).toBe(201);
    const json = await res.json();
    bookId = json.id;

    expect(json).toHaveProperty('id');
    expect(json.title).toBe(payload.title);
    expect(json.author).toBe(payload.author);
    expect(json.isbn).toBe(payload.isbn);
  });


test('@CreateBook @Negative Create Book with missing title - should return 400 and error detail', async ({ request }) => {
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

test('@ReadBook @Positive Read Book by ID - uses chained ID, returns 200 and correct data', async ({ request }) => {
    const res = await request.get(`/books/${bookId}`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('id', bookId);
    expect(json).toHaveProperty('title');
    expect(json).toHaveProperty('author');
    expect(json).toHaveProperty('isbn');
  });


test('@ReadBook @Negative Read Book with non-existing ID - should return 404 with detail', async ({ request }) => {
  const res = await request.get('/books/999999');
  expect(res.status()).toBe(404);
  const json = await res.json();
  expect(json).toHaveProperty('detail');
});

test('@UpdateBook @Positive @Smoke Update Book - chained ID and new title', async ({ request }) => {
    const updatedPayload = { title: 'Updated Title', author: 'Jane Doe', isbn: '1234567890' };
    const res = await request.put(`/books/${bookId}`, { data: updatedPayload });

    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.title).toBe('Updated Title');
    expect(json.author).toBe(updatedPayload.author);
    expect(json.isbn).toBe(updatedPayload.isbn);
  });


test('@UpdateBook @Positive @Smoke Update Book with valid data - should return 200 and updated info', async ({ request }) => {
  const payload = { title: 'Old Title', author: 'Jane', isbn: '5555555555' };
  const create = await request.post('/books', { data: payload });
  const book = await create.json();
  const update = await request.put(`/books/${book.id}`, {
    data: { payload, title: 'New Title' }
  });
  expect(update.status()).toBe(200);
  const json = await update.json();
  expect(json.title).toBe('New Title');
  expect(json.author).toBe(payload.author);
  expect(json.isbn).toBe(payload.isbn);
});

test('@UpdateBook @Negative Update Book with invalid ID - should return 404 and error', async ({ request }) => {
  const payload = { title: 'Does Not Exist', author: 'Nobody', isbn: '1112223333' };
  const res = await request.put('/books/999999', { data: payload });
  expect(res.status()).toBe(404);
  const json = await res.json();
  expect(json).toHaveProperty('detail');
});

test('@DeleteBook @Positive Delete Book - chained ID returns 204', async ({ request }) => {
    const res = await request.delete(`/books/${bookId}`);
    expect(res.status()).toBe(204);
    expect(await res.text()).toBe('');
  });


test('@DeleteBook @Positive @Smoke Delete Book by valid ID - should return 204 and no content', async ({ request }) => {
  const payload = { title: 'To Delete', author: 'Jane', isbn: '7777777777' };
  const create = await request.post('/books', { data: payload });
  const book = await create.json();
  const del = await request.delete(`/books/${book.id}`);
  expect(del.status()).toBe(204);
  expect(await del.text()).toBe('');
});

test('@DeleteBook @Negative Delete Book with invalid ID - should return 404 and error detail', async ({ request }) => {
  const res = await request.delete('/books/999999');
  expect(res.status()).toBe(404);
  const json = await res.json();
  expect(json).toHaveProperty('detail');
});

});


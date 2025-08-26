import { v4 as uuid } from 'uuid';

export const BRANDS_SEED = [
  { id: uuid(), name: 'Toyota', createdAt: Date.now() },
  { id: uuid(), name: 'Honda', createdAt: Date.now() },
  { id: uuid(), name: 'Ford', createdAt: Date.now() },
  { id: uuid(), name: 'Chevrolet', createdAt: Date.now() },
  { id: uuid(), name: 'Nissan', createdAt: Date.now() },
];

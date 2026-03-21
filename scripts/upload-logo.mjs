import { put } from '@vercel/blob';
import { readFileSync } from 'fs';

const imageBuffer = readFileSync('/vercel/share/v0-project/public/sonda-logo.png');

const blob = await put('sonda-logo.png', imageBuffer, {
  access: 'public',
  contentType: 'image/png',
  token: process.env.BLOB_READ_WRITE_TOKEN,
});

console.log('[v0] Logo URL:', blob.url);

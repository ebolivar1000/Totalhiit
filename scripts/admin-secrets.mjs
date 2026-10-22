// Genera los secretos del panel para Cloudflare Pages.
// Uso: npm run admin:secrets -- "MiClaveSegura"
// Copiá cada línea en Settings -> Environment variables (tipo "Secret").

const password = process.argv[2] || 'TotalHiit2026!';
const iterations = 120000;

const salt = crypto.getRandomValues(new Uint8Array(16));
const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
  'deriveBits',
]);
const bits = new Uint8Array(
  await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    key,
    256
  )
);

const b64url = (bytes) => Buffer.from(bytes).toString('base64url');
const sessionSecret = b64url(crypto.getRandomValues(new Uint8Array(32)));

console.log('');
console.log('ADMIN_USER=admin');
console.log(`ADMIN_PASSWORD_HASH=pbkdf2$${iterations}$${b64url(salt)}$${b64url(bits)}`);
console.log(`SESSION_SECRET=${sessionSecret}`);
console.log('');
console.log('Guardá estos valores como secretos en Cloudflare Pages (no los subas al repo).');

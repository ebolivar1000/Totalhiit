import assert from 'node:assert/strict';
import { hashPassword } from '../functions/_lib/auth';
import { onRequestGet as getContent, onRequestPost as postContent } from '../functions/api/content';
import { onRequestPost as login } from '../functions/api/login';
import { onRequestPost as logout } from '../functions/api/logout';
import { onRequestPost as changePassword } from '../functions/api/password';
import { onRequestGet as session } from '../functions/api/session';

class FakeKV {
  map = new Map<string, string>();
  async get(key: string, type?: string) {
    const value = this.map.get(key);
    if (value == null) return null;
    return type === 'json' ? JSON.parse(value) : value;
  }
  async put(key: string, value: string) {
    this.map.set(key, value);
  }
  async delete(key: string) {
    this.map.delete(key);
  }
}

const kv = new FakeKV();
const env = {
  SITE_CONTENT: kv as never,
  ADMIN_USER: 'admin',
  ADMIN_PASSWORD_HASH: await hashPassword('TotalHiit2026!'),
  SESSION_SECRET: 'secreto-de-prueba-1234567890abcdef',
};

const call = (fn: unknown, url: string, init: RequestInit = {}, cookie?: string) => {
  const headers = new Headers(init.headers);
  if (cookie) headers.set('Cookie', cookie);
  return (fn as (ctx: { request: Request; env: typeof env }) => Promise<Response>)({
    request: new Request(url, { ...init, headers }),
    env,
  });
};

const post = (body: unknown) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const content = {
  prices: {
    bootcampUSD: '$55',
    bootcampARS: '$1',
    annualUSD: '$2',
    annualARS: '$3',
  },
  videos: { 'intro-1': 'XYZ123' },
  heroImages: ['/images/a.jpg'],
};

const results: [string, boolean][] = [];
const check = (name: string, condition: boolean) => results.push([name, !!condition]);

let res = await call(login, 'https://x/api/login', post({ user: 'admin', password: 'TotalHiit2026!' }));
const setCookie = res.headers.get('Set-Cookie') || '';
const cookie = setCookie.split(';')[0];
check('login correcto', res.status === 200 && cookie.startsWith('th_session='));

res = await call(login, 'https://x/api/login', post({ user: 'admin', password: 'mala' }));
check('login con clave mala -> 401', res.status === 401);

res = await call(session, 'https://x/api/session', {}, cookie);
check('sesion valida con cookie', (await res.json()).ok === true);

res = await call(session, 'https://x/api/session', {}, 'th_session=inventado');
check('sesion invalida rechazada', (await res.json()).ok === false);

res = await call(getContent, 'https://x/api/content');
let data = await res.json();
check('contenido vacio cae a defaults', data.content === null && data.source === 'default');

res = await call(postContent, 'https://x/api/content', post(content));
check('publicar sin sesion -> 401', res.status === 401);

res = await call(postContent, 'https://x/api/content', post(content), cookie);
check('publicar con sesion -> 200', res.status === 200);

res = await call(getContent, 'https://x/api/content');
data = await res.json();
check(
  'contenido persistido en KV',
  data.content?.prices.bootcampUSD === '$55' && data.content?.videos['intro-1'] === 'XYZ123'
);

res = await call(postContent, 'https://x/api/content', post({ prices: {} }), cookie);
check('payload invalido -> 400', res.status === 400);

res = await call(postContent, 'https://x/api/content', post({ ...content, heroImages: [] }), cookie);
check('sin imagenes -> 400', res.status === 400);

res = await call(changePassword, 'https://x/api/password', post({ current: 'nope', next: 'NuevaClave123' }), cookie);
check('clave actual incorrecta -> 401', res.status === 401);

res = await call(changePassword, 'https://x/api/password', post({ current: 'TotalHiit2026!', next: 'corta' }), cookie);
check('clave nueva corta -> 400', res.status === 400);

res = await call(changePassword, 'https://x/api/password', post({ current: 'TotalHiit2026!', next: 'NuevaClave123' }), cookie);
check('cambio de clave -> 200', res.status === 200);

res = await call(login, 'https://x/api/login', post({ user: 'admin', password: 'TotalHiit2026!' }));
check('clave vieja ya no entra', res.status === 401);

res = await call(login, 'https://x/api/login', post({ user: 'admin', password: 'NuevaClave123' }));
check('clave nueva entra', res.status === 200);

res = await call(logout, 'https://x/api/logout', { method: 'POST' });
check('logout borra cookie', (res.headers.get('Set-Cookie') || '').includes('Max-Age=0'));

let lastStatus = 0;
for (let i = 0; i < 22; i++) {
  const attempt = await call(login, 'https://x/api/login', post({ user: 'admin', password: 'x' }));
  lastStatus = attempt.status;
}
check('rate limit -> 429', lastStatus === 429);

const failed = results.filter(([, ok]) => !ok);
for (const [name, ok] of results) console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}`);
console.log(`RESULTADO: ${results.length - failed.length}/${results.length}`);
assert.equal(failed.length, 0, `Fallaron: ${failed.map(([n]) => n).join(', ')}`);

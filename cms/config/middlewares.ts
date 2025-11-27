
export default [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          // 'self' užteks, bet pridėkim http/https, jei ateityje bus kitų originų
          'connect-src': ["'self'", 'http:', 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'http:', 'https:'],
          'media-src': ["'self'", 'data:', 'blob:'],
          'script-src': ["'self'"],
          'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://195.181.245.93:8080'],
      credentials: true,
      methods: ['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS'],
      headers: '*',
    },
  },
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

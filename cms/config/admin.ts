// cms/config/admin.ts
export default ({ env }) => ({
  serveAdminPanel: true,

  // Viešas admino URL (gali būti pilnas arba santykinis)
  url: env('ADMIN_URL', 'http://195.181.245.93:8080/cms/admin'),

  // Kur Strapi SERVINA admin'ą programoje (turi būti KELIAS, ne pilnas URL)
  path: env('ADMIN_PATH', '/cms/admin'),

  auth: { secret: env('ADMIN_JWT_SECRET') },
  apiToken: { salt: env('API_TOKEN_SALT') },
  transfer: { token: { salt: env('TRANSFER_TOKEN_SALT') } },
});

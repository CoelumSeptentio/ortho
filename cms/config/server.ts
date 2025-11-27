// cms/config/server.ts
export default ({ env }) => {
  // Be pabaigos "/" (svarbu, kad nebūtų dvigubų slash ir neteisingų 301)
  const publicUrl = env('PUBLIC_URL', 'http://195.181.245.93:8080/cms').replace(/\/$/, '');
  const adminUrl  = env('ADMIN_URL', `${publicUrl}/admin`).replace(/\/$/, '');

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),

    // Viešas bazinis URL iki CMS (be /admin gale)
    url: publicUrl,

    // Behind Nginx: naudok X-Forwarded-* antraštes
    proxy: true,

    app: {
      keys: env.array('APP_KEYS'),
    },

    // Aiškiai nurodom admin panelės viešą URL už proxy
    admin: {
      url: adminUrl,
      serveAdminPanel: true,
    },

    // Jei norisi matyti klaidas logsuose (naudinga diegiant)
    emitErrors: true,
  };
};

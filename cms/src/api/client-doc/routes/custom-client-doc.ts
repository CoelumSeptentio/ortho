export default {
  routes: [
    {
      method: 'GET',
      path: '/client-docs/me',
      handler: 'client-doc.me',
      config: {
        // NE middleware iš plugin, o mūsų globali politika:
        policies: ['global::is-authenticated'],
      },
    },
  ],
};

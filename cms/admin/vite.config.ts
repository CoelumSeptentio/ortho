import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: ['195.181.245.93'],
    origin: 'http://195.181.245.93:8080',
    hmr: {
      host: '195.181.245.93',
      protocol: 'ws',
      clientPort: 8080,
      port: 8080,
    },
  },
});

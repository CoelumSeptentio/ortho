declare module '@strapi/strapi' {
  export const factories: {
    createCoreController(uid: string, cb?: any): any;
    createCoreService(uid: string): any;
    createCoreRouter(uid: string): any;
  };
  const strapi: any;
  export default strapi;
}

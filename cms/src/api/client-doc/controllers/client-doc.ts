import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::client-doc.client-doc', ({ strapi }) => ({
  async me(ctx) {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized();

    const pageSize = Number(
      (ctx.query?.pagination as any)?.pageSize ?? 100
    );

    const docs = await strapi.entityService.findMany('api::client-doc.client-doc', {
      filters: { owner: userId },        // saugiai filtruojam server-side
      populate: ['file'],
      limit: pageSize,
      sort: { updatedAt: 'desc' },
    });

    // Grąžinam paprastą, Strapi'ui artimą formą
    ctx.body = {
      data: docs,
      meta: {
        pagination: { page: 1, pageSize, pageCount: 1, total: docs.length },
      },
    };
  },
}));


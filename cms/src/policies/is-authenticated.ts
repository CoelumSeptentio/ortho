import type { Context } from 'koa';

// kad TS nepyktų – nenaudojam Strapi tipo iš @strapi/strapi
declare const strapi: any;

export default async (ctx: Context, next: () => Promise<unknown>) => {
  const auth = ctx.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return ctx.unauthorized('Missing bearer token');

  try {
    const jwt = strapi.plugin('users-permissions').service('jwt');
    const payload = await jwt.verify(token); // { id, iat, exp, ... }

    const user = await strapi.entityService.findOne(
      'plugin::users-permissions.user',
      payload.id,
      { populate: ['role'] }
    );
    if (!user || user.blocked) return ctx.forbidden('User blocked or not found');

    ctx.state.user = user; // padedam į standartinę vietą
    return next();
  } catch {
    return ctx.unauthorized('Invalid or expired token');
  }
};


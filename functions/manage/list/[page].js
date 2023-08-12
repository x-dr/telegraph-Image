export async function onRequest(context) {
    // Contents of context object
    const {
      request, // same as existing Worker API
      env, // same as existing Worker API
      params, // if filename includes [id] or [[path]]
      waitUntil, // same as ctx.waitUntil in existing Worker API
      next, // used for middleware or to fetch assets
      data, // arbitrary space for passing data between middlewares
    } = context;
    const ps = context.env.IMG.prepare(`SELECT * FROM imginfo LIMIT 10 OFFSET (${params.page} - 1) * 10`);
    const { results } = await ps.all()
    return Response.json(results);
  }
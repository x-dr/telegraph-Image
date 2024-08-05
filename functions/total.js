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


  let totalImg = {
    status: 404,
    total: "?"
  }
  if (env.IMG) {
    try {
      const total = await env.IMG.prepare(`SELECT COUNT(*) as total FROM imginfo`).first()
      totalImg = {
        status: 200,
        total: total.total
      }
    } catch (error) {
      totalImg = {
        status: 200,
        total: "?"
      }
    }



  }


  return Response.json(totalImg);

}
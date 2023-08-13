export async function onRequest(context) {
    // Contents of context object
    const { env, params } = context;

    const ps = env.IMG.prepare(`SELECT ${params.id}, COUNT(*) AS count FROM imginfo GROUP BY ${params.id} ORDER BY count DESC LIMIT 20`)
    const { results } = await ps.all()
    return Response.json(results);

}
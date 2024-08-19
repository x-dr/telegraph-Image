
import { getRequestContext } from '@cloudflare/next-on-pages';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400', // 24 hours
  'Content-Type': 'application/json'
};

export const runtime = 'edge';






export async function DELETE(request) {
  let { name } = await request.json()
  const { env, cf, ctx } = getRequestContext();
  try {
    const setData = await env.IMG.prepare(`DELETE FROM imginfo WHERE url='${name}'`).run()
    return Response.json({
      "code": 200,
      "success": true,
      "message": setData.success,
    });

  } catch (error) {
    return Response.json({
      "code": 500,
      "success": false,
      "message": error.message,
    }, {
      status: 500,
      headers: corsHeaders,
    })
  }
}
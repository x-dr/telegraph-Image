
import { getRequestContext } from '@cloudflare/next-on-pages';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400', // 24 hours
  'Content-Type': 'application/json'
};

export const runtime = 'edge';
export async function POST(request, { params }) {
  let { rating } = await request.json()
  const { name } = params
  // 获取客户端的IP地址
  const { env, cf, ctx } = getRequestContext();
  // console.log(dd);


  try {
    const setData = await env.IMG.prepare(`UPDATE imginfo SET rating = ${rating} WHERE url='/file/${name}'`).run()
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





import { NextResponse } from "next/server";
import { headers } from 'next/headers'

// ...


export const runtime = 'edge';
export async function GET(request) {
  // 获取客户端的IP地址
  // const { env, cf, ctx } = getRequestContext();
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.socket.remoteAddress;
  const clientIp = ip ? ip.split(',')[0].trim() : 'IP not found';

  return new Response(
    JSON.stringify({
      ip: clientIp
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  )




}



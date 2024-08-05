import { NextResponse } from "next/server";
import { headers } from 'next/headers'
import { getRequestContext } from '@cloudflare/next-on-pages';

// ...


export const runtime = 'edge';
export async function GET(request) {
  // 获取客户端的IP地址
  // const { env, cf, ctx } = getRequestContext();
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.socket.remoteAddress;
  const clientIp = ip ? ip.split(',')[0].trim() : 'IP not found';
  // const options = {
  //   timeZone: 'Asia/Shanghai',
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric',
  //   hour12: false,
  //   hour: '2-digit',
  //   minute: '2-digit',
  //   second: '2-digit'
  // };
  // const timedata = new Date();
  // const formattedDate = new Intl.DateTimeFormat('zh-CN', options).format(timedata);
  // await insertImageData(env.IMG, "_URL", "Referer", "clientIP", 7, formattedDate);
  // // 如果有多个IP地址，取第一个
  // // const clientIp = ip ? ip.split(',')[0].trim() : 'IP not found';
  // const ps = env.IMG.prepare(`SELECT * FROM imginfo `);
  // // const ps = env.IMG.prepare(`SELECT * FROM imginfo LIMIT 10 OFFSET (${params.page} - 1) * 10`);
  // const { results } = await ps.all()
  // console.log(results);
  // return Response.json(results);

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


async function insertImageData(env, src, referer, ip, rating, time) {
  try {
    const instdata = await env.prepare(
      `INSERT INTO imginfo (url, referer, ip, rating, total, time)
           VALUES ('${src}', '${referer}', '${ip}', ${rating}, 1, '${time}')`
    ).run();
  } catch (error) {

  }
}

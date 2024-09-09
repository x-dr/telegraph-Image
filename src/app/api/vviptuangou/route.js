export const runtime = 'edge';
import { getRequestContext } from '@cloudflare/next-on-pages';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400', // 24 hours
  'Content-Type': 'application/json'
};

/**
 * 
 * 接口来自：https://github.com/BlueSkyXN/WorkerJS_CloudFlare_ImageBed/blob/main/cloudflare-worker-js-api/API_IMG_vviptuangou.js
 * 
 */

export async function POST(request) {
  const { env, cf, ctx } = getRequestContext();
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.socket.remoteAddress;
  const clientIp = ip ? ip.split(',')[0].trim() : 'IP not found';
  const Referer = request.headers.get('Referer') || "Referer";

  const formData = await request.formData();
  const file = formData.get('file'); // 使用 'image' 字段名
  if (!file) {
    return new Response('No file uploaded', { status: 400 });
  }
  try {
    const newFormData = new FormData();
    newFormData.append('file', file, file.name); // 上传到目标服务器时使用 'file'
    const res = await fetch('https://api.vviptuangou.com/api/upload', {
      method: request.method,
      body: newFormData,
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
        'Branchid': '1002',
        'Cache-Control': 'no-cache',
        'DNT': '1',
        'Origin': 'https://mlw10086.serv00.net',
        'Pragma': 'no-cache',
        'Priority': 'u=1, i',
        'Referer': 'https://mlw10086.serv00.net/',
        'Sec-Ch-Ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'Sign': 'e346dedcb06bace9cd7ccc6688dd7ca1', // 替换为动态生成的sign值
        'Source': 'h5',
        'Tenantid': '3',
        'Timestamp': '1725792862411', // 替换为动态生成的timestamp值
        'Token': 'b3bc3a220db6317d4a08284c6119d136', // 请替换成有效的 token
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
      }
    });
    // console.log(res);
    const resdata = await res.json()

    let correctImageUrl

    if (resdata.status === 1 && resdata.imgurl) {
      correctImageUrl = `https://assets.vviptuangou.com/${resdata.imgurl}`;
    } else {
      return Response.json({
        status: 500,
        message: ` ${resdata.message}`,
        success: false
      }
        , {
          status: 500,
          headers: corsHeaders,
        })
    }


    const data = {
      "url": correctImageUrl,
      "code": 200,
      "name": resdata.imgurl
    }
    try {
      if (env.IMG) {
        const nowTime = await get_nowTime()
        await insertImageData(env.IMG, correctImageUrl, Referer, clientIp, 7, nowTime);
      }
    } catch (error) {

    }


    return Response.json(data, {
      status: 200,
      headers: corsHeaders,
    }

    )


  } catch (error) {
    return Response.json({
      status: 500,
      message: ` ${error.message}`,
      success: false
    }
      , {
        status: 500,
        headers: corsHeaders,
      })
  }

}




async function insertImageData(env, src, referer, ip, rating, time) {
  try {
    const instdata = await env.prepare(
      `INSERT INTO imginfo (url, referer, ip, rating, total, time)
           VALUES ('${src}', '${referer}', '${ip}', ${rating}, 1, '${time}')`
    ).run()
  } catch (error) {

  };
}



async function get_nowTime() {
  const options = {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  const timedata = new Date();
  const formattedDate = new Intl.DateTimeFormat('zh-CN', options).format(timedata);

  return formattedDate

}
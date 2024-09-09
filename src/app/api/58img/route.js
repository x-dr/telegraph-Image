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
 * 接口来自：https://github.com/BlueSkyXN/WorkerJS_CloudFlare_ImageBed/blob/main/cloudflare-worker-js-api/API_IMG_58img.js
 * 
 * 
 */


export async function POST(request) {
  const { env, cf, ctx } = getRequestContext();
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.socket.remoteAddress;
  const clientIp = ip ? ip.split(',')[0].trim() : 'IP not found';
  const Referer = request.headers.get('Referer') || "Referer";

  const req_url = new URL(request.url);


  const formData = await request.formData();
  const imageFile = formData.get('file')
  if (!imageFile) return new Response('Image file not found', { status: 400 });
  // 将文件数据转换为 ArrayBuffer
  const arrayBuffer = await imageFile.arrayBuffer();

  // 将 ArrayBuffer 转换为 Base64
  const base64EncodedData = bufferToBase64(arrayBuffer);

  // 构建请求负载
  const payload = {
    "Pic-Size": "0*0",
    "Pic-Encoding": "base64",
    "Pic-Path": "/nowater/webim/big/",
    "Pic-Data": base64EncodedData
  };


  try {
    const res = await fetch('https://upload.58cdn.com.cn/json/nowater/webim/big/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    // console.log(res);
    const result = await res.text();
    const random_number = Math.floor(Math.random() * 8) + 1;
    const finalUrl = `https://pic${random_number}.58cdn.com.cn/nowater/webim/big/${result}`;
    const data = {
      "url": finalUrl,
      "code": 200,
      "name": result
    }

    try {
      if (env.IMG) {
        const nowTime = await get_nowTime()
        await insertImageData(env.IMG, finalUrl, Referer, clientIp, 7, nowTime);
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

// ArrayBuffer 转 Base64
function bufferToBase64(buf) {
  var binary = '';
  var bytes = new Uint8Array(buf);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // 使用 btoa 进行 Base64 编码
  return btoa(binary);
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
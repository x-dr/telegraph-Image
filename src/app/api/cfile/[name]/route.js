export const runtime = 'edge';
import { getRequestContext } from '@cloudflare/next-on-pages';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400', // 24 hours
  'Content-Type': 'application/json'
};


function getContentType(fileName) {
  const extension = fileName.split('.').pop().toLowerCase();
  const mimeTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf',
    'txt': 'text/plain',
    'html': 'text/html',
    'json': 'application/json',
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',
    'wmv': 'video/x-ms-wmv',
    'flv': 'video/x-flv',
    'mkv': 'video/x-matroska'
  };
  return mimeTypes[extension] || 'application/octet-stream';
}


export async function OPTIONS(request) {
  return new Response(null, {
    headers: corsHeaders
  });
}

// 判断Referer是否允许


export async function GET(request, { params }) {
  const { name } = params
  let { env, cf, ctx } = getRequestContext();

  let req_url = new URL(request.url);

  if (!env.TG_BOT_TOKEN || !env.TG_CHAT_ID) {
    return Response.json({
      status: 500,
      message: `TG_BOT_TOKEN or TG_CHAT_ID is not Set`,
      success: false
    }, {
      status: 500,
      headers: corsHeaders,
    })
  }

  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.socket.remoteAddress;
  const clientIp = ip ? ip.split(',')[0].trim() : 'IP not found';
  const Referer = request.headers.get('Referer') || "Referer";

  const cacheKey = new Request(req_url.toString(), request);
  const cache = caches.default;

  let rating

  try {
    rating = await getRating(env.IMG, `/cfile/${name}`);
    if (rating === 3 && !(Referer === `${req_url.origin}/admin` || Referer === `${req_url.origin}/list` || Referer === `${req_url.origin}/`)) {
      await logRequest(env, name, Referer, clientIp);
      return Response.redirect(`${req_url.origin}/img/blocked.png`, 302);
    }

  } catch (error) {
    console.log(error);

  }
  // 检查缓存
  let cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    if (!(Referer === `${req_url.origin}/admin` || Referer === `${req_url.origin}/list` || Referer === `${req_url.origin}/`)) {
      await logRequest(env, name, Referer, clientIp);
    }
    // 如果缓存中存在，直接返回缓存响应
    return cachedResponse
  }


  try {
    const file_path = await getFile_path(env, name);
    const fileName = file_path.split('/').pop();

    if (file_path === "error") {
      return Response.json({
        status: 500,
        message: ` ${error.message}`,
        success: false
      }
        , {
          status: 500,
          headers: corsHeaders,
        })

    } else {
      const res = await fetch(`https://api.telegram.org/file/bot${env.TG_BOT_TOKEN}/${file_path}`, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });

      if (res.ok) {
        const fileBuffer = await res.arrayBuffer();



        const contentType = getContentType(fileName);
        const responseHeaders = {
          "Content-Disposition": `attachment; filename=${fileName}`,
          "Access-Control-Allow-Origin": "*",
          "Content-Type": contentType
        };
        const response_img = new Response(fileBuffer, {
          headers: responseHeaders
        });

        ctx.waitUntil(cache.put(cacheKey, response_img.clone()));

        if (Referer === `${req_url.origin}/admin` || Referer === `${req_url.origin}/list` || Referer === `${req_url.origin}/`) {
          return response_img;

        } else if (!env.IMG) {
          return response_img

        } else {
          await logRequest(env, name, Referer, clientIp);
          return response_img

        }
      } else {
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




async function getFile_path(env, file_id) {
  try {
    const url = `https://api.telegram.org/bot${env.TG_BOT_TOKEN}/getFile?file_id=${file_id}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        "User-Agent": " Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome"
      },
    })

    let responseData = await res.json();

    if (responseData.ok) {
      const file_path = responseData.result.file_path
      return file_path
    } else {
      return "error";
    }
  } catch (error) {
    return "error";

  }


}



// 插入 tgimglog 记录
async function insertTgImgLog(DB, url, referer, ip, time) {
  const iImglog = await DB.prepare('INSERT INTO tgimglog (url, referer, ip, time) VALUES (?, ?, ?, ?)')
    .bind(url, referer, ip, time)
    .run();
}



// 从数据库获取鉴黄信息
async function getRating(DB, url) {
  const ps = DB.prepare(`SELECT rating FROM imginfo WHERE url='${url}'`);
  const result = await ps.first();
  return result ? result.rating : null;
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


// 异步日志记录
async function logRequest(env, name, referer, ip) {
  try {
    const nowTime = await get_nowTime()
    await insertTgImgLog(env.IMG, `/cfile/${name}`, referer, ip, nowTime);
    const setData = await env.IMG.prepare(`UPDATE imginfo SET total = total +1 WHERE url = '/rfile/${name}';`).run()
  } catch (error) {
    console.error('Error logging request:', error);
  }
}
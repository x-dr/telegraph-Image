export const runtime = 'edge';
import { getRequestContext } from '@cloudflare/next-on-pages';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400', // 24 hours
  'Content-Type': 'application/json'
};

export async function OPTIONS(request) {
  return new Response(null, {
    headers: corsHeaders
  });
}



//https://developers.cloudflare.com/r2/examples/demo-worker/
export async function GET(request, { params }) {
  const { name } = params
  let { env, cf, ctx } = getRequestContext();

	if(!env.IMGRS){
		return Response.json({
			status: 500,
			message: `IMGRS is not Set`,
			success: false
		}, {
			status: 500,
			headers: corsHeaders,
		})
	}

  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.socket.remoteAddress;
  const clientIp = ip ? ip.split(',')[0].trim() : 'IP not found';
  const Referer = request.headers.get('Referer') || "Referer";

  const req_url = new URL(request.url);
  // 构造缓存键
  const cacheKey = new Request(req_url.toString(), request);
  const cache = caches.default;

  let rating

  try {
    rating = await getRating(env.IMG, `/rfile/${name}`);
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

    const object = await env.IMGRS.get(name, {
      range: request.headers,
      onlyIf: request.headers,
    })

    if (object === null) {
      return Response.json({
        status: 404,
        message: ` ${error.message}`,
        success: false
      }
        , {
          status: 404,
          headers: corsHeaders,
        })

    }
    const headers = new Headers()
    object.writeHttpMetadata(headers)
    headers.set('etag', object.httpEtag)

    if (object.range) {
      headers.set("content-range", `bytes ${object.range.offset}-${object.range.end ?? object.size - 1}/${object.size}`)
    }

    const status = object.body ? (request.headers.get("range") !== null ? 206 : 200) : 304

    let response_img = new Response(object.body, {
      headers,
      status
    })

    if (status === 200) {
      ctx.waitUntil(cache.put(cacheKey, response_img.clone()));
      // await cache.put(cacheKey, response_img.clone());
    }




    if (Referer === `${req_url.origin}/admin` || Referer === `${req_url.origin}/list` || Referer === `${req_url.origin}/`) {
      return response_img
    }else if(!env.IMG){
      return response_img

    } else {
      await logRequest(env, name, Referer, clientIp);
      return response_img
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




// 插入 tgimglog 记录
async function insertTgImgLog(DB, url, referer, ip, time) {
  const iImglog = await DB.prepare('INSERT INTO tgimglog (url, referer, ip, time) VALUES (?, ?, ?, ?)')
    .bind(url, referer, ip, time)
    .run();
}

// 异步日志记录
async function logRequest(env, name, referer, ip) {
  try {
    const nowTime = await get_nowTime()
    await insertTgImgLog(env.IMG, `/rfile/${name}`, referer, ip, nowTime);
    const setData = await env.IMG.prepare(`UPDATE imginfo SET total = total +1 WHERE url = '/rfile/${name}';`).run()
  } catch (error) {
    console.error('Error logging request:', error);
  }
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
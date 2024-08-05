export const runtime = 'edge';
import { getRequestContext } from '@cloudflare/next-on-pages';



const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400', // 24 hours
  'Content-Type': 'application/json'
};

export async function POST(request) {
  const { env, cf, ctx } = getRequestContext();


  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.socket.remoteAddress;
  const clientIp = ip ? ip.split(',')[0].trim() : 'IP not found';
  const Referer = request.headers.get('Referer') || "Referer";


  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400', // 24小时
      },
    });
  }

  try {
    const res = await fetch(`https://telegra.ph/upload`, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    })

    const resdata = await res.json()
    let data = {
      "url": resdata[0].src,
      "code": 200,
      "name": resdata[0].src
    }



    if (!env.IMG) {
      data.env_img = "null"
      return Response.json({
        ...data,
        msg: "1"
      }, {
        status: 200,
        headers: corsHeaders,
      })
    } else {
      try {
        const rating_index = await getRating(env, resdata[0].src)
        const nowTime = await get_nowTime()
        await insertImageData(env.IMG, resdata[0].src, Referer, clientIp, rating_index, nowTime);
        return Response.json({
          ...data,
          msg: "2",
          url:resdata[0].src,
          Referer:Referer,
          clientIp:clientIp,
          rating_index:rating_index,
          nowTime:nowTime
        }, {
          status: 200,
          headers: corsHeaders,
        })

      } catch (error) {
        console.log(error);
        await insertImageData(env.IMG, resdata[0].src, Referer, clientIp, -1, nowTime);


        return Response.json({
          "msg": error.message
        }, {
          status: 200,
          headers: corsHeaders,
        })
      }


    }


  } catch (error) {
    // console.log(error);
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



async function getRating(env, url) {
  try {
    const apikey = env.ModerateContentApiKey
    const ModerateContentUrl = apikey ? `https://api.moderatecontent.com/moderate/?key=${apikey}&` : ""
    const ratingApi = env.RATINGAPI ? `${env.RATINGAPI}?` : ModerateContentUrl;
    if (ratingApi) {
      const res = await fetch(`${ratingApi}url=https://telegra.ph${url}`);
      const data = await res.json();
      const rating_index = data.hasOwnProperty('rating_index') ? data.rating_index : -1;

      return rating_index;
    } else {
      return 0
    }


  } catch (error) {
    return -1
  }
}


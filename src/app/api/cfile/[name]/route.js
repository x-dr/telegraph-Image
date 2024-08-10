export const runtime = 'edge';
import { getRequestContext } from '@cloudflare/next-on-pages';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400', // 24 hours
  'Content-Type': 'application/json'
};

export async function GET(request, { params }) {
  const { name } = params
  let { env, cf, ctx } = getRequestContext();

  let req_url = new URL(request.url);



  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.socket.remoteAddress;
  const clientIp = ip ? ip.split(',')[0].trim() : 'IP not found';
  const Referer = request.headers.get('Referer') || "Referer";

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
      const res = await fetch(`https://api.telegram.org/file/${env.TG_BOT_TOKEN}/${file_path}`, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });

      if (res.ok) {
        const fileBuffer = await res.arrayBuffer();
        if (Referer == req_url.origin + "/admin" || Referer == req_url.origin + "/list" || Referer == req_url.origin + "/" || !env.IMG) {
          return new Response(fileBuffer, {
            headers: {
              "Content-Disposition": `attachment; filename=${fileName}`,
            },
          });
        } else {
          const nowTime = await get_nowTime()
          await insertTgImgLog(env.IMG, `/cfile/${name}`, Referer, clientIp, nowTime);
          const rating = await getRating(env.IMG, `/cfile/${name}`);

          if (rating) {
            try {
              const setData = await env.IMG.prepare(`UPDATE imginfo SET total = total +1 WHERE url = '/cfile/${name}';`).run()
            } catch (error) {
              console.log(error);
            }
            if (rating.rating == 3) {
              return Response.redirect(`${req_url.origin}/img/blocked.png`, 302);
            } else {
              return new Response(fileBuffer, {
                headers: {
                  "Content-Disposition": `attachment; filename=${fileName}`,
                },
              });
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
    const url = `https://api.telegram.org/${env.TG_BOT_TOKEN}/getFile?file_id=${file_id}`;
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
// 插入 imginfo 记录
async function insertImgInfo(DB, url, referer, ip, rating, time) {
  try {
    const instdata = await DB.prepare(
      `INSERT INTO imginfo (url, referer, ip, rating, total, time)
           VALUES ('${url}', '${referer}', '${ip}', ${rating}, 1, '${time}')`
    ).run()
  } catch (error) {

  };


}

// 从数据库获取鉴黄信息
async function getRating(DB, url) {
  const ps = DB.prepare(`SELECT rating FROM imginfo WHERE url='${url}'`);
  const result = await ps.first();
  return result;
}

// 调用 ModerateContent API 鉴黄
async function getModerateContentRating(env, url) {
  try {
    const apikey = env.ModerateContentApiKey
    const ModerateContentUrl = apikey ? `https://api.moderatecontent.com/moderate/?key=${apikey}&` : ""
    const ratingApi = env.RATINGAPI ? `${env.RATINGAPI}?` : ModerateContentUrl;
    console.log(`${ratingApi}url=https://telegra.ph${url}`);
    if (ratingApi) {
      const res = await fetch(`${ratingApi}url=https://telegra.ph${url}`);
      const data = await res.json();
      const rating_index = data.hasOwnProperty('rating_index') ? data.rating_index : -1;

      return rating_index;
    } else {
      return 0
    }


  } catch (error) {
    console.log("error");
    return -1
  }
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
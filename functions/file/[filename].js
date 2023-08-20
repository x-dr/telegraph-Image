/**
 * GET /file/{filename}
 */

async function handleRequest(context) {
    const { request, env, params } = context;
    const apikey = env.ModerateContentApiKey
    const ModerateContentUrl = apikey ? `https://api.moderatecontent.com/moderate/?key=${apikey}&` : ""
    const ratingApi = env.RATINGAPI ? `${env.RATINGAPI}?` : ModerateContentUrl;
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("clientIP")
    const Referer = request.headers.get('Referer') || "Referer"
    const url = new URL(request.url);

    const res_img = await fetch('https://telegra.ph/' + url.pathname + url.search, {
        method: request.method,
        headers: request.headers,
        body: request.body,
    });


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
    const timedata = new Date()
    const formatter = new Intl.DateTimeFormat('zh-CN', options);
    const formattedDate = formatter.format(timedata);


    try {
        // console.log(url.origin);
        if (Referer == url.origin + "/admin" || Referer == url.origin + "/list") {
            // console.log(Referer);
            return res_img;
        } else if (!env.IMG) {
            return res_img;
        } else {
            await csh(Referer, url.pathname, clientIP)
            await insertTgImgLog(env.IMG, url.pathname, Referer, clientIP, formattedDate);
            const rating = await getRating(env.IMG, url.pathname);
            // console.log(rating);
            if (rating) {
                if (rating.rating == 3) {
                    return Response.redirect("https://img.131213.xyz/asset/image/blocked.png", 302);
                } else {
                    return res_img;
                }
            } else {
                if (ratingApi) {
                    // console.log("ra");
                    const rating = await getModerateContentRating(ratingApi, url.pathname);
                    await insertImgInfo(env.IMG, url.pathname, Referer, clientIP, rating.rating, 1, formattedDate);
                    // console.log(rating.rating);
                    if (rating.rating == 3) {
                        return Response.redirect("https://img.131213.xyz/asset/image/blocked.png", 302);
                    } else {
                        return res_img;
                    }

                } else {
                    await insertImgInfo(env.IMG, url.pathname, Referer, clientIP, 0, 1, formattedDate);
                    return res_img;
                }
            }
        }
    } catch (error) {
        // 插入 tgimglog 错误记录
        // console.log("d");

        await insertTgImgLog(env.IMG, url.pathname, Referer, clientIP, formattedDate);
        await insertImgInfo(env.IMG, url.pathname, Referer, clientIP, 5, 1, formattedDate);
        console.log(error);
        return res_img;
        // throw error;
    }


}


// 检查 Referer 是否记录或鉴黄
function isAllowed(referer, origin) {
    return referer == `${origin}/admin` || referer == `${origin}/list`;
}

// 插入 tgimglog 记录
async function insertTgImgLog(DB, url, referer, ip, time) {
    const iImglog = await DB.prepare('INSERT INTO tgimglog (url, referer, ip, time) VALUES (?, ?, ?, ?)')
        .bind(url, referer, ip, time)
        .run();
}
// 插入 imginfo 记录
async function insertImgInfo(DB, url, referer, ip, rating, total, time) {
    // console.log(DB, url, referer, ip, rating, total, time);
    const iImginfo = await DB.prepare(
        `INSERT INTO imginfo (url, referer, ip, rating, total, time)
      VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(url, referer, ip, rating, total, time).run();
}

// 从数据库获取鉴黄信息
async function getRating(DB, url) {
    const ps = DB.prepare(`SELECT rating FROM imginfo WHERE url='${url}'`);
    const result = await ps.first();
    return result;
}

// 调用 ModerateContent API 鉴黄
async function getModerateContentRating(ratingApi, url) {
    // console.log("d");
    const res = await fetch(`${ratingApi}url=https://telegra.ph${url}`);
    const rating = await res.json();
    return rating;
}




export async function onRequestGet(context) {
    try {
        // console.log("dddd");
        return await handleRequest(context);
    } catch (error) {
        // 处理异常
        console.error(error);
        return new Response("Internal Server Error", { status: 500 });
    }
}





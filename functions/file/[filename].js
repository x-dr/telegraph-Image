/**
 * GET /file/{filename}
 */

export async function onRequestGet(context) {
    const { request, env, params } = context;
    let apikey = env.ModerateContentApiKey
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("clientIP")
    const Referer = request.headers.get('Referer') || "Referer"

    const url = new URL(request.url);
    //  console.log(url.pathname);
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

    // if (request.headers.get('Referer') == url.origin + "/admin" ) {
    if (request.headers.get('Referer') == url.origin + "/admin" || request.headers.get('Referer') == url.origin + "/list" || request.headers.get('Referer') == url.origin + "/") {
        return res_img
    }
    if (typeof env.IMG == "undefined" || env.IMG == null || env.IMG == "") {
        return res_img
    }
    else {
        try {
            const instdata = await env.IMG.prepare('INSERT INTO tgimglog  (url, referer,ip,time) VALUES ( ?, ?, ?, ?)').bind(url.pathname, Referer, clientIP, formattedDate).run()
            const ps = env.IMG.prepare(`SELECT rating from imginfo WHERE url='${url.pathname}'`)
            const rating = await ps.first();
            if (rating) {
                if (rating.rating === 3) {
                    return Response.redirect("https://img.131213.xyz/asset/image/blocked.png", 302)
                } else {
                    return res_img
                    // return  Response.json(rating)
                }
            } else {

                if (apikey) {
                    const res = await fetch(`https://api.moderatecontent.com/moderate/?key=` + apikey + `&url=https://telegra.ph` + url.pathname + url.search)
                    const rating = await res.json()
                    // console.log(`rating_index:${rating.rating_index}`);
                    const instdata = await env.IMG.prepare(
                        `INSERT INTO imginfo (url, referer,ip,rating,total,time)
                             VALUES ('${url.pathname}','${Referer}', '${clientIP}','${rating.rating_index}',1,'${formattedDate}')`).run()
                    if (rating.rating_index === 3) {
                        // console.log("ss");
                        return Response.redirect("https://img.131213.xyz/asset/image/blocked.png", 302)
                    } else {
                        return res_img
                    }
                } else {

                    // console.log("tt");
                    return res_img
                }





            }
        } catch (error) {
            // console.log(error);
            return res_img
        }
    }


    // return response

}



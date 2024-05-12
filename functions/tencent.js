export async function onRequestPost(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("clientIP");
    const Referer = request.headers.get('Referer') || "Referer";
    const res_img = await fetch('https://openai.weixin.qq.com/weixinh5/webapp/h774yvzC2xlB4bIgGfX2stc4kvC85J/cos/upload', {
        method: "POST",
        headers: request.headers,
        body: request.body
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
    const timedata = new Date();
    const formattedDate = new Intl.DateTimeFormat('zh-CN', options).format(timedata);
    const responseData = await res_img.json();
    // console.log(responseData);
    try {

        const name = responseData.filekey;
        const _URL = responseData.url;
        if (env.IMG) {
            await insertImageData(env.IMG, _URL, Referer, clientIP, 7, formattedDate);
        }
        return Response.json({
            "success": true,
            "data": {
                "msg": "success",
                "uploadPath": _URL,
                "filename": name
            }
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {

        return Response.json({
            "success": false,
            "data": {
                "msg": e,
                "filename": "",
                "uploadPath": "_URL",
            }
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
    }





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



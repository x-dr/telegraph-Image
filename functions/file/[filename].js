/**
 * GET /file/{filename}
 */
export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    if (typeof env.img_url == "undefined" || env.img_url == null || env.img_url == "") { }
    else {
        const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("clientIP")
        const Referer = request.headers.get('Referer') || "Referer"
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
            const instdata = await env.IMG.prepare('INSERT INTO tgimglog  (url, referer,ip,time) VALUES ( ?, ?, ?, ?)')
            .bind(url.pathname, Referer, clientIP, formattedDate).run()
        } catch (error) {
            console.log(error);
        }

    }
    return await fetch('https://telegra.ph' + url.pathname);
}

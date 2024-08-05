export async function onRequestPost(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const apikey = env.ModerateContentApiKey 
    const ModerateContentUrl = apikey ? `https://api.moderatecontent.com/moderate/?key=${apikey}&` : ""
    const ratingApi = env.RATINGAPI ? `${env.RATINGAPI}?` : ModerateContentUrl;
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("clientIP");
    const Referer = request.headers.get('Referer') || "Referer";
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
    const timedata = new Date();
    const formattedDate = new Intl.DateTimeFormat('zh-CN', options).format(timedata);

    if (!env.IMG) {
        return res_img;
    } else {
        // const newReq = res_img.clone();
        const responseData = await res_img.json();
        try {
            const rating = ratingApi ? await getRating(ratingApi, responseData[0].src) : { rating: 0 };
            const rating_index = rating.rating ? rating.rating : rating.rating_index
            await insertImageData(env.IMG, responseData[0].src, Referer, clientIP, rating_index, formattedDate);
        } catch (e) {
            console.log(e);
            await insertImageData(env.IMG, responseData[0].src, Referer, clientIP, 5, formattedDate);
        }

        return Response.json(responseData);
    }


}


async function getRating(ratingApi, src) {
    const res = await fetch(`${ratingApi}url=https://telegra.ph${src}`);
    // console.log(await res.json());
    return await res.json();
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

export async function onRequestPost(context) {  // Contents of context object  
    const {
        request, // same as existing Worker API    
        env, // same as existing Worker API    
        params, // if filename includes [id] or [[path]]   
        waitUntil, // same as ctx.waitUntil in existing Worker API    
        next, // used for middleware or to fetch assets    
        data, // arbitrary space for passing data between middlewares 
    } = context;
    context.request
    const url = new URL(request.url);
    let apikey = env.ModerateContentApiKey
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("clientIP")
    const Referer = request.headers.get('Referer') || "Referer"
    const res_img =await fetch('https://telegra.ph/' + url.pathname + url.search, {
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
    


    if (typeof env.IMG == "undefined" || env.IMG == null || env.IMG == "") { 
        // console.log(env.IMG);
    }
    else {
        try {
            const newReq = res_img.clone();
            const responseData = await newReq.json();

            if (apikey) {
                const res = await fetch(`https://api.moderatecontent.com/moderate/?key=` + apikey + `&url=https://telegra.ph` + responseData[0].src + url.search)
                const rating = await res.json()
                const instdata = await env.IMG.prepare(
                    `INSERT INTO imginfo (url, referer,ip,rating,total,time)
                         VALUES ('${responseData[0].src}','${Referer}', '${clientIP}','${rating.rating_index}',1,'${formattedDate}')`).run()
            } else {
                const instdata = await env.IMG.prepare(
                    `INSERT INTO imginfo (url, referer,ip,rating,total,time)
                         VALUES ('${responseData[0].src}','${Referer}', '${clientIP}',0,1,'${formattedDate}')`).run()
            }

        } catch (e) {
            console.log(e)
        }
    }

    return res_img;
}

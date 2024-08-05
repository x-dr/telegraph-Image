export async function onRequestPost(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("clientIP");
    const Referer = request.headers.get('Referer') || "Referer";
    const formData = await request.formData()
    const res_img = await fetch('https://kf.dianping.com/api/file/singleImage', {
        method: request.method,
        headers: {
            "Referer": "https://h5.dianping.com/",
            "User-Agent": " Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0"
        },
        body: formData,
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
    let responseData = await res_img.json();
    // console.log(responseData);

    try {
        if (responseData.code === 200) {
            const old_url = responseData.data.uploadPath
            let _URL = new URL(old_url);
            // 修改协议为https
            _URL.protocol = 'https:';
            responseData.data.uploadPath = _URL
            if(env.IMG){
                await insertImageData(env.IMG, _URL, Referer, clientIP, 6, formattedDate);
            }
            
            return Response.json(responseData, {
                headers: { 'Content-Type': 'application/json' }
            });
        }

    } catch (e) {
        console.log(e);
        // await insertImageData(env.IMG, responseData.result, Referer, clientIP, 5, formattedDate);
    }

    return Response.json(responseData, {
        headers: { 'Content-Type': 'application/json' }
    });




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

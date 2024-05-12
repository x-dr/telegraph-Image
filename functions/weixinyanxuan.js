// 生成指定长度的随机字符串
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}

// 计算 MD5 哈希
async function calculateMD5Hash(nonce, timestamp) {
    const secret = "fuck-your-mother-three-thousand-times-apes-not-kill-apes";
    const data = `nonce=${nonce}&timestamp=${timestamp}${secret}`;

    // 将字符串编码为 ArrayBuffer
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    // 使用 Web Crypto API 计算 MD5 哈希
    const hashBuffer = await crypto.subtle.digest('MD5', dataBuffer);

    // 将 ArrayBuffer 转换为十六进制字符串
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

export async function onRequestPost(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("clientIP");
    const Referer = request.headers.get('Referer') || "Referer";

    // 生成随机字符串和时间戳
    const nonce = generateRandomString(8);
    const timestamp = String(Math.floor(new Date().getTime()));

    // 计算 MD5 哈希
    const acceptLocale = await calculateMD5Hash(nonce, timestamp);

    console.log(acceptLocale);

    // 构建请求头
    const imgheaders = {
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Accept-Locale": acceptLocale,
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
    };
    // 解析请求体
    const formData1 = await request.formData()

    const formData = new FormData();
    formData.append('nonce', nonce);
    formData.append('timestamp', timestamp);
    formData.append('file', formData1.get('file'));

    const res_img = await fetch('https://api.weixinyanxuan.com/mall/api/img/upload', {
        method: request.method,
        headers: imgheaders,
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
    const responseData = await res_img.json();
    try {
        if (responseData.code === 200) {
            const _URL = responseData.data;
            if (env.IMG) {
                await insertImageData(env.IMG, _URL, Referer, clientIP, 5, formattedDate);
            }

            return Response.json({
                "url": _URL,
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
        } else {

            return Response.json({
                "url": responseData.message,
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
        }

    } catch (e) {
        console.log(e);
        await insertImageData(env.IMG, responseData.result, Referer, clientIP, 5, formattedDate);
    }


    return Response.json({
        "url": "error",
    }, {
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



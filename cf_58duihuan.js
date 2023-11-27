addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

const handleRequest = async (request) => {
    // 解析请求 URL
    const url = new URL(request.url);

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("clientIP")
    const asOrganization = request.cf.asOrganization || ""

    if (url.pathname == "/") {
        const html = await fetch("https://raw.githubusercontent.com/x-dr/telegraph-Image/main/img.html")

        const page = await html.text()
        return new Response(page, {
            headers: {
                "content-type": "text/html;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*",
                "ip": `Access cloudflare's ip:${ip}`
            },
        })
    } else if (url.pathname == "/upload") {
        const imgData = await getImgData(request);
        return Response.json({
            "url": imgData,
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
    } else if (url.pathname == "/ip") {
        return Response.json({
            "ip": ip,
            "asOrganization": asOrganization
        }, {
            headers: {
                "content-type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*",
                "ip": ip
            },
        });
    }
}

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




async function getImgData(request) {


    // 生成随机字符串和时间戳
    const nonce = generateRandomString(8);
    const timestamp = String(Math.floor(new Date().getTime()));

    // 计算 MD5 哈希
    const acceptLocale = await calculateMD5Hash(nonce, timestamp);


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

    console.log(formData1.get('file'));
    const formData = new FormData();
    formData.append('nonce', nonce);
    formData.append('timestamp', timestamp);
    formData.append('file', formData1.get('file'));

    const res_img = await fetch('https://api.weixinyanxuan.com/mall/api/img/upload', {
        method: request.method,
        headers: imgheaders,
        body: formData,
    });
    const responseData = await res_img.json();
    try {
        if (responseData.code === 200) {
            const _URL = responseData.data;
            return _URL
        } else {
            return responseData.message
        }

    } catch (e) {

        return "error"

    }


}






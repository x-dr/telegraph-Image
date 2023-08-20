export async function onRequest(context) {
    const { request, env } = context;
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("clientIP")
    const asOrganization = request.cf.asOrganization || ""
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

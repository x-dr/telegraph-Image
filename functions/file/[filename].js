/**
 * GET /file/{filename}
 */
 export async function onRequestGet(context) {
    const {request} = context;
    const url = new URL(request.url);
    return await fetch('https://telegra.ph' + url.pathname);
}

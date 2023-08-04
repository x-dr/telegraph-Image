/**
 * GET /file/{filename}
 */


export const config = {
    runtime: 'edge',
  };


export default async function handler(request){ 
    const url = new URL(request.url);
    const newPathname = url.pathname.replace(/^\/api/, '');
    return await fetch('https://telegra.ph' + newPathname);
}

export const config = {
    runtime: 'edge',
  };


export default async function handler(request){ // Contents of context object  

     const url = new URL(request.url);
     const newPathname = url.pathname.replace(/^\/api/, '');
     const response = fetch('https://telegra.ph/' + newPathname, {
         method: request.method,
         headers: request.headers,
         body: request.body,
     });
    return response;
  }
  
export const config = {
  runtime: 'edge',
};
export default async function handler(request) {
  const urlParams = process.env
  const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
  return new Response(
    // process.env,
    JSON.stringify({
      "ip":clientIP
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    },
  );
}


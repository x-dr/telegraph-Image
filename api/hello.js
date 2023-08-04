export const config = {
  runtime: 'edge',
};
export default async function handler(request) {
  const urlParams = process.env
  // const urlParams = new URL(request.url)

  return new Response(
    // process.env,
    JSON.stringify(process.env),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    },
  );
}


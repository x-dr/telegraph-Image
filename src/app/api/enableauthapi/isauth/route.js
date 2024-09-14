
export const runtime = 'edge';
import { auth } from "@/auth";

export async function GET(request) {

  const enableAuthapi = process.env.ENABLE_AUTH_API === 'true';
  const session = await auth();
  const role = session?.user?.role;
//  console.log(session);
 
  return new Response(
    JSON.stringify({
      status: "success",
      "message": "You are logged in by user !",
      "success": true,
      "enableAuthapi": enableAuthapi,
      "role": role
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  )

}



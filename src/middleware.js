import { auth } from "@/auth"
const ROOT = '/';
const PUBLIC_ROUTES = ['/'];
const DEFAULT_REDIRECT = '/login';
const LOGIN = '/login'
const API_ADMIN = "/api/admin"
const ADMIN_PAGE = "/admin"


export default auth((req) => {
    const { nextUrl } = req;
    const isAuthenticated = !!req.auth;
    // console.log(isAuthenticated, nextUrl);
    const isAPI_ADMIN = nextUrl.pathname.startsWith(API_ADMIN);
    const isADMIN_PAGE = nextUrl.pathname.startsWith(ADMIN_PAGE);
    if (!isAuthenticated) {
        if (isAPI_ADMIN) {
            return Response.json(
                { status: "fail", message: "You are not logged in",success:false },
                { status: 401 },
            )
        }
        else if (isADMIN_PAGE) {
            return Response.redirect(new URL(LOGIN, nextUrl));
        } else {
            // console.log("2");
            return


        }





    }


})

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
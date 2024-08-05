import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth }= NextAuth({
  providers: [
    CredentialsProvider(
      {

      authorize: async (credentials) => {
        // 这里是你自己的身份验证逻辑
        // console.log(credentials);
        // const user = { id: 1, name: 'User', email: 'user@example.com' };
        
        // if (credentials.username === "1" && credentials.password === "1") {
        if (credentials.username === process.env.BASIC_USER && credentials.password === process.env.BASIC_PASS) {
          return { id: 1, name: process.env.BASIC_USER, email: 'user@example.com' }
        } else {
          return Promise.resolve(null);
        }
      }
    })
  ],
  pages: {
    signIn: '/login', // 登录页面的路径
    signOut: '/'
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 会话的过期时间，单位为秒，这里设置为24小时
  },
  secret: '00Fv/YUm0enwy04IgP4KoNOWLODe2iJ1tvBzr+4kEZ8=', // 替换为你的安全密钥
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    async authorized({ auth,req }) {
      const isAuthenticated = !!auth?.user;

   
      return isAuthenticated;
     },

  },
  trustHost: true
});


// import { NextResponse } from "next/server";

// export async function middleware(request) {
//     const session = await middleware()
//     return NextResponse.redirect(new URL('/login', request.url))
//   }
   
export const config = {
    matcher: ["/admin/:path*"],
  };
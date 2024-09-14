import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider(
      {

        authorize: async (credentials) => {
          // console.log('Credentials:', credentials);
          const adminUser = {
            username: process.env.BASIC_USER,
            password: process.env.BASIC_PASS
          };

          const regularUser = {
            username: process.env.REGULAR_USER,
            password: process.env.REGULAR_PASS
          };

          if (credentials.username === adminUser.username && credentials.password === adminUser.password) {
            const user = {
              id: 1,
              name: process.env.BASIC_USER,
              email: 'admin@example.com',
              role: 'admin',
              createdAt: new Date().toISOString()
            };
            return user;
          }

          // 验证普通用户
          if (credentials.username === regularUser.username && credentials.password === regularUser.password) {
            const user = {
              id: 2,
              name: process.env.REGULAR_USER,
              email: 'user@example.com',
              role: 'user',
              createdAt: new Date().toISOString()
            };
            return user;

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
  secret: process.env.SECRET || '00Fv/YUm0enwy04IgP4KoNOWLODe2iJ1tvBzr+4kEZ8=', // 替换为你的安全密钥
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role; 
        token.createdAt = user.createdAt; 
      }
      return token;
    },
    async session({ session, token }) {

      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.role = token.role; 
      session.user.createdAt = token.createdAt; 
      return session;
    },
    async authorized({ auth, req }) {
      const isAuthenticated = !!auth?.user;


      return isAuthenticated;
    },

  },
  trustHost: true
});



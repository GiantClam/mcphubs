import NextAuth from "next-auth"
import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

// 检查是否有OAuth配置
const hasGitHubConfig = process.env.GITHUB_ID && process.env.GITHUB_SECRET;
const hasGoogleConfig = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

const authOptions: NextAuthOptions = {
  providers: [
    // 只有在有配置的情况下才添加providers
    ...(hasGitHubConfig ? [GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    })] : []),
    ...(hasGoogleConfig ? [GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })] : []),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (session.user) {
        (session.user as any).id = user?.id || token.sub || "";
      }
      return session;
    },
    async jwt({ token, user }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  // 提供默认的secret，避免500错误
  secret: process.env.NEXTAUTH_SECRET || "development-secret-please-change-in-production",
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 
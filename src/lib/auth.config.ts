import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute = nextUrl.pathname.startsWith('/admin')
      const isLoginPage = nextUrl.pathname === '/admin/login'
      const isApiUpload = nextUrl.pathname.startsWith('/api/upload')

      if (isLoginPage) {
        if (isLoggedIn) return Response.redirect(new URL('/admin', nextUrl))
        return true
      }

      if ((isAdminRoute || isApiUpload) && !isLoggedIn) {
        return false
      }

      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig

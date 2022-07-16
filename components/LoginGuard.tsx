import Head from 'next/head'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import { siteAdminUserId } from '../lib/config'

const LoginGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const { user, isLoading } = useUser()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    } else if (user && user.sub !== siteAdminUserId) {
      router.push('/api/auth/logout')
    }
  }, [router, user, isLoading])

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      <>{children}</>
    </>
  )
}

export default LoginGuard

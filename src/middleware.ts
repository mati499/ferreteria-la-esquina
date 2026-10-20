import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        remove(name: string, options: CookieOptions) {
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
        set(name: string, value: string, options: CookieOptions) {
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rutas de admin requieren autenticación y rol ADMIN
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Permitir acceso al login sin autenticación (evita bucle de redirecciones)
    if (request.nextUrl.pathname === '/admin/login') {
      return supabaseResponse
    }

    if (!user) {
      return withSessionCookies(
        NextResponse.redirect(new URL('/admin/login', request.url)),
        supabaseResponse,
      )
    }

    const userRole = String(user.app_metadata?.role ?? user.user_metadata?.role ?? '').toLowerCase()
    if (userRole !== 'admin') {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('error', 'rol')
      return withSessionCookies(NextResponse.redirect(loginUrl), supabaseResponse)
    }
  }

  return supabaseResponse
}

function withSessionCookies(response: NextResponse, sessionResponse: NextResponse) {
  sessionResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie)
  })
  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}

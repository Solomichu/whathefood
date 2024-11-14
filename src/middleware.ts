import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequestWithAuth } from 'next-auth/middleware'

export default async function middleware(request: NextRequestWithAuth) {
  const token = await getToken({ req: request })
  const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register'
  const isPublicPage = request.nextUrl.pathname === '/'
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')
  const isDishesPage = request.nextUrl.pathname.startsWith('/dishes')
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')
  const isProfilePage = request.nextUrl.pathname.startsWith('/profile')
  const isTasksPage = request.nextUrl.pathname.startsWith('/tasks')
  const isUsersPage = request.nextUrl.pathname.startsWith('/users')


  // Si el usuario no es admin y intenta acceder a las páginas de tasks o users
  if (isTasksPage && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (isUsersPage && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
 
  if (isDishesPage && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }


  // Si el usuario no está autenticado
  if (!token) {
    // Si intenta acceder a una página protegida
    if (isDashboardPage || isAdminPage) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (isProfilePage) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Si está en una página pública o de auth, permitir acceso
    if (isPublicPage || isAuthPage) {
      return NextResponse.next()
    }
    
  }

  // Si el usuario está autenticado
  if (token) {
    // Si intenta acceder a páginas de auth estando autenticado
    if (isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (isLoginPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // Si intenta acceder a páginas de admin sin ser admin
    if (isAdminPage && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Permitir acceso a todas las demás rutas para usuarios autenticados
    return NextResponse.next()
  }

  // Por defecto, permitir la navegación
  return NextResponse.next()
}

// Configurar las rutas que el middleware debe manejar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (archivos estáticos de imágenes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}

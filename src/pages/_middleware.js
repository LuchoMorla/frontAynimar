import endPoints from '@services/api';
import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const { token } = request.cookies;

  if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) {
    if (token) {
      const response = await fetch(endPoints.auth.profile, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      const profile = await response.text();

      if (profile !== "Unauthorized") {
        const { role } = JSON.parse(profile);

        if (role === "business_owner") return NextResponse.redirect(new URL('/dashboard', request.url));
      }

    }
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url))
    const response = await fetch(endPoints.auth.profile, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    const profile = await response.text();

    if (profile === "Unauthorized") return NextResponse.redirect(new URL('/login', request.url));

    const { role } = JSON.parse(profile);

    if (role !== "business_owner") return NextResponse.redirect(new URL('/login', request.url))
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/dashboard/:path*',
}
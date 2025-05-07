import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');

  if (!category) {
    return NextResponse.redirect(new URL('/tools', request.url));
  }

  // Redirect to the new URL structure
  return NextResponse.redirect(new URL(`/category/${category}`, request.url));
} 
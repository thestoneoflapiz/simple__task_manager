import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server'
 
export async function middleware(req) {
  const session = await getToken({ req });

  const rawPathname = req.nextUrl?.pathname;
  const splitPathname = rawPathname.split("/");
    let pathname = "";
  if( splitPathname.length > 3 ){
    const removedPathname = splitPathname.slice(0,3);
    pathname = removedPathname.join("/");
  }else{
    pathname = splitPathname.join("/");
  }

  if(session && session.user?._id){
    return;
  } 
  
  return NextResponse.redirect(new URL('/', req.url))
}
 
export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
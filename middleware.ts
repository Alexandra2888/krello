import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/api/webhook"]);

export default clerkMiddleware((auth, req) => {
  const { userId, orgId, redirectToSignIn } = auth();

  if (userId && isPublicRoute(req)) {
    const path = orgId ? `/organization/${orgId}` : "/select-org";
    return NextResponse.redirect(new URL(path, req.url));
  }

  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  if (userId && !orgId && req.nextUrl.pathname !== "/select-org") {
    return NextResponse.redirect(new URL("/select-org", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/api/webhook",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/select-org(.*)",
]);

export default clerkMiddleware(
  async (auth, req) => {
    const { userId, orgId, redirectToSignIn } = await auth();

    if (userId && req.nextUrl.pathname === "/") {
      const path = orgId ? `/organization/${orgId}` : "/select-org";
      return NextResponse.redirect(new URL(path, req.url));
    }

    if (!userId && !isPublicRoute(req)) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (userId && !orgId && !isPublicRoute(req)) {
      return NextResponse.redirect(new URL("/select-org", req.url));
    }
  },
  {
    organizationSyncOptions: {
      organizationPatterns: [
        "/organization/:id",
        "/organization/:id/(.*)",
      ],
    },
  },
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
	const userAgent = (req.headers.get("user-agent") || "").toLowerCase();
	const isCli = userAgent.includes("curl");
	const pathname = req.nextUrl.pathname;

	if (!isCli)
		return new NextResponse("Redirecting to main API...", {
			status: 302,
			headers: {
				Location: "https://api.8.alialmasi.ir",
				"Content-Type": "text/plain; charset=utf-8"
			}
		});

	if (pathname !== "/") return NextResponse.redirect(new URL("/", req.url));

	return NextResponse.next();
}

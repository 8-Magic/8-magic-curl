import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
	const userAgent: string = (req.headers.get("user-agent") || "").toLowerCase();
	console.warn("User Agent: " + userAgent);
	const isCli = userAgent.includes("curl");
	console.warn("Is curl: " + isCli ? "yes" : "no");
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

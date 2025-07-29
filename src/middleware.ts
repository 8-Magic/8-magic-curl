import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest): NextResponse {
	const pathname = req.nextUrl.pathname;

	if (pathname !== "/")
		return new NextResponse("404 Not Found\n", {
			headers: {
				"Content-Type": "text/plain; charset=utf-8"
			}
		});

	return NextResponse.next();
}

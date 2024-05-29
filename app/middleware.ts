import {NextRequest, NextResponse} from 'next/server'
import { getServerSession} from "next-auth";

export const config = {
    matcher: '/admin/:path*'
}

export function middleware(request: NextRequest) {
    return Response.json(
        { success: false, message: 'authentication failed'},
        {status: 401},
    )
}
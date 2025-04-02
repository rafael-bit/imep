import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/services/auth";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ authenticated: false }, { status: 401 });
		}

		return NextResponse.json({
			authenticated: true,
			user: session.user
		});
	} catch (error) {
		console.error("Session check error:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
} 
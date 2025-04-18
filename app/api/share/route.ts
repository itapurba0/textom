import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import SharedText from "@/model/SharedText";
export async function POST(req: Request) {
    const { content } = await req.json();
    const code = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit code

    try {
        await connectToDatabase(); // Ensure the database connection is established

        // Save the shared text to the database
        await SharedText.create({ code, content });

        return NextResponse.json({ code });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import SharedText from "@/model/SharedText";
export async function POST(req: Request) {
    const { content } = await req.json();
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    try {
        await connectToDatabase();

        await SharedText.create({ code, content });

        return NextResponse.json({ code });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
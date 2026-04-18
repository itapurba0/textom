import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import SharedText from "@/model/SharedText";

export async function POST(req: Request) {
    const { content } = await req.json();

    if (!content?.trim()) {
        return NextResponse.json({ error: "Content required" }, { status: 400 });
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();

    try {
        await connectToDatabase();
        await SharedText.create({ code, content });
        return NextResponse.json({ code }, { status: 201 });
    } catch (_err) { // eslint-disable-line @typescript-eslint/no-unused-vars
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
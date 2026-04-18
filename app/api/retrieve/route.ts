
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import SharedText from "@/model/SharedText";

export async function POST(req: Request) {
    const { code } = await req.json();

    try {
        await connectToDatabase();
        const result = await SharedText.findOne({ code });
        if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ content: result.content });
    } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
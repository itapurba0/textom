
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import SharedText from "@/model/SharedText";

export async function POST(req: Request) {
    const { code } = await req.json();

    try {
        await connectToDatabase();

        const result = await SharedText.findOne({ code });

        if (!result) {
            return NextResponse.json({ error: "Code not found or expired" }, { status: 404 });
        }

        return NextResponse.json({ content: result.content });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
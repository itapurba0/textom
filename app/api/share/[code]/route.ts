import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import SharedText from "@/model/SharedText";

async function updateSharedText(req: Request) {
    try {
        const code = new URL(req.url).pathname.split("/").pop();
        if (!code) return NextResponse.json({ error: "No code" }, { status: 400 });

        const { content } = await req.json();
        if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });

        await connectToDatabase();
        const result = await SharedText.findOneAndUpdate({ code }, { content }, { new: true });

        if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ code });
    } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

export const PUT = updateSharedText;
export const PATCH = updateSharedText;
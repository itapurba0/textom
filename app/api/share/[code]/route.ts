import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import SharedText from "@/model/SharedText";

export async function PUT(req: Request) {
    try {
        const url = new URL(req.url);
        const code = url.pathname.split("/").pop();
        if (!code) {
            return NextResponse.json({ error: "Code parameter is missing." }, { status: 400 });
        }

        const { content } = await req.json();

        await connectToDatabase();

        const result = await SharedText.findOneAndUpdate(
            { code },
            { content },
            { new: true }
        );

        if (!result) {
            return NextResponse.json({ error: "Code not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Content updated successfully" });
    } catch (error) {
        console.error("Error updating content:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
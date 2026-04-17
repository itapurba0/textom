import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import SharedText from "@/model/SharedText";

export async function POST(req: Request) {
    try {
        const { content } = await req.json();

        if (!content || typeof content !== "string") {
            return NextResponse.json(
                { error: "Content is required and must be a string" },
                { status: 400 }
            );
        }

        const code = Math.floor(1000 + Math.random() * 9000).toString();

        await connectToDatabase();
        await SharedText.create({ code, content });

        return NextResponse.json({ code }, { status: 201 });
    } catch (error) {
        console.error("Error creating shared text:", error);
        return NextResponse.json(
            { error: "Failed to create shared text. Please try again." },
            { status: 500 }
        );
    }
}
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import SharedText from "@/model/SharedText";

async function updateSharedText(req: Request) {
    try {
        const url = new URL(req.url);
        const code = url.pathname.split("/").pop();

        if (!code) {
            return NextResponse.json(
                { error: "Code parameter is missing." },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { content } = body;

        if (!content || typeof content !== "string") {
            return NextResponse.json(
                { error: "Content is required and must be a string" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const result = await SharedText.findOneAndUpdate(
            { code },
            { content },
            { new: true }
        );

        if (!result) {
            return NextResponse.json(
                { error: "Code not found or expired" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { code, message: "Content updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating content:", error);
        return NextResponse.json(
            { error: "Failed to update shared text. Please try again." },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    return updateSharedText(req);
}

export async function PATCH(req: Request) {
    return updateSharedText(req);
}
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongoose";
import SharedText from "@/model/SharedText";

export async function PUT(req: Request, { params }: { params: { code: string } }) {
    const { code } = params;
    const { content } = await req.json();

    try {
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
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
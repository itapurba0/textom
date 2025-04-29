import { NextResponse } from "next/server";
import zlib from "zlib";
import connectToDatabase from "@/lib/mongoose";
import SharedFile from "@/model/SharedFile";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const code = url.pathname.split("/").pop();

        if (!code) {
            return NextResponse.json({ error: "Code parameter is missing." }, { status: 400 });
        }

        await connectToDatabase();

        const file = await SharedFile.findOne({ code });
        if (!file) {
            return NextResponse.json({ error: "File not found or expired." }, { status: 404 });
        }

        const decompressedFile = zlib.gunzipSync(file.fileData);

        return new Response(decompressedFile, {
            headers: {
                "Content-Type": file.mimeType,
                "Content-Disposition": `attachment; filename="${file.fileName}"`,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to retrieve the file." + error },
            { status: 500 }
        );
    }
}
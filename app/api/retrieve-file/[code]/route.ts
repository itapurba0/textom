import { NextResponse } from "next/server";
import zlib from "zlib"; // Import zlib for decompression
import connectToDatabase from "@/lib/mongoose";
import SharedFile from "@/model/SharedFile";

export async function GET(req: Request, { params }: { params: { code: string } }) {
    const { code } = params;

    try {
        await connectToDatabase();

        // Find the file in the database
        const file = await SharedFile.findOne({ code });
        if (!file) {
            return NextResponse.json({ error: "File not found or expired." }, { status: 404 });
        }

        // Decompress the file
        const decompressedFile = zlib.gunzipSync(file.fileData);

        // Return the file as a downloadable response
        return new Response(decompressedFile, {
            headers: {
                "Content-Type": file.mimeType,
                "Content-Disposition": `attachment; filename="${file.fileName}"`,
            },
        });
    } catch (error) {
        console.error("Error retrieving file:", error);
        return NextResponse.json(
            { error: "Failed to retrieve the file." },
            { status: 500 }
        );
    }
}
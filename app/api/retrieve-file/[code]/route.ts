import { NextResponse } from "next/server";
import zlib from "zlib";
import connectToDatabase from "@/lib/mongoose";
import SharedFile from "@/model/SharedFile";


interface RouteParams {
    params: {
        code: string;
    };
}

export async function GET(req: Request, { params }: RouteParams) {
    console.log("Params:", params);

    const { code } = params;

    try {
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
        console.error("Error retrieving file:", error);
        return NextResponse.json(
            { error: "Failed to retrieve the file." },
            { status: 500 }
        );
    }
}
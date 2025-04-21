import { NextResponse } from "next/server";
import zlib from "zlib"; // Import zlib for compression
import connectToDatabase from "@/lib/mongoose";
import SharedFile from "@/model/SharedFile";

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    try {
        await connectToDatabase();

        let code;
        do {
            code = Math.floor(1000 + Math.random() * 9000).toString();
        } while (await SharedFile.findOne({ code }));
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        const compressedFile = zlib.gzipSync(fileBuffer);

        await SharedFile.create({
            code,
            fileName: file.name,
            fileData: compressedFile,
            mimeType: file.type,
        });

        return NextResponse.json({ code });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: "Failed to upload the file." },
            { status: 500 }
        );
    }
}
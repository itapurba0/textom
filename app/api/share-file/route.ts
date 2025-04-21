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
            code = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a random 4-digit code
        } while (await SharedFile.findOne({ code })); // Ensure the code is unique

        // Convert the file to a Buffer
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // Compress the file using zlib
        const compressedFile = zlib.gzipSync(fileBuffer);

        // Save the compressed file in the database
        await SharedFile.create({
            code,
            fileName: file.name,
            fileData: compressedFile, // Store the compressed file
            mimeType: file.type,
        });

        // Return the generated code
        return NextResponse.json({ code });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: "Failed to upload the file." },
            { status: 500 }
        );
    }
}
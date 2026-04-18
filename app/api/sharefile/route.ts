import { NextResponse } from "next/server";
import zlib from "zlib";
import connectToDatabase from "@/lib/mongoose";
import SharedFile from "@/model/SharedFile";

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    try {
        await connectToDatabase();

        let code;
        do {
            code = Math.floor(1000 + Math.random() * 9000).toString();
        } while (await SharedFile.findOne({ code }));

        const compressed = zlib.gzipSync(Buffer.from(await file.arrayBuffer()));

        await SharedFile.create({ code, fileName: file.name, fileData: compressed, mimeType: file.type });
        return NextResponse.json({ code });
    } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
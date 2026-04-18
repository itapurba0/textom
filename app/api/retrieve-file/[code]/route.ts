import { NextResponse } from "next/server";
import zlib from "zlib";
import connectToDatabase from "@/lib/mongoose";
import SharedFile from "@/model/SharedFile";

export async function GET(req: Request) {
    try {
        const code = new URL(req.url).pathname.split("/").pop();
        if (!code) return NextResponse.json({ error: "No code" }, { status: 400 });

        await connectToDatabase();

        const file = await SharedFile.findOne({ code });
        if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

        const decompressed = zlib.gunzipSync(file.fileData);

        return new Response(new Uint8Array(decompressed), {
            headers: {
                "Content-Type": file.mimeType,
                "Content-Disposition": `attachment; filename="${file.fileName}"`,
            },
        });
    } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
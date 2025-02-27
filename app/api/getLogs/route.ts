// api/fetLogs/route.ts
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
    try {
        const client = await MongoClient.connect(process.env.MONGO_URI!);
        const db = client.db("myDatabase");
        const collection = db.collection("visitor_logs");

        const logs = await collection.find().sort({ timestamp: -1 }).toArray();
        client.close();

        return NextResponse.json(logs);
    } catch (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

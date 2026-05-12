import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

// GET
export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET ERROR:", error);   // 👈 IMPORTANT

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.status) {
  body.status = "Pending";
}
    console.log("REQ BODY:", body);
    const newOrder = await Order.create(body);

    return NextResponse.json(newOrder);
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    await Order.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// PUT
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    await Order.findByIdAndUpdate(body._id, body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT ERROR:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {

    await connectDB();

    const body = await req.json();

    const updatedOrder =
      await Order.findByIdAndUpdate(
        params.id,
        {
          $set: body,
        },
        { new: true }
      );

    return NextResponse.json(updatedOrder);

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );

  }
}
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function PATCH(
  req: Request,
  { params }: any
) {
  try {

    await connectDB();

    const body = await req.json();

    const { id } =
      await params;

    const updatedOrder =
      await Order.findByIdAndUpdate(
        id,
        {
          $set: {
            status: body.status,
            driverName:
              body.driverName,
            vehicleNumber:
              body.vehicleNumber,
            executionDate:
              body.executionDate,
            deadline:
              body.deadline,
            approved:
              body.approved,
          },
        },
        { new: true }
      );

    return NextResponse.json(
      updatedOrder
    );

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );

  }
}
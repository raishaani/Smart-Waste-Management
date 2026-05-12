import { NextResponse } from "next/server";
import Vehicle from "@/models/Vehicle";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  await connectDB();

  const vehicles = await Vehicle.find();

  return NextResponse.json(vehicles);
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const vehicle = await Vehicle.create(body);

  return NextResponse.json(vehicle);
}
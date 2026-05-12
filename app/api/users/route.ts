import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

// GET users
export async function GET() {
  await connectDB();
  const users = await User.find();
  return NextResponse.json(users);
}

// POST user
export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const newUser = await User.create(body);

  return NextResponse.json(newUser);
}
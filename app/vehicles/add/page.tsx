"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import DashboardLayout from "@/components/dashboard-layout";
import { TopNav } from "@/components/top-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddVehiclePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    vehicleNumber: "",
    capacity: "",
    driverName: "",
    ownerName: "",
    status: "Available",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch("/api/vehicles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        capacity: Number(form.capacity),
      }),
    });

    router.push("/vehicles");
  };

  return (
    <DashboardLayout>
      <TopNav title="Add Vehicle" />

      <div className="p-4 md:p-6">
        <div className="max-w-xl mx-auto rounded-lg border bg-card p-6 shadow-sm">

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <Input
              name="vehicleNumber"
              placeholder="Vehicle Number"
              onChange={handleChange}
            />

            <Input
              name="capacity"
              placeholder="Capacity"
              onChange={handleChange}
            />

            <Input
              name="driverName"
              placeholder="Driver Name"
              onChange={handleChange}
            />

            <Input
              name="ownerName"
              placeholder="Owner Name"
              onChange={handleChange}
            />

            <Button type="submit">
              Add Vehicle
            </Button>
          </form>

        </div>
      </div>
    </DashboardLayout>
  );
}
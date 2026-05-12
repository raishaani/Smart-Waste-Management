"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { TopNav } from "@/components/top-nav";
import { Input } from "@/components/ui/input";
export default function AddOrderPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    clientName: "",
    phone: "",
    location: "",
    lat: "",
    lng: "",
    status: "Pending",
    amount: "",
    wasteWeight: "",
    pickupDate: "",
    deadline: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: any) => {
  e.preventDefault();

  try {
    // ✅ Get coordinates from location name
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.location)}`
    );

    const geoData = await geoRes.json();
    console.log("GEO DATA:", geoData);
    if (!geoData.length) {
      alert("Location not found");
      return;
    }

    const lat = Number(geoData[0].lat);
    const lng = Number(geoData[0].lon);

    // ✅ Save order
    await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientName: form.clientName,
        phone: form.phone,
        location: form.location,

        lat,
        lng,

        status: form.status,
        amount: Number(form.amount),
        wasteWeight: Number(form.wasteWeight),

        pickupDate: form.pickupDate,
        deadline: form.deadline,
      }),
    });

    router.push("/orders");
  } catch (error) {
    console.error(error);
    alert("Failed to add order");
  }
};
  return (
  <DashboardLayout>
    <TopNav title="Add Order" />

    <div className="p-4 md:p-6">
      <div className="max-w-2xl mx-auto rounded-lg border bg-card p-6 shadow-sm">

        <h1 className="text-xl font-bold mb-4">Add Order</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <Input name="clientName" placeholder="Client Name" onChange={handleChange} />
        <Input name="phone" placeholder="Phone" onChange={handleChange} />
        <Input
            name="location"
            placeholder="Location (e.g. Mangalore)"
            onChange={handleChange}
        />
       

        <Input name="amount" placeholder="Amount" onChange={handleChange} />
        <Input name="wasteWeight" placeholder="Waste Weight" onChange={handleChange} />

        <div className="grid grid-cols-2 gap-4">

  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium">Pickup Date</label>
    <Input type="date" name="pickupDate" onChange={handleChange} />
  </div>

  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium">Deadline</label>
    <Input type="date" name="deadline" onChange={handleChange} />
  </div>

</div>

        <select name="status" onChange={handleChange}>
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="Completed">Completed</option>
        </select>

        <button className="bg-blue-500 text-white p-2 rounded">
          Add Order
        </button>
      </form>
    </div>
    </div>
</DashboardLayout>
  );
}

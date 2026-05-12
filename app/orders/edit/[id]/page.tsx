"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import DashboardLayout from "@/components/dashboard-layout";
import { TopNav } from "@/components/top-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditOrderPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<any>({
  clientName: "",
  phone: "",
  location: "",
  amount: "",
  wasteWeight: "",
  pickupDate: "",
  deadline: "",
  status: "Pending",
});

  // 🔹 Fetch existing order
  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch("/api/orders");
      const data = await res.json();
      const order = data.find((o: any) => o._id === id);
      setForm(order || {});
    };
    fetchOrder();
  }, [id]);

  // 🔹 Handle input changes
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Submit updated data
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const geoRes = await fetch(
  `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.location)}`
);

const geoData = await geoRes.json();

if (!geoData.length) {
  alert("Location not found");
  return;
}

const lat = Number(geoData[0].lat);
const lng = Number(geoData[0].lon);

await fetch("/api/orders", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    ...form,
    lat,
    lng,
    amount: Number(form.amount),
    wasteWeight: Number(form.wasteWeight),
  }),
});

    router.push("/orders");
  };

  return (
    <DashboardLayout>
      <TopNav title="Edit Order" />

      <div className="p-4 md:p-6">
        <div className="max-w-2xl mx-auto rounded-lg border bg-card p-6 shadow-sm">

          <form onSubmit={handleSubmit} className="grid gap-4">

            {/* Client Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Client Name</label>
              <Input
                name="clientName"
                value={form.clientName || ""}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Phone</label>
              <Input
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
              />
            </div>

            {/* Location */}
            <Input
  name="location"
  placeholder="Location"
  value={form.location}
  onChange={handleChange}
/>

            {/* Amount & Waste */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Amount</label>
                <Input
                  name="amount"
                  value={form.amount || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Waste Weight</label>
                <Input
                  name="wasteWeight"
                  value={form.wasteWeight || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Pickup Date</label>
                <Input
                  type="date"
                  name="pickupDate"
                  value={form.pickupDate?.substring(0, 10) || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Deadline</label>
                <Input
                  type="date"
                  name="deadline"
                  value={form.deadline?.substring(0, 10) || ""}
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Status</label>
              <select
                name="status"
                value={form.status || "Pending"}
                onChange={handleChange}
                className="border rounded-md p-2 bg-background"
              >
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Submit */}
            <Button type="submit">Update Order</Button>

          </form>

        </div>
      </div>
    </DashboardLayout>
  );
}
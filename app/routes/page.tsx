"use client"

import { useState, useEffect, useMemo } from "react";
import {
  CalendarDays,
  AlertCircle,
  CheckCircle2,
  Weight,
  Truck,
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { TopNav } from "@/components/top-nav"
import { MapSection } from "@/components/map-section"
import { OrdersTable } from "@/components/orders-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { orders } from "@/lib/dummy-data"
import { cn } from "@/lib/utils"

export default function RouteAssignmentPage() {
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [vehiclesData, setVehiclesData] = useState<any[]>([]);
  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();

      if (Array.isArray(data)) {
        setOrdersData(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders");
    }
  };

  fetchOrders();
  const fetchVehicles = async () => {
  try {
    const res = await fetch("/api/vehicles");
    const data = await res.json();

    if (Array.isArray(data)) {
      setVehiclesData(data);
    }
  } catch (err) {
    console.error("Failed to fetch vehicles");
  }
};

fetchVehicles();
}, []);
  const pendingOrders =
  ordersData.filter(
    (o: any) =>
      o.status !== "Completed"
  );
  console.log(ordersData);
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<string>("")
  const [executionDate, setExecutionDate] = useState("")
  const [deadline, setDeadline] = useState("")

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const selectedOrders = pendingOrders.filter((o) =>
    selectedIds.includes(o._id)
  )
  const totalWeight = selectedOrders.reduce(
    (sum, o) => sum + o.wasteWeight,
    0
  )

  const vehicle = vehiclesData.find(
  (v) => String(v._id) === String(selectedVehicle)
)
  const capacityUsed = vehicle ? (totalWeight / vehicle.capacity) * 100 : 0
  const overCapacity = vehicle ? totalWeight > vehicle.capacity : false

  const mapMarkers = useMemo(
    () =>
      selectedOrders.map((o) => ({
        id: o._id,
        label: o.clientName.split(" ")[0],
        lat: o.lat,
        lng: o.lng,
        color: "red" as const,
        popup: {
          clientName: o.clientName,
          phone: o.phone,
          orderId: o.id,
          wasteWeight: o.wasteWeight,
          pickupDate: o.pickupDate,
          deadline: o.deadline,
          status: o.status,
        },
      })),
    [selectedOrders]
  )

  const canAssign =
    selectedIds.length > 0 &&
    selectedVehicle &&
    executionDate &&
    deadline &&
    !overCapacity

  return (
    <DashboardLayout>
      <TopNav title="Route Assignment" />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Orders Selection */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-foreground">
              Select Pending Orders
            </h2>
            <OrdersTable
              orders={pendingOrders}
              compact
              selectable
              hideDelete
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              showAssign={false}
            />

            {/* Map showing selected orders */}
            {selectedOrders.length > 0 && (
              <MapSection
                markers={mapMarkers}
                title="Selected Pickup Locations"
                showRoute
              />
            )}
          </div>

          {/* Right: Assignment Panel */}
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Weight className="size-4 text-primary" />
                  Weight Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Selected Orders</span>
                  <span className="font-semibold">{selectedIds.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Weight</span>
                  <span className="font-mono font-semibold">
                    {totalWeight} kg
                  </span>
                </div>
                {vehicle && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Vehicle Capacity
                      </span>
                      <span className="font-mono font-semibold">
                        {vehicle.capacity} kg
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Capacity Used
                        </span>
                        <span
                          className={cn(
                            "font-medium",
                            overCapacity
                              ? "text-destructive"
                              : "text-primary"
                          )}
                        >
                          {Math.round(capacityUsed)}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min(capacityUsed, 100)}
                        className={cn(
                          "h-2",
                          overCapacity && "[&>div]:bg-destructive"
                        )}
                      />
                    </div>
                    {overCapacity && (
                      <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-2 text-xs text-destructive">
                        <AlertCircle className="size-3.5 shrink-0" />
                        Weight exceeds vehicle capacity by{" "}
                        {totalWeight - vehicle.capacity} kg
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Truck className="size-4 text-primary" />
                  Assignment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs">Select Vehicle</Label>
                  <Select
                    value={selectedVehicle}
                    onValueChange={setSelectedVehicle}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose driver & vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehiclesData
                        .filter((v) => v.status === "Available")
                        .map((v) => (
                          <SelectItem key={v._id} value={v._id}>
                            {v.vehicleNumber} ({v.capacity} kg) -{" "}
                            {v.driverName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs">Execution Date</Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="date"
                      value={executionDate}
                      onChange={(e) => setExecutionDate(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs">Deadline</Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <Button
  className="mt-2 w-full gap-2"
  disabled={!canAssign}
  onClick={async () => {

    if (!vehicle) {
      alert("Please select a vehicle");
      return;
    }

    for (const id of selectedIds) {

      const res = await fetch(
  `/api/orders/${id}`,
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
  status: "Assigned",

   driverName:
  vehicle?.driverName || "",

vehicleNumber:
  vehicle?.vehicleNumber || "",

  executionDate,
  deadline,
}),
  }
);

const updated =
  await res.json();

console.log(updated);
    }

    const updatedRes = await fetch("/api/orders");

const updatedOrders =
  await updatedRes.json();

setOrdersData(updatedOrders);
setSelectedIds([]);

  }}
>
  <CheckCircle2 className="size-4" />
  Assign Route
</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

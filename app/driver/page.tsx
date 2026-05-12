"use client"

import { useState, useEffect } from "react"
import {
  CalendarDays,
  Clock,
  Truck,
  Phone,
  MapPin,
  Camera,
  CheckCircle2,
  Navigation,
  Send,
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { TopNav } from "@/components/top-nav"
import { MapSection } from "@/components/map-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"


export default function DriverDashboard() {
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [vehiclesData, setVehiclesData] = useState<any[]>([]);
  const [selectedDriver, setSelectedDriver] =
  useState<string>("");
  useEffect(() => {

  const fetchOrders = async () => {

    const res =
      await fetch("/api/orders");

    const data =
      await res.json();

    if (Array.isArray(data)) {
      setOrdersData(data);
    }

  };

  const fetchVehicles = async () => {

    const res =
      await fetch("/api/vehicles");

    const data =
      await res.json();

    if (Array.isArray(data)) {

      setVehiclesData(data);

      if (data.length > 0) {

        setSelectedDriver(
          data[0].driverName
        );

      }

    }

  };

  fetchOrders();
  fetchVehicles();

}, []);
const assignedOrders =
  ordersData.filter(
    (o: any) =>
      o.status === "Assigned" &&
      o.driverName === selectedDriver
  );
  const currentVehicle =
  vehiclesData.find(
    (v: any) =>
      v.driverName === selectedDriver
  );
  const drivers =
  vehiclesData.map(
    (v: any) => v.driverName
  );
  const [pickupPhotos, setPickupPhotos] =
  useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] =
  useState<string>("");
  const routeMarkers =
  assignedOrders.map((o: any, idx: number) => ({
    id: `pickup-${idx}`,
    label: o.clientName,
    lat: o.lat,
    lng: o.lng,
    color: "yellow" as const,
  }));
  return (
    <DashboardLayout>
      <TopNav title="Driver Dashboard" />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <select
  className="rounded-md border p-2"
  value={selectedDriver}
  onChange={(e) =>
    setSelectedDriver(e.target.value)
  }
>

  <option value="">
    Select Driver
  </option>

  {drivers.map(
    (driver: any, idx: number) => (
      <option
        key={idx}
        value={driver}
      >
        {driver}
      </option>
    )
  )}

</select>
        {/* Trip Info Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Truck className="size-5 text-primary" />
                Assigned Work
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-chart-4/10 text-chart-4 border-chart-4/20"
              >
                In Progress
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Trip ID</span>
                <span className="font-mono text-sm font-semibold text-card-foreground">
                  {currentVehicle?.driverName || "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="size-3" />
                  Assigned Date
                </span>
                <span className="text-sm font-medium text-card-foreground">
                  {assignedOrders[0]?.pickupDate || "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" />
                  Deadline
                </span>
                <span className="text-sm font-medium text-card-foreground">
                  {assignedOrders[0]?.deadline || "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Vehicle</span>
                <span className="font-mono text-sm font-medium text-card-foreground">
                  
                  {
  currentVehicle?.vehicleNumber
    || "Vehicle Pending"
}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Route Map */}
        <MapSection
          markers={routeMarkers}
          title="Route Map"
          showRoute
        />

        {/* Pickup List */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-foreground">
            Pickup Locations ({assignedOrders.length})
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assignedOrders.map((pickup: any, idx: number) => (
  <Card
    key={idx}
    className={cn(
      pickup.status === "Completed" &&
        "border-primary/30 bg-primary/5"
    )}
  >
                <CardContent className="flex flex-col gap-3 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-0.5">
                      <h3 className="text-sm font-semibold text-card-foreground">
                        {pickup.clientName}
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="size-3" />
                        {pickup.phone}
                      </p>
                    </div>
                    {pickup.status === "Completed" ? (
                      <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CheckCircle2 className="size-4" />
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-[10px] bg-chart-4/10 text-chart-4 border-chart-4/20">
                        Pending
                      </Badge>
                    )}
                  </div>
                  <p className="flex items-start gap-1 text-xs text-muted-foreground">
                    <MapPin className="mt-0.5 size-3 shrink-0" />
                    {pickup.location}
                  </p>
                  <div className="pt-1">
                   <div className="flex flex-col gap-2">
                    <label className="cursor-pointer">
  <div className="flex items-center justify-center gap-2 rounded-md border p-2 text-sm hover:bg-muted transition">

    <Camera className="size-4" />

    {
      pickupPhotos[pickup._id]
        ? "Photo Uploaded"
        : "Upload Pickup Photo"
    }

  </div>

  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e: any) => {

      const file =
        e.target.files?.[0];

      if (file) {

        const imageUrl =
          URL.createObjectURL(file);

        setPickupPhotos((prev) => ({
          ...prev,
          [pickup._id]: imageUrl,
        }));

      }

    }}
  />
</label>

{pickupPhotos[pickup._id] && (

  <div
    className="cursor-pointer rounded-lg border p-2 hover:bg-muted transition"
    onClick={() =>
      setSelectedImage(
        pickupPhotos[pickup._id]
      )
    }
  >

    <img
      src={pickupPhotos[pickup._id]}
      alt="Pickup"
      className="h-40 w-full rounded-md object-cover"
    />

    <p className="mt-2 text-center text-xs text-muted-foreground">
      Pickup Photo
    </p>
    <Button
  size="sm"
  className="w-full mt-2"
  onClick={async () => {

    await fetch(
      `/api/orders/${pickup._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          status: "Completed",
        }),
      }
    );

    setOrdersData((prev) =>
      prev.map((item: any) =>
        item._id === pickup._id
          ? {
              ...item,
              status: "Completed",
            }
          : item
      )
    );

  }}
>
  Mark as Completed
</Button>
  </div>

)}
</div>           
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Dumping Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Navigation className="size-4 text-accent" />
              Dumping Section
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  Dump Location
                </span>
                <span className="text-sm font-medium text-card-foreground">
                  MCC Waste Processing Plant, Vamanjoor
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  Auto-Captured Location
                </span>
                <span className="font-mono text-sm text-card-foreground">
                  12.9148, 74.8952
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  Distance Travelled
                </span>
                <span className="font-mono text-sm font-semibold text-card-foreground">
                  47.3 km
                </span>
              </div>
            </div>
           </CardContent>
        </Card>

        {/* Submit Button */}
       
      </div>
      {selectedImage && (

  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    onClick={() =>
      setSelectedImage("")
    }
  >

    <img
      src={selectedImage}
      alt="Preview"
      className="max-h-[90vh] max-w-[90vw] rounded-lg"
    />

  </div>

)}
    </DashboardLayout>
  )
}

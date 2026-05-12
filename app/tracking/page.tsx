"use client"

import {
  Clock,
  MapPin,
  Truck,
  CheckCircle2,
  Navigation,
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { TopNav } from "@/components/top-nav"
import { MapSection } from "@/components/map-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { dumpYard } from "@/lib/dummy-data"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react";






export default function TrackingPage() {
  const [ordersData, setOrdersData] = useState<any[]>([]);
  useEffect(() => {
  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();

    if (Array.isArray(data)) {
      setOrdersData(data);
    }
  };

  fetchOrders();
}, []);
const assignedOrders =
  ordersData.filter(
    (o: any) =>
      o.status === "Assigned"
  );

const mapMarkers = [
  ...assignedOrders.map((o: any) => ({
    id: o._id,
    label: o.clientName.split(" ")[0],
    lat: Number(o.lat),
    lng: Number(o.lng),
    color: "yellow" as const,

    popup: {
      clientName: o.clientName,
      phone: o.phone,
      orderId: o._id,
      wasteWeight: o.wasteWeight,
      pickupDate: o.pickupDate,
      deadline: o.deadline,
      status: o.status,
    },
  })),

  {
    id: "dump",
    label: "Dump Yard",
    lat: dumpYard.lat,
    lng: dumpYard.lng,
    color: "blue" as const,
  },
];
  return (
    <DashboardLayout>
      <TopNav title="Live Tracking" />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        {/* Map */}
        <MapSection
          markers={mapMarkers}
          title="Live Vehicle Tracking"
          showRoute={
  assignedOrders.some(
    (o: any) =>
      new Date() >=
      new Date(o.pickupDate)
  )
}
        />

        {/* Trip Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {assignedOrders.map((order, index) => (
            <Card key={order._id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Truck className="size-4 text-primary" />
                    {order._id}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px]",
                      order.status === "In Transit"
                        ? "bg-chart-4/10 text-chart-4 border-chart-4/20"
                        : "bg-primary/10 text-primary border-primary/20"
                    )}
                  >
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Vehicle Info */}
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Vehicle</p>
                    <p className="font-mono font-medium text-card-foreground">
                      {order.vehicleNumber || "Not Assigned"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Driver</p>
                    <p className="font-medium text-card-foreground">
                      {order.driverName || "Not Assigned"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Distance</p>
                    <p className="font-mono font-medium text-card-foreground">
                      {`${10 + index * 3} km`}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex flex-col gap-0">
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Navigation className="size-3" />
                    </div>
                    <div className="flex-1 text-xs">
                      <p className="font-medium text-card-foreground">
                        {
  new Date() >=
  new Date(order.pickupDate)
    ? "Trip Started"
    : "Trip Scheduled"
}
                      </p>
                      <p className="text-muted-foreground">{order.startTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-l-2 border-dashed border-border ml-3 pl-5 py-2">
  <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
    <MapPin className="size-3" />
  </div>

  <div className="flex-1 text-xs">
    <p className="font-medium text-card-foreground">
      {order.location}
    </p>

    <p className="text-muted-foreground">
      {order.pickupDate}
    </p>
  </div>
</div>

                  </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

"use client"

import {
  ClipboardList,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
} from "lucide-react"
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout"
import { TopNav } from "@/components/top-nav"
import { SummaryCard } from "@/components/summary-card"
import { MapSection } from "@/components/map-section"
import { OrdersTable } from "@/components/orders-table"

export default function ManagerDashboard() {

  const [ordersData, setOrdersData] = useState<any[]>([]);
const totalOrders = ordersData.length;

const pending = ordersData.filter(o => o.status === "Pending").length;
const assigned = ordersData.filter(o => o.status === "Assigned").length;
const completed = ordersData.filter(o => o.status === "Completed").length;
const overdue = ordersData.filter(o => o.status === "Overdue").length;

const revenue = ordersData.reduce((sum, o) => sum + (o.amount || 0), 0);
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
const summaryCards = [
  {
    title: "Total Orders",
    value: totalOrders,
    icon: ClipboardList,
    trend: `${totalOrders} orders`,
    trendUp: true,
  },
  {
    title: "Pending Works",
    value: pending,
    icon: Clock,
    trend: `${pending} pending`,
    trendUp: false,
  },
  {
    title: "Assigned Works",
    value: assigned,
    icon: UserCheck,
    trend: `${assigned} in progress`,
    trendUp: true,
  },
  {
    title: "Completed Works",
    value: completed,
    icon: CheckCircle2,
    trend: `${completed} completed`,
    trendUp: true,
  },
  {
    title: "Overdue Orders",
    value: overdue,
    icon: AlertTriangle,
    trend: `${overdue} attention`,
    trendUp: false,
  },
  {
    title: "Total Revenue",
    value: `₹${revenue.toLocaleString()}`,
    icon: IndianRupee,
    trend: "Live data",
    trendUp: true,
  },
];

const statusColorMap: Record<string, "red" | "yellow" | "green"> = {
  Pending: "red",
  Assigned: "yellow",
  Completed: "green",
  Overdue: "red",
}


  const dumpYard = {
  name: "Dump Yard",
  lat: 12.9716,
  lng: 77.5946,
};
  const mapMarkers = [
  ...ordersData
  .filter((o: any) => o.lat && o.lng)
  .map((o: any) => ({
    id: o._id,
    label: o.clientName.split(" ")[0],
    lat: Number(o.lat),
lng: Number(o.lng),
    color: statusColorMap[o.status] as "red" | "yellow" | "green",
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
    id: "dump-yard",
    label: dumpYard.name,
    lat: dumpYard.lat,
    lng: dumpYard.lng,
    color: "blue" as const,
  },
]
console.log("ORDERS:", ordersData);
  return (
    <DashboardLayout>
      <TopNav title="Manager Dashboard" />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {summaryCards.map((card) => (
            <SummaryCard key={card.title} {...card} />
          ))}
        </div>

        {/* Live Map */}
        <MapSection markers={mapMarkers} title="Live Pickup Map" />

        {/* Orders Table */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Recent Orders
          </h2>
          <OrdersTable orders={ordersData} showActions={false} />
        </div>
      </div>
    </DashboardLayout>
  )
}

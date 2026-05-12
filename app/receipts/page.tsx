"use client"

import {
  Receipt as ReceiptIcon,
  Download,
  CheckCircle2,
  Clock,
  Search,
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { TopNav } from "@/components/top-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {useEffect, useState } from "react"
import jsPDF from "jspdf";


export default function ReceiptsPage() {
  const downloadReceipt = (order: any) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Smart Waste Management Receipt", 20, 20);

  doc.setFontSize(12);

  doc.text(`Receipt ID: ${order._id}`, 20, 40);
  doc.text(`Client Name: ${order.clientName}`, 20, 50);
  doc.text(`Phone: ${order.phone}`, 20, 60);
  doc.text(`Location: ${order.location}`, 20, 70);
  doc.text(`Pickup Date: ${order.pickupDate}`, 20, 80);
  doc.text(`Deadline: ${order.deadline}`, 20, 90);
  doc.text(`Waste Weight: ${order.wasteWeight} kg`, 20, 100);
  doc.text(`Amount: INR ${order.amount}`, 20, 110);
  doc.text(`Status: ${order.status}`, 20, 120);
  doc.text(
    `Approval: ${order.approved ? "Approved" : "Pending"}`,
    20,
    130
  );
doc.save(`receipt-${order._id}.pdf`);
};
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
  const [search, setSearch] = useState("")

  const filteredReceipts = ordersData.filter(
  (r: any) =>
    (r._id || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.clientName || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.location || "").toLowerCase().includes(search.toLowerCase())
)
  return (
    <DashboardLayout>
      <TopNav title="Receipts" />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ReceiptIcon className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Receipts</p>
                <p className="text-xl font-bold text-card-foreground">
                  {ordersData.length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Approved</p>
                <p className="text-xl font-bold text-card-foreground">
                  {
  ordersData.filter(
    (r) => Boolean(r.approved)
  ).length
}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4">
                <Clock className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending Approval</p>
                <p className="text-xl font-bold text-card-foreground">
                  {
  ordersData.filter(
    (r) => !Boolean(r.approved)
  ).length
}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search receipts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Receipt Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredReceipts.map((order: any) => (
            <Card
              key={order._id}
              className={cn(
                "overflow-hidden",
                order.status === "Completed"
                  ? "border-primary/20"
                  : "border-chart-4/20"
              )}
            >
              <div
                className={cn(
                  "px-4 py-2 text-xs font-medium",
                  order.status === "Completed"
                    ? "bg-primary/10 text-primary"
                    : "bg-chart-4/10 text-chart-4"
                )}
              >
                {order._id}
              </div>
              <CardContent className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-card-foreground">
                    {order.clientName}
                  </h3>
                 <Button
  size="sm"
  variant={
    order.approved
      ? "outline"
      : "default"
  }
  className={`h-7 text-[10px]

    ${
      order.approved
        ? "hover:bg-red-500 hover:text-white"

        : "hover:bg-green-600 hover:text-white"
    }
  `}
  onClick={async () => {

    const newApproval =
      !order.approved;

    const res =
      await fetch(
        `/api/orders/${order._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            approved:
              newApproval,
          }),
        }
      );

    if (res.ok) {

      setOrdersData((prev) =>
        prev.map((item) =>
          item._id === order._id
            ? {
                ...item,
                approved:
                  newApproval,
              }
            : item
        )
      );

    }

  }}
>
  {
    order.approved
      ? "Deny"
      : "Approve"
  }
</Button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Order ID</p>
                    <p className="font-mono font-medium text-card-foreground">
                      {order._id}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vehicle</p>
                    <p className="font-mono font-medium text-card-foreground">
                      {order.vehicleNumber || "Not Assigned"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Service Date</p>
                    <p className="font-medium text-card-foreground">
                      {order.pickupDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Waste Weight</p>
                    <p className="font-mono font-medium text-card-foreground">
                      {order.wasteWeight} kg
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="text-lg font-bold text-card-foreground">
                      {"₹"}{(order.amount || 0).toLocaleString()}
                    </p>
                  </div>
                  <Button
  variant="outline"
  size="sm"
  className="gap-1.5 text-xs"
  onClick={() => downloadReceipt(order)}
>
                    <Download className="size-3" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

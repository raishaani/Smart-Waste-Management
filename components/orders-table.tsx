"use client"

import { cn } from "@/lib/utils"
import type { Order } from "@/lib/dummy-data"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation";

const statusStyles: Record<
  string,
  { badge: string; label: string }
> = {
  Pending: {
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    label: "Pending",
  },
  Assigned: {
    badge: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    label: "Assigned",
  },
  Completed: {
    badge: "bg-primary/10 text-primary border-primary/20",
    label: "Completed",
  },
  Overdue: {
    badge: "bg-destructive/20 text-destructive border-destructive/30",
    label: "Overdue",
  },
}

interface OrdersTableProps {
  orders: Order[]
  compact?: boolean
  selectable?: boolean
  selectedIds?: string[]
  hideDelete?: boolean;
  onToggleSelect?: (id: string) => void
  showActions?: boolean
  showAssign?: boolean
  onDelete?: (id: string) => void;
  onAssign?: (id: string) => void;
}

export function OrdersTable({
  orders,
  compact = false,
  selectable = false,
  selectedIds = [],
  onToggleSelect,
  showActions = true,
  showAssign = true,
  hideDelete = false,
  onAssign,
  onDelete,
}: OrdersTableProps) {
  const router = useRouter(); 
  const deleteOrder = async (id: string) => {
    await fetch("/api/orders", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
      
    });

    location.reload();
  };
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {selectable && (
              <TableHead className="w-10 text-center">#</TableHead>
            )}
            <TableHead>Order ID</TableHead>
            <TableHead>Client</TableHead>
            {!compact && <TableHead>Phone</TableHead>}
            <TableHead>Location</TableHead>
            <TableHead>Pickup Date</TableHead>
            {!compact && <TableHead>Deadline</TableHead>}
            <TableHead className="text-right">Weight (kg)</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            {showActions && (
            <TableHead className="text-right">Action</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order: any) => {
            const isOverdue =

  order.status !== "Completed" &&

  new Date(order.deadline) <
  new Date();

const currentStatus =
  isOverdue
    ? "Overdue"
    : order.status;

const style =
  statusStyles[currentStatus];
            const isSelected = selectedIds.includes(order._id)
            return (
              <TableRow 
                key={order._id}
                className={cn(isSelected && "bg-primary/5")}>
                {selectable && (
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect?.(order._id)}
                      className="size-4 rounded border-input accent-primary"
                      aria-label={`Select order ${order._id}`}
                    />
                  </TableCell>
                )}
                <TableCell className="font-mono text-xs font-medium">
                  {order._id}
                </TableCell>
                <TableCell className="font-medium">
                  {order.clientName}
                </TableCell>
                {!compact && (
                  <TableCell className="text-muted-foreground">
                    {order.phone}
                  </TableCell>
                )}
                <TableCell className="text-muted-foreground">
                  {order.location}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {order.pickupDate}
                </TableCell>
                {!compact && (
                  <TableCell className="text-muted-foreground">
                    {order.deadline}
                  </TableCell>
                )}
                <TableCell className="text-right font-mono">
                  {order.wasteWeight}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {"₹"}{order.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("text-[10px]", style?.badge)}
                  >
                    {style?.label || currentStatus}
                  </Badge>
                </TableCell>
                
                {showActions && (
  <TableCell className="text-right flex gap-2 justify-end">
    <Button
  size="sm"
  variant="outline"
  onClick={() => router.push(`/orders/edit/${order._id}`)}
  className="h-7 text-xs"
>
  Edit
</Button>
    {showAssign && (
<Button
  size="sm"
  variant="outline"
  className={`h-7 text-xs transition-colors

    ${
      order.status === "Pending"
        ? "hover:bg-yellow-500 hover:text-white hover:border-yellow-500"

        : order.status === "Completed"
        ? "hover:bg-green-600 hover:text-white hover:border-green-600"

        : "hover:bg-gray-200"
    }
  `}
  onClick={async () => {

    // ASSIGN
    if (order.status === "Pending") {

      window.location.href =
        "/routes";

      return;

    }

    // VIEW
    if (order.status === "Assigned") {

      alert(
        `Driver: ${order.driverName || "Not Assigned"}

Vehicle: ${order.vehicleNumber || "Not Assigned"}

Pickup Date: ${order.pickupDate}

Deadline: ${order.deadline}`
      );

      return;

    }

    // CONFIRM
    if (order.status === "Completed") {

      alert(
        "Order already completed"
      );

    }

  }}
>
  {
    order.status === "Pending"
      ? "Assign"
      : order.status === "Assigned"
      ? "View"
      : "Confirm"
  }
</Button>
)}
    
    {/* DELETE BUTTON (move inside!) */}
    {!hideDelete && (
    <Button
      size="sm"
      variant="outline"
      onClick={() => onDelete?.(order._id)}
      className="h-7 text-xs hover:bg-red-500 hover:text-white transition"
    >
      Delete
    </Button>
    )}
  </TableCell>
)}
                  
                
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

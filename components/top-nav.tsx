"use client"

import { Bell } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"

interface TopNavProps {
  title: string
}

export function TopNav({ title }: TopNavProps) {
  const [notifications, setNotifications] =
  useState<any[]>([]);
  useEffect(() => {

  const fetchNotifications =
    async () => {

      const res =
        await fetch("/api/orders");

      const data =
        await res.json();

      const pendingApprovals =
        data.filter(
          (o: any) =>
            !o.approved
        );

      const overdueOrders =
        data.filter(
          (o: any) =>
            o.status !== "Completed" &&
            new Date(o.deadline) <
            new Date()
        );

      const assignedOrders =
        data.filter(
          (o: any) =>
            o.status === "Assigned"
        );

      setNotifications([
        ...pendingApprovals,
        ...overdueOrders,
        ...assignedOrders,
      ]);

    };

  fetchNotifications();

}, []);
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <h1 className="text-base font-semibold text-card-foreground">{title}</h1>
      <div className="ml-auto flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <div className="relative">

  <Bell className="size-5" />

  {notifications.length > 0 && (

    <div
      className="
        absolute
        -right-2
        -top-2
        flex
h-4
min-w-4
px-1
items-center
justify-center

        text-[10px]
        text-white
      "
    >
      {notifications.length}
    </div>

  )}

</div>
          <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            0
          </span>
          <span className="sr-only">Notifications</span>
        </Button>
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            MA
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"



interface MarkerData {
  id: string
  label: string
  lat: number
  lng: number
  color: "red" | "yellow" | "green" | "blue"
  popup?: {
    clientName: string
    phone: string
    orderId: string
    wasteWeight: number
    pickupDate: string
    deadline: string
    status: string
  }
}

interface MapSectionProps {
  markers?: MarkerData[]
  className?: string
  showRoute?: boolean
  title?: string
}

const colorMap = {
  red: "text-destructive",
  yellow: "text-chart-4",
  green: "text-primary",
  blue: "text-accent",
}

const bgColorMap = {
  red: "bg-destructive/10",
  yellow: "bg-chart-4/10",
  green: "bg-primary/10",
  blue: "bg-accent/10",
}

export function MapSection({ markers = [], title = "Map" }: MapSectionProps) {

  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null)
  
  return (
    <div className={cn("relative overflow-hidden rounded-lg border bg-card")}>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold text-card-foreground">{title}</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-destructive" />
            Pending
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-chart-4" />
            Assigned
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-primary" />
            Completed
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-accent" />
            Dump Yard
          </span>
        </div>
      </div>
      <div className="h-96 w-full relative bg-gray-100">

  {/* grid */}
  <div className="absolute inset-0 opacity-30">
    <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
      {Array.from({ length: 96 }).map((_, i) => (
        <div key={i} className="border border-gray-200" />
      ))}
    </div>
  </div>

  {/* markers */}
  {markers?.map((marker, index) => (
    <button
      key={marker.id}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${30 + (index * 10) % 60}%`,
        top: `${30 + (index * 7) % 50}%`,
      }}
      onClick={() => setSelectedMarker(marker)}
    >
     <div className="flex flex-col items-center group">

  {/* Pin */}
  <div
    className={cn(
      "relative w-5 h-5 rounded-full shadow-lg animate-bounce-slow transition-transform duration-200 group-hover:scale-125",
      marker.color === "red" && "bg-red-500",
      marker.color === "yellow" && "bg-yellow-400",
      marker.color === "green" && "bg-green-500",
      marker.color === "blue" && "bg-blue-500"
    )}
  >
    {/* inner white dot */}
    <div className="absolute inset-1 bg-white rounded-full" />
  </div>

  {/* Pointer tail */}
  <div
    className={cn(
      "w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent -mt-1",
      marker.color === "red" && "border-t-red-500",
      marker.color === "yellow" && "border-t-yellow-400",
      marker.color === "green" && "border-t-green-500",
      marker.color === "blue" && "border-t-blue-500"
    )}
  />

  {/* Shadow */}
  <div className="w-3 h-1 bg-black/20 rounded-full blur-sm mt-1 group-hover:scale-110 transition" />

</div>
    </button>
  ))}

</div>
       {/* Popup */}
{selectedMarker?.popup && (
  <div className="absolute right-4 top-4 z-20 w-64 rounded-lg border bg-card p-3 shadow-lg">
    <button
      className="absolute top-2 right-2 text-muted-foreground hover:text-card-foreground text-xs"
      onClick={() => setSelectedMarker(null)}
      aria-label="Close popup"
    >
      X
    </button>

    <h4 className="text-sm font-semibold text-card-foreground">
      {selectedMarker.popup.clientName}
    </h4>

    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
      <p>
        <span className="font-medium text-card-foreground">Phone:</span>{" "}
        {selectedMarker.popup.phone}
      </p>

      <p>
        <span className="font-medium text-card-foreground">Order:</span>{" "}
        {selectedMarker.popup.orderId}
      </p>

      <p>
        <span className="font-medium text-card-foreground">Weight:</span>{" "}
        {selectedMarker.popup.wasteWeight} kg
      </p>

      <p>
        <span className="font-medium text-card-foreground">Pickup:</span>{" "}
        {selectedMarker.popup.pickupDate}
      </p>

      <p>
        <span className="font-medium text-card-foreground">Deadline:</span>{" "}
        {selectedMarker.popup.deadline}
      </p>

      <div className="mt-1">
        <span
          className={cn(
            "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
            selectedMarker.popup.status === "Pending" &&
              "bg-destructive/10 text-destructive",
            selectedMarker.popup.status === "Assigned" &&
              "bg-chart-4/10 text-chart-4",
            selectedMarker.popup.status === "Completed" &&
              "bg-primary/10 text-primary",
            selectedMarker.popup.status === "Overdue" &&
              "bg-destructive/20 text-destructive"
          )}
        >
          {selectedMarker.popup.status}
        </span>
      </div>
    </div>
  </div>
)}
</div>
  );
}

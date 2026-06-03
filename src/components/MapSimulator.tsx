import React, { useEffect, useState } from "react";
import { MapPin, Truck, ShieldCheck, Navigation } from "lucide-react";
import { Shop, Driver, Order } from "../types";

interface MapSimulatorProps {
  shops: Shop[];
  drivers: Driver[];
  selectedShop: Shop | null;
  activeOrder: Order | null;
}

export default function MapSimulator({
  shops,
  drivers,
  selectedShop,
  activeOrder,
}: MapSimulatorProps) {
  // Center is Delhi coordinates from server.ts approx. (28.6139, 77.2090)
  // We'll scale coordinates to local SVG viewBox dimensions (0 to 400 space)
  const mapWidth = 400;
  const mapHeight = 320;

  const latMin = 28.59;
  const latMax = 28.64; // custom padding
  const lngMin = 77.18;
  const lngMax = 77.24;

  const getXY = (lat: number, lng: number) => {
    // Normalise latitudes
    const x = ((lng - 77.18) / (77.24 - 77.18)) * mapWidth;
    // Invert Y for screen indexing
    const y = mapHeight - ((lat - 28.59) / (28.64 - 28.59)) * mapHeight;
    return {
      x: Math.max(10, Math.min(mapWidth - 10, x)),
      y: Math.max(10, Math.min(mapHeight - 10, y)),
    };
  };

  const [driverPos, setDriverPos] = useState({ x: 150, y: 150 });
  const [transitPercent, setTransitPercent] = useState(0);

  // Animate active driver movement on transit
  useEffect(() => {
    if (!activeOrder) {
      setTransitPercent(0);
      return;
    }

    const { status, shopId, driverId } = activeOrder;
    const shop = shops.find((s) => s.id === shopId);
    const driver = drivers.find((d) => d.id === driverId);

    if (!shop) return;

    const shopPt = getXY(shop.latitude, shop.longitude);
    const destPt = getXY(28.6085, 77.2150); // Assigned Fixed House Location Coord

    if (status === "DriverAssigned" && driver) {
      const driverPt = getXY(driver.latitude, driver.longitude);
      setDriverPos(driverPt);
    } else if (status === "InTransit") {
      let pc = 0;
      const interval = setInterval(() => {
        pc += 5;
        if (pc > 100) {
          pc = 100;
          clearInterval(interval);
        }
        setTransitPercent(pc);
        // Interpolate Shop point to House Destination
        const dx = shopPt.x + (destPt.x - shopPt.x) * (pc / 100);
        const dy = shopPt.y + (destPt.y - shopPt.y) * (pc / 100);
        setDriverPos({ x: dx, y: dy });
      }, 300);

      return () => clearInterval(interval);
    } else if (status === "Delivered" || status === "Completed") {
      setDriverPos(destPt);
      setTransitPercent(100);
    } else {
      // Idle random or default position
      setDriverPos({ x: 200, y: 160 });
    }
  }, [activeOrder, shops, drivers]);

  // House Destination point
  const destCoords = getXY(28.6085, 77.2150);

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl h-80 shadow-inner">
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: "radial-gradient(circle, #38bdf8 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        />
      </div>

      <svg className="w-full h-full text-slate-700 pointer-events-none" viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
        {/* Mock Streets and Arteries */}
        <line x1="0" y1="80" x2="400" y2="80" stroke="#334155" strokeWidth="2" />
        <line x1="0" y1="240" x2="400" y2="240" stroke="#334155" strokeWidth="2" />
        <line x1="120" y1="0" x2="120" y2="320" stroke="#334155" strokeWidth="2" />
        <line x1="280" y1="0" x2="280" y2="320" stroke="#334155" strokeWidth="2" />
        <path d="M 0,160 Q 200,100 400,160" fill="none" stroke="#1e293b" strokeWidth="6" />
        <path d="M 0,160 Q 200,100 400,160" fill="none" stroke="#475569" strokeWidth="2" />

        {/* Yamuna River Mockup */}
        <path d="M -20,290 C 100,260 200,310 420,270" fill="none" stroke="#0369a1" strokeWidth="16" opacity="0.4" />

        {/* Transit Routes */}
        {activeOrder && (activeOrder.status === "InTransit" || activeOrder.status === "DriverAssigned" || activeOrder.status === "Delivered") && (
          <>
            {(() => {
              const shop = shops.find((s) => s.id === activeOrder.shopId);
              if (!shop) return null;
              const shopPt = getXY(shop.latitude, shop.longitude);
              return (
                <path
                  d={`M ${shopPt.x},${shopPt.y} L ${destCoords.x},${destCoords.y}`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                  className="animate-pulse"
                />
              );
            })()}
          </>
        )}

        {/* Draw Shading for Area Limits */}
        <circle cx={destCoords.x} cy={destCoords.y} r="80" fill="#38bdf8" fillOpacity="0.04" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
      </svg>

      {/* Render Location Pins */}
      {shops.map((shop) => {
        const pt = getXY(shop.latitude, shop.longitude);
        const isSelected = selectedShop?.id === shop.id || activeOrder?.shopId === shop.id;
        return (
          <div
            key={shop.id}
            className="absolute transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
            style={{ left: `${pt.x}px`, top: `${pt.y}px` }}
          >
            <div className={`relative flex items-center justify-center p-2 rounded-full border shadow-md transition-all ${
              isSelected 
                ? "bg-amber-500 border-amber-300 text-slate-900 scale-110 z-20" 
                : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:scale-105"
            }`}>
              <MapPin className="w-4.5 h-4.5" />
              <div className="absolute top-full mt-1 left-1.5 transform -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] py-0.5 px-2 rounded whitespace-nowrap border border-slate-700 font-sans z-30 shadow-lg">
                <span className="font-semibold">{shop.name}</span> ({shop.category})
              </div>
            </div>
            {isSelected && (
              <span className="absolute -inset-1 rounded-full bg-amber-500 animate-ping opacity-25 -z-10" />
            )}
          </div>
        );
      })}

      {/* House/Site Delivery Pin */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${destCoords.x}px`, top: `${destCoords.y}px` }}
      >
        <div className="flex flex-col items-center">
          <div className="p-2 ml-0 rounded-full bg-emerald-500 border border-emerald-300 text-slate-900 shadow-lg relative animate-bounce">
            <ShieldCheck className="w-4 h-4 text-slate-900 font-bold" />
            <span className="absolute -inset-1 rounded-full bg-emerald-400 animate-ping opacity-30 -z-10" />
          </div>
          <span className="mt-1 px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-[9px] font-sans text-emerald-400 rounded-md shadow uppercase font-bold tracking-wider">
            Site Target
          </span>
        </div>
      </div>

      {/* Driver/Truck active icon */}
      {activeOrder && (activeOrder.status === "DriverAssigned" || activeOrder.status === "InTransit") && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-30"
          style={{ left: `${driverPos.x}px`, top: `${driverPos.y}px` }}
        >
          <div className="flex flex-col items-center">
            <div className="p-1.5 bg-sky-500 border border-sky-300 text-slate-900 rounded-full shadow-lg relative animate-pulse flex items-center justify-center">
              <Truck className="w-3.5 h-3.5 rotate-3" />
            </div>
            <span className="mt-0.5 px-1 bg-slate-950 text-[8px] font-semibold text-sky-400 rounded border border-slate-850">
              {activeOrder.driverName?.split(" ")[0]} ({activeOrder.vehicleType})
            </span>
          </div>
        </div>
      )}

      {/* HUD Overlay Info Card */}
      <div className="absolute top-3 left-3 bg-slate-950/90 border border-slate-800/80 px-2.5 py-1.5 rounded-lg select-none backdrop-blur-sm shadow text-[10px] font-mono pointer-events-none flex flex-col gap-0.5 max-w-[190px]">
        <div className="flex items-center gap-1.5 text-slate-400 font-sans uppercase font-bold tracking-wider text-[8px]">
          <Navigation className="w-3 h-3 text-sky-400 animate-pulse animate-duration-1000" /> Live Simulator GPS Feed
        </div>
        <div className="h-[1px] bg-slate-800 my-1"/>
        <div className="text-slate-300 truncate">
          Active Order: <span className="text-amber-400 font-bold">{activeOrder ? `#${activeOrder.id}` : "None"}</span>
        </div>
        <div className="text-slate-400 text-[9px]">
          State: <span className={`font-semibold ${activeOrder ? "text-emerald-400 animate-pulse" : "text-slate-500"}`}>
            {activeOrder ? activeOrder.status : "Fleet Monitoring"}
          </span>
        </div>
        {activeOrder && activeOrder.status === "InTransit" && (
          <div className="w-full bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
            <div className="bg-sky-400 h-full transition-all duration-300" style={{ width: `${transitPercent}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}

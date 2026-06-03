import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Truck,
  Home,
  Store,
  Shield,
  Coins,
  PhoneCall,
  CheckCircle,
  Plus,
  Phone,
  MapPin,
  RotateCcw,
  Sparkles,
  Bell,
  FileText,
  Navigation,
  Grid,
  TrendingUp,
  X,
  User,
  Info
} from "lucide-react";
import { Shop, Driver, Order, Notification, Analytics } from "../types";
import MapSimulator from "./MapSimulator";

export default function PlatformSimulator() {
  const [role, setRole] = useState<"Owner" | "Shop" | "Driver" | "Admin">("Owner");
  const [shops, setShops] = useState<Shop[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  // Filter Categories for Owner Portal
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  
  // Create Order Dialog
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [quantity, setQuantity] = useState(50);
  const [transportRate, setTransportRate] = useState(700);
  const [deliveryAddress, setDeliveryAddress] = useState("Villa 202, Palm Heights, Outer Ring Road");
  const [deliveryNotes, setDeliveryNotes] = useState("Please contact driver to unload behind the concrete cement mixer. Road is narrow.");

  // Current Active Driver selection inside Driver emulator
  const [activeDriverId, setActiveDriverId] = useState<string>("driver-1");

  // Phone Call dialog mockup
  const [callingState, setCallingState] = useState<{ active: boolean; label: string; number: string } | null>(null);

  // Quick Action notification trigger
  const [sysLog, setSysLog] = useState<string[]>([]);

  const fetchState = async () => {
    try {
      const [shopsRes, driversRes, ordersRes, notifsRes, analyticsRes] = await Promise.all([
        fetch("/api/shops"),
        fetch("/api/drivers"),
        fetch("/api/orders"),
        fetch("/api/notifications"),
        fetch("/api/analytics")
      ]);
      
      const shopsData = await shopsRes.json();
      const driversData = await driversRes.json();
      const ordersData = await ordersRes.json();
      const notifsData = await notifsRes.json();
      const analyticsData = await analyticsRes.json();

      setShops(shopsData);
      setDrivers(driversData);
      setOrders(ordersData);
      setNotifications(notifsData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error("Database sync failed.", err);
    }
  };

  useEffect(() => {
    fetchState();
    // Poll updates every 3 seconds for continuous flow experience
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, []);

  const addLog = (msg: string) => {
    setSysLog(prev => [msg, ...prev.slice(0, 7)]);
  };

  // REST CALLS
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShop || !selectedMaterial) return;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materialName: selectedMaterial,
          quantity,
          shopId: selectedShop.id,
          deliveryAddress,
          deliveryNotes,
          transportRate,
          ownerName: "Devendra Verma (House Owner)",
          ownerPhone: "+91 98100 98100"
        })
      });
      const data = await res.json();
      setOrderModalOpen(false);
      addLog(`Published dispatch order for ${quantity}x ${selectedMaterial}.`);
      fetchState();
    } catch (_) {}
  };

  const handleAcceptOrder = async (orderId: string, driverId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId })
      });
      const data = await res.json();
      const currentDriver = drivers.find(d => d.id === driverId);
      addLog(`${currentDriver?.name} accepted dispatch #${orderId}.`);
      fetchState();
    } catch (_) {}
  };

  const handleUpdateStatus = async (orderId: string, action: "pickup" | "deliver" | "complete") => {
    try {
      const res = await fetch(`/api/orders/${orderId}/${action}`, {
        method: "POST"
      });
      addLog(`Order #${orderId} state transitioned using '${action}'.`);
      fetchState();
    } catch (_) {}
  };

  const handleReset = async () => {
    try {
      await fetch("/api/reset", { method: "POST" });
      addLog(`Platform database configurations reset to sandbox defaults.`);
      setSelectedShop(null);
      fetchState();
    } catch (_) {}
  };

  const triggerMockCall = (name: string, number: string) => {
    setCallingState({ active: true, label: name, number });
  };

  // Find the primary active order to highlight on maps
  const activeOrder = orders.find(o => ["Published", "DriverAssigned", "InTransit", "Delivered"].includes(o.status)) || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Visual GPS HUD Panel (taking full wide span) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-sans text-slate-100 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-sky-400" /> Platform GPS Sandbox
            </h3>
            <p className="text-xs text-slate-400">Dynamic network map tracing shops, construction sites, and dispatcher vehicles.</p>
          </div>
          <button 
            onClick={handleReset}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Re-seed
          </button>
        </div>

        {/* Live Vector Map Integration */}
        <MapSimulator 
          shops={shops} 
          drivers={drivers} 
          selectedShop={selectedShop} 
          activeOrder={activeOrder} 
        />

        {/* Real-time Push Notification Banner & Live activity ledger */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl flex flex-col h-48">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 font-mono border-b border-slate-800 pb-2 mb-2 select-none">
              <Bell className="w-4 h-4 text-amber-400 animate-bounce" /> Broadcast Push Notification Hub
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pointer-events-auto">
              {notifications.slice(0, 5).map((n) => (
                <div key={n.id} className="p-2 rounded bg-slate-900 border border-slate-850 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[9px] font-mono font-bold">
                    <span className={`px-1.5 py-0.5 rounded uppercase ${
                      n.role === "Owner" ? "bg-amber-500/10 text-amber-400" :
                      n.role === "Driver" ? "bg-sky-500/10 text-sky-400" :
                      n.role === "Shop" ? "bg-emerald-500/10 text-emerald-400" :
                      "bg-purple-500/10 text-purple-400"
                    }`}>
                      {n.role} Feed
                    </span>
                    <span className="text-slate-500">{new Date(n.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">{n.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl flex flex-col h-48">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 font-mono border-b border-slate-800 pb-2 mb-2 select-none">
              <FileText className="w-4 h-4 text-emerald-400" /> Platform Transaction Log
            </div>
            <div className="flex-1 overflow-y-auto font-mono text-[10px] text-slate-400 space-y-1.5 leading-relaxed">
              {sysLog.length === 0 ? (
                <div className="text-slate-600 italic">No events occurred in current sandbox cycle. Perform actions in emulators to trigger ledger.</div>
              ) : (
                sysLog.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-slate-600">&gt;&gt;</span>
                    <span className="text-slate-300">{log}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Role Play Emulators (Interactive smartphone/dashboard container) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {/* Role Selector Header */}
        <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-850 flex gap-1 select-none">
          {(["Owner", "Shop", "Driver", "Admin"] as const).map((r) => {
            const isActive = r === role;
            return (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg font-sans transition-all outline-none ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow-md transform scale-[1.02]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {r === "Owner" ? "Builder" : r === "Driver" ? "Transporter" : r}
              </button>
            );
          })}
        </div>

        {/* Emulator body */}
        <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 min-h-[460px] flex flex-col relative overflow-hidden">
          {/* Top Notch of Virtual Device */}
          <div className="w-24 h-4 bg-slate-900 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 border-x border-b border-slate-800 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            <span className="w-6 h-1 rounded-full bg-slate-800 ml-2 animate-pulse" />
          </div>

          <div className="flex-1 mt-4 flex flex-col justify-between">
            {/* RENDER ACTIVE ROLE PORTAL */}
            {role === "Owner" && (
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1">
                    <Home className="w-4 h-4 text-amber-400" /> House Builder Hub
                  </h4>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-mono font-bold">
                    Active Session
                  </span>
                </div>

                {/* Subcategories */}
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Category</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {["All", "Cement", "Bricks", "Steel", "Sand", "Hardware"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2 py-1 text-[10px] font-semibold rounded-md border ${
                          selectedCategory === cat
                            ? "bg-amber-500 border-amber-300 text-slate-950"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Material Shops selection */}
                <div className="flex-1 overflow-y-auto space-y-2 max-h-[220px]">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">Shops Nearby</label>
                  {shops
                    .filter((s) => selectedCategory === "All" || s.category === selectedCategory)
                    .map((shop) => (
                      <div
                        key={shop.id}
                        onClick={() => setSelectedShop(shop)}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition ${
                          selectedShop?.id === shop.id
                            ? "bg-slate-900 border-amber-400/80 shadow"
                            : "bg-slate-900/60 border-slate-850 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-slate-100">{shop.name}</span>
                          <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded uppercase font-semibold">
                            {shop.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-1">{shop.address}</p>
                        <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-amber-500">
                          <span>⭐ {shop.rating} rating</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerMockCall(shop.name, shop.phone);
                            }}
                            className="text-[10px] text-slate-300 hover:text-sky-400 flex items-center gap-1 font-sans"
                          >
                            <Phone className="w-3 h-3" /> Call Shop
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Booking Trigger Footer */}
                <div className="pt-2 border-t border-slate-850 flex gap-2">
                  <button
                    disabled={!selectedShop}
                    onClick={() => {
                      if (selectedShop) {
                        setSelectedMaterial(selectedShop.items[0]?.name || "Standard Supply");
                        setOrderModalOpen(true);
                      }
                    }}
                    className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      selectedShop
                        ? "bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <Plus className="w-4 h-4" /> Book Construction Materials
                  </button>
                </div>
              </div>
            )}

            {role === "Shop" && (
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1">
                    <Store className="w-4 h-4 text-emerald-400" /> Vendor Merchant Terminal
                  </h4>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono font-bold">
                    Apex Cement Live
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-slate-850 bg-slate-900">
                  <h5 className="text-xs font-bold text-slate-200">Merchant Profile</h5>
                  <p className="text-[11px] text-slate-400 mt-1">Apex Cement Traders (Sector-42 Bypass)</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-mono">Billed volumes route to Bank: Cash Only</p>
                </div>

                {/* Incoming Direct Orders queue for Shop */}
                <div className="flex-1 overflow-y-auto space-y-2 max-h-[220px]">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">Incoming Material Orders</label>
                  {orders.filter((o) => o.shopId === "shop-1").length === 0 ? (
                    <div className="p-3 text-center text-slate-600 text-xs italic">
                      No direct requests yet. Use Builder mode to book from "Apex Cement Traders".
                    </div>
                  ) : (
                    orders
                      .filter((o) => o.shopId === "shop-1")
                      .map((o) => (
                        <div key={o.id} className="p-2.5 rounded bg-slate-900 border border-slate-850 text-xs flex flex-col gap-1">
                          <div className="flex justify-between font-mono text-[10px] text-slate-400">
                            <span>#{o.id}</span>
                            <span className="text-sky-400 font-bold">{o.status}</span>
                          </div>
                          <div className="font-semibold text-slate-200">
                            {o.quantity}x {o.materialName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Address: {o.deliveryAddress}
                          </div>
                          {o.driverName && (
                            <div className="text-[11px] text-sky-400 font-semibold flex items-center gap-1 mt-1 pt-1 border-t border-slate-850">
                              <Truck className="w-3 h-3" /> Transporter Assigned: {o.driverName} ({o.vehicleType})
                            </div>
                          )}
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {role === "Driver" && (
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1">
                    <Truck className="w-4 h-4 text-sky-400" /> Carrier Dispatch Screen
                  </h4>
                  <select
                    className="bg-slate-900 text-sky-400 scrollbar-none text-[10px] border border-slate-800 rounded font-bold uppercase px-1.5 py-0.5"
                    value={activeDriverId}
                    onChange={(e) => setActiveDriverId(e.target.value)}
                  >
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.vehicleType})</option>
                    ))}
                  </select>
                </div>

                {/* Earnings & Truck Card */}
                {(() => {
                  const driver = drivers.find(d => d.id === activeDriverId);
                  const completedEarnings = orders
                    .filter(o => o.driverId === activeDriverId && o.status === "Completed")
                    .reduce((sum, o) => sum + o.transportRate, 0);

                  return (
                    <div className="p-3 border border-slate-850 rounded-lg bg-slate-900 flex justify-between items-center select-none">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold font-mono">My Carrier Wallet</span>
                        <div className="text-base font-bold text-sky-400 mt-0.5 font-mono">₹{completedEarnings} Cash</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded font-bold uppercase">
                          {driver?.status || "Idle"}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">{driver?.vehicleNumber}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Driver orders panel: accepts / loads / delivers */}
                <div className="flex-1 overflow-y-auto space-y-2 max-h-[180px]">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">Avaible Jobs & Live Dispatch</label>
                  
                  {/* Show active job if driver is already busy */}
                  {orders.find(o => o.driverId === activeDriverId && o.status !== "Completed") ? (
                    (() => {
                      const activeJob = orders.find(o => o.driverId === activeDriverId && o.status !== "Completed")!;
                      return (
                        <div className="p-2.5 rounded bg-slate-900 border border-sky-500/40 text-xs flex flex-col gap-1.5">
                          <div className="flex justify-between font-mono text-[9px]">
                            <span className="bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded font-bold">ACTIVE JOB ASSIGNED</span>
                            <span className="text-amber-400 uppercase font-bold">{activeJob.status}</span>
                          </div>
                          <div className="font-bold text-slate-200">
                            {activeJob.quantity}x {activeJob.materialName}
                          </div>
                          <p className="text-[11px] text-slate-400">Shop: <span className="font-semibold text-slate-200">{activeJob.shopName}</span></p>
                          <p className="text-[11px] text-slate-400">Destination: {activeJob.deliveryAddress}</p>
                          <p className="text-[11px] text-slate-500 italic pb-1">Notes: {activeJob.deliveryNotes}</p>
                          
                          <div className="pt-2 border-t border-slate-800 flex gap-2 font-semibold">
                            {activeJob.status === "DriverAssigned" && (
                              <button
                                onClick={() => handleUpdateStatus(activeJob.id, "pickup")}
                                className="w-full py-1.5 bg-sky-500 text-slate-950 font-bold rounded text-[11px] hover:bg-sky-400"
                              >
                                Load Materials from Shop
                              </button>
                            )}
                            {activeJob.status === "InTransit" && (
                              <button
                                onClick={() => handleUpdateStatus(activeJob.id, "deliver")}
                                className="w-full py-1.5 bg-sky-500 text-slate-950 font-bold rounded text-[11px] hover:bg-sky-400"
                              >
                                Unload & Arrive at Site
                              </button>
                            )}
                            {activeJob.status === "Delivered" && (
                              <div className="w-full text-center py-1 bg-slate-950 text-emerald-400 font-mono text-[10px] rounded border border-emerald-500/30">
                                Paid cash and awaiting builder confirmation...
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <>
                      {/* Available Jobs list */}
                      {orders.filter(o => o.status === "Published").length === 0 ? (
                        <div className="p-4 text-center text-slate-600 text-xs italic">
                          No open broadcasts available. Publish a new order in Builder emulator.
                        </div>
                      ) : (
                        orders
                          .filter(o => o.status === "Published")
                          .map(o => (
                            <div key={o.id} className="p-2.5 rounded bg-slate-900 border border-slate-855 text-xs flex flex-col gap-1.5">
                              <div className="flex justify-between font-mono text-[10px]">
                                <span className="text-slate-400">#{o.id}</span>
                                <span className="text-emerald-400 font-bold">₹{o.transportRate} Cash</span>
                              </div>
                              <div className="font-semibold text-slate-200">
                                {o.quantity}x {o.materialName}
                              </div>
                              <p className="text-[11px] text-slate-400">From Shop: {o.shopName}</p>
                              <p className="text-[11px] text-slate-400">Target Site: {o.deliveryAddress}</p>
                              
                              <button
                                onClick={() => handleAcceptOrder(o.id, activeDriverId)}
                                className="w-full mt-1.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded text-[11px] transition"
                              >
                                Accept & Dispatch Route
                              </button>
                            </div>
                          ))
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {role === "Admin" && (
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1">
                    <Shield className="w-4 h-4 text-purple-400" /> Platform Controller
                  </h4>
                  <span className="text-[9px] px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded border border-purple-500/20 font-bold uppercase">
                    Root Console
                  </span>
                </div>

                {analytics && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 border border-slate-850 rounded bg-slate-900">
                      <div className="text-slate-500 text-[10px] uppercase font-bold font-mono">Completed Cash</div>
                      <div className="text-sm font-bold text-purple-400 font-mono mt-0.5">₹{analytics.totalTransactionsCash}</div>
                    </div>
                    <div className="p-2 border border-slate-850 rounded bg-slate-900">
                      <div className="text-slate-500 text-[10px] uppercase font-bold font-mono">Broadcasting</div>
                      <div className="text-sm font-bold text-purple-400 font-mono mt-0.5">{analytics.publishedOrdersCount} Demands</div>
                    </div>
                    <div className="p-2 border border-slate-850 rounded bg-slate-900">
                      <div className="text-slate-500 text-[10px] uppercase font-bold font-mono">Verified fleet</div>
                      <div className="text-sm font-bold text-purple-400 font-mono mt-0.5">{analytics.totalDrivers} Trucks</div>
                    </div>
                    <div className="p-2 border border-slate-850 rounded bg-slate-900">
                      <div className="text-slate-500 text-[10px] uppercase font-bold font-mono">Merchant Shops</div>
                      <div className="text-sm font-bold text-purple-400 font-mono mt-0.5">{analytics.totalShops} Shops</div>
                    </div>
                  </div>
                )}

                <div className="p-2 border border-slate-850 rounded-lg bg-slate-900/40 text-[10px] font-mono leading-relaxed space-y-1">
                  <div className="text-slate-400 uppercase font-bold pb-1 border-b border-slate-800">Cluster Diagnostics</div>
                  <div className="flex justify-between"><span>Node Gateway:</span> <span className="text-emerald-500 font-semibold">{analytics?.nodeClusterStatus || "Ready"}</span></div>
                  <div className="flex justify-between"><span>Atlas MongoDB:</span> <span className="text-emerald-500 font-semibold">db.v2.atlas</span></div>
                  <div className="flex justify-between"><span>Platform Node:</span> <span className="text-sky-400 font-semibold">Express v4 / TS</span></div>
                </div>

                {/* Active orders list from owner portal */}
                <div className="flex-1 overflow-y-auto max-h-[140px] space-y-1 bg-slate-900/20 p-1 rounded">
                  <span className="text-[9px] text-slate-500 font-mono font-bold block mb-1">GLOBAL DISPATCH FEED</span>
                  {orders.map(o => (
                    <div key={o.id} className="flex justify-between items-center text-[10px] border-b border-slate-850 py-1 text-slate-300 font-sans">
                      <span className="font-mono text-purple-400 font-semibold">#{o.id}</span>
                      <span className="truncate max-w-[120px]">{o.quantity}x {o.materialName}</span>
                      <span className={`px-1.5 py-0.2 select-none text-[8px] rounded uppercase font-bold ${
                        o.status === "Completed" ? "bg-emerald-500/10 text-emerald-400" :
                        o.status === "Published" ? "bg-amber-500/10 text-amber-400" :
                        "bg-sky-500/10 text-sky-400"
                      }`}>{o.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RENDER ACTIVE DIALOGS / SLIDERS */}
      <AnimatePresence>
        {/* Book Materials Dialog */}
        {orderModalOpen && selectedShop && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setOrderModalOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>

              <h4 className="text-base font-bold text-slate-100 flex items-center gap-1.5 mb-2 font-sans">
                <Store className="w-5 h-5 text-amber-500" /> Book from "{selectedShop.name}"
              </h4>
              <p className="text-xs text-slate-400 mb-4">Set materials quantities, delivery coordinates, and transport payout rate.</p>

              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">Selected Material Name</label>
                  <select
                    className="w-full bg-slate-950 font-semibold border border-slate-800 text-slate-300 rounded-lg p-2 mt-1 text-xs outline-none focus:border-amber-500"
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                  >
                    {selectedShop.items.map((it) => (
                      <option key={it.id} value={it.name}>{it.name} (₹{it.price} / {it.unit})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">Order Quantity</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-950 text-slate-300 border border-slate-800 p-2 rounded-lg mt-1 text-xs font-mono font-bold outline-none text-center"
                      value={quantity}
                      min={1}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">Fixed Transport payout</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-950 text-slate-300 border border-slate-800 p-2 rounded-lg mt-1 text-xs font-mono font-bold outline-none text-center"
                      value={transportRate}
                      min={100}
                      onChange={(e) => setTransportRate(Math.max(100, Number(e.target.value)))}
                    />
                    <span className="text-[9px] text-slate-500 text-right block mt-0.5 uppercase italic">Pay offline Cash only</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">Construction site target address</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-slate-950 text-slate-300 border border-slate-800 p-2 rounded-lg mt-1 text-xs outline-none focus:border-amber-500"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono block">Dispatcher instructions (Notes)</label>
                  <textarea 
                    className="w-full bg-slate-950 text-slate-300 border border-slate-800 p-2 rounded-lg mt-1 text-xs h-16 resize-none outline-none focus:border-amber-500"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition"
                  >
                    <Sparkles className="w-4.5 h-4.5" /> Broadcast Demand to Fleet
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Dynamic Phone Call Simulation panel */}
        {callingState?.active && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-805 rounded-full px-8 py-12 max-w-sm w-full text-center flex flex-col items-center gap-4 shadow-3xl text-slate-200"
            >
              <div className="relative">
                <div className="p-8 rounded-full bg-amber-500 text-slate-950 animate-pulse border-4 border-amber-300 relative z-10 m-auto flex items-center justify-center">
                  <PhoneCall className="w-10 h-10 animate-shake" />
                </div>
                <span className="absolute -inset-4 rounded-full bg-amber-400 animate-ping opacity-20 -z-0" />
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">Connecting Audio Call</span>
                <h4 className="text-xl font-bold font-sans text-slate-100 mt-1">{callingState.label}</h4>
                <p className="text-xs text-slate-400 font-mono mt-1">{callingState.number}</p>
              </div>

              <div className="h-6 flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full animate-pulse border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Ringing...
              </div>

              <button 
                onClick={() => setCallingState(null)}
                className="mt-6 px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-xs font-bold transition flex items-center gap-1.5"
              >
                End Simulation Call
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settle confirm trigger in Owner Screen overlay */}
      {role === "Owner" && activeOrder && activeOrder.status === "Delivered" && (
        <div className="lg:col-span-12">
          <div className="p-4 border border-emerald-500/50 bg-emerald-950/20 rounded-xl flex flex-wrap items-center justify-between gap-4 select-none">
            <div className="flex gap-3 items-center">
              <div className="p-2.5 bg-emerald-500 text-slate-950 rounded-full">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-emerald-400 font-bold uppercase text-[10px] font-mono flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> SHIPMENT WAITING CONFIRMATION
                </span>
                <p className="text-xs text-slate-200 mt-0.5">
                  Your order of <span className="font-semibold text-white">{activeOrder.quantity}x {activeOrder.materialName}</span> from <span className="font-semibold text-white">{activeOrder.shopName}</span> has arrived! Pay <span className="font-bold text-emerald-400">₹{activeOrder.transportRate} cash</span> to the driver ({activeOrder.driverName}).
                </p>
              </div>
            </div>
            <button
              onClick={() => handleUpdateStatus(activeOrder.id, "complete")}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow"
            >
              Verify Payout & Complete Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

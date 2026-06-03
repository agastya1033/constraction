import React, { useState } from "react";
import PlatformSimulator from "./components/PlatformSimulator";
import FlutterExporter from "./components/FlutterExporter";
import {
  Truck,
  Sparkles,
  Smartphone,
  Code,
  Shield,
  HelpCircle,
  Clock,
  Layers,
  MapPin,
  CheckCircle,
  PhoneCall,
  Activity
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"simulator" | "developer">("simulator");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl flex items-center justify-center shadow-lg relative">
            <Truck className="w-5 h-5 font-bold animate-shake" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sky-400 rounded-full animate-ping" />
          </div>
          <div>
            <h1 className="text-md sm:text-lg font-bold font-sans tracking-tight text-slate-100 flex items-center gap-1.5 leading-tight">
              CONSTRUCT <span className="text-amber-400 font-extrabold uppercase">DELIVERY</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono font-medium uppercase tracking-wider">Enterprise Dispatch Terminal</p>
          </div>
        </div>

        {/* Tab Swappers */}
        <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-850 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("simulator")}
            style={{ contentVisibility: "auto" }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 outline-none transition ${
              activeTab === "simulator"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab("developer")}
            style={{ contentVisibility: "auto" }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 outline-none transition ${
              activeTab === "developer"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Developer Source Hub</span>
          </button>
        </div>
      </header>

      {/* Hero Banner with brief descriptions */}
      <section className="bg-slate-900/40 border-b border-slate-900 px-6 py-6 sm:py-8 text-center sm:text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider font-mono text-amber-400 bg-amber-500/10 mb-3 border border-amber-500/10 animate-pulse">
              <Sparkles className="w-3 h-3" /> Mobile Transporter System Architecture
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold font-sans text-slate-100 tracking-tight leading-none">
              On-Demand Construction Material Desptach
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-2 font-light">
              Connect private house builders, local material shops, and freelance drivers in real time. Features modular state managers, vector routing GPS emulators, secure rate brokers, and production-ready source code libraries.
            </p>
          </div>
          
          <div className="flex items-center gap-5 bg-slate-950 p-4 rounded-2xl border border-slate-850 shrink-0 select-none text-[11px] font-mono leading-relaxed">
            <div className="flex flex-col gap-1 text-slate-400">
              <div className="flex items-center gap-1.5 text-sky-400 font-bold font-sans">
                <Layers className="w-4 h-4 text-sky-400" /> SYSTEM OVERVIEW
              </div>
              <div>📱 App Engine: <span className="text-white">Flutter Stable (Riverpod)</span></div>
              <div>🟢 REST Gateway: <span className="text-white">Node.js Express v4</span></div>
              <div>💾 Collections: <span className="text-white">MongoDB Mongoose API</span></div>
              <div>🔒 Security: <span className="text-white">Rate Limits & Secure JWT</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-8">
        {activeTab === "simulator" ? (
          /* Simulator Dashboard Display */
          <div className="space-y-8 animate-fadeIn">
            {/* Visual Simulator Sandbox */}
            <PlatformSimulator />

            {/* Business Loop Stages Timeline Progress indicator */}
            <div className="bg-slate-950 p-6 border border-slate-850 rounded-2xl">
              <h3 className="text-sm font-bold font-sans text-slate-200 flex items-center gap-1.5 mb-4 select-none">
                <Clock className="w-4 h-4 text-amber-500" /> 11-Step Material Commerce fulfillment Route
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative select-none">
                {/* Horizontal progress lines for large views */}
                <div className="absolute top-5 left-10 right-10 h-0.5 bg-slate-850 hidden md:block z-0" />
                
                <div className="flex gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-400 shrink-0">
                    01
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Catalog Browse</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">Owners browse local sand, steel, cement or hardware category merchants.</p>
                  </div>
                </div>

                <div className="flex gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-400 shrink-0">
                    02
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Broadcast Placed</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">Owner registers quantity and fixes transport payout. Order published to active drivers feed.</p>
                  </div>
                </div>

                <div className="flex gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-400 shrink-0">
                    03
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Fleet Dispatch</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">Nearest transporter accepts. Pickups material from shop and updates client GPS.</p>
                  </div>
                </div>

                <div className="flex gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs font-mono shrink-0">
                    04
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-emerald-400">Cash On Delivery</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">Lorry/tractor unloads on site. Client settle payments directly in cash.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Production Export Repository Explorer */
          <div className="animate-fadeIn">
            <FlutterExporter />
          </div>
        )}
      </main>

      {/* Beautiful High Contrast Footers */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-6 select-none mt-12 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Sandboxed Mobile platform preview • TLS/HTTPS Securites Enabled</span>
          </div>
          <p>
            © 2026 Construction Material Delivery Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

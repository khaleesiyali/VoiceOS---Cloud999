"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, 
  AlertTriangle, 
  Wrench, 
  Mic, 
  Settings, 
  Bell, 
  Activity,
  Layers,
  Thermometer,
  ArrowRight
} from "lucide-react";

export default function LogisticsCommander() {
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState("Awaiting voice command...");

  // Simulate a voice command arriving
  useEffect(() => {
    const timer = setTimeout(() => {
      setTranscript("Pallet 4B is damaged, leak on the bottom left. Mark 50 units of SKU 104 as spoiled...");
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/60 bg-slate-900/50 flex flex-col backdrop-blur-xl">
        <div className="h-16 flex items-center px-6 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-wide">Commander</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {["Dashboard", "Inventory", "Pallets", "Maintenance", "Reports"].map((item, idx) => (
            <button 
              key={item}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                idx === 0 
                  ? "bg-blue-600/10 text-blue-400 font-medium"
                  : "hover:bg-slate-800/50 text-slate-400 hover:text-slate-200"
              }`}
            >
              {idx === 0 && <Activity className="w-4 h-4" />}
              {idx === 1 && <Package className="w-4 h-4" />}
              {idx === 2 && <Layers className="w-4 h-4" />}
              {idx === 3 && <Wrench className="w-4 h-4" />}
              {idx === 4 && <AlertTriangle className="w-4 h-4" />}
              {item}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800/60">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/40 rounded-xl">
            <Settings className="w-4 h-4 text-slate-400" />
            <div className="text-sm">Settings</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 -z-10" />
        
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-800/60 bg-slate-900/30 backdrop-blur-md">
          <h1 className="text-xl font-semibold text-slate-100">Live Operations</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Worker ID: W-8821</span>
            <button className="relative p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition border border-slate-700/50">
              <Bell className="w-4 h-4 text-slate-300" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></div>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* VoiceOS Status Bar */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-blue-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 opacity-50" />
            <div className="flex items-center gap-6">
              <div className={`relative flex items-center justify-center w-14 h-14 rounded-full bg-blue-600/20 border border-blue-500/30 ${isListening ? 'voice-active' : ''}`}>
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md"></div>
                <Mic className="w-6 h-6 text-blue-400 relative z-10" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400/80">VoiceOS Active</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                </div>
                <p className="text-lg font-medium text-slate-100 italic">"{transcript}"</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Active Issues", value: "3", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-500/20" },
              { label: "Pending Maintenance", value: "1", icon: Wrench, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-500/20" },
              { label: "Total SKUs", value: "8,402", icon: Package, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/20" }
            ].map((stat, i) => (
              <div key={i} className={`p-6 rounded-2xl bg-slate-900/60 border ${stat.border} flex items-center gap-5 hover:bg-slate-800/80 transition-colors cursor-pointer group`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color} group-hover:scale-110 transition-transform`} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-100">{stat.value}</div>
                  <div className="text-sm text-slate-400 uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Storage Map/Status */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-100">Live Storage Sections</h2>
                <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition">
                  View Map <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-2">
                {[
                  { section: "A1", temp: "Ambient", pallets: 42, status: "Normal" },
                  { section: "A2", temp: "Ambient", pallets: 15, status: "Alert" },
                  { section: "B1", temp: "-18°C", pallets: 38, status: "Normal", chill: true },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-800/50 rounded-xl transition border border-transparent hover:border-slate-700/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                        {s.section}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200">Pallets: {s.pallets}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          {s.chill && <Thermometer className="w-3 h-3 text-cyan-400" />} {s.temp}
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${s.status === 'Alert' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-green-500/10 text-green-400 border-green-500/30'}`}>
                      {s.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Stream */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-100">Recent Workflow Actions</h2>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-5">
                {[
                  { time: "Just now", action: "Reported damage on Pallet 4B", user: "W-8821", color: "border-red-500" },
                  { time: "10m ago", action: "Scheduled maintenance for Forklift FL-09", user: "W-8821", color: "border-amber-500" },
                  { time: "25m ago", action: "Moved 30 units SKU-992 to A1", user: "S-102", color: "border-blue-500" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-1 h-auto rounded-full ${item.color} bg-current`}></div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-slate-200">{item.action}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{item.time}</span>
                        <span>•</span>
                        <span>{item.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}

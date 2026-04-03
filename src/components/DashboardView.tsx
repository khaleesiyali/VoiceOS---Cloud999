"use client";
import React from "react";
import { AlertTriangle, Wrench, Package, ArrowRight, Thermometer } from "lucide-react";

export default function DashboardView() {
  return (
    <div className="space-y-8">
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
  );
}

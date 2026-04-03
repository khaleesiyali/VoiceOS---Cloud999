"use client";

import React, { useState } from "react";
import {
  Package,
  AlertTriangle,
  Wrench,
  Mic,
  Settings,
  Bell,
  Activity,
  Layers,
  Loader2,
  CheckCircle2
} from "lucide-react";

// Views
import DashboardView from "@/components/DashboardView";
import InventoryView from "@/components/InventoryView";
import PalletsView from "@/components/PalletsView";
import MaintenanceView from "@/components/MaintenanceView";
import ReportsView from "@/components/ReportsView";

export type VoiceState = 'idle' | 'listening' | 'processing' | 'success';

export default function LogisticsCommander() {
  const [activeTab, setActiveTab] = useState("Inventory");

  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState("Click the microphone or simulate a command...");

  // Handler to manually toggle the mic
  const handleMicClick = () => {
    if (voiceState === 'idle' || voiceState === 'success') {
      setVoiceState('listening');
      setTranscript("Listening...");
    } else if (voiceState === 'listening') {
      setVoiceState('processing');
      setTranscript("Processing audio...");
      setTimeout(() => {
        setVoiceState('idle');
        setTranscript("Command not recognized. Please try again.");
      }, 2000);
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "Dashboard": return <DashboardView />;
      case "Inventory": return <InventoryView setTranscript={setTranscript} setVoiceState={setVoiceState} />;
      case "Pallets": return <PalletsView setTranscript={setTranscript} />;
      case "Maintenance": return <MaintenanceView setTranscript={setTranscript} />;
      case "Reports": return <ReportsView setTranscript={setTranscript} />;
      default: return <DashboardView />;
    }
  };

  const getVoiceStateConfig = () => {
    switch (voiceState) {
      case 'idle':
        return {
          barTopColor: 'from-slate-600 via-slate-500 to-slate-600 opacity-20',
          iconColor: 'text-slate-400',
          iconBg: 'bg-slate-800 border-slate-700',
          blurBg: 'bg-slate-700/20',
          label: 'VoiceOS Ready',
          labelColor: 'text-slate-400',
          dot: 'bg-slate-500 hidden',
          anim: ''
        };
      case 'listening':
        return {
          barTopColor: 'from-blue-600 via-cyan-400 to-blue-600 opacity-70 animate-pulse',
          iconColor: 'text-blue-400',
          iconBg: 'bg-blue-600/20 border-blue-500/50 cursor-pointer',
          blurBg: 'bg-blue-500/20',
          label: 'Listening...',
          labelColor: 'text-blue-400 font-bold',
          dot: 'bg-blue-400 animate-pulse',
          anim: 'voice-active' // Defined in globals.css
        };
      case 'processing':
        return {
          barTopColor: 'from-amber-500 via-orange-400 to-amber-500 opacity-70 animate-pulse',
          iconColor: 'text-amber-400',
          iconBg: 'bg-amber-600/20 border-amber-500/50',
          blurBg: 'bg-amber-500/20',
          label: 'Processing...',
          labelColor: 'text-amber-400 font-bold',
          dot: 'bg-amber-400 animate-bounce',
          anim: 'animate-pulse'
        };
      case 'success':
        return {
          barTopColor: 'from-emerald-600 via-green-400 to-emerald-600 opacity-80',
          iconColor: 'text-emerald-400',
          iconBg: 'bg-emerald-600/20 border-emerald-500/50',
          blurBg: 'bg-emerald-500/20',
          label: 'Command Executed',
          labelColor: 'text-emerald-400 font-bold',
          dot: 'bg-emerald-400',
          anim: ''
        };
    }
  };

  const ui = getVoiceStateConfig();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30">

      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/60 bg-slate-900/50 flex flex-col backdrop-blur-xl shrink-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-wide">EchoStock</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 relative">
          {["Dashboard", "Inventory", "Pallets", "Maintenance", "Reports"].map((item, idx) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${activeTab === item
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
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/40 rounded-xl cursor-pointer hover:bg-slate-800/60 transition">
            <Settings className="w-4 h-4 text-slate-400" />
            <div className="text-sm">Settings</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 -z-10 pointer-events-none" />

        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-800/60 bg-slate-900/30 backdrop-blur-md shrink-0">
          <h1 className="text-xl font-semibold text-slate-100">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Worker ID: W-8821</span>
            <button className="relative p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition border border-slate-700/50 flex items-center justify-center">
              <Bell className="w-4 h-4 text-slate-300" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></div>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">

          {/* VoiceOS Status Bar */}
          <div className={`bg-slate-900 border ${voiceState === 'idle' ? 'border-slate-800' : 'border-blue-500/20'} rounded-2xl p-6 shadow-2xl relative overflow-hidden group shrink-0 transition-all duration-500`}>
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${ui.barTopColor} transition-all duration-500`} />
            <div className="flex items-center gap-6">

              {/* Mic Icon Circle */}
              <div
                onClick={handleMicClick}
                className={`relative flex items-center justify-center w-14 h-14 rounded-full ${ui.iconBg} border cursor-pointer transition-all duration-500 ${ui.anim}`}
              >
                <div className={`absolute inset-0 rounded-full ${ui.blurBg} blur-md transition-all`}></div>

                {voiceState === 'processing' ? (
                  <Loader2 className={`w-6 h-6 ${ui.iconColor} relative z-10 animate-spin`} />
                ) : voiceState === 'success' ? (
                  <CheckCircle2 className={`w-6 h-6 ${ui.iconColor} relative z-10`} />
                ) : (
                  <Mic className={`w-6 h-6 ${ui.iconColor} relative z-10`} />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${ui.labelColor}`}>
                    {ui.label}
                  </span>
                  {voiceState !== 'idle' && (
                    <span className={`w-1.5 h-1.5 rounded-full ${ui.dot}`}></span>
                  )}
                </div>
                <p className={`text-lg font-medium italic transition-colors duration-300 ${voiceState === 'idle' ? 'text-slate-500' : 'text-slate-100'}`}>
                  "{transcript}"
                </p>
              </div>
            </div>
          </div>

          {/* Render the dynamically selected view */}
          <div className="pb-8">
            {renderActiveView()}
          </div>

        </div>
      </main>
    </div>
  );
}

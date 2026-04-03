"use client";
import React from "react";
import { Wrench } from "lucide-react";

export default function MaintenanceView({ setTranscript }: { setTranscript: (t: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
      <Wrench className="w-16 h-16 mb-4 text-slate-700" />
      <h2 className="text-xl font-semibold text-slate-300">Equipment Maintenance</h2>
      <p className="max-w-md text-center mt-2 text-sm">VoiceOS Maintenance scheduling features are in development. Try the Inventory tab for active voice simulations.</p>
    </div>
  );
}

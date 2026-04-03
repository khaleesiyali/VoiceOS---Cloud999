"use client";
import React, { useState } from 'react';
import { Package, AlertCircle, TrendingUp, CheckCircle, Search } from 'lucide-react';
import type { VoiceState } from '@/app/page';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  location: string;
  status: string;
  reordered: boolean;
  highlighted: boolean;
}

interface InventoryViewProps {
  setTranscript: (t: string) => void;
  setVoiceState: (v: VoiceState) => void;
}

export default function InventoryView({ setTranscript, setVoiceState }: InventoryViewProps) {
  const [items, setItems] = useState<InventoryItem[]>([
    { id: '1', sku: 'SKU-992', name: 'Premium Widgets', quantity: 180, location: 'A1, A2', status: 'Available', reordered: false, highlighted: false },
    { id: '2', sku: 'SKU-104', name: 'Organic Milk 1L', quantity: 50, location: 'B1', status: 'Available', reordered: false, highlighted: false },
    { id: '3', sku: 'SKU-551', name: 'Industrial Lubricant', quantity: 400, location: 'D4', status: 'Available', reordered: false, highlighted: false },
    { id: '4', sku: 'SKU-808', name: 'Alkaline Batteries', quantity: 15, location: 'C2', status: 'Low Stock', reordered: false, highlighted: false },
  ]);

  const handleAction = (action: string, itemId: string, voicePrompt: string) => {
    // 1. Enter Listing State
    setVoiceState('listening');
    setTranscript(voicePrompt);

    // 2. Enter Processing State after a brief delay
    setTimeout(() => {
      setVoiceState('processing');
      setTranscript("Processing audio command...");
      
      // 3. Execute the actual UI action after another delay
      setTimeout(() => {
        setItems(prev => prev.map(item => {
          if (item.id === itemId) {
            if (action === 'markSpoiled') {
              return { ...item, quantity: Math.max(0, item.quantity - 10), status: 'Needs Attention' };
            }
            if (action === 'addStock') {
              return { ...item, quantity: item.quantity + 50, status: 'Available' };
            }
            if (action === 'reorder') {
              return { ...item, reordered: true };
            }
            if (action === 'checkStock') {
              return { ...item, highlighted: true };
            }
          }
          if (action === 'checkStock' && item.id !== itemId) {
            return { ...item, highlighted: false };
          }
          return item;
        }));

        const targetItem = items.find(i => i.id === itemId);
        if (targetItem) {
          if (action === 'markSpoiled') setTranscript(`Marked 10 units of ${targetItem.sku} as spoiled.`);
          if (action === 'addStock') setTranscript(`Added 50 units to ${targetItem.sku} in ${targetItem.location}.`);
          if (action === 'reorder') setTranscript(`Triggered automated re-order for ${targetItem.sku} from main supplier.`);
          if (action === 'checkStock') setTranscript(`Checking stock for ${targetItem.sku}. Highlighting on your HUD.`);
        }
        
        setVoiceState('success');

        // Remove highlight and reset voice state back to idle after ~4 seconds
        setTimeout(() => {
          setVoiceState('idle');
          setTranscript("VoiceOS Ready. Awaiting commands...");
          if (action === 'checkStock') {
            setItems(prev => prev.map(i => ({ ...i, highlighted: false })));
          }
        }, 3000);

      }, 1500); // 1.5s processing
    }, 1000); // 1s listening
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100">Live Inventory</h2>
        <div className="flex gap-2">
           <div className="relative">
             <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
             <input type="text" placeholder="Search SKUs..." className="bg-slate-900/60 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500" />
           </div>
        </div>
      </div>

      {/* Voice Assistant Simulation Controls */}
      <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-5 mb-6">
        <div className="text-xs text-blue-400 font-semibold mb-3 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Simulate Voice Commands on SKU-104
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => handleAction('markSpoiled', '2', "Mark 10 units spoiled")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 rounded-lg border border-slate-700 flex items-center gap-2 transition hover:border-red-500/50 hover:text-red-400">
            <AlertCircle className="w-4 h-4" /> "Mark 10 units spoiled"
          </button>
          <button onClick={() => handleAction('addStock', '2', "Add 50 to stock")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 rounded-lg border border-slate-700 flex items-center gap-2 transition hover:border-emerald-500/50 hover:text-emerald-400">
             <TrendingUp className="w-4 h-4" /> "Add 50 to stock"
          </button>
          <button onClick={() => handleAction('reorder', '2', "Reorder from supplier")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 rounded-lg border border-slate-700 flex items-center gap-2 transition hover:border-blue-500/50 hover:text-blue-400">
             <Package className="w-4 h-4" /> "Reorder from supplier"
          </button>
          <button onClick={() => handleAction('checkStock', '2', "Check stock SKU-104")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 rounded-lg border border-slate-700 flex items-center gap-2 transition hover:border-amber-500/50 hover:text-amber-400">
             <Search className="w-4 h-4" /> "Check stock SKU-104"
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium border-b border-slate-800/60">SKU / Item</th>
              <th className="p-4 font-medium border-b border-slate-800/60">Location</th>
              <th className="p-4 font-medium text-right border-b border-slate-800/60">Quantity</th>
              <th className="p-4 font-medium border-b border-slate-800/60 pl-8">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {items.map(item => (
              <tr key={item.id} className={`transition-all duration-500 ${item.highlighted ? 'bg-amber-500/10' : 'hover:bg-slate-800/30'}`}>
                <td className="p-4 relative">
                  {item.highlighted && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 animate-pulse"></div>}
                  <div className="font-medium text-slate-200">{item.sku}</div>
                  <div className="text-xs text-slate-500">{item.name}</div>
                </td>
                <td className="p-4 text-sm text-slate-300">{item.location}</td>
                <td className="p-4 text-right font-mono font-medium">
                  <div className={`transition-all duration-300 ${item.quantity < 20 ? 'text-red-400' : 'text-emerald-400'} text-lg`}>
                    {item.quantity}
                  </div>
                </td>
                <td className="p-4 pl-8">
                   <div className="flex items-center gap-2">
                     <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                       item.status === 'Available' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                       item.status === 'Needs Attention' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                       item.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                       'bg-red-500/10 text-red-400 border border-red-500/20'
                     }`}>
                        {item.status}
                     </span>
                     {item.reordered && (
                       <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-blue-500/20 animate-in fade-in zoom-in duration-300">
                         <CheckCircle className="w-3.5 h-3.5" /> Reordered
                       </span>
                     )}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

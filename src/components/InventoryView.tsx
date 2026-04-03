"use client";
import React, { useState } from "react";
import { Package, AlertCircle, TrendingUp, Search, ShieldAlert, Truck } from "lucide-react";

type Status = "in_stock" | "shipped" | "damaged" | "spoiled" | "reserved";

interface InventoryItem {
  item_id: string;
  name: string;
  status: Status;
  quantity: number;
  location: string;
  notes: string | null;
  highlighted: boolean;
}

const STATUS_STYLES: Record<Status, string> = {
  in_stock:  "bg-green-500/10 text-green-400 border-green-500/20",
  reserved:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
  shipped:   "bg-slate-500/10 text-slate-400 border-slate-500/20",
  damaged:   "bg-red-500/10 text-red-400 border-red-500/20",
  spoiled:   "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const STATUS_LABEL: Record<Status, string> = {
  in_stock: "In Stock",
  reserved: "Reserved",
  shipped:  "Shipped",
  damaged:  "Damaged",
  spoiled:  "Spoiled",
};

const INITIAL_ITEMS: InventoryItem[] = [
  { item_id: "SKU-001", name: "Water Bottles (24-pack)",        status: "in_stock",  quantity: 320, location: "Zone-A, Shelf-1",  notes: null,                                          highlighted: false },
  { item_id: "SKU-002", name: "Canned Soup (Tomato, case/12)",  status: "in_stock",  quantity: 150, location: "Zone-A, Shelf-3",  notes: null,                                          highlighted: false },
  { item_id: "SKU-003", name: "Paper Towels (bulk roll x6)",    status: "reserved",  quantity:  80, location: "Pallet-4B",        notes: "Reserved for order #8821",                    highlighted: false },
  { item_id: "SKU-004", name: "Nitrile Gloves (box/100)",       status: "in_stock",  quantity: 400, location: "Zone-B, Shelf-2",  notes: null,                                          highlighted: false },
  { item_id: "SKU-005", name: "Cardboard Boxes (flat, lg)",     status: "shipped",   quantity:   0, location: "Loading Dock-1",   notes: "Shipped via FedEx — tracking #FX9942",        highlighted: false },
  { item_id: "SKU-006", name: "Hand Sanitizer (1L bottle)",     status: "in_stock",  quantity: 210, location: "Zone-C, Shelf-1",  notes: null,                                          highlighted: false },
  { item_id: "SKU-007", name: "Pallet Wrap (stretch film)",     status: "damaged",   quantity:  30, location: "Pallet-2A",        notes: "15 rolls torn during forklift incident",      highlighted: false },
  { item_id: "SKU-008", name: "Frozen Peas (1kg bag)",          status: "spoiled",   quantity:   0, location: "Cold Storage-1",   notes: "Freezer malfunction — batch spoiled",         highlighted: false },
  { item_id: "SKU-009", name: "Safety Vests (hi-vis, L)",       status: "in_stock",  quantity:  95, location: "Zone-B, Shelf-5",  notes: null,                                          highlighted: false },
  { item_id: "SKU-010", name: "Duct Tape (48mm x 50m)",         status: "reserved",  quantity:  60, location: "Zone-D, Shelf-1",  notes: "Reserved for maintenance crew",               highlighted: false },
];

// Demo voice command scenarios shown in the simulation panel
const DEMO_ACTIONS = [
  {
    label: '"Report damage on SKU-007, 5 units"',
    icon: ShieldAlert,
    color: "hover:border-red-500/50 hover:text-red-400",
    action: (items: InventoryItem[]): [InventoryItem[], string] => {
      const updated = items.map(i =>
        i.item_id === "SKU-007"
          ? { ...i, quantity: Math.max(0, i.quantity - 5), status: "damaged" as Status, highlighted: true }
          : { ...i, highlighted: false }
      );
      return [updated, "Damage recorded for SKU-007. 5 units removed. Status set to damaged."];
    },
  },
  {
    label: '"Add 50 units to SKU-001"',
    icon: TrendingUp,
    color: "hover:border-emerald-500/50 hover:text-emerald-400",
    action: (items: InventoryItem[]): [InventoryItem[], string] => {
      const updated = items.map(i =>
        i.item_id === "SKU-001"
          ? { ...i, quantity: i.quantity + 50, status: "in_stock" as Status, highlighted: true }
          : { ...i, highlighted: false }
      );
      return [updated, "Done. SKU-001 updated. 50 units added. New quantity is " + (items.find(i => i.item_id === "SKU-001")!.quantity + 50) + "."];
    },
  },
  {
    label: '"Mark SKU-006 as reserved"',
    icon: Package,
    color: "hover:border-blue-500/50 hover:text-blue-400",
    action: (items: InventoryItem[]): [InventoryItem[], string] => {
      const updated = items.map(i =>
        i.item_id === "SKU-006"
          ? { ...i, status: "reserved" as Status, highlighted: true }
          : { ...i, highlighted: false }
      );
      return [updated, "Done. Hand Sanitizer, SKU-006, has been updated from in stock to reserved."];
    },
  },
  {
    label: '"Ship SKU-004"',
    icon: Truck,
    color: "hover:border-slate-400/50 hover:text-slate-300",
    action: (items: InventoryItem[]): [InventoryItem[], string] => {
      const updated = items.map(i =>
        i.item_id === "SKU-004"
          ? { ...i, status: "shipped" as Status, quantity: 0, highlighted: true }
          : { ...i, highlighted: false }
      );
      return [updated, "Done. Nitrile Gloves, SKU-004, has been updated from in stock to shipped."];
    },
  },
];

export default function InventoryView({ setTranscript }: { setTranscript: (t: string) => void }) {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_ITEMS);
  const [search, setSearch] = useState("");

  const runDemo = (actionIndex: number) => {
    const [updated, transcript] = DEMO_ACTIONS[actionIndex].action(items);
    setItems(updated);
    setTranscript(transcript);
    // Remove highlight after 3 seconds
    setTimeout(() => setItems(prev => prev.map(i => ({ ...i, highlighted: false }))), 3000);
  };

  const filtered = items.filter(
    (item) =>
      item.item_id.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100">Live Inventory</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search SKU, name, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900/60 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 w-56"
          />
        </div>
      </div>

      {/* Voice command simulation panel — great for live demo */}
      <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-5">
        <div className="text-xs text-blue-400 font-semibold mb-3 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Simulate VoiceOS Commands
        </div>
        <div className="flex flex-wrap gap-3">
          {DEMO_ACTIONS.map((a, i) => (
            <button
              key={i}
              onClick={() => runDemo(i)}
              className={`px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 rounded-lg border border-slate-700 flex items-center gap-2 transition ${a.color}`}
            >
              <a.icon className="w-4 h-4" />
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory table */}
      <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium border-b border-slate-800/60">SKU / Item</th>
              <th className="p-4 font-medium border-b border-slate-800/60">Location</th>
              <th className="p-4 font-medium text-right border-b border-slate-800/60">Quantity</th>
              <th className="p-4 font-medium border-b border-slate-800/60 pl-8">Status</th>
              <th className="p-4 font-medium border-b border-slate-800/60">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((item) => (
              <tr
                key={item.item_id}
                className={`transition-all duration-500 ${item.highlighted ? "bg-blue-500/10" : "hover:bg-slate-800/30"}`}
              >
                <td className="p-4 relative">
                  {item.highlighted && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 animate-pulse" />
                  )}
                  <div className="font-medium text-slate-200">{item.item_id}</div>
                  <div className="text-xs text-slate-500">{item.name}</div>
                </td>
                <td className="p-4 text-sm text-slate-300">{item.location}</td>
                <td className="p-4 text-right font-mono font-medium">
                  <span className={`text-lg transition-all duration-300 ${item.quantity < 20 ? "text-red-400" : "text-emerald-400"}`}>
                    {item.quantity}
                  </span>
                </td>
                <td className="p-4 pl-8">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[item.status]}`}>
                    {STATUS_LABEL[item.status]}
                  </span>
                </td>
                <td className="p-4 text-xs text-slate-500 max-w-xs truncate">
                  {item.notes ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-slate-500">
          <AlertCircle className="w-8 h-8 mb-2 text-slate-700" />
          No items match your search.
        </div>
      )}
    </div>
  );
}

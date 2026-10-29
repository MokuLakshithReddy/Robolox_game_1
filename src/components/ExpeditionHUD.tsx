import React from 'react';
import { Shield, AlertTriangle, Clock, Briefcase, Navigation, Radio } from 'lucide-react';
import { ExpeditionState, InventoryItem } from '../types';

interface ExpeditionHUDProps {
  expedition: ExpeditionState;
  playerHp: number;
  isWardenAlert: boolean;
  nearbyInteractableName: string | null;
  onInteractPrompt: string;
}

export const ExpeditionHUD: React.FC<ExpeditionHUDProps> = ({
  expedition,
  playerHp,
  isWardenAlert,
  nearbyInteractableName,
}) => {
  const currentSlots = expedition.inventory.reduce((acc, item) => acc + item.quantity, 0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 select-none font-sans overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-start justify-between w-full">
        {/* Objectives / Contract Card */}
        <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md p-4 rounded-2xl shadow-xl w-80 text-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Active Contract</span>
          </div>
          <h4 className="font-bold text-sm">{expedition.contract.title}</h4>
          <p className="text-xs text-slate-400 mt-0.5">{expedition.contract.description}</p>
        </div>

        {/* Timer & Lockdown Alert */}
        <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border shadow-xl backdrop-blur-md transition-all ${
          expedition.timeRemaining < 90 ? 'bg-red-950/80 border-red-500/50 text-red-200 animate-pulse' : 'bg-slate-900/80 border-slate-800 text-slate-100'
        }`}>
          <Clock className={`w-5 h-5 ${expedition.timeRemaining < 90 ? 'text-red-400' : 'text-blue-400'}`} />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lockdown Countdown</span>
            <span className="text-xl font-extrabold font-mono tabular-nums">{formatTime(expedition.timeRemaining)}</span>
          </div>
        </div>

        {/* Status Cluster */}
        <div className="flex items-center gap-4">
          {isWardenAlert && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 border border-red-500/50 rounded-2xl text-red-400 font-bold text-sm animate-bounce backdrop-blur-md">
              <AlertTriangle className="w-5 h-5" />
              <span>WARDEN ALERT</span>
            </div>
          )}

          <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md px-5 py-3 rounded-2xl flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Integrity</span>
              <span className="text-sm font-extrabold font-mono tabular-nums text-slate-100">{Math.round(playerHp)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Prompt for Interaction */}
      <div className="self-center flex flex-col items-center justify-center">
        {nearbyInteractableName && (
          <div className="pointer-events-auto px-6 py-3 bg-slate-900/90 border border-blue-500/50 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-pulse text-slate-100">
            <kbd className="px-2.5 py-1 bg-blue-600 rounded-lg text-white font-mono text-xs font-bold">E</kbd>
            <span className="text-sm font-semibold">Inspect / Salvage <span className="text-blue-400 font-bold">{nearbyInteractableName}</span></span>
          </div>
        )}
      </div>

      {/* Bottom Bar: Inventory & Extraction Direction */}
      <div className="flex items-end justify-between w-full">
        {/* Inventory Bag */}
        <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="flex items-center gap-2 text-blue-400">
            <Briefcase className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Satchel Haul</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="font-bold text-slate-200">{currentSlots}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{expedition.maxSlots} Slots</span>
          </div>
        </div>

        {/* Extraction Direction Hint */}
        <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md px-5 py-3 rounded-2xl flex items-center gap-3 text-emerald-400">
          <Navigation className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">Extraction Beacon Active at Sector Center (0, 32)</span>
        </div>
      </div>
    </div>
  );
};

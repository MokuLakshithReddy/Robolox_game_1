import React from 'react';
import { Trophy, Coins, BookOpen, ArrowRight } from 'lucide-react';
import { ExpeditionState } from '../types';
import { ALL_ITEMS } from '../game/gameState';
import { soundManager } from '../audio';

interface DebriefModalProps {
  expedition: ExpeditionState;
  onReturnToWorkshop: () => void;
}

export const DebriefModal: React.FC<DebriefModalProps> = ({ expedition, onReturnToWorkshop }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 font-sans select-none animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-6 shadow-lg shadow-emerald-500/20">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-100 tracking-wide">Extraction Successful</h2>
        <p className="text-sm text-slate-400 mt-1">You escaped the lockdown zone with valuable salvage and artifacts.</p>

        {/* Earnings Summary */}
        <div className="w-full bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 my-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Secured Haul Items</span>
            <span className="text-sm font-bold text-slate-200 font-mono">{expedition.securedHaul.length} items</span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
            <span className="text-sm text-slate-400">Total Credits Earned</span>
            <div className="flex items-center gap-1.5 text-amber-400 font-extrabold font-mono text-lg">
              <Coins className="w-5 h-5" />
              <span>+{expedition.earnedCredits} Cr</span>
            </div>
          </div>
        </div>

        {/* New Artifact Discoveries */}
        {expedition.newArtifactsFound.length > 0 && (
          <div className="w-full bg-purple-950/20 border border-purple-500/30 rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              <span>New Artifact Catalog Entries</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {expedition.newArtifactsFound.map((id) => {
                const item = ALL_ITEMS.find((i) => i.id === id);
                return (
                  <span key={id} className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-xl text-xs font-semibold text-purple-200">
                    {item?.name || id}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={() => {
            soundManager.playClick();
            onReturnToWorkshop();
          }}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Return to Salvage Workshop</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

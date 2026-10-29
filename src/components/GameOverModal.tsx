import React from 'react';
import { AlertOctagon, RotateCcw, Shield } from 'lucide-react';
import { soundManager } from '../audio';

interface GameOverModalProps {
  reason: string;
  onReturnToWorkshop: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ reason, onReturnToWorkshop }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-6 font-sans select-none animate-fadeIn">
      <div className="bg-slate-900 border border-red-500/30 rounded-3xl max-w-md w-full p-8 shadow-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-6 shadow-lg shadow-red-500/20">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-100 tracking-wide">Expedition Failed</h2>
        <p className="text-sm text-red-400 mt-1 font-medium">{reason}</p>

        {/* Fail Forward Notice */}
        <div className="w-full bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 my-6 text-left flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-blue-400">Fail Forward Rule:</strong> Unbanked haul from this run was lost, but previously banked credits, owned workshop upgrades, and collection catalog discoveries remain fully secure.
          </p>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onReturnToWorkshop();
          }}
          className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Return to Salvage Workshop</span>
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { Shield, Play, Volume2, VolumeX, Sparkles, AlertTriangle } from 'lucide-react';
import { soundManager } from '../audio';

interface TitleScreenProps {
  onStartGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStartGame, isMuted, onToggleMute }) => {
  return (
    <div className="relative w-full h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-blue-950/20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Audio Toggle */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button
          onClick={() => {
            onToggleMute();
            soundManager.playClick();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-sm font-medium transition-all shadow-lg backdrop-blur-md"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
          {isMuted ? 'Audio Muted' : 'Audio Active'}
        </button>
      </div>

      <div className="relative z-10 max-w-2xl px-6 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-6 shadow-inner">
          <Shield className="w-3.5 h-3.5" />
          <span>Roblox Extraction Simulator · Web Edition</span>
        </div>

        {/* Title Lockup (Bespoke SVG) */}
        <div className="mb-4">
          <svg className="w-full max-w-[480px] h-auto drop-shadow-2xl" viewBox="0 0 500 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="50%" y="45" textAnchor="middle" fill="#3b82f6" fontSize="28" fontWeight="900" letterSpacing="6" fontFamily="system-ui">
              LOOT SHIFT
            </text>
            <text x="50%" y="100" textAnchor="middle" fill="#ef4444" fontSize="42" fontWeight="900" letterSpacing="10" fontFamily="system-ui">
              LOCKDOWN
            </text>
          </svg>
        </div>

        <p className="text-slate-400 text-base max-w-lg mb-10 leading-relaxed">
          Scavenge an abandoned industrial district, avoid the relentless Warden threat, and decide how much valuable salvage you are willing to risk before lockdown strikes.
        </p>

        {/* Start Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onStartGame();
          }}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Enter Salvage Workshop</span>
          <Sparkles className="w-4 h-4 text-blue-200 animate-pulse" />
        </button>

        {/* Control Hints */}
        <div className="mt-14 flex flex-wrap justify-center gap-6 text-xs text-slate-400 bg-slate-900/60 border border-slate-800 px-6 py-3 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 font-mono">WASD</kbd>
            <span>Move</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 font-mono">Mouse</kbd>
            <span>Look</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 font-mono">E</kbd>
            <span>Interact / Loot</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 font-mono">Shift</kbd>
            <span>Sprint</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Shield, Wrench, BookOpen, Scroll, Play, Coins, ArrowUpRight, CheckCircle2, Lock } from 'lucide-react';
import { PlayerProfile, Contract } from '../types';
import { ALL_ITEMS, CONTRACTS, getSatchelCapacity, getUpgradeCost, saveProfile } from '../game/gameState';
import { soundManager } from '../audio';

interface WorkshopHubProps {
  profile: PlayerProfile;
  setProfile: React.Dispatch<React.SetStateAction<PlayerProfile>>;
  onStartExpedition: () => void;
}

export const WorkshopHub: React.FC<WorkshopHubProps> = ({ profile, setProfile, onStartExpedition }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'upgrades' | 'collection' | 'contracts'>('overview');
  const [contracts] = useState<Contract[]>(CONTRACTS);

  const handleUpgrade = (type: 'satchel' | 'scanner' | 'flashlight') => {
    const currentLvl = profile.upgrades[type];
    const cost = getUpgradeCost(type, currentLvl);
    if (profile.credits >= cost && currentLvl < (type === 'satchel' ? 3 : 2)) {
      soundManager.playExtract();
      const updated = {
        ...profile,
        credits: profile.credits - cost,
        upgrades: {
          ...profile.upgrades,
          [type]: currentLvl + 1,
        },
      };
      setProfile(updated);
      saveProfile(updated);
    }
  };

  const satchelCap = getSatchelCapacity(profile.upgrades.satchel);

  return (
    <div className="relative w-full h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between px-8 py-5 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide text-slate-100">Salvage Workshop #402</h1>
            <p className="text-xs text-slate-400">Base Operations & Secure Hub</p>
          </div>
        </div>

        {/* Credits Badge */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 font-bold">
            <Coins className="w-5 h-5 text-amber-400" />
            <span className="tabular-nums text-lg">{profile.credits}</span>
            <span className="text-xs text-amber-400/80 font-normal">Credits</span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onStartExpedition();
            }}
            className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Expedition</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="w-72 bg-slate-900/40 border-r border-slate-800 p-6 flex flex-col gap-2">
          <button
            onClick={() => { soundManager.playClick(); setActiveTab('overview'); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Workshop Overview</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveTab('upgrades'); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
              activeTab === 'upgrades' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Gear & Upgrades</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveTab('collection'); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
              activeTab === 'collection' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Artifact Catalog</span>
            <span className="ml-auto px-2 py-0.5 bg-slate-800 rounded-full text-xs text-blue-400 font-mono">
              {profile.collection.length}/{ALL_ITEMS.filter(i => i.category === 'artifact').length}
            </span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveTab('contracts'); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
              activeTab === 'contracts' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Scroll className="w-4 h-4" />
            <span>Active Contracts</span>
          </button>
        </nav>

        {/* Dynamic Panel Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-950/80">
          {activeTab === 'overview' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-100">District Operations Hub</h2>
                <p className="text-sm text-slate-400 mt-1">Prepare your equipment, review contracts, and deploy into the Old Market District.</p>
              </div>

              {/* Quick stats grid */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Runs Completed</span>
                  <div className="text-3xl font-extrabold text-blue-400 mt-2 font-mono">
                    {profile.statistics.runsExtracted} / {profile.statistics.runsStarted}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Successful Extractions</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Satchel Capacity</span>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-2 font-mono">{satchelCap} Slots</div>
                  <p className="text-xs text-slate-500 mt-1">Level {profile.upgrades.satchel} Reinforced</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Artifacts Discovered</span>
                  <div className="text-3xl font-extrabold text-purple-400 mt-2 font-mono">{profile.statistics.artifactsExtracted}</div>
                  <p className="text-xs text-slate-500 mt-1">Secured in Catalog</p>
                </div>
              </div>

              {/* Quick Launch Banner */}
              <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/20 border border-blue-500/30 p-8 rounded-3xl flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Ready to Deploy?</h3>
                  <p className="text-sm text-slate-300 mt-1">The Old Market District is active. High-value artifacts detected in sector 4.</p>
                </div>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onStartExpedition();
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  Start Expedition Now
                </button>
              </div>
            </div>
          )}

          {activeTab === 'upgrades' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-100">Workshop Equipment Bench</h2>
                <p className="text-sm text-slate-400 mt-1">Upgrade your salvage satchel, signal scanner, and illumination gear.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Satchel Upgrade */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-100">Reinforced Satchel</h3>
                    <p className="text-sm text-slate-400 mt-1">Increases expedition carry slots (Current: {satchelCap} slots)</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {profile.upgrades.satchel < 3 ? (
                      <button
                        onClick={() => handleUpgrade('satchel')}
                        disabled={profile.credits < getUpgradeCost('satchel', profile.upgrades.satchel)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                          profile.credits >= getUpgradeCost('satchel', profile.upgrades.satchel)
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span>Upgrade ({getUpgradeCost('satchel', profile.upgrades.satchel)} Cr)</span>
                      </button>
                    ) : (
                      <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl font-semibold text-sm">
                        Max Level (3)
                      </span>
                    )}
                  </div>
                </div>

                {/* Scanner Upgrade */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-100">Signal Scanner</h3>
                    <p className="text-sm text-slate-400 mt-1">Improves detection range for hidden loot containers (Level {profile.upgrades.scanner})</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {profile.upgrades.scanner < 2 ? (
                      <button
                        onClick={() => handleUpgrade('scanner')}
                        disabled={profile.credits < getUpgradeCost('scanner', profile.upgrades.scanner)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                          profile.credits >= getUpgradeCost('scanner', profile.upgrades.scanner)
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span>Upgrade ({getUpgradeCost('scanner', profile.upgrades.scanner)} Cr)</span>
                      </button>
                    ) : (
                      <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl font-semibold text-sm">
                        Max Level (2)
                      </span>
                    )}
                  </div>
                </div>

                {/* Flashlight Upgrade */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-100">High-Output Flashlight</h3>
                    <p className="text-sm text-slate-400 mt-1">Expands illumination beam intensity and battery life (Level {profile.upgrades.flashlight})</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {profile.upgrades.flashlight < 2 ? (
                      <button
                        onClick={() => handleUpgrade('flashlight')}
                        disabled={profile.credits < getUpgradeCost('flashlight', profile.upgrades.flashlight)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                          profile.credits >= getUpgradeCost('flashlight', profile.upgrades.flashlight)
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span>Upgrade ({getUpgradeCost('flashlight', profile.upgrades.flashlight)} Cr)</span>
                      </button>
                    ) : (
                      <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl font-semibold text-sm">
                        Max Level (2)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'collection' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-100">Permanent Artifact Catalog</h2>
                <p className="text-sm text-slate-400 mt-1">Discoveries successfully extracted from quarantine zones.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {ALL_ITEMS.filter((i) => i.category === 'artifact').map((item) => {
                  const unlocked = profile.collection.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-6 rounded-2xl border ${
                        unlocked ? 'bg-slate-900 border-purple-500/40 shadow-lg shadow-purple-500/10' : 'bg-slate-900/40 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          unlocked ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {item.rarity}
                        </span>
                        {unlocked ? <CheckCircle2 className="w-5 h-5 text-purple-400" /> : <Lock className="w-4 h-4 text-slate-600" />}
                      </div>
                      <h3 className="text-lg font-bold text-slate-100 mt-2">{unlocked ? item.name : '??? Undiscovered'}</h3>
                      <p className="text-xs text-slate-400 mt-1">{unlocked ? item.description : 'Extract this artifact from the district to unlock permanent lore.'}</p>
                      <div className="mt-4 text-xs font-mono text-amber-400/90">Value: {item.value} Cr</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'contracts' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-100">Active Contracts</h2>
                <p className="text-sm text-slate-400 mt-1">Fulfill objectives during expeditions for bonus credits.</p>
              </div>

              <div className="space-y-4">
                {contracts.map((c) => (
                  <div key={c.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-100">{c.title}</h3>
                      <p className="text-sm text-slate-400 mt-1">{c.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl font-bold text-sm font-mono">
                        <Coins className="w-4 h-4" />
                        <span>+{c.rewardCredits} Cr</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

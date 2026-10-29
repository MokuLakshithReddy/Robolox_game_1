import React, { useState, useEffect, useRef } from 'react';
import { GamePhase, PlayerProfile, ExpeditionState } from './types';
import { loadProfile, saveProfile, getSatchelCapacity, CONTRACTS, ALL_ITEMS } from './game/gameState';
import { ExpeditionGameWorld, WorldInteractable } from './game/threeScene';
import { soundManager } from './audio';
import { TitleScreen } from './components/TitleScreen';
import { WorkshopHub } from './components/WorkshopHub';
import { ExpeditionHUD } from './components/ExpeditionHUD';
import { DebriefModal } from './components/DebriefModal';
import { GameOverModal } from './components/GameOverModal';

export default function App() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('title');
  const [profile, setProfile] = useState<PlayerProfile>(loadProfile());
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Expedition active state
  const [expedition, setExpedition] = useState<ExpeditionState | null>(null);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [isWardenAlert, setIsWardenAlert] = useState<boolean>(false);
  const [nearbyItem, setNearbyItem] = useState<WorldInteractable | null>(null);
  const [gameOverReason, setGameOverReason] = useState<string>('Eliminated by the Warden automaton.');

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<ExpeditionGameWorld | null>(null);
  const timerRef = useRef<number | null>(null);

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleStartExpedition = () => {
    soundManager.playClick();
    const maxSlots = getSatchelCapacity(profile.upgrades.satchel);
    const newExp: ExpeditionState = {
      runId: 'run_' + Date.now(),
      phase: 'exploring',
      timeRemaining: 300, // 5 minutes
      districtName: 'Old Market District',
      hazard: 'none',
      inventory: [],
      maxSlots,
      contract: CONTRACTS[Math.floor(Math.random() * CONTRACTS.length)],
      contractProgress: 0,
      securedHaul: [],
      earnedCredits: 0,
      newArtifactsFound: [],
    };

    setExpedition(newExp);
    setPlayerHp(100);
    setIsWardenAlert(false);
    setNearbyItem(null);
    setGamePhase('expedition');
    soundManager.startSiren();
  };

  // Timer loop for expedition
  useEffect(() => {
    if (gamePhase === 'expedition' && expedition) {
      timerRef.current = window.setInterval(() => {
        setExpedition((prev) => {
          if (!prev) return null;
          if (prev.timeRemaining <= 1) {
            // Lockdown expired! Game over
            if (timerRef.current) clearInterval(timerRef.current);
            soundManager.stopSiren();
            setGameOverReason('District lockdown completed before extraction. Rescue failed.');
            setGamePhase('gameover');
            return null;
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      soundManager.stopSiren();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gamePhase]);

  // Mount Three.js game world when in expedition phase
  useEffect(() => {
    if (gamePhase === 'expedition' && canvasContainerRef.current) {
      const world = new ExpeditionGameWorld(canvasContainerRef.current, {
        onInteract: (interactable) => {
          if (interactable.type === 'loot' && expedition) {
            const def = interactable.data;
            const currentTotalSlots = expedition.inventory.reduce((sum, item) => sum + item.quantity, 0);

            if (currentTotalSlots < expedition.maxSlots) {
              if (def.category === 'artifact') {
                soundManager.playArtifactPickup();
              } else {
                soundManager.playPickup();
              }

              worldRef.current?.markCollected(interactable.id);
              setNearbyItem(null);

              setExpedition((prev) => {
                if (!prev) return null;
                const existing = prev.inventory.find((i) => i.definitionId === def.id);
                let updatedInventory = [...prev.inventory];
                if (existing) {
                  updatedInventory = updatedInventory.map((i) =>
                    i.definitionId === def.id ? { ...i, quantity: i.quantity + 1 } : i
                  );
                } else {
                  updatedInventory.push({
                    id: 'item_' + Math.random(),
                    definitionId: def.id,
                    quantity: 1,
                  });
                }
                return { ...prev, inventory: updatedInventory };
              });
            }
          } else if (interactable.type === 'extraction' && expedition) {
            // Successful extraction!
            soundManager.playExtract();
            soundManager.stopSiren();
            if (timerRef.current) clearInterval(timerRef.current);

            // Calculate credits & artifacts
            let totalCredits = 0;
            const newArtifacts: string[] = [];
            const secured: typeof expedition.securedHaul = [];

            expedition.inventory.forEach((inv) => {
              const def = ALL_ITEMS.find((d) => d.id === inv.definitionId);
              if (def) {
                totalCredits += def.value * inv.quantity;
                secured.push(inv);
                if (def.category === 'artifact' && !profile.collection.includes(def.id)) {
                  newArtifacts.push(def.id);
                }
              }
            });

            // Update profile
            const updatedProfile: PlayerProfile = {
              ...profile,
              credits: profile.credits + totalCredits,
              collection: Array.from(new Set([...profile.collection, ...newArtifacts])),
              statistics: {
                ...profile.statistics,
                runsStarted: profile.statistics.runsStarted + 1,
                runsExtracted: profile.statistics.runsExtracted + 1,
                artifactsExtracted: profile.statistics.artifactsExtracted + newArtifacts.length,
                totalCreditsEarned: profile.statistics.totalCreditsEarned + totalCredits,
              },
            };
            setProfile(updatedProfile);
            saveProfile(updatedProfile);

            setExpedition((prev) =>
              prev
                ? {
                    ...prev,
                    phase: 'extracted',
                    securedHaul: secured,
                    earnedCredits: totalCredits,
                    newArtifactsFound: newArtifacts,
                  }
                : null
            );
            setGamePhase('debrief');
          }
        },
        onHealthChange: (hp) => {
          setPlayerHp(hp);
          if (hp <= 0) {
            soundManager.stopSiren();
            if (timerRef.current) clearInterval(timerRef.current);
            setGameOverReason('Eliminated by the Warden patrol automaton.');
            setGamePhase('gameover');
          }
        },
        onWardenAlert: (alert) => {
          setIsWardenAlert(alert);
        },
        onNearbyInteractable: (item) => {
          setNearbyItem(item);
        },
      });

      worldRef.current = world;

      return () => {
        world.dispose();
        worldRef.current = null;
      };
    }
  }, [gamePhase]);

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-100 overflow-hidden select-none font-sans">
      {gamePhase === 'title' && (
        <TitleScreen onStartGame={() => setGamePhase('workshop')} isMuted={isMuted} onToggleMute={handleToggleMute} />
      )}

      {gamePhase === 'workshop' && (
        <WorkshopHub profile={profile} setProfile={setProfile} onStartExpedition={handleStartExpedition} />
      )}

      {gamePhase === 'expedition' && expedition && (
        <div className="relative w-full h-full">
          <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full" />
          <ExpeditionHUD
            expedition={expedition}
            playerHp={playerHp}
            isWardenAlert={isWardenAlert}
            nearbyInteractableName={nearbyItem ? (nearbyItem.type === 'loot' ? nearbyItem.data.name : 'Extraction Beacon') : null}
            onInteractPrompt={nearbyItem ? 'E' : ''}
          />
        </div>
      )}

      {gamePhase === 'debrief' && expedition && (
        <DebriefModal expedition={expedition} onReturnToWorkshop={() => setGamePhase('workshop')} />
      )}

      {gamePhase === 'gameover' && (
        <GameOverModal reason={gameOverReason} onReturnToWorkshop={() => setGamePhase('workshop')} />
      )}
    </div>
  );
}

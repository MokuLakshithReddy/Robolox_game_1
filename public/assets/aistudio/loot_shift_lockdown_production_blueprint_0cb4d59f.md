# LOOT SHIFT: LOCKDOWN
## End-to-End Game Design, Technical Architecture, and Production Execution Blueprint

**Document type:** Game Design Document (GDD) + Technical Design Document (TDD) + Production Plan  
**Version:** 1.0  
**Date:** 30 October 2026  
**Platform:** Roblox (PC, mobile, and controller where practical)  
**Engine / language:** Roblox Studio and Luau  
**Status:** Proposed production specification; all balance values are initial hypotheses to validate with playtests  
**Working title:** *LOOT SHIFT: LOCKDOWN* (check name availability and trademark conflicts before public release)

---

## 0. How to Use This Document

This document is the source of truth for the first production version. Use it to guide design, implementation, testing, and release. Do not attempt to build every future feature before the minimum viable game is fun.

### Rules for the development team or coding agent

1. Build in the phase order in Section 20. Do not skip acceptance gates.
2. Keep a short decision log when a design change affects gameplay, saved data, security, UI, or scope.
3. Do not invent game rules that conflict with this document. Flag unclear or contradictory requirements before coding.
4. Implement one complete vertical slice before making multiple systems in parallel.
5. Keep all important gameplay decisions and persistent rewards server-authoritative. The client requests actions; the server validates and commits them.
6. Every non-trivial change must include a test plan and a regression check.
7. Never treat a successful Studio launch as proof of production readiness. Test multiple clients, save/load, edge cases, low-end devices, and live configuration.
8. Use original or appropriately licensed models, meshes, images, animations, sounds, fonts, and other assets. Do not copy another game's map, icon, brand, UI, or proprietary assets.
9. Keep the first release small. New features must justify their effect on fun, retention, production cost, reliability, and maintenance.
10. Do not place secrets, API keys, private credentials, or trusted economy logic in replicated/client-visible code.

### Product status vocabulary

- **MVP / Launch 0.1:** The smallest complete game that can be tested by real players.
- **P1:** A follow-up feature that may be added after the core loop passes validation.
- **Later:** Deliberately excluded until the game has evidence of retention and a stable technical foundation.
- **Acceptance gate:** A measurable condition that must pass before the project advances.

---

# 1. Executive Summary

*LOOT SHIFT: LOCKDOWN* is a 1–4 player cooperative salvage-extraction simulator. Players own a small workshop on the edge of an abandoned city. They enter a compact district, scavenge equipment and unusual artifacts, deal with environmental hazards and a roaming threat, then decide whether to extract safely or risk another search for better loot. Successfully extracted loot becomes persistent progress: credits, crafting materials, permanent collection discoveries, and workshop upgrades.

The key tension is simple: **leave now and keep what you found, or stay longer for a chance at something better.**

The game is designed around a short, repeatable expedition loop rather than a giant open world. The initial release should be small enough for a solo developer or small team to complete and maintain, but structured so new districts, enemy variants, events, artifacts, and cosmetics can be added later.

### One-sentence pitch

> Scavenge an abandoned city with friends, beat the lockdown, and decide how much loot you are willing to risk for one more discovery.

### Product goals

- Make the core activity understandable within the first minute.
- Let a new player reach an interesting decision within the first few minutes.
- Make a typical expedition last approximately 6–10 minutes after the player understands the game.
- Make solo play viable while making cooperation useful and rewarding.
- Create visible long-term goals through a collection catalog and workshop upgrades.
- Avoid permanent loss of previously banked progression.
- Support mobile devices early instead of treating mobile compatibility as a late-stage patch.
- Launch with a reliable small experience, then expand based on player behavior and feedback.

### Non-goals for Launch 0.1

Do **not** build these into the first release:

- A huge seamless open world.
- Multiple separate places, a custom matchmaking service, or a complex party backend.
- Player-to-player trading, auctions, or an economy dependent on real-time markets.
- Paid random loot boxes, paid spins, or purchases that alter random-reward odds.
- PvP combat, guilds, clans, complex crafting trees, pets, mounts, or hundreds of collectible variants.
- Runtime generative AI or AI chat characters.
- A large narrative campaign, cutscene-heavy tutorial, or extensive voice acting.
- Multiple enemy species before the first enemy is fun and reliable.

---

# 2. Product Positioning and Design Pillars

## 2.1 Audience hypothesis

Design for Roblox players who enjoy collecting, upgrading, exploring, light horror/suspense, and playing with friends. The intended tone is mysterious and adventurous, not graphic or intensely realistic. This is a design target, not a claim about the precise demographics of the market.

## 2.2 Design pillars

### Pillar A — Risk you understand
Players should always have enough information to make an informed decision. A siren, warning lights, environmental changes, map signage, and a readable timer communicate that danger is increasing. Surprises may occur, but avoid arbitrary unavoidable losses.

### Pillar B — A meaningful discovery
Every expedition should offer a chance to find something useful, unusual, or visually memorable. Ordinary salvage funds upgrades; artifacts build collection progress and create stories.

### Pillar C — One more room
The player should regularly face the decision to extract now or search one more location. Risk should rise with time and location depth, not through hidden manipulation.

### Pillar D — Socially better, individually fair
Cooperation should help: teammates can share information, revive downed players, activate equipment, and cover each other. A teammate must not be able to steal or delete another player's personal haul.

### Pillar E — Fail forward
A failed expedition can cost the unbanked haul from that expedition, but must not delete previously saved credits, permanent upgrades, unlocked tools, or registered collection discoveries.

### Pillar F — Readable on small screens
Important information must be legible on phone-sized displays. Do not rely exclusively on tiny text, detailed minimap icons, color alone, or long tooltips.

## 2.3 Differentiation

The game combines three established gameplay patterns—simulation-style upgrades, collection, and co-op survival/extraction. Those patterns are not themselves unique. The intended identity must come from the specific lockdown rhythm, the artifact-repair fantasy, the workshop presentation, distinctive hazards, and memorable co-op decisions. Do not market the game as wholly unprecedented.

---

# 3. How to Play: Player-Facing Rules

This section is the source for the tutorial, help screen, store page description, and player-facing prompts.

## 3.1 The basic objective

1. Start in your salvage workshop.
2. Check the current contract and choose your starter equipment.
3. Enter the city district with up to three other players.
4. Search containers, rooms, rooftops, and marked points of interest for salvage and artifacts.
5. Avoid or outsmart the roaming threat and changing hazards.
6. Return to the extraction point before the lockdown timer ends.
7. Extract to keep your expedition haul.
8. Spend earned credits on permanent upgrades and use recovered artifacts to progress your collection.
9. Repeat with better equipment and access to more dangerous opportunities.

## 3.2 Expedition timeline

The figures below are starting tuning targets. Adjust them through playtests; they are not promises to players until implemented.

| Stage | Target duration | What happens |
|---|---:|---|
| Preparation | 30–60 seconds | Contract, starter kit, party readiness, objective reminder |
| Initial scavenging | 0–2 minutes | Lower-risk rooms, common salvage, first loot decision |
| Rising threat | 2–5 minutes | More valuable locations become accessible; hazards become more likely |
| Lockdown warning | Around minute 5 | Siren, visual warning, clear countdown and extraction route |
| Final extraction window | Around 5–8 minutes | Danger increases; players decide whether to leave or continue |
| Debrief | 15–30 seconds | Results, secured haul, collection discoveries, upgrade prompt |

A player should not be forced to wait through a long lobby countdown. Start promptly when one player or a party is ready, while allowing a short window for additional players to join before the expedition begins.

## 3.3 Controls

Controls must be remappable where Roblox/platform facilities allow and must be displayed contextually.

| Action | Keyboard/mouse target | Mobile target | Controller target |
|---|---|---|---|
| Move | WASD | Left virtual stick | Left stick |
| Camera | Mouse | Right-side swipe | Right stick |
| Interact / loot | E or contextual prompt | Large contextual button | Contextual button |
| Sprint | Shift / toggle option | Sprint button or double-stick behavior only if clear | Left stick click or mapped button |
| Use gadget | 1 / Q or one dedicated key | Dedicated gadget button | Dedicated mapped button |
| View objectives | Tab / UI button | Objective icon | Menu/view button |
| Open inventory | I / UI button | Inventory icon | Menu/view button |

**Mobile rule:** Essential actions cannot depend on keyboard shortcuts. Do not place interact, sprint, gadget, and jump controls so close that they are commonly mis-tapped. Use Roblox's platform input detection and test with touch controls enabled.

## 3.4 Death, downing, and losing loot

- Players can be **downed** by the threat or a hazard.
- A teammate can revive a downed player by holding the revive interaction for an initial tuning target of 4 seconds.
- A revive is interrupted if the rescuer moves too far away or is hit.
- A solo player, or a player not revived before the downed timer ends, returns to the workshop.
- If a player fails to extract, they lose only that expedition's unbanked haul.
- Previously banked credits, owned upgrades, permanent catalog discoveries, and cosmetic ownership are never lost due to expedition failure.
- A player who reaches extraction banks their own haul; they cannot bank, confiscate, or delete another player's haul.
- The player receives clear warnings before entering a high-risk area and before the final extraction timer expires.

These are launch rules. Do not add permanent equipment destruction or wipes to increase tension.

---

# 4. Core Game Loop and State Model

## 4.1 Core loop

**Workshop → Loadout → Explore → Scavenge → Threat escalates → Decide → Extract or fail → Debrief → Upgrade → Repeat**

The loop must be fun even if the player ignores optional contracts. Contracts support the loop; they must not be required to understand it.

## 4.2 Server state machine

Use a single server-authoritative expedition state machine for Launch 0.1:

1. `Hub` — players can inspect upgrades, collection, and contracts.
2. `Preparing` — the server confirms players and equipment; a short countdown runs.
3. `ExpeditionActive` — players can explore, collect expedition loot, and trigger interactions.
4. `LockdownWarning` — warning audio/visuals activate and a final timer starts.
5. `ExtractionOpen` — extraction can be activated; successful players are marked extracted.
6. `ExpeditionResolved` — any remaining unextracted player is resolved as failed; the server freezes reward-changing interactions.
7. `Debrief` — results are shown and saved profile changes are processed.
8. `Hub` — reset run state and prepare the next expedition.

Only the server can change the authoritative state. The client receives state updates and presents UI. Do not let a client claim that an expedition started, an extraction succeeded, or rewards were banked.

## 4.3 State invariants

- A player can only collect expedition loot while the server state permits scavenging.
- An item instance can be collected at most once per expedition.
- A player can extract at most once per expedition.
- A player who has extracted cannot continue collecting in the same expedition.
- A resolved expedition cannot award new loot.
- A profile reward is committed at most once for each expedition resolution, even if an event is received twice.
- Server restarts and duplicate requests must not duplicate permanent rewards.

## 4.4 Solo and co-op behavior

The server supports 1–4 players. Solo is a first-class supported mode, not an unsupported edge case. Enemy health, hazard pressure, and required simultaneous interactions should not make solo play impossible. For the MVP, tune the same map with a simpler solo pressure curve rather than building separate content.

A server is one crew/run in Launch 0.1. Players joining after the expedition starts wait safely in the workshop for the next cycle. This avoids late-join state complexity. A separate lobby and reserved expedition servers can be considered later if concurrent parties become a proven need.

---

# 5. World, Environment, and Level Design

## 5.1 Setting

An abandoned industrial district has been partially evacuated after repeated power failures and unexplained lockdown events. The player is a salvage contractor operating from a small workshop just outside the restricted zone. The atmosphere should feel strange and adventurous without graphic violence.

Avoid a long introductory story. Communicate the premise through the first siren, warning signage, environmental storytelling, and a short objective card.

## 5.2 Launch map: The Old Market District

Build one small, legible map with a hub workshop and one expedition district.

### Required spaces

1. **Workshop hub:** loadout, upgrade bench, collection board, contract board, result spawn point.
2. **Street loop:** the principal navigation route, large landmarks, visible line toward extraction.
3. **Market building:** multiple rooms with low-risk loot.
4. **Power station:** a riskier location that can be temporarily powered to reveal or unlock a route.
5. **Transit tunnel:** narrow route with stronger atmosphere and a hazard cue.
6. **Rooftop or elevated shortcut:** optional route that saves time but has limited visibility.
7. **Extraction zone:** unmistakable beacon/door/vehicle with a clear interaction boundary and countdown feedback.
8. **Safe-ish landmark:** a temporary retreat point, not an exploit that permanently avoids the threat.

### Level-design rules

- A first-time player must be able to orient themselves with 2–3 large landmarks.
- Always provide more than one route back to extraction when feasible.
- Every risky room needs a readable reason to enter: a better loot pool, contract objective, shortcut, or meaningful information.
- Use lighting and sound to communicate danger. Do not hide essential interactable objects in near-black conditions.
- Avoid long empty corridors, large areas with no decision, and maze-like layout that forces players to open a map constantly.
- Include safe respawn boundaries and anti-fall protection during early testing.
- Loot locations should be data-driven and tagged, not hard-coded across many scripts.

## 5.3 Expedition randomization

For the MVP, randomize content in bounded ways:

- Choose a subset of predefined loot spawn points.
- Select one primary hazard and optionally one secondary modifier.
- Vary which optional room is powered or accessible.
- Choose one of several enemy patrol routes.

Do not procedurally generate the entire map at launch. Deterministic layouts make navigation, testing, performance, and balancing easier. Use a server-generated run seed for debugging and QA reproducibility.

---

# 6. Loot, Inventory, Artifacts, and Economy

## 6.1 Separate temporary haul from persistent ownership

There are two data layers:

**Expedition haul (temporary):** items collected during the active run but not yet extracted. If the player fails to extract, this haul is lost.

**Profile inventory (persistent):** banked credits/materials, purchased upgrades, catalog discoveries, cosmetics, statistics, and settings. This survives disconnection and future sessions.

Never let a local client write directly to persistent ownership. The server validates extraction and commits the relevant rewards.

## 6.2 Item categories

| Category | Examples | Purpose | MVP behavior |
|---|---|---|---|
| Scrap | Metal pieces, wiring, fasteners | Basic economy | Stack and sell/bank on extraction |
| Components | Circuit board, battery cell | Higher-value economy and contract progress | Stack in limited quantities |
| Artifacts | Signal lens, cracked compass, echo cassette | Rare discovery and collection | One slot each; register discovery after extraction |
| Mission evidence | Fuse, access key, signal recorder | Unlock or complete a run objective | Temporary; not tradeable |
| Utility supplies | Flare, medkit, battery | Tactical decisions | Limited; server controls use count |
| Cosmetics | Workshop decals, lighting, tool skins | Expression | Persistent; no gameplay advantage |

## 6.3 Inventory rules

Initial tuning target:

- 8 carry slots with the starter loadout.
- Stackable salvage uses one slot per item type, up to a configured stack cap; start with 10 per stack.
- Artifacts and mission evidence each consume a slot.
- Upgrades may increase capacity only through earned progression during MVP.
- Never accept a quantity from the client. The server selects the item and quantity from the authoritative loot definition.
- UI must show the slot cost and a clear full-inventory message.
- If the bag is full, the player can leave an item where it is or replace an item through a deliberate confirmation flow; no silent deletion.

Validate the slot/stack model in playtests. Do not add weight, durability, encumbrance, sorting grids, and multiple bag types all at once.

## 6.4 Proposed initial rarity weights

These are tuning hypotheses for ordinary world loot—not paid loot boxes. A given location should use its own approved loot table rather than blindly applying a global probability.

| Rarity | Initial weight in a general loot table | Intended role |
|---|---:|---|
| Common | 60% | Frequent, useful basic salvage |
| Uncommon | 25% | Noticeable improvement over basic haul |
| Rare | 10% | Exciting discovery that can fund upgrades |
| Epic | 4% | Memorable, clearly signaled item |
| Anomalous | 1% | Very rare discovery with a distinctive visual/audio cue |

Before release, verify the weights with simulation and player testing. Do not imply these probabilities apply to every container, room, contract, or hazard unless that is actually true. If the distribution changes, update any probability disclosure that applies to a paid randomized system. The MVP should not sell randomized rewards.

## 6.5 Initial economy values

All figures are provisional balance values to start internal testing. Rebalance with actual session data.

| Item or upgrade | Initial value | Design intent |
|---|---:|---|
| Scrap bundle | 5 credits | Common baseline value |
| Circuit component | 15 credits | Mid-tier value |
| Recovered artifact sale | 50–100 credits | Meaningful bonus; value depends on item |
| Satchel I | 300 credits | First visible upgrade within a few successful runs |
| Satchel II | 700 credits | Mid-term carry-capacity goal |
| Satchel III | 1,500 credits | Longer-term capacity goal |
| Scanner I | 400 credits | Gives occasional nearby loot hints |
| Scanner II | 900 credits | Improves scan usefulness, not loot quality |
| Workshop cosmetic | 150–800 credits | Optional personal expression |

### Economy targets to test

- A successful early run should usually produce enough value to make the next run feel worthwhile.
- The first meaningful upgrade should be achievable after approximately 2–4 successful beginner runs, subject to actual playtest length and loot outcomes.
- A failed run must feel disappointing but not make the player restart the game.
- Players should have a useful free path to every core gameplay capability.
- Credit sources and sinks should be tracked by item and system so inflation or grind walls can be diagnosed.

## 6.6 Collection catalog

The collection is a permanent record of artifacts successfully extracted at least once.

Each catalog entry shows:

- Artifact name and image/silhouette.
- First discovery status and count of duplicates recovered.
- Short lore description.
- Optional set name or district of origin.
- Whether the artifact has a practical recipe use in a future version.

Do not remove an unlocked catalog discovery when the player sells a duplicate. A player's permanent collection must not be confused with the temporary haul. Avoid an excessive number of variants before the base collection loop has been tested.

## 6.7 Upgrade design

Launch with a small, comprehensible set of non-random, earnable upgrades:

1. **Reinforced Satchel:** increases carry slots.
2. **Signal Scanner:** gives a limited, short-range hint toward nearby loot. It does not reveal all loot through walls.
3. **Improved Flashlight:** increases useful visibility without making darkness irrelevant.
4. **Utility Boots:** modest stamina/recovery improvement, if stamina proves fun in tests.
5. **Workshop Display Shelf:** cosmetic space for collection presentation; no combat benefit.

Every upgrade must state its exact effect before purchase. Avoid flat upgrades that render the early game meaningless. Revisit upgrade costs using actual time-to-purchase and abandonment data.

---

# 7. Threats, Hazards, and Expedition Events

## 7.1 First enemy: The Warden

The Warden is a single roaming mechanical/unknown presence that discourages reckless looting. It should be readable, counterable, and visually original.

### AI states

1. `Patrol` — moves between server-defined waypoints.
2. `Investigate` — moves toward a recent noise or suspicious location.
3. `Detect` — confirms line of sight or other valid detection criteria.
4. `Chase` — pursues a valid target within configured limits.
5. `Search` — checks the last seen area after losing the player.
6. `Attack` — performs a telegraphed, avoidable attack within range and cooldown.
7. `Disengage` — returns to a patrol/search loop when the target is unreachable for a defined time.
8. `Stunned/Repelled` — reacts to a limited utility item, if the design grants that counterplay.

### AI requirements

- The server is authoritative for target choice, state transitions, damage, and cooldowns.
- The enemy must not teleport directly onto a player as a surprise difficulty mechanic.
- Use navigation/pathfinding conservatively; recompute paths when needed rather than every frame.
- If navigation fails, use a bounded fallback and recover instead of getting stuck forever.
- Add clear cues before an attack: sound, animation, light, or body movement.
- Avoid perfect tracking through walls. Suspense requires uncertainty, but players need plausible counterplay.
- Add a server-side maximum chase duration/distance so the enemy cannot follow one player infinitely.
- Support solo tuning and test network ownership implications for NPC movement.

## 7.2 MVP hazards

### Blackout
Lights and powered doors change state. The player has to use a flashlight or follow emergency strips. Do not make all navigation impossible.

### Toxic fog
Certain streets or rooms become dangerous after a warning. Mark the affected area visually and provide a route around it. Damage should be periodic and server-authoritative.

### Power surge
A circuit may temporarily power a high-value room or open a route while also attracting the Warden. The benefit and risk must both be communicated.

Only one main hazard needs to run in the first prototype. Add the others after the expedition and extraction loop is stable.

## 7.3 Event selection rules

- Pick events on the server using a run seed.
- Respect cooldowns and avoid unfair combinations.
- Do not spawn a hazard directly on top of a player without a warning or escape opportunity.
- Record event ID, start/end time, player location region, and run outcome for debugging and balance analytics.
- Keep the event schedule readable. A warning sound should mean something consistent.

---

# 8. Objectives, Contracts, and Replayability

## 8.1 Optional contracts

Each run may offer one primary contract plus a simple personal bonus objective. Examples:

- Recover two circuit components from the Power Station.
- Find and extract one artifact.
- Restore power to the transit gate, then extract.
- Reach a marked cache and return with any loot.

A contract must not require a rare drop unless the contract tells the player what they are signing up for. Do not force players to complete every optional objective before extraction.

## 8.2 Contract rewards

Contracts grant a fixed, visible bonus on successful completion. They must not secretly alter normal loot odds. If a contract can be completed but the player fails to extract, make the reward rule explicit—recommended default: no contract reward is banked unless the player extracts.

## 8.3 Repeat-play goals

MVP replayability comes from:

- A different combination of loot spawns and hazards each run.
- Collectible artifacts with a permanent catalog.
- Workshop upgrades.
- Optional contracts.
- Improving route knowledge and teamwork.

P1 candidates, only after validation: additional district, second enemy type, rare multi-step contract, weekly community goal, leaderboards for non-pay-to-win statistics, seasonal cosmetic collection. Never add a daily reward system just to manufacture notifications; it should add genuine value and remain respectful of players' time.

---

# 9. User Interface and User Experience

## 9.1 UI principles

- Show the immediate goal first; detail can be opened on demand.
- Use icons plus text for critical meanings; do not rely on color alone.
- Keep loot value, bag capacity, hazard warnings, and extraction status visible during an expedition.
- Use concise prompts such as “Hold E to Search” rather than unexplained icons.
- Confirm purchases, selling rare items, and irreversible choices.
- Avoid UI that blocks the center of the screen during combat or navigation.
- Provide subtitles/captions for important voice-like cues or use a visual cue in addition to audio.
- Respect device safe areas and touch hit target sizes.

## 9.2 Required screens

### Workshop HUD
- Current player credits.
- Start/ready expedition button.
- Current contract card.
- Upgrade bench and collection board interactions.
- Clear indication that the player is in a safe hub.

### Expedition HUD
- Current objective and contract progress.
- Remaining lockdown time once the warning phase starts.
- Carry slots (e.g., 5/8).
- Current unbanked haul estimate (avoid showing fake exact values if values are still uncertain).
- Health/downed state and utility count.
- Extraction direction indicator when extraction is available.
- Small, non-blocking notifications for discoveries and teammate status.

### Loot interaction
- Item name, rarity, stack effect, slot cost, and whether the bag has room.
- Short hold interaction or clear tap/click interaction.
- No silent collection of a rare item when the player is already full.

### Extraction UI
- “Extraction available” state.
- Clear distance/range feedback.
- Activation interaction and countdown.
- Warning if the player is inside the area but not registered as extracted.
- Final result per player: extracted or lost haul.

### Debrief
- Items secured and total credits earned.
- Artifacts discovered for the permanent catalog.
- Contract bonus, if earned.
- Failure explanation if the run failed.
- One clear next action: upgrade, view collection, or start next run.

### Upgrade shop
- Current level, exact effect, next effect, cost, and purchase status.
- Server-confirmed success/failure message.
- No optimistic permanent purchase display until server acknowledgement.

### Settings
- Music, effects, ambience volume.
- Camera sensitivity (where practical).
- Screen shake toggle or reduced-motion option.
- Hold/toggle preference for relevant actions where feasible.
- HUD scale options where feasible.

## 9.3 First-session onboarding

Do not use a long tutorial room. Within the opening minutes:

1. Show one short objective card: “Find salvage. Watch for the siren. Extract to keep it.”
2. Place a low-risk container near the entrance.
3. Use a contextual prompt to teach searching.
4. Give a visible example of the bag filling.
5. Trigger a warning cue before the first lockdown.
6. Highlight the extraction route.
7. Debrief and show the workshop upgrade path.

Every tutorial step should be skippable or naturally learned. Tutorial completion must not be a barrier to playing with friends.

---

# 10. Multiplayer, Social Design, and Edge Cases

## 10.1 Party format

- Maximum crew size for Launch 0.1: 4 players.
- The server runs one shared expedition cycle.
- Players can play solo.
- Players who join during an active run stay in the hub and join the next cycle.
- If a player disconnects, their own unbanked haul is not awarded to another player.
- The run continues if a player leaves; do not require every player to remain connected.

## 10.2 Cooperative interactions

MVP cooperation should be limited and polished:

- Revive a downed teammate.
- Call out discoveries through built-in Roblox social communication rather than introducing a custom arbitrary text system.
- One player can activate a switch while another accesses the newly powered path, if the level design supports this.
- Players may take different routes and meet at extraction.

Do not add friendly fire, loot theft, forced party ownership, or vote-kick systems in the MVP.

## 10.3 Anti-griefing requirements

- A player cannot remove or alter another player's persistent inventory.
- A player cannot trigger extraction in a way that immediately banks another player's haul without that player's own eligibility check.
- Revive actions have server-validated range and duration.
- Critical doors and switches must have cooldowns and valid state requirements.
- Do not let one player permanently block the extraction boundary with their character or props.
- All interactions must remain usable if one player disconnects mid-action.

## 10.4 Player safety and moderation

Use Roblox's built-in communication and moderation facilities wherever possible. Do not add free-form drawing, user-uploaded media, external links, a custom chat, or player trading to the first version. Provide a short in-game feedback route using Roblox-appropriate mechanisms, and respond to abuse reports according to platform requirements.

---

# 11. Technical Architecture (Roblox Studio / Luau)

## 11.1 Architecture principle

The server owns state. Clients own presentation and input. Shared modules contain only definitions both sides are allowed to know. Never rely on a LocalScript to award currency, decide loot, approve a purchase, validate a revive, or declare extraction success.

## 11.2 Suggested project hierarchy

Use Roblox Studio folders and ModuleScripts in a consistent structure. The exact tree may adapt to a chosen source-control workflow, but responsibilities must remain separated.

```text
ReplicatedStorage/
  Shared/
    Types.lua
    Constants.lua
    ItemDefinitions.lua          -- display-safe definitions only
    UpgradeDefinitions.lua       -- display-safe definitions only
    RemoteNames.lua
  Remotes/
    RequestInteract             -- client -> server
    RequestEquip                -- client -> server
    RequestUpgrade              -- client -> server
    RequestUseGadget            -- client -> server
    StateChanged                -- server -> client
    Notification                -- server -> client
    ProfileSnapshot             -- server -> owning client

ServerScriptService/
  Bootstrap.server.lua
  Services/
    ExpeditionService.lua
    LootService.lua
    ExtractionService.lua
    EnemyService.lua
    HazardService.lua
    InventoryService.lua
    EconomyService.lua
    UpgradeService.lua
    ContractService.lua
    ProfilePersistenceService.lua
    AnalyticsService.lua
    RateLimitService.lua
    ModerationService.lua        -- only if moderation/admin tools are added
  Domain/
    ItemCatalog.lua              -- server-authoritative item values
    EconomyRules.lua
    ExpeditionRules.lua
    Validation.lua
  Tests/
    Unit/
    Integration/

ServerStorage/
  MapAssets/
  EnemyAssets/
  LootAssets/
  ServerOnlyDefinitions/

StarterPlayer/
  StarterPlayerScripts/
    Controllers/
      InputController.client.lua
      HUDController.client.lua
      InteractionController.client.lua
      AudioController.client.lua
      SettingsController.client.lua

StarterGui/
  HUD/
  WorkshopUI/
  ExpeditionUI/
  DebriefUI/
  UpgradeUI/
  SettingsUI/

Workspace/
  Workshop/
  ExpeditionMap/
  SpawnPoints/
  LootSpawnPoints/
  EnemyWaypoints/
  ExtractionZone/
  HazardZones/
```

**Important:** This is a responsibility map, not permission to create every file as empty scaffolding. Add files only when the corresponding system is implemented and tested. Keep the replicated container lean; do not place server secrets or authoritative prices where every client can inspect them.

## 11.3 Module responsibilities

### `ExpeditionService`
Owns the server state machine, run ID/seed, phase transitions, timers, join policy, and run resolution. It calls domain services but should not contain every item/economy detail.

### `LootService`
Owns loot spawn selection, loot instance lifecycle, item eligibility, collection validation, and temporary haul additions. It ensures a loot instance can be collected once.

### `ExtractionService`
Owns extraction activation, range checks, extracted state, countdown, and per-player success/failure resolution. It passes a validated reward package to persistence/economy code only once.

### `InventoryService`
Owns the temporary carry inventory and persistent item/currency changes through well-defined interfaces. It checks capacity, stack caps, item definitions, and item ownership.

### `EconomyService`
Owns credit sources/sinks and validated transactions. Client requests never provide authoritative prices or rewards.

### `UpgradeService`
Owns upgrade purchase requirements and level validation. A purchase is a server-side transaction: verify profile loaded, check price and maximum level, subtract credits, apply level, then persist/update the client.

### `EnemyService`
Owns enemy AI state, detection, pathing, attack timing, and damage validation. Use bounded updates, not an unthrottled expensive loop per enemy.

### `HazardService`
Owns event selection and hazard timing, zones, cues, and damage. It receives validated phase information from `ExpeditionService`.

### `ContractService`
Owns contract selection, objective progress, completion conditions, and reward eligibility. Progress should be updated from authoritative game events, not client claims.

### `ProfilePersistenceService`
Owns load, validate, migrate, autosave, save-on-exit, shutdown save, duplicate-session handling, and error handling. Do not let random game modules write directly to DataStoreService.

### `AnalyticsService`
Owns named event instrumentation. It should never block the main gameplay loop waiting for optional analytics.

### `RateLimitService`
Provides per-player and per-action request throttling. It complements validation; it does not replace it.

## 11.4 Data definition approach

Keep tunable data such as item values, upgrade costs, hazard timings, rarity weights, and enemy settings in centralized definitions. Use stable string IDs, not display names, as identifiers. Validate at server startup that referenced IDs exist, values are within safe bounds, and configuration tables do not contain duplicates.

Do not duplicate the same cost or effect across UI scripts, shop scripts, and economy scripts. The UI can display a safe replicated description, but the server uses authoritative values.

## 11.5 Code quality requirements

- Use Luau type annotations for service APIs and shared data structures where practical.
- Give every module one clear responsibility.
- Avoid giant scripts containing unrelated systems.
- Avoid circular module dependencies.
- Avoid `while true do` loops without bounded waits, a shutdown condition, or a clear lifecycle.
- Disconnect event connections and destroy temporary instances when a run ends.
- Avoid trusting object names alone; validate tags, parent, state, distance, and server-known identity.
- Emit actionable warnings for recoverable errors. Do not silently swallow persistence or reward errors.
- Do not log sensitive data or flood output with per-frame logs.
- Keep display strings separate from stable IDs to support localization later.

---

# 12. Remote Events and Security Contract

Every client-to-server remote is an untrusted request. The client can be modified, fire a remote repeatedly, send malformed values, or claim impossible state. The server must validate type, size, context, permission, distance, cooldown, and rate limits before changing the game.

## 12.1 Remote contract table

| Remote | Client request contents | Server validation | Never accept from client |
|---|---|---|---|
| `RequestInteract` | Stable target ID, action ID | Target exists, current phase permits action, player alive/not extracted, distance, target state, cooldown | Reward amount, chosen rarity, arbitrary target instance from client without validation |
| `RequestEquip` | Equipment ID | Item owned/unlocked, valid slot, hub or permitted state | Arbitrary stats or asset IDs |
| `RequestUpgrade` | Upgrade ID | Profile loaded, current level, credits, price from server definition, valid phase | Price, level to apply, credit balance |
| `RequestUseGadget` | Gadget ID and optional target ID | Gadget owned/in stock, cooldown, action valid, range/line-of-sight as relevant | Damage, duration, effect strength, item count to consume |
| `RequestReady` | Ready/unready boolean | Player connected, phase is `Preparing`, valid boolean, rate limit | Run start time or run seed |
| `RequestSettings` | Allowlisted setting and bounded value | Setting exists and value within permitted range | Arbitrary profile fields |

Server-to-client remotes send presentation data only. A client notification is not proof that a transaction was saved. For every persistent transaction, the client receives a success/failure result only after the server has accepted the change and its persistence policy is satisfied.

## 12.2 Validation checklist

Before processing any request:

1. Validate the player's current server-owned state.
2. Validate argument types, string lengths, enumerated IDs, and table size.
3. Reject unknown fields rather than copying arbitrary client tables into game state.
4. Confirm target ownership/permission and distance on the server.
5. Confirm the current phase allows the action.
6. Apply per-player and per-action rate limits.
7. Check relevant cooldown, inventory, currency, and action state.
8. Apply state change atomically where practical; prevent duplicate processing.
9. Return a safe result without leaking private server state.
10. Log unusual patterns on the server with bounded logging.

## 12.3 Abuse scenarios to test

- Claiming an item from across the map.
- Sending an arbitrary item ID or impossible quantity.
- Requesting multiple pickups for one loot object.
- Firing upgrade requests rapidly to buy without paying.
- Requesting an upgrade while the profile is still loading.
- Calling extraction repeatedly to duplicate rewards.
- Claiming to be extracted without entering the extraction zone.
- Using a gadget while downed, dead, extracted, or in the hub if prohibited.
- Triggering remote events with malformed tables or huge strings.
- Firing one remote thousands of times in a short interval.
- Manipulating client UI or local values to show fake currency.
- Attempting to affect another player's inventory or profile.

Design the system so most of these attempts are harmlessly rejected, not so they depend on detecting and banning every exploiter. Server-side validation and rate limiting are the primary defense.

---

# 13. Persistence, Save Data, and Recovery

## 13.1 Persistent profile schema

Use a versioned profile schema. Example logical structure:

```lua
{
    schemaVersion = 1,
    credits = 0,
    materials = {},
    upgrades = {
        satchel = 0,
        scanner = 0,
        flashlight = 0,
        boots = 0,
    },
    collection = {},
    cosmetics = {},
    statistics = {
        runsStarted = 0,
        runsExtracted = 0,
        runsFailed = 0,
        artifactsExtracted = 0,
    },
    settings = {
        musicVolume = 0.7,
        effectsVolume = 0.8,
        reducedShake = false,
    },
}
```

The schema is illustrative. Define exact numeric ranges, optional fields, and allowed IDs in code. Do not save temporary enemy states, world instances, raw RemoteEvent payloads, or the current expedition haul as permanent inventory.

## 13.2 Save/load rules

- Use a single predictable per-player key in a small, fixed DataStore unless access patterns justify splitting the profile.
- Prefer `UpdateAsync()` when a write depends on current data or concurrent writers may exist.
- Wrap requests in `pcall()`, use bounded retries with exponential backoff and jitter for transient failures, and avoid retrying invalid operations indefinitely.
- Prevent two live servers from concurrently owning the same player's mutable profile. Use an audited, maintained session-locking/profile library or implement and test a clear lease/lock design before production. Do not ship naive independent autosaves from multiple servers.
- Autosave at a bounded interval and after meaningful transactions; avoid writing every time the player picks up common scrap.
- Save on player removal and server shutdown as a best-effort final save; do not rely on shutdown callbacks alone.
- On load failure, do not silently replace a player's existing save with a new blank profile. Retry safely, fail closed for persistent transactions, and show a clear user message where necessary.
- Normalize and validate loaded data before exposing it to gameplay code.
- Include a migration path when `schemaVersion` changes.
- Test save behavior with a dedicated test universe or staging experience, never against production player data.

## 13.3 Transaction handling

For a purchase or extraction reward:

1. Confirm the profile is loaded and owned by this server session.
2. Validate the transaction and calculate the delta from server-known rules.
3. Apply the state change through one authoritative profile path.
4. Assign a unique run/transaction ID so repeated events do not award duplicate rewards.
5. Persist using the chosen profile-save/session-lock strategy.
6. Update the client from authoritative server state.
7. If save results are uncertain, do not blindly retry the reward as a new transaction; reconcile against the transaction ID/profile state.

## 13.4 Data loss and recovery readiness

Before public release:

- Test malformed and older profile schemas.
- Test simulated DataStore throttling/failure in a safe test environment.
- Test disconnect during extraction, during purchase, and during saving.
- Test server shutdown with multiple profiles loaded.
- Verify that a failed save cannot give free permanent currency on reconnect.
- Keep an operational process for reporting, investigating, and manually correcting verified data-loss cases according to Roblox policies.

---

# 14. Analytics and Product Validation

Do not decide that the game is successful because the developer enjoys it or because one video performs well. Instrument the first session and inspect actual player behavior.

## 14.1 Required event names

Use a consistent event naming scheme, for example:

- `session_started`
- `tutorial_hint_shown`
- `first_loot_collected`
- `expedition_started`
- `hazard_triggered`
- `player_downed`
- `teammate_revived`
- `extraction_started`
- `player_extracted`
- `player_failed_to_extract`
- `expedition_resolved`
- `artifact_discovered`
- `upgrade_purchased`
- `contract_completed`
- `profile_load_failed`
- `profile_save_failed`

Follow Roblox's current analytics facilities and event payload limits. Do not include unnecessary personal or sensitive information in custom events.

## 14.2 Core metrics

| Metric | What it tells us | Product decision it informs |
|---|---|---|
| First meaningful action time | How quickly a new user starts playing | Simplify onboarding or spawn layout if too slow |
| Tutorial/first objective completion | Whether goals are understandable | Improve contextual prompts if players get stuck |
| First expedition completion | Whether a new player understands the loop | Reduce unclear hazards or improve extraction cues |
| Extract vs. fail rate | Whether risk is fair and understandable | Tune timing, enemy pressure, and route clarity |
| Second expedition start rate | Whether the loop motivates replay | Improve debrief, rewards, or upgrade visibility |
| D1/D7/D30 retention | Whether users return | Investigate experience quality before buying acquisition |
| Average session time | Whether sessions have meaningful activity | Identify dead time or frustrating barriers |
| Co-play / party behavior | Whether group play improves experience | Invest in better friend onboarding if it does |
| Upgrade purchase timing | Whether progression feels motivating | Tune reward economy and price curves |
| Crash/error/save-failure rates | Operational quality | Block release or roll back if reliability degrades |

## 14.3 Initial product hypotheses

These are hypotheses to test, not industry benchmarks:

- Players understand the primary objective without an external explanation.
- A new player reaches their first loot interaction quickly.
- Players can identify the lockdown warning and find extraction.
- A failed run does not cause most new users to immediately quit.
- Players who complete one run are motivated to try a second.
- Playing with friends is at least as understandable and fair as solo play.

Do not define success using one universal retention number. Compare the game to Roblox benchmarks for similar experiences when available, inspect cohorts, and interpret the data alongside qualitative playtest feedback.

---

# 15. Visual, Audio, and Asset Production Guidelines

## 15.1 Art direction

- Stylized, readable, low-to-mid complexity industrial environments.
- Strong visual landmarks and silhouette differences between streets, tunnels, and interiors.
- Distinctive colors for interactable objects, hazard boundaries, and extraction signals, paired with icons or shapes so color is not the only cue.
- Artifacts should have memorable silhouettes and small visual details that make discoveries feel special.
- The workshop should become visibly more personal as players upgrade it.
- Avoid photorealistic gore, excessive graphic violence, and imagery that unnecessarily raises content-maturity requirements.

## 15.2 Asset provenance

Maintain an asset register with:

- Asset name and purpose.
- Creator/source and asset ID.
- License or permission basis.
- Whether it is original, licensed, public domain, or platform-provided.
- Modifications made.
- Any attribution or usage limitations.

Do not assume an asset found on the internet, in a video, or in another Roblox game is free to reuse. Audit free models before adding them; remove unexpected scripts, remotes, require calls, or unrelated content.

## 15.3 Audio direction

Audio must convey gameplay information rather than only atmosphere:

- A distinct lockdown siren that remains audible over ambience.
- Separate cues for loot discovery, rare artifact discovery, enemy detection, enemy attack wind-up, extraction activation, downed state, and successful extraction.
- Volume mixing so essential cues are not drowned out by music.
- User-facing volume controls and visual alternatives for critical information.
- Original or properly licensed sounds, tracked in the asset register.

## 15.4 Animation and effects

- Enemy attacks need clear wind-up and recovery.
- Pickup and extraction animations must remain short and must not lock controls longer than necessary.
- Particles and lights should be capped and budgeted for mobile.
- Avoid adding effects every frame without cleanup. Temporary objects and connections must be removed at the end of an event/run.

---

# 16. Performance, Reliability, and Device Support

## 16.1 Minimum performance approach

- Design the level for mobile from the start.
- Prefer modular, reusable geometry and sensible part counts.
- Enable and test instance streaming when appropriate for the map; test scripts against objects that may not be streamed to a client's current region.
- Keep `ReplicatedStorage` lean. Keep large models, server-only definitions, and content not required at join time outside replicated containers.
- Avoid expensive per-frame loops for AI, hazards, loot scanning, or UI updates. Use events, coarse intervals, and bounded work.
- Profile memory, join time, client frame rate, and server heartbeat using Roblox's performance tools.
- Test with realistic low-end mobile constraints, not just a high-powered desktop.
- Clean up all spawned loot, temporary hazards, effects, and AI connections at run end.

## 16.2 Device QA matrix

| Device class | Required tests |
|---|---|
| Low-end Android | Join time, touch controls, memory, text legibility, effects load |
| Mid-range Android/iOS | Full run, inventory, shop, extraction, audio cues |
| PC keyboard/mouse | Interaction reliability, camera, UI layout, performance |
| Gamepad/controller | Navigation, interaction, inventory and menu focus |
| Different aspect ratios | Safe areas, cut-off UI, scale, button reachability |
| Poor/variable network | Remote delay, disconnection, save/reconnect behavior, state resync |

## 16.3 Network behavior

- The server decides rewards and authoritative state changes.
- The client can predict non-critical UI effects but must reconcile to server results.
- Keep remote payloads small and send state deltas where sensible.
- Do not replicate every enemy/pathing detail if clients can interpolate presentation.
- Test two or more clients using Studio's multi-client server test, not only local solo play.

---

# 17. Monetization and Ethical Economy

## 17.1 Monetization strategy

Do not implement monetization before the core game is stable and tested. The first playable prototype should be entirely focused on fun, usability, and reliability.

If player response justifies it, begin with optional cosmetics and expression:

- Workshop themes and decoration sets.
- Flashlight/tool skins that do not change stats.
- Emotes and victory poses.
- Cosmetic extraction effects.
- Optional cosmetic bundles with exact contents shown before purchase.

Possible later options include one-time game passes for cosmetic/comfort features and developer products for clearly described, deterministic benefits. Review current Roblox terms, fees, and monetization APIs before implementation.

## 17.2 Fairness rules

- No paid loot boxes, paid spins, paid random boosts, or paid odds modifiers in the MVP.
- No artificial “only 3 left” inventory claims or misleading countdowns.
- No purchase prompt in the middle of a danger moment.
- No paid item that makes free players substantially worse at the core game.
- No pressure messaging that targets children or implies they must buy to keep up with friends.
- Show exact purchase contents, price, and effects before a purchase.
- Test purchase receipt handling and duplicate processing before any paid release.
- If any randomized virtual item is later purchasable directly or indirectly with Robux, review the latest paid-random-item policy, per-user `PolicyService` requirements, odds disclosures, and region restrictions before enabling it. Prefer not to add that system.

## 17.3 Platform economics

Do not forecast revenue from concurrent-player rank alone. The actual business outcome depends on acquisition, retention, payer conversion, spending, platform fees, eligibility, and the quality of the experience. Do not use speculative revenue projections as a reason to overbuild monetization.

---

# 18. Production Workflow and Source Control

## 18.1 Workflow options

- **Studio-first workflow:** Appropriate for a first project or mostly visual building. Use Roblox Studio's publishing/version history and keep a separate changelog and backup process.
- **Git/Rojo workflow:** Appropriate if code is written and reviewed externally or multiple developers/AI coding tools are involved. Use a reproducible project structure, source control, and a tested sync/build process. Keep `.rbxl`/`.rbxlx` and source representations organized without committing accidental secrets or huge generated artifacts.

Do not introduce Rojo, automated deployment, third-party packages, or CI solely for appearance. Use tools only when the team can maintain them. Regardless of workflow, keep source history and a recoverable build.

## 18.2 Branch/release discipline

- `main`: known-good state suitable for controlled release.
- Feature branch: one system/change at a time.
- Test/staging experience: safe environment for persistence and integration tests.
- Production experience: live player data; do not enable risky Studio data-store testing against it.

Before a production release, record the change summary, known issues, save-schema impact, rollback plan, and smoke-test results.

## 18.3 Third-party dependencies

For every external module/library, record its purpose, source URL, license, pinned version/commit, and maintenance/security review. Review the source before adoption. Remove unused dependencies. Do not paste in unknown free models or modules that execute hidden code.

---

# 19. QA Strategy and Release Tests

Testing is a production deliverable, not a final phase that can be skipped.

## 19.1 Unit tests

Test pure logic separately where practical:

- Inventory capacity and stack limits.
- Loot distribution and allowed item IDs.
- Upgrade requirements and price calculation.
- Expedition state transition legality.
- Contract completion conditions.
- Reward calculation and transaction deduplication.
- Profile validation and migration.
- Rate-limit behavior.

## 19.2 Integration tests

- Start a run, collect loot, extract, restart, verify saved profile.
- Start a run, collect loot, fail, verify only temporary haul is lost.
- Buy an upgrade, disconnect, reconnect, verify the upgrade and currency.
- Trigger a hazard during enemy chase and verify neither system soft-locks the round.
- Down/revive/extract with 2–4 clients.
- Disconnect the host-like first player; ensure the server remains coherent.
- Join while an expedition is active; verify safe waiting for next run.
- Trigger extraction twice and verify no duplicate rewards.
- Simulate save errors in staging and verify the player is not given a false success state.

## 19.3 Exploit-resistance tests

Run every abuse scenario in Section 12.3. Confirm the server rejects invalid requests without crashing or giving currency/items. Test repeated remotes, invalid IDs, extreme values, impossible distance, invalid phase, duplicate interactions, and spoofed target references.

## 19.4 Usability playtests

Test with people who have not seen the design document. Observe silently before explaining rules. Record:

- Time to first movement and first interaction.
- Whether the siren is noticed and understood.
- Whether players can find extraction without verbal hints.
- Why players extracted, stayed, failed, or quit.
- Whether upgrades are understandable and motivating.
- Whether solo players feel unfairly punished.
- Which items and rooms players ignore.

Do not ask only “Did you like it?” Ask what they thought the goal was, what they expected to happen, and where they felt confused.

## 19.5 Release smoke tests

After every candidate build:

- Join as a new account/profile.
- Join as a returning account with upgrades/catalog entries.
- Run one successful extraction.
- Run one failure.
- Make one upgrade purchase using earned currency.
- Confirm collection registration.
- Verify UI/audio on PC and mobile.
- Check output/server logs for new errors.
- Verify profile save/load and that the production experience uses the intended configuration.

---

# 20. End-to-End Production Roadmap

The roadmap is milestone-based rather than day-by-day. Do not advance because a date arrived; advance when the acceptance gate passes.

## Phase 0 — Preproduction and project setup

### Work
- Confirm working title and do a name/IP availability check.
- Create Roblox experience and a safe staging/test universe or equivalent isolated test environment.
- Confirm the project workflow (Studio-first or Git/Rojo).
- Create source-control/backup structure and decision log.
- Greybox the workshop and district with placeholder parts.
- Define stable item IDs, initial tunable values, and the state machine.
- Identify all platform policy requirements relevant to content and publication.

### Acceptance gate
- A written design and technical plan exists.
- The map can be navigated with basic character movement.
- The team can restore a previous known-good project version.
- No unreviewed third-party asset or script is present.

## Phase 1 — Core vertical slice

### Work
- Build one workshop, one district route, one loot object type, one extraction point.
- Implement the expedition state machine.
- Implement server-validated interaction and temporary haul.
- Implement a successful extraction and failed extraction.
- Show a basic debrief.
- Add a minimal HUD and clear contextual prompts.

### Acceptance gate
- A player can start, collect, extract, see the result, and start again.
- A player who fails loses only unbanked haul.
- Duplicate interaction/extraction requests cannot duplicate rewards.
- Two or more clients can complete the loop without desyncing authoritative rewards.

## Phase 2 — Persistence and upgrade loop

### Work
- Add versioned profiles, session ownership/locking, migration, autosave, shutdown handling, and recoverable failure behavior.
- Add credits and at least two upgrade levels.
- Add the artifact catalog.
- Add the purchase UI and server-side transaction handling.
- Add basic analytics events.

### Acceptance gate
- Successful extraction survives reconnect.
- Failure does not delete previously banked progress.
- Upgrade transactions are correct under repeated requests.
- Profile load/save failures do not silently reset existing user data.
- Test data is isolated from production data.

## Phase 3 — First full gameplay loop

### Work
- Add the Warden AI with patrol, investigate, chase, attack, search, and recovery states.
- Add downed/revive rules.
- Add one hazard, then additional hazards only after testing.
- Add a contract board and a small loot table.
- Complete the level landmarks, routes, and extraction cues.
- Add basic audio and visual feedback.

### Acceptance gate
- Players understand what causes danger and how to respond.
- The enemy can be avoided, disengages correctly, and cannot soft-lock the session.
- Solo and co-op runs are completable.
- No critical reward, save, or extraction duplication issue remains.

## Phase 4 — Usability, mobile, and content polish

### Work
- Complete the mobile controls and UI safe areas.
- Add clear tutorial hints, settings, sound hierarchy, and reduced screen-shake option.
- Improve the workshop's visual progression.
- Replace placeholder assets where their quality harms readability or theme.
- Add all required failure, full-inventory, and disconnection messages.
- Optimize load time, memory, server workload, and effects.

### Acceptance gate
- An unfamiliar tester can complete the first expedition with minimal coaching.
- Core actions are usable on mobile and keyboard/mouse.
- No major UI cutoffs or unreadable prompts remain on target test devices.
- Profiling reveals no known severe performance bottleneck.

## Phase 5 — Closed alpha and balance

### Work
- Invite a small group of testers.
- Run repeated solo, two-player, and four-player tests.
- Collect qualitative observations and analytics.
- Tune run duration, hazard warnings, inventory capacity, values, upgrade cost, and enemy pressure.
- Fix high-frequency confusion, exploits, soft locks, and save errors.

### Acceptance gate
- Core-loop bugs are triaged and no unresolved critical/high issue remains.
- Testers can explain the main loop without the developer's help.
- Extraction and persistence outcomes are consistently correct.
- First-session and replay hypotheses have measurable evidence, even if numbers are not yet strong.

## Phase 6 — Public beta readiness

### Work
- Complete the entire QA matrix.
- Audit assets and permissions.
- Review Roblox Community Standards, current publication requirements, content maturity/compliance questionnaire, privacy, and monetization configuration.
- Add store page icon, thumbnails, description, accurate genre, and short gameplay clip.
- Confirm name availability and brand consistency.
- Write known-issue notes and a rollback plan.
- Set up a process for bug reports and player feedback.

### Acceptance gate
- All required content-maturity and publishing information is complete and accurate.
- Save/load, transactions, remote validation, mobile UI, and multiplayer smoke tests pass.
- No unresolved critical exploit, data-loss, or crash issue is known.
- Marketing assets accurately represent the playable game.

## Phase 7 — Controlled launch

### Work
- Release to the intended audience using current Roblox release controls.
- Avoid spending heavily on acquisition before engagement/retention are understood.
- Monitor error rates, save failures, crashes, player comments, acquisition, first-session behavior, and retention cohorts.
- Keep an emergency ability to roll back or disable a problematic feature.
- Fix crashes, data loss, exploits, and onboarding blockers before content expansion.

### Acceptance gate
- Live saves and rewards remain reliable.
- The experience's current content label and questionnaire remain accurate.
- The most serious live issues have an owner and response path.

## Phase 8 — Live operations and measured expansion

Only add content in response to a stable core loop and observed player needs.

Priority order:
1. Fix reliability, onboarding, difficulty spikes, and confusing UI.
2. Improve first-run and replay motivation.
3. Add a second district or a meaningful map variation.
4. Add one new enemy/hazard with distinctive counterplay.
5. Add collection and workshop content.
6. Evaluate ethical cosmetic monetization.
7. Consider separate lobby/matchmaking infrastructure only if the current server model becomes a limiting factor.

Every update should have a short design goal, success measure, risk analysis, QA plan, and rollback strategy.

---

# 21. Backlog and Priority Rules

Use this order when deciding what to implement next.

## P0 — Must ship for MVP

- Complete expedition state machine.
- One workshop and one district.
- Server-validated loot interactions.
- Temporary haul and extraction/failure resolution.
- Stable profile load/save and upgrade purchase.
- One enemy and at least one readable hazard.
- Mobile-capable core UI.
- Basic collection catalog and debrief.
- Remotes validated and rate-limited.
- Analytics events for core loop and failures.
- QA for multiplayer, save/load, duplication, and device layout.

## P1 — Add after the MVP is stable

- More contracts and loot-table variety.
- More artifact sets and workshop decoration.
- Additional hazard combinations.
- A second district with new navigation and loot decisions.
- Enhanced collection presentation.
- Cosmetic-only purchases after policy and transaction review.

## P2 — Do not implement until justified by evidence

- Player trading or a marketplace.
- Multi-place custom matchmaking.
- Large open world.
- Complex crafting, procedural world generation, multiple enemy families.
- Dynamic live-ops economy, paid random items, user-generated content uploads, or runtime AI.

---

# 22. Risk Register

| Risk | Likelihood before testing | Impact | Mitigation | Release blocker? |
|---|---|---|---|---|
| Core loop is repetitive | Medium/high | High | Prototype quickly; playtest multiple runs; add meaningful choices before content volume | If players do not voluntarily replay, reconsider the loop |
| Extraction feels unfair | Medium | High | Clear warning, readable routes, grace period, transparent loss rule | Yes if common or confusing |
| Profile data loss/duplication | Medium | Critical | Versioned persistence, session locking, transaction IDs, staging tests, monitoring | Yes |
| Remote exploit awards loot/currency | High if poorly designed | High | Server authority, validation, rate limits, abuse tests | Yes |
| Enemy AI soft-locks the run | Medium | Medium/high | Bounded chase, path recovery, telemetry, test dense geometry | Yes if run-ending without counterplay |
| Mobile controls are awkward | Medium | High | Mobile-first design and real-device playtests | Yes for intended mobile audience |
| Poor performance on low-end devices | Medium | High | Streaming, asset budgets, profiling, effect limits | Yes if the game is unstable/unplayable |
| Unlicensed asset or free-model script | Medium | High | Asset register, source review, dependency audit | Yes |
| Monetization violates current policy | Low if omitted in MVP | High | Omit early monetization; review current rules before adding purchases | Yes if monetization is enabled |
| Scope grows too early | High | High | P0/P1/P2 gates; reject features without evidence | Yes if critical scope pushes out quality |
| Weak discoverability/store page | Medium | Medium/high | Accurate title, icon, thumbnails, gameplay clips, community feedback | Not a technical blocker, but affects acquisition |

---

# 23. Definition of Done

A feature is not done merely because it works once in Studio.

A feature is complete only when all applicable conditions are true:

- It matches the intended player experience in this document.
- It has a clear owner and interface.
- It has server-side validation for any state-changing request.
- It handles invalid input and repeated calls safely.
- It handles player disconnects and run-state transitions.
- It does not duplicate authoritative data or conflicting config values.
- It works with multiple clients and on the supported input modes.
- It has tests or a documented reproducible QA checklist.
- It logs meaningful failures without flooding output or revealing sensitive data.
- It cleans up temporary instances and connections.
- It has been checked for performance regressions.
- UI text is readable, accurate, and consistent with actual behavior.
- Any persistence impact includes schema/migration and failure-handling checks.
- Any platform-policy impact is reviewed before release.

## Launch gate checklist

- [ ] The core loop is enjoyable enough that testers choose to repeat it.
- [ ] Solo and co-op sessions can finish without a soft lock.
- [ ] No critical save/load failure is known.
- [ ] No known critical remote exploit can duplicate rewards or modify other profiles.
- [ ] Purchases/upgrades cannot bypass prices or ownership checks.
- [ ] All core UI works on PC and mobile test devices.
- [ ] Critical audio cues have readable visual alternatives.
- [ ] All assets have a recorded source/license status.
- [ ] Roblox content maturity and release configuration are complete and accurate.
- [ ] Store title, description, thumbnails, and footage reflect the real game.
- [ ] A rollback and player-issue response process exists.

---

# 24. Build Instructions for an AI Coding Agent or Development Assistant

Use this section when delegating implementation to an AI tool. The goal is reliable, understandable code—not maximum code volume.

## 24.1 Required workflow for each task

1. **Inspect current project state first.** Read the relevant scripts, folders, configuration, and tests. Do not assume the repository is empty or replace working systems without evidence.
2. **Restate the exact scope.** Name what will change and what will not change.
3. **Identify authoritative state.** Say which server service owns the change and what the client is allowed to request/display.
4. **Design the interface.** Define module APIs, event payloads, data structures, and failure behavior before implementation.
5. **Implement the smallest complete increment.** Avoid creating unrelated scaffolding or future systems.
6. **Add or update tests.** Include the happy path, invalid input, duplicate request, disconnect/phase change, and regression cases as appropriate.
7. **Run checks.** Use Luau/static checks and Studio playtests available in the chosen workflow. If a required tool is unavailable, state that limitation rather than claiming the test passed.
8. **Review security.** Assume the client can fabricate every field it sends. Confirm that currency, loot, prices, cooldowns, distances, extraction, and ownership are server-validated.
9. **Review performance and lifecycle.** Check loops, connections, temporary objects, remote frequency, and cleanup.
10. **Summarize results.** Report files changed, behavior implemented, checks run, failures/limitations, and remaining issues.

## 24.2 Prohibited development shortcuts

- Do not write the whole game in one enormous script.
- Do not expose authoritative item prices, reward logic, private profile operations, or secrets as client-owned values.
- Do not let clients report their own currency, reward amount, loot rarity, hit result, extraction success, or upgrade price.
- Do not skip profile/session-locking design.
- Do not treat comments, README content, or a successful import as proof that code works.
- Do not install unreviewed models or libraries blindly.
- Do not claim a game is production-ready without multi-client, persistence, security, device, and release-policy checks.
- Do not add scope just because an AI assistant can generate code for it.

## 24.3 Suggested implementation task template

For each implementation task, give the coding agent:

- **Objective:** One feature and the player outcome it must produce.
- **Current behavior:** What already exists, based on inspection.
- **Requirements:** State transitions, rules, UI, and edge cases.
- **Authoritative owner:** Which server service owns the data/rules.
- **API contract:** Remotes, module methods, typed payload shape, and return/result states.
- **Security requirements:** Range, phase, ownership, cooldown, rate limit, duplicate handling.
- **Persistence impact:** None / read / write / migration.
- **Acceptance tests:** Observable behaviors that prove completion.
- **Out of scope:** Explicitly list excluded features.
- **Delivery report:** Files changed, checks run, known limitations, and follow-up tasks.

## 24.4 First five implementation tasks

1. **Project skeleton and state machine:** Create only the folders/modules needed for the hub → prepare → active → lockdown → extraction → debrief loop. Add state transition validation and debug visibility.
2. **Loot interaction vertical slice:** One loot container, stable item ID, server distance/state validation, temporary haul, full-inventory response, and duplicate-pickup prevention.
3. **Extraction resolution:** One extraction zone, clear timer/UI, per-player extracted state, unbanked-haul resolution, and idempotent run result.
4. **Profile and reward persistence:** Versioned profile, safe load/save, session ownership, transaction idempotency, and a staging test.
5. **Workshop progression:** One currency, one upgrade, clear UI, server-side price/ownership check, persistence, and reconnect test.

Only after these tasks pass should the team add the Warden's full AI states, hazard variety, a larger artifact catalog, and content polish.

---

# 25. Launch Checklist and Store Page Guidance

## 25.1 Suggested player-facing description

> The city locks down in minutes. Search abandoned buildings, recover strange artifacts, and escape with your haul before danger closes in. Upgrade your workshop, complete contracts, and explore with up to three friends. Every run asks the same question: are you leaving now, or risking one more room?

This description must be updated if implemented gameplay differs from the promise. Do not make claims about features that are not in the public build.

## 25.2 Thumbnail/icon requirements

Create original assets that communicate one clear idea:

- A recognizable artifact or salvage bag in the foreground.
- A visible lockdown cue (siren light, barrier, or evacuation signal).
- The Warden as a silhouette or background presence, if visually legible at small size.
- High contrast, limited focal elements, and no tiny unreadable text.
- Show real game visuals or honest concept art that matches the final visual style.

Test candidate icons at small display sizes. Do not copy popular Roblox game thumbnails or use fake UI showing features that do not exist.

## 25.3 Publishing and policy checks

Before public release, check the current Roblox Creator Hub for:

- Account/experience publication requirements and target-audience eligibility.
- Completion of the Maturity & Compliance questionnaire and accurate content descriptors.
- Community Standards and age-related content rules.
- Asset permissions, intellectual property, and any required creator attribution.
- Monetization requirements if passes or developer products are added.
- Privacy, data retention, analytics, and moderation requirements relevant to implemented features.

Roblox publication requirements can change. Verify the live Creator Dashboard workflow at release time rather than relying only on this document.

---

# 26. Current Official References

The following first-party documentation informed the platform, security, persistence, publishing, analytics, and monetization guidance. Recheck it before release because Roblox can update documentation and platform rules.

1. **Client-server security boundary:** https://create.roblox.com/docs/scripting/security/client-server-boundary
2. **Security tactics / server authority:** https://create.roblox.com/docs/scripting/security/security-tactics
3. **Server-side detection and consequencing:** https://create.roblox.com/docs/scripting/security/server-side-detection
4. **DataStoreService:** https://create.roblox.com/docs/cloud-services/data-stores
5. **DataStore best practices:** https://create.roblox.com/docs/cloud-services/data-stores/best-practices
6. **MemoryStoreService:** https://create.roblox.com/docs/cloud-services/memory-stores
7. **Performance optimization:** https://create.roblox.com/docs/performance-optimization
8. **Improve performance / instance streaming:** https://create.roblox.com/docs/performance-optimization/improve
9. **Analytics overview:** https://create.roblox.com/docs/production/analytics
10. **Engagement:** https://create.roblox.com/docs/production/analytics/engagement
11. **Retention:** https://create.roblox.com/docs/production/analytics/retention
12. **Acquisition:** https://create.roblox.com/docs/production/analytics/acquisition
13. **Passes:** https://create.roblox.com/docs/production/monetization/passes
14. **Developer products:** https://create.roblox.com/docs/production/monetization/developer-products
15. **Paid random items:** https://create.roblox.com/docs/production/monetization/paid-random-items
16. **Monetization overview:** https://create.roblox.com/docs/production/monetization
17. **Content maturity and compliance:** https://create.roblox.com/docs/production/promotion/content-maturity
18. **Create and publish games and places:** https://create.roblox.com/docs/production/publishing/publish-games-and-places
19. **Configure games and places:** https://create.roblox.com/docs/projects/configure-games

## Final production principle

**Build one complete, safe, repeatable expedition before building a large game.** The first release should prove that finding loot, managing risk, extracting, and improving the workshop are genuinely enjoyable. Use testing and analytics to decide what deserves to be built next.

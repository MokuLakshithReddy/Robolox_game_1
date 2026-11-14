# Loot Shift: Lockdown — 3D Extraction Game Prototype

[![Forks](https://img.shields.io/github/forks/MokuLakshithReddy/Robolox_game_1?style=flat-square)](https://github.com/MokuLakshithReddy/Robolox_game_1/forks) [![Open Issues](https://img.shields.io/github/issues/MokuLakshithReddy/Robolox_game_1?style=flat-square)](https://github.com/MokuLakshithReddy/Robolox_game_1/issues)


A browser-based 3D extraction-survival prototype built with React and Three.js. Start an expedition in the Old Market District, collect artifacts, complete a contract, manage satchel capacity, and reach extraction before the five-minute lockdown timer expires.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/3D-Three.js-black?logo=threedotjs)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite)](https://vite.dev/)
[![Stars](https://img.shields.io/github/stars/MokuLakshithReddy/Robolox_game_1?style=flat-square)](https://github.com/MokuLakshithReddy/Robolox_game_1/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/MokuLakshithReddy/Robolox_game_1?style=flat-square)](https://github.com/MokuLakshithReddy/Robolox_game_1/commits/main)

## Gameplay loop

~~~mermaid
flowchart TD
    A["Title screen"] --> B["Workshop hub"]
    B --> C["Launch expedition"]
    C --> D["Explore 3D district"]
    D --> E["Collect nearby items and complete contract"]
    E --> F["Manage health, inventory and remaining time"]
    F --> G{"Reach extraction before lockdown?"}
    G -->|Yes| H["Debrief and bank secured haul"]
    G -->|No| I["Game over"]
    H --> B
    I --> B
~~~

## Current systems

- Three.js scene managed through the ExpeditionGameWorld module.
- Title screen, workshop hub, expedition HUD, debrief, and game-over UI.
- Five-minute expedition timer and lockdown outcome handling.
- Player health, nearby interactables, inventory/satchel capacity, contracts, and secured loot state.
- Local profile load/save helpers and sound controls.

## Tech stack

React 19, TypeScript, Three.js, Vite 8, Tailwind CSS 4, Motion, and an Express dependency included in the package manifest.

## Run locally

~~~bash
npm install
npm run dev
~~~

The development server is configured for port 3000. Create a production bundle with npm run build and run TypeScript validation with npm run lint.

## Prototype scope and evidence

This repository is a browser-based game prototype, not a published Roblox experience. It does not currently publish a multiplayer backend, an automated test suite, or a measured frame-rate / gameplay balance benchmark. The Warden and encounter behavior should be treated as prototype gameplay until validated through repeatable playtests.

## Why it matters

Extraction games create a simple, readable decision loop: keep exploring for more value or leave early to secure what has already been collected. This prototype explores that risk/reward loop through a timed 3D expedition and persistent player progression.

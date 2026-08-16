# 🐸 Frog Music Game

<p align="left">
  <img src="https://cdn.simpleicons.org/unity/FFFFFF" height="36"/>
  <img src="https://cdn.simpleicons.org/java/ED8B00" height="36"/>
  <img src="https://cdn.simpleicons.org/javascript/F7DF1E" height="36"/>
  <img src="https://cdn.simpleicons.org/html5/E34F26" height="36"/>
  <img src="https://cdn.simpleicons.org/css/1572B6" height="36"/>
  <img src="https://cdn.simpleicons.org/github/181717" height="36"/>
</p>

A browser game prototype built primarily as a **learning project**.

This project was created to understand how game systems work internally by building them manually instead of relying on an engine from the beginning.

Rather than aiming for a polished game immediately, the focus was exploring **physics, collisions, rendering, spawning, state management, and gameplay architecture**.

This prototype became my way of understanding why game engines like **Godot** and **Unity** exist and what problems they solve.

---

## 🚧 Project Status

**Current state: Prototype (actively being improved)**

Core mechanics are implemented, but some systems are still being refined and tuned.

Current areas of improvement:

- jump consistency
- collision accuracy
- movement feel
- gameplay balancing

This repository documents the learning process rather than a final production release.

---

## 🎯 Why I Made This

I wanted to learn how games actually work under the hood.

Topics explored:

- Building a continuous game loop
- Managing rendering and updates
- Collision detection between moving entities
- Jump physics and gravity systems
- Entity-based structure (frog / snake / lotus)
- Keyboard, mouse, and touch input
- Game state and scoring logic
- Debugging movement and animation issues
- Turning ideas into playable prototypes

---

## 🎮 Gameplay

Guide the frog while avoiding incoming lotus flowers.

```text
🪷 → → → → → 🐸 → 🐍
LEFT             RIGHT

Gameplay concept:

- Lotus spawns from the left
- Frog jumps to avoid collisions
- Snake catches passing lotus
- Score increases over time

---

✨ Current Features

- 🐸 Frog jump mechanics
- 🪷 Procedural lotus spawning
- 🐍 Snake interaction
- 🎯 Collision detection
- 🧠 Game state management
- 📈 Score tracking
- ⌨️ Keyboard controls
- 🖱️ Mouse controls
- 📱 Touch support
- 🧪 Visual hitboxes for debugging

---

🛠 Tech Stack

Technology| Purpose
HTML| Page structure
CSS| Styling
JavaScript| Game logic
Canvas API| Rendering
GitHub Pages| Hosting
Unity (planned rebuild)| Next iteration

---

🚀 Future Direction

Planned improvements:

- Rebuild in Unity
- Compare engine workflow vs manual implementation
- Add animation system
- Add sounds and music sync
- Improve physics feel
- Difficulty scaling
- Mobile optimization
- Better visual design

---

▶ Run Locally

Clone the repository:

git clone <repo-url>

Run:

index.html

or launch using Live Server.

---

📚 What I Learned

This project changed how I think about game development.

A simple mechanic like jumping depends on many systems working together:

- rendering
- update loops
- coordinate systems
- physics tuning
- collision handling
- timing
- debugging
- iteration

One major takeaway was understanding why game engines exist.

After implementing these systems manually in JavaScript, I gained a better appreciation for how engines simplify iteration and manage complexity.

This prototype is not the end goal—it is the foundation for the next version.

Prototype first. Improve later.

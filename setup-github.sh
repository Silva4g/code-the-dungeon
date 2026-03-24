#!/bin/bash
# ============================================================
# Dungeon Backend — GitHub Setup Script
#
# Prerequisites:
#   1. Install gh CLI: https://cli.github.com/
#   2. Authenticate: gh auth login
#   3. Run this script from the project root:
#      chmod +x setup-github.sh && ./setup-github.sh
#
# This script will:
#   - Create the GitHub repo
#   - Push the initial code
#   - Create labels for phases and types
#   - Create milestones for each phase
#   - Create all issues with proper labels and milestones
# ============================================================

set -e

# --- Config ---
REPO_NAME="dungeon-backend"
REPO_DESC="A IA construiu o mundo 3D. Você programa a lógica. Plataforma educacional para aprender backend com um dungeon crawler."
VISIBILITY="public"  # Change to "private" if you want

echo "⚔️  Setting up Dungeon Backend on GitHub..."
echo ""

# --- Create repo ---
echo "📦 Creating repository..."
gh repo create "$REPO_NAME" \
  --description "$REPO_DESC" \
  --"$VISIBILITY" \
  --source=. \
  --remote=origin \
  --push

echo "✅ Repo created and code pushed!"
echo ""

# --- Create Labels ---
echo "🏷️  Creating labels..."

# Delete default labels we won't use
for label in "documentation" "duplicate" "enhancement" "good first issue" "help wanted" "invalid" "question" "wontfix"; do
  gh label delete "$label" --yes 2>/dev/null || true
done

# Phase labels
gh label create "phase:1-hello-dungeon"   --color "5DCAA5" --description "Phase 1: Hello Dungeon — routing, JSON, params"
gh label create "phase:2-combat"          --color "AFA9EC" --description "Phase 2: Combat — if/else, math, state mutation"
gh label create "phase:3-inventory"       --color "F0997B" --description "Phase 3: Inventory & Loot — arrays, filter, switch"
gh label create "phase:4-world"           --color "ED93B1" --description "Phase 4: World Interaction — complex logic, state machines"
gh label create "phase:5-database"        --color "85B7EB" --description "Phase 5: Database — SQLite, SQL, auth"
gh label create "phase:6-advanced"        --color "FAC775" --description "Phase 6: Biomes, Bosses & Multiplayer"

# Type labels
gh label create "type:endpoint"    --color "0E8A16" --description "New API endpoint to implement"
gh label create "type:refactor"    --color "D93F0B" --description "Refactor existing code"
gh label create "type:feature"     --color "1D76DB" --description "New feature or system"
gh label create "type:test"        --color "FBCA04" --description "Write or update tests"
gh label create "type:infra"       --color "666666" --description "Docker, CI/CD, tooling"
gh label create "type:frontend"    --color "C5DEF5" --description "Frontend changes (AI-owned)"

# Difficulty labels
gh label create "difficulty:beginner"      --color "0E8A16" --description "Simple — good first endpoint"
gh label create "difficulty:intermediate"  --color "FBCA04" --description "Requires combining concepts"
gh label create "difficulty:advanced"      --color "D93F0B" --description "Complex logic or new patterns"

# Keep the bug label
gh label create "bug" --color "D73A4A" --description "Something isn't working" 2>/dev/null || true

echo "✅ Labels created!"
echo ""

# --- Create Milestones ---
echo "🎯 Creating milestones..."

gh api repos/{owner}/{repo}/milestones -f title="Phase 1: Hello Dungeon"                -f description="Setup Express, return JSON, basic routing. ~2h"                     -f state="open" 2>/dev/null || true
gh api repos/{owner}/{repo}/milestones -f title="Phase 2: Combat"                       -f description="Damage formulas, if/else, state mutation. ~4h"                      -f state="open" 2>/dev/null || true
gh api repos/{owner}/{repo}/milestones -f title="Phase 3: Inventory & Loot"             -f description="Arrays, filter, switch/case, weighted random. ~4h"                  -f state="open" 2>/dev/null || true
gh api repos/{owner}/{repo}/milestones -f title="Phase 4: World Interaction"             -f description="Complex conditionals, state machines, graphs. ~6h"                  -f state="open" 2>/dev/null || true
gh api repos/{owner}/{repo}/milestones -f title="Phase 5: Database & Auth"              -f description="SQLite migration, SQL, JWT authentication. ~8h"                     -f state="open" 2>/dev/null || true
gh api repos/{owner}/{repo}/milestones -f title="Phase 6: Biomes, Bosses & Multiplayer" -f description="Procedural generation, WebSocket, scaling. ~12h"                    -f state="open" 2>/dev/null || true

echo "✅ Milestones created!"
echo ""

# --- Create Issues ---
echo "📝 Creating issues..."

# ============================================================
# PHASE 1 — Hello Dungeon
# ============================================================

gh issue create \
  --title "GET /api/player/:id — Return player data" \
  --label "phase:1-hello-dungeon,type:endpoint,difficulty:beginner" \
  --milestone "Phase 1: Hello Dungeon" \
  --body '## Description
Implement the endpoint that returns a player'"'"'s data. The frontend calls this on startup to display the HUD (HP bar, name, level).

## File
`backend/src/routes/player.js`

## Expected behavior
- Look up the player by `req.params.id` using `getPlayer(id)` from `../data/state.js`
- If found, return the player object with status `200`
- If not found, return `{ error: "Player not found" }` with status `404`

## Expected response
```json
{
  "id": "player-1",
  "name": "Adventurer",
  "hp": 100,
  "max_hp": 100,
  "atk": 5,
  "def": 3,
  "level": 1,
  "xp": 0
}
```

## Concepts
- `req.params`
- `res.json()`
- HTTP status codes (200, 404)
- Conditional logic (if player exists)

## 3D unlock
When this works, the HUD will display the player name, HP bar, and level.'

gh issue create \
  --title "POST /api/player/create — Create a new player" \
  --label "phase:1-hello-dungeon,type:endpoint,difficulty:beginner" \
  --milestone "Phase 1: Hello Dungeon" \
  --body '## Description
Create a new player with a name. The frontend calls this when no player exists yet.

## File
`backend/src/routes/player.js`

## Expected behavior
- Read `name` from `req.body`
- Validate that `name` exists and is a non-empty string
- If invalid, return `{ error: "Name is required" }` with status `400`
- Generate an ID (e.g. `"player-" + Date.now()`) or use `generateId("player-")` from utils
- Call `createPlayer(id, name)` from `../data/state.js`
- Return the created player with status `201`

## Concepts
- `req.body` (POST body parsing)
- Input validation
- HTTP 201 (Created) vs 400 (Bad Request)

## 3D unlock
The player can now be created and the game loop starts.'

gh issue create \
  --title "GET /api/room/:id — Return room data" \
  --label "phase:1-hello-dungeon,type:endpoint,difficulty:beginner" \
  --milestone "Phase 1: Hello Dungeon" \
  --body '## Description
Return all data about a dungeon room. This is the most important endpoint — the entire 3D world is built from this response.

## File
`backend/src/routes/room.js`

## Expected behavior
- Look up the room by `req.params.id` in the `ROOMS` object from `../data/game-data.js`
- If found, return the full room object with status `200`
- If not found, return `{ error: "Room not found" }` with status `404`

## Expected response
```json
{
  "id": "room-1",
  "name": "Entrance Hall",
  "biome": "catacombs",
  "description": "A cold stone chamber...",
  "width": 3,
  "depth": 3,
  "map_x": 2,
  "map_y": 4,
  "exits": [{ "id": "exit-1-north", "direction": "north", "target_room": "room-2", "locked": false }],
  "enemies": [],
  "loot": [{ "id": "loot-1", "name": "Rusty Sword", "type": "weapon", "rarity": "common" }],
  "objects": []
}
```

## Concepts
- Object lookup by key (`ROOMS[id]`)
- Returning nested JSON structures
- Arrays inside objects

## 3D unlock
The dungeon renders! Walls, floor, ceiling, doors, torches — all based on YOUR response. Enemies and loot appear in the room.'

gh issue create \
  --title "Write Phase 1 tests — Verify player and room endpoints" \
  --label "phase:1-hello-dungeon,type:test,difficulty:beginner" \
  --milestone "Phase 1: Hello Dungeon" \
  --body '## Description
Uncomment and verify the tests in `backend/tests/phase1.test.js`. Make sure all tests pass.

## How to run
```bash
docker compose exec backend npm test
```

## Tests to pass
- `GET /health` returns ok
- `POST /player/create` creates a player (201)
- `POST /player/create` without name returns 400
- `GET /player/:id` returns the player
- `GET /player/:id` returns 404 for unknown
- `GET /room/room-1` returns room data with correct structure
- `GET /room/fake-room` returns 404'

# ============================================================
# PHASE 2 — Combat
# ============================================================

gh issue create \
  --title "POST /api/combat/attack — Player attacks enemy" \
  --label "phase:2-combat,type:endpoint,difficulty:intermediate" \
  --milestone "Phase 2: Combat" \
  --body '## Description
The core combat endpoint. When the player clicks an enemy in 3D, the frontend sends this request. Calculate damage and apply it.

## File
`backend/src/routes/combat.js`

## Logic
1. Get `player_id`, `target_id` from `req.body`
2. Look up the player and find the enemy in the current room'"'"'s data
3. Validate both exist and enemy is alive
4. Calculate damage: `calcDamage(player.atk, enemy.def)` from `../utils/helpers.js`
5. Check for crit: `isCrit()` — if true, multiply damage by 2
6. Subtract damage from enemy HP
7. If enemy HP <= 0: mark as killed, add XP to player
8. Return the result

## Expected response
```json
{
  "damage": 7,
  "is_crit": false,
  "target_hp": 23,
  "target_max_hp": 30,
  "killed": false,
  "message": "You deal 7 damage to Skeleton!"
}
```

## Concepts
- Math operations
- `if/else` chains
- `Math.random()` for crits
- State mutation (reducing HP)
- Importing and using utility functions

## 3D unlock
Attack animations play, floating damage numbers appear, enemies die with a shrink animation.'

gh issue create \
  --title "POST /api/combat/defend — Player defends" \
  --label "phase:2-combat,type:endpoint,difficulty:beginner" \
  --milestone "Phase 2: Combat" \
  --body '## Description
Apply a temporary defense buff when the player right-clicks.

## File
`backend/src/routes/combat.js`

## Logic
1. Get `player_id` from `req.body`
2. Add a temporary DEF buff to the player (e.g. +5 DEF)
3. Store the buff in `player.buffs` array with a duration

## Expected response
```json
{
  "defending": true,
  "defense_bonus": 5,
  "message": "You brace yourself! (+5 DEF this turn)"
}
```

## Concepts
- Temporary state (buffs with duration)
- Pushing to arrays'

gh issue create \
  --title "Track enemy state across room visits" \
  --label "phase:2-combat,type:feature,difficulty:intermediate" \
  --milestone "Phase 2: Combat" \
  --body '## Description
When an enemy is killed, that state needs to persist. If the player leaves and comes back, dead enemies should stay dead.

## Implementation
- When an enemy dies in `/combat/attack`, update the room state using `setRoomState()` from `../data/state.js`
- When `/room/:id` is called, merge the base room data with the room state (override enemy HP, mark dead enemies)
- Use the spread operator: `{ ...baseRoom, enemies: mergedEnemies }`

## Concepts
- Object spread / merging
- State persistence across requests
- Data transformation'

# ============================================================
# PHASE 3 — Inventory
# ============================================================

gh issue create \
  --title "GET /api/inventory/:playerId — List player items" \
  --label "phase:3-inventory,type:endpoint,difficulty:intermediate" \
  --milestone "Phase 3: Inventory & Loot" \
  --body '## Description
Return the player'"'"'s inventory with optional filtering by type and rarity.

## File
`backend/src/routes/inventory.js`

## Logic
1. Get player from state
2. Start with `player.inventory` array
3. If `req.query.type` exists, filter by item type
4. If `req.query.rarity` exists, filter by rarity
5. Return filtered list with count

## Examples
- `GET /inventory/player-1` → all items
- `GET /inventory/player-1?type=weapon` → only weapons
- `GET /inventory/player-1?type=consumable&rarity=rare` → rare consumables

## Concepts
- `req.query` (query parameters)
- `Array.filter()`
- Chaining filters
- Returning computed values (`count`)'

gh issue create \
  --title "POST /api/inventory/use — Use a consumable item" \
  --label "phase:3-inventory,type:endpoint,difficulty:intermediate" \
  --milestone "Phase 3: Inventory & Loot" \
  --body '## Description
Use an item from inventory. Different items have different effects.

## File
`backend/src/routes/inventory.js`

## Logic
1. Find the item in `player.inventory` by `item_id`
2. Validate it exists and is consumable
3. Apply effect based on `item.effect.type`:
   - `"heal"` → increase player HP by `effect.amount` (cap at max_hp)
   - `"cure_poison"` → remove poison from `player.buffs`
   - `"buff_atk"` → add temporary ATK buff
   - `"buff_def"` → add temporary DEF buff
4. Remove the item from inventory after use
5. Return result

## Concepts
- `switch/case` statement
- `Array.findIndex()` + `Array.splice()` to remove items
- `Math.min()` to cap HP at maximum
- Side effects (mutating player state)'

gh issue create \
  --title "POST /api/inventory/equip — Equip weapon or armor" \
  --label "phase:3-inventory,type:endpoint,difficulty:intermediate" \
  --milestone "Phase 3: Inventory & Loot" \
  --body '## Description
Equip an item to a slot (main_hand, off_hand, armor). Update player stats accordingly.

## Logic
1. Find item in inventory
2. Validate slot is valid
3. If slot already has an item, unequip it (subtract stats, move to inventory)
4. Equip new item (add stats, set `player.equipped[slot]`)
5. Remove from inventory
6. Return updated stats

## Concepts
- Object property access with dynamic keys (`player.equipped[slot]`)
- Adding/subtracting nested stats
- Swap logic (unequip old, equip new)'

gh issue create \
  --title "POST /api/loot/pickup — Pick up item from ground" \
  --label "phase:3-inventory,type:endpoint,difficulty:beginner" \
  --milestone "Phase 3: Inventory & Loot" \
  --body '## Description
Pick up a loot item from the current room and add it to inventory.

## Logic
1. Find the loot item in the room'"'"'s data by `loot_id`
2. Add it to `player.inventory`
3. Remove it from room state (so it doesn'"'"'t appear again)
4. Return the picked up item

## 3D unlock
Items disappear from the floor when picked up, inventory screen updates.'

# ============================================================
# PHASE 4 — World Interaction
# ============================================================

gh issue create \
  --title "POST /api/room/:id/interact — Interact with objects" \
  --label "phase:4-world,type:endpoint,difficulty:advanced" \
  --milestone "Phase 4: World Interaction" \
  --body '## Description
Handle interactions with chests, levers, and traps. Each object type has different behavior.

## File
`backend/src/routes/world.js`

## Object behaviors
**Chest**: Open it, give contents to player. If locked, check for key.
**Lever**: Toggle state, apply effect (e.g. reveal hidden trap).
**Trap**: If player steps on it, deal damage. Can be disarmed.

## Concepts
- Complex conditionals
- State machines (trap: hidden → triggered → disarmed)
- Cause and effect chains (lever → reveal trap)
- Updating nested state'

gh issue create \
  --title "POST /api/room/:id/unlock — Unlock doors with keys" \
  --label "phase:4-world,type:endpoint,difficulty:intermediate" \
  --milestone "Phase 4: World Interaction" \
  --body '## Description
Try to unlock a locked door using a key from inventory.

## Logic
1. Find the door in room exits by `door_id`
2. Check `door.requires_key`
3. Search player inventory for matching key (`item.key_id === door.requires_key`)
4. If found: unlock door, remove key, update room state
5. If not: return error

## 3D unlock
Locked doors change material from solid wood to transparent, allowing passage.'

gh issue create \
  --title "GET /api/map/discovered — Fog of war minimap" \
  --label "phase:4-world,type:endpoint,difficulty:intermediate" \
  --milestone "Phase 4: World Interaction" \
  --body '## Description
Return all rooms the player has visited, for the minimap.

## Logic
1. Get `player.discovered_rooms` array
2. Map each room ID to its data from ROOMS
3. For each room, check if all enemies are dead (cleared)
4. Return the list with map coordinates

## Concepts
- `Array.map()` to transform data
- Merging data from multiple sources
- Computed boolean fields

## 3D unlock
The minimap in the bottom-right corner populates with discovered rooms.'

# ============================================================
# PHASE 5 — Database
# ============================================================

gh issue create \
  --title "Migrate in-memory state to SQLite" \
  --label "phase:5-database,type:refactor,difficulty:advanced" \
  --milestone "Phase 5: Database & Auth" \
  --body '## Description
Replace the in-memory `Map()` store with SQLite using `better-sqlite3`.

## Tables to create
```sql
CREATE TABLE players (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  hp INTEGER DEFAULT 100,
  max_hp INTEGER DEFAULT 100,
  atk INTEGER DEFAULT 5,
  def INTEGER DEFAULT 3,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  current_room TEXT DEFAULT '"'"'room-1'"'"',
  inventory TEXT DEFAULT '"'"'[]'"'"',
  equipped TEXT DEFAULT '"'"'{}'"'"',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE room_states (
  room_id TEXT PRIMARY KEY,
  state TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE discovered_rooms (
  player_id TEXT,
  room_id TEXT,
  cleared BOOLEAN DEFAULT 0,
  PRIMARY KEY (player_id, room_id)
);
```

## Steps
1. `npm install better-sqlite3`
2. Create `backend/src/data/database.js` with init + query helpers
3. Update `state.js` exports to use SQL instead of Maps
4. All existing endpoints should work without changes

## Concepts
- SQL basics (SELECT, INSERT, UPDATE)
- Schema design
- JSON serialization for complex fields
- Database migrations'

gh issue create \
  --title "POST /api/save/:playerId — Save game progress" \
  --label "phase:5-database,type:endpoint,difficulty:intermediate" \
  --milestone "Phase 5: Database & Auth" \
  --body '## Description
Persist the full player state to the database.

## Logic
- Serialize inventory and equipped as JSON
- UPDATE the players table
- UPDATE all room_states
- Return confirmation with timestamp

## 3D unlock
A "Game Saved" notification appears in the HUD.'

gh issue create \
  --title "GET /api/leaderboard — Top players ranking" \
  --label "phase:5-database,type:endpoint,difficulty:intermediate" \
  --milestone "Phase 5: Database & Auth" \
  --body '## Description
Return top 10 players ranked by XP.

## SQL
```sql
SELECT id, name, level, xp FROM players ORDER BY xp DESC LIMIT 10;
```

## 3D unlock
Leaderboard screen accessible from the lobby.'

gh issue create \
  --title "POST /api/auth/register + /api/auth/login — Authentication" \
  --label "phase:5-database,type:endpoint,difficulty:advanced" \
  --milestone "Phase 5: Database & Auth" \
  --body '## Description
Add user authentication with password hashing and JWT tokens.

## Steps
1. `npm install bcrypt jsonwebtoken`
2. Create users table: `id, username, password_hash, created_at`
3. **Register**: hash password with bcrypt, store in DB
4. **Login**: verify password, return JWT token
5. Create auth middleware that verifies JWT on protected routes

## Concepts
- Password hashing (never store plain text!)
- JWT tokens
- Middleware pattern
- Protected routes'

# ============================================================
# PHASE 6 — Advanced
# ============================================================

gh issue create \
  --title "POST /api/dungeon/generate — Procedural dungeon generation" \
  --label "phase:6-advanced,type:feature,difficulty:advanced" \
  --milestone "Phase 6: Biomes, Bosses & Multiplayer" \
  --body '## Description
Generate a random dungeon layout with rooms, enemies, and loot based on biome and difficulty.

## Algorithm
1. Accept `{ biome, difficulty, room_count }` in body
2. Generate a graph of connected rooms
3. Populate each room with enemies scaled to difficulty
4. Place loot using weighted random from loot tables
5. Place keys and locked doors
6. Return the full dungeon structure

## Biomes
- `catacombs`: skeletons, rats (difficulty 1-2)
- `sewer`: slimes, poison (difficulty 2-3)
- `forge`: golems, fire traps (difficulty 3-4)
- `library`: ghosts, puzzles (difficulty 4-5)
- `abyss`: bosses, mixed (difficulty 5+)

## Concepts
- Procedural generation algorithms
- Graph data structures
- Scaling / balancing
- Complex data construction'

gh issue create \
  --title "POST /api/boss/fight — Multi-phase boss combat" \
  --label "phase:6-advanced,type:feature,difficulty:advanced" \
  --milestone "Phase 6: Biomes, Bosses & Multiplayer" \
  --body '## Description
Boss fights with multiple phases, attack patterns, and an enrage timer.

## Design
- Boss has 2-3 phases, each with different attack patterns
- Phase transitions at HP thresholds (e.g. 66%, 33%)
- Enrage timer: after N turns, boss damage increases dramatically
- Special abilities: AOE, summon adds, heal

## Concepts
- State machines (boss phases)
- Timer-based logic
- Complex game design patterns'

gh issue create \
  --title "WebSocket /ws/party — Real-time multiplayer co-op" \
  --label "phase:6-advanced,type:feature,difficulty:advanced" \
  --milestone "Phase 6: Biomes, Bosses & Multiplayer" \
  --body '## Description
Add WebSocket support for real-time co-op gameplay.

## Features
- Party system: create/join party
- Position sync: see other players move in real-time
- Combat sync: coordinated attacks on enemies
- Chat: in-game text chat

## Steps
1. `npm install ws`
2. Create WebSocket server alongside Express
3. Implement message types: `position`, `attack`, `chat`, `party_join`
4. Broadcast state changes to all party members

## Concepts
- WebSocket protocol
- Real-time communication
- Concurrency (multiple players modifying state)
- Message serialization'

echo ""
echo "✅ All issues created!"
echo ""
echo "📊 Summary:"
echo "   Phase 1: 4 issues (Hello Dungeon)"
echo "   Phase 2: 3 issues (Combat)"
echo "   Phase 3: 4 issues (Inventory & Loot)"
echo "   Phase 4: 3 issues (World Interaction)"
echo "   Phase 5: 4 issues (Database & Auth)"
echo "   Phase 6: 3 issues (Advanced)"
echo "   Total:  21 issues"
echo ""
echo "🎮 Open your repo: gh repo view --web"

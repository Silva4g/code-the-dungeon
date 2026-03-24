// ============================================================
// DUNGEON DATA — All the rooms, enemies, items, and loot tables
// The beginner's backend reads from here. As they advance,
// they can modify and expand this data.
// ============================================================

export const ROOMS = {
  'room-1': {
    id: 'room-1',
    name: 'Entrance Hall',
    biome: 'catacombs',
    description: 'A cold stone chamber. Torchlight flickers on ancient walls.',
    width: 3,
    depth: 3,
    map_x: 2,
    map_y: 4,
    exits: [
      { id: 'exit-1-north', direction: 'north', target_room: 'room-2', locked: false },
    ],
    enemies: [],
    loot: [
      { id: 'loot-1', name: 'Rusty Sword', type: 'weapon', rarity: 'common', x: 1, z: -1, stats: { atk: 3 } },
    ],
    objects: [],
  },
  'room-2': {
    id: 'room-2',
    name: 'Skeleton Guard Room',
    biome: 'catacombs',
    description: 'Bones crunch underfoot. Two skeletons stand guard.',
    width: 4,
    depth: 3,
    map_x: 2,
    map_y: 3,
    exits: [
      { id: 'exit-2-south', direction: 'south', target_room: 'room-1', locked: false },
      { id: 'exit-2-east', direction: 'east', target_room: 'room-3', locked: false },
      { id: 'exit-2-north', direction: 'north', target_room: 'room-4', locked: true, requires_key: 'iron-key' },
    ],
    enemies: [
      { id: 'enemy-1', name: 'Skeleton', type: 'skeleton', hp: 30, max_hp: 30, atk: 5, def: 2, xp: 10, size: 1, x: -2, z: -3 },
      { id: 'enemy-2', name: 'Skeleton', type: 'skeleton', hp: 30, max_hp: 30, atk: 5, def: 2, xp: 10, size: 1, x: 3, z: -2 },
    ],
    loot: [],
    objects: [],
  },
  'room-3': {
    id: 'room-3',
    name: 'Storage Room',
    biome: 'catacombs',
    description: 'Dusty crates and barrels. Something glints in the corner.',
    width: 2,
    depth: 2,
    map_x: 3,
    map_y: 3,
    exits: [
      { id: 'exit-3-west', direction: 'west', target_room: 'room-2', locked: false },
    ],
    enemies: [
      { id: 'enemy-3', name: 'Giant Rat', type: 'rat', hp: 15, max_hp: 15, atk: 8, def: 1, xp: 5, size: 0.6, x: 0, z: -1 },
    ],
    loot: [
      { id: 'loot-2', name: 'Health Potion', type: 'consumable', rarity: 'common', x: 2, z: 1, effect: { type: 'heal', amount: 20 } },
    ],
    objects: [
      { id: 'obj-1', type: 'chest', x: 2, z: -2, locked: false, contains: [
        { id: 'loot-3', name: 'Iron Key', type: 'key', rarity: 'rare', key_id: 'iron-key' },
      ]},
    ],
  },
  'room-4': {
    id: 'room-4',
    name: 'The Fallen Knight\'s Chamber',
    biome: 'catacombs',
    description: 'A grand chamber with crumbling pillars. An armored figure rises.',
    width: 4,
    depth: 4,
    map_x: 2,
    map_y: 2,
    exits: [
      { id: 'exit-4-south', direction: 'south', target_room: 'room-2', locked: false },
      { id: 'exit-4-north', direction: 'north', target_room: 'room-5', locked: false },
    ],
    enemies: [
      { id: 'enemy-4', name: 'Fallen Knight', type: 'skeleton', hp: 80, max_hp: 80, atk: 12, def: 8, xp: 50, size: 1.3, x: 0, z: -4 },
    ],
    loot: [],
    objects: [
      { id: 'obj-2', type: 'lever', x: -4, z: -4, active: false, effect: 'reveal_trap' },
    ],
  },
  'room-5': {
    id: 'room-5',
    name: 'Descent to the Sewers',
    biome: 'sewer',
    description: 'The air grows thick and humid. Green slime drips from the ceiling.',
    width: 3,
    depth: 3,
    map_x: 2,
    map_y: 1,
    exits: [
      { id: 'exit-5-south', direction: 'south', target_room: 'room-4', locked: false },
    ],
    enemies: [
      { id: 'enemy-5', name: 'Toxic Slime', type: 'slime', hp: 20, max_hp: 20, atk: 3, def: 0, xp: 8, size: 0.7, x: -1, z: -2, dot: { damage: 4, duration: 3 } },
      { id: 'enemy-6', name: 'Toxic Slime', type: 'slime', hp: 20, max_hp: 20, atk: 3, def: 0, xp: 8, size: 0.7, x: 2, z: 1, dot: { damage: 4, duration: 3 } },
    ],
    loot: [
      { id: 'loot-4', name: 'Antidote', type: 'consumable', rarity: 'common', x: 0, z: 3, effect: { type: 'cure_poison' } },
    ],
    objects: [
      { id: 'obj-3', type: 'trap', x: 1, z: 0, visible: false, damage: 15, triggered: false },
    ],
  },
};

export const ENEMY_TEMPLATES = {
  skeleton: { type: 'skeleton', base_hp: 30, base_atk: 5, base_def: 2, xp: 10, size: 1, drops: ['bone-dust', 'rusty-helm'] },
  rat: { type: 'rat', base_hp: 15, base_atk: 8, base_def: 1, xp: 5, size: 0.6, drops: ['rat-tail'] },
  slime: { type: 'slime', base_hp: 20, base_atk: 3, base_def: 0, xp: 8, size: 0.7, drops: ['slime-gel'], dot: { damage: 4, duration: 3 } },
  fallen_knight: { type: 'skeleton', base_hp: 80, base_atk: 12, base_def: 8, xp: 50, size: 1.3, drops: ['knight-sword', 'iron-shield'] },
  golem: { type: 'golem', base_hp: 100, base_atk: 10, base_def: 15, xp: 30, size: 1.5, drops: ['iron-core'] },
  ghost: { type: 'ghost', base_hp: 50, base_atk: 15, base_def: 0, xp: 25, size: 1, drops: ['ectoplasm'], phase: true },
};

export const ITEM_CATALOG = {
  'rusty-sword': { id: 'rusty-sword', name: 'Rusty Sword', type: 'weapon', slot: 'main_hand', rarity: 'common', stats: { atk: 3 } },
  'iron-shield': { id: 'iron-shield', name: 'Iron Shield', type: 'armor', slot: 'off_hand', rarity: 'rare', stats: { def: 5 } },
  'knight-sword': { id: 'knight-sword', name: 'Knight\'s Sword', type: 'weapon', slot: 'main_hand', rarity: 'rare', stats: { atk: 8 } },
  'health-potion': { id: 'health-potion', name: 'Health Potion', type: 'consumable', rarity: 'common', effect: { type: 'heal', amount: 20 } },
  'antidote': { id: 'antidote', name: 'Antidote', type: 'consumable', rarity: 'common', effect: { type: 'cure_poison' } },
  'iron-key': { id: 'iron-key', name: 'Iron Key', type: 'key', rarity: 'rare', key_id: 'iron-key' },
};

export const LOOT_TABLES = {
  skeleton: [
    { item_id: 'health-potion', weight: 50, rarity: 'common' },
    { item_id: 'rusty-sword', weight: 30, rarity: 'common' },
    { item_id: 'iron-shield', weight: 10, rarity: 'rare' },
  ],
  rat: [
    { item_id: 'health-potion', weight: 70, rarity: 'common' },
  ],
  slime: [
    { item_id: 'antidote', weight: 60, rarity: 'common' },
    { item_id: 'health-potion', weight: 30, rarity: 'common' },
  ],
};

export const XP_TABLE = [
  0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000,
  5000, 6500, 8000, 10000, 12500, 15000, 18000, 22000, 27000, 33000,
];

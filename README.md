# Dungeon Backend

> A IA construiu o mundo 3D. Você programa a lógica.

**Dungeon Backend** é uma plataforma educacional onde iniciantes aprendem programação backend construindo a lógica de um dungeon crawler 3D. O frontend (Three.js) já vem pronto — conforme você implementa cada endpoint, o mundo vai "acordando": monstros levam dano, baús abrem, portas destrancam, poções curam.

## Quick start

```bash
# Requisitos: Docker + Docker Compose
docker compose up
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Estrutura

```
dungeon-backend/
├── frontend/          # Three.js game client (não precisa mexer aqui)
│   ├── src/
│   │   ├── core/      # Game loop, renderer, camera
│   │   ├── world/     # Dungeon generation, rooms, entities
│   │   ├── ui/        # HUD, inventory screen, menus
│   │   └── assets/    # Modelos, texturas, sons
│   ├── Dockerfile
│   └── package.json
│
├── backend/           # ← VOCÊ PROGRAMA AQUI
│   ├── src/
│   │   ├── routes/    # Endpoints da API
│   │   ├── middleware/ # Validação, error handling
│   │   ├── models/    # Estrutura dos dados
│   │   ├── data/      # Dados iniciais (rooms, enemies, items)
│   │   └── utils/     # Helpers (dice rolls, formulas)
│   ├── tests/         # Testes automatizados
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

## Roadmap de fases

| Fase | Nome | O que você implementa | O que desbloqueia no 3D |
|------|------|----------------------|------------------------|
| 1 | Hello Dungeon | `GET /room/:id`, `GET /player/:id` | Jogador spawna, anda pelas salas |
| 2 | Combate Básico | `POST /combat/attack`, `/defend` | Animações de ataque, HP bars |
| 3 | Inventário e Loot | `GET /inventory`, `POST /inventory/use` | Items no chão, tela de inventário |
| 4 | Mundo Interativo | `POST /room/:id/interact`, `/unlock` | Portas, armadilhas, minimapa |
| 5 | Banco de Dados | Migração in-memory → SQLite | Save/load, leaderboard |
| 6 | Biomas e Bosses | Proc-gen, WebSocket co-op | 5 biomas, boss arenas, multiplayer |

## Biomas

- **Catacumbas de Pedra** (Fases 1-2) — Esqueletos, ratos gigantes
- **Esgoto Venenoso** (Fase 3) — Slimes tóxicos, status effects
- **Forja Infernal** (Fase 4) — Golems, armadilhas mecânicas
- **Biblioteca Arcana** (Fase 5) — Fantasmas, puzzles lógicos
- **Abismo Final** (Fase 6) — Bosses multi-fase, co-op obrigatório

## Tecnologias

- **Frontend:** Three.js, Vite
- **Backend:** Node.js, Express
- **Database:** In-memory → SQLite → PostgreSQL
- **Infra:** Docker, Docker Compose

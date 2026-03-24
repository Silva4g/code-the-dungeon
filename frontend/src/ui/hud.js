export class HUD {
  constructor() {
    this.elements = {};
    this.statusTimeout = null;
  }

  init() {
    this.elements = {
      playerName: document.getElementById('player-name'),
      hpText: document.getElementById('hp-text'),
      hpFill: document.getElementById('hp-fill'),
      level: document.getElementById('player-level'),
      xp: document.getElementById('player-xp'),
      roomName: document.getElementById('room-name'),
      statusMsg: document.getElementById('status-msg'),
      loading: document.getElementById('loading'),
      loadStatus: document.getElementById('load-status'),
    };
  }

  hideLoading() {
    this.elements.loading.classList.add('hidden');
    setTimeout(() => { this.elements.loading.style.display = 'none'; }, 500);
  }

  setLoadStatus(msg) {
    this.elements.loadStatus.textContent = msg;
  }

  updatePlayer(player) {
    if (!player) return;
    this.elements.playerName.textContent = player.name || 'Adventurer';
    this.elements.level.textContent = player.level || 1;
    this.elements.xp.textContent = player.xp || 0;
    this.updateHP(player.hp, player.max_hp);
  }

  updateHP(current, max) {
    if (current == null || max == null) return;
    const pct = Math.max(0, Math.min(100, (current / max) * 100));
    this.elements.hpText.textContent = `${Math.round(current)}/${Math.round(max)}`;
    this.elements.hpFill.style.width = `${pct}%`;
    this.elements.hpFill.classList.toggle('low', pct < 30);
  }

  updateRoom(roomData) {
    this.elements.roomName.textContent = roomData.name || '???';
  }

  showStatus(msg, duration = 3000) {
    this.elements.statusMsg.textContent = msg;
    this.elements.statusMsg.classList.add('visible');
    clearTimeout(this.statusTimeout);
    this.statusTimeout = setTimeout(() => {
      this.elements.statusMsg.classList.remove('visible');
    }, duration);
  }

  showDamage(amount, isCrit = false) {
    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed; top: 40%; left: 50%; transform: translate(-50%, 0);
      font-family: 'Courier New', monospace; font-size: ${isCrit ? '2rem' : '1.5rem'};
      color: ${isCrit ? '#ff4444' : '#ff8844'}; pointer-events: none; z-index: 20;
      animation: floatUp 1s forwards;
    `;
    el.textContent = `${isCrit ? 'CRIT! ' : ''}-${amount}`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  showHeal(amount) {
    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed; top: 40%; left: 50%; transform: translate(-50%, 0);
      font-family: 'Courier New', monospace; font-size: 1.5rem;
      color: #44ff44; pointer-events: none; z-index: 20;
      animation: floatUp 1s forwards;
    `;
    el.textContent = `+${amount}`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }
}

const style = document.createElement('style');
style.textContent = `
  @keyframes floatUp {
    from { opacity: 1; transform: translate(-50%, 0); }
    to { opacity: 0; transform: translate(-50%, -60px); }
  }
`;
document.head.appendChild(style);

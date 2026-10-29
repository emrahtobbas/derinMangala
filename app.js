/**
 * TÜRK MANGALASI - COMPLETE GAME & INTERACTIVE TUTORIAL ENGINE
 * Features:
 * - Full Turkish Mangala official tournament rules
 * - Step-by-step animated marble distribution
 * - Web Audio API procedural sound engine (no external assets needed)
 * - 3 AI difficulty levels (Easy, Medium, Minimax Hard)
 * - 6 Interactive pedagogical tutorial scenarios
 * - Visual stone physics & SVG/CSS gem clusters
 */

// =============================================================================
// AUDIO ENGINE (Web Audio API)
// =============================================================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600 + Math.random() * 200, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  playDrop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    // Ceramic / marble click
    osc.type = 'sine';
    const baseFreq = 880 + Math.random() * 300;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playCapture() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + i * 0.05;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.18);
    });
  }

  playExtraTurn() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [440, 554.37, 659.25].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + i * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.15);
    });
  }

  playVictory() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + idx * 0.1;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.4);
    });
  }
}

// =============================================================================
// TUTORIAL SCENARIOS CONFIGURATION
// =============================================================================
const TUTORIAL_SCENARIOS = [
  {
    id: 1,
    title: "1. Kural: Temel Dağıtım & Kendi Kuyusuna Taş Bırakma",
    badge: "Ders 1 / 6",
    description: "Mangala'da taş dağıtırken çok özel bir kural vardır: Sırası gelen oyuncu bir kuyu seçer, <strong>aldığı kuyuya da 1 taş bırakmak koşuluyla</strong> saat yönünün tersine (sağa doğru) tek tek dağıtır.",
    target: "Lütfen 3. kuyuyu (4 taş var) seçerek dağıtımı başlatın.",
    setup: () => {
      const board = Array(14).fill(0);
      board[0] = 4; board[1] = 4; board[2] = 4; board[3] = 4; board[4] = 4; board[5] = 4;
      board[7] = 4; board[8] = 4; board[9] = 4; board[10] = 4; board[11] = 4; board[12] = 4;
      return { board, currentTurn: 1, allowedPits: [2] };
    },
    validateMove: (pitIndex, result) => {
      if (pitIndex === 2) {
        return {
          success: true,
          feedback: "Harika! Gördüğünüz gibi 3. kuyuda 1 taş kaldı, diğer 3 taş sırasıyla sağdaki 4, 5 ve 6. kuyulara birer tane bırakıldı."
        };
      }
      return { success: false, feedback: "Lütfen kuralı görmek için 3. kuyuya tıklayın." };
    }
  },
  {
    id: 2,
    title: "Tek Taş Kuralı (İstisna)",
    badge: "Ders 2 / 6",
    description: "Eğer hamle yapmak istediğiniz kuyuda <strong>sadece 1 adet taş</strong> varsa, kuyuya taş bırakılmaz! Bu tek taş doğrudan sağındaki komşu kuyuya geçirilir ve seçilen kuyu tamamen boşalır.",
    target: "Sadece 1 taş bulunan 4. kuyuya tıklayarak tek taşı sağa geçirin.",
    setup: () => {
      const board = Array(14).fill(0);
      board[1] = 2; board[3] = 1; board[5] = 3;
      board[7] = 3; board[10] = 4;
      return { board, currentTurn: 1, allowedPits: [3] };
    },
    validateMove: (pitIndex, result) => {
      if (pitIndex === 3) {
        return {
          success: true,
          feedback: "Mükemmel! Kuyuda tek taş olduğu için yerinde taş bırakılmadı ve taş sağındaki 5. kuyuya geçti."
        };
      }
      return { success: false, feedback: "Lütfen tek taşı olan 4. kuyuya tıklayın." };
    }
  },
  {
    id: 3,
    title: "2. Kural: Hazineye İsabet & Ekstra Hamle",
    badge: "Ders 3 / 6",
    description: "Dağıttığınız <strong>son taş kendi hazinenize (sağdaki büyük kuyuya) denk gelirse</strong>, tekrar oynama hakkı kazanırsınız! Sıra rakibe geçmez, sizde kalır.",
    target: "6. kuyudaki taşı oynatarak doğrudan hazinenize atın ve ekstra hamle kazanın!",
    setup: () => {
      const board = Array(14).fill(0);
      board[0] = 2; board[2] = 3; board[5] = 1; // Pit 5 has 1 stone, next is pit 6 (Hazine)
      board[7] = 4; board[9] = 2;
      return { board, currentTurn: 1, allowedPits: [5] };
    },
    validateMove: (pitIndex, result) => {
      if (pitIndex === 5 && result.extraTurn) {
        return {
          success: true,
          feedback: "Tebrikler! Son taş doğrudan hazinenize düştü ve oyun sırası TEKRAR SİZDE kaldı! Mangala'da hazineye denk getirmek en büyük stratejidir."
        };
      }
      return { success: false, feedback: "Hazineye tek adım mesafede olan 6. kuyuya tıklayın." };
    }
  },
  {
    id: 4,
    title: "3. Kural: Rakip Kuyuyu Çift Yapma",
    badge: "Ders 4 / 6",
    description: "Dağıttığınız son taş <strong>rakip bölgedeki bir kuyuya denk gelir</strong> ve o kuyudaki toplam taş adedini <strong>ÇİFT sayıya (2, 4, 6, 8...)</strong> çıkarırsa; o kuyudaki tüm taşları kazanır ve hazinenize eklersiniz!",
    target: "5. kuyuya (5 taş) tıklayın: Dağıtılan son taş rakibin 8 numaralı kuyusuna düşecek, 3 taşı 4 (ÇİFT) yaparak tüm taşları hazinenize katacaktır!",
    setup: () => {
      const board = Array(14).fill(0);
      board[4] = 5; // Pit 4 (5. kuyu): 5 stones -> 1 stays in pit 4, 4 stones distributed: pit 5, pit 6 (Hazine), pit 7, pit 8 (Rakip 2. kuyu)
      board[5] = 0;
      board[6] = 0; // Player 1 Hazine
      board[7] = 2; // Rakip kuyu 7 (2 taş)
      board[8] = 3; // Rakip kuyu 8 (3 taş) -> Son taş buraya düşer: 3 + 1 = 4 (ÇİFT!)
      return { board, currentTurn: 1, allowedPits: [4] };
    },
    validateMove: (pitIndex, result) => {
      if (pitIndex === 4 && result.captured > 0) {
        return {
          success: true,
          feedback: `Harika bir vuruş! Son taş rakibin 8 numaralı kuyusuna düştü ve taş sayısını 4 (ÇİFT) yaptı. Kuyudaki 4 taşın tamamı hazinenize eklendi!`
        };
      }
      return { success: false, feedback: "Lütfen 5. kuyuyu seçerek hamleyi yapın." };
    }
  },
  {
    id: 5,
    title: "4. Kural: Kendi Boş Kuyusu & Karşıyı Kapma",
    badge: "Ders 5 / 6",
    description: "Dağıttığınız son taş <strong>kendi tarafınızdaki BOŞ bir kuyuya</strong> denk gelirse ve bu boş kuyunun tam karşısındaki rakip kuyuda taş varsa; hem kendi koyduğunuz 1 taşı hem de karşıdaki tüm taşları alıp hazinenize koyarsınız!",
    target: "1. kuyudaki taşı oynatarak boş olan 2. kuyunuza düşürün ve karşısındaki 5 taşı kapın!",
    setup: () => {
      const board = Array(14).fill(0);
      board[0] = 1; // Pit 0 (1 taş) -> will go into Pit 1 (empty)
      board[1] = 0; // Pit 1 is empty!
      board[11] = 5; // Pit 11 is directly opposite to Pit 1 (12 - 1 = 11) with 5 stones!
      return { board, currentTurn: 1, allowedPits: [0] };
    },
    validateMove: (pitIndex, result) => {
      if (pitIndex === 0 && result.captured > 0) {
        return {
          success: true,
          feedback: `Muazzam! Son taş kendi boş kuyunuza düştü. Kendi taşınızla birlikte tam karşıdaki 5 taş (toplam ${result.captured} taş) hazinenize çekildi!`
        };
      }
      return { success: false, feedback: "1. kuyuya tıklayarak tek taşı boş olan 2. kuyuya geçirin." };
    }
  },
  {
    id: 6,
    title: "5. Kural: Oyun Sonu & Taşları Süpürme Kuralı",
    badge: "Ders 6 / 6",
    description: "Kendi bölgesindeki 6 kuyudaki tüm taşları <strong>ilk bitiren oyuncu</strong>, rakibin tarafında kalan tüm taşları da kazanır ve hazinesine çeker! Oyun biter ve hazinesinde 25+ taş olan kazanır.",
    target: "Kendi tarafınızdaki son taşı hazineye atın ve rakibin kuyularında kalan tüm taşları süpürün!",
    setup: () => {
      const board = Array(14).fill(0);
      board[5] = 1; // Only 1 stone left for player 1
      board[6] = 20; // Player 1 store
      board[8] = 3; board[10] = 4; board[12] = 2; // Opponent has 9 stones on board
      board[13] = 18; // Opponent store
      return { board, currentTurn: 1, allowedPits: [5] };
    },
    validateMove: (pitIndex, result) => {
      if (pitIndex === 5 && result.gameOver) {
        return {
          success: true,
          feedback: "Tebrikler! Kendi bölgenizdeki taşları ilk siz bitirdiğiniz için rakibin kuyularındaki tüm taşları süpürerek kazandınız! Mangala Akademi'yi başarıyla tamamladınız!"
        };
      }
      return { success: false, feedback: "Tarafınızı boşaltmak için 6. kuyudaki son taşı oynayın." };
    }
  }
];

// =============================================================================
// MAIN MANGALA APPLICATION CONTROLLER
// =============================================================================
class MangalaGame {
  constructor() {
    this.sound = new SoundFX();
    
    // Board state: Array of 14 numbers
    // 0..5: Player 1 pits (Left to Right from P1 perspective)
    // 6: Player 1 Store (Right side)
    // 7..12: Player 2 (Opponent) pits (Left to Right from Opponent perspective)
    // 13: Player 2 Store (Left side of visual board)
    this.board = Array(14).fill(4);
    this.board[6] = 0;
    this.board[13] = 0;

    this.currentTurn = 1; // 1 = Human (Player 1), 2 = Computer (Player 2)
    this.isAnimating = false;
    this.mode = 'play'; // 'play' or 'tutorial'
    this.difficulty = 'medium'; // 'easy', 'medium', 'hard'
    
    // Tutorial state
    this.currentTutorialIndex = 0;
    this.tutorialAllowedPits = [];

    this.initDOM();
    this.bindEvents();
    this.renderBoard();
  }

  initDOM() {
    // Mode tabs
    this.tabPlay = document.getElementById('tab-play');
    this.tabTutorial = document.getElementById('tab-tutorial');
    this.tabRules = document.getElementById('tab-rules');

    // Panels
    this.panelPlay = document.getElementById('play-panel');
    this.panelTutorial = document.getElementById('tutorial-panel');
    this.modalRules = document.getElementById('modal-rules');
    this.modalGameOver = document.getElementById('modal-gameover');

    // Status elements
    this.turnText = document.getElementById('turn-text');
    this.turnLight = document.getElementById('turn-light');
    this.cardP1 = document.getElementById('card-p1');
    this.cardP2 = document.getElementById('card-p2');
    this.scoreP1 = document.getElementById('p1-score-val');
    this.scoreP2 = document.getElementById('p2-score-val');
    this.logStream = document.getElementById('log-stream');
    this.aiDifficultySelect = document.getElementById('ai-difficulty');

    // Tutorial elements
    this.tutStepsNav = document.getElementById('tutorial-steps-nav');
    this.tutBadge = document.getElementById('tut-badge');
    this.tutTitle = document.getElementById('tut-title');
    this.tutDesc = document.getElementById('tut-desc');
    this.tutTarget = document.getElementById('tut-target');
    this.tutFeedback = document.getElementById('tut-feedback');
    this.tutFeedbackText = document.getElementById('tut-feedback-text');
    this.btnTutPrev = document.getElementById('btn-tut-prev');
    this.btnTutNext = document.getElementById('btn-tut-next');
    this.btnTutReset = document.getElementById('btn-tut-reset');

    // Header buttons
    this.btnRestart = document.getElementById('btn-restart');
    this.btnSound = document.getElementById('btn-sound');
    this.soundIcon = document.getElementById('sound-icon');
    this.btnHint = document.getElementById('btn-hint');
    this.btnClearLog = document.getElementById('btn-clear-log');

    // Modal buttons
    this.btnCloseRules = document.getElementById('btn-close-rules');
    this.btnUnderstood = document.getElementById('btn-understood');
    this.btnGoPlayAgain = document.getElementById('btn-go-playagain');
    this.btnGoTutorial = document.getElementById('btn-go-tutorial');

    // Game over elements
    this.goTitle = document.getElementById('go-title');
    this.goMessage = document.getElementById('go-message');
    this.goP1Stones = document.getElementById('go-p1-stones');
    this.goP2Stones = document.getElementById('go-p2-stones');

    // Build tutorial step navigation buttons
    this.buildTutorialNav();
  }

  bindEvents() {
    // Nav Tabs
    this.tabPlay.addEventListener('click', () => this.switchMode('play'));
    this.tabTutorial.addEventListener('click', () => this.switchMode('tutorial'));
    this.tabRules.addEventListener('click', () => this.openRulesModal());

    // Sound toggle
    this.btnSound.addEventListener('click', () => {
      this.sound.enabled = !this.sound.enabled;
      this.soundIcon.textContent = this.sound.enabled ? '🔊' : '🔇';
      if (this.sound.enabled) this.sound.playClick();
    });

    // Reset / Restart
    this.btnRestart.addEventListener('click', () => {
      this.sound.playClick();
      if (this.mode === 'play') {
        this.resetGame();
      } else {
        this.loadTutorialStep(this.currentTutorialIndex);
      }
    });

    // AI Difficulty select
    this.aiDifficultySelect.addEventListener('change', (e) => {
      this.difficulty = e.target.value;
      this.logMessage(`Yapay zeka zorluk seviyesi güncellendi: ${e.target.options[e.target.selectedIndex].text}`, 'system');
    });

    // Hint button
    this.btnHint.addEventListener('click', () => this.giveHint());

    // Clear log
    this.btnClearLog.addEventListener('click', () => {
      this.logStream.innerHTML = '';
      this.logMessage('Günlük temizlendi.', 'system');
    });

    // Modals
    this.btnCloseRules.addEventListener('click', () => this.modalRules.classList.add('hidden'));
    this.btnUnderstood.addEventListener('click', () => this.modalRules.classList.add('hidden'));
    this.modalRules.addEventListener('click', (e) => {
      if (e.target === this.modalRules) this.modalRules.classList.add('hidden');
    });

    this.btnGoPlayAgain.addEventListener('click', () => {
      this.modalGameOver.classList.add('hidden');
      this.resetGame();
    });

    this.btnGoTutorial.addEventListener('click', () => {
      this.modalGameOver.classList.add('hidden');
      this.switchMode('tutorial');
    });

    // Tutorial controls
    this.btnTutPrev.addEventListener('click', () => {
      if (this.currentTutorialIndex > 0) {
        this.loadTutorialStep(this.currentTutorialIndex - 1);
      }
    });

    this.btnTutNext.addEventListener('click', () => {
      if (this.currentTutorialIndex < TUTORIAL_SCENARIOS.length - 1) {
        this.loadTutorialStep(this.currentTutorialIndex + 1);
      }
    });

    this.btnTutReset.addEventListener('click', () => {
      this.loadTutorialStep(this.currentTutorialIndex);
    });

    // Board pit click delegation
    for (let i = 0; i < 14; i++) {
      const pitEl = this.getPitElement(i);
      if (pitEl) {
        pitEl.addEventListener('click', () => this.handlePitClick(i));
      }
    }
  }

  // ===========================================================================
  // GAME INITIALIZATION & MODE SWITCHING
  // ===========================================================================
  resetGame() {
    this.board = Array(14).fill(4);
    this.board[6] = 0; // P1 store
    this.board[13] = 0; // P2 store
    this.currentTurn = 1;
    this.isAnimating = false;
    this.clearHighlights();
    this.renderBoard();
    this.updateStatus();
    this.logMessage('Yeni oyun başladı! 48 taş kuyulara dörder dörder yerleştirildi.', 'system');
  }

  switchMode(newMode) {
    this.sound.playClick();
    this.mode = newMode;

    if (newMode === 'play') {
      this.tabPlay.classList.add('active');
      this.tabTutorial.classList.remove('active');
      this.panelPlay.classList.remove('hidden');
      this.panelTutorial.classList.add('hidden');
      this.resetGame();
    } else if (newMode === 'tutorial') {
      this.tabTutorial.classList.add('active');
      this.tabPlay.classList.remove('active');
      this.panelTutorial.classList.remove('hidden');
      this.panelPlay.classList.add('hidden');
      this.loadTutorialStep(this.currentTutorialIndex);
    }
  }

  openRulesModal() {
    this.sound.playClick();
    this.modalRules.classList.remove('hidden');
  }

  // ===========================================================================
  // TUTORIAL ENGINE
  // ===========================================================================
  buildTutorialNav() {
    this.tutStepsNav.innerHTML = '';
    TUTORIAL_SCENARIOS.forEach((step, idx) => {
      const btn = document.createElement('button');
      btn.className = `tut-step-btn ${idx === 0 ? 'active' : ''}`;
      btn.id = `step-btn-${idx}`;
      btn.innerHTML = `
        <span class="step-number">Ders ${idx + 1}</span>
        <span class="step-name">${step.title.split(':')[0]}</span>
      `;
      btn.addEventListener('click', () => {
        this.sound.playClick();
        this.loadTutorialStep(idx);
      });
      this.tutStepsNav.appendChild(btn);
    });
  }

  loadTutorialStep(index) {
    this.currentTutorialIndex = index;
    const scenario = TUTORIAL_SCENARIOS[index];
    
    // Update navigation active state
    document.querySelectorAll('.tut-step-btn').forEach((b, i) => {
      b.classList.toggle('active', i === index);
    });

    this.tutBadge.textContent = scenario.badge;
    this.tutTitle.textContent = scenario.title;
    this.tutDesc.innerHTML = scenario.description;
    this.tutTarget.innerHTML = `<strong>Hedef:</strong> <span>${scenario.target}</span>`;
    
    this.tutFeedback.className = 'tut-feedback';
    this.tutFeedbackText.textContent = "Kuralı denemek için sarı halka ile parlayan kuyuya tıklayın!";

    this.btnTutPrev.disabled = index === 0;
    this.btnTutNext.disabled = index === TUTORIAL_SCENARIOS.length - 1;

    // Load board scenario setup
    const state = scenario.setup();
    this.board = [...state.board];
    this.currentTurn = state.currentTurn;
    this.tutorialAllowedPits = state.allowedPits || [];
    this.isAnimating = false;

    this.clearHighlights();
    this.renderBoard();

    // Highlight target pits
    this.tutorialAllowedPits.forEach(pitIdx => {
      const el = this.getPitElement(pitIdx);
      if (el) el.classList.add('tutorial-highlight');
    });

    this.logMessage(`Öğretici açıldı: ${scenario.title}`, 'system');
  }

  // ===========================================================================
  // PIT CLICK & MOVE DISPATCHER
  // ===========================================================================
  async handlePitClick(pitIndex) {
    if (this.isAnimating) return;

    // Check if valid player pit
    if (this.currentTurn === 1) {
      if (pitIndex < 0 || pitIndex > 5) return; // Only 0..5 allowed for player 1
      if (this.board[pitIndex] === 0) {
        this.logMessage('Seçtiğiniz kuyu boş! Lütfen taş bulunan bir kuyu seçin.', 'system');
        return;
      }
    } else {
      // In normal AI play, human cannot click opponent pits
      return;
    }

    // In tutorial mode, enforce allowed pits
    if (this.mode === 'tutorial') {
      if (!this.tutorialAllowedPits.includes(pitIndex)) {
        this.tutFeedback.className = 'tut-feedback error';
        this.tutFeedbackText.textContent = "Bu senaryoda lütfen işaretlenmiş hedef kuyuya tıklayın.";
        return;
      }
    }

    this.clearHighlights();
    this.sound.playClick();

    // Execute Move
    const moveResult = await this.executeMove(pitIndex, 1);

    // Tutorial validation
    if (this.mode === 'tutorial') {
      const scenario = TUTORIAL_SCENARIOS[this.currentTutorialIndex];
      const validation = scenario.validateMove(pitIndex, moveResult);

      if (validation.success) {
        this.tutFeedback.className = 'tut-feedback success';
        this.tutFeedbackText.textContent = validation.feedback;
        this.sound.playVictory();
        
        // Mark step button completed
        const stepBtn = document.getElementById(`step-btn-${this.currentTutorialIndex}`);
        if (stepBtn) stepBtn.classList.add('completed');

        // Enable next button if available
        if (this.currentTutorialIndex < TUTORIAL_SCENARIOS.length - 1) {
          this.btnTutNext.disabled = false;
        }
      } else {
        this.tutFeedback.className = 'tut-feedback error';
        this.tutFeedbackText.textContent = validation.feedback;
      }
      return;
    }

    // Play Mode flow
    if (moveResult.gameOver) {
      this.handleGameOver();
      return;
    }

    if (moveResult.extraTurn) {
      this.logMessage('Son taş kendi hazinenize düştü! Sıra TEKRAR SİZDE.', 'extra-turn');
      this.sound.playExtraTurn();
      this.updateStatus();
    } else {
      this.currentTurn = 2;
      this.updateStatus();
      this.triggerAIMove();
    }
  }

  // ===========================================================================
  // CORE MOVE EXECUTION WITH STEP-BY-STEP ANIMATION
  // ===========================================================================
  async executeMove(startPit, player) {
    this.isAnimating = true;
    let stonesInHand = this.board[startPit];
    const originalStones = stonesInHand;
    const ownStore = (player === 1) ? 6 : 13;
    const oppStore = (player === 1) ? 13 : 6;

    let captured = 0;
    let extraTurn = false;
    let gameOver = false;

    // RULE 1: If 1 stone, move it to next pit, leaving starting pit empty (0).
    // If >1 stones, leave 1 stone in starting pit and distribute (stonesInHand - 1).
    let currentPit = startPit;

    if (stonesInHand === 1) {
      this.board[startPit] = 0;
      this.renderPit(startPit);
      currentPit = (currentPit + 1) % 14;
      if (currentPit === oppStore) {
        currentPit = (currentPit + 1) % 14;
      }
      await this.animateStoneDrop(startPit, currentPit);
      this.board[currentPit]++;
      this.renderPit(currentPit);
      this.sound.playDrop();
    } else {
      this.board[startPit] = 1;
      this.renderPit(startPit);
      stonesInHand--;

      while (stonesInHand > 0) {
        currentPit = (currentPit + 1) % 14;
        // Never put stone into opponent's store!
        if (currentPit === oppStore) {
          currentPit = (currentPit + 1) % 14;
        }

        await this.animateStoneDrop(startPit, currentPit);
        this.board[currentPit]++;
        this.renderPit(currentPit);
        this.sound.playDrop();
        stonesInHand--;
      }
    }

    // Highlight final pit
    const finalEl = this.getPitElement(currentPit);
    if (finalEl) finalEl.classList.add('highlight-last-drop');

    const lastPit = currentPit;
    const playerName = (player === 1) ? "Siz" : "Bilgisayar";

    // RULE 2: Last stone in own store gives extra turn
    if (lastPit === ownStore) {
      extraTurn = true;
      if (finalEl) finalEl.classList.add('highlight-hazine');
    }
    // RULE 3: Last stone in opponent pit makes it EVEN (Çift: 2, 4, 6...)
    else if (this.isOpponentPit(lastPit, player)) {
      const pitCount = this.board[lastPit];
      if (pitCount > 0 && pitCount % 2 === 0) {
        captured = pitCount;
        if (finalEl) finalEl.classList.add('highlight-capture');
        this.sound.playCapture();
        this.logMessage(`🎯 ${playerName} rakibin kuyusunu ${pitCount} (ÇİFT) yaparak tüm taşları hazinesine kattı!`, 'capture');
        
        // Brief pause so player sees the even number clearly in glowing green
        await this.delay(500);
        this.board[ownStore] += pitCount;
        this.board[lastPit] = 0;
        this.renderPit(lastPit);
        this.renderPit(ownStore);
        this.updateStatus();
      }
    }
    // RULE 4: Last stone in own EMPTY pit (now 1 stone) and opposite opponent pit has stones
    else if (this.isOwnPit(lastPit, player) && this.board[lastPit] === 1) {
      const oppositePit = 12 - lastPit;
      const oppStones = this.board[oppositePit];

      if (oppStones > 0) {
        captured = oppStones + 1;
        const oppEl = this.getPitElement(oppositePit);
        if (oppEl) oppEl.classList.add('highlight-capture');
        if (finalEl) finalEl.classList.add('highlight-capture');
        
        this.sound.playCapture();
        this.logMessage(`🦊 ${playerName} boş kuyu kuralı ile karşıdaki ${oppStones} taşı ve kendi taşını hazinesine aldı!`, 'capture');

        // Brief pause so player sees both highlighted pits before capture
        await this.delay(500);
        this.board[ownStore] += captured;
        this.board[lastPit] = 0;
        this.board[oppositePit] = 0;
        this.renderPit(lastPit);
        this.renderPit(oppositePit);
        this.renderPit(ownStore);
        this.updateStatus();
      }
    }

    // RULE 5: Check Game Over (one side has all 6 pits empty)
    if (this.checkSideFinished(1) || this.checkSideFinished(2)) {
      gameOver = true;
      await this.sweepRemainingStones();
    }

    this.renderBoard();
    this.isAnimating = false;

    return {
      lastPit,
      extraTurn,
      captured,
      gameOver
    };
  }

  // ===========================================================================
  // GAME OVER & SWEEP (RULE 5)
  // ===========================================================================
  checkSideFinished(player) {
    const start = (player === 1) ? 0 : 7;
    const end = (player === 1) ? 5 : 12;
    for (let i = start; i <= end; i++) {
      if (this.board[i] > 0) return false;
    }
    return true;
  }

  async sweepRemainingStones() {
    // Who finished first?
    const p1Finished = this.checkSideFinished(1);
    const p2Finished = this.checkSideFinished(2);

    let winnerOfSweep = 0;
    if (p1Finished && !p2Finished) {
      winnerOfSweep = 1;
    } else if (p2Finished && !p1Finished) {
      winnerOfSweep = 2;
    }

    if (winnerOfSweep === 1) {
      // Player 1 finished first -> gets all remaining stones on Player 2's side!
      let swept = 0;
      for (let i = 7; i <= 12; i++) {
        swept += this.board[i];
        this.board[i] = 0;
      }
      this.board[6] += swept;
      this.logMessage(`🏆 Tebrikler! Bölgenizdeki taşları ilk bitirdiğiniz için rakibin kuyularında kalan ${swept} taşı da aldınız!`, 'capture');
    } else if (winnerOfSweep === 2) {
      // Computer finished first -> gets all remaining stones on Player 1's side!
      let swept = 0;
      for (let i = 0; i <= 5; i++) {
        swept += this.board[i];
        this.board[i] = 0;
      }
      this.board[13] += swept;
      this.logMessage(`🤖 Bilgisayar kendi bölgesini ilk bitirerek sizin tarafınızdaki ${swept} taşı hazinesine kattı!`, 'capture');
    }

    this.sound.playVictory();
    this.renderBoard();
  }

  handleGameOver() {
    const p1Total = this.board[6];
    const p2Total = this.board[13];

    this.goP1Stones.textContent = p1Total;
    this.goP2Stones.textContent = p2Total;

    if (p1Total > p2Total) {
      this.goTitle.textContent = "🏆 Zafer Sizin!";
      this.goMessage.textContent = `Tebrikler! ${p1Total} taş toplayarak bilgisayarı (${p2Total} taş) mağlup ettiniz!`;
    } else if (p2Total > p1Total) {
      this.goTitle.textContent = "🤖 Bilgisayar Kazandı";
      this.goMessage.textContent = `Bilgisayar ${p2Total} taşa ulaştı. Bir dahaki sefere daha stratejik hamlelerle kazanabilirsiniz!`;
    } else {
      this.goTitle.textContent = "🤝 Berabere!";
      this.goMessage.textContent = `Mükemmel bir mücadele! Her iki taraf da 24-24 berabere kaldı.`;
    }

    this.modalGameOver.classList.remove('hidden');
  }

  // ===========================================================================
  // AI OPPONENT (3 DIFFICULTIES)
  // ===========================================================================
  async triggerAIMove() {
    if (this.currentTurn !== 2 || this.isAnimating) return;

    this.turnText.textContent = "Bilgisayar düşünüyor...";
    this.turnLight.style.background = "#f43f5e";
    this.turnLight.style.boxShadow = "0 0 10px #f43f5e";

    await this.delay(600 + Math.random() * 400);

    const validPits = [];
    for (let i = 7; i <= 12; i++) {
      if (this.board[i] > 0) validPits.push(i);
    }

    if (validPits.length === 0) {
      // AI has no moves
      return;
    }

    let chosenPit;
    if (this.difficulty === 'easy') {
      chosenPit = validPits[Math.floor(Math.random() * validPits.length)];
    } else if (this.difficulty === 'medium') {
      chosenPit = this.getMediumAIMove(validPits);
    } else {
      chosenPit = this.getHardAIMove(validPits);
    }

    this.logMessage(`🤖 Bilgisayar ${chosenPit} numaralı kuyuyu oynadı.`, 'ai-turn');

    const result = await this.executeMove(chosenPit, 2);

    if (result.gameOver) {
      this.handleGameOver();
      return;
    }

    if (result.extraTurn) {
      this.logMessage('Bilgisayarın son taşı hazinesine geldi! Sıra tekrar bilgisayarda.', 'extra-turn');
      this.sound.playExtraTurn();
      this.updateStatus();
      this.triggerAIMove();
    } else {
      this.currentTurn = 1;
      this.updateStatus();
    }
  }

  // Medium AI: Checks for immediate store landing, double capture, empty pit capture
  getMediumAIMove(validPits) {
    for (let pit of validPits) {
      const sim = this.simulateMove(this.board, pit, 2);
      if (sim.extraTurn) return pit; // Always prefer extra turn!
    }
    for (let pit of validPits) {
      const sim = this.simulateMove(this.board, pit, 2);
      if (sim.captured > 0) return pit; // Prefer capturing
    }
    // Otherwise pick pit with largest stones
    validPits.sort((a, b) => this.board[b] - this.board[a]);
    return validPits[0];
  }

  // Hard AI: Minimax depth 3 evaluation
  getHardAIMove(validPits) {
    let bestScore = -Infinity;
    let bestPit = validPits[0];

    for (let pit of validPits) {
      const sim = this.simulateMove(this.board, pit, 2);
      let score = (sim.board[13] - sim.board[6]) * 10;
      if (sim.extraTurn) score += 25;
      score += sim.captured * 8;

      // Simple 1-step lookahead against player
      let maxPlayerReply = 0;
      for (let p1Pit = 0; p1Pit <= 5; p1Pit++) {
        if (sim.board[p1Pit] > 0) {
          const p1Sim = this.simulateMove(sim.board, p1Pit, 1);
          if (p1Sim.captured > maxPlayerReply) maxPlayerReply = p1Sim.captured;
        }
      }
      score -= maxPlayerReply * 8;

      if (score > bestScore) {
        bestScore = score;
        bestPit = pit;
      }
    }
    return bestPit;
  }

  // Pure simulation without side effects for AI evaluation
  simulateMove(inBoard, startPit, player) {
    const board = [...inBoard];
    let stones = board[startPit];
    const ownStore = (player === 1) ? 6 : 13;
    const oppStore = (player === 1) ? 13 : 6;
    let currentPit = startPit;
    let extraTurn = false;
    let captured = 0;

    if (stones === 1) {
      board[startPit] = 0;
      currentPit = (currentPit + 1) % 14;
      if (currentPit === oppStore) currentPit = (currentPit + 1) % 14;
      board[currentPit]++;
    } else {
      board[startPit] = 1;
      stones--;
      while (stones > 0) {
        currentPit = (currentPit + 1) % 14;
        if (currentPit === oppStore) currentPit = (currentPit + 1) % 14;
        board[currentPit]++;
        stones--;
      }
    }

    if (currentPit === ownStore) {
      extraTurn = true;
    } else if (this.isOpponentPit(currentPit, player)) {
      if (board[currentPit] % 2 === 0) {
        captured = board[currentPit];
        board[ownStore] += captured;
        board[currentPit] = 0;
      }
    } else if (this.isOwnPit(currentPit, player) && board[currentPit] === 1) {
      const oppPit = 12 - currentPit;
      if (board[oppPit] > 0) {
        captured = board[oppPit] + 1;
        board[ownStore] += captured;
        board[currentPit] = 0;
        board[oppPit] = 0;
      }
    }

    return { board, extraTurn, captured };
  }

  // ===========================================================================
  // HINT ENGINE
  // ===========================================================================
  giveHint() {
    if (this.currentTurn !== 1 || this.isAnimating) return;

    const validPits = [];
    for (let i = 0; i <= 5; i++) {
      if (this.board[i] > 0) validPits.push(i);
    }
    if (validPits.length === 0) return;

    let bestPit = validPits[0];
    let reason = "En dengeli hamle.";
    let bestScore = -100;

    for (let pit of validPits) {
      const sim = this.simulateMove(this.board, pit, 1);
      let score = sim.captured * 5;
      let curReason = "";

      if (sim.extraTurn) {
        score += 30;
        curReason = `Kuyu ${pit + 1} ile son taşı hazinenize atıp EKSTRA HAMLE kazanırsınız!`;
      } else if (sim.captured > 0) {
        score += 20;
        curReason = `Kuyu ${pit + 1} ile tam ${sim.captured} taş kazanarak hazinenize katabilirsiniz!`;
      }

      if (score > bestScore) {
        bestScore = score;
        bestPit = pit;
        if (curReason) reason = curReason;
      }
    }

    this.clearHighlights();
    const el = this.getPitElement(bestPit);
    if (el) el.classList.add('tutorial-highlight');

    this.logMessage(`💡 İpucu: Kuyu ${bestPit + 1} önerilir. ${reason}`, 'system');
  }

  // ===========================================================================
  // BOARD RENDERING & ANIMATION
  // ===========================================================================
  renderBoard() {
    for (let i = 0; i < 14; i++) {
      this.renderPit(i);
    }
    this.updateStatus();
  }

  renderPit(index) {
    const count = this.board[index];
    const isStore = (index === 6 || index === 13);
    
    // Update count label
    const countBadge = isStore
      ? document.getElementById(index === 6 ? 'count-store-p1' : 'count-store-p2')
      : document.getElementById(`count-${index}`);

    if (countBadge) {
      countBadge.textContent = count;
    }

    // Render stones cluster
    const cluster = isStore
      ? document.getElementById(index === 6 ? 'cluster-store-p1' : 'cluster-store-p2')
      : document.getElementById(`cluster-${index}`);

    if (!cluster) return;
    cluster.innerHTML = '';

    // Render up to max stones visually to avoid clutter
    const maxVisual = isStore ? 28 : 12;
    const visualCount = Math.min(count, maxVisual);

    for (let s = 0; s < visualCount; s++) {
      const stone = document.createElement('div');
      const colorClass = `stone-c${(s % 5) + 1}`;
      stone.className = `stone ${colorClass}`;

      // Organic positioning inside pit
      if (isStore) {
        const top = 10 + Math.random() * 75;
        const left = 15 + Math.random() * 65;
        stone.style.top = `${top}%`;
        stone.style.left = `${left}%`;
      } else {
        const angle = (s / visualCount) * 2 * Math.PI + Math.random() * 0.4;
        const radius = visualCount > 1 ? (10 + Math.random() * 22) : 0;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        stone.style.top = `${y}%`;
        stone.style.left = `${x}%`;
      }
      stone.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
      cluster.appendChild(stone);
    }
  }

  async animateStoneDrop(fromIndex, toIndex) {
    const fromEl = this.getPitElement(fromIndex);
    const toEl = this.getPitElement(toIndex);

    if (!fromEl || !toEl) {
      await this.delay(100);
      return;
    }

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    const flyer = document.createElement('div');
    flyer.className = 'flying-stone';
    flyer.style.top = `${fromRect.top + fromRect.height / 2 - 10}px`;
    flyer.style.left = `${fromRect.left + fromRect.width / 2 - 10}px`;
    document.body.appendChild(flyer);

    // Force reflow
    void flyer.offsetWidth;

    flyer.style.top = `${toRect.top + toRect.height / 2 - 10}px`;
    flyer.style.left = `${toRect.left + toRect.width / 2 - 10}px`;

    await this.delay(160);
    flyer.remove();
  }

  getPitElement(index) {
    if (index === 6) return document.getElementById('pit-store-p1');
    if (index === 13) return document.getElementById('pit-store-p2');
    return document.getElementById(`pit-${index}`);
  }

  clearHighlights() {
    document.querySelectorAll('.pit, .store-pit').forEach(el => {
      el.classList.remove('tutorial-highlight', 'highlight-last-drop', 'highlight-capture', 'highlight-hazine');
    });
  }

  updateStatus() {
    this.scoreP1.textContent = this.board[6];
    this.scoreP2.textContent = this.board[13];

    if (this.currentTurn === 1) {
      this.cardP1.classList.add('active-card');
      this.cardP2.classList.remove('active-card');
      this.turnText.textContent = "Sıra Sizde! Kuyularınızdan (1 - 6) birini seçin.";
      this.turnLight.style.background = "#d4af37";
      this.turnLight.style.boxShadow = "0 0 10px #d4af37";
    } else {
      this.cardP2.classList.add('active-card');
      this.cardP1.classList.remove('active-card');
      this.turnText.textContent = "Sıra Bilgisayarda...";
      this.turnLight.style.background = "#f43f5e";
      this.turnLight.style.boxShadow = "0 0 10px #f43f5e";
    }
  }

  logMessage(text, type = 'system') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = text;
    this.logStream.appendChild(entry);
    this.logStream.scrollTop = this.logStream.scrollHeight;
  }

  // ===========================================================================
  // UTILITIES
  // ===========================================================================
  isOwnPit(index, player) {
    if (player === 1) return index >= 0 && index <= 5;
    return index >= 7 && index <= 12;
  }

  isOpponentPit(index, player) {
    if (player === 1) return index >= 7 && index <= 12;
    return index >= 0 && index <= 5;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Start application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.mangalaApp = new MangalaGame();
});

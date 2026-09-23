/* ============================================================
   PARTH SINGH — AWARD-WINNING INTERACTIVE PORTFOLIO ENGINE
   Cyber-Luxe Systems, Magnetic Cursor, Web Audio, Command Palette & Terminal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. WEB AUDIO SYNTHESIZER SOUND ENGINE ────────────────
  class CyberSoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = false;
      this.initialized = false;
      this.toggleBtn = document.getElementById('sound-toggle');
      this.stateText = document.getElementById('sound-state-text');

      if (this.toggleBtn) {
        this.toggleBtn.addEventListener('click', () => this.toggle());
      }

      // Keyboard shortcut 'M' toggles audio anywhere (unless typing in inputs)
      window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'm' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
          this.toggle();
        }
      });
    }

    init() {
      if (this.initialized) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.initialized = true;
        }
      } catch (err) {
        console.warn('Web Audio not supported or blocked:', err);
      }
    }

    toggle() {
      if (!this.initialized) this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.enabled = !this.enabled;
      if (this.toggleBtn) {
        this.toggleBtn.classList.toggle('active', this.enabled);
      }
      if (this.stateText) {
        this.stateText.textContent = this.enabled ? 'ON' : 'OFF';
      }

      showToast(this.enabled ? '🔊 Cyber Audio Enabled (Press M to mute)' : '🔇 Audio Muted', 'info');
      if (this.enabled) this.playChime();
    }

    playHover() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.025);
        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.025);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.025);
      } catch (e) {}
    }

    playClick() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(420, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.035);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.035);
      } catch (e) {}
    }

    playChime() {
      if (!this.enabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0.04, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.18);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.18);
        });
      } catch (e) {}
    }
  }

  const sound = new CyberSoundEngine();

  // Attach sound feedback to key interactive elements
  function attachSoundHooks() {
    const hoverables = document.querySelectorAll('a, button, .pfilter-btn, .arch-tab-btn, .hero-social-pill, .bento-card');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => sound.playHover(), { passive: true });
      el.addEventListener('click', () => sound.playClick(), { passive: true });
    });
  }
  attachSoundHooks();

  // ─── 2. PRECISION MAGNETIC & CONTEXTUAL CURSOR ────────────
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const cursorLabel = document.getElementById('cursor-label');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isVisible = false;
    let targetMagnetic = null;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        cursorDot.classList.add('visible');
        cursorRing.classList.add('visible');
        isVisible = true;
      }

      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('visible');
      cursorRing.classList.remove('visible');
      isVisible = false;
    });

    window.addEventListener('mousedown', () => {
      document.body.classList.add('cursor-clicking');
    });

    window.addEventListener('mouseup', () => {
      document.body.classList.remove('cursor-clicking');
    });

    // Magnetic pulling loop with fluid damping
    function renderCursor() {
      let targetX = mouseX;
      let targetY = mouseY;

      if (targetMagnetic) {
        const rect = targetMagnetic.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // 35% magnetic pull toward center
        targetX = mouseX + (centerX - mouseX) * 0.35;
        targetY = mouseY + (centerY - mouseY) * 0.35;
      }

      ringX += (targetX - ringX) * 0.2;
      ringY += (targetY - ringY) * 0.2;

      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Contextual Hover Handlers
    function bindCursorContexts() {
      // Magnetic targets
      const magnetics = document.querySelectorAll('.magnetic-target, .hero-social-pill, .btn, .arch-tab-btn, .pfilter-btn');
      magnetics.forEach(el => {
        el.addEventListener('mouseenter', () => {
          targetMagnetic = el;
          document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
          targetMagnetic = null;
          document.body.classList.remove('cursor-hover');
        });
      });

      // Project Cards (View Badge)
      const projectCards = document.querySelectorAll('.bento-card');
      projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          document.body.classList.add('cursor-view');
          if (cursorLabel) cursorLabel.textContent = 'EXPLORE ↗';
        });
        card.addEventListener('mouseleave', () => {
          document.body.classList.remove('cursor-view');
          if (cursorLabel) cursorLabel.textContent = '';
        });
      });

      // Custom data-cursor labels
      const labeledElements = document.querySelectorAll('[data-cursor]');
      labeledElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          const label = el.getAttribute('data-cursor');
          if (label && cursorLabel) {
            cursorLabel.textContent = label;
            document.body.classList.add('cursor-hover');
          }
        });
        el.addEventListener('mouseleave', () => {
          if (cursorLabel && !document.body.classList.contains('cursor-view')) {
            cursorLabel.textContent = '';
          }
          document.body.classList.remove('cursor-hover');
        });
      });
    }
    bindCursorContexts();
  }

  // ─── 3. TOP SCROLL PROGRESS BAR & NAV SCROLL BLUR ──────────
  const scrollProgressBar = document.getElementById('scroll-progress');
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${progress}%`;
    }

    if (nav) {
      if (window.scrollY > 30) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // ─── 4. AMBIENT MOUSE SPOTLIGHT GLOW ──────────────────────
  const mouseGlow = document.getElementById('mouse-glow');
  if (mouseGlow) {
    window.addEventListener('pointermove', (e) => {
      mouseGlow.style.left = `${e.clientX}px`;
      mouseGlow.style.top = `${e.clientY}px`;
    }, { passive: true });
  }

  // ─── 5. HERO BACKGROUND CYBER CONSTELLATION CANVAS ────────
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;
    let particles = [];
    const particleCount = 48;
    const packets = ['AES_256', 'SYN_ACK', '0x9F', 'SHA_256', 'TLS_1.3', 'GROQ_LPU', 'LLAMA_3.2'];
    let floatingPackets = [];

    function resizeCanvas() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function initConstellation() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 1.8 + 0.6,
          alpha: Math.random() * 0.45 + 0.1
        });
      }

      floatingPackets = [];
      for (let i = 0; i < 6; i++) {
        floatingPackets.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vy: -0.3 - Math.random() * 0.25,
          text: packets[Math.floor(Math.random() * packets.length)],
          alpha: 0.15 + Math.random() * 0.2
        });
      }
    }

    function drawConstellation() {
      ctx.clearRect(0, 0, W, H);

      // Lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 255, 136, ${(1 - dist / 130) * 0.12})`;
            ctx.lineWidth = 0.65;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      // Draw drifting encrypted packet tokens
      ctx.font = '9px "Space Grotesk", "JetBrains Mono", monospace';
      floatingPackets.forEach(pkt => {
        ctx.fillStyle = `rgba(0, 212, 255, ${pkt.alpha})`;
        ctx.fillText(`[${pkt.text}]`, pkt.x, pkt.y);

        pkt.y += pkt.vy;
        if (pkt.y < -20) {
          pkt.y = H + 20;
          pkt.x = Math.random() * W;
          pkt.text = packets[Math.floor(Math.random() * packets.length)];
        }
      });

      requestAnimationFrame(drawConstellation);
    }

    resizeCanvas();
    initConstellation();
    drawConstellation();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initConstellation();
    }, { passive: true });
  }

  // ─── 6. HACKER TEXT DECRYPT / SCRAMBLE ENGINE ─────────────
  class TextScrambler {
    constructor(element) {
      this.el = element;
      this.originalText = element.getAttribute('data-scramble') || element.textContent;
      this.chars = '!<>-_\\/[]{}—=+*^?#_$%&';
      this.frame = 0;
      this.update = this.update.bind(this);
    }

    scramble() {
      let frame = 0;
      const length = this.originalText.length;
      const duration = 24;

      const step = () => {
        let output = '';
        const progress = frame / duration;
        const resolvedChars = Math.floor(progress * length);

        for (let i = 0; i < length; i++) {
          if (i < resolvedChars) {
            output += this.originalText[i];
          } else {
            output += this.chars[Math.floor(Math.random() * this.chars.length)];
          }
        }

        this.el.innerHTML = output.replace('SINGH', '<span class="gradient-text">SINGH</span>');
        frame++;

        if (frame <= duration) {
          requestAnimationFrame(step);
        } else {
          this.el.innerHTML = this.originalText.replace('SINGH', '<span class="gradient-text">SINGH</span>');
        }
      };
      step();
    }
  }

  const scrambleElements = document.querySelectorAll('[data-scramble]');
  scrambleElements.forEach(el => {
    const scrambler = new TextScrambler(el);
    setTimeout(() => scrambler.scramble(), 300);
    el.addEventListener('mouseenter', () => scrambler.scramble());
  });

  // ─── 8. DYNAMIC ROLE ROTATOR ───────────────────────────────
  const roleItems = document.querySelectorAll('#role-rotator .role-item');
  if (roleItems.length > 0) {
    let currentRoleIdx = 0;
    setInterval(() => {
      roleItems[currentRoleIdx].classList.remove('active');
      currentRoleIdx = (currentRoleIdx + 1) % roleItems.length;
      roleItems[currentRoleIdx].classList.add('active');
    }, 2800);
  }

  // ─── 9. KINETIC BOUNCING NAME ENGINE ───────────────────────
  const kineticLetters = document.querySelectorAll('.k-letter');
  const kineticWrap = document.getElementById('kinetic-name');

  function triggerLetterBounce(letterEl, delay = 0) {
    setTimeout(() => {
      letterEl.classList.remove('bouncing');
      void letterEl.offsetWidth; // trigger reflow
      letterEl.classList.add('bouncing');
      setTimeout(() => letterEl.classList.remove('bouncing'), 700);
    }, delay);
  }

  function triggerWaveBounce() {
    kineticLetters.forEach((letter, idx) => {
      triggerLetterBounce(letter, idx * 55);
    });
  }

  // Initial harmonic wave on load
  setTimeout(triggerWaveBounce, 600);

  // Click on container or individual letters
  if (kineticWrap) {
    kineticWrap.addEventListener('click', (e) => {
      sound.playClick();
      if (e.target && e.target.classList.contains('k-letter')) {
        triggerLetterBounce(e.target, 0);
        const clickedIdx = Array.from(kineticLetters).indexOf(e.target);
        kineticLetters.forEach((letter, idx) => {
          if (letter !== e.target) {
            const dist = Math.abs(idx - clickedIdx);
            triggerLetterBounce(letter, dist * 60);
          }
        });
      } else {
        triggerWaveBounce();
      }
    });
  }

  // Hover on letters gives instant spring bounce
  kineticLetters.forEach(letter => {
    letter.addEventListener('mouseenter', () => {
      if (!letter.classList.contains('bouncing')) {
        triggerLetterBounce(letter, 0);
      }
    });
  });

  // Playful periodic bounce of random letters to keep hero vibrant & alive
  setInterval(() => {
    if (kineticLetters.length > 0 && Math.random() > 0.25) {
      const randomIdx = Math.floor(Math.random() * kineticLetters.length);
      triggerLetterBounce(kineticLetters[randomIdx], 0);
    }
  }, 6000);

  // ─── 10. 3D INTERACTIVE AVATAR, SPEECH & PHOTO TOGGLE ──────
  const avatarCard = document.getElementById('avatar-interactive-card');
  const avatarFloat = document.getElementById('avatar-float');
  const avatarHighlight = document.getElementById('avatar-highlight');
  const avatarSpeech = document.getElementById('avatar-speech');
  const speechText = document.getElementById('speech-text');
  const btnShow3d = document.getElementById('btn-show-3d');
  const btnShowPhoto = document.getElementById('btn-show-photo');
  const layer3d = document.getElementById('layer-3d');
  const layerPhoto = document.getElementById('layer-photo');
  const avatarTapPill = document.getElementById('avatar-tap-pill');
  const avatarDisplayFrame = document.getElementById('avatar-display-frame');

  const parthDialogues = [
    "Hey! I'm Parth 👋 Full-Stack Dev & Security Researcher.",
    "I craft resilient web apps, sub-second RAG systems & hardened APIs.",
    "Click any letter of my name to see them spring & bounce! ⚡",
    "Switch above to 'REAL PHOTO' to see the engineer behind the code!",
    "Got an ambitious product idea? Let's build something epic! 🚀",
    "Try typing 'sudo hire' or 'neofetch' in the terminal below! 💻"
  ];
  let dialogueIdx = 0;

  function cycleDialogue() {
    dialogueIdx = (dialogueIdx + 1) % parthDialogues.length;
    if (avatarSpeech && speechText) {
      avatarSpeech.style.transform = 'translateY(-10px) scale(0.95)';
      avatarSpeech.style.opacity = '0.5';
      setTimeout(() => {
        speechText.textContent = parthDialogues[dialogueIdx];
        avatarSpeech.style.transform = 'translateY(0) scale(1)';
        avatarSpeech.style.opacity = '1';
      }, 150);
      sound.playClick();
    }
  }

  if (avatarCard) {
    // 3D Parallax Tilt on Mouse Move
    avatarCard.addEventListener('mousemove', (e) => {
      const rect = avatarCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((centerY - y) / centerY) * 14;
      const rotateY = ((x - centerX) / centerX) * 14;

      if (avatarFloat) {
        avatarFloat.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(16px) scale(1.02)`;
      }

      if (avatarHighlight) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        avatarHighlight.style.background = `radial-gradient(circle at ${percentX.toFixed(1)}% ${percentY.toFixed(1)}%, rgba(0, 255, 136, 0.28) 0%, transparent 65%)`;
      }
    });

    avatarCard.addEventListener('mouseleave', () => {
      if (avatarFloat) {
        avatarFloat.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
      }
      if (avatarHighlight) {
        avatarHighlight.style.background = 'radial-gradient(circle at 50% 40%, rgba(0, 255, 136, 0.18) 0%, transparent 60%)';
      }
    });
  }

  // Clicking speech bubble, tap pill, or avatar frame cycles speech
  [avatarSpeech, avatarTapPill, avatarDisplayFrame].forEach(el => {
    if (el) {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.avatar-view-toggle')) return;
        cycleDialogue();
      });
    }
  });

  // Toggle between 3D Avatar and Real Photo
  if (btnShow3d && btnShowPhoto && layer3d && layerPhoto) {
    btnShow3d.addEventListener('click', (e) => {
      e.stopPropagation();
      btnShow3d.classList.add('active');
      btnShowPhoto.classList.remove('active');
      layer3d.classList.add('active');
      layerPhoto.classList.remove('active');
      sound.playClick();
    });

    btnShowPhoto.addEventListener('click', (e) => {
      e.stopPropagation();
      btnShowPhoto.classList.add('active');
      btnShow3d.classList.remove('active');
      layerPhoto.classList.add('active');
      layer3d.classList.remove('active');
      sound.playClick();
    });
  }

  // ─── 9. FLAGSHIP ARCHITECTURE TAB SWITCHERS ───────────────
  const archButtons = document.querySelectorAll('.arch-tab-btn');
  archButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const term = btn.getAttribute('data-term');
      const view = btn.getAttribute('data-view');
      if (!term || !view) return;

      sound.playClick();

      // Deactivate sister tabs
      const sisterTabs = document.querySelectorAll(`.arch-tab-btn[data-term="${term}"]`);
      sisterTabs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');

      // Switch pane
      if (term === 'spectre') {
        const panes = document.querySelectorAll('#spectre-terminal .t-view-pane');
        panes.forEach(p => p.classList.remove('active'));
        document.getElementById(`spectre-view-${view}`)?.classList.add('active');
        const titleEl = document.getElementById('spectre-t-title');
        if (titleEl) titleEl.textContent = `spectre-ops-hud // live-${view}`;
      } else if (term === 'nyay') {
        const panes = document.querySelectorAll('#nyaysetu-terminal .t-view-pane');
        panes.forEach(p => p.classList.remove('active'));
        document.getElementById(`nyay-view-${view}`)?.classList.add('active');
        const titleEl = document.getElementById('nyaysetu-t-title');
        if (titleEl) titleEl.textContent = `nyaysetu-core // ${view}-engine`;
      }
    });
  });

  // ─── 10. 3D CARD TILT & SHEEN EFFECT ──────────────────────
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5.0;
      const rotateY = ((x - centerX) / centerX) * 5.0;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // ─── 11. PROJECTS FILTERING ───────────────────────────────
  const filterBtns = document.querySelectorAll('.pfilter-btn');
  const bentoCards = document.querySelectorAll('.bento-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playClick();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      bentoCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 20);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });


  // ─── 14. TOAST NOTIFICATIONS & 1-CLICK EMAIL COPY ─────────
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${type === 'success' ? '⚡' : 'ℹ️'}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function copyEmailToClipboard() {
    const email = 'parth.singh2006@outlook.com';
    navigator.clipboard.writeText(email).then(() => {
      sound.playChime();
      showToast(`Copied to clipboard: ${email} 🚀`);
    }).catch(() => {
      showToast(`Email: ${email}`);
    });
  }

  const copyButtons = document.querySelectorAll('.copy-email-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      copyEmailToClipboard();
    });
  });

  // Copy Draft Text Button
  const copyDraftBtn = document.getElementById('btn-copy-draft');
  if (copyDraftBtn) {
    copyDraftBtn.addEventListener('click', () => {
      const name = document.getElementById('user-name')?.value.trim() || '';
      const email = document.getElementById('user-email')?.value.trim() || '';
      const msg = document.getElementById('user-msg')?.value.trim() || '';

      if (!msg && !name && !email) {
        showToast('Please type a message first!', 'info');
        return;
      }

      let formattedText = '';
      if (name) formattedText += `From: ${name}\n`;
      if (email) formattedText += `Email: ${email}\n`;
      if (formattedText) formattedText += `\n`;
      formattedText += msg;

      navigator.clipboard.writeText(formattedText).then(() => {
        sound.playChime();
        showToast('Message text copied to clipboard! 📋');
      }).catch(() => {
        showToast('Failed to copy text', 'info');
      });
    });
  }

  // ─── 15. IN-BROWSER DIRECT MESSAGE SENDING (FORMSUBMIT AJAX)
  const msgForm = document.getElementById('direct-message-form');
  const sendBtn = document.getElementById('btn-send-message');
  if (msgForm) {
    msgForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('user-name');
      const emailInput = document.getElementById('user-email');
      const msgInput = document.getElementById('user-msg');

      const name = nameInput?.value.trim() || 'Portfolio Visitor';
      const email = emailInput?.value.trim() || '';
      const msg = msgInput?.value.trim() || '';

      if (!msg) {
        showToast('Please enter your message!', 'info');
        return;
      }

      if (!email) {
        showToast('Please provide your email address!', 'info');
        return;
      }

      const originalBtnHtml = sendBtn ? sendBtn.innerHTML : '';
      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = `<span>SENDING...</span> <span class="spinner-inline">⏳</span>`;
      }

      try {
        const response = await fetch('https://formsubmit.co/ajax/parth.singh2006@outlook.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: msg,
            _subject: `⚡ New Portfolio Message from ${name}`,
            _template: 'table'
          })
        });

        if (response.ok) {
          sound.playChime();
          showToast('Message sent directly to Parth! 🚀', 'success');
          msgForm.reset();
          if (sendBtn) {
            sendBtn.innerHTML = `<span>MESSAGE SENT! ✔</span>`;
            setTimeout(() => {
              sendBtn.disabled = false;
              sendBtn.innerHTML = originalBtnHtml;
            }, 3500);
          }
        } else {
          throw new Error('HTTP ' + response.status);
        }
      } catch (err) {
        console.warn('Direct send fallback:', err);
        showToast('Direct delivery unavailable. Opening email fallback...', 'info');
        const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
        const body = encodeURIComponent(`Hello Parth,\n\n${msg}\n\n---\nSender: ${name}\nEmail: ${email}`);
        window.location.href = `mailto:parth.singh2006@outlook.com?subject=${subject}&body=${body}`;
        if (sendBtn) {
          sendBtn.disabled = false;
          sendBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }

  // ─── 16. INTERACTIVE IN-BROWSER CLI TERMINAL ───────────────
  const cliInput = document.getElementById('cli-input');
  const cliOutput = document.getElementById('cli-output');
  const cliCommandsHistory = [];
  let historyIndex = -1;

  const terminalResponses = {
    help: `
<span class="t-cyan">Available commands:</span>
  <span class="t-green">about</span>       - Background &amp; educational profile
  <span class="t-green">journey</span>     - Engineering milestones &amp; timeline
  <span class="t-green">projects</span>    - List flagship security &amp; AI builds
  <span class="t-green">skills</span>      - Technical stack &amp; capabilities
  <span class="t-green">contact</span>     - Direct contact coordinates &amp; phone
  <span class="t-green">socials</span>     - Links to GitHub, LinkedIn, X
  <span class="t-green">matrix</span>      - Trigger digital rain mode
  <span class="t-green">audio</span>       - Toggle cyber audio synthesis
  <span class="t-green">clear</span>       - Clear terminal output
  <span class="t-green">sudo hire</span>   - Check availability for roles
  <span class="t-green">neofetch</span>    - System architecture report`,

    about: `
<span class="t-white">Parth Singh</span> // Security-Focused Builder &amp; Systems Engineer
Location: Kharghar, Navi Mumbai, India (UTC +5:30)
Education: Pillai College of Engineering (B.Tech Information Technology 2024–2028)
Focus: Systems telemetry, counter-surveillance, statutory legal RAG, cryptographic protocols.`,

    journey: `
<span class="t-cyan">Engineering Trajectory:</span>
  • <span class="t-green">2024–2028</span>: Pillai College of Engineering (B.Tech IT)
  • <span class="t-green">2024</span>: Low-level tools (Key-Guard Shannon entropy, Ghost-Net Scapy sniffer)
  • <span class="t-green">2025</span>: SpectreOps (Cyber War Room HUD) &amp; NyaySetu (Statutory Legal RAG)
  • <span class="t-green">NOW</span>: Open to Software Engineering Internships &amp; Early-Stage Startup Roles`,

    projects: `
<span class="t-cyan">Flagship Builds:</span>
  • <span class="t-green">SpectreOps</span> [Electron/Local LLaMA 3.2] - Cyber War Room HUD, live attack map, 1-click Ghost Mode, CVE feeds.
    <a href="https://github.com/PS282006/spectre-ops" target="_blank" class="t-purple">github.com/PS282006/spectre-ops</a>
  • <span class="t-green">NyaySetu</span> [Next.js/FastAPI/Groq LPU] - Statutory Legal RAG over BNS 2023, Wolfram Alpha, voice FIR generator.
    <a href="https://nyay-setu-omega.vercel.app" target="_blank" class="t-cyan">Live Demo: nyay-setu-omega.vercel.app</a>
  • <span class="t-green">Key-Guard</span> [Python] - Automated git secret &amp; token leak scanner with Shannon entropy analysis.
  • <span class="t-green">Ghost-Net</span> [Python/Scapy] - Promiscuous ARP packet monitor &amp; anti-MITM defense.
  • <span class="t-green">Secure-Vault</span> [Python/AES-256-GCM] - Zero-knowledge file vault with PBKDF2 stretching.`,

    skills: `
<span class="t-cyan">Technical Stack:</span>
  <span class="t-white">Systems &amp; Security:</span> Python, Scapy, Cryptography, Linux/Kali, Bash, Socket programming, Nmap, Wireshark.
  <span class="t-white">AI &amp; Backend:</span>       FastAPI, RAG, ChromaDB, Groq LPU (Mixtral), Local Ollama, PostgreSQL.
  <span class="t-white">Client &amp; HUDs:</span>       Electron.js, Next.js, React, TypeScript, Modern CSS/Canvas, WebSocket telemetry.
  <span class="t-white">DevSecOps:</span>           Git pre-commit hooks, Docker, CI/CD Actions.`,

    contact: `
<span class="t-cyan">Direct Contact Coordinates:</span>
  Email:    <span class="t-green">parth.singh2006@outlook.com</span>
  Phone:    <a href="tel:+919137534703" class="t-cyan">+91 9137534703</a>
  Base:     <span class="t-white">Kharghar, Navi Mumbai (IST / UTC+5:30)</span>
  Status:   <span class="t-green">Open to Work (Internships &amp; Early-Stage Teams)</span>`,

    socials: `
<span class="t-cyan">Online Presence:</span>
  • GitHub:   <a href="https://github.com/PS282006" target="_blank" class="t-green">github.com/PS282006</a>
  • LinkedIn: <a href="https://www.linkedin.com/in/parth-singh-ba47ab386" target="_blank" class="t-cyan">linkedin.com/in/parth-singh-ba47ab386</a>
  • X/Twitter:<a href="https://x.com/parth_singh2006" target="_blank" class="t-purple">x.com/parth_singh2006</a>`,

    matrix: `
<span class="t-green">Wake up, Neo...</span>
The Matrix has you. Follow the white rabbit. 🐇
[Terminal systems online · 0 vulnerabilities detected]`,

    audio: `
<span class="t-cyan">Audio Synthesizer status toggled!</span> (Shortcut: Press 'M')`,

    'sudo hire': `
<span class="t-green">[ACCESS GRANTED]</span> Status: READY FOR ACTION.
I am actively open to internship and early-stage startup opportunities remotely.
Send an email directly to <span class="t-cyan">parth.singh2006@outlook.com</span> or call <span class="t-green">+91 9137534703</span>!`,

    neofetch: `
<span class="t-green">       _PS_       </span>  <span class="t-cyan">parth@defence-node</span>
<span class="t-green">     /      \\     </span>  ------------------
<span class="t-green">    |  🛡️    |    </span>  <span class="t-white">OS:</span> macOS Sequoia / Kali Linux
<span class="t-green">    |   🧠   |    </span>  <span class="t-white">Host:</span> Apple Silicon / LLaMA 3.2 Offline Node
<span class="t-green">     \\      /     </span>  <span class="t-white">Uptime:</span> 100% High-Velocity Builder
<span class="t-green">       \\__/       </span>  <span class="t-white">Shell:</span> zsh / Python Systems Tooling
                    <span class="t-white">Memory:</span> 16 GB Unified RAM
                    <span class="t-white">Inference:</span> Groq LPU (480 t/s) + Local Ollama`
  };

  function executeCliCommand(rawCmd) {
    if (!cliOutput) return;
    const cmd = rawCmd.toLowerCase();

    if (rawCmd) {
      cliCommandsHistory.push(rawCmd);
      historyIndex = cliCommandsHistory.length;
    }

    sound.playClick();

    // Print entered command
    const cmdEcho = document.createElement('div');
    cmdEcho.className = 'cli-row';
    cmdEcho.innerHTML = `<span class="t-green">parth@node:~$</span> <span class="t-white">${rawCmd}</span>`;
    cliOutput.appendChild(cmdEcho);

    if (cmd === 'clear') {
      cliOutput.innerHTML = '';
    } else if (cmd === 'matrix') {
      const res = document.createElement('div');
      res.className = 'cli-row';
      res.innerHTML = terminalResponses.matrix;
      cliOutput.appendChild(res);
    } else if (cmd === 'audio') {
      sound.toggle();
      const res = document.createElement('div');
      res.className = 'cli-row';
      res.innerHTML = terminalResponses.audio;
      cliOutput.appendChild(res);
    } else if (terminalResponses[cmd]) {
      const res = document.createElement('div');
      res.className = 'cli-row';
      res.innerHTML = terminalResponses[cmd];
      cliOutput.appendChild(res);
    } else if (rawCmd) {
      const notFound = document.createElement('div');
      notFound.className = 'cli-row';
      notFound.innerHTML = `<span class="t-purple">zsh: command not found: ${rawCmd}</span>. Type <span class="t-cyan">help</span> for commands.`;
      cliOutput.appendChild(notFound);
    }

    if (cliInput) cliInput.value = '';
    cliOutput.scrollTop = cliOutput.scrollHeight;
  }

  if (cliInput && cliOutput) {
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const rawCmd = cliInput.value.trim();
        executeCliCommand(rawCmd);
      } else if (e.key === 'ArrowUp') {
        if (cliCommandsHistory.length > 0 && historyIndex > 0) {
          historyIndex--;
          cliInput.value = cliCommandsHistory[historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < cliCommandsHistory.length - 1) {
          historyIndex++;
          cliInput.value = cliCommandsHistory[historyIndex];
        } else {
          historyIndex = cliCommandsHistory.length;
          cliInput.value = '';
        }
      }
    });

    // Wire up one-click quick chips
    document.querySelectorAll('.cli-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) {
          if (cliInput) cliInput.value = cmd;
          executeCliCommand(cmd);
          if (cliInput) cliInput.focus();
        }
      });
    });

    document.getElementById('cli-window')?.addEventListener('click', () => {
      cliInput.focus();
    });
  }

  // ─── SCROLL REVEAL (INTERSECTION OBSERVER) ────────────────
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });

  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) {
      el.classList.add('active');
    }
    observer.observe(el);
  });
});

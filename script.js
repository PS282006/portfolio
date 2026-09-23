/* ============================================================
   PARTH SINGH — MODERN INTERACTIVE SYSTEMS SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. TOP SCROLL PROGRESS BAR ───────────────────────────
  const scrollProgressBar = document.getElementById('scroll-progress');
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${progress}%`;
    }

    // Nav blur background transition
    if (nav) {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // ─── 2. AMBIENT MOUSE SPOTLIGHT GLOW ──────────────────────
  const mouseGlow = document.getElementById('mouse-glow');
  if (mouseGlow) {
    window.addEventListener('pointermove', (e) => {
      mouseGlow.style.left = `${e.clientX}px`;
      mouseGlow.style.top = `${e.clientY}px`;
    }, { passive: true });
  }



  // ─── 4. HERO BACKGROUND PARTICLE CANVAS ───────────────────
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;
    let particles = [];
    const particleCount = 45;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          size: Math.random() * 1.8 + 0.6,
          alpha: Math.random() * 0.4 + 0.1
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);

      // Draw faint connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 255, 136, ${(1 - dist / 130) * 0.12})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
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

      requestAnimationFrame(drawParticles);
    }

    resize();
    initParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resize();
      initParticles();
    }, { passive: true });
  }

  // ─── 5. DYNAMIC TYPING ANIMATION IN HERO ──────────────────
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const phrases = [
      'defensive security tooling',
      'threat intelligence HUDs',
      'statutory RAG pipelines',
      'network packet auditors',
      'zero-knowledge file vaults'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 75;
    const deleteSpeed = 35;
    const pauseTime = 1900;

    function typeLoop() {
      const current = phrases[phraseIndex];
      if (isDeleting) {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(typeLoop, 400);
          return;
        }
        setTimeout(typeLoop, deleteSpeed);
      } else {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(typeLoop, pauseTime);
          return;
        }
        setTimeout(typeLoop, typeSpeed);
      }
    }
    typeLoop();
  }

  // ─── 6. INTERACTIVE HERO HUD TABS ─────────────────────────
  const hudTabs = document.querySelectorAll('.hud-tab');
  const hudPanes = document.querySelectorAll('.hud-tab-pane');

  hudTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      hudTabs.forEach(t => t.classList.remove('active'));
      hudPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const target = tab.getAttribute('data-hud-tab');
      const targetPane = document.getElementById(`pane-${target}`);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // Simulated packet counter on Ghost-Net tab
  const packetCounter = document.getElementById('packet-counter');
  if (packetCounter) {
    let count = 4129;
    setInterval(() => {
      count += Math.floor(Math.random() * 8) + 1;
      packetCounter.textContent = `${count.toLocaleString()} pkts`;
    }, 1400);
  }

  // ─── 7. 3D CARD TILT EFFECT ───────────────────────────────
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5.5;
      const rotateY = ((x - centerX) / centerX) * 5.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // ─── 8. PROJECTS FILTERING ────────────────────────────────
  const filterBtns = document.querySelectorAll('.pfilter-btn');
  const bentoCards = document.querySelectorAll('.bento-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
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

  // ─── 9. TOAST NOTIFICATIONS & 1-CLICK EMAIL COPY ──────────
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

  const copyButtons = document.querySelectorAll('.copy-email-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'parth.singh2006@outlook.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Copied to clipboard: ${email} 🚀`);
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    });
  });

  // Direct Message Form & Copy Text Handlers
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
        showToast('Message text copied to clipboard! 📋');
      }).catch(() => {
        showToast('Failed to copy text', 'info');
      });
    });
  }

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

  // ─── 10. INTERACTIVE IN-BROWSER CLI TERMINAL ───────────────
  const cliInput = document.getElementById('cli-input');
  const cliOutput = document.getElementById('cli-output');
  const cliCommandsHistory = [];
  let historyIndex = -1;

  const terminalResponses = {
    help: `
<span class="t-cyan">Available commands:</span>
  <span class="t-green">about</span>       - Background &amp; educational profile
  <span class="t-green">projects</span>    - List flagship security &amp; AI builds
  <span class="t-green">skills</span>      - Technical stack &amp; capabilities
  <span class="t-green">contact</span>     - Direct contact coordinates &amp; email
  <span class="t-green">socials</span>     - Links to GitHub, LinkedIn, X
  <span class="t-green">clear</span>       - Clear terminal output
  <span class="t-green">sudo hire</span>   - Check availability for roles
  <span class="t-green">neofetch</span>    - System architecture report`,

    about: `
<span class="t-white">Parth Singh</span> // Security-Focused Builder &amp; Systems Engineer
Location: Kharghar, Navi Mumbai, India (UTC +5:30)
Education: Pillai College of Engineering (B.E. Information Technology 2024–2028)
Focus: Systems telemetry, counter-surveillance, statutory legal RAG, cryptographic protocols.`,

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
<span class="t-cyan">Direct Contact:</span>
  Email:    <span class="t-green">parth.singh2006@outlook.com</span>
  Phone:    <a href="tel:+919137534703" class="t-cyan">+91 9137534703</a>
  Status:   <span class="t-green">Open to Work (Internships &amp; Early-Stage Teams)</span>`,

    socials: `
<span class="t-cyan">Online Presence:</span>
  • GitHub:   <a href="https://github.com/PS282006" target="_blank" class="t-green">github.com/PS282006</a>
  • LinkedIn: <a href="https://www.linkedin.com/in/parth-singh-ba47ab386" target="_blank" class="t-cyan">linkedin.com/in/parth-singh-ba47ab386</a>
  • X/Twitter:<a href="https://x.com/parth_singh2006" target="_blank" class="t-purple">x.com/parth_singh2006</a>`,

    'sudo hire': `
<span class="t-green">[ACCESS GRANTED]</span> Status: READY FOR ACTION.
I am actively open to internship and early-stage startup opportunities remotely.
Send an email directly to <span class="t-cyan">parth.singh2006@outlook.com</span> to discuss!`,

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

  if (cliInput && cliOutput) {
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const rawCmd = cliInput.value.trim();
        const cmd = rawCmd.toLowerCase();

        if (rawCmd) {
          cliCommandsHistory.push(rawCmd);
          historyIndex = cliCommandsHistory.length;
        }

        // Print entered command
        const cmdEcho = document.createElement('div');
        cmdEcho.className = 'cli-row';
        cmdEcho.innerHTML = `<span class="t-green">parth@node:~$</span> <span class="t-white">${rawCmd}</span>`;
        cliOutput.appendChild(cmdEcho);

        if (cmd === 'clear') {
          cliOutput.innerHTML = '';
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

        cliInput.value = '';
        cliOutput.scrollTop = cliOutput.scrollHeight;
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

    // Clicking anywhere inside terminal focuses input
    document.getElementById('cli-window')?.addEventListener('click', () => {
      cliInput.focus();
    });
  }

  // ─── 11. SCROLL REVEAL (INTERSECTION OBSERVER) ────────────
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));
});

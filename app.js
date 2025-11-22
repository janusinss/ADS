// Register Plugins
gsap.registerPlugin(ScrollTrigger);

let lenis;
// Check for Reduced Motion Preference
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Start Boot Sequence
    simulateLoading();

    // 2. Init Smooth Scroll & Physics (Conditional)
    if (!prefersReducedMotion) {
        initLenis();
        initMagneticButtons();
        // We delay initTilt slightly to ensure DOM elements from APIs are painted
        setTimeout(() => {
             document.querySelectorAll('.project-card').forEach(initTilt);
        }, 500);
    }

    initSmoothNav();
    initCustomCursor();
    initAudioInteractions();

    // 3. Personality Features
    initTabListener();
    initClickEffects();
    initConsoleSignature();
    initKonamiCode();

    // 4. Load Data
    loadProfile();
    loadProjects();
    loadSkills();
    loadGeneric('experience_api.php?duration=true', 'experience-list', renderExperience);
    loadGeneric('education_api.php', 'education-list', renderSimpleCard);
    loadGeneric('certifications_api.php', 'certifications-list', renderSimpleCard);
    loadGeneric('achievements_api.php', 'achievements-list', renderSimpleCard);
    
    setupContactForm();

    document.getElementById('footer-year').textContent = new Date().getFullYear();
});

// === VELOCITY SKEW ===
function initLenis() {
    lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    const content = document.querySelector('.content-wrapper');
    let skew = 0;

    lenis.on('scroll', ({ velocity }) => {
        ScrollTrigger.update();
        const targetSkew = velocity * 0.15;
        skew += (targetSkew - skew) * 0.1;
        content.style.transform = `skewY(${skew}deg) translate3d(0,0,0)`;
    });

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
}

// === MAGNETIC BUTTONS ===
function initMagneticButtons() {
    const targets = document.querySelectorAll('.nav-item, .btn-minimal, .theme-toggle');
    targets.forEach(el => {
        const wrap = document.createElement('div');
        wrap.className = 'magnetic-wrap';
        el.parentNode.insertBefore(wrap, el);
        wrap.appendChild(el);
        wrap.addEventListener('mousemove', (e) => {
            const rect = wrap.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(el, { x: x * 0.5, y: y * 0.5, duration: 0.3, ease: "power2.out" });
        });
        wrap.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
        });
    });
}

// === SMOOTH NAV ===
function initSmoothNav() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElem = document.querySelector(targetId);
            if (targetElem && lenis) {
                lenis.scrollTo(targetElem, { offset: 0, duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            }
        });
    });
}

// === BOOT SEQUENCE ===
function simulateLoading() {
    const bar = document.getElementById('loader-bar');
    const logs = document.getElementById('boot-logs');
    const preloader = document.getElementById('preloader');
    const bootText = ["INITIALIZING...", "MOUNTING DOM...", "COMPILING SHADERS...", "CONNECTING...", "DECRYPTING...", "SYSTEM READY."];
    let width = 0; let logIndex = 0;

    const addLog = (text) => {
        const p = document.createElement('div');
        p.innerHTML = `<span class="text-accent">>></span> ${text}`;
        logs.appendChild(p);
        if (logs.children.length > 5) logs.removeChild(logs.firstChild);
    };

    const interval = setInterval(() => {
        width += Math.random() * 3;
        if (width > 100) width = 100;
        bar.style.width = width + '%';
        if (width > (logIndex + 1) * 15 && logIndex < bootText.length) { addLog(bootText[logIndex++]); }
        if (width === 100) {
            clearInterval(interval);
            addLog("ACCESS GRANTED.");
            setTimeout(() => {
                gsap.to(preloader, { yPercent: -100, duration: 1, ease: "power4.inOut" });
                if (window.playIntroAnimation) window.playIntroAnimation();
                animateItems('.fade-in');
                scrambleText(document.querySelector('h1'));
                
                const h1 = document.querySelector('h1');
                if(h1) h1.addEventListener('mouseenter', () => scrambleText(h1));
                
                initScrollSpy();
                initFooterSystem();
            }, 500);
        }
    }, 20);
}

// === 3D TILT ===
function initTilt(element) {
    if (prefersReducedMotion) return;
    
    const image = element.querySelector('img');
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPct = (x / rect.width) - 0.5;
        const yPct = (y / rect.height) - 0.5;
        const xRot = yPct * -10; const yRot = xPct * 10;
        gsap.to(element, { transform: `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale(1.02)`, duration: 0.1, ease: "power1.out" });
        if (image) gsap.to(image, { x: (xPct * -20), y: (yPct * -20), scale: 1.1, duration: 0.1, ease: "power1.out" });
    });
    element.addEventListener('mouseleave', () => {
        gsap.to(element, { transform: `perspective(1000px) rotateX(0) rotateY(0) scale(1)`, duration: 0.6, ease: "elastic.out(1, 0.6)" });
        if (image) gsap.to(image, { x: 0, y: 0, scale: 1, duration: 0.6, ease: "power2.out" });
    });
}

// === MASKED REVEAL & SCRAMBLE ===
function animateItems(selector) {
    setTimeout(() => {
        const items = document.querySelectorAll(selector);
        items.forEach(el => {
            // Wrap headers in mask
            if(el.tagName.match(/^H[1-6]$/)) {
                const text = el.innerText;
                el.innerHTML = `<div class="reveal-text"><span>${text}</span></div>`;
                el.classList.remove('opacity-0', 'translate-y-8');
            }
        });

        ScrollTrigger.batch(selector, {
            onEnter: batch => {
                batch.forEach((el, i) => {
                    const mask = el.querySelector('.reveal-text');
                    if(mask) {
                        setTimeout(() => mask.classList.add('is-visible'), i * 100);
                    } else {
                        gsap.to(el, { opacity: 1, y: 0, delay: i * 0.1, duration: 0.8, ease: "power3.out" });
                    }

                    if (el.hasAttribute('data-scramble') || el.querySelector('[data-scramble]')) {
                        const target = el.hasAttribute('data-scramble') ? el : el.querySelector('[data-scramble]');
                        scrambleText(target);
                        target.addEventListener('mouseenter', () => {
                            scrambleText(target);
                            if(typeof AudioEngine !== 'undefined') AudioEngine.playGlitch();
                        });
                    }
                });
            },
            start: "top 90%",
            once: true 
        });
    }, 100);
}

function scrambleText(element) {
    if (!element || element.dataset.scrambling === "true") return;
    element.dataset.scrambling = "true";
    const finalText = element.dataset.originalText || element.innerText;
    if(!element.dataset.originalText) element.dataset.originalText = finalText;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*';
    let iterations = 0;
    const interval = setInterval(() => {
        element.innerText = finalText.split('').map((letter, index) => {
            if (index < iterations) return finalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        if (iterations >= finalText.length) { clearInterval(interval); element.dataset.scrambling = "false"; }
        iterations += 1 / 3;
    }, 30);
}

// === CUSTOM CURSOR ===
function initCustomCursor() {
    if (prefersReducedMotion) return;
    const cursor = document.getElementById('cursor');
    const mouse = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    gsap.ticker.add(() => {
        const dt = 1.0 - Math.pow(1.0 - 0.2, gsap.ticker.deltaRatio());
        pos.x += (mouse.x - pos.x) * dt;
        pos.y += (mouse.y - pos.y) * dt;
        cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
    });
    document.body.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, input, textarea, .project-card, .magnetic-wrap')) cursor.classList.add('hovered');
        else cursor.classList.remove('hovered');
    });
}

// === API LOADERS ===
const API_BASE = './api';

async function loadProfile() {
    try {
        const res = await fetch(`${API_BASE}/profile_api.php`);
        const data = await res.json();
        document.getElementById('professional-title').innerText = data.professional_title;
        document.getElementById('bio-text').innerText = data.bio;
        document.getElementById('contact-info').innerHTML = `
            <div class="flex justify-between border-b border-gray-500/30 pb-2"><span>EMAIL</span> <span>${data.email}</span></div>
            <div class="flex justify-between border-b border-gray-500/30 pb-2 pt-2"><span>PHONE</span> <span>${data.phone}</span></div>
            <div class="pt-4"><a href="${data.facebook_url}" class="text-accent hover:underline">FACEBOOK LINK_</a></div>
        `;
    } catch(e) {}
}

async function loadProjects() {
    try {
        const res = await fetch(`${API_BASE}/projects_api.php`);
        const data = await res.json();
        document.getElementById('projects-grid').innerHTML = data.map(p => `
            <div class="project-card p-8 opacity-0 translate-y-8 group">
                <div class="mb-6 border-b border-gray-500/20 pb-6">
                     <h3 class="text-3xl font-bold mb-2 transition-colors" data-scramble>${p.title}</h3>
                     <span class="text-xs font-mono border border-gray-500 px-2 py-1 rounded">${p.status || 'DEPLOYED'}</span>
                </div>
                <p class="text-sm text-secondary mb-8 leading-relaxed">${p.description}</p>
                <div class="flex justify-between text-xs font-mono tracking-widest">
                    <a href="${p.project_url}" class="hover:text-accent">[ VIEW PROJECT ]</a>
                    <a href="${p.repo_url}" class="hover:text-accent">[ SOURCE CODE ]</a>
                </div>
            </div>
        `).join('');
        animateItems('.project-card');
        
        // Add tilt to new elements if motion allowed
        if(!prefersReducedMotion) {
            setTimeout(() => document.querySelectorAll('.project-card').forEach(initTilt), 100);
        }
    } catch(e) {}
}

async function loadSkills() {
    try {
        const res = await fetch(`${API_BASE}/skills_api.php`);
        const data = await res.json();
        document.getElementById('skills-container').innerHTML = data.map(s => `
            <div class="skill-tag px-4 py-3 opacity-0 translate-y-4 text-xs font-mono border border-gray-500/30 transition-colors cursor-default">
                ${s.name} <span class="text-accent">// ${s.proficiency}%</span>
            </div>
        `).join('');
        animateItems('.skill-tag');
    } catch(e) {}
}

async function loadGeneric(endpoint, id, renderFn) {
    try {
        const res = await fetch(`${API_BASE}/${endpoint}`);
        const data = await res.json();
        document.getElementById(id).innerHTML = data.map(renderFn).join('');
        animateItems(`#${id} > div`);
    } catch(e) {}
}

// === RENDER HELPERS ===
const renderExperience = exp => `
    <div class="info-card p-6 opacity-0 translate-y-8 border-l-2 border-transparent transition-all">
        <div class="flex justify-between items-baseline mb-2">
            <h4 class="font-bold text-lg" data-scramble>${exp.position}</h4>
            <span class="text-xs font-mono text-accent">${exp.duration_text || ''}</span>
        </div>
        <p class="text-sm font-mono mb-4 text-secondary">${exp.company}</p>
        <p class="text-sm text-secondary/80 leading-relaxed">${exp.description}</p>
    </div>
`;

const renderSimpleCard = item => `
    <div class="info-card p-6 opacity-0 translate-y-8">
        <h4 class="font-bold text-lg mb-1" data-scramble>${item.degree || item.title}</h4>
        <p class="text-sm font-mono text-accent">${item.institution || item.issuing_organization}</p>
    </div>
`;

// === FORM & SYSTEM ===
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const btn = form.querySelector('button');
    btn.id = 'submit-btn'; 

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const originalText = btn.innerText;
        
        btn.classList.add('loading');
        btn.innerText = "TRANSMITTING...";
        AudioEngine.playClick();

        const formData = new FormData(form);
        try {
            await new Promise(r => setTimeout(r, 1500)); // Fake delay
            const res = await fetch(`${API_BASE}/contacts_api.php`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(Object.fromEntries(formData))
            });
            if (res.ok) {
                btn.classList.remove('loading');
                btn.classList.add('success');
                btn.innerText = "TRANSMISSION RECEIVED";
                form.reset();
                setTimeout(() => {
                    btn.classList.remove('success');
                    btn.innerText = originalText;
                }, 3000);
            }
        } catch (e) {
            btn.classList.remove('loading');
            btn.innerText = "ERROR - RETRY";
            btn.style.borderColor = "red";
        }
    });
}

function initScrollSpy() {
    const sections = ['projects', 'skills', 'info', 'contact'];
    sections.forEach(id => {
        ScrollTrigger.create({
            trigger: `#${id}`,
            start: "top center", end: "bottom center",
            onToggle: self => {
                if(self.isActive) {
                    document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active-link'));
                    const link = document.querySelector(`a[href="#${id}"]`);
                    if(link) link.classList.add('active-link');
                }
            }
        });
    });
}

function initFooterSystem() {
    const footerYear = document.getElementById('footer-year');
    if(footerYear) footerYear.textContent = new Date().getFullYear();
    const uptimeContainer = document.getElementById('system-uptime');
    if(uptimeContainer) {
        let seconds = 0;
        setInterval(() => {
            seconds++;
            const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
            const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            uptimeContainer.innerText = `${hrs}:${mins}:${secs}`;
        }, 1000);
    }
}

// === PERSONALITY EXTRAS ===
function initTabListener() {
    const originalTitle = document.title;
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) document.title = "⚠ CONNECTION LOST...";
        else document.title = originalTitle;
    });
}

function initClickEffects() {
    if (prefersReducedMotion) return;
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
}

function initConsoleSignature() {
    const style = "background: #0f172a; color: #22d3ee; font-size: 12px; padding: 10px; border: 1px solid #22d3ee;";
    console.log("%c CREATED BY JANUS DOMINIC | SYSTEM ONLINE ", style);
}

function initKonamiCode() {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let current = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key === code[current]) {
            current++;
            if (current === code.length) {
                activateGodMode();
                current = 0;
            }
        } else {
            current = 0;
        }
    });
}

function activateGodMode() {
    alert("GOD MODE ACTIVATED");
    document.documentElement.style.setProperty('--accent', '#ff00ff'); 
    document.body.style.filter = "invert(1) hue-rotate(180deg)";
    AudioEngine.playGlitch();
}

// === AUDIO ENGINE ===
const AudioEngine = {
    ctx: null, masterGain: null, isMuted: false,
    init() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.1; 
        this.masterGain.connect(this.ctx.destination);
    },
    playHover() {
        if (!this.ctx || this.isMuted) return;
        const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.masterGain); osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.5, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now); osc.stop(now + 0.05);
    },
    playClick() {
        if (!this.ctx || this.isMuted) return;
        const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.masterGain); osc.type = 'triangle';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(150, now); osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
        gain.gain.setValueAtTime(0.8, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now); osc.stop(now + 0.15);
    },
    playGlitch() {
        if (!this.ctx || this.isMuted) return;
        const bufferSize = this.ctx.sampleRate * 0.1; 
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = this.ctx.createBufferSource(); noise.buffer = buffer; const gain = this.ctx.createGain();
        noise.connect(gain); gain.connect(this.masterGain);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        noise.start();
    },
    playKeystroke() {
        if (!this.ctx || this.isMuted) return;
        const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
        osc.connect(gain); gain.connect(this.masterGain); osc.type = 'square'; 
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(600, now); osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);
        gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now); osc.stop(now + 0.03);
    }
};

function initAudioInteractions() {
    const startAudio = () => {
        if (!AudioEngine.ctx) AudioEngine.init();
        if (AudioEngine.ctx.state === 'suspended') AudioEngine.ctx.resume();
        document.removeEventListener('click', startAudio); document.removeEventListener('mousemove', startAudio);
    };
    document.addEventListener('click', startAudio); document.addEventListener('mousemove', startAudio);
    
    document.body.addEventListener('mouseenter', (e) => {
        if (e.target.closest('a, button, .project-card, .magnetic-wrap')) AudioEngine.playHover();
    }, true);
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('a, button, .theme-toggle')) AudioEngine.playClick();
    });
    document.querySelectorAll('.theme-toggle').forEach(btn => btn.addEventListener('click', () => AudioEngine.playGlitch()));

    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('keydown', () => AudioEngine.playKeystroke());
        input.addEventListener('focus', () => AudioEngine.playHover());
    });
}
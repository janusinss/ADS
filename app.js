// Register Plugins
gsap.registerPlugin(ScrollTrigger);

let lenis; // Global scroll instance

document.addEventListener('DOMContentLoaded', () => {
    // 1. Start Boot Sequence
    simulateLoading();

    // 2. Init Smooth Scroll & Physics
    initLenis();
    initSmoothNav();
    
    // 3. Init UI Effects
    initCustomCursor();
    initMagneticButtons(); // NEW: Magnetic Physics

    initAudioInteractions();

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

// === VELOCITY SKEW & SMOOTH SCROLL ===
function initLenis() {
    lenis = new Lenis({
        lerp: 0.08, // Smoothness (lower = smoother/heavier)
        smoothWheel: true
    });

    // The Skew Effect
    const content = document.querySelector('.content-wrapper');
    let skew = 0;

    lenis.on('scroll', ({ velocity }) => {
        // Update ScrollTrigger
        ScrollTrigger.update();

        // Calculate Skew based on scroll speed
        // velocity is usually between -50 and 50 during fast scrolls
        const targetSkew = velocity * 0.15; 
        
        // Smoothly interpolate skew (avoid jitter)
        skew += (targetSkew - skew) * 0.1;
        
        // Apply the warp
        // Force hardware acceleration with translate3d
        content.style.transform = `skewY(${skew}deg) translate3d(0,0,0)`;
    });

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
}

// === MAGNETIC BUTTONS ===
function initMagneticButtons() {
    // Wrap nav items and buttons to give them physics
    const targets = document.querySelectorAll('.nav-item, .btn-minimal, .theme-toggle');
    
    targets.forEach(el => {
        // Create a larger hit-area for the magnet effect
        const wrap = document.createElement('div');
        wrap.className = 'magnetic-wrap';
        el.parentNode.insertBefore(wrap, el);
        wrap.appendChild(el);
        
        // Mouse move listener
        wrap.addEventListener('mousemove', (e) => {
            const rect = wrap.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move the button towards the mouse (Magnetic Pull)
            // Strength = 0.5 (Higher = stronger pull)
            gsap.to(el, {
                x: x * 0.5,
                y: y * 0.5,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        // Mouse leave listener (Snap back)
        wrap.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.8, // Bouncy return
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
}

// === NAVIGATION SMOOTH SCROLL ===
function initSmoothNav() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); 
            const targetId = this.getAttribute('href');
            const targetElem = document.querySelector(targetId);
            
            if (targetElem && lenis) {
                lenis.scrollTo(targetElem, {
                    offset: 0,
                    duration: 1.5, 
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
                });
            }
        });
    });
}

// === BOOT SEQUENCE ===
function simulateLoading() {
    const bar = document.getElementById('loader-bar');
    const logs = document.getElementById('boot-logs');
    const preloader = document.getElementById('preloader');
    
    const bootText = [
        "INITIALIZING CORE MODULES...",
        "MOUNTING VIRTUAL DOM...",
        "ALLOCATING MEMORY BLOCKS...",
        "COMPILING SHADERS [FRAG/VERT]...",
        "CONNECTING TO MAINNET...",
        "DECRYPTING SECURE ASSETS...",
        "OPTIMIZING GEOMETRY BUFFERS...",
        "ESTABLISHING NEURAL LINK...",
        "SYSTEM READY."
    ];

    let width = 0;
    let logIndex = 0;

    const addLog = (text) => {
        const p = document.createElement('div');
        p.innerHTML = `<span class="text-cyan-500">>></span> ${text}`;
        logs.appendChild(p);
        if (logs.children.length > 5) logs.removeChild(logs.firstChild);
    };

    const interval = setInterval(() => {
        width += Math.random() * 2;
        if (width > 100) width = 100;
        bar.style.width = width + '%';

        if (width > (logIndex + 1) * 12 && logIndex < bootText.length) {
            addLog(bootText[logIndex]);
            logIndex++;
        }

        if (width === 100) {
            clearInterval(interval);
            addLog("ACCESS GRANTED.");
            setTimeout(() => {
                gsap.to(preloader, {
                    yPercent: -100,
                    duration: 1,
                    ease: "power4.inOut"
                });
                if (window.playIntroAnimation) window.playIntroAnimation();
                animateItems('.fade-in');
                scrambleText(document.querySelector('h1'));
            }, 500);
        }
    }, 20);
}

// === 3D CARD TILT ===
// === 1. UPGRADED 3D CARD TILT (WITH DEEP PARALLAX) ===
function initTilt(element) {
    const imageContainer = element.querySelector('.overflow-hidden');
    const image = element.querySelector('img');

    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate percentages (-0.5 to 0.5)
        const xPct = (x / rect.width) - 0.5;
        const yPct = (y / rect.height) - 0.5;
        
        // 1. Tilt the Card (Container)
        // Rotate LESS for a heavier feel (Max 5deg)
        const xRot = yPct * -5; 
        const yRot = xPct * 5;

        gsap.to(element, {
            transform: `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale(1.02)`,
            duration: 0.1,
            ease: "power1.out"
        });

        // 2. Parallax the Image (The "Window" Effect)
        // Move image OPPOSITE to the mouse to create depth
        if (image) {
            gsap.to(image, {
                x: (xPct * -15), // Shift X
                y: (yPct * -15), // Shift Y
                scale: 1.1,      // Keep it scaled up so we don't see edges
                duration: 0.1,
                ease: "power1.out"
            });
        }
    });

    element.addEventListener('mouseleave', () => {
        // Reset Card
        gsap.to(element, {
            transform: `perspective(1000px) rotateX(0) rotateY(0) scale(1)`,
            duration: 0.6,
            ease: "elastic.out(1, 0.6)"
        });

        // Reset Image
        if (image) {
            gsap.to(image, {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: "power2.out"
            });
        }
    });
}

// === 2. NEURAL TEXT (RE-SCRAMBLE ON HOVER) ===
function animateItems(selector) {
    ScrollTrigger.batch(selector, {
        onEnter: batch => {
            gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" });
            
            batch.forEach(el => { 
                // 1. Scramble on Enter (Existing)
                if (el.hasAttribute('data-scramble')) {
                    scrambleText(el);
                    
                    // 2. NEW: Scramble on Hover (Interactive)
                    el.addEventListener('mouseenter', () => {
                        scrambleText(el);
                        // Optional: Play a tiny glitch sound if you want
                        // if(AudioEngine) AudioEngine.playGlitch(); 
                    });
                }
            });
        },
        start: "top 90%",
        once: true
    });
    
    // Also attach to Main Title separately since it's not in a batch
    const mainTitle = document.querySelector('h1[data-scramble]');
    if(mainTitle) {
        mainTitle.addEventListener('mouseenter', () => scrambleText(mainTitle));
    }
}

// === HACKER TEXT SCRAMBLE ===
function scrambleText(element) {
    if (!element) return;
    const finalText = element.innerText;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*';
    let iterations = 0;
    const interval = setInterval(() => {
        element.innerText = finalText.split('').map((letter, index) => {
            if (index < iterations) return finalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        if (iterations >= finalText.length) clearInterval(interval);
        iterations += 1 / 3;
    }, 30);
}

// === CURSOR ===
function initCustomCursor() {
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
        if (e.target.closest('a, button, input, textarea, .project-card, .magnetic-wrap')) {
            cursor.classList.add('hovered');
        } else {
            cursor.classList.remove('hovered');
        }
    });
}

// === ANIMATION HELPERS ===
function animateItems(selector) {
    ScrollTrigger.batch(selector, {
        onEnter: batch => {
            gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" });
            batch.forEach(el => { if (el.hasAttribute('data-scramble')) scrambleText(el); });
        },
        start: "top 90%",
        once: true
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
            <div class="pt-4"><a href="${data.facebook_url}" class="text-cyan-400 hover:text-cyan-300">FACEBOOK LINK_</a></div>
        `;
    } catch(e) {}
}

async function loadProjects() {
    try {
        const res = await fetch(`${API_BASE}/projects_api.php`);
        const data = await res.json();
        document.getElementById('projects-grid').innerHTML = data.map(p => `
            <div class="project-card p-8 opacity-0 translate-y-8 group">
                <div class="mb-6 overflow-hidden border-b border-gray-500/20 pb-6">
                     <h3 class="text-3xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">${p.title}</h3>
                     <span class="text-xs font-mono border border-gray-500 px-2 py-1 rounded">${p.status || 'DEPLOYED'}</span>
                </div>
                <p class="text-sm text-secondary mb-8 leading-relaxed">${p.description}</p>
                <div class="flex justify-between text-xs font-mono tracking-widest">
                    <a href="${p.project_url}" class="hover:text-cyan-400">[ VIEW PROJECT ]</a>
                    <a href="${p.repo_url}" class="hover:text-cyan-400">[ SOURCE CODE ]</a>
                </div>
            </div>
        `).join('');
        animateItems('.project-card');
        document.querySelectorAll('.project-card').forEach(initTilt);
    } catch(e) {}
}

async function loadSkills() {
    try {
        const res = await fetch(`${API_BASE}/skills_api.php`);
        const data = await res.json();
        document.getElementById('skills-container').innerHTML = data.map(s => `
            <div class="skill-tag px-4 py-3 opacity-0 translate-y-4 text-xs font-mono border border-gray-500/30 hover:border-cyan-400 transition-colors cursor-default">
                ${s.name} <span class="text-cyan-400">// ${s.proficiency}%</span>
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

const renderExperience = exp => `
    <div class="info-card p-6 opacity-0 translate-y-8 border-l-2 border-transparent hover:border-cyan-400 transition-all">
        <div class="flex justify-between items-baseline mb-2">
            <h4 class="font-bold text-lg">${exp.position}</h4>
            <span class="text-xs font-mono text-cyan-500">${exp.duration_text || ''}</span>
        </div>
        <p class="text-sm font-mono mb-4 text-secondary">${exp.company}</p>
        <p class="text-sm text-secondary/80 leading-relaxed">${exp.description}</p>
    </div>
`;

const renderSimpleCard = item => `
    <div class="info-card p-6 opacity-0 translate-y-8">
        <h4 class="font-bold text-lg mb-1">${item.degree || item.title}</h4>
        <p class="text-sm font-mono text-cyan-500">${item.institution || item.issuing_organization}</p>
    </div>
`;

function setupContactForm() {
    const form = document.getElementById('contact-form');
    const msg = document.getElementById('form-message');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        try {
            const res = await fetch(`${API_BASE}/contacts_api.php`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(Object.fromEntries(formData))
            });
            if (res.ok) {
                msg.textContent = 'TRANSMISSION SUCCESSFUL';
                msg.className = 'p-4 text-xs font-mono bg-cyan-900/30 text-cyan-400 border border-cyan-900 block';
                form.reset();
            }
        } catch (e) {}
    });
}

// ... (Keep all your existing code) ...

// === PROCEDURAL AUDIO ENGINE (NO FILES NEEDED) ===
const AudioEngine = {
    ctx: null,
    masterGain: null,
    isMuted: false,

    init() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.1; // Keep it subtle (10% volume)
        this.masterGain.connect(this.ctx.destination);
    },

    // 1. The "Hover" Blip (High tech chirp)
    playHover() {
        if (!this.ctx || this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.masterGain);

        // Sound Design: Fast Sine Sweep
        osc.type = 'sine';
        const now = this.ctx.currentTime;
        
        // Pitch drop (Hi -> Lo)
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        
        // Volume envelope (Click)
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.start(now);
        osc.stop(now + 0.05);
    },

    // 2. The "Click" Activation (Deep thud + Static)
    playClick() {
        if (!this.ctx || this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'triangle'; // Grittier sound
        const now = this.ctx.currentTime;
        
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
        
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
    },

    // 3. The "Theme Switch" Glitch (White Noise Burst)
    playGlitch() {
        if (!this.ctx || this.isMuted) return;
        const bufferSize = this.ctx.sampleRate * 0.1; // 0.1 seconds
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1; // White noise
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = this.ctx.createGain();
        
        noise.connect(gain);
        gain.connect(this.masterGain);
        
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        
        noise.start();
    }
};

// === INITIALIZE AUDIO TRIGGERS ===
function initAudioInteractions() {
    // We need a user interaction to start AudioContext (Browser Policy)
    const startAudio = () => {
        if (!AudioEngine.ctx) AudioEngine.init();
        if (AudioEngine.ctx.state === 'suspended') AudioEngine.ctx.resume();
        document.removeEventListener('click', startAudio);
        document.removeEventListener('mousemove', startAudio); // Also start on mouse move
    };
    document.addEventListener('click', startAudio);
    document.addEventListener('mousemove', startAudio);

    // Attach Hover Sounds
    // Use delegation for better performance
    document.body.addEventListener('mouseenter', (e) => {
        if (e.target.closest('a, button, .project-card, .magnetic-wrap')) {
            AudioEngine.playHover();
        }
    }, true); // Capture phase to ensure we catch it

    // Attach Click Sounds
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('a, button, .theme-toggle')) {
            AudioEngine.playClick();
        }
    });
    
    // Attach Glitch Sound to Theme Toggle
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(btn => {
        btn.addEventListener('click', () => AudioEngine.playGlitch());
    });
}
// Register Plugins
gsap.registerPlugin(ScrollTrigger);

let lenis; // Global scroll instance

document.addEventListener('DOMContentLoaded', () => {
    // 1. Start Preloader Animation
    simulateLoading();

    // 2. Init Smooth Scroll (Lenis)
    initLenis();

    initSmoothNav();

    // 3. Load Data
    loadProfile();
    loadProjects();
    loadSkills();
    loadGeneric('experience_api.php?duration=true', 'experience-list', renderExperience);
    loadGeneric('education_api.php', 'education-list', renderSimpleCard);
    loadGeneric('certifications_api.php', 'certifications-list', renderSimpleCard);
    loadGeneric('achievements_api.php', 'achievements-list', renderSimpleCard);
    setupContactForm();

    // 4. Init UI Effects
    initCustomCursor();
    
    document.getElementById('footer-year').textContent = new Date().getFullYear();
});

// === BOOT SEQUENCE ===
function simulateLoading() {
    const bar = document.getElementById('loader-bar');
    const logs = document.getElementById('boot-logs');
    const preloader = document.getElementById('preloader');
    
    // Tech jargon for the creative dev vibe
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

    // Function to add a log line
    const addLog = (text) => {
        const p = document.createElement('div');
        p.innerHTML = `<span class="text-cyan-500">>></span> ${text}`;
        logs.appendChild(p);
        // Keep only last 5 logs
        if (logs.children.length > 5) logs.removeChild(logs.firstChild);
    };

    const interval = setInterval(() => {
        width += Math.random() * 2; // Random speed
        if (width > 100) width = 100;
        
        bar.style.width = width + '%';

        // Add random log every ~15% progress
        if (width > (logIndex + 1) * 12 && logIndex < bootText.length) {
            addLog(bootText[logIndex]);
            logIndex++;
        }

        if (width === 100) {
            clearInterval(interval);
            addLog("ACCESS GRANTED.");
            
            // TRIGGER THE CINEMATIC REVEAL
            setTimeout(() => {
                // 1. Slide Preloader Away (Curtain effect)
                gsap.to(preloader, {
                    yPercent: -100,
                    duration: 1,
                    ease: "power4.inOut"
                });

                // 2. Trigger the 3D Camera Zoom (in index.html)
                if (window.playIntroAnimation) window.playIntroAnimation();

                // 3. Animate Elements in
                animateItems('.fade-in');
                scrambleText(document.querySelector('h1'));

            }, 500); // Slight pause before reveal
        }
    }, 20); // Speed of loader

    
}

// === SMOOTH SCROLL (LENIS) ===
function initLenis() {
    lenis = new Lenis({
        lerp: 0.08, // Smoothness (lower = smoother)
        smoothWheel: true
    });

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
}

// === 3D CARD TILT EFFECT ===
function initTilt(element) {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate rotation (Max 10 degrees)
        const xPct = (x / rect.width) - 0.5;
        const yPct = (y / rect.height) - 0.5;
        const xRot = yPct * -10; 
        const yRot = xPct * 10;

        gsap.to(element, {
            transform: `rotateX(${xRot}deg) rotateY(${yRot}deg) scale(1.02)`,
            duration: 0.1,
            ease: "power1.out"
        });
    });

    element.addEventListener('mouseleave', () => {
        gsap.to(element, {
            transform: `rotateX(0) rotateY(0) scale(1)`,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)"
        });
    });
}

// === HACKER TEXT SCRAMBLE ===
function scrambleText(element) {
    if (!element) return;
    const finalText = element.innerText;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*';
    let iterations = 0;

    const interval = setInterval(() => {
        element.innerText = finalText
            .split('')
            .map((letter, index) => {
                if (index < iterations) return finalText[index]; // Lock in correct char
                return chars[Math.floor(Math.random() * chars.length)]; // Random char
            })
            .join('');

        if (iterations >= finalText.length) clearInterval(interval);
        iterations += 1 / 3; // Speed of decoding
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

    // Hover listeners (using delegation for dynamic content)
    document.body.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, input, textarea, .project-card')) {
            cursor.classList.add('hovered');
        } else {
            cursor.classList.remove('hovered');
        }
    });
}

// === ANIMATION HELPER ===
function animateItems(selector) {
    ScrollTrigger.batch(selector, {
        onEnter: batch => {
            gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" });
            // Decode text if it has the attribute
            batch.forEach(el => {
                if (el.hasAttribute('data-scramble')) scrambleText(el);
            });
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
        
        // Populate contact
        document.getElementById('contact-info').innerHTML = `
            <div class="flex justify-between border-b border-gray-500/30 pb-2">
                <span>EMAIL</span> <span>${data.email}</span>
            </div>
            <div class="flex justify-between border-b border-gray-500/30 pb-2 pt-2">
                <span>PHONE</span> <span>${data.phone}</span>
            </div>
            <div class="pt-4">
                <a href="${data.facebook_url}" class="text-cyan-400 hover:text-cyan-300">FACEBOOK LINK_</a>
            </div>
        `;
    } catch(e) {}
}

async function loadProjects() {
    try {
        const res = await fetch(`${API_BASE}/projects_api.php`);
        const data = await res.json();
        const container = document.getElementById('projects-grid');
        
        container.innerHTML = data.map(p => `
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
        
        // Apply animations & Tilt
        animateItems('.project-card');
        document.querySelectorAll('.project-card').forEach(initTilt);
        
    } catch(e) {}
}

async function loadSkills() {
    try {
        const res = await fetch(`${API_BASE}/skills_api.php`);
        const data = await res.json();
        const container = document.getElementById('skills-container');
        container.innerHTML = data.map(s => `
            <div class="skill-tag px-4 py-3 opacity-0 translate-y-4 text-xs font-mono border border-gray-500/30 hover:border-cyan-400 transition-colors cursor-default">
                ${s.name} <span class="text-cyan-400">// ${s.proficiency}%</span>
            </div>
        `).join('');
        animateItems('.skill-tag');
    } catch(e) {}
}

// Generic Loader
async function loadGeneric(endpoint, id, renderFn) {
    try {
        const res = await fetch(`${API_BASE}/${endpoint}`);
        const data = await res.json();
        document.getElementById(id).innerHTML = data.map(renderFn).join('');
        animateItems(`#${id} > div`);
    } catch(e) {}
}

// Render Helpers
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

// === NAVIGATION SMOOTH SCROLL ===
function initSmoothNav() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Stop instant jump
            const targetId = this.getAttribute('href');
            const targetElem = document.querySelector(targetId);
            
            if (targetElem && lenis) {
                lenis.scrollTo(targetElem, {
                    offset: 0,
                    duration: 1.5, // Slower = more dramatic
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // Exponential ease out
                });
            }
        });
    });
}
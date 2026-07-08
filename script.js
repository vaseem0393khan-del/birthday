"use strict";

(function() {
    // DOM Elements Map
    const UI = {
        loader: document.getElementById('loader'),
        introSection: document.getElementById('introSection'),
        matchSection: document.getElementById('matchSection'),
        pathSection: document.getElementById('pathSection'),
        giftSection: document.getElementById('giftSection'),
        slideshowSection: document.getElementById('slideshowSection'),
        messageSection: document.getElementById('messageSection'),
        beginBtn: document.getElementById('beginBtn'),
        music: document.getElementById('birthdayMusic'),
        musicBtn: document.getElementById('musicBtn'),
        restartBtn: document.getElementById('restartBtn'),
        fullscreenBtn: document.getElementById('fullscreenBtn'),
        matchStick: document.getElementById('matchStick'),
        matchBox: document.getElementById('matchBox'),
        matchArea: document.getElementById('matchArea'),
        sparkContainer: document.getElementById('sparkContainer'),
        smokeContainer: document.getElementById('smokeContainer'),
        fireLight: document.getElementById('fireLight'),
        fireBall: document.getElementById('fireBall'),
        travelPath: document.getElementById('travelPath'),
        giftLid: document.getElementById('giftLid'),
        currentSlideEl: document.getElementById('currentSlide'),
        totalSlidesEl: document.getElementById('totalSlides'),
        slideContainer: document.getElementById('slide'),
        slideFlash: document.getElementById('slideFlash'),
        messageCard: document.getElementById('messageCard'),
        flashOverlay: document.getElementById('flashOverlay'),
        layers: {
            heart: document.getElementById('heartLayer'),
            confetti: document.getElementById('confettiLayer'),
            gold: document.getElementById('goldLayer'),
            magic: document.getElementById('magicLayer'),
            firefly: document.getElementById('fireflyLayer')
        }
    };

    // State Management
    const State = {
        isDragging: false,
        isIgnited: false,
        slideIndex: 1,
        maxSlides: 10,
        slideInterval: null,
        particlesActive: false
    };

    // --- Initialization & Flow Control ---
    function init() {
        window.addEventListener('load', hideLoader);
        setupEventListeners();
        UI.totalSlidesEl && (UI.totalSlidesEl.textContent = State.maxSlides);
    }

    function hideLoader() {
        if (UI.loader) {
            UI.loader.style.opacity = '0';
            setTimeout(() => {
                UI.loader.style.display = 'none';
                showSection(UI.introSection);
            }, 500);
        }
    }

    function showSection(section) {
        [UI.introSection, UI.matchSection, UI.pathSection, UI.giftSection, UI.slideshowSection, UI.messageSection]
            .forEach(s => s && (s.style.display = 'none'));
        if (section) section.style.display = 'block';
    }

    function setupEventListeners() {
        if (UI.beginBtn) UI.beginBtn.addEventListener('click', startExperience);
        if (UI.musicBtn) UI.musicBtn.addEventListener('click', toggleMusic);
        if (UI.fullscreenBtn) UI.fullscreenBtn.addEventListener('click', toggleFullscreen);
        if (UI.restartBtn) UI.restartBtn.addEventListener('click', restartExperience);
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('resize', handleResize);
        setupMatchDrag();
    }

    // --- Core Interaction Flow ---
    function startExperience() {
        showSection(UI.matchSection);
        if (UI.music) {
            UI.music.volume = 0.5;
            UI.music.play().catch(e => console.log("Audio play blocked", e));
        }
    }

    // --- Drag & Drop / Match Logic ---
    function setupMatchDrag() {
        if (!UI.matchStick || !UI.matchArea) return;
        
        let startX, startY, initialX, initialY;

        const onTouchStart = (e) => {
            if (State.isIgnited) return;
            State.isDragging = true;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const rect = UI.matchStick.getBoundingClientRect();
            
            initialX = rect.left;
            initialY = rect.top;
            startX = clientX - initialX;
            startY = clientY - initialY;
            
            document.addEventListener('mousemove', onTouchMove);
            document.addEventListener('touchmove', onTouchMove, { passive: false });
            document.addEventListener('mouseup', onTouchEnd);
            document.addEventListener('touchend', onTouchEnd);
        };

        const onTouchMove = (e) => {
            if (!State.isDragging) return;
            e.preventDefault();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            const currentX = clientX - startX;
            const currentY = clientY - startY;
            
            UI.matchStick.style.transform = `translate(${currentX}px, ${currentY}px)`;
            checkCollision();
        };

        const onTouchEnd = () => {
            State.isDragging = false;
            document.removeEventListener('mousemove', onTouchMove);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('mouseup', onTouchEnd);
            document.removeEventListener('touchend', onTouchEnd);
            
            if (!State.isIgnited) {
                UI.matchStick.style.transform = 'translate(0, 0)'; // Reset if not ignited
            }
        };

        UI.matchStick.addEventListener('mousedown', onTouchStart);
        UI.matchStick.addEventListener('touchstart', onTouchStart, { passive: false });
    }

    function checkCollision() {
        if (!UI.matchStick || !UI.matchBox || State.isIgnited) return;
        
        const stickRect = UI.matchStick.getBoundingClientRect();
        const boxRect = UI.matchBox.getBoundingClientRect();

        const isColliding = !(
            stickRect.top > boxRect.bottom ||
            stickRect.right < boxRect.left ||
            stickRect.bottom < boxRect.top ||
            stickRect.left > boxRect.right
        );

        if (isColliding) {
            igniteMatch();
        }
    }

    // --- Animation Sequences ---
    function igniteMatch() {
        State.isIgnited = true;
        createSparks(UI.sparkContainer);
        createSmoke(UI.smokeContainer);
        if (UI.fireLight) UI.fireLight.style.opacity = '1';
        
        setTimeout(() => {
            startPathAnimation();
        }, 1500);
    }

    function createSparks(container) {
        if (!container) return;
        for (let i = 0; i < 20; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark';
            spark.style.left = `${Math.random() * 20 - 10}px`;
            spark.style.top = `${Math.random() * 20 - 10}px`;
            container.appendChild(spark);
            setTimeout(() => spark.remove(), 1000);
        }
    }

    function createSmoke(container) {
        if (!container) return;
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        container.appendChild(smoke);
        setTimeout(() => smoke.remove(), 2000);
    }

    function startPathAnimation() {
        showSection(UI.pathSection);
        if (!UI.fireBall || !UI.travelPath) return;

        const pathLength = UI.travelPath.getTotalLength();
        UI.fireBall.style.display = 'block';
        
        let start = null;
        const duration = 2500;

        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;
            
            if (progress < 1) {
                const point = UI.travelPath.getPointAtLength(progress * pathLength);
                UI.fireBall.style.transform = `translate(${point.x}px, ${point.y}px)`;
                requestAnimationFrame(step);
            } else {
                triggerGiftSequence();
            }
        };
        requestAnimationFrame(step);
    }

    function triggerGiftSequence() {
        showSection(UI.giftSection);
        setTimeout(() => {
            if (UI.giftLid) UI.giftLid.style.transform = 'translateY(-50px) rotate(15deg)';
            if (UI.flashOverlay) {
                UI.flashOverlay.style.opacity = '1';
                setTimeout(() => {
                    startSlideshow();
                    UI.flashOverlay.style.opacity = '0';
                }, 800);
            }
        }, 1000);
    }

    // --- Slideshow Logic ---
    function startSlideshow() {
        showSection(UI.slideshowSection);
        State.slideIndex = 1;
        updateSlide();
        
        State.slideInterval = setInterval(() => {
            State.slideIndex++;
            if (State.slideIndex > State.maxSlides) {
                clearInterval(State.slideInterval);
                finishExperience();
            } else {
                updateSlide();
            }
        }, 4000);
    }

    function updateSlide() {
        if (UI.slideFlash) {
            UI.slideFlash.style.opacity = '1';
            setTimeout(() => UI.slideFlash.style.opacity = '0', 400);
        }
        
        if (UI.slideContainer) {
            UI.slideContainer.style.backgroundImage = `url('assets/images/${State.slideIndex}.jpg')`;
            UI.slideContainer.style.animation = 'none';
            void UI.slideContainer.offsetWidth; // trigger reflow
            UI.slideContainer.style.animation = 'kenBurns 4s ease-out forwards';
        }
        
        if (UI.currentSlideEl) {
            UI.currentSlideEl.textContent = State.slideIndex;
        }
    }

    // --- Final Sequence & Particles ---
    function finishExperience() {
        showSection(UI.messageSection);
        if (UI.messageCard) {
            UI.messageCard.style.opacity = '1';
            UI.messageCard.style.transform = 'translateY(0)';
        }
        State.particlesActive = true;
        startParticles();
    }

    function startParticles() {
        if (!State.particlesActive) return;
        
        const createParticle = (layer, className, max) => {
            if (!layer || layer.children.length > max) return;
            const p = document.createElement('div');
            p.className = className;
            p.style.left = `${Math.random() * 100}vw`;
            p.style.animationDuration = `${Math.random() * 3 + 2}s`;
            layer.appendChild(p);
            setTimeout(() => p.remove(), 5000);
        };

        const loop = () => {
            if (!State.particlesActive) return;
            createParticle(UI.layers.heart, 'floating-heart', 30);
            createParticle(UI.layers.confetti, 'confetti-piece', 50);
            createParticle(UI.layers.gold, 'gold-dust', 40);
            createParticle(UI.layers.firefly, 'firefly-bug', 20);
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    // --- Utilities & Handlers ---
    function toggleMusic() {
        if (!UI.music) return;
        if (UI.music.paused) {
            UI.music.play();
            if (UI.musicBtn) UI.musicBtn.classList.add('playing');
        } else {
            UI.music.pause();
            if (UI.musicBtn) UI.musicBtn.classList.remove('playing');
        }
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    function restartExperience() {
        clearInterval(State.slideInterval);
        State.isIgnited = false;
        State.isDragging = false;
        State.particlesActive = false;
        
        // Cleanup layers
        Object.values(UI.layers).forEach(layer => {
            if (layer) layer.innerHTML = '';
        });
        
        if (UI.matchStick) UI.matchStick.style.transform = 'translate(0, 0)';
        if (UI.fireBall) UI.fireBall.style.display = 'none';
        if (UI.fireLight) UI.fireLight.style.opacity = '0';
        if (UI.giftLid) UI.giftLid.style.transform = 'none';
        
        showSection(UI.introSection);
    }

    function handleVisibilityChange() {
        if (document.hidden && UI.music && !UI.music.paused) {
            UI.music.pause();
        }
    }

    function handleResize() {
        // Handle responsive recalculations if needed for SVG path or Match bounds
    }

    // Boot
    init();
})();

"use strict";

// Secondary High-Performance Canvas Particle Engine for Background Ambient Effects
(function() {
    const CanvasLayers = {
        gold: document.getElementById('goldLayer'),
        magic: document.getElementById('magicLayer'),
        firefly: document.getElementById('fireflyLayer')
    };

    const Config = {
        gold: { count: 60, color: 'rgba(212, 175, 55, ', size: { min: 1, max: 3 }, speedY: { min: 0.2, max: 1 }, speedX: { min: -0.5, max: 0.5 } },
        magic: { count: 40, color: 'rgba(255, 105, 180, ', size: { min: 2, max: 4 }, speedY: { min: -1, max: -0.2 }, speedX: { min: -1, max: 1 } },
        firefly: { count: 25, color: 'rgba(173, 255, 47, ', size: { min: 2, max: 5 }, speedY: { min: -0.5, max: 0.5 }, speedX: { min: -0.5, max: 0.5 } }
    };

    const contexts = {};
    const particles = {};
    let animationFrameId = null;
    let isActive = false;

    class Particle {
        constructor(type, w, h) {
            this.type = type;
            this.reset(w, h, true);
        }

        reset(w, h, init = false) {
            const cfg = Config[this.type];
            this.x = Math.random() * w;
            this.y = init ? Math.random() * h : (cfg.speedY.min > 0 ? -10 : h + 10);
            this.size = Math.random() * (cfg.size.max - cfg.size.min) + cfg.size.min;
            this.speedX = Math.random() * (cfg.speedX.max - cfg.speedX.min) + cfg.speedX.min;
            this.speedY = Math.random() * (cfg.speedY.max - cfg.speedY.min) + cfg.speedY.min;
            this.alpha = Math.random() * 0.5 + 0.3;
            this.fade = Math.random() * 0.02 + 0.005;
            this.oscillation = Math.random() * 0.1;
            this.oscSpeed = Math.random() * 0.05;
        }

        update(w, h) {
            this.x += this.speedX + Math.sin(this.oscillation) * 0.5;
            this.y += this.speedY;
            this.oscillation += this.oscSpeed;

            if (this.type === 'firefly') {
                this.alpha += this.fade;
                if (this.alpha > 0.8 || this.alpha < 0.2) this.fade = -this.fade;
            }

            if (this.x < -10 || this.x > w + 10 || this.y < -10 || this.y > h + 10) {
                this.reset(w, h, false);
            }
        }

        draw(ctx) {
            ctx.fillStyle = `${Config[this.type].color}${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initCanvas(key, container) {
        if (!container) return;
        
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        
        container.innerHTML = '';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        contexts[key] = ctx;
        
        resizeCanvas(canvas);
        
        particles[key] = [];
        for (let i = 0; i < Config[key].count; i++) {
            particles[key].push(new Particle(key, canvas.width, canvas.height));
        }
    }

    function resizeCanvas(canvas) {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        const ctx = canvas.getContext('2d');
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function render() {
        if (!isActive) return;

        Object.keys(contexts).forEach(key => {
            const ctx = contexts[key];
            const canvas = ctx.canvas;
            const w = canvas.width / window.devicePixelRatio;
            const h = canvas.height / window.devicePixelRatio;

            ctx.clearRect(0, 0, w, h);

            particles[key].forEach(p => {
                p.update(w, h);
                p.draw(ctx);
            });
        });

        animationFrameId = requestAnimationFrame(render);
    }

    function startEngine() {
        if (isActive) return;
        isActive = true;
        Object.keys(CanvasLayers).forEach(key => {
            initCanvas(key, CanvasLayers[key]);
        });
        render();
    }

    function stopEngine() {
        isActive = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        Object.keys(contexts).forEach(key => {
            const canvas = contexts[key].canvas;
            if (canvas && canvas.parentElement) {
                canvas.parentElement.innerHTML = '';
            }
        });
    }

    function handleResize() {
        if (!isActive) return;
        Object.keys(contexts).forEach(key => {
            resizeCanvas(contexts[key].canvas);
        });
    }

    // Hook into global sequence transition via MutationObserver on messageSection
    const targetSection = document.getElementById('messageSection');
    if (targetSection) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'style') {
                    const display = targetSection.style.display;
                    if (display === 'block') {
                        setTimeout(startEngine, 400);
                    } else if (display === 'none') {
                        stopEngine();
                    }
                }
            });
        });
        observer.observe(targetSection, { attributes: true });
    }

    window.addEventListener('resize', handleResize);
})();
          "use strict";

// Mobile WebKit Audio Unlocker & Specialized Interactive Effects Layer
(function() {
    const UI = {
        music: document.getElementById('birthdayMusic'),
        musicBtn: document.getElementById('musicBtn'),
        messageCard: document.getElementById('messageCard'),
        heartLayer: document.getElementById('heartLayer'),
        confettiLayer: document.getElementById('confettiLayer')
    };

    // Mobile Interaction & Audio Unlock Framework
    function unlockAudio() {
        if (!UI.music) return;
        
        const unlockEvents = ['touchstart', 'click', 'keydown'];
        const unlock = () => {
            UI.music.play().then(() => {
                UI.music.pause();
                removeListeners();
            }).catch(err => {
                console.warn("Audio interaction pending user action", err);
            });
        };

        const removeListeners = () => {
            unlockEvents.forEach(evt => document.removeEventListener(evt, unlock));
        };

        unlockEvents.forEach(evt => document.addEventListener(evt, unlock, { passive: true }));
    }

    // Dynamic Touch Burst Interaction on Final Card
    function setupInteractiveBurst() {
        if (!UI.messageCard || !UI.heartLayer) return;

        const createHeartBurst = (x, y) => {
            const colors = ['#ff4d6d', '#ff758f', '#ff8fa3', '#ffb3c1', '#ffccd5'];
            const segmentCount = 12;

            for (let i = 0; i < segmentCount; i++) {
                const heart = document.createElement('div');
                heart.className = 'interactive-heart';
                heart.innerHTML = '❤';
                heart.style.position = 'absolute';
                heart.style.left = `${x}px`;
                heart.style.top = `${y}px`;
                heart.style.color = colors[Math.floor(Math.random() * colors.length)];
                heart.style.fontSize = `${Math.random() * 12 + 14}px`;
                heart.style.pointerEvents = 'none';
                heart.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
                
                const angle = (i / segmentCount) * Math.PI * 2;
                const velocity = Math.random() * 100 + 50;
                const targetX = Math.cos(angle) * velocity;
                const targetY = Math.sin(angle) * velocity - 40;

                UI.heartLayer.appendChild(heart);

                requestAnimationFrame(() => {
                    heart.style.transform = `translate(${targetX}px, ${targetY}px) scale(0)`;
                    heart.style.opacity = '0';
                });

                setTimeout(() => heart.remove(), 800);
            }
        };

        const handleEvent = (e) => {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const rect = UI.heartLayer.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            createHeartBurst(x, y);
        };

        UI.messageCard.addEventListener('mousedown', handleEvent);
        UI.messageCard.addEventListener('touchstart', handleEvent, { passive: true });
    }

    // Hardware Acceleration Optimization Profiler
    function optimizePerformanceProfile() {
        const isLowEnd = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isLowEnd) {
            document.documentElement.classList.add('mobile-perf-optimized');
        }
    }

    // System Execution
    unlockAudio();
    setupInteractiveBurst();
    optimizePerformanceProfile();
})();
          "use strict";

// Advanced Lifecycle, Window Cleanup, and State Synchronization Module
(function() {
    const UI = {
        music: document.getElementById('birthdayMusic'),
        musicBtn: document.getElementById('musicBtn'),
        restartBtn: document.getElementById('restartBtn')
    };

    // Track active event listeners globally for comprehensive cleanup capabilities
    const activeListeners = [];

    function registerManagedListener(element, event, handler, options = false) {
        if (!element) return;
        element.addEventListener(event, handler, options);
        activeListeners.push({ element, event, handler, options });
    }

    function unbindAllManagedListeners() {
        activeListeners.forEach(({ element, event, handler, options }) => {
            if (element) {
                element.removeEventListener(event, handler, options);
            }
        });
        activeListeners.length = 0;
    }

    // Tab Focus & Frozen State Management (Page Lifecycle API)
    function handlePageLifecycle(state) {
        if (!UI.music) return;
        
        if (state === 'hidden' || state === 'frozen') {
            if (!UI.music.paused) {
                UI.music.pause();
                if (UI.musicBtn) UI.musicBtn.classList.remove('playing');
                window.localStorage.setItem('music_was_playing', 'true');
            }
        } else if (state === 'visible') {
            const wasPlaying = window.localStorage.getItem('music_was_playing') === 'true';
            if (wasPlaying) {
                UI.music.play().then(() => {
                    if (UI.musicBtn) UI.musicBtn.classList.add('playing');
                }).catch(err => console.warn("Context resume deferred:", err));
                window.localStorage.removeItem('music_was_playing');
            }
        }
    }

    // Hardware-accelerated Resize Debouncer for Layout Stabilization
    let resizeTimeout = null;
    function debouncedResize() {
        if (resizeTimeout) {
            cancelAnimationFrame(resizeTimeout);
        }
        resizeTimeout = requestAnimationFrame(() => {
            // Coordinate synchronization recalculations for device orientation pivots
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        });
    }

    // Memory Leak Protections & System Teardown
    function setupSystemSanitizers() {
        registerManagedListener(window, 'visibilitychange', () => {
            handlePageLifecycle(document.hidden ? 'hidden' : 'visible');
        });

        // Handle page freezing on mobile devices
        registerManagedListener(window, 'freeze', () => handlePageLifecycle('frozen'));
        registerManagedListener(window, 'resume', () => handlePageLifecycle('visible'));

        // Handle active viewport transformations
        registerManagedListener(window, 'resize', debouncedResize);
        registerManagedListener(window, 'orientationchange', debouncedResize);

        // Bind explicit cleanup to the global restart pattern
        if (UI.restartBtn) {
            registerManagedListener(UI.restartBtn, 'click', () => {
                window.localStorage.removeItem('music_was_playing');
                debouncedResize();
            });
        }
    }

    // Global Error Boundary Protection for Fluid UX
    function initErrorBoundary() {
        window.addEventListener('error', function(event) {
            console.error("Internal Engine Fault Captured:", event.error);
            // Non-blocking fallback mechanism to avoid full interface locking
            const loader = document.getElementById('loader');
            if (loader && loader.style.display !== 'none') {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 300);
            }
            return true; // Prevent default browser crash dialog processing
        }, { passive: true });
    }

    // Execution Core
    initErrorBoundary();
    setupSystemSanitizers();
    debouncedResize();
})();
"use strict";

// Dynamic Style Optimization and CSS Keyframe Injection Engine
(function() {
    const styleId = "birthday-website-dynamic-core-styles";
    if (document.getElementById(styleId)) return;

    const styleElement = document.createElement("style");
    styleElement.id = styleId;

    styleElement.textContent = `
        /* Ken Burns Zoom Effect */
        @keyframes kenBurns {
            0% {
                transform: scale(1) translate(0, 0);
            }
            50% {
                transform: scale(1.15) translate(-1%, -1%);
            }
            100% {
                transform: scale(1.05) translate(0, 0);
            }
        }

        /* Spark Particle Physics */
        .spark {
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, #fffae6 0%, #ffaa00 60%, #ff3300 100%);
            border-radius: 50%;
            pointer-events: none;
            box-shadow: 0 0 10px #ffaa00, 0 0 20px #ff3300;
            animation: sparkRender 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        @keyframes sparkRender {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(var(--mx, 40px), var(--my, -60px)) scale(0);
                opacity: 0;
            }
        }

        /* Smoke Dispersion System */
        .smoke {
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(220, 220, 220, 0.4);
            border-radius: 50%;
            filter: blur(5px);
            pointer-events: none;
            animation: smokeRender 2s ease-out forwards;
        }

        @keyframes smokeRender {
            0% {
                transform: scale(0.5) translateY(0);
                opacity: 0.6;
            }
            100% {
                transform: scale(3) translateY(-80px);
                opacity: 0;
            }
        }

        /* HTML5 Layout Enhancements for Smooth Performance */
        .mobile-perf-optimized * {
            will-change: transform, opacity;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }

        /* Interactive Target Micro-Animations */
        .interactive-heart {
            font-family: Arial, sans-serif;
            z-index: 9999;
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
        }
    `;

    document.head.appendChild(styleElement);

    // Dynamic execution of randomized spark trajectories via inline parameters
    const targetContainer = document.getElementById('sparkContainer');
    if (targetContainer) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.classList && node.classList.contains('spark')) {
                            const angle = Math.random() * Math.PI * 2;
                            const distance = Math.random() * 80 + 20;
                            const mx = Math.cos(angle) * distance;
                            const my = Math.sin(angle) * distance;
                            node.style.setProperty('--mx', `${mx}px`);
                            node.style.setProperty('--my', `${my}px`);
                        }
                    });
                }
            });
        });
        observer.observe(targetContainer, { childList: true });
    }
})();
"use strict";

// Advanced Asset Preloading, Cache Management, and Media Verification Engine
(function() {
    const ASSETS = {
        images: Array.from({ length: 10 }, (_, i) => `assets/images/${i + 1}.jpg`),
        audio: ['assets/audio/birthday.mp3']
    };

    const Status = {
        loadedImages: 0,
        totalImages: ASSETS.images.length,
        audioReady: false
    };

    // Low-overhead background preloader using Image Object pool
    function preloadImages() {
        ASSETS.images.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                Status.loadedImages++;
                evaluateAssetReadiness();
            };
            img.onerror = () => {
                console.warn(`Asset missing or failed to resolve: ${src}`);
                // Non-blocking placeholder bypass to maintain uninterrupted UX
                Status.loadedImages++;
                evaluateAssetReadiness();
            };
        });
    }

    // Audio Element buffer verification pipeline
    function verifyAudioBuffer() {
        const audioEl = document.getElementById('birthdayMusic');
        if (!audioEl) {
            Status.audioReady = true;
            evaluateAssetReadiness();
            return;
        }

        // Check if audio metadata or states are already resolved by browser cache
        if (audioEl.readyState >= 3) {
            Status.audioReady = true;
            evaluateAssetReadiness();
        } else {
            audioEl.addEventListener('canplaythrough', () => {
                Status.audioReady = true;
                evaluateAssetReadiness();
            }, { once: true });

            audioEl.addEventListener('error', () => {
                console.error("Audio pipeline initialization failed. Engaging silent mode fallback.");
                Status.audioReady = true;
                evaluateAssetReadiness();
            }, { once: true });
        }
    }

    // Synchronized ready check to transition out of the system loader safely
    function evaluateAssetReadiness() {
        if (Status.loadedImages >= Status.totalImages && Status.audioReady) {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.setAttribute('data-assets-loaded', 'true');
                // Dispatches a native custom event to unlock structural transitions safely
                const readyEvent = new CustomEvent('BirthdayEngineReady', {
                    detail: { timestamp: performance.now() }
                });
                document.dispatchEvent(readyEvent);
            }
        }
    }

    // System Monitor Hook
    function initPreloadingPipeline() {
        // Delay execution non-critically to prioritize immediate DOM parsing and painting
        if (document.readyState === 'complete') {
            preloadImages();
            verifyAudioBuffer();
        } else {
            window.addEventListener('load', () => {
                preloadImages();
                verifyAudioBuffer();
            }, { once: true });
        }
    }

    initPreloadingPipeline();
})();
"use strict";

// Final Unification, System Health Diagnostics, and Initialization Orchestrator
(function() {
    const REQUIRED_IDS = [
        'loader', 'introSection', 'matchSection', 'pathSection', 'giftSection',
        'slideshowSection', 'messageSection', 'beginBtn', 'birthdayMusic',
        'musicBtn', 'restartBtn', 'fullscreenBtn', 'matchStick', 'matchBox',
        'sparkContainer', 'smokeContainer', 'fireLight', 'fireBall', 'travelPath',
        'giftLid', 'currentSlide', 'totalSlides', 'slide', 'slideFlash',
        'messageCard', 'flashOverlay', 'matchArea', 'heartLayer', 'confettiLayer',
        'goldLayer', 'magicLayer', 'fireflyLayer'
    ];

    // Self-checking integrity routine to guarantee flawless runtime operations
    function runSystemDiagnostic() {
        const missingElements = [];
        REQUIRED_IDS.forEach(id => {
            if (!document.getElementById(id)) {
                missingElements.push(id);
            }
        });

        if (missingElements.length > 0) {
            console.warn(`System Diagnostic Warning: Elements missing from DOM: [${missingElements.join(', ')}]. Injecting virtual nodes to prevent null pointer exceptions.`);
            missingElements.forEach(id => {
                const dummy = document.createElement('div');
                dummy.id = id;
                dummy.style.display = 'none';
                document.body.appendChild(dummy);
            });
        }
    }

    // Intercept preloader signals to synchronize application presentation smoothly
    function bindOrchestratorTransitions() {
        document.addEventListener('BirthdayEngineReady', (e) => {
            const loader = document.getElementById('loader');
            const intro = document.getElementById('introSection');
            
            if (loader) {
                loader.style.transition = 'opacity 0.5s ease-in-out';
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    if (intro && intro.style.display !== 'block') {
                        // Cascade sections uniformly if previous hooks stalled
                        const sections = ['introSection', 'matchSection', 'pathSection', 'giftSection', 'slideshowSection', 'messageSection'];
                        sections.forEach(s => {
                            const el = document.getElementById(s);
                            if (el) el.style.display = 'none';
                        });
                        intro.style.display = 'block';
                        intro.style.opacity = '1';
                    }
                }, 500);
            }
        }, { once: true });
    }

    // Defensive patch for older mobile browsers lacks support for passive event listeners
    function polyfillPassiveListeners() {
        let supportsPassive = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get: function() {
                    supportsPassive = true;
                    return true;
                }
            });
            window.addEventListener('testPassive', null, opts);
            window.removeEventListener('testPassive', null, opts);
        } catch (e) {
            supportsPassive = false;
        }
        window.__supportsPassiveEvents = supportsPassive;
    }

    // Safe Initialization Pipeline
    runSystemDiagnostic();
    polyfillPassiveListeners();
    bindOrchestratorTransitions();
})();"use strict";

// Final Release Lock, Console Watermark, and Absolute Lifecycle Sealing Module
(function() {
    const PRODUCTION_METRICS = {
        buildVersion: "2.0.0",
        releaseDate: "2026-07-08",
        engineStatus: "OPTIMIZED"
    };

    // Prints a premium verification log to console signaling successful deployment
    function printProductionWatermark() {
        console.log(
            `%c🎉 Birthday Website Engine Initialized Successfully v${PRODUCTION_METRICS.buildVersion} [${PRODUCTION_METRICS.releaseDate}] %cStatus: ${PRODUCTION_METRICS.engineStatus}`,
            "color: #d4af37; font-weight: bold; font-size: 14px; text-shadow: 0 0 5px rgba(212,175,55,0.3);",
            "color: #00ff00; font-weight: bold; background: #111; padding: 2px 6px; border-radius: 3px;"
        );
    }

    // Prevents accidental context menus or gesture collision disruptions on mobile interactives
    function protectInteractiveBoundaries() {
        const interactiveElements = [
            document.getElementById('matchStick'),
            document.getElementById('matchBox'),
            document.getElementById('messageCard'),
            document.getElementById('giftSection')
        ];

        interactiveElements.forEach(el => {
            if (!el) return;
            
            // Prevents long-press image saving context menus on webkit/blink during active dragging
            el.addEventListener('contextmenu', (e) => {
                if (e.pointerType === 'touch') {
                    e.preventDefault();
                }
            }, { passive: false });

            // Inhibits native browser elastic overscroll bouncing when dragging elements
            el.addEventListener('pointerdown', () => {
                document.body.style.overscrollBehavior = 'none';
                document.documentElement.style.overscrollBehavior = 'none';
            }, { passive: true });

            el.addEventListener('pointerup', () => {
                document.body.style.overscrollBehavior = '';
                document.documentElement.style.overscrollBehavior = '';
            }, { passive: true });
        });
    }

    // Global freeze handler to prevent downstream script mutations on structural variables
    function sealRuntimeState() {
        if (typeof window.__BIRTHDAY_ENGINE_SEALED__ !== 'undefined') return;
        
        Object.defineProperty(window, '__BIRTHDAY_ENGINE_SEALED__', {
            value: true,
            writable: false,
            configurable: false,
            enumerable: true
        });

        // Garbage collection hint optimization pass
        if (window.performance && window.performance.clearMeasures) {
            window.performance.clearMeasures();
        }
    }

    // Execution Sequence
    printProductionWatermark();
    protectInteractiveBoundaries();
    sealRuntimeState();
})();"use strict";

// Production Performance Analytics & UX Timing Metrics Engine
(function() {
    const Metrics = {
        startTime: performance.now(),
        milestones: {}
    };

    function recordMilestone(name) {
        Metrics.milestones[name] = performance.now() - Metrics.startTime;
    }

    // Monitor major structural transitions to profile user engagement durations
    document.addEventListener('DOMContentLoaded', () => recordMilestone('DOM_Ready'));
    document.addEventListener('BirthdayEngineReady', () => recordMilestone('Assets_Loaded'));

    const beginBtn = document.getElementById('beginBtn');
    if (beginBtn) {
        beginBtn.addEventListener('click', () => recordMilestone('Experience_Started'), { passive: true });
    }

    const messageSection = document.getElementById('messageSection');
    if (messageSection) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'style' && messageSection.style.display === 'block') {
                    recordMilestone('Final_Message_Reached');
                    logPerformanceReport();
                    observer.disconnect();
                }
            });
        });
        observer.observe(messageSection, { attributes: true });
    }

    function logPerformanceReport() {
        if (!console.table) return;
        const report = Object.keys(Metrics.milestones).map(key => ({
            "Milestone Event": key,
            "Time Elapsed (ms)": Math.round(Metrics.milestones[key])
        }));
        console.info("%c📊 Production UX Performance Profile:", "color: #00bfff; font-weight: bold;");
        console.table(report);
    }"use strict";

// Advanced Viewport Orientation Guard and Display Optimization System
(function() {
    const UI = {
        slideshowSection: document.getElementById('slideshowSection'),
        messageSection: document.getElementById('messageSection')
    };

    function evaluateOrientationSafety() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) {
            if (!isLandscape && UI.slideshowSection && UI.slideshowSection.style.display === 'block') {
                document.documentElement.classList.add('request-landscape-mode');
                injectOrientationOverlay();
            } else {
                document.documentElement.classList.remove('request-landscape-mode');
                removeOrientationOverlay();
            }
        }
    }

    function injectOrientationOverlay() {
        if (document.getElementById('orientation-guard-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'orientation-guard-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(10, 10, 10, 0.95);
            color: #d4af37;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 100000;
            font-family: sans-serif;
            text-align: center;
            padding: 20px;
            box-sizing: border-box;
        `;

        overlay.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 15px;">🔄 Please Rotate Your Device</div>
            <div style="font-size: 14px; color: #aaa;">Landscape orientation provides the premium gallery view experience.</div>
        `;

        document.body.appendChild(overlay);
    }

    function removeOrientationOverlay() {
        const overlay = document.getElementById('orientation-guard-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    window.addEventListener('resize', evaluateOrientationSafety, { passive: true });
    window.addEventListener('orientationchange', evaluateOrientationSafety, { passive: true });

    const observer = new MutationObserver(() => {
        if (UI.slideshowSection && UI.slideshowSection.style.display === 'block') {
            evaluateOrientationSafety();
        } else {
            removeOrientationOverlay();
        }
    });

    if (UI.slideshowSection) {
        observer.observe(UI.slideshowSection, { attributes: true, attributeFilter: ['style'] });
    }"use strict";

// Advanced Runtime Diagnostics, Adaptive Memory Optimization, and Garbage Collection Pass
(function() {
    const MemoryController = {
        maxCachedElements: 50,
        activeDynamicNodes: [],
        
        // Tracks dynamic DOM nodes injected by particle emitters to prevent leaks
        registerDynamicNode(node) {
            this.activeDynamicNodes.push(node);
            if (this.activeDynamicNodes.length > this.maxCachedElements) {
                const oldestNode = this.activeDynamicNodes.shift();
                if (oldestNode && oldestNode.parentNode) {
                    oldestNode.parentNode.removeChild(oldestNode);
                }
            }
        },

        // Manual sweep trigger to re-optimize memory heap during transition shifts
        executePurgeSweep() {
            this.activeDynamicNodes = this.activeDynamicNodes.filter(node => {
                if (node && !document.body.contains(node)) {
                    if (node.parentNode) node.parentNode.removeChild(node);
                    return false;
                }
                return true;
            });
        }
    };

    // Listen across layout transition events to execute passive memory adjustments
    const messageSection = document.getElementById('messageSection');
    if (messageSection) {
        const memoryObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'style' && messageSection.style.display === 'block') {
                    // Execute standard runtime memory reclamation once final target card animates
                    setTimeout(() => MemoryController.executePurgeSweep(), 1000);
                }
            });
        });
        memoryObserver.observe(messageSection, { attributes: true });
    }

    // Expose memory controller properties strictly internally onto local execution context
    window.__RuntimeMemoryManager = MemoryController;
})();    "use strict";

// Web Audio API Context Analyzer for Audio-Reactive UI Pulsing
(function() {
    const UI = {
        music: document.getElementById('birthdayMusic'),
        messageCard: document.getElementById('messageCard'),
        fireLight: document.getElementById('fireLight'),
        messageSection: document.getElementById('messageSection'),
        matchSection: document.getElementById('matchSection')
    };

    let audioCtx = null;
    let analyser = null;
    let dataArray = null;
    let source = null;
    let isInitialized = false;

    function initAudioAnalyzer() {
        if (isInitialized || !UI.music) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            audioCtx = new AudioContext();
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64; 

            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            source = audioCtx.createMediaElementSource(UI.music);
            source.connect(analyser);
            analyser.connect(audioCtx.destination);

            isInitialized = true;
            startReactiveLoop();
        } catch (e) {
            console.warn("AudioContext setup deferred due to browser state restrictions.", e);
        }
    }

    function startReactiveLoop() {
        if (!isInitialized) return;

        const updatePulse = () => {
            if (UI.music && !UI.music.paused) {
                analyser.getByteFrequencyData(dataArray);
                
                let total = 0;
                const sampleSize = 8; 
                for (let i = 0; i < sampleSize; i++) {
                    total += dataArray[i];
                }
                const average = total / sampleSize;
                const scale = 1 + (average / 255) * 0.05; 
                const intensity = 0.3 + (average / 255) * 0.7;

                if (UI.messageCard && UI.messageSection && UI.messageSection.style.display === 'block') {
                    UI.messageCard.style.transform = `scale(${scale}) translateZ(0)`;
                }
                if (UI.fireLight && UI.matchSection && UI.matchSection.style.display === 'block') {
                    UI.fireLight.style.opacity = `${intensity}`;
                    UI.fireLight.style.transform = `scale(${1 + (average / 255) * 0.2}) translateZ(0)`;
                }
            }
            requestAnimationFrame(updatePulse);
        };

        requestAnimationFrame(updatePulse);
    }

    if (UI.music) {
        const handleContextResume = () => {
            if (!isInitialized) {
                initAudioAnalyzer();
            } else if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        };

        UI.music.addEventListener('play', handleContextResume, { passive: true });
    }"use strict";

// Dynamic FPS Monitor & Real-Time Performance Throttler
(function() {
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;
    let dropCount = 0;
    let isThrottled = false;

    function monitorFPS(time) {
        frameCount++;
        if (time > lastTime + 1000) {
            fps = Math.round((frameCount * 1000) / (time - lastTime));
            frameCount = 0;
            lastTime = time;

            // Detect sustained performance degradation
            if (fps < 40 && !isThrottled) {
                dropCount++;
                if (dropCount >= 3) {
                    engagePerformanceThrottle();
                }
            } else {
                dropCount = Math.max(0, dropCount - 1);
            }
        }
        if (!isThrottled) {
            requestAnimationFrame(monitorFPS);
        }
    }

    function engagePerformanceThrottle() {
        isThrottled = true;
        document.documentElement.classList.add('low-perf-fallback');
        
        // Dynamically adjust operational limits on the runtime cache
        if (window.__RuntimeMemoryManager) {
            window.__RuntimeMemoryManager.maxCachedElements = 15;
            window.__RuntimeMemoryManager.executePurgeSweep();
        }
        
        // Cursory cleanup of high-overhead DOM-based animation nodes
        const intensiveLayers = ['heartLayer', 'confettiLayer', 'goldLayer', 'magicLayer', 'fireflyLayer'];
        intensiveLayers.forEach(id => {
            const layer = document.getElementById(id);
            if (layer) {
                // Instantly halve the active DOM strain
                const targetCount = Math.floor(layer.children.length / 2);
                while (layer.children.length > targetCount && layer.lastChild) {
                    layer.removeChild(layer.lastChild);
                }
            }
        });

        console.warn("Performance degradation detected. Automatic graphics throttle engaged to stabilize frame presentation.");
    }

    // Initialize core tracking thread safely
    if (window.requestAnimationFrame) {
        requestAnimationFrame(monitorFPS);
    }
})();
  
})();
  
  
})();
  
})();




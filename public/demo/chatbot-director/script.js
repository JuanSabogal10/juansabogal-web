/* ========================================
   Mancii Presentation — Navigation, i18n & Chat
   ======================================== */

(function() {
    'use strict';

    // State
    let currentSlide = 0;
    let currentLang = 'fr';
    let currentChat = 'metrics';
    const totalSlides = 8;

    // DOM
    const container = document.getElementById('slidesContainer');
    const dots = document.querySelectorAll('.dot');
    const langToggle = document.getElementById('langToggle');
    const slides = document.querySelectorAll('.slide');
    const keyboardHint = document.getElementById('keyboardHint');

    // ---- Navigation ----
    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        currentSlide = index;

        // Scroll to slide
        slides[index].scrollIntoView({ behavior: 'smooth' });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Activate slide content animation
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // Start chat animation when reaching slide 7
        if (index === 7) {
            setTimeout(() => startChatAnimation(currentChat), 500);
        }

        // Hide keyboard hint after first navigation
        if (keyboardHint) {
            keyboardHint.style.opacity = '0';
            setTimeout(() => keyboardHint.style.display = 'none', 300);
        }
    }

    // Dot clicks
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.slide));
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            goToSlide(currentSlide + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            goToSlide(currentSlide - 1);
        }
    });

    // Intersection Observer for scroll-based activation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const slideIndex = parseInt(entry.target.dataset.slide);
                if (!isNaN(slideIndex)) {
                    currentSlide = slideIndex;

                    // Update dots
                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === slideIndex);
                    });

                    // Activate content
                    entry.target.classList.add('active');

                    // Start chat animation when reaching slide 7
                    if (slideIndex === 7) {
                        setTimeout(() => startChatAnimation(currentChat), 500);
                    }
                }
            }
        });
    }, {
        threshold: 0.5
    });

    slides.forEach(slide => observer.observe(slide));

    // ---- Language Toggle ----
    function setLanguage(lang) {
        currentLang = lang;

        // Update all translatable elements
        document.querySelectorAll('[data-fr][data-es]').forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) el.textContent = text;
        });

        // Update toggle button
        const spans = langToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.classList.remove('lang-active');
            if (span.textContent === lang.toUpperCase()) {
                span.classList.add('lang-active');
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang === 'fr' ? 'fr' : 'es';

        // Restart chat with new language
        startChatAnimation(currentChat);
    }

    langToggle.addEventListener('click', () => {
        setLanguage(currentLang === 'fr' ? 'es' : 'fr');
    });

    // ---- Chat Demo ----
    const conversations = {
        metrics: {
            fr: [
                { type: 'user', text: 'Combien d\'étudiants ont passé le test vocational ce mois-ci ?' },
                { type: 'process', text: '🔍 Classification: Métriques' },
                { type: 'process', text: '⚙️ SQL: SELECT COUNT(*) FROM vista_metricas_agregadas...' },
                { type: 'process', text: '✓ 1,247 vérifié contre les données réelles' },
                { type: 'bot', text: 'Ce mois-ci, 1 247 étudiants ont passé le test vocational. C\'est +12% par rapport au mois dernier.' },
                { type: 'source', text: '📊 Source: vista_metricas_agregadas' }
            ],
            es: [
                { type: 'user', text: '¿Cuántos estudiantes rindieron la prueba vocacional este mes?' },
                { type: 'process', text: '🔍 Clasificación: Métricas' },
                { type: 'process', text: '⚙️ SQL: SELECT COUNT(*) FROM vista_metricas_agregadas...' },
                { type: 'process', text: '✓ 1,247 verificado contra datos reales' },
                { type: 'bot', text: 'Este mes rindieron la prueba vocacional 1,247 estudiantes. Es +12% comparado con el mes pasado.' },
                { type: 'source', text: '📊 Fuente: vista_metricas_agregadas' }
            ]
        },
        strategy: {
            fr: [
                { type: 'user', text: 'Comment puis-je améliorer la conversion de mes leads ?' },
                { type: 'process', text: '🔍 Classification: Stratégie' },
                { type: 'process', text: '🧠 Contexte: profil + mémoire + blog Mancii' },
                { type: 'process', text: '✓ Recommandation générée' },
                { type: 'bot', text: 'Basé sur votre profil et vos données : je recommande de focaliser sur le WhatsApp marketing. Votre CAC de $45 peut être réduit à $32 avec une stratégie de nurturing automatisée.' },
                { type: 'source', text: '🧠 Basé sur votre historique et les données Mancii' }
            ],
            es: [
                { type: 'user', text: '¿Cómo puedo mejorar la conversión de mis leads?' },
                { type: 'process', text: '🔍 Clasificación: Estrategia' },
                { type: 'process', text: '🧠 Contexto: perfil + memoria + blog Mancii' },
                { type: 'process', text: '✓ Recomendación generada' },
                { type: 'bot', text: 'Basado en tu perfil y datos: recomiendo enfocar en WhatsApp marketing. Tu CAC de $45 puede reducirse a $32 con una estrategia de nurturing automatizada.' },
                { type: 'source', text: '🧠 Basado en tu historial y datos Mancii' }
            ]
        },
        admin: {
            fr: [
                { type: 'user', text: '/directores' },
                { type: 'process', text: '🔐 Vérification 2FA: Allowlist ✓ + Clé secrète ✓' },
                { type: 'process', text: '✓ Session admin active' },
                { type: 'bot', text: '📋 Directeurs actifs:\n\n1. María García — Université X — ✅ Onboarding complet\n2. Carlos López — Université Y — ⏳ En cours\n3. Ana Martínez — Université Z — ✅ Onboarding complet' },
                { type: 'source', text: '🔐 Action enregistrée dans l\'audit log' }
            ],
            es: [
                { type: 'user', text: '/directores' },
                { type: 'process', text: '🔐 Verificación 2FA: Allowlist ✓ + Clave secreta ✓' },
                { type: 'process', text: '✓ Sesión admin activa' },
                { type: 'bot', text: '📋 Directores activos:\n\n1. María García — Universidad X — ✅ Onboarding completo\n2. Carlos López — Universidad Y — ⏳ En progreso\n3. Ana Martínez — Universidad Z — ✅ Onboarding completo' },
                { type: 'source', text: '🔐 Acción registrada en audit log' }
            ]
        }
    };

    let chatTimeout = null;

    function startChatAnimation(chatType) {
        // Clear any existing animation
        if (chatTimeout) {
            clearTimeout(chatTimeout);
            chatTimeout = null;
        }

        const phoneChat = document.getElementById('phoneChat');
        const processSteps = document.querySelectorAll('.process-step');
        
        if (!phoneChat) return;

        // Clear chat
        phoneChat.innerHTML = '';
        processSteps.forEach(step => {
            step.classList.remove('active', 'done');
        });

        const messages = conversations[chatType][currentLang];
        let delay = 0;

        messages.forEach((msg, index) => {
            delay += msg.type === 'process' ? 600 : 1200;

            chatTimeout = setTimeout(() => {
                if (msg.type === 'user') {
                    addMessage(phoneChat, msg.text, 'user');
                } else if (msg.type === 'process') {
                    addMessage(phoneChat, msg.text, 'process');
                    // Update process steps
                    updateProcessSteps(processSteps, index);
                } else if (msg.type === 'bot') {
                    // Show typing indicator first
                    showTyping(phoneChat);
                    setTimeout(() => {
                        removeTyping(phoneChat);
                        addMessage(phoneChat, msg.text, 'bot');
                    }, 800);
                } else if (msg.type === 'source') {
                    addMessage(phoneChat, msg.text, 'source');
                }
            }, delay);
        });
    }

    function addMessage(container, text, type) {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${type}`;
        msg.textContent = text;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
    }

    function showTyping(container) {
        const typing = document.createElement('div');
        typing.className = 'typing-indicator';
        typing.id = 'typingIndicator';
        typing.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        container.appendChild(typing);
        container.scrollTop = container.scrollHeight;
    }

    function removeTyping(container) {
        const typing = container.querySelector('#typingIndicator');
        if (typing) typing.remove();
    }

    function updateProcessSteps(steps, messageIndex) {
        if (messageIndex === 1) {
            steps[0]?.classList.add('active');
        } else if (messageIndex === 2) {
            steps[0]?.classList.remove('active');
            steps[0]?.classList.add('done');
            steps[1]?.classList.add('active');
        } else if (messageIndex === 3) {
            steps[1]?.classList.remove('active');
            steps[1]?.classList.add('done');
            steps[2]?.classList.add('active');
        } else if (messageIndex >= 4) {
            steps[2]?.classList.remove('active');
            steps[2]?.classList.add('done');
        }
    }

    // Chat tab clicks
    document.querySelectorAll('.chat-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Start new conversation
            currentChat = tab.dataset.chat;
            startChatAnimation(currentChat);
        });
    });

    // ---- Initialize ----
    goToSlide(0);

    // Hide hint after 5 seconds
    setTimeout(() => {
        if (keyboardHint) {
            keyboardHint.style.opacity = '0';
            setTimeout(() => keyboardHint.style.display = 'none', 300);
        }
    }, 5000);

})();

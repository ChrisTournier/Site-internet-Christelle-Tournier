/* ============================================
   Coaching Tremplin — Christelle Tournier
   v2 — Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ----- BURGER MENU ----- */
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav__link, .dropdown__link');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('nav--open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('nav--open');
        });
    });

    /* ----- HEADER SCROLL SHADOW ----- */
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        header.classList.toggle('header--scrolled', window.scrollY > 40);
    }, { passive: true });

    /* ----- SMOOTH SCROLL (anchor links, skip dropdown toggle) ----- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            if (href === '#' || href === '#!') return; // dropdown toggles
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ----- ACCORDION ----- */
    const accordionHeaders = document.querySelectorAll('.accordion__header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isOpen = item.classList.contains('accordion__item--open');

            // Toggle current item
            item.classList.toggle('accordion__item--open');
            header.setAttribute('aria-expanded', !isOpen);

            // Close others
            if (!isOpen) {
                accordionHeaders.forEach(otherHeader => {
                    if (otherHeader !== header) {
                        const otherItem = otherHeader.parentElement;
                        otherItem.classList.remove('accordion__item--open');
                        otherHeader.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        });
    });

    /* ----- REVEAL ON SCROLL (Intersection Observer) ----- */
    const revealElements = document.querySelectorAll(
        '.service-card, .about__inner, .contact__grid, .value-card, .offer-card, .section__title, .section__desc, .info-block, .accordion__item, .arborescence__center'
    );

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal--visible');
                    }
                });
            },
            { threshold: 0.12 }
        );

        revealElements.forEach(el => {
            el.classList.add('reveal');
            revealObserver.observe(el);
        });
    }

    /* ----- CONTACT FORM (mailto fallback) ----- */
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // --- Validation ---
            let valid = true;

            if (!name) {
                highlightField('name', true);
                valid = false;
            } else {
                highlightField('name', false);
            }

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                highlightField('email', true);
                valid = false;
            } else {
                highlightField('email', false);
            }

            if (!message) {
                highlightField('message', true);
                valid = false;
            } else {
                highlightField('message', false);
            }

            if (!valid) {
                formMessage.textContent = 'Veuillez remplir tous les champs obligatoires.';
                formMessage.className = 'form__footnote form__footnote--error';
                return;
            }

            // --- Mailto fallback — opens the user's email client ---
            const btn = form.querySelector('.btn');
            const originalText = btn.textContent;
            btn.textContent = 'Envoi en cours…';
            btn.disabled = true;

            const mailto = `mailto:pro.christelletournier@gmail.com?subject=${encodeURIComponent(subject || 'Demande Coaching Tremplin')}&body=${encodeURIComponent(
                `Nom : ${name}\nEmail : ${email}\n\n${message}`
            )}`;
            window.location.href = mailto;

            formMessage.textContent = '✅ Message prêt ! Vérifiez votre client email.';
            formMessage.className = 'form__footnote';
            form.reset();
            btn.textContent = originalText;
            btn.disabled = false;
        });
    }

    /* ----- HELPER: highlight field ----- */
    function highlightField(id, error) {
        const el = document.getElementById(id);
        if (!el) return;
        if (error) {
            el.classList.add('form__input--error');
        } else {
            el.classList.remove('form__input--error');
        }
    }
});

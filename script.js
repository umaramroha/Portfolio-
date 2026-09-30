document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const navbar = document.getElementById('navbar');
    const progress = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('main section[id]');
    const parallaxItems = document.querySelectorAll('[data-parallax]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateScrollUI = () => {
        const scrollTop = window.scrollY;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = `${scrollable > 0 ? (scrollTop / scrollable) * 100 : 0}%`;
        navbar.classList.toggle('scrolled', scrollTop > 30);
        backToTop.classList.toggle('visible', scrollTop > 700);

        let current = '';
        sections.forEach(section => {
            if (scrollTop >= section.offsetTop - 150) current = section.id;
        });
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));

        if (!reducedMotion) {
            const y = scrollTop * 0.12;
            document.querySelector('.orb-a')?.style.setProperty('--parallax-y', `${y}px`);
            document.querySelector('.orb-b')?.style.setProperty('--parallax-y', `${-y * .7}px`);
            document.querySelector('.orb-c')?.style.setProperty('--parallax-y', `${y * .45}px`);
        }
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => { updateScrollUI(); ticking = false; });
            ticking = true;
        }
    }, { passive: true });
    updateScrollUI();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: .12, rootMargin: '0px 0px -45px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    const closeMenu = () => {
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('menu-open');
    };
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        menuToggle.setAttribute('aria-expanded', 'true');
        body.classList.add('menu-open');
    });
    menuClose.addEventListener('click', closeMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

    if (!reducedMotion) {
        window.addEventListener('scroll', () => {
            parallaxItems.forEach(item => {
                const speed = Number(item.dataset.parallax || 0);
                const rect = item.getBoundingClientRect();
                const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed;
                item.style.transform = `translate3d(0, ${offset}px, 0)`;
            });
        }, { passive: true });
    }

    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));

    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    contactForm?.addEventListener('submit', e => {
        e.preventDefault();
        const data = new FormData(contactForm);
        const name = String(data.get('name') || '').trim();
        const email = String(data.get('email') || '').trim();
        const subject = String(data.get('subject') || 'Job Opportunity').trim();
        const message = String(data.get('message') || '').trim();
        const bodyText = `Name: ${name}\nEmail: ${email}\n\n${message}`;
        const mailto = `mailto:umarimam39@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
        formStatus.textContent = 'Opening your email app…';
        window.location.href = mailto;
    });
});

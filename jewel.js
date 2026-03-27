'use strict';

window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
            triggerHeroAnimations();
        }
    }, 2800);
    document.body.style.overflow = 'hidden';
});

function triggerHeroAnimations() {
    const heroElements = document.querySelectorAll('.hero .reveal-up');
    heroElements.forEach((el, i) => {
        const delay = parseInt(el.getAttribute('data-delay') || 0);
        setTimeout(() => {
            el.classList.add('revealed');
        }, delay + 300);
    });
}

const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

if (cursor && cursorFollower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;

        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';

        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverTargets = document.querySelectorAll('a, button, .category-card, .trend-card, .featured-card, .gem-item, .pillar');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorFollower.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorFollower.classList.remove('cursor-hover');
        });
    });
}

const navbar = document.getElementById('navbar');

let lastScrollY = 0;
let ticking = false;

function handleNavbarScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(handleNavbarScroll);
        ticking = true;
    }
}, { passive: true });

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);

        const spans = hamburger.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans.forEach(s => {
                s.style.transform = '';
                s.style.opacity = '';
            });
        }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(s => {
                s.style.transform = '';
                s.style.opacity = '';
            });
        });
    });
}

const heroSlides = document.querySelectorAll('.hero-slide');
const slideDots = document.querySelectorAll('.slide-dot');
let currentSlide = 0;
let slideInterval;

function goToSlide(index) {
    heroSlides[currentSlide].classList.remove('active');
    slideDots[currentSlide].classList.remove('active');

    currentSlide = (index + heroSlides.length) % heroSlides.length;

    heroSlides[currentSlide].classList.add('active');
    slideDots[currentSlide].classList.add('active');
}

function startSlideshow() {
    slideInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
    }, 5500);
}

function resetSlideshow() {
    clearInterval(slideInterval);
    startSlideshow();
}

if (heroSlides.length > 0) {
    slideDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetSlideshow();
        });
    });

    startSlideshow();
}

const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const nonHeroRevealElements = Array.from(revealElements).filter(
    el => !el.closest('.hero')
);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = parseInt(entry.target.getAttribute('data-delay') || 0);
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, delay);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
});

nonHeroRevealElements.forEach(el => revealObserver.observe(el));

const testimonialsTrack = document.getElementById('testimonialsTrack');
const testiPrev = document.getElementById('testiPrev');
const testiNext = document.getElementById('testiNext');
const testiDotButtons = document.querySelectorAll('.testi-dot');

let currentTesti = 0;
const totalTestimonials = document.querySelectorAll('.testimonial-card').length;
let autoTestiInterval;

function goToTestimonial(index) {
    currentTesti = (index + totalTestimonials) % totalTestimonials;
    testimonialsTrack.style.transform = `translateX(-${currentTesti * 100}%)`;

    testiDotButtons.forEach((d, i) => {
        d.classList.toggle('active', i === currentTesti);
    });
}

function startAutoTesti() {
    autoTestiInterval = setInterval(() => {
        goToTestimonial(currentTesti + 1);
    }, 5000);
}

if (testimonialsTrack) {
    testiPrev?.addEventListener('click', () => {
        goToTestimonial(currentTesti - 1);
        clearInterval(autoTestiInterval);
        startAutoTesti();
    });

    testiNext?.addEventListener('click', () => {
        goToTestimonial(currentTesti + 1);
        clearInterval(autoTestiInterval);
        startAutoTesti();
    });

    testiDotButtons.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToTestimonial(index);
            clearInterval(autoTestiInterval);
            startAutoTesti();
        });
    });

    let touchStartX = 0;
    let touchEndX = 0;

    testimonialsTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    testimonialsTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            goToTestimonial(diff > 0 ? currentTesti + 1 : currentTesti - 1);
            clearInterval(autoTestiInterval);
            startAutoTesti();
        }
    }, { passive: true });

    startAutoTesti();
}

const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (backToTop) {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
}, { passive: true });

backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('✦ You have joined the Zaid Inner Circle. Welcome!');
        newsletterForm.reset();
    });
}

function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        }
    });
});

document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const icon = btn.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.replace('far', 'fas');
            btn.style.color = '#C9A84C';
            showToast('♥ Added to your wishlist');
        } else {
            icon.classList.replace('fas', 'far');
            btn.style.color = '';
            showToast('Removed from wishlist');
        }
    });
});

function handleParallax() {
    const scrollY = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    const heroScrollHint = document.querySelector('.hero-scroll-hint');

    if (heroContent && scrollY < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrollY * 0.2}px)`;
        heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.7));
    }

    if (heroScrollHint) {
        heroScrollHint.style.opacity = Math.max(0, 1 - scrollY / 300);
    }
}

window.addEventListener('scroll', handleParallax, { passive: true });

const marqueeInner = document.querySelector('.marquee-inner');
if (marqueeInner) {
    marqueeInner.parentElement.addEventListener('mouseenter', () => {
        marqueeInner.style.animationPlayState = 'paused';
    });
    marqueeInner.parentElement.addEventListener('mouseleave', () => {
        marqueeInner.style.animationPlayState = 'running';
    });
}

function animateCounter(el, target, suffix = '', duration = 2000) {
    const startTime = performance.now();
    const isDecimal = String(target).includes('.');

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); 

        let current = eased * target;
        if (isDecimal) {
            el.textContent = current.toFixed(1) + suffix;
        } else {
            el.textContent = Math.floor(current) + suffix;
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target + suffix;
        }
    }
    requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const text = el.textContent;
            const hasPlus = text.includes('+');
            const hasK = text.includes('K');
            const hasPercent = text.includes('%');
            let num = parseFloat(text.replace(/[^0-9.]/g, ''));

            if (hasK) {
                animateCounter(el, num, 'K+');
            } else if (hasPlus) {
                animateCounter(el, num, '+');
            } else if (hasPercent) {
                animateCounter(el, num, '%');
            } else {
                animateCounter(el, num, '');
            }
            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num, .accent-number').forEach(el => {
    statObserver.observe(el);
});

function updateCategoryScroll() {
    const grid = document.querySelector('.categories-grid');
    if (!grid) return;

    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
    }
}

window.addEventListener('resize', updateCategoryScroll);
updateCategoryScroll();

document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.addEventListener('error', () => {
        img.style.background = 'linear-gradient(135deg, #2C2720, #3D3830)';
        img.alt = '';
    });
});

const logoMark = document.querySelector('.logo-mark');
if (logoMark) {
    setInterval(() => {
        logoMark.style.textShadow = `0 0 20px rgba(201, 168, 76, 0.8), 0 0 40px rgba(201, 168, 76, 0.4)`;
        setTimeout(() => {
            logoMark.style.textShadow = '';
        }, 700);
    }, 3500);
}

document.querySelectorAll('.quick-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('◈ Quick View coming soon — Book a consultation for exclusive viewing');
    });
});

document.querySelectorAll('.btn-gold-solid, .btn-gold').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (btn.getAttribute('href') === '#' || !btn.getAttribute('href')) {
            e.preventDefault();
            showToast('◈ This section is being crafted — Our atelier awaits you');
        }
    });
});

console.log('%c◈ ZAID ENTERPRISES', 'color: #C9A84C; font-size: 24px; font-family: Georgia, serif; font-style: italic;');
console.log('%cGems & Jewels of the World — Premium Brand Website', 'color: #8C8478; font-size: 12px;');

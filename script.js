window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }, 300);
    }
});

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'auto';
}

let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        localStorage.setItem('scrollpos', window.scrollY);
    }, 100);
}, { passive: true });

document.addEventListener("DOMContentLoaded", () => {
    let pos = localStorage.getItem('scrollpos');
    if (pos && performance.navigation.type === 1) { 
        setTimeout(() => window.scrollTo({top: parseInt(pos, 10), behavior: 'smooth'}), 50); 
    }

    /* Theme Toggle Logic */
    const themeBtn = document.getElementById('themeToggle');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    
    // Check saved theme
    const themeTxt = document.querySelector('.theme-text');
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
        if (themeTxt) themeTxt.innerText = 'Mode Gelap';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const themeTxt = document.querySelector('.theme-text');
            if (document.body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
                moonIcon.style.display = 'none';
                sunIcon.style.display = 'block';
                if (themeTxt) themeTxt.innerText = 'Mode Gelap';
            } else {
                localStorage.setItem('theme', 'dark');
                moonIcon.style.display = 'block';
                sunIcon.style.display = 'none';
                if (themeTxt) themeTxt.innerText = 'Mode Terang';
            }
        });
    }

});

/* Banner Image Carousel */
let currentSlide = 0;
const slides = document.querySelectorAll('.banner-img');

function goSlide(n) {
    slides.forEach(s => {
        s.classList.remove('active', 'prev', 'next', 'hidden');
    });
    
    currentSlide = n;
    let prevSlide = (currentSlide - 1 + slides.length) % slides.length;
    let nextSlide = (currentSlide + 1) % slides.length;
    
    slides.forEach((s, index) => {
        if (index === currentSlide) {
            s.classList.add('active');
        } else if (index === prevSlide) {
            s.classList.add('prev');
        } else if (index === nextSlide) {
            s.classList.add('next');
        } else {
            s.classList.add('hidden');
        }
    });
}

if (slides.length > 1) {
    // Initialize
    goSlide(0);
    setInterval(() => {
        goSlide((currentSlide + 1) % slides.length);
    }, 4500);
}

/* Scroll Reveal Animation */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active');
        }
    });
}, { threshold: 0, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* Mobile Hamburger Menu */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
    });
    // Mobile dropdown toggle (tap instead of hover)
    document.querySelectorAll('.dropdown > a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                link.parentElement.classList.toggle('open');
            }
        });
    });
    // Close menu when clicking a nav link
    navMenu.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 900 && !link.parentElement.classList.contains('dropdown')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('open');
            }
        });
    });
}

/* Product Detail Modal Logic */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    const closeModal = modal.querySelector('.close-modal');
    const mImg = document.getElementById('m-img');
    const mTitle = document.getElementById('m-title');
    const mPrice = document.getElementById('m-price');
    const mList = document.getElementById('m-list');
    const mWa = document.getElementById('m-wa');

    document.querySelectorAll('.p-card .btn-blue').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.p-card');
            if (!card) return;
            const img = card.querySelector('.p-img').src;
            const title = card.querySelector('.p-title').innerText;
            const price = card.querySelector('.p-price').innerText;
            const list = card.querySelector('.p-list').innerHTML;
            const waLink = card.querySelector('.btn-out').href;

            mImg.src = img;
            mTitle.innerText = title;
            mPrice.innerText = price;
            mList.innerHTML = list;
            if (mWa) {
                mWa.href = waLink;
            }

            modal.classList.add('show');
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});

/* Counter Animation Logic */
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000;
                const stepTime = Math.abs(Math.floor(duration / (target || 1)));
                let current = 0;
                
                if (target === 0) {
                    counter.innerText = '0';
                    obs.unobserve(counter);
                    return;
                }

                const timer = setInterval(() => {
                    current += Math.ceil(target / 50);
                    if (current >= target) {
                        counter.innerText = target;
                        clearInterval(timer);
                    } else {
                        counter.innerText = current;
                    }
                }, 30);
                
                obs.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
});

/* FAQ Accordion Logic */
document.addEventListener('DOMContentLoaded', () => {
    const faqBtns = document.querySelectorAll('.faq-btn');
    
    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('svg');
            
            // Close others (optional, if you want only one open at a time)
            document.querySelectorAll('.faq-content').forEach(c => {
                if (c !== content) {
                    c.style.maxHeight = null;
                }
            });
            document.querySelectorAll('.faq-btn svg').forEach(i => {
                if (i !== icon) {
                    i.style.transform = 'rotate(0deg)';
                }
            });

            // Toggle current
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                if (icon) icon.style.transform = 'rotate(0deg)';
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });
});

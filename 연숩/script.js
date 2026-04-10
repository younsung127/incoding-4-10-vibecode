document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('scrolled'); // 항상 약간의 블러/보더 유지하거나, 스크롤시 추가
            if(window.scrollY === 0) {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // 2. Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if(menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Hamburger Animation
            const hamburger = document.querySelector('.hamburger');
            if (navLinks.classList.contains('active')) {
                hamburger.style.backgroundColor = 'transparent';
                hamburger.style.setProperty('--before-transform', 'rotate(45deg) translate(5px, 6px)');
                hamburger.style.setProperty('--after-transform', 'rotate(-45deg) translate(5px, -6px)');
            } else {
                hamburger.style.backgroundColor = 'var(--text-main)';
                hamburger.style.setProperty('--before-transform', 'none');
                hamburger.style.setProperty('--after-transform', 'none');
            }
        });
    }

    // 3. Scroll Animation (Fade-up)
    const fadeElements = document.querySelectorAll('.fade-up');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // 한번 나타나면 옵저버 해제(계속 두고 싶으면 주석 처리)
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // 4. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // 모바일 메뉴 닫기
                if(navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // 초기 로드 시 뷰포트 내 요소 체크
    setTimeout(() => {
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if(rect.top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);
});

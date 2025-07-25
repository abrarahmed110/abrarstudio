/**
 * Abrar Studio - Animation Controllers
 * ===================================
 * 
 * This module handles various animations throughout the website,
 * including counter animations, scroll effects, and interactive elements.
 */

class AnimationManager {
    constructor() {
        this.init();
    }

    /**
     * Initialize all animations
     */
    init() {
        this.setupScrollProgress();
        this.setupCounterAnimations();
        this.setupScrollToTop();
        this.setupFadeInAnimations();
    }

    /**
     * Setup scroll progress indicator
     */
    setupScrollProgress() {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollProgress = (scrollTop / scrollHeight) * 100;
            
            const progressBar = document.getElementById('scroll-progress');
            if (progressBar) {
                progressBar.style.width = scrollProgress + '%';
            }
        });
    }

    /**
     * Setup counter animations for statistics
     */
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.counter');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    
                    if (target) {
                        counter.classList.add('counting');
                        this.animateCounter(counter, target);
                    }
                    
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    /**
     * Animate a counter element
     * @param {HTMLElement} element - Counter element
     * @param {number} target - Target number
     */
    animateCounter(element, target) {
        let current = 0;
        const increment = target / 50; // Adjust speed by changing divisor
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                element.classList.remove('counting');
            }
            element.textContent = Math.floor(current);
        }, 30);
    }

    /**
     * Setup scroll to top button
     */
    setupScrollToTop() {
        const scrollToTopBtn = document.querySelector('.scroll-to-top');
        
        if (scrollToTopBtn) {
            // Show/hide button based on scroll position
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    scrollToTopBtn.classList.add('show');
                } else {
                    scrollToTopBtn.classList.remove('show');
                }
            });

            // Scroll to top when clicked
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    /**
     * Setup fade-in animations for elements
     */
    setupFadeInAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in-up');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add stagger delay
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }

    /**
     * Setup typewriter effect for text elements
     * @param {string} selector - CSS selector for elements
     * @param {number} speed - Typing speed in milliseconds
     */
    setupTypewriter(selector, speed = 100) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid var(--primary)';
            
            let i = 0;
            const typeTimer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeTimer);
                    // Blinking cursor effect
                    setInterval(() => {
                        element.style.borderRight = element.style.borderRight === 'none' 
                            ? '2px solid var(--primary)' 
                            : 'none';
                    }, 750);
                }
            }, speed);
        });
    }

    /**
     * Setup parallax effect for elements
     * @param {string} selector - CSS selector for parallax elements
     * @param {number} speed - Parallax speed (0-1)
     */
    setupParallax(selector, speed = 0.5) {
        const elements = document.querySelectorAll(selector);
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            elements.forEach(element => {
                const rate = scrolled * -speed;
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }
}

// Initialize animation manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
});
/**
 * Abrar Studio - Main JavaScript Controller
 * =========================================
 * 
 * This is the main JavaScript file that coordinates all functionality
 * across the portfolio website. It handles navigation, smooth scrolling,
 * and other core interactions.
 * 
 * Note: Theme management is now handled by js/theme.js
 * Note: Testimonials functionality is handled by js/testimonials.js
 * Note: Animations are handled by js/animations.js
 */

class PortfolioApp {
    constructor() {
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupNavigation();
        this.setupSmoothScrolling();
        this.setupScrollProgress();
        this.setupScrollToTop();
        this.setupScrollBasedNavigation();
        this.setupSkillProgressBars();
        this.setupCursorFollower();
        this.setupTimeGreeting();
        this.setupFormValidation();
        this.setupLazyLoading();
    }

    /**
     * Setup mobile navigation menu
     */
    setupNavigation() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    /**
     * Setup smooth scrolling for anchor links
     */
    setupSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            });
        });
    }

    /**
     * Setup cursor follower effect
     */
    setupCursorFollower() {
        const cursorFollower = document.querySelector('.cursor-follower');
        
        if (cursorFollower) {
            // Follow mouse movement
            document.addEventListener('mousemove', (e) => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            });

            // Interactive elements cursor effect
            const interactiveElements = document.querySelectorAll('a, button, .project-card');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    cursorFollower.style.backgroundColor = 'rgba(59, 130, 246, 0.5)';
                });
                
                el.addEventListener('mouseleave', () => {
                    cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
                    cursorFollower.style.backgroundColor = 'rgba(59, 130, 246, 0.3)';
                });
            });
        }
    }

    /**
     * Setup scroll progress indicator
     */
    setupScrollProgress() {
        const progressBar = document.getElementById('scroll-progress');
        
        if (progressBar) {
            const updateProgress = this.throttle(() => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                
                progressBar.style.width = scrollPercent + '%';
            }, 10);
            
            window.addEventListener('scroll', updateProgress);
        }
    }

    /**
     * Setup scroll to top button
     */
    setupScrollToTop() {
        const scrollToTopBtn = document.querySelector('.scroll-to-top');
        
        if (scrollToTopBtn) {
            const toggleVisibility = this.throttle(() => {
                if (window.scrollY > 300) {
                    scrollToTopBtn.classList.add('show');
                } else {
                    scrollToTopBtn.classList.remove('show');
                }
            }, 100);
            
            window.addEventListener('scroll', toggleVisibility);
            
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    /**
     * Setup form validation
     */
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        });
    }

    /**
     * Validate individual form field
     * @param {HTMLElement} field - Form field to validate
     */
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Required field validation
        if (required && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Show success state
        field.classList.add('success');
        return true;
    }

    /**
     * Show field error
     * @param {HTMLElement} field - Form field
     * @param {string} message - Error message
     */
    showFieldError(field, message) {
        field.classList.add('error');
        field.classList.remove('success');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    /**
     * Clear field error
     * @param {HTMLElement} field - Form field
     */
    clearFieldError(field) {
        field.classList.remove('error', 'success');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    /**
     * Setup lazy loading for images
     */
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }

    /**
     * Setup scroll-based navigation highlighting
     */
    setupScrollBasedNavigation() {
        const sections = ['about', 'skills', 'work', 'testimonials', 'contact'];
        const navLinks = {
            about: document.querySelector('nav a[href="#about"]'),
            skills: document.querySelector('nav a[href="#skills"]'),
            work: document.querySelector('nav a[href="#work"]'),
            testimonials: document.querySelector('nav a[href="#testimonials"]'),
            contact: document.querySelector('nav a[href="#contact"]'),
            pricing: document.querySelector('nav a[href="pricing.html"]')
        };
        
        // Mobile nav links
        const mobileNavLinks = {
            about: document.querySelector('#mobile-menu a[href="#about"]'),
            skills: document.querySelector('#mobile-menu a[href="#skills"]'),
            work: document.querySelector('#mobile-menu a[href="#work"]'),
            testimonials: document.querySelector('#mobile-menu a[href="#testimonials"]'),
            contact: document.querySelector('#mobile-menu a[href="#contact"]'),
            pricing: document.querySelector('#mobile-menu a[href="pricing.html"]')
        };

        const updateActiveNavigation = this.throttle(() => {
            const scrollPosition = window.scrollY + 100; // Offset for navbar height
            let activeSection = null;
            
            // Check if we're on the pricing page
            const isPricingPage = window.location.pathname.includes('pricing.html');

            // Only check sections if we're NOT on pricing page
            if (!isPricingPage) {
                sections.forEach(sectionId => {
                    const section = document.getElementById(sectionId);
                    if (section) {
                        const sectionTop = section.offsetTop;
                        const sectionBottom = sectionTop + section.offsetHeight;
                        
                        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                            activeSection = sectionId;
                        }
                    }
                });
            }

            // Remove active class from ALL nav links first
            Object.values(navLinks).forEach(link => {
                if (link) {
                    link.classList.remove('text-primary');
                    link.style.fontWeight = '';
                }
            });
            
            Object.values(mobileNavLinks).forEach(link => {
                if (link) {
                    link.classList.remove('text-primary');
                    link.style.fontWeight = '';
                }
            });

            // Handle pricing page active state
            if (isPricingPage) {
                if (navLinks.pricing) {
                    navLinks.pricing.classList.add('text-primary');
                    navLinks.pricing.style.fontWeight = '600';
                }
                if (mobileNavLinks.pricing) {
                    mobileNavLinks.pricing.classList.add('text-primary');
                    mobileNavLinks.pricing.style.fontWeight = '600';
                }
            } else {
                // Add active class to current section's nav link (only on homepage)
                // Pricing should NEVER be active on homepage
                if (activeSection && navLinks[activeSection]) {
                    navLinks[activeSection].classList.add('text-primary');
                    navLinks[activeSection].style.fontWeight = '600';
                    
                    if (mobileNavLinks[activeSection]) {
                        mobileNavLinks[activeSection].classList.add('text-primary');
                        mobileNavLinks[activeSection].style.fontWeight = '600';
                    }
                }
            }
        }, 50);

        window.addEventListener('scroll', updateActiveNavigation);
        
        // Initial call to set correct active state on page load
        updateActiveNavigation();
    }

    /**
     * Setup skill progress bars animation
     */
    setupSkillProgressBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        if (skillBars.length === 0) return;
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const targetWidth = progressBar.getAttribute('data-width');
                    
                    if (targetWidth) {
                        // Animate the progress bar
                        setTimeout(() => {
                            progressBar.style.width = targetWidth;
                        }, 200);
                        
                        // Unobserve after animation
                        skillObserver.unobserve(progressBar);
                    }
                }
            });
        }, observerOptions);
        
        skillBars.forEach(bar => {
            skillObserver.observe(bar);
        });
    }

    /**
     * Setup time-based greeting
     */
    setupTimeGreeting() {
        const greetingElement = document.getElementById('greeting');
        
        if (greetingElement) {
            const hour = new Date().getHours();
            let greeting;
            
            if (hour < 12) {
                greeting = "Good morning";
            } else if (hour < 18) {
                greeting = "Good afternoon";
            } else {
                greeting = "Good evening";
            }
            
            greetingElement.textContent = greeting;
        }
    }

    /**
     * Utility method to debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Utility method to throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// Legacy code moved to modular files - keeping for backward compatibility
// This will be removed in future versions 
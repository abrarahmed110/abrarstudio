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
        this.setupCursorFollower();
        this.setupTimeGreeting();
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
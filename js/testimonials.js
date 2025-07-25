/**
 * Abrar Studio - Testimonials Component
 * ====================================
 * 
 * This module handles the testimonials horizontal scrolling functionality,
 * including manual navigation, touch gestures, and animation controls.
 */

class TestimonialsManager {
    constructor() {
        this.testimonialsTrack = document.querySelector('.testimonials-track');
        this.testimonialsContainer = document.querySelector('.testimonials-container');
        this.prevButton = document.getElementById('testimonial-prev');
        this.nextButton = document.getElementById('testimonial-next');
        
        this.currentTranslate = 0;
        this.isManualScrolling = false;
        this.autoScrollTimeout = null;
        this.cardWidth = 400; // Approximate card width including gap
        this.totalCards = 0;
        this.maxTranslate = 0;
        
        this.init();
    }

    /**
     * Initialize testimonials functionality
     */
    init() {
        if (!this.testimonialsTrack || !this.testimonialsContainer) return;
        
        this.calculateDimensions();
        this.setupEventListeners();
        this.setupTouchGestures();
    }

    /**
     * Calculate card dimensions and scroll limits
     */
    calculateDimensions() {
        this.totalCards = document.querySelectorAll('.testimonials-track .testimonial-card').length;
        this.maxTranslate = -(this.cardWidth * (this.totalCards / 2)); // Half because we have duplicates
    }

    /**
     * Scroll to a specific position
     * @param {number} translate - Translation value in pixels
     */
    scrollToPosition(translate) {
        this.testimonialsTrack.style.transform = `translateX(${translate}px)`;
        this.currentTranslate = translate;
    }

    /**
     * Start manual scrolling mode
     */
    startManualMode() {
        this.isManualScrolling = true;
        this.testimonialsTrack.classList.add('manual-scroll');
        this.testimonialsTrack.style.animationPlayState = 'paused';
        
        // Clear any existing timeout
        if (this.autoScrollTimeout) {
            clearTimeout(this.autoScrollTimeout);
        }
    }

    /**
     * Resume automatic scrolling after inactivity
     */
    resumeAutoScroll() {
        this.autoScrollTimeout = setTimeout(() => {
            this.isManualScrolling = false;
            this.testimonialsTrack.classList.remove('manual-scroll');
            this.testimonialsTrack.style.animationPlayState = 'running';
            this.testimonialsTrack.style.transform = ''; // Reset transform to let CSS animation take over
            this.currentTranslate = 0;
        }, 5000); // Resume auto-scroll after 5 seconds of inactivity
    }

    /**
     * Navigate to next testimonial
     */
    navigateNext() {
        this.startManualMode();
        this.currentTranslate -= this.cardWidth;
        
        // Reset to beginning if we've gone too far
        if (this.currentTranslate <= this.maxTranslate) {
            this.currentTranslate = 0;
        }
        
        this.scrollToPosition(this.currentTranslate);
        this.resumeAutoScroll();
    }

    /**
     * Navigate to previous testimonial
     */
    navigatePrevious() {
        this.startManualMode();
        this.currentTranslate += this.cardWidth;
        
        // Reset to end if we've gone too far back
        if (this.currentTranslate > 0) {
            this.currentTranslate = this.maxTranslate + this.cardWidth;
        }
        
        this.scrollToPosition(this.currentTranslate);
        this.resumeAutoScroll();
    }

    /**
     * Setup event listeners for navigation and hover effects
     */
    setupEventListeners() {
        // Navigation button handlers
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.navigateNext());
        }

        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.navigatePrevious());
        }

        // Pause animation on hover
        this.testimonialsContainer.addEventListener('mouseenter', () => {
            if (!this.isManualScrolling) {
                this.testimonialsTrack.style.animationPlayState = 'paused';
            }
        });

        this.testimonialsContainer.addEventListener('mouseleave', () => {
            if (!this.isManualScrolling) {
                this.testimonialsTrack.style.animationPlayState = 'running';
            }
        });

        // Pause animation when any testimonial card is hovered
        const testimonialCards = document.querySelectorAll('.testimonials-track .testimonial-card');
        testimonialCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!this.isManualScrolling) {
                    this.testimonialsTrack.style.animationPlayState = 'paused';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (!this.isManualScrolling) {
                    this.testimonialsTrack.style.animationPlayState = 'running';
                }
            });
        });

        // Pause animation when page is not visible (performance optimization)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.testimonialsTrack.style.animationPlayState = 'paused';
            } else if (!this.isManualScrolling) {
                this.testimonialsTrack.style.animationPlayState = 'running';
            }
        });
    }

    /**
     * Setup touch/swipe gestures for mobile devices
     */
    setupTouchGestures() {
        let startX = 0;
        let isDragging = false;

        this.testimonialsContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.startManualMode();
        });

        this.testimonialsContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const currentX = e.touches[0].clientX;
            const diffX = startX - currentX;
            
            if (Math.abs(diffX) > 50) { // Minimum swipe distance
                if (diffX > 0) {
                    // Swipe left - next
                    this.navigateNext();
                } else {
                    // Swipe right - previous
                    this.navigatePrevious();
                }
                isDragging = false;
            }
        });

        this.testimonialsContainer.addEventListener('touchend', () => {
            isDragging = false;
        });
    }
}

// Initialize testimonials manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to ensure all elements are rendered
    setTimeout(() => {
        window.testimonialsManager = new TestimonialsManager();
    }, 500);
});
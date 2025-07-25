/**
 * Abrar Studio - Theme Management
 * ===============================
 * 
 * This module handles light/dark theme switching functionality.
 * It manages theme persistence, system theme detection, and UI updates.
 */

class ThemeManager {
    constructor() {
        this.init();
    }

    /**
     * Initialize theme system
     */
    init() {
        this.applyTheme(this.getStoredTheme() || this.detectSystemTheme());
        this.setupEventListeners();
        this.updateProjectOverlays(this.isLightTheme());
    }

    /**
     * Apply theme to the document
     * @param {string} theme - 'light' or 'dark'
     */
    applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        }
    }

    /**
     * Detect system theme preference
     * @returns {string} 'light' or 'dark'
     */
    detectSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    /**
     * Get stored theme from localStorage
     * @returns {string|null} Stored theme or null
     */
    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    /**
     * Check if current theme is light
     * @returns {boolean} True if light theme is active
     */
    isLightTheme() {
        return document.documentElement.classList.contains('light-theme');
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const isLight = this.isLightTheme();
        this.applyTheme(isLight ? 'dark' : 'light');
        this.updateProjectOverlays(!isLight);
        
        // Add animation effect to the theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.classList.add('animate-pulse');
            setTimeout(() => {
                themeToggle.classList.remove('animate-pulse');
            }, 500);
        }
    }

    /**
     * Update project overlay colors based on theme
     * @param {boolean} isLight - Whether light theme is active
     */
    updateProjectOverlays(isLight) {
        document.querySelectorAll('.project-overlay').forEach(overlay => {
            if (isLight) {
                overlay.classList.remove('bg-gradient-to-t', 'from-black');
                overlay.classList.add('bg-gradient-to-t', 'from-gray-900');
            } else {
                overlay.classList.remove('bg-gradient-to-t', 'from-gray-900');
                overlay.classList.add('bg-gradient-to-t', 'from-black');
            }
        });
    }

    /**
     * Setup event listeners for theme functionality
     */
    setupEventListeners() {
        // Theme toggle button - with retry mechanism
        const setupThemeToggle = () => {
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    this.toggleTheme();
                });
                console.log('Theme toggle button initialized successfully');
            } else {
                console.warn('Theme toggle button not found, retrying...');
                // Retry after a short delay
                setTimeout(setupThemeToggle, 100);
            }
        };

        setupThemeToggle();

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'light' : 'dark');
                this.updateProjectOverlays(e.matches);
            }
        });
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});
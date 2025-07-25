/**
 * Abrar Studio - DARK THEME ONLY
 * ===============================
 * 
 * This module FORCES dark theme only - NO light theme support.
 */

class ThemeManager {
    constructor() {
        this.init();
    }

    /**
     * Initialize DARK THEME ONLY
     */
    init() {
        // FORCE DARK THEME ONLY
        this.forceDarkTheme();
    }

    /**
     * Force dark theme and remove any light theme classes
     */
    forceDarkTheme() {
        // Remove light theme class if it exists
        document.documentElement.classList.remove('light-theme');
        
        // Clear any stored theme preference
        localStorage.removeItem('theme');
        localStorage.setItem('theme', 'dark');
        
        // Ensure dark theme is applied
        document.documentElement.classList.remove('light-theme');
        document.body.classList.remove('light-theme');
        
        // Force dark theme styles
        document.documentElement.style.setProperty('--md-background', '#121212');
        document.documentElement.style.setProperty('--md-surface', '#1E1E1E');
        document.documentElement.style.setProperty('--md-text-primary', 'rgba(255, 255, 255, 0.87)');
    }

    /**
     * DISABLED - No theme detection
     */
    detectSystemTheme() {
        return 'dark'; // ALWAYS RETURN DARK
    }

    /**
     * DISABLED - Always return dark
     */
    getStoredTheme() {
        return 'dark'; // ALWAYS RETURN DARK
    }

    /**
     * DISABLED - Always return false (never light theme)
     */
    isLightTheme() {
        return false; // NEVER LIGHT THEME
    }

    /**
     * DISABLED - No theme toggling
     */
    toggleTheme() {
        // DO NOTHING - DARK THEME ONLY
        this.forceDarkTheme();
    }

    /**
     * DISABLED - No theme switching
     */
    updateProjectOverlays() {
        // Force dark theme overlays
        document.querySelectorAll('.project-overlay').forEach(overlay => {
            overlay.classList.remove('bg-gradient-to-t', 'from-gray-900');
            overlay.classList.add('bg-gradient-to-t', 'from-black');
        });
    }

    /**
     * DISABLED - No event listeners needed
     */
    setupEventListeners() {
        // DO NOTHING - NO THEME SWITCHING ALLOWED
        console.log('Dark theme only - no event listeners needed');
    }
}

// Initialize theme manager when DOM is loaded or immediately if already loaded
function initializeThemeManager() {
    if (!window.themeManager) {
        window.themeManager = new ThemeManager();
        console.log('ThemeManager initialized');
    }
}

// Manual initialization function that can be called from anywhere
window.initTheme = initializeThemeManager;

// Try multiple initialization methods to ensure it works
if (document.readyState === 'loading') {
    // DOM is still loading
    document.addEventListener('DOMContentLoaded', initializeThemeManager);
} else {
    // DOM is already loaded
    initializeThemeManager();
}

// Additional event listeners for different loading states
window.addEventListener('load', () => {
    if (!window.themeManager) {
        console.log('Window loaded, initializing theme manager...');
        initializeThemeManager();
    }
});

// Fallback initialization after a short delay
setTimeout(() => {
    if (!window.themeManager) {
        console.warn('ThemeManager not initialized, trying fallback...');
        initializeThemeManager();
    }
}, 500);

// Final fallback after a longer delay
setTimeout(() => {
    if (!window.themeManager) {
        console.error('ThemeManager still not initialized, forcing initialization...');
        initializeThemeManager();
    }
}, 2000);
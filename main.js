/*
  main.js - Main JavaScript for Abrar Ahmed Portfolio
  -----------------------------------------------
  - Navigation (mobile menu)
  - Cursor follower
  - Scroll progress bar
  - Smooth scrolling
  - Time-based greeting
  - Theme switcher (light/dark)
*/

// Theme Switcher
function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark');
  }
}

function detectSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const theme = savedTheme || detectSystemTheme();
  applyTheme(theme);
  
  // Update project overlays based on theme
  updateProjectOverlays(theme === 'light');
}

function updateProjectOverlays(isLight) {
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

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initTheme();
  
  // Theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.contains('light-theme');
      applyTheme(isLight ? 'dark' : 'light');
      updateProjectOverlays(!isLight);
      
      // Add animation effect to the theme toggle button
      themeToggle.classList.add('animate-pulse');
      setTimeout(() => {
        themeToggle.classList.remove('animate-pulse');
      }, 500);
    });
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'light' : 'dark');
      updateProjectOverlays(e.matches);
    }
  });
});

// Navigation: Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
if (menuToggle) {
  menuToggle.addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
  });
}

// Cursor follower
const cursorFollower = document.querySelector('.cursor-follower');
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

// Scroll progress bar
window.addEventListener('scroll', function() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollProgress = (scrollTop / scrollHeight) * 100;
  document.getElementById('scroll-progress').style.width = scrollProgress + '%';
});

// Smooth scrolling for anchor links
const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
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

// Time-based greeting (for future use)
function timeGreeting() {
  const hour = new Date().getHours();
  let greeting;
  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }
  // Example: document.getElementById('greeting').textContent = greeting;
}
timeGreeting(); 
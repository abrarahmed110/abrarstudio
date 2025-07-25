/**
 * Pricing Currency Converter
 * =========================
 * 
 * Handles dynamic currency conversion for pricing plans
 * Supports multiple currencies with real-time price updates
 */

class PricingCurrencyConverter {
    constructor() {
        this.currentCurrency = 'PKR';
        this.currentRate = 1;
        this.currentSymbol = 'PKR';
        this.init();
    }

    /**
     * Initialize the currency converter
     */
    init() {
        this.setupCurrencySelector();
        this.loadSavedCurrency();
        this.addCurrencyTooltips();
    }

    /**
     * Setup currency selector event listener
     */
    setupCurrencySelector() {
        const currencySelector = document.getElementById('currency-selector');
        
        if (currencySelector) {
            currencySelector.addEventListener('change', (e) => {
                const selectedOption = e.target.selectedOptions[0];
                const currency = selectedOption.value;
                const rate = parseFloat(selectedOption.dataset.rate);
                const symbol = selectedOption.dataset.symbol;
                
                this.updateCurrency(currency, rate, symbol);
                this.saveCurrencyPreference(currency);
            });
        }
    }

    /**
     * Update all prices with new currency
     * @param {string} currency - Currency code
     * @param {number} rate - Conversion rate from PKR
     * @param {string} symbol - Currency symbol
     */
    updateCurrency(currency, rate, symbol) {
        this.currentCurrency = currency;
        this.currentRate = rate;
        this.currentSymbol = symbol;

        // Find all price elements
        const priceElements = document.querySelectorAll('[data-price]');
        
        priceElements.forEach(element => {
            const basePricePKR = parseInt(element.dataset.price);
            const convertedPrice = this.convertPrice(basePricePKR, rate);
            const formattedPrice = this.formatPrice(convertedPrice, currency);
            
            // Update price amount
            const priceAmountElement = element.querySelector('.price-amount');
            if (priceAmountElement) {
                priceAmountElement.textContent = formattedPrice;
            }
            
            // Update currency symbol
            const currencySymbolElement = element.querySelector('.currency-symbol');
            if (currencySymbolElement) {
                currencySymbolElement.textContent = symbol;
            }
        });

        // Add smooth transition effect
        this.addUpdateAnimation();
    }

    /**
     * Convert price from PKR to target currency
     * @param {number} pricePKR - Price in PKR
     * @param {number} rate - Conversion rate
     * @returns {number} Converted price
     */
    convertPrice(pricePKR, rate) {
        return Math.round(pricePKR * rate);
    }

    /**
     * Format price according to currency
     * @param {number} price - Price to format
     * @param {string} currency - Currency code
     * @returns {string} Formatted price
     */
    formatPrice(price, currency) {
        // Special formatting for different currencies
        switch (currency) {
            case 'JPY':
                // Japanese Yen doesn't use decimals
                return price.toLocaleString('ja-JP');
            case 'INR':
                // Indian numbering system
                return price.toLocaleString('en-IN');
            case 'PKR':
                return price.toLocaleString('en-PK');
            case 'USD':
            case 'EUR':
            case 'GBP':
            case 'CAD':
            case 'AUD':
                // Western currencies with comma separators
                return price.toLocaleString('en-US');
            default:
                return price.toLocaleString();
        }
    }

    /**
     * Add animation effect when prices update
     */
    addUpdateAnimation() {
        const priceElements = document.querySelectorAll('[data-price]');
        
        priceElements.forEach((element, index) => {
            // Add staggered animation delay
            setTimeout(() => {
                element.classList.add('price-updating');
                element.style.transform = 'scale(1.05)';
                element.style.transition = 'transform 0.3s ease';
                
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                    element.classList.remove('price-updating');
                }, 300);
            }, index * 50); // Stagger by 50ms
        });
    }

    /**
     * Save currency preference to localStorage
     * @param {string} currency - Currency to save
     */
    saveCurrencyPreference(currency) {
        try {
            localStorage.setItem('preferred-currency', currency);
        } catch (error) {
            console.warn('Could not save currency preference:', error);
        }
    }

    /**
     * Load saved currency preference
     */
    loadSavedCurrency() {
        try {
            const savedCurrency = localStorage.getItem('preferred-currency');
            if (savedCurrency) {
                const currencySelector = document.getElementById('currency-selector');
                if (currencySelector) {
                    currencySelector.value = savedCurrency;
                    
                    // Trigger change event to update prices
                    const selectedOption = currencySelector.selectedOptions[0];
                    if (selectedOption) {
                        const rate = parseFloat(selectedOption.dataset.rate);
                        const symbol = selectedOption.dataset.symbol;
                        this.updateCurrency(savedCurrency, rate, symbol);
                    }
                }
            }
        } catch (error) {
            console.warn('Could not load currency preference:', error);
        }
    }

    /**
     * Get current currency info
     * @returns {Object} Current currency information
     */
    getCurrentCurrency() {
        return {
            currency: this.currentCurrency,
            rate: this.currentRate,
            symbol: this.currentSymbol
        };
    }

    /**
     * Manually set currency (for external use)
     * @param {string} currency - Currency code
     */
    setCurrency(currency) {
        const currencySelector = document.getElementById('currency-selector');
        if (currencySelector) {
            currencySelector.value = currency;
            currencySelector.dispatchEvent(new Event('change'));
        }
    }

    /**
     * Add tooltips to show currency information
     */
    addCurrencyTooltips() {
        const currencySelector = document.getElementById('currency-selector');
        if (currencySelector) {
            currencySelector.title = 'Select your preferred currency to see prices in your local currency';
        }
    }

    /**
     * Get exchange rate information for display
     * @param {string} currency - Currency code
     * @returns {string} Exchange rate info
     */
    getExchangeRateInfo(currency) {
        const rates = {
            'USD': '1 USD ≈ 278 PKR',
            'EUR': '1 EUR ≈ 303 PKR',
            'GBP': '1 GBP ≈ 357 PKR',
            'INR': '1 INR ≈ 3.33 PKR',
            'AED': '1 AED ≈ 76 PKR',
            'SAR': '1 SAR ≈ 74 PKR',
            'CAD': '1 CAD ≈ 204 PKR',
            'AUD': '1 AUD ≈ 182 PKR',
            'JPY': '1 JPY ≈ 1.89 PKR'
        };
        
        return rates[currency] || 'Exchange rate information not available';
    }
}

/**
 * Pricing Plan Selection Handler
 * ==============================
 * 
 * Handles plan selection, dropdown locking, and navigation to contact form
 */

class PricingPlanHandler {
    constructor() {
        this.selectedPlan = null;
        this.planDropdown = null;
        this.cancelButton = null;
        this.init();
    }

    /**
     * Initialize the plan handler
     */
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupPlanButtons();
                this.setupDropdownElements();
            });
        } else {
            this.setupPlanButtons();
            this.setupDropdownElements();
        }
    }

    /**
     * Setup event listeners for all pricing plan buttons
     */
    setupPlanButtons() {
        // Get all pricing plan buttons
        const planButtons = document.querySelectorAll('a[href="#contact"]');
        
        console.log(`Found ${planButtons.length} pricing plan buttons`);
        
        planButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get plan information from the button's parent card
                const planCard = button.closest('.pricing-card');
                const planInfo = this.extractPlanInfo(planCard);
                
                console.log(`Plan ${index + 1} clicked:`, planInfo);
                
                if (planInfo) {
                    this.selectPlan(planInfo);
                    this.navigateToContact();
                } else {
                    console.warn('Could not extract plan information from card');
                }
            });
        });
    }

    /**
     * Setup dropdown elements and cancel button
     */
    setupDropdownElements() {
        this.planDropdown = document.getElementById('plan');
        
        if (this.planDropdown) {
            // Create cancel button if it doesn't exist
            this.createCancelButton();
            
            // Add change listener to detect manual changes
            this.planDropdown.addEventListener('change', (e) => {
                // If user manually changes dropdown while locked, unlock it
                if (this.selectedPlan && !this.planDropdown.disabled) {
                    this.unlockDropdown();
                }
            });
        } else {
            console.warn('Plan dropdown not found. Make sure the contact form is loaded.');
        }
    }

    /**
     * Extract plan information from the pricing card
     * @param {Element} planCard - The pricing card element
     * @returns {Object} Plan information
     */
    extractPlanInfo(planCard) {
        if (!planCard) return null;

        const titleElement = planCard.querySelector('h3');
        const priceElement = planCard.querySelector('[data-price]');
        
        if (!titleElement || !priceElement) return null;

        const title = titleElement.textContent.trim();
        const basePrice = priceElement.dataset.price;
        
        // Map plan titles to dropdown values
        const planMapping = {
            'Starter Build': 'starter-build',
            'Professional Build': 'professional-build',
            'Premium Build': 'premium-build',
            'iOS App Design': 'ios-app-design',
            'Android App Design': 'android-app-design',
            'Cross-Platform Design': 'cross-platform-design'
        };

        return {
            title: title,
            value: planMapping[title] || 'custom',
            price: basePrice
        };
    }

    /**
     * Select a plan and lock the dropdown
     * @param {Object} planInfo - Plan information
     */
    selectPlan(planInfo) {
        this.selectedPlan = planInfo;
        
        if (this.planDropdown) {
            // Set the dropdown value
            this.planDropdown.value = planInfo.value;
            
            // Lock the dropdown
            this.lockDropdown();
        }
    }

    /**
     * Lock the dropdown with selected plan and show cancel button
     */
    lockDropdown() {
        if (!this.planDropdown || !this.selectedPlan) return;

        // Disable the dropdown
        this.planDropdown.disabled = true;
        
        // Add locked styling
        this.planDropdown.classList.add('dropdown-locked');
        
        // Show cancel button
        if (this.cancelButton) {
            this.cancelButton.style.display = 'inline-flex';
        }

        // Update dropdown appearance
        this.updateDropdownAppearance(true);
    }

    /**
     * Unlock the dropdown and hide cancel button
     */
    unlockDropdown() {
        if (!this.planDropdown) return;

        // Enable the dropdown
        this.planDropdown.disabled = false;
        
        // Remove locked styling
        this.planDropdown.classList.remove('dropdown-locked');
        
        // Hide cancel button
        if (this.cancelButton) {
            this.cancelButton.style.display = 'none';
        }

        // Reset dropdown to default value
        this.planDropdown.value = '';

        // Reset selected plan
        this.selectedPlan = null;
        
        // Update dropdown appearance
        this.updateDropdownAppearance(false);
    }

    /**
     * Create cancel button next to the dropdown
     */
    createCancelButton() {
        if (!this.planDropdown) return;

        // Check if cancel button already exists
        this.cancelButton = document.getElementById('plan-cancel-btn');
        
        if (!this.cancelButton) {
            // Create cancel button
            this.cancelButton = document.createElement('button');
            this.cancelButton.id = 'plan-cancel-btn';
            this.cancelButton.type = 'button';
            this.cancelButton.className = 'plan-cancel-btn';
            this.cancelButton.innerHTML = '<i class="fas fa-times"></i>';
            this.cancelButton.title = 'Clear selected plan';
            this.cancelButton.style.display = 'none';
            
            // Add event listener
            this.cancelButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.unlockDropdown();
            });
            
            // Find the dropdown container and append the button
            const dropdownContainer = this.planDropdown.closest('.plan-dropdown-container');
            if (dropdownContainer) {
                dropdownContainer.style.position = 'relative';
                dropdownContainer.appendChild(this.cancelButton);
            } else {
                // Fallback: create a wrapper
                const wrapper = document.createElement('div');
                wrapper.className = 'plan-dropdown-container';
                wrapper.style.position = 'relative';
                
                this.planDropdown.parentNode.insertBefore(wrapper, this.planDropdown);
                wrapper.appendChild(this.planDropdown);
                wrapper.appendChild(this.cancelButton);
            }
        }
    }

    /**
     * Update dropdown visual appearance
     * @param {boolean} isLocked - Whether dropdown is locked
     */
    updateDropdownAppearance(isLocked) {
        if (!this.planDropdown) return;

        if (isLocked) {
            this.planDropdown.style.backgroundColor = 'var(--md-surface-2)';
            this.planDropdown.style.borderColor = 'var(--primary)';
            this.planDropdown.style.cursor = 'not-allowed';
            this.planDropdown.style.opacity = '0.8';
        } else {
            this.planDropdown.style.backgroundColor = '';
            this.planDropdown.style.borderColor = '';
            this.planDropdown.style.cursor = '';
            this.planDropdown.style.opacity = '';
        }
    }

    /**
     * Navigate to contact form section
     */
    navigateToContact() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            // Show brief notification
            this.showPlanSelectedNotification();
            
            // Smooth scroll to contact section
            contactSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Focus on the first form field after a short delay
            setTimeout(() => {
                const nameField = document.getElementById('name');
                if (nameField) {
                    nameField.focus();
                }
            }, 800);
        }
    }

    /**
     * Show a brief notification that plan was selected
     */
    showPlanSelectedNotification() {
        if (!this.selectedPlan) return;

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'plan-selected-notification';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-check-circle text-green-400"></i>
                <span>Plan "${this.selectedPlan.title}" selected!</span>
            </div>
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'var(--md-surface-1)',
            color: 'var(--md-text-primary)',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid var(--primary)',
            boxShadow: '0 4px 12px rgba(0, 102, 255, 0.2)',
            zIndex: '9999',
            fontSize: '14px',
            fontWeight: '500',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Get currently selected plan
     * @returns {Object|null} Selected plan information
     */
    getSelectedPlan() {
        return this.selectedPlan;
    }
}

// Initialize currency converter and plan handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pricingConverter = new PricingCurrencyConverter();
    window.pricingPlanHandler = new PricingPlanHandler();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PricingCurrencyConverter, PricingPlanHandler };
}
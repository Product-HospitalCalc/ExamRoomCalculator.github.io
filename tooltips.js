/**
 * Tooltip functionality for parameter information buttons
 */

class TooltipManager {
    constructor() {
        this.tooltip = null;
        this.currentTooltipButton = null;
        this.hideTimeout = null;
        this.init();
    }

    init() {
        // Get or create tooltip element
        this.tooltip = document.getElementById('tooltip');
        if (!this.tooltip) {
            this.tooltip = document.createElement('div');
            this.tooltip.id = 'tooltip';
            this.tooltip.className = 'tooltip';
            document.body.appendChild(this.tooltip);
        }

        // Add event listeners to all info buttons
        this.attachEventListeners();
    }

    attachEventListeners() {
        const infoButtons = document.querySelectorAll('.info-btn');
        
        infoButtons.forEach(button => {
            button.addEventListener('mouseenter', (e) => this.showTooltip(e));
            button.addEventListener('mouseleave', (e) => this.hideTooltip(e));
            button.addEventListener('click', (e) => this.toggleTooltip(e));
        });

        // Hide tooltip when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.info-btn') && !e.target.closest('.tooltip')) {
                this.hideTooltip();
            }
        });

        // Hide tooltip on scroll
        window.addEventListener('scroll', () => this.hideTooltip());
        
        // Hide tooltip on resize
        window.addEventListener('resize', () => this.hideTooltip());
    }

    showTooltip(event) {
        const button = event.currentTarget;
        const tooltipText = button.getAttribute('data-tooltip');
        
        if (!tooltipText) return;

        // Clear any existing timeout
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }

        // Set tooltip content
        this.tooltip.textContent = tooltipText;
        this.currentTooltipButton = button;

        // Position tooltip
        this.positionTooltip(button);

        // Show tooltip
        this.tooltip.classList.add('show');
    }

    hideTooltip(event) {
        // Add delay to prevent flickering when moving between button and tooltip
        this.hideTimeout = setTimeout(() => {
            this.tooltip.classList.remove('show');
            this.currentTooltipButton = null;
        }, 100);
    }

    toggleTooltip(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const button = event.currentTarget;
        
        if (this.currentTooltipButton === button && this.tooltip.classList.contains('show')) {
            this.hideTooltip();
        } else {
            this.showTooltip(event);
        }
    }

    positionTooltip(button) {
        const buttonRect = button.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate initial position (centered above button)
        let left = buttonRect.left + (buttonRect.width / 2) - (tooltipRect.width / 2);
        let top = buttonRect.top - tooltipRect.height - 12; // 12px gap

        // Adjust horizontal position if tooltip goes off-screen
        if (left < 10) {
            left = 10;
        } else if (left + tooltipRect.width > viewportWidth - 10) {
            left = viewportWidth - tooltipRect.width - 10;
        }

        // Adjust vertical position if tooltip goes off-screen
        let tooltipClass = 'top';
        if (top < 10) {
            // Show below button instead
            top = buttonRect.bottom + 12;
            tooltipClass = 'bottom';
            
            // Double-check if it still fits
            if (top + tooltipRect.height > viewportHeight - 10) {
                // Center vertically if it doesn't fit above or below
                top = buttonRect.top + (buttonRect.height / 2) - (tooltipRect.height / 2);
                tooltipClass = 'center';
            }
        }

        // Apply position
        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.top = `${top}px`;
        
        // Apply positioning class for arrow direction
        this.tooltip.className = `tooltip ${tooltipClass}`;
    }

    // Method to update tooltip content dynamically
    updateTooltipContent(buttonSelector, newContent) {
        const button = document.querySelector(buttonSelector);
        if (button) {
            button.setAttribute('data-tooltip', newContent);
        }
    }

    // Method to add tooltip to new buttons dynamically
    addTooltipToButton(button, tooltipText) {
        if (button && tooltipText) {
            button.setAttribute('data-tooltip', tooltipText);
            button.addEventListener('mouseenter', (e) => this.showTooltip(e));
            button.addEventListener('mouseleave', (e) => this.hideTooltip(e));
            button.addEventListener('click', (e) => this.toggleTooltip(e));
        }
    }

    // Method to remove all tooltips
    destroy() {
        const infoButtons = document.querySelectorAll('.info-btn');
        infoButtons.forEach(button => {
            button.removeEventListener('mouseenter', this.showTooltip);
            button.removeEventListener('mouseleave', this.hideTooltip);
            button.removeEventListener('click', this.toggleTooltip);
        });
        
        if (this.tooltip && this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
        }
    }
}

// Initialize tooltip manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global tooltip manager instance
    window.tooltipManager = new TooltipManager();
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TooltipManager;
}
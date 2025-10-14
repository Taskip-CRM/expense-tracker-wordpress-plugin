/**
 * Enhanced Store for Expense Report Customization
 * Handles all user customizations with localStorage persistence
 * Uses a Zustand-inspired pattern for state management
 */

class ExpenseReportStore {
    constructor() {
        this.storageKey = 'erg-expense-report-customization';
        this.defaultState = {
            // Table headers - user can edit these
            tableHeaders: {
                date: 'Date',
                description: 'Expense Description',
                merchant: 'Merchant',
                amount: 'Amount'
            },

            // All labels throughout the interface
            labels: {
                // Header section
                reportTitle: 'Expense Report',
                companyName: 'Your Company Name',
                companyAddress: 'Company\'s Address',
                companyCity: 'City, State Zip',
                companyCountry: 'Country',

                // Report details section
                reportTitleLabel: 'Report Title',
                submittedBy: 'Submitted By',
                submittedOn: 'Submitted On',
                reportTo: 'Report To',
                reportingPeriod: 'Reporting Period',
                businessPurpose: 'Business Purpose',

                // Bottom section
                addNewExpense: 'Add New Expense',
                total: 'TOTAL',

                // Placeholders
                expenseDescPlaceholder: 'Expense Description',
                merchantPlaceholder: 'Merchant Name'
            },

            // Visual styling options
            styling: {
                colors: {
                    headerBackground: '#6c757d',
                    headerText: '#ffffff',
                    modernHeaderBackground: '#667eea',
                    tableRowOdd: '#ffffff',
                    tableRowEven: '#f8f9fa',
                    tableBorder: '#e9ecef',
                    primaryText: '#333333',
                    secondaryText: '#666666',
                    totalBackground: '#f8f9fa',
                    totalBorder: '#dddddd'
                },
                fonts: {
                    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
                    baseSize: '14px',
                    headerSize: '36px',
                    titleSize: '16px'
                },
                layout: {
                    containerMaxWidth: '900px',
                    borderRadius: '8px',
                    padding: '40px',
                    tablePadding: '16px 20px'
                }
            },

            // Currency and formatting
            currency: {
                code: 'USD',
                symbol: '$',
                position: 'before', // 'before' or 'after'
                decimals: 2,
                thousandSeparator: ',',
                decimalSeparator: '.'
            },

            // Date formatting
            dateFormat: {
                format: 'YYYY-MM-DD', // ISO format by default
                display: 'MM/DD/YYYY' // How it displays to user
            },

            // Report settings
            reportSettings: {
                numberFormat: 'ER-{number}',
                numberStart: 10001,
                autoIncrement: true,
                showReportNumber: true
            },

            // Column visibility and order
            columns: {
                date: { visible: true, order: 0, width: '140px' },
                description: { visible: true, order: 1, width: '1fr' },
                merchant: { visible: true, order: 2, width: '180px' },
                amount: { visible: true, order: 3, width: '120px' }
            },

            // Header style
            headerStyle: 'standard'
        };

        this.state = this.loadState();
        this.listeners = new Set();

        // Auto-save on changes
        this.debouncedSave = this.debounce(this.saveState.bind(this), 300);
    }

    // Load state from localStorage
    loadState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsedState = JSON.parse(saved);
                return this.mergeWithDefaults(parsedState);
            }
        } catch (error) {
            console.warn('Failed to load expense report customization:', error);
        }
        return { ...this.defaultState };
    }

    // Save state to localStorage
    saveState() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
            this.notifyListeners();
        } catch (error) {
            console.error('Failed to save expense report customization:', error);
        }
    }

    // Merge saved state with defaults (in case new properties were added)
    mergeWithDefaults(savedState) {
        return {
            tableHeaders: { ...this.defaultState.tableHeaders, ...(savedState.tableHeaders || {}) },
            labels: { ...this.defaultState.labels, ...(savedState.labels || {}) },
            styling: {
                colors: { ...this.defaultState.styling.colors, ...(savedState.styling?.colors || {}) },
                fonts: { ...this.defaultState.styling.fonts, ...(savedState.styling?.fonts || {}) },
                layout: { ...this.defaultState.styling.layout, ...(savedState.styling?.layout || {}) }
            },
            currency: { ...this.defaultState.currency, ...(savedState.currency || {}) },
            dateFormat: { ...this.defaultState.dateFormat, ...(savedState.dateFormat || {}) },
            reportSettings: { ...this.defaultState.reportSettings, ...(savedState.reportSettings || {}) },
            columns: { ...this.defaultState.columns, ...(savedState.columns || {}) },
            headerStyle: savedState.headerStyle || this.defaultState.headerStyle
        };
    }

    // Get current state
    getState() {
        return this.state;
    }

    // Update table header
    updateTableHeader(key, value) {
        this.state.tableHeaders[key] = value;
        this.debouncedSave();
    }

    // Update any label
    updateLabel(key, value) {
        this.state.labels[key] = value;
        this.debouncedSave();
    }

    // Update styling
    updateColor(key, value) {
        this.state.styling.colors[key] = value;
        this.debouncedSave();
    }

    updateFont(key, value) {
        this.state.styling.fonts[key] = value;
        this.debouncedSave();
    }

    updateLayout(key, value) {
        this.state.styling.layout[key] = value;
        this.debouncedSave();
    }

    // Update currency
    updateCurrency(updates) {
        this.state.currency = { ...this.state.currency, ...updates };
        this.debouncedSave();
    }

    // Update date format
    updateDateFormat(format) {
        this.state.dateFormat.format = format;
        // Update display format based on format
        const displayFormats = {
            'YYYY-MM-DD': 'YYYY-MM-DD',
            'MM/DD/YYYY': 'MM/DD/YYYY',
            'DD/MM/YYYY': 'DD/MM/YYYY',
            'DD.MM.YYYY': 'DD.MM.YYYY'
        };
        this.state.dateFormat.display = displayFormats[format] || format;
        this.debouncedSave();
    }

    // Update report settings
    updateReportSettings(key, value) {
        this.state.reportSettings[key] = value;
        this.debouncedSave();
    }

    // Update column settings
    updateColumn(columnKey, updates) {
        this.state.columns[columnKey] = { ...this.state.columns[columnKey], ...updates };
        this.debouncedSave();
    }

    // Update header style
    updateHeaderStyle(style) {
        this.state.headerStyle = style;
        this.debouncedSave();
    }

    // Reset to defaults
    resetToDefaults() {
        this.state = { ...this.defaultState };
        this.saveState();
    }

    // Export settings
    exportSettings() {
        return JSON.stringify(this.state, null, 2);
    }

    // Import settings
    importSettings(settingsJson) {
        try {
            const imported = JSON.parse(settingsJson);
            this.state = this.mergeWithDefaults(imported);
            this.saveState();
            return true;
        } catch (error) {
            console.error('Failed to import settings:', error);
            return false;
        }
    }

    // Subscribe to changes
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    // Notify all listeners
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }

    // Utility: Debounce function
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

    // Utility: Format currency
    formatCurrency(amount) {
        const { symbol, position, decimals, thousandSeparator, decimalSeparator } = this.state.currency;

        let formattedAmount = parseFloat(amount || 0).toFixed(decimals);

        // Add thousand separators
        if (thousandSeparator) {
            const parts = formattedAmount.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
            formattedAmount = parts.join(decimalSeparator);
        }

        return position === 'before' ? `${symbol}${formattedAmount}` : `${formattedAmount}${symbol}`;
    }

    // Utility: Format date
    formatDate(date) {
        if (!date) return '';

        const d = new Date(date);
        const format = this.state.dateFormat.display;

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    }

    // Utility: Generate next report number
    getNextReportNumber() {
        const { numberFormat, numberStart, autoIncrement } = this.state.reportSettings;

        if (autoIncrement) {
            // Get stored counter or start from numberStart
            const counter = parseInt(localStorage.getItem('erg-report-counter')) || numberStart;
            localStorage.setItem('erg-report-counter', String(counter + 1));

            return numberFormat.replace('{number}', String(counter));
        }

        return numberFormat.replace('{number}', String(numberStart));
    }
}

// Create global instance
window.ERGExpenseStore = new ExpenseReportStore();

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExpenseReportStore;
}
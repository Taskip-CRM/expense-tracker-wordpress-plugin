/**
 * Simple Expense Report Generator JavaScript
 */

(function($) {
    'use strict';

    let rowCounter = 3; // Starting from 4th row since we have 3 default rows

    // Initialize when document is ready
    $(document).ready(function() {
        initializeExpenseReport();
    });

    function initializeExpenseReport() {
        // Wait for store to be available
        if (typeof window.ERGExpenseStore === 'undefined') {
            setTimeout(initializeExpenseReport, 100);
            return;
        }

        // Initialize from store
        loadFromStore();

        // Bind events
        bindEvents();

        // Update total on page load
        updateTotal();

        // Set current date in report header
        updateCurrentDate();

        // Subscribe to store changes
        window.ERGExpenseStore.subscribe(function(state) {
            updateUIFromState(state);
        });

        // Load and apply saved customizations with a small delay to ensure DOM is ready
        setTimeout(loadSavedCustomizations, 50);

        // Initialize sorting functionality
        initializeSorting();

        // Initialize drag and drop functionality
        initializeDragAndDrop();

        // Initialize customization panel
        initializeCustomizationPanel();

        // Initialize logo upload functionality
        initializeLogoUpload();
    }

    function bindEvents() {
        // Editable table headers - only start editing when clicking on text or edit icon, not sort icon
        $(document).on('click', '.erg-editable-header', function(e) {
            // Don't start editing if clicking on sort icon
            if ($(e.target).hasClass('erg-sort-icon')) {
                return;
            }
            // Don't start editing if this header is sortable and we clicked outside the edit icon
            if ($(this).hasClass('sortable') && !$(e.target).hasClass('erg-edit-icon') && !$(e.target).closest('.erg-edit-icon').length && !$(e.target).hasClass('erg-header-text')) {
                return;
            }
            startInlineEdit(this, 'header');
        });

        // Editable labels
        $(document).on('click', '.erg-editable-label', function(e) {
            // Don't interfere with button functionality
            if ($(this).is('button') && !$(this).hasClass('editing')) {
                e.preventDefault();
                startInlineEdit(this, 'label');
                return false;
            } else if (!$(this).is('button')) {
                startInlineEdit(this, 'label');
            }
        });

        // Handle inline edit completion
        $(document).on('blur keydown', '.erg-inline-edit, .erg-label-inline-edit', function(e) {
            if (e.type === 'blur') {
                // On blur (clicking outside), save changes if any, otherwise cancel
                const newText = $(this).val().trim();
                const originalText = $(this).data('original-text');

                if (newText && newText !== originalText) {
                    finishInlineEdit(this);
                } else {
                    cancelInlineEdit(this);
                }
            } else if (e.type === 'keydown' && e.which === 13) {
                // Enter key - save changes
                finishInlineEdit(this);
            } else if (e.type === 'keydown' && e.which === 27) {
                // Escape key - cancel without saving
                cancelInlineEdit(this);
            }
        });

        // Add new expense row
        $(document).on('click', '#add-new-expense', function() {
            addNewExpenseRow();
        });

        // Calculate total when amount changes
        $(document).on('input', '.col-amount input', function() {
            updateTotal();
        });

        // Export to PDF
        $(document).on('click', '#export-pdf-btn', function() {
            exportToPDF();
        });

        // Auto-save functionality
        $(document).on('input', '.erg-expense-report-container input, .erg-expense-report-container textarea', function() {
            saveToLocalStorage();
        });

        // Load saved data on page load
        loadFromLocalStorage();

        // Format amount inputs
        $(document).on('blur', '.col-amount input', function() {
            formatAmount(this);
        });
    }

    // Sorting functionality
    function initializeSorting() {
        let currentSort = { column: null, direction: 'asc' };

        // Bind click events to sortable headers
        $(document).on('click', '.erg-editable-header.sortable', function(e) {
            // Don't sort when editing
            if ($(this).hasClass('editing')) {
                return;
            }

            // Don't sort when dragging
            if ($(this).hasClass('erg-dragging')) {
                return;
            }

            const sortColumn = $(this).data('sort');

            // Determine sort direction
            if (currentSort.column === sortColumn) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.column = sortColumn;
                currentSort.direction = 'asc';
            }

            // Update UI
            updateSortUI(sortColumn, currentSort.direction);

            // Sort the expense rows
            sortExpenseRows(sortColumn, currentSort.direction);
        });
    }

    function updateSortUI(column, direction) {
        // Clear all sort indicators and reset icons
        $('.erg-editable-header').removeClass('sorted-asc sorted-desc');
        $('.erg-sort-icon').text('↕');

        // Update the sort icon for the current column
        const $header = $(`.erg-editable-header[data-sort="${column}"]`);
        $header.addClass(`sorted-${direction}`);

        const $sortIcon = $header.find('.erg-sort-icon');
        if (direction === 'asc') {
            $sortIcon.text('↑');
        } else {
            $sortIcon.text('↓');
        }
    }

    function sortExpenseRows(column, direction) {
        const $rows = $('.erg-expense-row');
        const sortedRows = Array.from($rows).sort(function(a, b) {
            let valueA = getRowValue($(a), column);
            let valueB = getRowValue($(b), column);

            // Handle different data types
            if (column === 'amount') {
                valueA = parseFloat(valueA) || 0;
                valueB = parseFloat(valueB) || 0;
            } else if (column === 'date') {
                valueA = new Date(valueA || '1900-01-01');
                valueB = new Date(valueB || '1900-01-01');
            } else {
                // Text comparison
                valueA = String(valueA || '').toLowerCase();
                valueB = String(valueB || '').toLowerCase();
            }

            let result = 0;
            if (valueA < valueB) {
                result = -1;
            } else if (valueA > valueB) {
                result = 1;
            }

            return direction === 'desc' ? -result : result;
        });

        // Reorder the DOM elements
        const $container = $('#expense-rows');
        sortedRows.forEach(row => {
            $container.append(row);
        });
    }

    function getRowValue($row, column) {
        switch (column) {
            case 'date':
                return $row.find('.col-date input').val();
            case 'description':
                return $row.find('.col-description input').val();
            case 'merchant':
                return $row.find('.col-merchant input').val();
            case 'amount':
                return $row.find('.col-amount input').val();
            default:
                return '';
        }
    }

    // Inline editing functions
    function startInlineEdit(element, type) {
        const $element = $(element);
        const $textSpan = type === 'header' ? $element.find('.erg-header-text') : $element.find('.erg-label-text');
        const currentText = $textSpan.text();
        const key = $element.data('key');

        // Don't start editing if already editing
        if ($element.hasClass('editing')) {
            return;
        }

        // Create input field with appropriate class
        const inputClass = type === 'header' ? 'erg-inline-edit' : 'erg-label-inline-edit';
        const $input = $('<input>')
            .addClass(inputClass)
            .val(currentText)
            .data('original-text', currentText)
            .data('key', key)
            .data('type', type);

        // Replace text with input
        $textSpan.hide();
        $element.addClass('editing').append($input);

        // Focus and select text
        $input.focus().select();
    }

    function finishInlineEdit(input) {
        const $input = $(input);
        const isHeader = $input.hasClass('erg-inline-edit');
        const $element = $input.closest(isHeader ? '.erg-editable-header' : '.erg-editable-label');
        const $textSpan = isHeader ? $element.find('.erg-header-text') : $element.find('.erg-label-text');
        const newText = $input.val().trim();
        const key = $input.data('key');

        if (newText && newText !== $input.data('original-text')) {
            // Update the store based on type
            if (isHeader) {
                window.ERGExpenseStore.updateTableHeader(key, newText);
            } else {
                // Handle special cases for currency symbol
                if (key === 'currencySymbol') {
                    window.ERGExpenseStore.updateCurrency({ symbol: newText });
                } else {
                    window.ERGExpenseStore.updateLabel(key, newText);
                }
            }

            // Update the UI
            $textSpan.text(newText);

            // Show success feedback
            showInlineEditFeedback($element, 'success');
        }

        // Clean up
        $input.remove();
        $textSpan.show();
        $element.removeClass('editing');
    }

    function cancelInlineEdit(input) {
        const $input = $(input);
        const isHeader = $input.hasClass('erg-inline-edit');
        const $element = $input.closest(isHeader ? '.erg-editable-header' : '.erg-editable-label');
        const $textSpan = isHeader ? $element.find('.erg-header-text') : $element.find('.erg-label-text');

        // Clean up
        $input.remove();
        $textSpan.show();
        $element.removeClass('editing');
    }

    function showInlineEditFeedback($element, type) {
        // Visual feedback for successful edit
        $element.addClass(type === 'success' ? 'edit-success' : 'edit-error');
        setTimeout(() => {
            $element.removeClass('edit-success edit-error');
        }, 1000);
    }

    // Add new expense row
    function addNewExpenseRow() {
        rowCounter++;
        const newRowHtml = `
            <div class="erg-expense-row" data-row="${rowCounter}" draggable="true">
                <div class="erg-drag-handle">
                    <span class="erg-drag-icon">⋮⋮</span>
                </div>
                <div class="col-date">
                    <input type="date" value="" placeholder="mm/dd/yyyy">
                </div>
                <div class="col-description">
                    <input type="text" value="" placeholder="Expense Description">
                </div>
                <div class="col-merchant">
                    <input type="text" value="" placeholder="Merchant Name">
                </div>
                <div class="col-amount">
                    <input type="number" step="0.01" min="0" value="0.00">
                </div>
            </div>
        `;
        $('#expense-rows').append(newRowHtml);
        updateTotal();
    }

    // Calculate and update total
    function updateTotal() {
        let total = 0;
        $('.col-amount input').each(function() {
            const value = parseFloat($(this).val()) || 0;
            total += value;
        });
        $('#total-amount').text(total.toFixed(2));
    }

    // Format amount input
    function formatAmount(input) {
        let value = parseFloat($(input).val()) || 0;
        $(input).val(value.toFixed(2));
    }

    // Load from store
    function loadFromStore() {
        if (!window.ERGExpenseStore) return;

        const state = window.ERGExpenseStore.getState();
        updateUIFromState(state);
    }

    // Update UI from state
    function updateUIFromState(state) {
        // Update table headers
        Object.keys(state.tableHeaders).forEach(key => {
            $(`.erg-editable-header[data-key="${key}"] .erg-header-text`).text(state.tableHeaders[key]);
        });

        // Update labels
        Object.keys(state.labels).forEach(key => {
            $(`.erg-editable-label[data-key="${key}"] .erg-label-text`).text(state.labels[key]);
        });

        // Update currency symbol
        $('.currency-symbol').text(state.currency.symbol);
    }

    // Update current date
    function updateCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        $('.erg-report-date').text(today);
    }

    // Local storage functions
    function saveToLocalStorage() {
        const data = {
            rows: []
        };

        $('.erg-expense-row').each(function() {
            const row = {
                date: $(this).find('.col-date input').val(),
                description: $(this).find('.col-description input').val(),
                merchant: $(this).find('.col-merchant input').val(),
                amount: $(this).find('.col-amount input').val()
            };
            data.rows.push(row);
        });

        localStorage.setItem('erg-expense-data', JSON.stringify(data));
    }

    function loadFromLocalStorage() {
        const saved = localStorage.getItem('erg-expense-data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                // Populate the rows with saved data
                data.rows.forEach((rowData, index) => {
                    const $row = $(`.erg-expense-row[data-row="${index + 1}"]`);
                    if ($row.length) {
                        $row.find('.col-date input').val(rowData.date || '');
                        $row.find('.col-description input').val(rowData.description || '');
                        $row.find('.col-merchant input').val(rowData.merchant || '');
                        $row.find('.col-amount input').val(rowData.amount || '0.00');
                    }
                });
                updateTotal();
            } catch (error) {
                console.warn('Failed to load saved expense data:', error);
            }
        }
    }

    // Export to PDF with exact screen layout
    function exportToPDF() {
        console.log('exportToPDF called, checking jsPDF availability...');

        // Check for jsPDF in multiple possible locations
        let jsPDFConstructor = null;

        if (typeof window.jsPDF !== 'undefined') {
            console.log('Found window.jsPDF');
            jsPDFConstructor = window.jsPDF;
        } else if (typeof window.jspdf !== 'undefined') {
            console.log('Found window.jspdf');
            jsPDFConstructor = window.jspdf;
        } else if (typeof window.JSPDF !== 'undefined') {
            console.log('Found window.JSPDF');
            jsPDFConstructor = window.JSPDF;
        } else if (typeof jsPDF !== 'undefined') {
            console.log('Found global jsPDF');
            jsPDFConstructor = jsPDF;
        }

        if (!jsPDFConstructor) {
            console.log('jsPDF not found, attempting dynamic load...');
            loadJsPDFDynamically().then(() => {
                console.log('Dynamic load successful, retrying...');
                exportToPDF(); // Retry after loading
            }).catch((error) => {
                console.error('Dynamic load failed:', error);
                alert('Failed to load PDF library. Please refresh the page and try again.');
            });
            return;
        }

        console.log('jsPDF found, generating PDF...');
        generatePDF(jsPDFConstructor);
    }

    // Dynamic loader for jsPDF
    function loadJsPDFDynamically() {
        return new Promise((resolve, reject) => {
            console.log('loadJsPDFDynamically called');

            // Check if jsPDF is available in any form
            const jsPDFAvailable =
                (typeof window.jsPDF !== 'undefined') ||
                (typeof window.jspdf !== 'undefined') ||
                (typeof window.JSPDF !== 'undefined');

            if (jsPDFAvailable) {
                console.log('jsPDF already available');
                // Normalize the reference
                if (typeof window.jsPDF === 'undefined' && typeof window.jspdf !== 'undefined') {
                    window.jsPDF = window.jspdf;
                }
                if (typeof window.jsPDF === 'undefined' && typeof window.JSPDF !== 'undefined') {
                    window.jsPDF = window.JSPDF;
                }
                resolve();
                return;
            }

            // Try local file first, then CDN sources as fallback
            const cdnSources = [
                './assets/js/jspdf.min.js', // Local file first
                'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
                'https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js',
                'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js'
            ];

            let currentSource = 0;

            function tryLoadScript() {
                if (currentSource >= cdnSources.length) {
                    reject(new Error('All CDN sources failed to load jsPDF'));
                    return;
                }

                console.log(`Trying CDN source ${currentSource + 1}/${cdnSources.length}: ${cdnSources[currentSource]}`);
                const script = document.createElement('script');
                script.src = cdnSources[currentSource];

                script.onload = () => {
                    console.log('jsPDF script loaded, checking availability...');
                    console.log('window.jsPDF after load:', typeof window.jsPDF);

                    // Give it a moment for the library to initialize
                    setTimeout(() => {
                        // Check multiple possible ways jsPDF might be exposed
                        const jsPDFAvailable =
                            (typeof window.jsPDF !== 'undefined') ||
                            (typeof window.jspdf !== 'undefined') ||
                            (typeof window.JSPDF !== 'undefined');

                        console.log('Checking jsPDF availability:', {
                            'window.jsPDF': typeof window.jsPDF,
                            'window.jspdf': typeof window.jspdf,
                            'window.JSPDF': typeof window.JSPDF
                        });

                        if (jsPDFAvailable) {
                            console.log('jsPDF successfully loaded and available');
                            // Normalize the reference
                            if (typeof window.jsPDF === 'undefined' && typeof window.jspdf !== 'undefined') {
                                window.jsPDF = window.jspdf;
                            }
                            if (typeof window.jsPDF === 'undefined' && typeof window.JSPDF !== 'undefined') {
                                window.jsPDF = window.JSPDF;
                            }
                            resolve();
                        } else {
                            console.error('jsPDF script loaded but not available on window');
                            currentSource++;
                            tryLoadScript();
                        }
                    }, 300);
                };

                script.onerror = (error) => {
                    console.error(`Failed to load jsPDF from source ${currentSource + 1}:`, error);
                    currentSource++;
                    tryLoadScript();
                };

                document.head.appendChild(script);
            }

            tryLoadScript();
        });
    }

    // Generate header layout based on selected style
    function generateHeaderLayout(doc, style, data) {
        const { companyName, companyAddress, companyCity, companyCountry, reportTitle, reportNumber, margin, y, colors, computedStyles, pdfFont, baseFontSize, logoData } = data;
        let currentY = y;

        // Helper function to add logo if available
        function addLogo(x, y, maxWidth = 30, maxHeight = 15) {
            if (logoData && logoData.startsWith('data:image/')) {
                try {
                    // Determine image format
                    let format = 'JPEG';
                    if (logoData.includes('data:image/png')) {
                        format = 'PNG';
                    } else if (logoData.includes('data:image/jpeg') || logoData.includes('data:image/jpg')) {
                        format = 'JPEG';
                    }

                    // Add image to PDF (jsPDF will auto-scale to fit within maxWidth/maxHeight)
                    doc.addImage(logoData, format, x, y - maxHeight, maxWidth, maxHeight);
                    return maxHeight + 3; // Return height used plus small margin
                } catch (error) {
                    console.warn('Could not add logo to PDF:', error);
                    return 0;
                }
            }
            return 0;
        }

        switch (style) {
            case 'compact':
                // Compact layout - smaller spacing, smaller fonts
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                doc.text(companyName, margin, currentY);
                currentY += 4;
                doc.text(companyAddress, margin, currentY);
                currentY += 4;
                doc.text(`${companyCity}, ${companyCountry}`, margin, currentY);
                currentY += 8;

                // Report title (smaller, right aligned)
                doc.setFontSize(16);
                doc.setFont(undefined, 'bold');
                const compactTitleWidth = doc.getTextWidth(reportTitle);
                doc.text(reportTitle, 210 - margin - compactTitleWidth, currentY - 12);

                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                const compactNumberWidth = doc.getTextWidth(reportNumber);
                doc.text(reportNumber, 210 - margin - compactNumberWidth, currentY - 8);
                currentY += 5;
                break;

            case 'detailed':
                // Detailed layout - more spacing, larger fonts
                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.text(companyName, margin, currentY);
                currentY += 6;

                doc.setFontSize(12);
                doc.setFont(undefined, 'normal');
                doc.text(companyAddress, margin, currentY);
                currentY += 5;
                doc.text(companyCity, margin, currentY);
                currentY += 5;
                doc.text(companyCountry, margin, currentY);
                currentY += 12;

                // Report title (larger, right aligned)
                doc.setFontSize(24);
                doc.setFont(undefined, 'bold');
                const detailedTitleWidth = doc.getTextWidth(reportTitle);
                doc.text(reportTitle, 210 - margin - detailedTitleWidth, currentY - 12);

                doc.setFontSize(14);
                doc.setFont(undefined, 'normal');
                const detailedNumberWidth = doc.getTextWidth(reportNumber);
                doc.text(reportNumber, 210 - margin - detailedNumberWidth, currentY - 6);
                currentY += 8;
                break;

            case 'modern':
                // Modern layout - with background color block and logo above company info
                const modernBgColor = colors.modernHeaderBackground ?
                    hexToRgb(colors.modernHeaderBackground) :
                    hexToRgb('#667eea');

                // Calculate total height needed (logo + text)
                let totalModernHeight = 25;
                if (logoData && logoData.startsWith('data:image/')) {
                    totalModernHeight += 18; // Add space for logo
                }

                // Draw modern header background
                doc.setFillColor(modernBgColor.r, modernBgColor.g, modernBgColor.b);
                doc.rect(margin - 5, currentY - 5, 180, totalModernHeight, 'F');

                // Add logo at top of colored background (left-aligned with company name)
                if (logoData && logoData.startsWith('data:image/')) {
                    const modernLogoHeight = addLogo(margin, currentY + 5, 25, 12);
                    if (modernLogoHeight > 0) {
                        currentY += modernLogoHeight + 3; // Move down after logo
                    }
                }

                // White text on colored background
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(baseFontSize + 1);
                doc.setFont(pdfFont, 'bold');
                doc.text(companyName, margin, currentY);
                currentY += 6;

                doc.setFontSize(baseFontSize - 1);
                doc.setFont(pdfFont, 'normal');
                doc.text(companyAddress, margin, currentY);
                currentY += 5;
                doc.text(`${companyCity}, ${companyCountry}`, margin, currentY);

                // Report title on same background
                doc.setFontSize(18);
                doc.setFont(pdfFont, 'bold');
                const modernTitleWidth = doc.getTextWidth(reportTitle);
                doc.text(reportTitle, 210 - margin - modernTitleWidth, currentY - 8);

                doc.setFontSize(10);
                doc.setFont(pdfFont, 'normal');
                const modernNumberWidth = doc.getTextWidth(reportNumber);
                doc.text(reportNumber, 210 - margin - modernNumberWidth, currentY - 3);

                currentY += 15;
                // Reset text color
                const primaryTextColor = colors.primaryText ? hexToRgb(colors.primaryText) : {r: 51, g: 51, b: 51};
                doc.setTextColor(primaryTextColor.r, primaryTextColor.g, primaryTextColor.b);
                break;

            case 'classic':
                // Classic layout - with border and formal styling
                doc.setLineWidth(1);
                doc.rect(margin - 5, currentY - 5, 180, 25);

                doc.setFontSize(12);
                doc.setFont('times', 'bold');
                doc.text(companyName, margin, currentY + 2);
                currentY += 6;

                doc.setFont('times', 'normal');
                doc.text(companyAddress, margin, currentY);
                currentY += 5;
                doc.text(companyCity, margin, currentY);
                currentY += 5;
                doc.text(companyCountry, margin, currentY);

                // Report title (formal, right aligned, underlined)
                doc.setFontSize(20);
                doc.setFont('times', 'bold');
                const classicTitleWidth = doc.getTextWidth(reportTitle);
                const titleX = 210 - margin - classicTitleWidth;
                doc.text(reportTitle, titleX, currentY - 10);
                // Add underline
                doc.line(titleX, currentY - 8, titleX + classicTitleWidth, currentY - 8);

                doc.setFontSize(12);
                doc.setFont('times', 'normal');
                const classicNumberWidth = doc.getTextWidth(reportNumber);
                doc.text(reportNumber, 210 - margin - classicNumberWidth, currentY - 4);
                currentY += 10;
                break;

            case 'minimal':
                // Minimal layout - center aligned, no company info
                doc.setFontSize(22);
                doc.setFont(undefined, 'bold');
                const minimalTitleWidth = doc.getTextWidth(reportTitle);
                doc.text(reportTitle, (210 - minimalTitleWidth) / 2, currentY + 5);

                doc.setFontSize(12);
                doc.setFont(undefined, 'normal');
                const minimalNumberWidth = doc.getTextWidth(reportNumber);
                doc.text(reportNumber, (210 - minimalNumberWidth) / 2, currentY + 12);
                currentY += 20;
                break;

            default: // 'standard'
                // Standard layout with logo above company info
                // Add logo first (centered above company info)
                if (logoData && logoData.startsWith('data:image/')) {
                    const logoHeight = addLogo(margin, currentY + 15, 30, 15);
                    if (logoHeight > 0) {
                        currentY += logoHeight + 5; // Move down after logo
                    }
                }

                doc.setFontSize(baseFontSize + 2);
                doc.setFont(pdfFont, 'bold');
                doc.text(companyName, margin, currentY);
                currentY += 7; // Better spacing

                doc.setFontSize(baseFontSize);
                doc.setFont(pdfFont, 'normal');
                doc.text(companyAddress, margin, currentY);
                currentY += 6; // Better spacing
                doc.text(companyCity, margin, currentY);
                currentY += 6; // Better spacing
                doc.text(companyCountry, margin, currentY);
                currentY += 12; // More space before table

                // Report title (right aligned)
                doc.setFontSize(20);
                doc.setFont(pdfFont, 'bold');
                const standardTitleWidth = doc.getTextWidth(reportTitle);
                doc.text(reportTitle, 210 - margin - standardTitleWidth, currentY - 15);

                doc.setFontSize(12);
                doc.setFont(pdfFont, 'normal');
                const standardNumberWidth = doc.getTextWidth(reportNumber);
                doc.text(reportNumber, 210 - margin - standardNumberWidth, currentY - 7);
                break;
        }

        return currentY;
    }

    // Helper function to convert hex color to RGB (moved here for access)
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {r: 108, g: 117, b: 125}; // fallback to default gray
    }

    // Extract computed styles from DOM elements
    function extractComputedStyles() {
        const container = $('.erg-expense-report-container')[0];
        const header = $('.erg-report-header')[0];
        const tableHeader = $('.erg-table-header')[0];
        const expenseRow = $('.erg-expense-row').first()[0];
        const totalSection = $('.erg-total-section')[0];

        function getComputedColor(element, property) {
            if (!element) return '#000000';
            const computed = window.getComputedStyle(element);
            const color = computed.getPropertyValue(property);

            // Convert rgb() to hex
            if (color.startsWith('rgb')) {
                const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                if (match) {
                    const r = parseInt(match[1]).toString(16).padStart(2, '0');
                    const g = parseInt(match[2]).toString(16).padStart(2, '0');
                    const b = parseInt(match[3]).toString(16).padStart(2, '0');
                    return `#${r}${g}${b}`;
                }
            }
            return color.startsWith('#') ? color : '#000000';
        }

        function getComputedSize(element, property) {
            if (!element) return 12;
            const computed = window.getComputedStyle(element);
            const size = computed.getPropertyValue(property);
            return parseInt(size) || 12;
        }

        return {
            container: {
                fontFamily: container ? window.getComputedStyle(container).fontFamily : 'Arial',
                fontSize: getComputedSize(container, 'font-size'),
                color: getComputedColor(container, 'color'),
                backgroundColor: getComputedColor(container, 'background-color')
            },
            header: {
                fontSize: getComputedSize(header, 'font-size'),
                color: getComputedColor(header, 'color'),
                backgroundColor: getComputedColor(header, 'background-color'),
                padding: getComputedSize(header, 'padding-top')
            },
            tableHeader: {
                fontSize: getComputedSize(tableHeader, 'font-size'),
                color: getComputedColor(tableHeader, 'color'),
                backgroundColor: getComputedColor(tableHeader, 'background-color'),
                padding: getComputedSize(tableHeader, 'padding-top')
            },
            tableRow: {
                fontSize: getComputedSize(expenseRow, 'font-size'),
                color: getComputedColor(expenseRow, 'color'),
                oddBackgroundColor: getComputedColor($('.erg-expense-row:nth-child(odd)')[0], 'background-color'),
                evenBackgroundColor: getComputedColor($('.erg-expense-row:nth-child(even)')[0], 'background-color'),
                padding: getComputedSize(expenseRow, 'padding-top')
            },
            totalSection: {
                fontSize: getComputedSize(totalSection, 'font-size'),
                color: getComputedColor(totalSection, 'color'),
                backgroundColor: getComputedColor(totalSection, 'background-color'),
                borderColor: getComputedColor(totalSection, 'border-top-color')
            }
        };
    }

    // Generate PDF function (extracted from exportToPDF)
    function generatePDF(jsPDFConstructor) {
        try {
            // Handle different ways jsPDF might be structured
            let PDFClass = jsPDFConstructor;

            if (jsPDFConstructor && jsPDFConstructor.jsPDF) {
                PDFClass = jsPDFConstructor.jsPDF;
            } else if (jsPDFConstructor && typeof jsPDFConstructor === 'object' && jsPDFConstructor.default) {
                PDFClass = jsPDFConstructor.default;
            }

            console.log('Using PDF class:', PDFClass);
            const doc = new PDFClass('p', 'mm', 'a4'); // Portrait, millimeters, A4

            let y = 20;
            const pageHeight = doc.internal.pageSize.height;
            const margin = 20;

            // Get customization settings from store
            const state = window.ERGExpenseStore ? window.ERGExpenseStore.getState() : null;
            const colors = state ? state.styling.colors : {};
            const fonts = state ? state.styling.fonts : {};

            // Extract actual computed styles from the DOM
            const computedStyles = extractComputedStyles();

            // Apply base font family from computed styles (jsPDF has limited font support)
            // jsPDF supports: helvetica, times, courier
            let pdfFont = 'helvetica'; // default
            const fontFamily = computedStyles.container.fontFamily.toLowerCase();
            if (fontFamily.includes('times') || fontFamily.includes('serif')) {
                pdfFont = 'times';
            } else if (fontFamily.includes('courier') || fontFamily.includes('mono')) {
                pdfFont = 'courier';
            }

            // Set base font size from computed styles
            const baseFontSize = computedStyles.container.fontSize * 0.75; // Convert px to pt

            // Get current header layout style
            const headerStyle = state ? state.headerStyle || 'standard' : 'standard';

            // Company info section
            const companyName = $('.erg-company-info .erg-editable-label[data-key="companyName"] .erg-label-text').text();
            const companyAddress = $('.erg-company-info .erg-editable-label[data-key="companyAddress"] .erg-label-text').text();
            const companyCity = $('.erg-company-info .erg-editable-label[data-key="companyCity"] .erg-label-text').text();
            const companyCountry = $('.erg-company-info .erg-editable-label[data-key="companyCountry"] .erg-label-text').text();
            const reportTitle = $('.erg-report-info h1 .erg-label-text').text() || 'Expense Report';
            const reportNumber = $('.erg-report-number').text() || 'ER-12345';

            // Check for company logo
            const savedLogo = localStorage.getItem('erg-company-logo');
            const logoData = savedLogo || $('.erg-logo-image').attr('src');

            // Apply header layout based on selected style
            y = generateHeaderLayout(doc, headerStyle, {
                companyName, companyAddress, companyCity, companyCountry,
                reportTitle, reportNumber, margin, y, colors, computedStyles, pdfFont, baseFontSize, logoData
            });

            // Report details section
            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');

            // Get form values
            const submittedBy = $('#submitted-by').val() || '';
            const submittedOn = $('#submitted-on').val() || '';
            const reportTo = $('#report-to').val() || '';
            const periodFrom = $('#period-from').val() || '';
            const periodTo = $('#period-to').val() || '';
            const reportTitleField = $('#report-title').val() || '';
            const businessPurpose = $('#business-purpose').val() || '';

            // Left column
            doc.text('Submitted By:', margin, y);
            doc.setFont(undefined, 'normal');
            doc.text(submittedBy, margin + 30, y);
            y += 7;

            doc.setFont(undefined, 'bold');
            doc.text('Report To:', margin, y);
            doc.setFont(undefined, 'normal');
            doc.text(reportTo, margin + 30, y);
            y += 7;

            doc.setFont(undefined, 'bold');
            doc.text('Report Title:', margin, y);
            doc.setFont(undefined, 'normal');
            doc.text(reportTitleField, margin + 30, y);
            y += 10;

            // Right column (reset y for right side)
            let rightY = y - 21;
            doc.setFont(undefined, 'bold');
            doc.text('Submitted On:', 110, rightY);
            doc.setFont(undefined, 'normal');
            doc.text(submittedOn, 140, rightY);
            rightY += 7;

            doc.setFont(undefined, 'bold');
            doc.text('Reporting Period:', 110, rightY);
            doc.setFont(undefined, 'normal');
            const periodText = periodFrom && periodTo ? `${periodFrom} to ${periodTo}` : '';
            doc.text(periodText, 140, rightY);

            // Business purpose (full width)
            if (businessPurpose) {
                y += 5;
                doc.setFont(undefined, 'bold');
                doc.text('Business Purpose:', margin, y);
                doc.setFont(undefined, 'normal');
                y += 5;

                // Word wrap for business purpose
                const splitText = doc.splitTextToSize(businessPurpose, 170);
                doc.text(splitText, margin, y);
                y += splitText.length * 4;
            }

            y += 10;

            // Expense table header with exact computed styles
            const headerBgColor = hexToRgb(computedStyles.tableHeader.backgroundColor);
            doc.setFillColor(headerBgColor.r, headerBgColor.g, headerBgColor.b);

            // Calculate height based on computed padding and font size
            const headerHeight = (computedStyles.tableHeader.fontSize * 0.35) + (computedStyles.tableHeader.padding * 0.35);
            doc.rect(margin, y - 3, 170, headerHeight, 'F');

            // Header text with exact computed color and font size
            const headerTextColor = hexToRgb(computedStyles.tableHeader.color);
            doc.setTextColor(headerTextColor.r, headerTextColor.g, headerTextColor.b);
            doc.setFontSize(computedStyles.tableHeader.fontSize * 0.75); // Convert px to pt
            doc.setFont(pdfFont, 'bold');

            // Use custom header texts from the page
            const dateHeader = $('.erg-editable-header[data-key="date"] .erg-header-text').text() || 'Date';
            const descHeader = $('.erg-editable-header[data-key="description"] .erg-header-text').text() || 'Expense Description';
            const merchantHeader = $('.erg-editable-header[data-key="merchant"] .erg-header-text').text() || 'Merchant';
            const amountHeader = $('.erg-editable-header[data-key="amount"] .erg-header-text').text() || 'Amount';

            doc.text(dateHeader, margin + 2, y + 2);
            doc.text(descHeader, margin + 32, y + 2);
            doc.text(merchantHeader, margin + 92, y + 2);
            doc.text(amountHeader, margin + 142, y + 2);

            // Set text color to exact computed table row color
            const tableTextColor = hexToRgb(computedStyles.tableRow.color);
            doc.setTextColor(tableTextColor.r, tableTextColor.g, tableTextColor.b);
            y += 10;

            // Expense rows with exact computed alternating background colors
            let rowIndex = 0;
            $('.erg-expense-row').each(function() {
                const date = $(this).find('.col-date input').val() || '';
                const description = $(this).find('.col-description input').val() || '';
                const merchant = $(this).find('.col-merchant input').val() || '';
                const amount = $(this).find('.col-amount input').val() || '0.00';

                // Only include rows with data
                if (date || description || merchant || (amount !== '0.00')) {
                    // Calculate row height based on computed padding and font size
                    const rowHeight = (computedStyles.tableRow.fontSize * 0.35) + (computedStyles.tableRow.padding * 0.35);

                    // Alternating row background with exact computed colors
                    if (rowIndex % 2 === 0) {
                        // Even rows (0, 2, 4...)
                        const evenRowColor = hexToRgb(computedStyles.tableRow.evenBackgroundColor);
                        doc.setFillColor(evenRowColor.r, evenRowColor.g, evenRowColor.b);
                        doc.rect(margin, y - 3, 170, rowHeight, 'F');
                    } else {
                        // Odd rows (1, 3, 5...)
                        const oddRowColor = hexToRgb(computedStyles.tableRow.oddBackgroundColor);
                        doc.setFillColor(oddRowColor.r, oddRowColor.g, oddRowColor.b);
                        doc.rect(margin, y - 3, 170, rowHeight, 'F');
                    }

                    doc.setFont(pdfFont, 'normal');
                    doc.setFontSize(computedStyles.tableRow.fontSize * 0.75); // Convert px to pt

                    // Format date if present
                    let formattedDate = date;
                    if (date) {
                        const dateObj = new Date(date);
                        if (!isNaN(dateObj.getTime())) {
                            formattedDate = dateObj.toLocaleDateString();
                        }
                    }

                    doc.text(formattedDate, margin + 2, y);
                    doc.text(description, margin + 32, y);
                    doc.text(merchant, margin + 92, y);

                    // Use custom currency symbol
                    const currencySymbol = $('.currency-symbol .erg-label-text').text() || '$';
                    doc.text(`${currencySymbol}${parseFloat(amount).toFixed(2)}`, margin + 142, y);

                    y += 6;
                    rowIndex++;

                    // Check if we need a new page
                    if (y > pageHeight - 30) {
                        doc.addPage();
                        y = 20;
                    }
                }
            });

            // Total section with exact computed styles
            y += 5;
            const totalBgColor = hexToRgb(computedStyles.totalSection.backgroundColor);
            doc.setFillColor(totalBgColor.r, totalBgColor.g, totalBgColor.b);

            // Calculate total section height based on computed font size
            const totalHeight = computedStyles.totalSection.fontSize * 0.5;
            doc.rect(margin + 120, y - 3, 50, totalHeight, 'F');

            // Use exact computed font size and color for total
            doc.setFontSize(computedStyles.totalSection.fontSize * 0.75); // Convert px to pt
            doc.setFont(pdfFont, 'bold');

            // Use exact computed text color for total section
            const totalTextColor = hexToRgb(computedStyles.totalSection.color);
            doc.setTextColor(totalTextColor.r, totalTextColor.g, totalTextColor.b);

            // Use custom total label
            const totalLabel = $('.erg-editable-label[data-key="total"] .erg-label-text').text() || 'TOTAL';
            doc.text(totalLabel, margin + 125, y + 3);

            const totalAmount = $('#total-amount').text() || '0.00';
            const currencySymbol = $('.currency-symbol .erg-label-text').text() || '$';

            // Keep the same color for total amount to maintain consistency
            doc.text(`${currencySymbol}${totalAmount}`, margin + 145, y + 3);

            // Footer with generation date and optional branding
            doc.setTextColor(128, 128, 128); // Gray
            doc.setFontSize(8);
            doc.setFont(undefined, 'normal');

            let footerY = pageHeight - 10;

            // Check if footer branding is enabled
            if ($('.erg-footer-branding').length > 0) {
                // Add Taskip branding
                doc.setTextColor(0, 178, 137); // Taskip green
                doc.setFontSize(9);
                doc.setFont(undefined, 'bold');
                const brandingText = 'Powered by Taskip';
                const brandingWidth = doc.getTextWidth(brandingText);
                doc.text(brandingText, (210 - brandingWidth) / 2, footerY - 10);

                // Add generation date above branding
                doc.setTextColor(128, 128, 128); // Gray
                doc.setFontSize(8);
                doc.setFont(undefined, 'normal');
                doc.text(`Generated on ${new Date().toLocaleString()}`, margin, footerY - 20);
            } else {
                // Just generation date
                doc.text(`Generated on ${new Date().toLocaleString()}`, margin, footerY);
            }

            // Save the PDF with dynamic filename
            const filename = `expense-report-${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(filename);

        } catch (error) {
            console.error('PDF export failed:', error);
            alert('Failed to export PDF. Please try again.');
        }
    }

    // Drag and Drop functionality
    function initializeDragAndDrop() {
        let draggedElement = null;
        let dropZone = null;

        // Handle drag start
        $(document).on('dragstart', '.erg-expense-row', function(e) {
            draggedElement = this;
            $(this).addClass('erg-dragging');

            // Show drop zones
            $('.erg-expense-row').not(this).addClass('erg-drop-zone');

            // Set drag data
            e.originalEvent.dataTransfer.effectAllowed = 'move';
            e.originalEvent.dataTransfer.setData('text/html', this.outerHTML);
        });

        // Handle drag over
        $(document).on('dragover', '.erg-expense-row', function(e) {
            e.preventDefault();
            e.originalEvent.dataTransfer.dropEffect = 'move';

            if (this !== draggedElement) {
                $(this).addClass('erg-drag-over');
            }
        });

        // Handle drag leave
        $(document).on('dragleave', '.erg-expense-row', function(e) {
            $(this).removeClass('erg-drag-over');
        });

        // Handle drop
        $(document).on('drop', '.erg-expense-row', function(e) {
            e.preventDefault();

            if (this !== draggedElement) {
                const $draggedRow = $(draggedElement);
                const $targetRow = $(this);

                // Get the positions
                const draggedIndex = $draggedRow.index();
                const targetIndex = $targetRow.index();

                // Move the element
                if (draggedIndex < targetIndex) {
                    $targetRow.after($draggedRow);
                } else {
                    $targetRow.before($draggedRow);
                }

                // Show visual feedback
                $draggedRow.addClass('erg-drop-success');
                setTimeout(() => {
                    $draggedRow.removeClass('erg-drop-success');
                }, 1000);
            }

            // Clean up
            cleanupDragState();
        });

        // Handle drag end
        $(document).on('dragend', '.erg-expense-row', function(e) {
            cleanupDragState();
        });

        function cleanupDragState() {
            $('.erg-expense-row').removeClass('erg-dragging erg-drop-zone erg-drag-over');
            draggedElement = null;
        }
    }

    // Customization Panel functionality
    function initializeCustomizationPanel() {
        // Open customization panel
        $(document).on('click', '.erg-customize-btn', function() {
            $('.erg-customization-overlay').addClass('active');
            $('.erg-customization-panel').addClass('active');
        });

        // Close customization panel
        $(document).on('click', '.erg-panel-close, .erg-customization-overlay', function() {
            $('.erg-customization-overlay').removeClass('active');
            $('.erg-customization-panel').removeClass('active');
        });

        // Prevent panel close when clicking inside panel
        $(document).on('click', '.erg-customization-panel', function(e) {
            e.stopPropagation();
        });

        // Color picker functionality
        $(document).on('change', '.erg-color-input', function() {
            const colorKey = $(this).data('color');
            const colorValue = $(this).val();

            if (window.ERGExpenseStore) {
                window.ERGExpenseStore.updateColor(colorKey, colorValue);
            }

            applyColorChange(colorKey, colorValue);

            console.log('Color updated and persisted:', colorKey, colorValue);
        });

        // Font selector functionality
        $(document).on('click', '.erg-font-current', function() {
            const dropdown = $(this).siblings('.erg-font-dropdown');
            $('.erg-font-dropdown, .erg-date-dropdown, .erg-report-format-editor').not(dropdown).removeClass('active');
            dropdown.toggleClass('active');
        });

        $(document).on('click', '.erg-font-option', function() {
            const fontFamily = $(this).data('font');
            const fontName = $(this).text();

            $('.erg-font-current').text(fontName);
            $('.erg-font-dropdown').removeClass('active');

            if (window.ERGExpenseStore) {
                window.ERGExpenseStore.updateFont('family', fontFamily);
            }

            applyFontChange(fontFamily);

            console.log('Font updated and persisted:', fontFamily);
        });

        // Date format selector functionality
        $(document).on('click', '.erg-date-current', function() {
            const dropdown = $(this).siblings('.erg-date-dropdown');
            $('.erg-font-dropdown, .erg-date-dropdown, .erg-report-format-editor').not(dropdown).removeClass('active');
            dropdown.toggleClass('active');
        });

        $(document).on('click', '.erg-date-option', function() {
            const dateFormat = $(this).data('format');
            const formatName = $(this).text();

            $('.erg-date-current').text(formatName);
            $('.erg-date-dropdown').removeClass('active');

            if (window.ERGExpenseStore) {
                window.ERGExpenseStore.updateDateFormat(dateFormat);
            }

            console.log('Date format updated and persisted:', dateFormat);
        });

        // Report format functionality
        $(document).on('click', '.erg-format-current', function() {
            const editor = $(this).siblings('.erg-report-format-editor');
            $('.erg-font-dropdown, .erg-date-dropdown, .erg-report-format-editor').not(editor).removeClass('active');
            editor.toggleClass('active');
        });

        // Auto-increment checkbox
        $(document).on('change', '.erg-auto-increment', function() {
            updateReportFormatPreview();
        });

        // Format input changes
        $(document).on('input', '.erg-format-input, .erg-start-number-input', function() {
            updateReportFormatPreview();
        });

        // Save format changes
        $(document).on('click', '.erg-format-save', function() {
            const formatPattern = $('.erg-format-input').val();
            const startNumber = $('.erg-start-number-input').val();
            const autoIncrement = $('.erg-auto-increment').is(':checked');

            if (window.ERGExpenseStore) {
                window.ERGExpenseStore.updateReportSettings('numberFormat', formatPattern);
                window.ERGExpenseStore.updateReportSettings('numberStart', parseInt(startNumber));
                window.ERGExpenseStore.updateReportSettings('autoIncrement', autoIncrement);
            }

            $('.erg-report-format-editor').removeClass('active');
        });

        // Cancel format changes
        $(document).on('click', '.erg-format-cancel', function() {
            $('.erg-report-format-editor').removeClass('active');
        });

        // Reset to defaults
        $(document).on('click', '.erg-reset-btn', function() {
            if (confirm('Are you sure you want to reset all settings to defaults?')) {
                if (window.ERGExpenseStore) {
                    window.ERGExpenseStore.resetToDefaults();
                    location.reload(); // Reload to apply default settings
                }
            }
        });

        // Header style selection
        $(document).on('click', '.erg-header-style-option', function() {
            const selectedStyle = $(this).data('style');

            // Update visual selection
            $('.erg-header-style-option').removeClass('selected');
            $(this).addClass('selected');

            // Show/hide modern header color option
            if (selectedStyle === 'modern') {
                $('.erg-modern-header-option').show();
            } else {
                $('.erg-modern-header-option').hide();
            }

            // Apply the header style
            applyHeaderStyle(selectedStyle);

            // Store the selection
            if (window.ERGExpenseStore) {
                window.ERGExpenseStore.updateHeaderStyle(selectedStyle);
            }

            console.log('Header style updated:', selectedStyle);
        });

        // Close dropdowns when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.erg-font-selector, .erg-date-selector, .erg-report-format-selector').length) {
                $('.erg-font-dropdown, .erg-date-dropdown, .erg-report-format-editor').removeClass('active');
            }
        });
    }

    // Logo Upload functionality
    function initializeLogoUpload() {
        // Click to trigger file upload
        $(document).on('click', '#company-logo-area .erg-logo-placeholder', function() {
            $(this).siblings('.erg-logo-input')[0].click();
        });

        // Handle file selection
        $(document).on('change', '.erg-logo-input', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();

                reader.onload = function(event) {
                    const logoData = event.target.result;

                    // Update UI
                    $('#company-logo-area .erg-logo-image')
                        .attr('src', logoData)
                        .show();
                    $('#company-logo-area .erg-logo-placeholder').hide();
                    $('#company-logo-area .erg-logo-remove').show();

                    // Store in localStorage
                    localStorage.setItem('erg-company-logo', logoData);

                    console.log('Logo uploaded and saved to localStorage');
                };

                reader.readAsDataURL(file);
            } else if (file) {
                alert('Please select a valid image file.');
            }
        });

        // Remove logo
        $(document).on('click', '.erg-logo-remove', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Update UI
            $('#company-logo-area .erg-logo-image').hide().attr('src', '');
            $('#company-logo-area .erg-logo-placeholder').show();
            $('#company-logo-area .erg-logo-remove').hide();
            $('#company-logo-area .erg-logo-input').val('');

            // Remove from localStorage
            localStorage.removeItem('erg-company-logo');

            console.log('Logo removed');
        });

        // Load saved logo on page load
        loadSavedLogo();
    }

    function loadSavedLogo() {
        const savedLogo = localStorage.getItem('erg-company-logo');
        if (savedLogo) {
            $('#company-logo-area .erg-logo-image')
                .attr('src', savedLogo)
                .show();
            $('#company-logo-area .erg-logo-placeholder').hide();
            $('#company-logo-area .erg-logo-remove').show();

            console.log('Saved logo loaded');
        }
    }

    function applyHeaderStyle(style) {
        // Remove all existing header style classes
        $('.erg-report-header').removeClass('erg-header-compact erg-header-standard erg-header-detailed erg-header-modern erg-header-classic erg-header-minimal');

        // Apply the new style class
        $('.erg-report-header').addClass('erg-header-' + style);

        // Update the container data attribute
        $('.erg-expense-report-container').attr('data-header-variant', style);
    }

    // Helper functions
    function applyColorChange(colorKey, colorValue) {
        // Create or update dynamic style element
        let styleId = 'erg-dynamic-colors';
        let $style = $(`#${styleId}`);

        if ($style.length === 0) {
            $style = $('<style>').attr('id', styleId).appendTo('head');
        }

        let currentCSS = $style.text();

        // Define CSS rules for each color key
        const cssRules = {
            'headerBackground': `
                .erg-expense-report-container .erg-table-header,
                .erg-expense-report-container .erg-editable-header,
                .erg-expense-report-container .erg-table-header::before {
                    background-color: ${colorValue} !important;
                }`,
            'headerText': `
                .erg-expense-report-container .erg-table-header,
                .erg-expense-report-container .erg-editable-header,
                .erg-expense-report-container .erg-header-text,
                .erg-expense-report-container .erg-sort-icon {
                    color: ${colorValue} !important;
                }`,
            'modernHeaderBackground': `
                .erg-expense-report-container .erg-header-modern {
                    background-color: ${colorValue} !important;
                }`,
            'tableRowOdd': `
                .erg-expense-report-container .erg-expense-row:nth-child(odd) {
                    background-color: ${colorValue} !important;
                }`,
            'tableRowEven': `
                .erg-expense-report-container .erg-expense-row:nth-child(even) {
                    background-color: ${colorValue} !important;
                }`,
            'tableBorder': `
                .erg-expense-report-container .erg-expense-table,
                .erg-expense-report-container .erg-table-header,
                .erg-expense-report-container .erg-expense-row,
                .erg-expense-report-container .erg-expense-row > div,
                .erg-expense-report-container .erg-editable-header,
                .erg-expense-report-container .erg-drag-handle,
                .erg-expense-report-container #expense-rows,
                .erg-expense-report-container .erg-total-section {
                    border-color: ${colorValue} !important;
                }`,
            'primaryText': `
                .erg-expense-report-container {
                    color: ${colorValue} !important;
                }`,
            'secondaryText': `
                .erg-expense-report-container .erg-secondary-text {
                    color: ${colorValue} !important;
                }`,
            'totalBackground': `
                .erg-expense-report-container .erg-total-section {
                    background-color: ${colorValue} !important;
                }`,
            'totalBorder': `
                .erg-expense-report-container .erg-total-section {
                    border-color: ${colorValue} !important;
                    border-top-color: ${colorValue} !important;
                }`
        };

        if (cssRules[colorKey]) {
            // Remove existing rule for this key
            const regex = new RegExp(`\\/\\* ${colorKey} \\*\\/[\\s\\S]*?\\/\\* end ${colorKey} \\*\\/`, 'g');
            currentCSS = currentCSS.replace(regex, '');

            // Add new rule
            const newRule = `/* ${colorKey} */\n${cssRules[colorKey]}\n/* end ${colorKey} */\n`;
            currentCSS += newRule;

            // Update style element
            $style.text(currentCSS);
        }
    }

    function applyFontChange(fontFamily) {
        // Create or update dynamic style element for fonts
        let styleId = 'erg-dynamic-fonts';
        let $style = $(`#${styleId}`);

        if ($style.length === 0) {
            $style = $('<style>').attr('id', styleId).appendTo('head');
        }

        const fontCSS = `
            .erg-expense-report-container {
                font-family: ${fontFamily} !important;
            }
        `;

        $style.text(fontCSS);
    }

    function applyLayoutChanges(styling) {
        // Create or update dynamic style element for layout
        let styleId = 'erg-dynamic-layout';
        let $style = $(`#${styleId}`);

        if ($style.length === 0) {
            $style = $('<style>').attr('id', styleId).appendTo('head');
        }

        let layoutCSS = '';

        // Container layout
        if (styling.layout) {
            layoutCSS += `
                .erg-expense-report-container {
                    ${styling.layout.containerMaxWidth ? `max-width: ${styling.layout.containerMaxWidth} !important;` : ''}
                    ${styling.layout.borderRadius ? `border-radius: ${styling.layout.borderRadius} !important;` : ''}
                    ${styling.layout.padding ? `padding: ${styling.layout.padding} !important;` : ''}
                }
                .erg-expense-report-container .erg-expense-table td,
                .erg-expense-report-container .erg-expense-table th {
                    ${styling.layout.tablePadding ? `padding: ${styling.layout.tablePadding} !important;` : ''}
                }
            `;
        }

        // Font sizes
        if (styling.fonts) {
            layoutCSS += `
                .erg-expense-report-container {
                    ${styling.fonts.baseSize ? `font-size: ${styling.fonts.baseSize} !important;` : ''}
                }
                .erg-expense-report-container .erg-report-title h1 {
                    ${styling.fonts.headerSize ? `font-size: ${styling.fonts.headerSize} !important;` : ''}
                }
                .erg-expense-report-container .erg-section-title {
                    ${styling.fonts.titleSize ? `font-size: ${styling.fonts.titleSize} !important;` : ''}
                }
            `;
        }

        $style.text(layoutCSS);
    }

    // Load and apply saved customizations from store
    function loadSavedCustomizations() {
        if (!window.ERGExpenseStore) {
            console.log('ERGExpenseStore not available yet, retrying...');
            setTimeout(loadSavedCustomizations, 100);
            return;
        }

        console.log('Loading saved customizations...');
        const state = window.ERGExpenseStore.getState();

        // Apply saved colors
        Object.entries(state.styling.colors).forEach(([key, value]) => {
            applyColorChange(key, value);
            // Update color picker values in customization panel
            $(`.erg-color-input[data-color="${key}"]`).val(value);
        });
        console.log('Applied saved colors:', state.styling.colors);

        // Apply saved fonts
        if (state.styling.fonts.family) {
            applyFontChange(state.styling.fonts.family);
            // Update font selector display
            $('.erg-font-current').text(getFontDisplayName(state.styling.fonts.family));
        }
        console.log('Applied saved fonts:', state.styling.fonts);

        // Apply saved date format
        if (state.dateFormat.format) {
            // Update date format display
            $('.erg-date-current').text(getDateFormatDisplayName(state.dateFormat.format));
        }
        console.log('Applied saved date format:', state.dateFormat);

        // Apply saved layout settings using CSS injection
        applyLayoutChanges(state.styling);
        console.log('Applied saved layout and fonts:', state.styling);

        // Apply saved header style
        if (state.headerStyle) {
            applyHeaderStyle(state.headerStyle);
            // Update the selected header style in customization panel
            $(`.erg-header-style-option[data-style="${state.headerStyle}"]`).addClass('selected');
        }
        console.log('Applied saved header style:', state.headerStyle);

        console.log('All saved customizations loaded and applied');
        console.log('Current store state:', state);

        // For debugging - show localStorage content
        try {
            const storedData = localStorage.getItem('erg-expense-report-customization');
            if (storedData) {
                console.log('Raw localStorage data:', JSON.parse(storedData));
            } else {
                console.log('No localStorage data found');
            }
        } catch (e) {
            console.log('Error reading localStorage:', e);
        }
    }

    // Helper function to get font display name
    function getFontDisplayName(fontFamily) {
        const fontMap = {
            'system-ui, -apple-system, sans-serif': 'System Default',
            'Georgia, serif': 'Georgia',
            '"Times New Roman", serif': 'Times New Roman',
            'Arial, sans-serif': 'Arial',
            '"Helvetica Neue", sans-serif': 'Helvetica',
            '"Open Sans", sans-serif': 'Open Sans',
            '"Roboto", sans-serif': 'Roboto',
            '"Lato", sans-serif': 'Lato',
            '"Montserrat", sans-serif': 'Montserrat',
            '"Source Sans Pro", sans-serif': 'Source Sans Pro'
        };
        return fontMap[fontFamily] || 'System Default';
    }

    // Helper function to get date format display name
    function getDateFormatDisplayName(format) {
        const formatMap = {
            'YYYY-MM-DD': 'ISO (YYYY-MM-DD)',
            'MM/DD/YYYY': 'US (MM/DD/YYYY)',
            'DD/MM/YYYY': 'EU (DD/MM/YYYY)',
            'DD.MM.YYYY': 'German (DD.MM.YYYY)'
        };
        return formatMap[format] || 'ISO (YYYY-MM-DD)';
    }

    function updateReportFormatPreview() {
        const formatPattern = $('.erg-format-input').val();
        const startNumber = $('.erg-start-number-input').val();
        const preview = formatPattern.replace('{number}', startNumber);
        $('.erg-format-preview').text(`Preview: ${preview}`);
    }

})(jQuery);
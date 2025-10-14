<?php
/**
 * Simple Expense Report Shortcode Handler
 */

if (!defined('ABSPATH')) {
    exit;
}

class ERG_Shortcode_Handler {

    public function render($atts) {
        $atts = shortcode_atts([
            'currency' => 'USD',
            'title' => 'Expense Report'
        ], $atts, 'expense_report_generator');

        $instance_id = 'erg-' . uniqid();

        return $this->get_html_template($instance_id, $atts);
    }

    private function get_html_template($instance_id, $atts) {
        $header_variant = 'standard'; // Default header variant, user can change in customization panel
        $show_footer_branding = get_option('erg_show_footer_branding', '1');

        ob_start();
        ?>
        <!-- Top Header with Title and Controls (Outside container) -->
        <div class="erg-top-header">
            <h2 class="erg-main-title"><?php echo esc_html(get_option('erg_main_title', 'Online Free Expense Report Generator')); ?></h2>
            <div class="erg-top-controls">
                <button class="erg-customize-btn">Customize</button>
                <button id="export-pdf-btn" class="erg-download-btn">Download PDF</button>
            </div>
        </div>

        <div id="<?php echo esc_attr($instance_id); ?>" class="erg-expense-report-container" data-header-variant="<?php echo esc_attr($header_variant); ?>">
            <!-- Report Header -->
            <div class="erg-report-header erg-header-<?php echo esc_attr($header_variant); ?>">
                <div class="erg-company-info">
                    <!-- Logo Upload Area -->
                    <div class="erg-company-logo" id="company-logo-area">
                        <div class="erg-logo-placeholder">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21,15 16,10 5,21"/>
                            </svg>
                            <span class="erg-logo-text">Click to upload logo</span>
                        </div>
                        <img class="erg-logo-image" style="display: none;" alt="Company Logo">
                        <input type="file" class="erg-logo-input" accept="image/*" style="display: none;">
                        <button class="erg-logo-remove" style="display: none;">×</button>
                    </div>

                    <div class="erg-editable-label" data-key="companyName">
                        <span class="erg-label-text">Your Company Name</span>
                        <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                        </svg>
                    </div>
                    <div class="erg-editable-label" data-key="companyAddress">
                        <span class="erg-label-text">Company's Address</span>
                        <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                        </svg>
                    </div>
                    <div class="erg-editable-label" data-key="companyCity">
                        <span class="erg-label-text">City, State Zip</span>
                        <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                        </svg>
                    </div>
                    <div class="erg-editable-label" data-key="companyCountry">
                        <span class="erg-label-text">Country</span>
                        <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                        </svg>
                    </div>
                </div>

                <div class="erg-report-info">
                    <h1 class="erg-editable-label" data-key="reportTitle">
                        <span class="erg-label-text">Expense Report</span>
                        <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                        </svg>
                    </h1>
                    <div class="erg-report-number">ER-12345</div>
                </div>
            </div>

            <!-- Report Details Section -->
            <div class="erg-report-details">
                <div class="erg-details-grid">
                    <div class="erg-detail-row">
                        <label class="erg-editable-label" data-key="submittedBy">
                            <span class="erg-label-text">Submitted By</span>
                            <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                            </svg>
                        </label>
                        <input type="text" id="submitted-by" placeholder="Your Name">
                    </div>

                    <div class="erg-detail-row">
                        <label class="erg-editable-label" data-key="submittedOn">
                            <span class="erg-label-text">Submitted On</span>
                            <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                            </svg>
                        </label>
                        <input type="date" id="submitted-on">
                    </div>

                    <div class="erg-detail-row">
                        <label class="erg-editable-label" data-key="reportTo">
                            <span class="erg-label-text">Report To</span>
                            <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                            </svg>
                        </label>
                        <input type="text" id="report-to" placeholder="Manager Name">
                    </div>

                    <div class="erg-detail-row">
                        <label class="erg-editable-label" data-key="reportingPeriod">
                            <span class="erg-label-text">Reporting Period</span>
                            <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                            </svg>
                        </label>
                        <div class="erg-date-range">
                            <input type="date" id="period-from">
                            <span>to</span>
                            <input type="date" id="period-to">
                        </div>
                    </div>

                    <div class="erg-detail-row">
                        <label class="erg-editable-label" data-key="reportTitleLabel">
                            <span class="erg-label-text">Report Title</span>
                            <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                            </svg>
                        </label>
                        <input type="text" id="report-title" placeholder="Monthly Expense Report">
                    </div>

                    <div class="erg-detail-row">
                        <label class="erg-editable-label" data-key="businessPurpose">
                            <span class="erg-label-text">Business Purpose</span>
                            <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                            </svg>
                        </label>
                        <textarea id="business-purpose" placeholder="Describe the business purpose for these expenses"></textarea>
                    </div>
                </div>
            </div>

            <!-- Expense Table -->
            <div class="erg-expense-table">
                <!-- Table Header -->
                <div class="erg-table-header">
                    <div class="erg-editable-header sortable" data-key="date" data-sort="date" draggable="true">
                        <span class="erg-header-text">Date</span>
                        <span class="erg-sort-icon">↕</span>
                        <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                        </svg>
                    </div>
                    <div class="erg-editable-header sortable" data-key="description" data-sort="description" draggable="true">
                        <span class="erg-header-text">Expense Description</span>
                        <span class="erg-sort-icon">↕</span>
                        <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                        </svg>
                    </div>
                    <div class="erg-editable-header sortable" data-key="merchant" data-sort="merchant" draggable="true">
                        <span class="erg-header-text">Merchant</span>
                        <span class="erg-sort-icon">↕</span>
                        <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                        </svg>
                    </div>
                    <div class="erg-editable-header sortable" data-key="amount" data-sort="amount" draggable="true">
                        <span class="erg-header-text">Amount</span>
                        <span class="erg-sort-icon">↕</span>
                        <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                        </svg>
                    </div>
                </div>

                <!-- Expense Rows -->
                <div id="expense-rows">
                    <div class="erg-expense-row" data-row="1" draggable="true">
                        <div class="erg-drag-handle">
                            <span class="erg-drag-icon">⋮⋮</span>
                        </div>
                        <div class="col-date">
                            <input type="date">
                        </div>
                        <div class="col-description">
                            <input type="text" placeholder="Expense Description">
                        </div>
                        <div class="col-merchant">
                            <input type="text" placeholder="Merchant Name">
                        </div>
                        <div class="col-amount">
                            <input type="number" step="0.01" min="0" value="0.00">
                        </div>
                    </div>

                    <div class="erg-expense-row" data-row="2" draggable="true">
                        <div class="erg-drag-handle">
                            <span class="erg-drag-icon">⋮⋮</span>
                        </div>
                        <div class="col-date">
                            <input type="date">
                        </div>
                        <div class="col-description">
                            <input type="text" placeholder="Expense Description">
                        </div>
                        <div class="col-merchant">
                            <input type="text" placeholder="Merchant Name">
                        </div>
                        <div class="col-amount">
                            <input type="number" step="0.01" min="0" value="0.00">
                        </div>
                    </div>

                    <div class="erg-expense-row" data-row="3" draggable="true">
                        <div class="erg-drag-handle">
                            <span class="erg-drag-icon">⋮⋮</span>
                        </div>
                        <div class="col-date">
                            <input type="date">
                        </div>
                        <div class="col-description">
                            <input type="text" placeholder="Expense Description">
                        </div>
                        <div class="col-merchant">
                            <input type="text" placeholder="Merchant Name">
                        </div>
                        <div class="col-amount">
                            <input type="number" step="0.01" min="0" value="0.00">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add New Expense Button -->
            <div class="erg-expense-actions">
                <button id="add-new-expense">Add New Expense</button>
            </div>

            <!-- Total Section -->
            <div class="erg-total-section">
                <div class="erg-total-label">
                    <span class="erg-editable-label" data-key="total">
                        <span class="erg-label-text">TOTAL</span>
                        <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                        </svg>
                    </span>
                </div>
                <div class="erg-total-amount">
                    <span class="currency-symbol erg-editable-label" data-key="currencySymbol">
                        <span class="erg-label-text">$</span>
                        <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 1l3 3 3-3-3-3-3 3zm-2 8a2 2 0 0 1 4 0c0 1.02-.4 2.02-1.05 2.83L8 16H6v2h12v-2l-4.95-4.17A3.99 3.99 0 0 0 14 9a4 4 0 0 0-8 0H8a2 2 0 0 1 2-2z"></path>
                        </svg>
                    </span>
                    <span id="total-amount">0.00</span>
                </div>
            </div>

            <?php if ($show_footer_branding == '1'): ?>
            <!-- Footer Branding -->
            <div class="erg-footer-branding">
                <div class="erg-powered-by">
                    <span>Powered by</span>
                    <div class="erg-taskip-logo">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="7" height="7" fill="#00B289" rx="1"/>
                            <rect x="14" y="3" width="7" height="7" fill="#00B289" rx="1"/>
                            <rect x="3" y="14" width="7" height="7" fill="#00B289" rx="1"/>
                            <rect x="14" y="14" width="7" height="7" fill="#00B289" rx="1"/>
                        </svg>
                        <span class="erg-taskip-text">Taskip</span>
                    </div>
                </div>
            </div>
            <?php endif; ?>
        </div>

        <!-- Customization Panel -->
        <div class="erg-customization-overlay"></div>
        <div class="erg-customization-panel">
            <div class="erg-panel-header">
                <h3>Customize Report</h3>
                <button class="erg-panel-close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <div class="erg-panel-content">
                <!-- Header Layout Section -->
                <div class="erg-panel-section">
                    <h4>Header Layout</h4>
                    <div class="erg-header-styles">
                        <!-- Row 1 -->
                        <div class="erg-header-style-row">
                            <div class="erg-header-style-option" data-style="compact">
                                <div class="erg-style-svg-preview">
                                    <svg width="80" height="50" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="80" height="50" rx="4" fill="#f8f9fa" stroke="#e9ecef"/>
                                        <rect x="6" y="8" width="20" height="2" rx="1" fill="#6c757d"/>
                                        <rect x="6" y="12" width="16" height="1.5" rx="0.5" fill="#adb5bd"/>
                                        <rect x="6" y="15" width="18" height="1.5" rx="0.5" fill="#adb5bd"/>
                                        <rect x="50" y="8" width="24" height="3" rx="1" fill="#495057"/>
                                        <rect x="55" y="13" width="14" height="1.5" rx="0.5" fill="#6c757d"/>
                                        <line x1="6" y1="22" x2="74" y2="22" stroke="#e9ecef" stroke-width="1"/>
                                        <rect x="6" y="26" width="68" height="18" rx="2" fill="#ffffff" stroke="#e9ecef"/>
                                        <rect x="10" y="30" width="8" height="1" fill="#e9ecef"/>
                                        <rect x="22" y="30" width="20" height="1" fill="#e9ecef"/>
                                        <rect x="46" y="30" width="12" height="1" fill="#e9ecef"/>
                                        <rect x="62" y="30" width="8" height="1" fill="#e9ecef"/>
                                    </svg>
                                </div>
                                <div class="erg-style-info">
                                    <span class="erg-style-name">Compact</span>
                                    <span class="erg-style-desc">Clean and space-efficient</span>
                                </div>
                            </div>

                            <div class="erg-header-style-option" data-style="standard">
                                <div class="erg-style-svg-preview">
                                    <svg width="80" height="50" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="80" height="50" rx="4" fill="#f8f9fa" stroke="#e9ecef"/>
                                        <rect x="6" y="6" width="22" height="2.5" rx="1" fill="#6c757d"/>
                                        <rect x="6" y="10" width="18" height="1.5" rx="0.5" fill="#adb5bd"/>
                                        <rect x="6" y="13" width="20" height="1.5" rx="0.5" fill="#adb5bd"/>
                                        <rect x="6" y="16" width="16" height="1.5" rx="0.5" fill="#adb5bd"/>
                                        <rect x="48" y="6" width="26" height="4" rx="1" fill="#495057"/>
                                        <rect x="52" y="12" width="18" height="1.5" rx="0.5" fill="#6c757d"/>
                                        <line x1="6" y1="24" x2="74" y2="24" stroke="#e9ecef" stroke-width="2"/>
                                        <rect x="6" y="28" width="68" height="16" rx="2" fill="#ffffff" stroke="#e9ecef"/>
                                        <rect x="10" y="32" width="8" height="1" fill="#e9ecef"/>
                                        <rect x="22" y="32" width="20" height="1" fill="#e9ecef"/>
                                        <rect x="46" y="32" width="12" height="1" fill="#e9ecef"/>
                                        <rect x="62" y="32" width="8" height="1" fill="#e9ecef"/>
                                    </svg>
                                </div>
                                <div class="erg-style-info">
                                    <span class="erg-style-name">Standard</span>
                                    <span class="erg-style-desc">Balanced layout with good spacing</span>
                                </div>
                            </div>
                        </div>

                        <!-- Row 2 -->
                        <div class="erg-header-style-row">
                            <div class="erg-header-style-option" data-style="detailed">
                                <div class="erg-style-svg-preview">
                                    <svg width="80" height="50" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="80" height="50" rx="4" fill="#f8f9fa" stroke="#e9ecef"/>
                                        <rect x="6" y="4" width="24" height="3" rx="1" fill="#6c757d"/>
                                        <rect x="6" y="8.5" width="20" height="1.5" rx="0.5" fill="#adb5bd"/>
                                        <rect x="6" y="11" width="22" height="1.5" rx="0.5" fill="#adb5bd"/>
                                        <rect x="6" y="13.5" width="18" height="1.5" rx="0.5" fill="#adb5bd"/>
                                        <rect x="6" y="16" width="16" height="1.5" rx="0.5" fill="#adb5bd"/>
                                        <rect x="45" y="4" width="29" height="5" rx="1" fill="#495057"/>
                                        <rect x="48" y="11" width="22" height="1.5" rx="0.5" fill="#6c757d"/>
                                        <rect x="48" y="13.5" width="18" height="1.5" rx="0.5" fill="#6c757d"/>
                                        <line x1="6" y1="22" x2="74" y2="22" stroke="#e9ecef" stroke-width="2"/>
                                        <rect x="6" y="26" width="68" height="18" rx="2" fill="#ffffff" stroke="#e9ecef"/>
                                        <rect x="10" y="30" width="8" height="1" fill="#e9ecef"/>
                                        <rect x="22" y="30" width="20" height="1" fill="#e9ecef"/>
                                        <rect x="46" y="30" width="12" height="1" fill="#e9ecef"/>
                                        <rect x="62" y="30" width="8" height="1" fill="#e9ecef"/>
                                    </svg>
                                </div>
                                <div class="erg-style-info">
                                    <span class="erg-style-name">Detailed</span>
                                    <span class="erg-style-desc">Spacious with extra information</span>
                                </div>
                            </div>

                            <div class="erg-header-style-option" data-style="modern">
                                <div class="erg-style-svg-preview">
                                    <svg width="80" height="50" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="80" height="50" rx="4" fill="#667eea" stroke="#5a6fd8"/>
                                        <rect x="6" y="6" width="22" height="2.5" rx="1" fill="white" fill-opacity="0.9"/>
                                        <rect x="6" y="10" width="18" height="1.5" rx="0.5" fill="white" fill-opacity="0.7"/>
                                        <rect x="6" y="13" width="20" height="1.5" rx="0.5" fill="white" fill-opacity="0.7"/>
                                        <rect x="48" y="6" width="26" height="4" rx="1" fill="white"/>
                                        <rect x="52" y="12" width="18" height="1.5" rx="0.5" fill="white" fill-opacity="0.8"/>
                                        <line x1="6" y1="22" x2="74" y2="22" stroke="white" stroke-opacity="0.3" stroke-width="1"/>
                                        <rect x="6" y="26" width="68" height="16" rx="2" fill="white" fill-opacity="0.95"/>
                                        <rect x="10" y="30" width="8" height="1" fill="#667eea" fill-opacity="0.5"/>
                                        <rect x="22" y="30" width="20" height="1" fill="#667eea" fill-opacity="0.5"/>
                                        <rect x="46" y="30" width="12" height="1" fill="#667eea" fill-opacity="0.5"/>
                                        <rect x="62" y="30" width="8" height="1" fill="#667eea" fill-opacity="0.5"/>
                                    </svg>
                                </div>
                                <div class="erg-style-info">
                                    <span class="erg-style-name">Modern</span>
                                    <span class="erg-style-desc">Contemporary design with solid color</span>
                                </div>
                            </div>
                        </div>

                        <!-- Row 3 -->
                        <div class="erg-header-style-row">
                            <div class="erg-header-style-option" data-style="classic">
                                <div class="erg-style-svg-preview">
                                    <svg width="80" height="50" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="80" height="50" rx="4" fill="#f8f9fa"/>
                                        <rect x="2" y="2" width="76" height="46" rx="2" fill="#f8f9fa" stroke="#333333" stroke-width="2"/>
                                        <rect x="6" y="6" width="22" height="2.5" rx="1" fill="#333333"/>
                                        <rect x="6" y="10" width="18" height="1.5" rx="0.5" fill="#666666"/>
                                        <rect x="6" y="13" width="20" height="1.5" rx="0.5" fill="#666666"/>
                                        <rect x="46" y="6" width="28" height="4" rx="1" fill="#333333"/>
                                        <line x1="46" y1="12" x2="74" y2="12" stroke="#333333" stroke-width="1"/>
                                        <rect x="50" y="13.5" width="20" height="1.5" rx="0.5" fill="#666666"/>
                                        <line x1="6" y1="22" x2="74" y2="22" stroke="#333333" stroke-width="2"/>
                                        <rect x="6" y="26" width="68" height="16" rx="2" fill="white" stroke="#333333"/>
                                        <rect x="10" y="30" width="8" height="1" fill="#333333"/>
                                        <rect x="22" y="30" width="20" height="1" fill="#333333"/>
                                        <rect x="46" y="30" width="12" height="1" fill="#333333"/>
                                        <rect x="62" y="30" width="8" height="1" fill="#333333"/>
                                    </svg>
                                </div>
                                <div class="erg-style-info">
                                    <span class="erg-style-name">Classic</span>
                                    <span class="erg-style-desc">Traditional formal business style</span>
                                </div>
                            </div>

                            <div class="erg-header-style-option" data-style="minimal">
                                <div class="erg-style-svg-preview">
                                    <svg width="80" height="50" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="80" height="50" rx="4" fill="white" stroke="#f0f0f0"/>
                                        <rect x="30" y="8" width="20" height="4" rx="1" fill="#495057"/>
                                        <rect x="34" y="14" width="12" height="1.5" rx="0.5" fill="#6c757d"/>
                                        <line x1="10" y1="22" x2="70" y2="22" stroke="#f0f0f0" stroke-width="1"/>
                                        <rect x="6" y="26" width="68" height="16" rx="2" fill="white" stroke="#f0f0f0"/>
                                        <rect x="10" y="30" width="8" height="1" fill="#e9ecef"/>
                                        <rect x="22" y="30" width="20" height="1" fill="#e9ecef"/>
                                        <rect x="46" y="30" width="12" height="1" fill="#e9ecef"/>
                                        <rect x="62" y="30" width="8" height="1" fill="#e9ecef"/>
                                    </svg>
                                </div>
                                <div class="erg-style-info">
                                    <span class="erg-style-name">Minimal</span>
                                    <span class="erg-style-desc">Clean and simple design</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Colors & Branding Section -->
                <div class="erg-panel-section">
                    <h4>Colors & Branding</h4>

                    <!-- Header Colors -->
                    <div class="erg-color-group">
                        <h5>Header Section</h5>
                        <div class="erg-panel-row">
                            <label>Background:</label>
                            <input type="color" class="erg-color-input" data-color="headerBackground" value="#6c757d">
                        </div>
                        <div class="erg-panel-row">
                            <label>Text:</label>
                            <input type="color" class="erg-color-input" data-color="headerText" value="#ffffff">
                        </div>

                        <!-- Modern Header Specific Color - Hidden by default -->
                        <div class="erg-panel-row erg-modern-header-option" style="display: none;">
                            <label>Modern Header Background:</label>
                            <input type="color" class="erg-color-input" data-color="modernHeaderBackground" value="#667eea">
                        </div>
                    </div>

                    <!-- Table Colors -->
                    <div class="erg-color-group">
                        <h5>Table Section</h5>
                        <div class="erg-panel-row">
                            <label>Odd Row Background:</label>
                            <input type="color" class="erg-color-input" data-color="tableRowOdd" value="#ffffff">
                        </div>
                        <div class="erg-panel-row">
                            <label>Even Row Background:</label>
                            <input type="color" class="erg-color-input" data-color="tableRowEven" value="#f8f9fa">
                        </div>
                        <div class="erg-panel-row">
                            <label>Border Color:</label>
                            <input type="color" class="erg-color-input" data-color="tableBorder" value="#e9ecef">
                        </div>
                    </div>

                    <!-- Total Section Colors -->
                    <div class="erg-color-group">
                        <h5>Total Section</h5>
                        <div class="erg-panel-row">
                            <label>Background:</label>
                            <input type="color" class="erg-color-input" data-color="totalBackground" value="#f8f9fa">
                        </div>
                        <div class="erg-panel-row">
                            <label>Border:</label>
                            <input type="color" class="erg-color-input" data-color="totalBorder" value="#dddddd">
                        </div>
                    </div>

                    <!-- Text Colors -->
                    <div class="erg-color-group">
                        <h5>Text Colors</h5>
                        <div class="erg-panel-row">
                            <label>Primary Text:</label>
                            <input type="color" class="erg-color-input" data-color="primaryText" value="#333333">
                        </div>
                        <div class="erg-panel-row">
                            <label>Secondary Text:</label>
                            <input type="color" class="erg-color-input" data-color="secondaryText" value="#666666">
                        </div>
                    </div>
                </div>

                <!-- Typography Section -->
                <div class="erg-panel-section">
                    <h4>Typography</h4>
                    <div class="erg-panel-row">
                        <label>Font Family:</label>
                        <div class="erg-font-selector">
                            <div class="erg-font-current">System Default</div>
                            <svg class="erg-dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6,9 12,15 18,9"></polyline>
                            </svg>
                            <div class="erg-font-dropdown">
                                <div class="erg-font-option" data-font="system-ui, -apple-system, sans-serif">System Default</div>
                                <div class="erg-font-option" data-font="Georgia, serif">Georgia</div>
                                <div class="erg-font-option" data-font='"Times New Roman", serif'>Times New Roman</div>
                                <div class="erg-font-option" data-font="Arial, sans-serif">Arial</div>
                                <div class="erg-font-option" data-font='"Helvetica Neue", sans-serif'>Helvetica</div>
                                <div class="erg-font-option" data-font='"Open Sans", sans-serif'>Open Sans</div>
                                <div class="erg-font-option" data-font='"Roboto", sans-serif'>Roboto</div>
                                <div class="erg-font-option" data-font='"Lato", sans-serif'>Lato</div>
                                <div class="erg-font-option" data-font='"Montserrat", sans-serif'>Montserrat</div>
                                <div class="erg-font-option" data-font='"Source Sans Pro", sans-serif'>Source Sans Pro</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Date Format Section -->
                <div class="erg-panel-section">
                    <h4>Date Format</h4>
                    <div class="erg-panel-row">
                        <label>Format:</label>
                        <div class="erg-date-selector">
                            <div class="erg-date-current">ISO (YYYY-MM-DD)</div>
                            <svg class="erg-dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6,9 12,15 18,9"></polyline>
                            </svg>
                            <div class="erg-date-dropdown">
                                <div class="erg-date-option" data-format="YYYY-MM-DD">ISO (YYYY-MM-DD)</div>
                                <div class="erg-date-option" data-format="MM/DD/YYYY">US (MM/DD/YYYY)</div>
                                <div class="erg-date-option" data-format="DD/MM/YYYY">EU (DD/MM/YYYY)</div>
                                <div class="erg-date-option" data-format="DD.MM.YYYY">German (DD.MM.YYYY)</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Report Settings Section -->
                <div class="erg-panel-section">
                    <h4>Report Settings</h4>
                    <div class="erg-panel-row">
                        <label>Report Number Format:</label>
                        <div class="erg-report-format-selector">
                            <div class="erg-format-current">ER-10001</div>
                            <svg class="erg-dropdown-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6,9 12,15 18,9"></polyline>
                            </svg>
                            <div class="erg-report-format-editor">
                                <div class="erg-editor-field">
                                    <label>Format Pattern:</label>
                                    <input type="text" class="erg-format-input" value="ER-{number}" placeholder="Use {number} for auto-increment">
                                </div>
                                <div class="erg-editor-field">
                                    <label>Start Number:</label>
                                    <input type="number" class="erg-start-number-input" value="10001" min="1">
                                </div>
                                <div class="erg-editor-field">
                                    <label>
                                        <input type="checkbox" class="erg-auto-increment" checked>
                                        Auto-increment numbers
                                    </label>
                                </div>
                                <div class="erg-format-preview">Preview: ER-10001</div>
                                <div class="erg-editor-buttons">
                                    <button class="erg-format-save">Save</button>
                                    <button class="erg-format-cancel">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="erg-panel-section">
                    <div class="erg-panel-actions">
                        <button class="erg-reset-btn">Reset to Defaults</button>
                    </div>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
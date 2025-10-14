<?php
/**
 * Expense Report Header Component
 * Handles the top section of the expense report (company info and report details)
 */

if (!defined('ABSPATH')) {
    exit;
}

class ERG_Header_Component {

    /**
     * Render the complete header section
     */
    public function render($attributes = array()) {
        $default_attributes = array(
            'company_name' => 'Your Company Name',
            'company_address' => 'Company\'s Address',
            'company_city' => 'City, State Zip',
            'company_country' => 'Country',
            'report_title' => 'Expense Report',
            'report_number' => 'ER-12345'
        );

        $attributes = array_merge($default_attributes, $attributes);

        ob_start();
        ?>
        <!-- Report Header -->
        <div class="erg-report-header">
            <?php echo $this->render_company_info($attributes); ?>
            <?php echo $this->render_report_info($attributes); ?>
        </div>

        <!-- Report Details Section -->
        <div class="erg-report-details">
            <?php echo $this->render_report_details($attributes); ?>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Render company information section
     */
    private function render_company_info($attributes) {
        ob_start();
        ?>
        <div class="erg-company-info">
            <div class="erg-editable-label" data-key="companyName">
                <span class="erg-label-text"><?php echo esc_html($attributes['company_name']); ?></span>
                <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                </svg>
            </div>
            <div class="erg-editable-label" data-key="companyAddress">
                <span class="erg-label-text"><?php echo esc_html($attributes['company_address']); ?></span>
                <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                </svg>
            </div>
            <div class="erg-editable-label" data-key="companyCity">
                <span class="erg-label-text"><?php echo esc_html($attributes['company_city']); ?></span>
                <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                </svg>
            </div>
            <div class="erg-editable-label" data-key="companyCountry">
                <span class="erg-label-text"><?php echo esc_html($attributes['company_country']); ?></span>
                <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                </svg>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Render report information section
     */
    private function render_report_info($attributes) {
        ob_start();
        ?>
        <div class="erg-report-info">
            <h1 class="erg-editable-label" data-key="reportTitle">
                <span class="erg-label-text"><?php echo esc_html($attributes['report_title']); ?></span>
                <svg class="erg-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z"></path>
                </svg>
            </h1>
            <div class="erg-report-number"><?php echo esc_html($attributes['report_number']); ?></div>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Render report details section (form fields)
     */
    private function render_report_details($attributes) {
        ob_start();
        ?>
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
        <?php
        return ob_get_clean();
    }
}
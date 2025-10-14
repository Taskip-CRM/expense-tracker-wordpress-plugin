<?php
/**
 * Plugin Name: Simple Expense Report Generator
 * Plugin URI: https://github.com/your-username/simple-expense-report
 * Description: Create and export professional expense reports as PDF with a simple invoice-style interface.
 * Version: 2.0.0
 * Author: Your Name
 * Author URI: https://yourwebsite.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: erg-expense-report
 * Domain Path: /languages
 * Requires at least: 5.0
 * Tested up to: 6.4
 * Requires PHP: 7.4
 * Network: false
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('ERG_PLUGIN_VERSION', '2.0.0');
define('ERG_PLUGIN_URL', plugin_dir_url(__FILE__));
define('ERG_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('ERG_PLUGIN_FILE', __FILE__);
define('ERG_PLUGIN_BASENAME', plugin_basename(__FILE__));

// Main plugin class
class ERG_Simple_Expense_Report {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->init_hooks();
        $this->load_dependencies();
    }

    private function init_hooks() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_shortcode('expense_report_generator', array($this, 'render_shortcode'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'admin_init'));
    }

    private function load_dependencies() {
        require_once ERG_PLUGIN_PATH . 'includes/class-erg-shortcode-handler.php';
    }

    public function enqueue_scripts() {
        // Load scripts on all frontend pages to ensure compatibility
        if (!is_admin()) {
            wp_enqueue_style(
                'erg-expense-report-style',
                ERG_PLUGIN_URL . 'assets/css/expense-report.css',
                array(),
                ERG_PLUGIN_VERSION
            );

            wp_enqueue_script(
                'erg-expense-store',
                ERG_PLUGIN_URL . 'assets/js/expense-store.js',
                array(),
                ERG_PLUGIN_VERSION,
                true
            );

            wp_enqueue_script(
                'erg-expense-report-js',
                ERG_PLUGIN_URL . 'assets/js/expense-report.js',
                array('jquery', 'erg-expense-store'),
                ERG_PLUGIN_VERSION,
                true
            );

            wp_enqueue_script(
                'jspdf',
                ERG_PLUGIN_URL . 'assets/js/jspdf.min.js',
                array(),
                ERG_PLUGIN_VERSION,
                false // Load in header to ensure it's available
            );
        }
    }

    public function render_shortcode($atts) {
        $handler = new ERG_Shortcode_Handler();
        return $handler->render($atts);
    }

    public function add_admin_menu() {
        // Add to WordPress Settings menu instead of creating main menu
        add_options_page(
            __('Expense Report Generator', 'erg-expense-report'),
            __('Expense Report Generator', 'erg-expense-report'),
            'manage_options',
            'erg-settings',
            array($this, 'settings_page')
        );
    }

    public function admin_init() {
        // General Settings
        register_setting('erg_settings', 'erg_main_title');
        register_setting('erg_settings', 'erg_show_footer_branding');

        // Default Color Settings
        register_setting('erg_settings', 'erg_default_header_background', array('default' => '#6c757d'));
        register_setting('erg_settings', 'erg_default_header_text', array('default' => '#ffffff'));
        register_setting('erg_settings', 'erg_default_table_row_odd', array('default' => '#ffffff'));
        register_setting('erg_settings', 'erg_default_table_row_even', array('default' => '#f8f9fa'));
        register_setting('erg_settings', 'erg_default_table_border', array('default' => '#e9ecef'));
        register_setting('erg_settings', 'erg_default_total_background', array('default' => '#f8f9fa'));
        register_setting('erg_settings', 'erg_default_total_border', array('default' => '#dddddd'));
        register_setting('erg_settings', 'erg_default_primary_text', array('default' => '#333333'));
        register_setting('erg_settings', 'erg_default_secondary_text', array('default' => '#666666'));

        // Typography Settings
        register_setting('erg_settings', 'erg_default_font_family', array('default' => 'system-ui, -apple-system, sans-serif'));
        register_setting('erg_settings', 'erg_default_font_size', array('default' => '14px'));

        // General Section
        add_settings_section(
            'erg_general_section',
            __('General Settings', 'erg-expense-report'),
            array($this, 'general_section_callback'),
            'erg_settings'
        );

        add_settings_field(
            'erg_main_title',
            __('Main Title', 'erg-expense-report'),
            array($this, 'main_title_callback'),
            'erg_settings',
            'erg_general_section'
        );


        add_settings_field(
            'erg_show_footer_branding',
            __('Show Footer Branding', 'erg-expense-report'),
            array($this, 'footer_branding_callback'),
            'erg_settings',
            'erg_general_section'
        );

        // Default Colors Section
        add_settings_section(
            'erg_colors_section',
            __('Default Colors', 'erg-expense-report'),
            array($this, 'colors_section_callback'),
            'erg_settings'
        );

        // Header Colors
        add_settings_field(
            'erg_default_header_background',
            __('Header Background Color', 'erg-expense-report'),
            array($this, 'color_field_callback'),
            'erg_settings',
            'erg_colors_section',
            array('field' => 'erg_default_header_background', 'default' => '#6c757d')
        );

        add_settings_field(
            'erg_default_header_text',
            __('Header Text Color', 'erg-expense-report'),
            array($this, 'color_field_callback'),
            'erg_settings',
            'erg_colors_section',
            array('field' => 'erg_default_header_text', 'default' => '#ffffff')
        );

        // Table Colors
        add_settings_field(
            'erg_default_table_row_odd',
            __('Table Odd Row Background', 'erg-expense-report'),
            array($this, 'color_field_callback'),
            'erg_settings',
            'erg_colors_section',
            array('field' => 'erg_default_table_row_odd', 'default' => '#ffffff')
        );

        add_settings_field(
            'erg_default_table_row_even',
            __('Table Even Row Background', 'erg-expense-report'),
            array($this, 'color_field_callback'),
            'erg_settings',
            'erg_colors_section',
            array('field' => 'erg_default_table_row_even', 'default' => '#f8f9fa')
        );

        add_settings_field(
            'erg_default_table_border',
            __('Table Border Color', 'erg-expense-report'),
            array($this, 'color_field_callback'),
            'erg_settings',
            'erg_colors_section',
            array('field' => 'erg_default_table_border', 'default' => '#e9ecef')
        );

        // Total Section Colors
        add_settings_field(
            'erg_default_total_background',
            __('Total Section Background', 'erg-expense-report'),
            array($this, 'color_field_callback'),
            'erg_settings',
            'erg_colors_section',
            array('field' => 'erg_default_total_background', 'default' => '#f8f9fa')
        );

        add_settings_field(
            'erg_default_total_border',
            __('Total Section Border', 'erg-expense-report'),
            array($this, 'color_field_callback'),
            'erg_settings',
            'erg_colors_section',
            array('field' => 'erg_default_total_border', 'default' => '#dddddd')
        );

        // Text Colors
        add_settings_field(
            'erg_default_primary_text',
            __('Primary Text Color', 'erg-expense-report'),
            array($this, 'color_field_callback'),
            'erg_settings',
            'erg_colors_section',
            array('field' => 'erg_default_primary_text', 'default' => '#333333')
        );

        add_settings_field(
            'erg_default_secondary_text',
            __('Secondary Text Color', 'erg-expense-report'),
            array($this, 'color_field_callback'),
            'erg_settings',
            'erg_colors_section',
            array('field' => 'erg_default_secondary_text', 'default' => '#666666')
        );

        // Typography Section
        add_settings_section(
            'erg_typography_section',
            __('Default Typography', 'erg-expense-report'),
            array($this, 'typography_section_callback'),
            'erg_settings'
        );

        add_settings_field(
            'erg_default_font_family',
            __('Default Font Family', 'erg-expense-report'),
            array($this, 'font_family_callback'),
            'erg_settings',
            'erg_typography_section'
        );

        add_settings_field(
            'erg_default_font_size',
            __('Default Font Size', 'erg-expense-report'),
            array($this, 'font_size_callback'),
            'erg_settings',
            'erg_typography_section'
        );
    }

    public function general_section_callback() {
        echo '<p>' . __('Configure the general settings for the expense report generator.', 'erg-expense-report') . '</p>';
    }

    public function main_title_callback() {
        $value = get_option('erg_main_title', 'Online Free Expense Report Generator');
        echo '<input type="text" id="erg_main_title" name="erg_main_title" value="' . esc_attr($value) . '" class="regular-text" />';
        echo '<p class="description">' . __('The main title displayed at the top of the expense report generator.', 'erg-expense-report') . '</p>';
    }


    public function colors_section_callback() {
        echo '<p>' . __('Set default colors for expense reports. These can be overridden by users in the frontend customization panel.', 'erg-expense-report') . '</p>';
    }

    public function color_field_callback($args) {
        $field = $args['field'];
        $default = $args['default'];
        $value = get_option($field, $default);

        echo '<input type="color" id="' . esc_attr($field) . '" name="' . esc_attr($field) . '" value="' . esc_attr($value) . '" />';
        echo '<input type="text" class="erg-color-text" value="' . esc_attr($value) . '" readonly style="margin-left: 10px; width: 80px;" />';

        echo '<script>
            document.getElementById("' . esc_js($field) . '").addEventListener("change", function() {
                this.nextElementSibling.value = this.value;
            });
        </script>';
    }

    public function typography_section_callback() {
        echo '<p>' . __('Set default typography settings for expense reports.', 'erg-expense-report') . '</p>';
    }

    public function font_family_callback() {
        $value = get_option('erg_default_font_family', 'system-ui, -apple-system, sans-serif');
        $fonts = array(
            'system-ui, -apple-system, sans-serif' => __('System Default', 'erg-expense-report'),
            'Georgia, serif' => __('Georgia', 'erg-expense-report'),
            '"Times New Roman", serif' => __('Times New Roman', 'erg-expense-report'),
            'Arial, sans-serif' => __('Arial', 'erg-expense-report'),
            '"Helvetica Neue", sans-serif' => __('Helvetica', 'erg-expense-report'),
            '"Open Sans", sans-serif' => __('Open Sans', 'erg-expense-report'),
            '"Roboto", sans-serif' => __('Roboto', 'erg-expense-report'),
            '"Lato", sans-serif' => __('Lato', 'erg-expense-report'),
            '"Montserrat", sans-serif' => __('Montserrat', 'erg-expense-report'),
            '"Source Sans Pro", sans-serif' => __('Source Sans Pro', 'erg-expense-report')
        );

        echo '<select id="erg_default_font_family" name="erg_default_font_family">';
        foreach ($fonts as $key => $label) {
            $selected = selected($value, $key, false);
            echo '<option value="' . esc_attr($key) . '" ' . $selected . '>' . esc_html($label) . '</option>';
        }
        echo '</select>';
        echo '<p class="description">' . __('Default font family for expense reports.', 'erg-expense-report') . '</p>';
    }

    public function font_size_callback() {
        $value = get_option('erg_default_font_size', '14px');
        $sizes = array(
            '12px' => '12px',
            '13px' => '13px',
            '14px' => '14px (Default)',
            '15px' => '15px',
            '16px' => '16px',
            '18px' => '18px',
            '20px' => '20px'
        );

        echo '<select id="erg_default_font_size" name="erg_default_font_size">';
        foreach ($sizes as $key => $label) {
            $selected = selected($value, $key, false);
            echo '<option value="' . esc_attr($key) . '" ' . $selected . '>' . esc_html($label) . '</option>';
        }
        echo '</select>';
        echo '<p class="description">' . __('Default font size for expense reports.', 'erg-expense-report') . '</p>';
    }

    public function footer_branding_callback() {
        $value = get_option('erg_show_footer_branding', '1');
        echo '<input type="checkbox" id="erg_show_footer_branding" name="erg_show_footer_branding" value="1" ' . checked(1, $value, false) . ' />';
        echo '<label for="erg_show_footer_branding">' . __('Show "Powered by Taskip" in footer', 'erg-expense-report') . '</label>';
        echo '<p class="description">' . __('Display Taskip branding in the footer of generated PDFs.', 'erg-expense-report') . '</p>';
    }

    public function settings_page() {
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

            <!-- Usage Instructions -->
            <div class="notice notice-info">
                <h3><?php _e('Usage Instructions', 'erg-expense-report'); ?></h3>
                <p><?php _e('Use the shortcode <code>[expense_report_generator]</code> to display the expense report generator on any page or post.', 'erg-expense-report'); ?></p>

                <h4><?php _e('Features:', 'erg-expense-report'); ?></h4>
                <ul>
                    <li>✓ <?php _e('6 different header layout styles (Compact, Standard, Detailed, Modern, Classic, Minimal)', 'erg-expense-report'); ?></li>
                    <li>✓ <?php _e('Company logo upload with localStorage persistence', 'erg-expense-report'); ?></li>
                    <li>✓ <?php _e('Comprehensive color customization for all sections', 'erg-expense-report'); ?></li>
                    <li>✓ <?php _e('Professional PDF export functionality', 'erg-expense-report'); ?></li>
                    <li>✓ <?php _e('Local storage - no data sent to server', 'erg-expense-report'); ?></li>
                    <li>✓ <?php _e('Mobile responsive design', 'erg-expense-report'); ?></li>
                    <li>✓ <?php _e('Drag & drop expense row reordering', 'erg-expense-report'); ?></li>
                    <li>✓ <?php _e('Sortable columns with visual indicators', 'erg-expense-report'); ?></li>
                </ul>
            </div>

            <!-- Settings Form -->
            <form action="options.php" method="post">
                <?php
                settings_fields('erg_settings');
                do_settings_sections('erg_settings');
                submit_button(__('Save Settings', 'erg-expense-report'));
                ?>
            </form>

            <!-- Additional Help -->
            <div class="notice notice-warning">
                <h3><?php _e('Important Notes', 'erg-expense-report'); ?></h3>
                <ul>
                    <li><?php _e('These are default settings. Users can override these values using the frontend customization panel.', 'erg-expense-report'); ?></li>
                    <li><?php _e('User customizations are stored in their browser\'s localStorage and persist across sessions.', 'erg-expense-report'); ?></li>
                    <li><?php _e('Company logos uploaded by users are stored locally in their browser for privacy.', 'erg-expense-report'); ?></li>
                </ul>
            </div>
        </div>
        <?php
    }
}

// Initialize the plugin
ERG_Simple_Expense_Report::get_instance();
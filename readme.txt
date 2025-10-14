=== Free Expense Report Generator ===
Contributors: yourname
Tags: expense, report, generator, currency, pdf, excel, business, accounting
Requires at least: 5.0
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Generate professional expense reports with multi-currency support, customizable themes, and export to PDF/Excel. No registration required.

== Description ==

The **Free Expense Report Generator** is a comprehensive WordPress plugin that allows you and your website visitors to create professional expense reports without any registration or login requirements. Perfect for businesses, freelancers, consultants, and anyone who needs to track and report expenses.

### 🌟 Key Features

**💰 Multi-Currency Support (30+ Currencies)**
* Support for 30+ international currencies including USD, EUR, GBP, JPY, CNY, INR, and more
* Live exchange rates with automatic conversion
* Cryptocurrency support (Bitcoin, Ethereum)
* Proper currency formatting for each region
* Multi-currency expense tracking with base currency conversion

**🎨 Customizable Themes & Headers**
* 6 professional theme presets (Professional, Modern Dark, Minimal, Corporate, Creative, Nature)
* 8 different header styles (Classic, Modern, Minimal, Executive, Creative, Sidebar, Banner, Compact)
* Full color customization
* Typography controls
* Custom logo upload support

**📊 Professional Export Options**
* PDF export with currency formatting and custom themes
* Excel export with formulas and proper formatting
* CSV export for accounting software compatibility
* Print-optimized layouts

**📝 Comprehensive Expense Tracking**
* Date, description, category, merchant, and amount tracking
* 12+ expense categories with icons
* Multiple payment methods support
* Tax calculation and tracking
* Receipt/attachment upload (images and PDFs)
* Notes and additional details

**🔧 Advanced Features**
* Auto-save functionality to prevent data loss
* Responsive design for mobile and tablet
* Real-time currency conversion
* Expense duplication and bulk operations
* Search and filter capabilities
* No registration or login required

**⚡ Performance & Security**
* Fast loading with optimized React components
* All data stored locally in browser (privacy-first approach)
* No external dependencies for core functionality
* WordPress coding standards compliant
* Conflict-free with ERG prefixes on all classes

### 📱 Mobile Responsive

The plugin is fully responsive and works perfectly on:
* Desktop computers
* Tablets
* Mobile phones
* Touch devices

### 🚀 Easy to Use

Simply add the shortcode `[expense_report_generator]` to any page or post, and the expense report generator will appear. No configuration required!

### 🔒 Privacy Focused

* No user registration required
* No data sent to external servers (except exchange rates)
* All expense data stored locally in user's browser
* GDPR compliant
* No tracking or analytics

### 💼 Perfect For

* **Businesses** - Employee expense reporting
* **Freelancers** - Client expense tracking
* **Consultants** - Project expense management
* **Travelers** - Travel expense reporting
* **Small Business Owners** - Business expense tracking
* **Accountants** - Client services
* **Anyone** who needs professional expense reports

== Installation ==

### Automatic Installation

1. Go to your WordPress admin area
2. Navigate to Plugins → Add New
3. Search for "Free Expense Report Generator"
4. Click "Install Now" and then "Activate"
5. Add `[expense_report_generator]` shortcode to any page or post

### Manual Installation

1. Download the plugin ZIP file
2. Go to Plugins → Add New → Upload Plugin
3. Choose the ZIP file and click "Install Now"
4. Activate the plugin
5. Add `[expense_report_generator]` shortcode to any page or post

### Development Setup

For developers who want to customize the plugin:

1. Clone or download the plugin files
2. Run `npm install` to install dependencies
3. Run `npm run build` to compile the React components
4. For development: `npm run dev` to watch for changes

== Frequently Asked Questions ==

= Do users need to register or login? =

No! The expense report generator works without any registration or login. Users can start creating expense reports immediately.

= Is the data stored on my server? =

No, all expense data is stored locally in the user's browser. This ensures privacy and reduces server load. Exchange rates are cached on your server for performance.

= Can I customize the appearance? =

Yes! The plugin includes 6 theme presets and 8 header styles. Users can also customize colors, fonts, and layouts. You can set default options in the plugin settings.

= Which currencies are supported? =

The plugin supports 30+ currencies including:
* Major currencies: USD, EUR, GBP, JPY, CNY, INR, CAD, AUD
* Regional currencies: THB, MYR, PHP, SGD, HKD, KRW, etc.
* Middle Eastern: AED, SAR
* African: ZAR, NGN, EGP
* Cryptocurrencies: BTC, ETH

= Can I export reports? =

Yes! Reports can be exported as:
* PDF with professional formatting
* Excel with formulas and proper currency formatting
* CSV for importing into accounting software

= Is it mobile-friendly? =

Absolutely! The plugin is fully responsive and works perfectly on mobile devices, tablets, and desktops.

= Can I add my company logo? =

Yes, users can upload custom logos for their reports. You can control this feature via shortcode attributes.

= Are exchange rates updated automatically? =

Yes, exchange rates are updated hourly using reliable exchange rate APIs. Rates are cached for performance and have fallback options.

= Can I use multiple instances on one page? =

Yes, you can add multiple shortcodes with different settings on the same page. Each instance works independently.

= Is it compatible with my theme? =

Yes, the plugin uses prefixed CSS classes (erg-*) to avoid conflicts and should work with any properly coded WordPress theme.

== Screenshots ==

1. Main expense form with currency selection
2. Expense list with editing and management options
3. Report preview with professional formatting
4. Theme customization panel
5. PDF export example
6. Mobile responsive design
7. Multi-currency conversion in action
8. Header style options

== Shortcode Usage ==

### Basic Usage
`[expense_report_generator]`

### With Custom Currency
`[expense_report_generator currency="EUR"]`

### With Custom Theme
`[expense_report_generator theme="modern-dark"]`

### Multi-Currency Enabled
`[expense_report_generator multi_currency="true"]`

### Full Customization
`[expense_report_generator currency="USD" theme="professional" header_style="modern" multi_currency="true" show_tax="true" allow_customization="true"]`

### Available Attributes

* `currency` - Default currency (default: USD)
* `theme` - Theme preset (professional, modern-dark, minimal, corporate, creative, nature)
* `header_style` - Header style (classic, modern, minimal, executive, creative, sidebar, banner, compact)
* `allow_customization` - Enable customization panel (true/false, default: true)
* `multi_currency` - Enable multi-currency mode (true/false, default: false)
* `show_tax` - Show tax fields (true/false, default: true)
* `show_logo_upload` - Enable logo upload (true/false, default: true)
* `enable_receipts` - Enable receipt uploads (true/false, default: true)
* `auto_save` - Enable auto-save (true/false, default: true)
* `max_width` - Maximum width of the generator (default: 1200px)

== Changelog ==

= 1.0.0 =
* Initial release
* Multi-currency support with 30+ currencies
* 6 theme presets and 8 header styles
* PDF, Excel, and CSV export
* Responsive design
* Auto-save functionality
* Receipt upload support
* Tax calculation
* Live exchange rates
* No registration required
* Privacy-focused local storage

== Upgrade Notice ==

= 1.0.0 =
Initial release of the Free Expense Report Generator plugin.

== Support ==

For support, feature requests, or bug reports, please visit:
* Plugin support forum on WordPress.org
* GitHub repository: [Add your GitHub URL]
* Documentation: [Add your documentation URL]

== Privacy Policy ==

This plugin is designed with privacy in mind:
* No user data is sent to external servers except for exchange rate updates
* All expense data is stored locally in the user's browser
* No tracking or analytics
* No user registration required
* Exchange rates are cached on your server with no personal data
* Uploaded receipts are stored locally and not transmitted

== Technical Requirements ==

* WordPress 5.0 or higher
* PHP 7.4 or higher
* Modern web browser with JavaScript enabled
* Internet connection for exchange rate updates (optional)

== Credits ==

* Exchange rates provided by exchangerate-api.com
* Icons and emojis for visual enhancement
* React.js for the user interface
* jsPDF for PDF generation
* SheetJS for Excel export

== License ==

This plugin is licensed under the GPL v2 or later.

You are free to use, modify, and distribute this plugin according to the GPL license terms.
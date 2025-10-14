# Free Expense Report Generator - Installation & Setup Guide

## 📋 Complete WordPress Plugin Features

✅ **WordPress Integration**
- Complete WordPress plugin with proper headers and ERG prefixes
- Admin panel with settings and usage examples
- Shortcode `[expense_report_generator]` with customizable attributes
- AJAX integration for exchange rates
- WordPress coding standards compliant

✅ **Currency System (30+ Currencies)**
- Support for 30+ international currencies with proper formatting
- Live exchange rate API with caching and fallback
- Multi-currency conversion utilities
- Popular currencies quick selection
- Cryptocurrency support (Bitcoin, Ethereum)

✅ **React Application Components**
- Main App with tabbed interface and auto-save
- Expense Form with currency-aware inputs and validation
- Expense List with sorting, filtering, and bulk operations
- Currency Manager with conversion calculator
- Theme Customizer with 6 presets and custom theme builder
- Header Style Selector with 8 different layout options
- Export Buttons with PDF, Excel, CSV generation
- Report Preview with multiple view modes

✅ **Professional Styling**
- Comprehensive CSS with ERG prefixes (conflict-free)
- 6 theme variants (Professional, Modern Dark, Minimal, Corporate, Creative, Nature)
- Responsive design for mobile, tablet, desktop
- Print-optimized styles
- Dark mode support

✅ **Export Functionality**
- PDF export with professional formatting and themes
- Excel export with formulas and multiple sheets
- CSV export for accounting software compatibility
- Currency formatting in all export formats
- Multi-currency reports with conversion details

✅ **Build System**
- Complete webpack configuration for React compilation
- Babel configuration for modern JavaScript
- Development and production build scripts
- Code splitting and optimization

## 🚀 Installation Instructions

### Option 1: WordPress Admin (Recommended)
1. Download the plugin ZIP file
2. Go to WordPress Admin → Plugins → Add New
3. Click "Upload Plugin" and select the ZIP file
4. Install and activate the plugin
5. Build the React components (see Build Instructions below)

### Option 2: Manual Installation
1. Upload the plugin folder to `/wp-content/plugins/`
2. Activate the plugin in WordPress Admin
3. Build the React components (see Build Instructions below)

## 🔧 Build Instructions

The plugin requires building the React components:

```bash
# Navigate to plugin directory
cd /path/to/wp-content/plugins/expense-report-generator/

# Install dependencies
npm install

# Build for production
npm run build

# OR for development with watching
npm run dev
```

### Required Dependencies
All dependencies are listed in `package.json`:
- React 18.2.0
- Webpack 5+ with Babel
- CSS and style loaders
- Development tools

### Build Output
- Main JavaScript: `assets/js/erg-expense-report-app.js`
- Compiled CSS: `assets/css/erg-expense-report.css`

## 📖 Usage

### Basic Shortcode
```wordpress
[expense_report_generator]
```

### Advanced Shortcodes
```wordpress
<!-- With custom currency -->
[expense_report_generator currency="EUR"]

<!-- With custom theme -->
[expense_report_generator theme="modern-dark"]

<!-- Multi-currency enabled -->
[expense_report_generator multi_currency="true"]

<!-- Full customization -->
[expense_report_generator
    currency="USD"
    theme="professional"
    header_style="modern"
    multi_currency="true"
    show_tax="true"
    allow_customization="true"
    max_width="1200px"
]
```

### Available Shortcode Attributes

| Attribute | Options | Default | Description |
|-----------|---------|---------|-------------|
| `currency` | USD, EUR, GBP, JPY, CNY, etc. | USD | Default currency |
| `theme` | professional, modern-dark, minimal, corporate, creative, nature | professional | Theme preset |
| `header_style` | classic, modern, minimal, executive, creative, sidebar, banner, compact | classic | Header layout |
| `allow_customization` | true/false | true | Enable customization panel |
| `multi_currency` | true/false | false | Enable multi-currency mode |
| `show_tax` | true/false | true | Show tax fields |
| `show_logo_upload` | true/false | true | Enable logo upload |
| `enable_receipts` | true/false | true | Enable receipt uploads |
| `auto_save` | true/false | true | Enable auto-save |
| `max_width` | CSS width value | 1200px | Maximum width |

## ⚙️ Plugin Settings

Access settings via WordPress Admin → Expense Reports → Settings:

- **Default Currency**: Set site-wide default currency
- **Default Theme**: Choose default theme for all instances
- **Cache Exchange Rates**: Enable/disable rate caching (recommended)
- **Exchange Rate Provider**: Configure API settings

## 🌐 Supported Currencies

**Major Currencies:**
- USD (US Dollar), EUR (Euro), GBP (British Pound)
- JPY (Japanese Yen), CNY (Chinese Yuan), INR (Indian Rupee)
- CAD (Canadian Dollar), AUD (Australian Dollar), CHF (Swiss Franc)

**Regional Currencies:**
- SGD, HKD, KRW, MXN, BRL, RUB, ZAR, AED, SAR
- THB, MYR, PHP, IDR, VND, TRY, NGN, EGP, PKR, BDT

**Cryptocurrencies:**
- BTC (Bitcoin), ETH (Ethereum)

## 🎨 Available Themes

1. **Professional Blue** - Clean, professional design for business
2. **Modern Dark** - Sleek dark theme with modern typography
3. **Minimal Clean** - Simple design focused on content
4. **Corporate Gray** - Traditional corporate styling
5. **Creative Gradient** - Vibrant design with gradient elements
6. **Nature Green** - Eco-friendly green theme

## 📄 Header Styles

1. **Classic** - Traditional header with logo and contact info
2. **Modern** - Clean, centered design
3. **Minimal** - Simple inline layout
4. **Executive** - Two-column professional layout
5. **Creative** - Asymmetric design with patterns
6. **Sidebar** - Vertical sidebar layout
7. **Banner** - Full-width banner style
8. **Compact** - Space-saving single line

## 📊 Export Formats

**PDF Export:**
- Professional formatting with themes
- Company logos and headers
- Currency formatting
- Multi-page support

**Excel Export:**
- Multiple worksheets (Expenses, Summary, Currency Breakdown)
- Formulas and calculations
- Proper currency formatting
- Ready for further analysis

**CSV Export:**
- Compatible with accounting software
- Proper encoding for international characters
- Customizable field inclusion

## 🔒 Privacy & Security

- **Privacy-First**: All expense data stored locally in browser
- **No Registration**: Works without user accounts
- **GDPR Compliant**: No personal data sent to servers
- **Secure**: Exchange rates only external API call
- **WordPress Standards**: Follows WordPress security practices

## 🛠️ Troubleshooting

### Common Issues:

**1. "React app not loading"**
- Ensure you've run `npm install` and `npm run build`
- Check browser console for JavaScript errors
- Verify WordPress is loading the assets

**2. "Exchange rates not updating"**
- Check internet connection
- Verify API settings in WordPress admin
- Clear WordPress cache if using caching plugins

**3. "Styles not applying correctly"**
- Clear browser cache
- Check for theme conflicts
- Ensure CSS file is loading properly

**4. "Export not working"**
- Check browser console for errors
- Ensure popup blockers aren't interfering
- Try different export formats

### Debug Mode:
Add this to wp-config.php for debugging:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

## 📞 Support & Development

**For Support:**
- Check WordPress.org plugin support forum
- Review documentation and troubleshooting guide
- Submit issues with detailed error information

**For Developers:**
- All code follows WordPress coding standards
- ERG prefixes prevent conflicts
- Modular React architecture for easy customization
- Well-documented code with comments

## 🔄 Updates

The plugin includes:
- Automatic update notifications
- Database migration handling
- Backward compatibility maintenance
- Feature enhancement pipeline

---

## 📝 Quick Start Checklist

1. ✅ Install and activate the plugin
2. ✅ Run `npm install` and `npm run build`
3. ✅ Add `[expense_report_generator]` to a page
4. ✅ Test the functionality
5. ✅ Configure settings in WordPress admin
6. ✅ Customize themes and currencies as needed

**Congratulations! Your Free Expense Report Generator is ready to use! 🎉**
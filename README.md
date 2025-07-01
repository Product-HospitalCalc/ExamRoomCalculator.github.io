# Healthcare Capacity Calculator

A comprehensive web-based calculator for healthcare facilities to forecast capacity needs, optimize resource allocation, and plan for future growth in patient volumes.

## 🏥 Overview

The Healthcare Capacity Calculator helps medical facilities determine optimal staffing levels, exam room requirements, and resource utilization based on projected patient volumes and operational parameters. It provides two calculation approaches:

1. **Room Utilization Driven**: Calculates capacity based on target room utilization rates
2. **Provider Productivity Driven**: Calculates capacity based on provider productivity targets

## ✨ Features

- **Multi-year projections** (2024-2034) with customizable growth rates
- **Dual volume scenarios**: Average volume and peak month volume calculations
- **Interactive data visualization** with charts and graphs
- **Real-time calculations** as parameters are adjusted
- **Excel import/export** functionality for data management
- **Responsive design** with modern UI/UX
- **Animation effects** for enhanced user experience

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (for local development) or hosting platform

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/healthcare-calculator.git
cd healthcare-calculator
```

2. Open `index.html` in your web browser or serve through a local web server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

3. Navigate to `http://localhost:8000` in your browser

## 📊 Usage

### Input Parameters

Configure the following throughput assumptions:

- **Annual Growth Target**: Expected annual growth rate (e.g., 1.6%)
- **Average Clinic Visit Time**: Duration per patient visit in minutes
- **Clinic Operation Days**: Number of operational days per year
- **Clinic Operation Hours**: Daily operational hours
- **Current Exam Rooms per Provider**: Existing room-to-provider ratio
- **Patient Visits**: Current annual patient volume
- **Peak Month Volume**: Highest monthly patient volume
- **Provider Productivity**: Current and target productivity rates

### Year Selection

- Select individual years using the year buttons
- Use "Show All Years" toggle for complete projections
- Maximum of 11 years can be selected simultaneously

### Output Tables

The calculator generates four output tables:

1. **Room Utilization - Average Volume**: Standard capacity projections
2. **Room Utilization - Peak Volume**: Peak period capacity requirements
3. **Provider Productivity - Average Volume**: Productivity-based projections
4. **Provider Productivity - Peak Volume**: Peak period productivity requirements

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js with data labels plugin
- **Excel Processing**: SheetJS (xlsx)
- **Icons**: Font Awesome
- **Styling**: Custom CSS with animations and transitions

## 📁 Project Structure

```
healthcare-calculator/
├── index.html              # Main HTML file
├── calculator.css          # Main stylesheet
├── calculator.js           # Core calculation logic
├── chart.js               # Chart configuration and updates
├── pieChart.js            # Pie chart implementation
├── donnutChart.js         # Donut chart implementation
├── export.js              # Excel export functionality
├── excelDataImporter.js   # Excel import functionality
├── n8nIntegration.js      # External integration support
└── README.md              # Project documentation
```

## 🎯 Key Calculations

### Room Utilization Method
- **Rooms Needed** = ⌈(Daily Visits × Provider Count) / Room Occupancy Rate⌉
- **Providers Needed** = ⌈Daily Visits / (Productivity × Hours per Day)⌉

### Provider Productivity Method
- **Providers Needed** = ⌈Annual Visits / (Productivity × Hours × Days)⌉
- **Rooms per Provider** = ⌈(Visit Time × Productivity) / (60 × Utilization Rate)⌉

## 🔧 Customization

### Adding New Parameters
1. Add input field in `index.html`
2. Create corresponding variable in `calculator.js`
3. Update calculation functions to include new parameter
4. Modify output tables if needed

### Styling Modifications
- Edit `calculator.css` for visual changes
- Modify chart configurations in respective chart files
- Update animations and transitions as needed

## 📈 Data Export/Import

### Excel Export
- Click export button to download results as Excel file
- Includes all calculated data and parameters
- Formatted for easy analysis and reporting

### Excel Import
- Upload Excel file with predefined format
- Automatically populates input parameters
- Validates data before import

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

## 🔮 Future Enhancements

- [ ] Multi-facility support
- [ ] Advanced reporting features
- [ ] Database integration
- [ ] Mobile application
- [ ] API endpoints for external integrations
- [ ] Advanced analytics and forecasting
- [ ] User authentication and role management

**Built with ❤️ for healthcare professionals**

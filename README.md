# Medical Document Generator

A modern React.js application that generates realistic medical documents and reports using AI-powered data generation. This application creates professional healthcare documents and exports them to high-quality PDF files.

## Features

- **AI-Powered Data Generation**: Uses Azure OpenAI to generate realistic, clinically coherent medical data
- **Multiple Document Types**: 
  - Medical Records Reports
  - CMS-1500 Insurance Claim Forms
  - Insurance Policy Documents
  - Visit Report Documents
  - Medication History Reports
  - Laboratory Reports (various test types)
- **Three-Step Workflow**:
  1. Generate Data - AI-powered or faker-based generation
  2. Edit Data - Review and modify generated data
  3. Export PDF - Download high-quality PDF documents
- **Professional PDF Export**: Uses jsPDF with html2canvas for high-quality PDF generation
- **Customizable Settings**: Adjust data complexity, font families, quality levels, and watermarks
- **Analytics Integration**: Google Analytics 4 support for tracking user behavior and app usage
- **Responsive Design**: Works on desktop and mobile devices
- **TypeScript & Zod Validation**: Type-safe data structures with runtime validation
- **GitHub Pages Deployment**: Automated deployment workflow included

## Live Demo

Visit the live application: [https://huangyingting.github.io/docgen](https://huangyingting.github.io/docgen)

## Technologies Used

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **jsPDF** - PDF generation library
- **html2canvas** - HTML to canvas conversion for PDF export
- **Azure OpenAI** - AI-powered realistic data generation
- **Zod** - Runtime schema validation
- **Faker.js** - Fallback data generation
- **CSS3** - Modern styling with gradients and animations

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- (Optional) Azure OpenAI account for AI-powered data generation

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd docgen
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure Azure OpenAI for AI-powered data generation:
   - The application will prompt you to configure Azure OpenAI settings when you first use AI generation
   - Alternatively, you can store credentials in browser localStorage:
     - `azureOpenAI.endpoint`: Your Azure OpenAI endpoint URL
     - `azureOpenAI.apiKey`: Your Azure OpenAI API key
     - `azureOpenAI.deploymentName`: Your deployment name

4. Start the development server:
   ```bash
   npm run dev
   ```
   Or:
   ```bash
   npm start
   ```

5. Open your browser and visit:
   ```
   http://localhost:5173
   ```

## Usage

### Step 1: Generate Data

1. Select your preferred data generation method:
   - **AI-Powered Generation**: Uses Azure OpenAI for realistic, clinically coherent data
   - **Faker-Based Generation**: Uses Faker.js for quick random data generation

2. Configure generation options:
   - **Complexity Level**: Simple, Medium, or Complex
   - **Number of Visits**: How many medical visits to generate
   - **Number of Lab Tests**: How many laboratory tests to include
   - **Secondary Insurance**: Whether to include secondary insurance

3. Click **"Generate with AI"** or **"Generate with Faker"**

### Step 2: Edit Data

1. Review the generated medical data across different tabs:
   - Patient information
   - Provider information
   - Insurance details
   - Medical history
   - Visit notes
   - Medications
   - Lab reports

2. Edit any field directly in the JSON editor
3. Click **"Next: Export PDF"** when ready

### Step 3: Export PDF

1. Select document type:
   - Medical Records Report (comprehensive)
   - CMS-1500 Form (insurance claim)
   - Insurance Policy Document
   - Visit Report
   - Medication History
   - Laboratory Report

2. Configure export settings:
   - **Export Format**: PDF or Canvas (image)
   - **Quality Level**: Poor, Standard, or High
   - **Font Family**: Choose from 18 professional fonts
   - **Watermark**: Enable/disable watermark

3. Click **"Download PDF"** to export the document

### PDF Export Features

- **High Quality**: Configurable quality levels for crisp output
- **Professional Layout**: Medical document templates with proper formatting
- **Print-Ready**: Optimized for A4/Letter paper sizes
- **Watermark Support**: Optional watermarks for draft documents
- **Cross-Browser Compatible**: Works in all modern browsers

## Project Structure

```
src/
├── components/              # UI Components
│   ├── GenerateDataStep.tsx      # Step 1: Data generation UI
│   ├── EditDataStep.tsx          # Step 2: Data editing UI
│   ├── ExportPdfStep.tsx         # Step 3: PDF export UI
│   ├── ProgressIndicator.tsx     # Workflow progress indicator
│   ├── DocumentCard.tsx          # Document type selector
│   └── AzureConfigModal.tsx      # Azure OpenAI configuration
├── reports/                 # Medical Document Templates
│   ├── medicalRecords/          # Comprehensive medical records
│   ├── cms1500/                 # CMS-1500 insurance claim form
│   ├── insurancePolicy/         # Insurance policy documents
│   ├── visitReport/             # Visit report documents
│   ├── medicationHistory/       # Medication history reports
│   └── labReport/               # Laboratory reports
├── utils/                   # Utility Functions
│   ├── aiDataGenerator.ts       # Azure OpenAI data generation
│   ├── dataGenerator.ts         # Faker.js data generation
│   ├── zodSchemas.ts            # Zod schema definitions
│   ├── jsonSchemaGenerator.ts   # JSON schema utilities
│   ├── pdfExport.ts             # PDF export functionality
│   ├── watermark.ts             # Watermark generation
│   ├── cache.ts                 # Caching utilities
│   └── azureConfigStorage.ts    # Azure config management
├── App.tsx                  # Main application component
├── App.css                  # Application styles
└── index.tsx                # Application entry point
```

## Key Functions

### AI Data Generator (`src/utils/aiDataGenerator.ts`)

AI-powered medical data generation using Azure OpenAI:
- **`generatePatientWithAI(config, complexity, cache?)`** - Generate realistic patient information
- **`generateProviderWithAI(config, complexity, cache?)`** - Generate healthcare provider data
- **`generateInsuranceWithAI(config, complexity, includeSecondary?, cache?)`** - Generate insurance information
- **`generateMedicalHistoryWithAI(config, patient, complexity, cache?)`** - Generate medical history
- **`generateVisitReportsWithAI(config, patient, provider, numVisits, complexity, cache?)`** - Generate visit notes
- **`generateLabReportsWithAI(config, patient, numTests, complexity, cache?)`** - Generate lab reports
- **`generateClaimInfoWithAI(config, patient, provider, insurance, complexity, cache?)`** - Generate CMS-1500 claim form

### Data Generator (`src/utils/dataGenerator.ts`)

Faker.js-based data generation for quick testing:
- Similar functions as AI generator but using Faker.js
- Faster generation but less clinically coherent

### PDF Export Utilities (`src/utils/pdfExport.ts`)

- **`exportToPDF(elementId, filename, options)`** - Export HTML element to PDF
- **`exportToPDFAsImage(elementId, filename, options)`** - Export as canvas image
- **`createWatermarkedCanvas(canvas, watermarkOptions)`** - Add watermark to canvas

### Schema Validation (`src/utils/zodSchemas.ts`)

Type-safe data structures with Zod schemas:
- Patient, Provider, Insurance, Medical History schemas
- Visit Reports, Lab Reports, Medication schemas
- CMS-1500 claim form schemas
- Runtime validation with detailed error messages

## Customization

### Adding New Document Types

1. Create a new component in `src/reports/<documentType>/`
2. Add the document template with appropriate styling
3. Update the `ReportType` union type in `src/App.tsx`
4. Add a case in the document rendering switch statement
5. Optionally add Zod schemas in `src/utils/zodSchemas.ts`

### Configuring AI Generation

Azure OpenAI configuration can be customized:
- **Model Parameters**: Temperature, max tokens, etc. in `aiDataGenerator.ts`
- **Caching**: Configure cache TTL and storage in `cache.ts`
- **Complexity Levels**: Adjust prompts for different complexity levels

### Setting Up Analytics

To track user behavior and app usage with Google Analytics 4:

1. Follow the detailed setup guide in `ANALYTICS_SETUP.md`
2. Get your GA4 Measurement ID from Google Analytics
3. Update `public/index.html` with your Measurement ID (replace `G-XXXXXXXXXX`)
4. Deploy your app to start collecting analytics

See `ANALYTICS_USAGE.md` for examples of adding custom tracking events.

### Modifying PDF Options

Quality levels are defined in `src/App.tsx` and `src/utils/pdfExport.ts`:

```typescript
const qualitySettings = {
  poor: { scale: 1, quality: 0.5 },
  standard: { scale: 2, quality: 0.85 },
  high: { scale: 3, quality: 0.98 }
};
```

### Styling Documents for PDF

Medical document CSS includes print-specific styling. Key considerations:

- Use absolute units (pt, px) for precise PDF layout
- Avoid CSS transforms and complex animations
- Test with different page sizes (A4, Letter)
- Ensure sufficient contrast for printing
- Use web-safe fonts or embed custom fonts

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Performance Tips

### AI Generation
- AI generation may take 10-30 seconds depending on complexity and data volume
- Use caching to avoid regenerating the same data
- Faker-based generation is much faster for testing purposes
- Consider lower complexity levels for faster generation

### PDF Export
- Large documents may take a few seconds to render
- Higher quality settings increase processing time significantly
- Standard quality (scale: 2) provides good balance
- Canvas format exports are faster than PDF for simple use cases

## Troubleshooting

### Common Issues

1. **AI generation fails**: 
   - Verify Azure OpenAI credentials are correct
   - Check deployment name matches your Azure setup
   - Ensure API endpoint includes proper protocol (https://)
   - Check browser console for detailed error messages

2. **PDF generation fails**: 
   - Ensure the target element has a proper ID and is visible
   - Check browser console for rendering errors
   - Try lower quality settings if browser runs out of memory

3. **Poor quality output**: 
   - Increase quality level to "High"
   - Try different font families (some render better than others)
   - Ensure sufficient screen resolution

4. **Large file sizes**: 
   - Reduce quality level to "Standard" or "Poor"
   - Use canvas format instead of PDF for smaller files
   - Simplify document complexity

5. **Data validation errors**:
   - Check Zod schema definitions match your data structure
   - Review console for detailed validation error messages
   - Ensure all required fields are populated

### Console Debugging

The application logs detailed information to the browser console:
- AI generation requests and responses
- Data validation results
- PDF generation progress
- Cache hit/miss information

## License

This project is open source and available under the MIT License.

## Development Scripts

```bash
# Start development server
npm run dev
npm start

# Build for production
npm run build

# Preview production build
npm preview

# Generate favicon
npm run generate:favicon

# Run AI data generator tests
npm run test:ai
npm run test:ai:mock
```

## Deployment

This application can be deployed to GitHub Pages or any static hosting service.

### GitHub Pages Deployment

1. Update `homepage` in `package.json` to match your repository:
   ```json
   "homepage": "https://<username>.github.io/<repo-name>"
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. Deploy the `dist` folder to GitHub Pages

The application will be available at: `https://huangyingting.github.io/docgen`

### Environment Variables

For production deployment with AI features:
- Store Azure OpenAI credentials securely (not in git)
- Configure through the application UI on first use
- Credentials are stored in browser localStorage

## Testing

The project includes tests for AI data generation:

```bash
# Run tests with real Azure OpenAI (requires configuration)
npm run test:ai

# Run tests with mocked responses
npm run test:ai:mock
```

## Security Considerations

- **API Keys**: Never commit Azure OpenAI API keys to version control
- **Local Storage**: Credentials are stored in browser localStorage (client-side only)
- **Data Privacy**: All medical data is generated synthetically and is not real
- **HIPAA Compliance**: This is a demonstration tool and should not be used with real patient data

## Contributing

Contributions are welcome! Please feel free to submit issues, fork the repository, and create pull requests for:
- New medical document templates
- Additional data generation features
- UI/UX improvements
- Bug fixes and optimizations
- Documentation enhancements

---

**Note**: This application demonstrates AI-powered medical document generation using Azure OpenAI and professional PDF export capabilities. The generated medical data is entirely synthetic and intended for demonstration, testing, and training purposes only. Do not use this tool with real patient information.

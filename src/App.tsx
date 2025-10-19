import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CheckIcon from '@mui/icons-material/Check';
import theme from './theme';
import * as commonStyles from './styles/commonStyles';

// Import components
import GenerateDataStep from './components/GenerateDataStep';
import EditDataStep from './components/EditDataStep';
import ExportPdfStep from './components/ExportPdfStep';

// Import analytics
import { trackEvent, AnalyticsEvents } from './utils/analytics';

import MedicalRecordsReport from './reports/medicalRecords/MedicalRecordsReport';
import CMS1500Form from './reports/cms1500/CMS1500Form';
import InsurancePolicyDocument from './reports/insurancePolicy/InsurancePolicyDocument';
import VisitReportDocument from './reports/visitReport/VisitReportDocument';
import MedicationHistoryDocument from './reports/medicationHistory/MedicationHistoryDocument';
import LaboratoryReportDocument from './reports/labReport/LabReportDocument';
import PassportDocument from './reports/passport/PassportDocument';
import W2Form from './reports/w2/W2Form.tsx';
import {
  VisitReport,
  LabReport,
  LabTestType,
  GenerationOptions,
  GeneratedData
} from './utils/zodSchemas';

// Import utilities
import {
  exportToPDF,
  exportToPDFAsImage,
} from './utils/pdfExport';

interface FontFamily {
  value: string;
  label: string;
  css: string;
}

type QualityLevel = 'poor' | 'standard' | 'high';
type ExportFormat = 'pdf' | 'canvas';
type ReportType = 'medical' | 'cms1500' | 'insurancePolicy' | 'visitReport' | 'medicationHistory' | 'passport' | 'w2' | LabTestType;

function App() {
  // Workflow state management
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
  const [generationOptions, setGenerationOptions] = useState<Required<GenerationOptions>>({
    complexity: 'medium',
    numberOfVisits: 3,
    numberOfLabTests: 5,
    includeSecondaryInsurance: true
  });

  // Keep generationOptions for future use (e.g., regenerating data)
  console.log('Current generation options:', generationOptions);
  const [activeReportType, setActiveReportType] = useState<ReportType>('medical');

  // Export settings
  const [loadingReportType, setLoadingReportType] = useState<ReportType | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [qualityLevel, setQualityLevel] = useState<QualityLevel>('standard');
  const [fontFamily, setFontFamily] = useState<string>('Times New Roman');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [enableWatermark, setEnableWatermark] = useState<boolean>(false);

  // Available font families for the report
  const fontFamilies: FontFamily[] = [
    { value: 'Times New Roman', label: 'Times New Roman', css: "'Times New Roman', serif" },
    { value: 'Arial', label: 'Arial', css: "'Arial', sans-serif" },
    { value: 'Helvetica', label: 'Helvetica', css: "'Helvetica', 'Arial', sans-serif" },
    { value: 'Georgia', label: 'Georgia', css: "'Georgia', serif" },
    { value: 'Verdana', label: 'Verdana', css: "'Verdana', sans-serif" },
    { value: 'Calibri', label: 'Calibri', css: "'Calibri', sans-serif" },
    { value: 'Courier New', label: 'Courier New', css: "'Courier New', monospace" },
    { value: 'Trebuchet MS', label: 'Trebuchet MS', css: "'Trebuchet MS', sans-serif" },
    { value: 'Palatino', label: 'Palatino', css: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" },
    { value: 'Garamond', label: 'Garamond', css: "'Garamond', serif" },
    { value: 'Bookman', label: 'Bookman', css: "'Bookman Old Style', serif" },
    { value: 'Comic Sans MS', label: 'Comic Sans MS', css: "'Comic Sans MS', cursive" },
    { value: 'Candara', label: 'Candara', css: "'Candara', sans-serif" },
    { value: 'Tahoma', label: 'Tahoma', css: "'Tahoma', sans-serif" },
    { value: 'Cambria', label: 'Cambria', css: "'Cambria', serif" },
    { value: 'Consolas', label: 'Consolas', css: "'Consolas', monospace" },
    { value: 'Lucida Sans', label: 'Lucida Sans', css: "'Lucida Sans Unicode', 'Lucida Grande', sans-serif" },
    { value: 'Century Gothic', label: 'Century Gothic', css: "'Century Gothic', sans-serif" }
  ];

  // Step navigation handlers
  const handleDataGenerated = (
    data: GeneratedData,
    options: Required<GenerationOptions>
  ) => {
    setGeneratedData(data);
    setGenerationOptions(options);
    
    // Track data generation
    trackEvent(AnalyticsEvents.GENERATE_DATA_COMPLETED, {
      complexity: options.complexity,
      numberOfVisits: options.numberOfVisits,
      numberOfLabTests: options.numberOfLabTests,
      includeSecondaryInsurance: options.includeSecondaryInsurance,
    });
  };

  const handleDataUpdated = (updatedData: GeneratedData) => {
    setGeneratedData(updatedData);
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      
      // Track step completion
      trackEvent(AnalyticsEvents.STEP_COMPLETED, {
        step: currentStep,
        nextStep: currentStep + 1,
      });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleExportPDF = async (reportType: ReportType, filename: string) => {
    if (!generatedData) {
      alert('Please generate medical data first.');
      return;
    }

    setLoadingReportType(reportType);
    
    // Track export start
    trackEvent(AnalyticsEvents.EXPORT_PDF_STARTED, {
      reportType,
      format: exportFormat,
      quality: qualityLevel,
      watermark: enableWatermark,
    });
    
    try {
      // Check if it's a lab test type
      const labTestTypes: LabTestType[] = ['CBC', 'BMP', 'CMP', 'Urinalysis', 'Lipid', 'LFT', 'Thyroid', 'HbA1c', 'Coagulation', 'Microbiology', 'Pathology', 'Hormone', 'Infectious'];
      const isLabTest = labTestTypes.includes(reportType as LabTestType);

      const elementId = reportType === 'cms1500' ? 'cms1500-report'
        : reportType === 'insurancePolicy' ? 'insurance-policy-report'
          : reportType === 'visitReport' ? 'visit-report-document'
            : reportType === 'medicationHistory' ? 'medication-history-document'
              : reportType === 'passport' ? 'passport-report'
                : reportType === 'w2' ? 'w2-report'
                  : isLabTest ? `laboratory-report-${(reportType as string).toLowerCase()}`
                    : 'medical-records-report';

      if (exportFormat === 'canvas') {
        await exportToPDFAsImage(elementId, `${filename}-canvas`, {
          qualityLevel: qualityLevel
        }, enableWatermark);
        alert(`${filename}-canvas.pdf has been downloaded successfully!`);
      } else {
        await exportToPDF(elementId, filename, {}, enableWatermark);
        alert(`${filename}.pdf has been downloaded successfully!`);
      }
      
      // Track successful export
      trackEvent(AnalyticsEvents.EXPORT_PDF_COMPLETED, {
        reportType,
        format: exportFormat,
        quality: qualityLevel,
        watermark: enableWatermark,
      });
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
      
      // Track export failure
      trackEvent(AnalyticsEvents.EXPORT_PDF_FAILED, {
        reportType,
        format: exportFormat,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoadingReportType(null);
    }
  };

  const handlePreview = (reportType: ReportType = 'medical') => {
    if (!generatedData) {
      alert('Please generate medical data first.');
      return;
    }
    setActiveReportType(reportType);
    
    // Track report type change
    trackEvent(AnalyticsEvents.REPORT_TYPE_CHANGED, {
      reportType,
    });
    setShowPreview(true);
  };

  const renderActiveReport = () => {
    if (!generatedData) {
      return <div>No medical data available. Please generate data first.</div>;
    }

    const selectedFont = fontFamilies.find(font => font.value === fontFamily);
    const fontFamilyStyle = selectedFont ? selectedFont.css : "'Arial', sans-serif";

    if (activeReportType === 'cms1500') {
      return (
        <CMS1500Form
          individual={generatedData.individual}
          insuranceInfo={generatedData.insuranceInfo}
          provider={generatedData.provider}
          claimInfo={generatedData.claimInfo}
          fontFamily={fontFamilyStyle}
        />
      );
    }

    if (activeReportType === 'insurancePolicy') {
      return (
        <InsurancePolicyDocument
          individual={generatedData.individual}
          insuranceInfo={generatedData.insuranceInfo}
          fontFamily={fontFamilyStyle}
        />
      );
    }

    if (activeReportType === 'visitReport') {
      return generatedData.visitReports.length > 0 ? (
        <VisitReportDocument
          individual={generatedData.individual}
          provider={generatedData.provider}
          visitReport={generatedData.visitReports[0]}
          fontFamily={fontFamilyStyle}
        />
      ) : null;
    }

    if (activeReportType === 'medicationHistory') {
      return (
        <MedicationHistoryDocument
          individual={generatedData.individual}
          provider={generatedData.provider}
          medicalHistory={generatedData.medicalHistory}
          fontFamily={fontFamilyStyle}
        />
      );
    }

    if (activeReportType === 'passport') {
      return (
        <PassportDocument
          individual={generatedData.individual}
          passport={generatedData.passport}
          fontFamily={fontFamilyStyle}
        />
      );
    }

    if (activeReportType === 'w2') {
      return (
        <W2Form
          individual={generatedData.individual}
          w2={generatedData.w2}
          fontFamily={fontFamilyStyle}
        />
      );
    }

    // Check if it's a laboratory report type
    const labTestTypes: LabTestType[] = ['CBC', 'BMP', 'CMP', 'Urinalysis', 'Lipid', 'LFT', 'Thyroid', 'HbA1c', 'Coagulation', 'Microbiology', 'Pathology', 'Hormone', 'Infectious'];
    if (labTestTypes.includes(activeReportType as LabTestType)) {
      const labData = generatedData.labReports.find(report => report.testType === activeReportType);
      return labData ? (
        <LaboratoryReportDocument
          individual={generatedData.individual}
          labReport={labData}
          fontFamily={fontFamilyStyle}
        />
      ) : null;
    }

    return (
      <MedicalRecordsReport
        individual={generatedData.individual}
        provider={generatedData.provider}
        insuranceInfo={generatedData.insuranceInfo}
        labReports={generatedData.labReports}
        visitReports={generatedData.visitReports}
        medicalHistory={generatedData.medicalHistory}
        fontFamily={fontFamilyStyle}
      />
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GenerateDataStep
            onDataGenerated={handleDataGenerated}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <EditDataStep
            generatedData={generatedData}
            onDataUpdated={handleDataUpdated}
            onNext={handleNextStep}
            onBack={handlePreviousStep}
          />
        );
      case 3:
        return (
          <ExportPdfStep
            generatedData={generatedData}
            exportFormat={exportFormat}
            setExportFormat={setExportFormat}
            qualityLevel={qualityLevel}
            setQualityLevel={setQualityLevel}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            fontFamilies={fontFamilies}
            enableWatermark={enableWatermark}
            setEnableWatermark={setEnableWatermark}
            onPreview={handlePreview}
            onExport={handleExportPDF}
            onBack={handlePreviousStep}
            loadingReportType={loadingReportType}
          />
        );
      default:
        return null;
    }
  };

  // Helper function to get report titles
  const getReportTitle = (reportType: ReportType): string => {
    const labTitles: Record<string, string> = {
      'CBC': 'Complete Blood Count (CBC)',
      'BMP': 'Basic Metabolic Panel',
      'CMP': 'Comprehensive Metabolic Panel',
      'Urinalysis': 'Urinalysis',
      'Lipid': 'Lipid Profile',
      'LFT': 'Liver Function Tests',
      'Thyroid': 'Thyroid Function Panel',
      'HbA1c': 'Hemoglobin A1c',
      'Coagulation': 'Coagulation Panel',
      'Microbiology': 'Microbiology Culture',
      'Pathology': 'Pathology Report',
      'Hormone': 'Hormone Panel',
      'Infectious': 'Infectious Disease Panel'
    };

    if (reportType === 'cms1500') return 'CMS-1500 Form';
    if (reportType === 'insurancePolicy') return 'Insurance Policy Document';
    if (reportType === 'visitReport') return 'Visit Report';
    if (reportType === 'medicationHistory') return 'Medication History';
    if (reportType === 'passport') return 'U.S. Passport';
    if (reportType === 'w2') return 'W-2 Wage and Tax Statement';
    if (labTitles[reportType]) return labTitles[reportType];
    return 'Medical Records Report';
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" elevation={0} sx={{ border: 'none', boxShadow: 'none' }}>
          <Toolbar sx={{ gap: 2, py: 1.5 }}>
            <Box
              sx={{
                color: 'primary.main',
                bgcolor: 'rgba(241, 248, 233, 1)',
                p: 1.5,
                borderRadius: 1.25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,9 8,9" />
              </svg>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="h1" sx={{ m: 0, fontSize: '1.35rem' }}>
                  HealthCare Document Generator
                </Typography>
                <Chip label="Educational Use Only" size="small" />
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Progress Stepper */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pt: 0,
            pb: 0,
            px: { xs: 2, sm: 3 },
            m: 0,
            width: '100%',
            bgcolor: 'rgba(250, 245, 235, 0.80)',
          }}
        >
          <Stepper
            activeStep={currentStep - 1}
            orientation="horizontal"
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', sm: 650, md: 800 },
              '& .MuiStepConnector-root': {
                top: 20,
                left: 'calc(-50% + 20px)',
                right: 'calc(50% + 20px)',
              },
              '& .MuiStepConnector-line': {
                borderTopWidth: 2,
              },
              '& .MuiStep-root': {
                px: { xs: 0.5, sm: 1 },
              },
            }}
          >
            {[
              { label: 'Generate', description: 'Create sample medical records' },
              { label: 'Edit', description: 'Review and customize' },
              { label: 'Export', description: 'Generate PDF files' }
            ].map((step, index) => (
              <Step
                key={step.label}
                completed={currentStep > index + 1}
              >
                <StepLabel
                  StepIconProps={{
                    icon: currentStep > index + 1 ? <CheckIcon /> : index + 1,
                  }}
                  sx={{
                    flexDirection: 'row',
                    '& .MuiStepLabel-iconContainer': {
                      pr: { xs: 1, sm: 1.5 },
                    },
                    '& .MuiStepLabel-labelContainer': {
                      textAlign: 'left',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem', md: '1.0625rem' },
                        fontWeight: currentStep === index + 1 ? 700 : 600,
                        color: currentStep === index + 1 ? 'text.primary' : 'secondary.light',
                        lineHeight: 1.3,
                        letterSpacing: '-0.01em',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {step.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: { xs: '0.6875rem', sm: '0.75rem', md: '0.8125rem' },
                        color: 'secondary.light',
                        lineHeight: 1.3,
                        fontWeight: 400,
                        letterSpacing: '0.01em',
                        transition: 'all 0.3s ease',
                        display: { xs: 'none', sm: 'block' },
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Box>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box component="main" sx={{ width: '100%', minHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column', p: 0 }}>
          {renderCurrentStep()}
        </Box>

        {showPreview && (
          <Box sx={commonStyles.previewModal}>
            <Box sx={commonStyles.previewContent}>
              <Box sx={commonStyles.previewHeader}>
                <h3>Preview - {getReportTitle(activeReportType)}</h3>
                <Box
                  component="button"
                  sx={commonStyles.closePreview}
                  onClick={() => setShowPreview(false)}
                >
                  ×
                </Box>
              </Box>
              <Box sx={enableWatermark ? commonStyles.previewBodyWithWatermark : commonStyles.previewBody}>
                {enableWatermark && (
                  <Box sx={commonStyles.previewWatermarkOverlay}>
                    <Box sx={commonStyles.previewWatermarkText}>Educational Use Only</Box>
                    <Box sx={commonStyles.previewWatermarkText}>Educational Use Only</Box>
                    <Box sx={commonStyles.previewWatermarkText}>Educational Use Only</Box>
                    <Box sx={commonStyles.previewWatermarkText}>Educational Use Only</Box>
                    <Box sx={commonStyles.previewWatermarkText}>Educational Use Only</Box>
                  </Box>
                )}
                {renderActiveReport()}
              </Box>
            </Box>
          </Box>
        )}

        {/* Hidden reports for PDF export */}
        <Box sx={commonStyles.reportDisplay}>
          {generatedData && (
            <>
              <MedicalRecordsReport
                individual={generatedData.individual}
                provider={generatedData.provider}
                insuranceInfo={generatedData.insuranceInfo}
                labReports={generatedData.labReports}
                visitReports={generatedData.visitReports}
                medicalHistory={generatedData.medicalHistory}
                fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
              />
              <CMS1500Form
                individual={generatedData.individual}
                provider={generatedData.provider}
                insuranceInfo={generatedData.insuranceInfo}
                claimInfo={generatedData.claimInfo}
                fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
              />
              <InsurancePolicyDocument
                individual={generatedData.individual}
                insuranceInfo={generatedData.insuranceInfo}
                fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
              />
              {generatedData.visitReports.map((visitData: VisitReport, index: number) => (
                <VisitReportDocument
                  key={index}
                  individual={generatedData.individual}
                  provider={generatedData.provider}
                  visitReport={visitData}
                  fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
                />
              ))}
              <MedicationHistoryDocument
                individual={generatedData.individual}
                provider={generatedData.provider}
                medicalHistory={generatedData.medicalHistory}
                fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
              />
              <PassportDocument
                individual={generatedData.individual}
                passport={generatedData.passport}
                fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
              />
              {/* Laboratory Reports */}
              {generatedData.labReports.map((labReport: LabReport) => (
                <LaboratoryReportDocument
                  key={labReport.testType}
                  individual={generatedData.individual}
                  labReport={labReport}
                  fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
                />
              ))}
              <W2Form
                individual={generatedData.individual}
                w2={generatedData.w2}
                fontFamily={fontFamilies.find(f => f.value === fontFamily)?.css || "'Arial', sans-serif"}
              />
            </>
          )}
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            mt: 'auto',
            py: 2,
            px: 3,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Yingting Huang, All rights reserved. | Educational Use Only
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

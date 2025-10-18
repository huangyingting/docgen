import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  Button, 
  Checkbox,
  CircularProgress,
  Alert,
  IconButton,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { StepContainer, ContentContainer, SectionCard, FloatingActionBar } from './SharedComponents';
import * as styles from '../styles/commonStyles';
import { 
  GenerationOptions,
  GeneratedData,
  LabTestType
} from '../utils/zodSchemas';
import { 
  DATA_GENERATION_PRESETS, 
  generateIndividual,
  generateProvider,
  generateInsuranceInfo,
  generateMedicalHistory,
  generateVisitsReport,
  generateLabReports,
  generateClaimInfo,
  generateW2,
  generatePassport
} from '../utils/dataGenerator';
import { 
  AzureOpenAIConfig, 
  generateIndividualWithAI,
  generateProviderWithAI,
  generateInsuranceInfoWithAI,
  generateMedicalHistoryWithAI,
  generateVisitReportsWithAI,
  generateLabReportsWithAI,
  generateClaimInfoWithAI,
  generateW2WithAI,
  generatePassportWithAI
} from '../utils/aiDataGenerator';
import { loadAzureConfig, clearAzureConfig } from '../utils/azureConfigStorage';
import { clearCache, DEFAULT_CACHE_CONFIG } from '../utils/cache';
import AzureConfigModal from './AzureConfigModal';

interface GenerateDataStepProps {
  onDataGenerated: (
    data: GeneratedData,
    generationOptions: Required<GenerationOptions>
  ) => void;
  onNext: () => void;
}

type GenerationMethod = 'faker' | 'ai';

const GenerateDataStep: React.FC<GenerateDataStepProps> = ({ onDataGenerated, onNext }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('standard');
  const [customOptions, setCustomOptions] = useState<Required<GenerationOptions>>({
    complexity: 'medium',
    numberOfVisits: 3,
    numberOfLabTests: 5,
    includeSecondaryInsurance: true
  });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationMethod, setGenerationMethod] = useState<GenerationMethod>('faker');
  const [azureConfig, setAzureConfig] = useState<AzureOpenAIConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Load saved Azure configuration on mount
  useEffect(() => {
    const savedConfig = loadAzureConfig();
    if (savedConfig) {
      setAzureConfig(savedConfig);
      console.log('[GenerateDataStep] Loaded saved Azure configuration');
    }
  }, []);

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const preset = DATA_GENERATION_PRESETS[presetKey];
    setCustomOptions(preset.options);
  };

  const handleGenerateData = async () => {
    // If AI is selected but no config, show modal
    if (generationMethod === 'ai' && !azureConfig) {
      setShowConfigModal(true);
      return;
    }

    setIsGenerating(true);
    setError('');
    try {
      let generatedData: GeneratedData;
      
      if (generationMethod === 'ai' && azureConfig) {
        // AI-powered generation using Azure OpenAI
        console.log('[GenerateDataStep] Using AI generation with Azure OpenAI');
        
        // Generate using AI functions
        const individual = await generateIndividualWithAI(azureConfig);
        const provider = await generateProviderWithAI(azureConfig);
        const insuranceInfo = await generateInsuranceInfoWithAI(azureConfig, individual, customOptions.includeSecondaryInsurance);
        const medicalHistory = await generateMedicalHistoryWithAI(azureConfig, customOptions.complexity);
        const visitReports = await generateVisitReportsWithAI(azureConfig, customOptions.numberOfVisits, provider.name);

        // Generate lab reports - randomly select from available tests
        const availableLabTests: LabTestType[] = [
          'CBC', 'BMP', 'CMP', 'Urinalysis', 'Lipid', 'LFT', 
          'Thyroid', 'HbA1c', 'Coagulation', 'Microbiology', 
          'Pathology', 'Hormone', 'Infectious'
        ];
        // Shuffle and select random lab tests
        const shuffled = [...availableLabTests].sort(() => Math.random() - 0.5);
        const selectedLabTests = shuffled.slice(0, customOptions.numberOfLabTests);
        const labReports = await generateLabReportsWithAI(azureConfig, selectedLabTests, provider.name);

        const claimInfo = await generateClaimInfoWithAI(azureConfig, individual, insuranceInfo, provider);

        // Generate W-2 with AI (employer info is now part of individual)
        const w2 = await generateW2WithAI(azureConfig, individual);
        
        // Generate Passport with AI
        const passport = await generatePassportWithAI(azureConfig, individual);
        
        generatedData = {
          individual,
          provider,
          insuranceInfo,
          medicalHistory,
          visitReports,
          labReports,
          claimInfo,
          w2,
          passport
        };
      } else {
        // Use standard Faker.js generation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const individual = generateIndividual();
        const provider = generateProvider();
        const insuranceInfo = generateInsuranceInfo(individual,customOptions.includeSecondaryInsurance);
        const medicalHistory = generateMedicalHistory(customOptions.complexity);
        const visitReports = generateVisitsReport(customOptions.numberOfVisits, provider.name);
        
        // Generate lab reports - randomly select from available tests
        const availableLabTests: LabTestType[] = [
          'CBC', 'BMP', 'CMP', 'Urinalysis', 'Lipid', 'LFT', 
          'Thyroid', 'HbA1c', 'Coagulation', 'Microbiology', 
          'Pathology', 'Hormone', 'Infectious'
        ];
        // Shuffle and select random lab tests
        const shuffled = [...availableLabTests].sort(() => Math.random() - 0.5);
        const selectedLabTests = shuffled.slice(0, customOptions.numberOfLabTests);
        const labReports = generateLabReports(selectedLabTests, provider.name);

        const claimInfo = generateClaimInfo(individual, insuranceInfo, provider);

        // Generate W-2 (employer info is now part of individual)
        const w2 = generateW2(individual);
        
        // Generate Passport
        const passport = generatePassport(individual);
        
        generatedData = {
          individual,
          provider,
          insuranceInfo,
          medicalHistory,
          visitReports,
          labReports,
          claimInfo,
          w2,
          passport
        };
      }
      
      // Pass generated data and generation options to parent
      onDataGenerated(generatedData, customOptions);
      
      // Automatically move to next step
      onNext();
    } catch (error) {
      console.error('Error generating data:', error);
      const errorMessage = generationMethod === 'ai' 
        ? 'Failed to generate data with AI. Please check your Azure OpenAI configuration or try standard generation.'
        : 'Failed to generate data. Please try again.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfigSave = (config: AzureOpenAIConfig) => {
    setAzureConfig(config);
    setShowConfigModal(false);
    console.log('[GenerateDataStep] Azure configuration saved successfully');
  };

  const handleClearConfig = () => {
    if (window.confirm('Are you sure you want to reset the Azure OpenAI configuration? This will remove all saved settings from browser storage.')) {
      clearAzureConfig();
      setAzureConfig(null);
      setGenerationMethod('faker');
      console.log('[GenerateDataStep] Azure configuration cleared');
    }
  };

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear the cache? This will remove all cached AI-generated data from browser storage.')) {
      try {
        clearCache(DEFAULT_CACHE_CONFIG);
        console.log('[GenerateDataStep] Cache cleared successfully');
        alert('Cache cleared successfully!');
      } catch (error) {
        console.error('[GenerateDataStep] Failed to clear cache:', error);
        alert('Failed to clear cache. Please check the console for details.');
      }
    }
  };

  return (
    <StepContainer>
      <ContentContainer>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <SectionCard>
            <Typography variant="h3" gutterBottom >Generation Method</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose how you want to generate your medical data
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              alignItems: 'center',
              flexWrap: 'wrap',
              mb: 3,
            }}>
              <RadioGroup
                row
                value={generationMethod}
                onChange={(e) => {
                  const value = e.target.value as GenerationMethod;
                  if (value === 'ai' && !azureConfig) {
                    return;
                  }
                  setGenerationMethod(value);
                }}
                sx={{ display: 'flex', gap: 2 }}
              >
                <FormControlLabel
                  value="faker"
                  control={<Radio />}
                  label="Faker.js"
                  sx={generationMethod === 'faker' ? styles.radioButtonCardActive : styles.radioButtonCard}
                />
                <FormControlLabel
                  value="ai"
                  control={<Radio disabled={!azureConfig} />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>AI-Powered</span>
                      {azureConfig && <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />}
                    </Box>
                  }
                  sx={{
                    ...(generationMethod === 'ai' ? styles.radioButtonCardActive : styles.radioButtonCard),
                    opacity: !azureConfig ? 0.6 : 1,
                    '&:hover': {
                      borderColor: !azureConfig ? 'divider' : 'primary.main',
                      boxShadow: !azureConfig ? 'none' : '0 4px 12px rgba(107, 142, 35, 0.15)',
                      transform: !azureConfig ? 'none' : 'translateY(-2px)',
                    },
                  }}
                />
              </RadioGroup>

              <IconButton
                size="small"
                onClick={() => setShowConfigModal(true)}
                title={azureConfig ? 'Update Azure OpenAI settings' : 'Configure Azure OpenAI'}
                sx={styles.iconButton}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>

              {azureConfig && (
                <IconButton
                  size="small"
                  onClick={handleClearConfig}
                  title="Reset Azure OpenAI configuration"
                  sx={styles.iconButtonError}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              )}

              <IconButton
                size="small"
                onClick={handleClearCache}
                title="Clear cached AI-generated data"
                sx={{ 
                  border: '1.5px solid', 
                  borderColor: 'divider',
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'error.main',
                    color: 'error.main',
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>

            <Typography variant="h3" gutterBottom>Choose Data Complexity</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Select a preset configuration or customize your own settings
            </Typography>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 2,
              mb: 3,
            }}>
              {Object.entries(DATA_GENERATION_PRESETS).map(([key, preset]) => (
                <Card 
                  key={key}
                  onClick={() => handlePresetChange(key)}
                  sx={{
                    ...(selectedPreset === key ? styles.presetCardActive : styles.presetCard),
                    p: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #6b8e23, #8faf3c)',
                      opacity: selectedPreset === key ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover::before': {
                      opacity: 1,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="h4" sx={{ fontSize: '1.0625rem', fontWeight: 700 }}>{preset.name}</Typography>
                    {selectedPreset === key && (
                      <Box sx={styles.badgeIndicator}>
                        <CheckIcon sx={{ fontSize: 16 }} />
                      </Box>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
                    {preset.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Box sx={styles.badgeSmall}>
                      <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        Visits: {preset.options.numberOfVisits}
                      </Typography>
                    </Box>
                    <Box sx={styles.badgeSmall}>
                      <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        Tests: {preset.options.numberOfLabTests}
                      </Typography>
                    </Box>
                    <Box sx={styles.badgeSmall}>
                      <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
                        {preset.options.complexity}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>

            <Typography variant="h3" gutterBottom>Custom Settings</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Fine-tune the generated data to meet your specific needs
            </Typography>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 2.5,
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={styles.fieldLabel}>
                  Medical Complexity
                </Typography>
                <Select
                  value={customOptions.complexity}
                  onChange={(e: SelectChangeEvent) => setCustomOptions({...customOptions, complexity: e.target.value as 'low' | 'medium' | 'high'})}
                  fullWidth
                  sx={styles.formControlSelect}
                >
                  <MenuItem value="low">Basic (2-3 conditions)</MenuItem>
                  <MenuItem value="medium">Moderate (4-5 conditions)</MenuItem>
                  <MenuItem value="high">Complex (6+ conditions)</MenuItem>
                </Select>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={styles.fieldLabel}>
                  Number of Visits
                </Typography>
                <Select
                  value={customOptions.numberOfVisits}
                  onChange={(e: SelectChangeEvent<number>) => setCustomOptions({...customOptions, numberOfVisits: e.target.value as number})}
                  fullWidth
                  sx={styles.formControlSelect}
                >
                  <MenuItem value={1}>1 Visit</MenuItem>
                  <MenuItem value={2}>2 Visits</MenuItem>
                  <MenuItem value={3}>3 Visits</MenuItem>
                  <MenuItem value={5}>5 Visits</MenuItem>
                  <MenuItem value={7}>7 Visits</MenuItem>
                </Select>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" fontWeight={700} color="text.primary" sx={{ fontSize: '0.9rem' }}>
                  Lab Tests
                </Typography>
                <Select
                  value={customOptions.numberOfLabTests}
                  onChange={(e: SelectChangeEvent<number>) => setCustomOptions({...customOptions, numberOfLabTests: e.target.value as number})}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      py: 1.5,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: 1.5,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    }
                  }}
                >
                  <MenuItem value={1}>1 Test</MenuItem>
                  <MenuItem value={2}>2 Tests</MenuItem>
                  <MenuItem value={3}>3 Tests</MenuItem>
                  <MenuItem value={5}>5 Tests</MenuItem>
                  <MenuItem value={8}>8 Tests</MenuItem>
                  <MenuItem value={10}>10 Tests</MenuItem>
                </Select>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={styles.fieldLabel}>
                  Secondary Insurance
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={customOptions.includeSecondaryInsurance}
                      onChange={(e) => setCustomOptions({...customOptions, includeSecondaryInsurance: e.target.checked})}
                    />
                  }
                  label="Include"
                  sx={customOptions.includeSecondaryInsurance ? styles.formControlCheckboxActive : styles.formControlCheckbox}
                />
              </Box>
            </Box>
          </SectionCard>

          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}
        </Box>

        <FloatingActionBar variant="centered">
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateData}
            disabled={isGenerating}
            startIcon={isGenerating && <CircularProgress size={18} color="inherit" />}
            sx={styles.floatingActionButtonPrimary}
          >
            {isGenerating 
              ? (generationMethod === 'ai' ? 'Generating with AI...' : 'Generating...') 
              : 'Generate & Continue →'}
          </Button>
        </FloatingActionBar>
      </ContentContainer>

      {/* Azure Config Modal */}
      {showConfigModal && (
        <AzureConfigModal
          onSave={handleConfigSave}
          onCancel={() => setShowConfigModal(false)}
          initialConfig={azureConfig || undefined}
        />
      )}
    </StepContainer>
  );
};

export default GenerateDataStep;

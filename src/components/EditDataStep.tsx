import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Button, TextField, Select, MenuItem, FormControl, InputLabel, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { GeneratedData, Individual, InsuranceInfo, Provider, MedicalHistory, VisitReport, LabReport, LabTestType, ChronicCondition, DiscontinuedMedication, SurgicalHistory, FamilyHistory } from '../utils/zodSchemas';
import { MEDICAL_SPECIALTIES, INDUSTRIES } from '../utils/dataGenerator';
import { StepContainer, FormGrid, TabContent, LoadingSpinner, FloatingActionBar, SubTitle } from './SharedComponents';
import * as styles from '../styles/commonStyles';

// Accordion icon helper function
const getAccordionIcon = (iconName: string) => {
  const iconProps = {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (iconName) {
    case 'allergies':
      return (
        <svg {...iconProps}>
          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      );
    case 'conditions':
      return (
        <svg {...iconProps}>
          <rect x="3" y="8" width="18" height="12" rx="2"/>
          <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/>
          <circle cx="12" cy="14" r="2"/>
        </svg>
      );
    case 'medications':
      return (
        <svg {...iconProps}>
          <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
          <path d="m8.5 8.5 7 7"/>
        </svg>
      );
    case 'discontinued':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10"/>
          <path d="m4.9 4.9 14.2 14.2"/>
        </svg>
      );
    case 'surgical':
      return (
        <svg {...iconProps}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      );
    case 'family':
      return (
        <svg {...iconProps}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      );
    case 'lab':
      return (
        <svg {...iconProps}>
          <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/>
          <path d="M8.5 2h7"/>
          <path d="M7 16h10"/>
        </svg>
      );
    case 'vitals':
      return (
        <svg {...iconProps}>
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      );
    case 'visits':
      return (
        <svg {...iconProps}>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <path d="M9 12h6"/>
          <path d="M9 16h6"/>
        </svg>
      );
    default:
      return <></>;
  }
};

interface EditDataStepProps {
  generatedData: GeneratedData | null;
  onDataUpdated: (data: GeneratedData) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Section {
  id: string;
  label: string;
  icon: string;
}

interface PatientInfoSectionProps {
  data: Individual;
  onChange: (field: string, value: any) => void;
}

interface InsuranceSectionProps {
  data: InsuranceInfo;
  onChange: (field: string, value: any) => void;
}

interface ProviderSectionProps {
  data: Provider;
  onChange: (field: string, value: any) => void;
}

interface MedicalHistorySectionProps {
  data: MedicalHistory;
  onChange: (field: string, value: any) => void;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
}

interface LabResultsSectionProps {
  data: LabReport;
  onChange: (updatedData: LabReport) => void;
}

interface VisitNotesSectionProps {
  data: VisitReport;
  onChange: (updatedData: VisitReport) => void;
}

const EditDataStep: React.FC<EditDataStepProps> = ({ generatedData, onDataUpdated, onNext, onBack }) => {
  const [editedData, setEditedData] = useState<GeneratedData | null>(null);
  const [activeSection, setActiveSection] = useState<string>('patient');
  const [expandedLabReports, setExpandedLabReports] = useState<Set<LabTestType>>(new Set());
  const [expandedVisitReports, setExpandedVisitReports] = useState<Set<number>>(new Set());
  const [expandedMedicalSections, setExpandedMedicalSections] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  useEffect(() => {
    if (generatedData) {
      setEditedData(JSON.parse(JSON.stringify(generatedData))); // Deep clone
    }
  }, [generatedData]);

  const updateData = (section: string, field: string, value: any) => {
    setEditedData(prev => {
      if (!prev) return prev;
      const updated = JSON.parse(JSON.stringify(prev)); // Deep clone
      const keys = field.split('.');
      let current: any = (updated as any)[section];
      
      // Navigate to the parent of the field to update
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {}; // Create missing objects
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;      
      
      return updated;
    });
    setHasChanges(true);
  };

  const handleNext = () => {
    if (editedData) {
      onDataUpdated(editedData);
      onNext();
    }
  };

  const handleSaveChanges = () => {
    if (editedData) {
      onDataUpdated(editedData);
      setHasChanges(false);
    }
  };

  if (!editedData) {
    return <LoadingSpinner />;
  }

  const sections: Section[] = [
    { id: 'patient', label: 'Individual', icon: 'user' },
    { id: 'insurance', label: 'Insurance', icon: 'card' },
    { id: 'provider', label: 'Provider', icon: 'stethoscope' },
    { id: 'medical', label: 'Medical History', icon: 'activity' },
    { id: 'labs', label: 'Lab Reports', icon: 'flask' },
    { id: 'visits', label: 'Visit Records', icon: 'clipboard' }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'user':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        );
      case 'card':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
        );
      case 'stethoscope':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
            <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
            <circle cx="20" cy="10" r="2"/>
          </svg>
        );
      case 'activity':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        );
      case 'flask':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/>
            <path d="M8.5 2h7"/>
            <path d="M7 16h10"/>
          </svg>
        );
      case 'heart':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        );
      case 'clipboard':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          </svg>
        );
      default:
        return <></>;
    }
  };

  return (
    <StepContainer>
      <Box sx={{ borderRadius: 2, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={styles.tabsContainer}>
          <Tabs
            value={activeSection}
            onChange={(_, newValue) => setActiveSection(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            centered
            sx={styles.customTabs}
          >
            {sections.map(section => (
              <Tab
                key={section.id}
                value={section.id}
                label={section.label}
                icon={getIcon(section.icon)}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>

        <TabContent key={activeSection}>
            {activeSection === 'patient' && (
              <PatientInfoSection 
                data={editedData.individual} 
                onChange={(field, value) => updateData('individual', field, value)}
              />
            )}
            
            {activeSection === 'insurance' && (
              <InsuranceSection 
                data={editedData.insuranceInfo} 
                onChange={(field, value) => updateData('insuranceInfo', field, value)}
              />
            )}
            
            {activeSection === 'provider' && (
              <ProviderSection 
                data={editedData.provider} 
                onChange={(field, value) => updateData('provider', field, value)}
              />
            )}
            
            {activeSection === 'medical' && editedData.medicalHistory && (
              <MedicalHistorySection 
                data={editedData.medicalHistory}
                expandedSections={expandedMedicalSections}
                onToggleSection={(section) => {
                  const newExpanded = new Set(expandedMedicalSections);
                  if (newExpanded.has(section)) {
                    newExpanded.delete(section);
                  } else {
                    newExpanded.add(section);
                  }
                  setExpandedMedicalSections(newExpanded);
                }}
                onChange={(field, value) => {
                  setEditedData(prev => {
                    if (!prev) return prev;
                    const updated = JSON.parse(JSON.stringify(prev));
                    const keys = field.split('.');
                    let current: any = updated.medicalHistory;
                    
                    for (let i = 0; i < keys.length - 1; i++) {
                      current = current[keys[i]];
                    }
                    current[keys[keys.length - 1]] = value;
                    setHasChanges(true);
                    return updated;
                  });
                }}
              />
            )}
            
            {/* Lab Results section: Data now managed via LabReport[] */}
            {activeSection === 'labs' && (
              <>
                {editedData.labReports.length > 0 ? (
                  <Box>
                    <SubTitle>Laboratory Reports ({editedData.labReports.length} reports)</SubTitle>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {editedData.labReports.map((labData, index) => {
                        const isExpanded = expandedLabReports.has(labData.testType as LabTestType);
                        return (
                          <Accordion 
                            key={labData.testType}
                            expanded={isExpanded}
                            onChange={() => {
                              const newExpanded = new Set(expandedLabReports);
                              if (isExpanded) {
                                newExpanded.delete(labData.testType as LabTestType);
                              } else {
                                newExpanded.add(labData.testType as LabTestType);
                              }
                              setExpandedLabReports(newExpanded);
                            }}
                            sx={styles.enhancedAccordion}
                          >
                            <AccordionSummary 
                              expandIcon={<ExpandMoreIcon />}
                              sx={styles.enhancedAccordionSummary}
                            >
                              <Typography sx={styles.accordionTitle}>
                                {getAccordionIcon('lab')} {labData.testName} ({labData.testType})
                                <Box component="span" sx={styles.accordionBadge}>
                                  {labData.results.length}
                                </Box>
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={styles.enhancedAccordionDetails}>
                              <LabResultsSection
                                data={labData}
                                onChange={(updated) => {
                                  setEditedData(prev => {
                                    if (!prev) return prev;
                                    const newData = JSON.parse(JSON.stringify(prev));
                                    newData.labReports[index] = updated;
                                    setHasChanges(true);
                                    return newData;
                                  });
                                }}
                              />
                            </AccordionDetails>
                          </Accordion>
                        );
                      })}
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2.5, color: 'primary.main', fontWeight: 600, fontSize: '1.25rem' }}>
                      Laboratory Report
                    </Typography>
                    <Typography variant="body1" color="warning.main">
                      ⚠️ No laboratory report data available. Please generate data first.
                    </Typography>
                  </Box>
                )}
              </>
            )}
            
            {/* Visit Records section: Combined Vital Signs and Visit Notes */}
            {activeSection === 'visits' && (
              <>
                {editedData.visitReports.length > 0 ? (
                  <Box>
                    <SubTitle>
                      Visit Records ({editedData.visitReports.length} visits)
                    </SubTitle>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {editedData.visitReports.map((visitData, index) => {
                        const isExpanded = expandedVisitReports.has(index);
                        return (
                          <Accordion 
                            key={index}
                            expanded={isExpanded}
                            onChange={() => {
                              const newExpanded = new Set(expandedVisitReports);
                              if (isExpanded) {
                                newExpanded.delete(index);
                              } else {
                                newExpanded.add(index);
                              }
                              setExpandedVisitReports(newExpanded);
                            }}
                            sx={styles.enhancedAccordion}
                          >
                            <AccordionSummary 
                              expandIcon={<ExpandMoreIcon />}
                              sx={styles.enhancedAccordionSummary}
                            >
                              <Typography sx={styles.accordionTitle}>
                                {getAccordionIcon('visits')} Visit {index + 1} - {visitData.visit.date}
                                <Typography component="span" sx={styles.accordionSubtext}>
                                  {visitData.visit.type}
                                </Typography>
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={styles.enhancedAccordionDetails}>
                              <VisitRecordSection
                                data={visitData}
                                onChange={(updated) => {
                                  setEditedData(prev => {
                                    if (!prev) return prev;
                                    const newData = JSON.parse(JSON.stringify(prev));
                                    newData.visitReports[index] = updated;
                                    setHasChanges(true);
                                    return newData;
                                  });
                                }}
                              />
                            </AccordionDetails>
                          </Accordion>
                        );
                      })}
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2.5, color: 'primary.main', fontWeight: 600, fontSize: '1.25rem' }}>
                      Visit Records
                    </Typography>
                    <Typography variant="body1" color="warning.main">
                      ⚠️ No visit report data available. Please generate data first.
                    </Typography>
                  </Box>
                )}
              </>
            )}
        </TabContent>

        <FloatingActionBar variant="spaced">
          <Button
            variant="outlined"
            onClick={onBack}
            sx={styles.floatingActionButtonBack}
          >
            ← Back to Generate
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {hasChanges && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSaveChanges}
                sx={{
                  ...styles.floatingActionButtonSecondary,
                  fontSize: '0.9375rem',
                }}
              >
                Save Changes
              </Button>
            )}
            
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ 
                ...styles.floatingActionButtonPrimary,
                minWidth: 140,
              }}
            >
              Continue to Export →
            </Button>
          </Box>
        </FloatingActionBar>
      </Box>
    </StepContainer>
  );
};

// Patient Info Section Component
const PatientInfoSection: React.FC<PatientInfoSectionProps> = ({ data, onChange }) => (
  <Box>
    <SubTitle>Patient Information</SubTitle>
    
    <FormGrid>
      <TextField
        label="First Name"
        value={data.firstName}
        onChange={(e) => onChange('firstName', e.target.value)}
        fullWidth
        size="small"
      />

      <TextField
        label="Middle Initial"
        value={data.middleInitial || ''}
        onChange={(e) => onChange('middleInitial', e.target.value)}
        fullWidth
        size="small"
        inputProps={{ maxLength: 1 }}
      />

      <TextField
        label="Last Name"
        value={data.lastName}
        onChange={(e) => onChange('lastName', e.target.value)}
        fullWidth
        size="small"
      />
            
      <TextField
        label="Date of Birth"
        value={data.dateOfBirth}
        onChange={(e) => onChange('dateOfBirth', e.target.value)}
        placeholder="MM/DD/YYYY"
        fullWidth
        size="small"
      />
            
      <TextField
        label="Medical Record Number"
        value={data.medicalRecordNumber}
        onChange={(e) => onChange('medicalRecordNumber', e.target.value)}
        fullWidth
        size="small"
      />
      
      <TextField
        label="SSN"
        value={data.ssn}
        onChange={(e) => onChange('ssn', e.target.value)}
        placeholder="XXX-XX-XXXX"
        fullWidth
        size="small"
      />
      
      <TextField
        label="Account Number"
        value={data.accountNumber || ''}
        onChange={(e) => onChange('accountNumber', e.target.value)}
        placeholder="Optional"
        fullWidth
        size="small"
      />
      
      <FormControl fullWidth size="small">
        <InputLabel>Gender</InputLabel>
        <Select
          value={data.gender}
          onChange={(e) => onChange('gender', e.target.value)}
          label="Gender"
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Phone Number"
        value={data.contact.phone}
        onChange={(e) => onChange('contact.phone', e.target.value)}
        fullWidth
        size="small"
      />
      
      <TextField
        label="Email"
        type="email"
        value={data.contact.email}
        onChange={(e) => onChange('contact.email', e.target.value)}
        fullWidth
        size="small"
      />
      
      <TextField
        label="Emergency Contact"
        value={data.contact.emergencyContact}
        onChange={(e) => onChange('contact.emergencyContact', e.target.value)}
        placeholder="Name and phone number"
        fullWidth
        size="small"
        sx={{ gridColumn: 'span 2' }}
      />

      <TextField
        label="Street Address"
        value={data.address.street}
        onChange={(e) => onChange('address.street', e.target.value)}
        fullWidth
        size="small"
        sx={{ gridColumn: 'span 2' }}
      />
      
      <TextField
        label="City"
        value={data.address.city}
        onChange={(e) => onChange('address.city', e.target.value)}
        fullWidth
        size="small"
      />
      
      <TextField
        label="State"
        value={data.address.state}
        onChange={(e) => onChange('address.state', e.target.value)}
        inputProps={{ maxLength: 2 }}
        fullWidth
        size="small"
      />
      
      <TextField
        label="ZIP Code"
        value={data.address.zipCode}
        onChange={(e) => onChange('address.zipCode', e.target.value)}
        fullWidth
        size="small"
      />
    </FormGrid>

    <SubTitle sx={{ mt: 3, mb: 2 }}>
      Employment Information
    </SubTitle>
    
    <FormGrid>
      <TextField
        label="Company Name"
        value={data.companyName || ''}
        onChange={(e) => onChange('companyName', e.target.value)}
        fullWidth
        size="small"
      />
      
      <TextField
        label="Employer EIN"
        value={data.employerEIN || ''}
        onChange={(e) => onChange('employerEIN', e.target.value)}
        placeholder="XX-XXXXXXX"
        fullWidth
        size="small"
      />
      
      <FormControl fullWidth size="small">
        <InputLabel>Industry</InputLabel>
        <Select
          value={data.employerIndustry || ''}
          onChange={(e) => onChange('employerIndustry', e.target.value)}
          label="Industry"
        >
          <MenuItem value="">Select...</MenuItem>
          {INDUSTRIES.map((industry) => (
            <MenuItem key={industry} value={industry}>{industry}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <TextField
        label="Employer Phone"
        value={data.employerPhone || ''}
        onChange={(e) => onChange('employerPhone', e.target.value)}
        fullWidth
        size="small"
      />

      <TextField
        label="Employer Street Address"
        value={data.employerAddress?.street || ''}
        onChange={(e) => onChange('employerAddress.street', e.target.value)}
        fullWidth
        size="small"
        sx={{ gridColumn: 'span 2' }}
      />
      
      <TextField
        label="Employer City"
        value={data.employerAddress?.city || ''}
        onChange={(e) => onChange('employerAddress.city', e.target.value)}
        fullWidth
        size="small"
      />
      
      <TextField
        label="Employer State"
        value={data.employerAddress?.state || ''}
        onChange={(e) => onChange('employerAddress.state', e.target.value)}
        inputProps={{ maxLength: 2 }}
        fullWidth
        size="small"
      />
      
      <TextField
        label="Employer ZIP Code"
        value={data.employerAddress?.zipCode || ''}
        onChange={(e) => onChange('employerAddress.zipCode', e.target.value)}
        fullWidth
        size="small"
      />
    </FormGrid>
  </Box>
);

// Insurance Section Component
const InsuranceSection: React.FC<InsuranceSectionProps> = ({ data, onChange }) => {
  const handleAddSecondaryInsurance = () => {
    // TODO: Implement secondary insurance generation
    // Generate secondary insurance with populated data, excluding the primary insurance provider
    // const result = generateSecondaryInsuranceAndInsured(data.primaryInsurance.provider);
    // onChange('secondaryInsurance', result?.secondaryInsurance);
    // if (result?.secondaryInsured) {
    //   onChange('secondaryInsured', result?.secondaryInsured);
    // }
    console.warn('Secondary insurance generation not yet implemented');
  };

  const handleRemoveSecondaryInsurance = () => {
    onChange('secondaryInsurance', null);
  };

  return (
    <Box>
      <SubTitle>
        Subscriber Information
      </SubTitle>
      <FormGrid sx={{ mb: 3 }}>
        <TextField
          label="Subscriber First Name"
          value={data.subscriberFirstName || ''}
          onChange={(e) => onChange('subscriberFirstName', e.target.value)}
          placeholder="If different from patient"
          fullWidth
          size="small"
        />
        
        <TextField
          label="Subscriber Last Name"
          value={data.subscriberLastName || ''}
          onChange={(e) => onChange('subscriberLastName', e.target.value)}
          placeholder="If different from patient"
          fullWidth
          size="small"
        />
        
        <TextField
          label="Subscriber DOB"
          value={data.subscriberDOB || ''}
          onChange={(e) => onChange('subscriberDOB', e.target.value)}
          placeholder="MM/DD/YYYY"
          fullWidth
          size="small"
        />
        
        <FormControl fullWidth size="small">
          <InputLabel>Subscriber Gender</InputLabel>
          <Select
            value={data.subscriberGender || ''}
            onChange={(e) => onChange('subscriberGender', e.target.value)}
            label="Subscriber Gender"
          >
            <MenuItem value="">Select...</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </FormGrid>

      <SubTitle sx={{ mt: 2.5 }}>
        Primary Insurance
      </SubTitle>
      
      <FormGrid sx={{ mb: 3 }}>
        <TextField
          label="Insurance Company"
          value={data.primaryInsurance.provider}
          onChange={(e) => onChange('primaryInsurance.provider', e.target.value)}
          fullWidth
          size="small"
        />
        
        <TextField
          label="Policy Number"
          value={data.primaryInsurance.policyNumber}
          onChange={(e) => onChange('primaryInsurance.policyNumber', e.target.value)}
          fullWidth
          size="small"
        />
        
        <TextField
          label="Group Number"
          value={data.primaryInsurance.groupNumber ?? ''}
          onChange={(e) => onChange('primaryInsurance.groupNumber', e.target.value)}
          fullWidth
          size="small"
        />
        
        <TextField
          label="Member ID"
          value={data.primaryInsurance.memberId ?? ''}
          onChange={(e) => onChange('primaryInsurance.memberId', e.target.value)}
          fullWidth
          size="small"
        />
        
        <TextField
          label="Copay"
          value={data.primaryInsurance.copay || ''}
          onChange={(e) => onChange('primaryInsurance.copay', e.target.value)}
          placeholder="$20"
          fullWidth
          size="small"
        />
        
        <TextField
          label="Deductible"
          value={data.primaryInsurance.deductible || ''}
          onChange={(e) => onChange('primaryInsurance.deductible', e.target.value)}
          placeholder="$1000"
          fullWidth
          size="small"
        />
      </FormGrid>

      <Box sx={{ mt: 2.5, mb: 2.5 }}>
        <Button 
          variant={data.secondaryInsurance ? "outlined" : "contained"}
          color="secondary"
          onClick={data.secondaryInsurance ? handleRemoveSecondaryInsurance : handleAddSecondaryInsurance}
          startIcon={data.secondaryInsurance ? <DeleteIcon /> : <AddIcon />}
          size="small"
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          {data.secondaryInsurance ? 'Remove Secondary Insurance' : 'Add Secondary Insurance'}
        </Button>
      </Box>

      {data.secondaryInsurance && (
        <Box>
          <SubTitle>
            Secondary Insurance
          </SubTitle>
          <FormGrid>
            <TextField
              label="Insurance Company"
              value={data.secondaryInsurance.provider}
              onChange={(e) => onChange('secondaryInsurance.provider', e.target.value)}
              fullWidth
              size="small"
            />
            
            <TextField
              label="Policy Number"
              value={data.secondaryInsurance.policyNumber}
              onChange={(e) => onChange('secondaryInsurance.policyNumber', e.target.value)}
              fullWidth
              size="small"
            />
            
            <TextField
              label="Group Number"
              value={data.secondaryInsurance.groupNumber || ''}
              onChange={(e) => onChange('secondaryInsurance.groupNumber', e.target.value)}
              fullWidth
              size="small"
            />
            
            <TextField
              label="Member ID"
              value={data.secondaryInsurance.memberId || ''}
              onChange={(e) => onChange('secondaryInsurance.memberId', e.target.value)}
              fullWidth
              size="small"
            />
            
            <TextField
              label="Effective Date"
              value={data.secondaryInsurance.effectiveDate || ''}
              onChange={(e) => onChange('secondaryInsurance.effectiveDate', e.target.value)}
              placeholder="YYYY-MM-DD"
              fullWidth
              size="small"
            />
            
            <TextField
              label="Copay"
              value={data.secondaryInsurance.copay || ''}
              onChange={(e) => onChange('secondaryInsurance.copay', e.target.value)}
              placeholder="$20"
              fullWidth
              size="small"
            />
            
            <TextField
              label="Deductible"
              value={data.secondaryInsurance.deductible || ''}
              onChange={(e) => onChange('secondaryInsurance.deductible', e.target.value)}
              placeholder="$1000"
              fullWidth
              size="small"
            />
          </FormGrid>
        </Box>
      )}
    </Box>
  );
};

// Provider Section Component
const ProviderSection: React.FC<ProviderSectionProps> = ({ data, onChange }) => (
  <Box>
    <SubTitle>Care Provider Information</SubTitle>
    
    <FormGrid sx={{ mb: 3 }}>
      <TextField
        label="Provider Name"
        value={data.name}
        onChange={(e) => onChange('name', e.target.value)}
        fullWidth
        size="small"
      />
      
      <TextField
        label="NPI Number"
        value={data.npi}
        onChange={(e) => onChange('npi', e.target.value)}
        fullWidth
        size="small"
      />
      
      <FormControl fullWidth size="small">
        <InputLabel>Specialty</InputLabel>
        <Select
          value={data.specialty}
          onChange={(e) => onChange('specialty', e.target.value)}
          label="Specialty"
        >
          {MEDICAL_SPECIALTIES.map(specialty => (
            <MenuItem key={specialty} value={specialty}>
              {specialty}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <TextField
        label="Phone"
        value={data.phone}
        onChange={(e) => onChange('phone', e.target.value)}
        fullWidth
        size="small"
      />
      
      <TextField
        label="Tax ID"
        value={data.taxId || ''}
        onChange={(e) => onChange('taxId', e.target.value)}
        placeholder="Optional"
        fullWidth
        size="small"
      />
      
      <FormControl fullWidth size="small">
        <InputLabel>Tax ID Type</InputLabel>
        <Select
          value={data.taxIdType || ''}
          onChange={(e) => onChange('taxIdType', e.target.value as 'SSN' | 'EIN')}
          label="Tax ID Type"
        >
          <MenuItem value="">Select...</MenuItem>
          <MenuItem value="SSN">SSN</MenuItem>
          <MenuItem value="EIN">EIN</MenuItem>
        </Select>
      </FormControl>
    </FormGrid>


    <FormGrid sx={{ mb: 3 }}>
      <TextField
        label="Facility Name"
        value={data.facilityName || ''}
        onChange={(e) => onChange('facilityName', e.target.value)}
        fullWidth
        size="small"
        sx={{ gridColumn: 'span 2' }}
      />
      
      <TextField
        label="Facility Phone"
        value={data.facilityPhone || ''}
        onChange={(e) => onChange('facilityPhone', e.target.value)}
        fullWidth
        size="small"
      />
      
      <TextField
        label="Facility Fax"
        value={data.facilityFax || ''}
        onChange={(e) => onChange('facilityFax', e.target.value)}
        fullWidth
        size="small"
      />
      
      <TextField
        label="Facility NPI"
        value={data.facilityNPI || ''}
        onChange={(e) => onChange('facilityNPI', e.target.value)}
        fullWidth
        size="small"
      />
      <TextField
        label="Street Address"
        value={data.address.street}
        onChange={(e) => onChange('address.street', e.target.value)}
        fullWidth
        sx={{ gridColumn: 'span 2' }}
      />
      
      <TextField
        label="City"
        value={data.address.city}
        onChange={(e) => onChange('address.city', e.target.value)}
        fullWidth
      />
      
      <TextField
        label="State"
        value={data.address.state}
        onChange={(e) => onChange('address.state', e.target.value)}
        inputProps={{ maxLength: 2 }}
        fullWidth
      />
      
      <TextField
        label="ZIP Code"
        value={data.address.zipCode}
        onChange={(e) => onChange('address.zipCode', e.target.value)}
        fullWidth
      />
    </FormGrid>
  </Box>
);

// Medical History Section Component
const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({ data, onChange, expandedSections, onToggleSection }) => (
  <Box>
    <SubTitle>Medical History</SubTitle>
    
    {/* Allergies Accordion */}
    <Accordion 
      expanded={expandedSections.has('allergies')}
      onChange={() => onToggleSection('allergies')}
      sx={styles.enhancedAccordion}
    >
      <AccordionSummary 
        expandIcon={<ExpandMoreIcon />}
        sx={styles.enhancedAccordionSummary}
      >
        <Typography sx={styles.accordionTitle}>
          {getAccordionIcon('allergies')} Allergies
          <Box component="span" sx={styles.accordionBadge}>
            {(data.allergies || []).length}
          </Box>
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={styles.enhancedAccordionDetails}>
        {(data.allergies || []).map((allergy, index) => (
          <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < (data.allergies || []).length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <FormGrid>
              <TextField
                label="Allergen"
                value={allergy.allergen}
                onChange={(e) => {
                  const updated = [...(data.allergies || [])];
                  updated[index].allergen = e.target.value;
                  onChange('allergies', updated);
                }}
                placeholder="e.g., Penicillin"
                fullWidth
              />
              
              <TextField
                label="Reaction"
                value={allergy.reaction}
                onChange={(e) => {
                  const updated = [...(data.allergies || [])];
                  updated[index].reaction = e.target.value;
                  onChange('allergies', updated);
                }}
                placeholder="e.g., Rash, Hives"
                fullWidth
              />
              
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={allergy.severity}
                  onChange={(e) => {
                    const updated = [...(data.allergies || [])];
                    updated[index].severity = e.target.value;
                    onChange('allergies', updated);
                  }}
                  label="Severity"
                >
                  <MenuItem value="Mild">Mild</MenuItem>
                  <MenuItem value="Moderate">Moderate</MenuItem>
                  <MenuItem value="Severe">Severe</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Date Identified"
                value={allergy.dateIdentified}
                onChange={(e) => {
                  const updated = [...(data.allergies || [])];
                  updated[index].dateIdentified = e.target.value;
                  onChange('allergies', updated);
                }}
                placeholder="MM/DD/YYYY or Unknown"
                fullWidth
              />
            </FormGrid>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>

    {/* Active Conditions Accordion */}
    <Accordion 
      expanded={expandedSections.has('conditions')}
      onChange={() => onToggleSection('conditions')}
      sx={styles.enhancedAccordion}
    >
      <AccordionSummary 
        expandIcon={<ExpandMoreIcon />}
        sx={styles.enhancedAccordionSummary}
      >
        <Typography sx={styles.accordionTitle}>
          {getAccordionIcon('conditions')} Active Conditions
          <Box component="span" sx={styles.accordionBadge}>
            {(data.chronicConditions || []).length}
          </Box>
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={styles.enhancedAccordionDetails}>
        {(data.chronicConditions || []).map((condition: ChronicCondition, index: number) => (
          <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < (data.chronicConditions || []).length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <FormGrid>
              <TextField
                label="Condition Name"
                value={condition.condition}
                onChange={(e) => {
                  const updated = [...(data.chronicConditions || [])];
                  updated[index].condition = e.target.value;
                  onChange('chronicConditions', updated);
                }}
                placeholder="e.g., Type 2 Diabetes"
                fullWidth
              />
              
              <TextField
                label="Diagnosed Date"
                value={condition.diagnosedDate}
                onChange={(e) => {
                  const updated = [...(data.chronicConditions || [])];
                  updated[index].diagnosedDate = e.target.value;
                  onChange('chronicConditions', updated);
                }}
                placeholder="MM/DD/YYYY"
                fullWidth
              />
              
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={condition.status}
                  onChange={(e) => {
                    const updated = [...(data.chronicConditions || [])];
                    updated[index].status = e.target.value;
                    onChange('chronicConditions', updated);
                  }}
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Stable">Stable</MenuItem>
                  <MenuItem value="Improving">Improving</MenuItem>
                  <MenuItem value="Monitoring">Monitoring</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Notes"
                value={condition.notes}
                onChange={(e) => {
                  const updated = [...(data.chronicConditions || [])];
                  updated[index].notes = e.target.value;
                  onChange('chronicConditions', updated);
                }}
                placeholder="Additional information..."
                multiline
                rows={2}
                fullWidth
                sx={{ gridColumn: 'span 2' }}
              />
            </FormGrid>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>

    {/* Current Medications Accordion */}
    <Accordion 
      expanded={expandedSections.has('currentMeds')}
      onChange={() => onToggleSection('currentMeds')}
      sx={styles.enhancedAccordion}
    >
      <AccordionSummary 
        expandIcon={<ExpandMoreIcon />}
        sx={styles.enhancedAccordionSummary}
      >
        <Typography sx={styles.accordionTitle}>
          {getAccordionIcon('medications')} Current Medications
          <Box component="span" sx={styles.accordionBadge}>
            {(data.medications.current || []).length}
          </Box>
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={styles.enhancedAccordionDetails}>
        {(data.medications.current || []).map((med, index) => (
          <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < (data.medications.current || []).length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <FormGrid>
              <TextField
                label="Medication Name"
                value={med.name}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].name = e.target.value;
                  onChange('medications.current', updated);
                }}
                placeholder="e.g., Lisinopril"
                fullWidth
              />
              
              <TextField
                label="Strength"
                value={med.strength}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].strength = e.target.value;
                  onChange('medications.current', updated);
                }}
                placeholder="e.g., 10mg"
                fullWidth
              />
              
              <TextField
                label="Dosage"
                value={med.dosage}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].dosage = e.target.value;
                  onChange('medications.current', updated);
                }}
                placeholder="e.g., Once daily"
                fullWidth
              />
              
              <TextField
                label="Purpose"
                value={med.purpose}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].purpose = e.target.value;
                  onChange('medications.current', updated);
                }}
                placeholder="e.g., Blood pressure control"
                fullWidth
              />
              
              <TextField
                label="Prescribed By"
                value={med.prescribedBy}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].prescribedBy = e.target.value;
                  onChange('medications.current', updated);
                }}
                placeholder="Provider name"
                fullWidth
              />
              
              <TextField
                label="Start Date"
                value={med.startDate}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].startDate = e.target.value;
                  onChange('medications.current', updated);
                }}
                placeholder="MM/DD/YYYY"
                fullWidth
              />
              
              <TextField
                label="Instructions"
                value={med.instructions}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].instructions = e.target.value;
                  onChange('medications.current', updated);
                }}
                placeholder="Special instructions"
                fullWidth
                sx={{ gridColumn: 'span 2' }}
              />
            </FormGrid>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>

    {/* Discontinued Medications Accordion */}
    <Accordion 
      expanded={expandedSections.has('discontinuedMeds')}
      onChange={() => onToggleSection('discontinuedMeds')}
      sx={styles.enhancedAccordion}
    >
      <AccordionSummary 
        expandIcon={<ExpandMoreIcon />}
        sx={styles.enhancedAccordionSummary}
      >
        <Typography sx={styles.accordionTitle}>
          {getAccordionIcon('discontinued')} Discontinued Medications
          <Box component="span" sx={styles.accordionBadge}>
            {(data.medications.discontinued || []).length}
          </Box>
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={styles.enhancedAccordionDetails}>
        {(data.medications.discontinued || []).map((med: DiscontinuedMedication, index: number) => (
          <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < (data.medications.discontinued || []).length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <FormGrid>
              <TextField
                label="Medication Name"
                value={med.name}
                onChange={(e) => {
                  const updated = [...(data.medications.discontinued || [])];
                  updated[index].name = e.target.value;
                  onChange('medications.discontinued', updated);
                }}
                placeholder="e.g., Metformin"
                fullWidth
              />
              
              <TextField
                label="Strength"
                value={med.strength}
                onChange={(e) => {
                  const updated = [...(data.medications.discontinued || [])];
                  updated[index].strength = e.target.value;
                  onChange('medications.discontinued', updated);
                }}
                placeholder="e.g., 500mg"
                fullWidth
              />
              
              <TextField
                label="Reason for Discontinuation"
                value={med.reason}
                onChange={(e) => {
                  const updated = [...(data.medications.discontinued || [])];
                  updated[index].reason = e.target.value;
                  onChange('medications.discontinued', updated);
                }}
                placeholder="e.g., Side effects"
                fullWidth
              />
              
              <TextField
                label="Discontinued Date"
                value={med.discontinuedDate}
                onChange={(e) => {
                  const updated = [...(data.medications.discontinued || [])];
                  updated[index].discontinuedDate = e.target.value;
                  onChange('medications.discontinued', updated);
                }}
                placeholder="MM/DD/YYYY"
                fullWidth
              />
              
              <TextField
                label="Prescribed By"
                value={med.prescribedBy}
                onChange={(e) => {
                  const updated = [...(data.medications.discontinued || [])];
                  updated[index].prescribedBy = e.target.value;
                  onChange('medications.discontinued', updated);
                }}
                placeholder="Provider name"
                fullWidth
              />
            </FormGrid>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>

    {/* Surgical History Accordion */}
    <Accordion 
      expanded={expandedSections.has('surgicalHistory')}
      onChange={() => onToggleSection('surgicalHistory')}
      sx={styles.enhancedAccordion}
    >
      <AccordionSummary 
        expandIcon={<ExpandMoreIcon />}
        sx={styles.enhancedAccordionSummary}
      >
        <Typography sx={styles.accordionTitle}>
          {getAccordionIcon('surgical')} Surgical History
          <Box component="span" sx={styles.accordionBadge}>
            {(data.surgicalHistory || []).length}
          </Box>
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={styles.enhancedAccordionDetails}>
        {(data.surgicalHistory || []).map((surgery: SurgicalHistory, index: number) => (
          <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < (data.surgicalHistory || []).length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <FormGrid>
              <TextField
                label="Procedure"
                value={surgery.procedure}
                onChange={(e) => {
                  const updated = [...(data.surgicalHistory || [])];
                  updated[index].procedure = e.target.value;
                  onChange('surgicalHistory', updated);
                }}
                placeholder="e.g., Appendectomy"
                fullWidth
              />
              
              <TextField
                label="Date"
                value={surgery.date}
                onChange={(e) => {
                  const updated = [...(data.surgicalHistory || [])];
                  updated[index].date = e.target.value;
                  onChange('surgicalHistory', updated);
                }}
                placeholder="MM/DD/YYYY"
                fullWidth
              />
              
              <TextField
                label="Hospital"
                value={surgery.hospital}
                onChange={(e) => {
                  const updated = [...(data.surgicalHistory || [])];
                  updated[index].hospital = e.target.value;
                  onChange('surgicalHistory', updated);
                }}
                placeholder="Hospital name"
                fullWidth
              />
              
              <TextField
                label="Surgeon"
                value={surgery.surgeon}
                onChange={(e) => {
                  const updated = [...(data.surgicalHistory || [])];
                  updated[index].surgeon = e.target.value;
                  onChange('surgicalHistory', updated);
                }}
                placeholder="Surgeon name"
                fullWidth
              />
              
              <TextField
                label="Complications"
                value={surgery.complications}
                onChange={(e) => {
                  const updated = [...(data.surgicalHistory || [])];
                  updated[index].complications = e.target.value;
                  onChange('surgicalHistory', updated);
                }}
                placeholder="Any complications or notes..."
                multiline
                rows={2}
                fullWidth
                sx={{ gridColumn: 'span 2' }}
              />
            </FormGrid>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>

    {/* Family History Accordion */}
    <Accordion 
      expanded={expandedSections.has('familyHistory')}
      onChange={() => onToggleSection('familyHistory')}
      sx={styles.enhancedAccordion}
    >
      <AccordionSummary 
        expandIcon={<ExpandMoreIcon />}
        sx={styles.enhancedAccordionSummary}
      >
        <Typography sx={styles.accordionTitle}>
          {getAccordionIcon('family')} Family History
          <Box component="span" sx={styles.accordionBadge}>
            {(data.familyHistory || []).length}
          </Box>
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={styles.enhancedAccordionDetails}>
        {(data.familyHistory || []).map((family: FamilyHistory, index: number) => (
          <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < (data.familyHistory || []).length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <FormGrid>
              <TextField
                label="Relation"
                value={family.relation}
                onChange={(e) => {
                  const updated = [...(data.familyHistory || [])];
                  updated[index].relation = e.target.value;
                  onChange('familyHistory', updated);
                }}
                placeholder="e.g., Father, Mother"
                fullWidth
              />
              
              <TextField
                label="Conditions (comma-separated)"
                value={family.conditions.join(', ')}
                onChange={(e) => {
                  const updated = [...(data.familyHistory || [])];
                  updated[index].conditions = e.target.value.split(',').map(c => c.trim()).filter(c => c);
                  onChange('familyHistory', updated);
                }}
                placeholder="e.g., Diabetes, Heart Disease"
                fullWidth
              />
              
              <TextField
                label="Age at Death"
                value={family.ageAtDeath}
                onChange={(e) => {
                  const updated = [...(data.familyHistory || [])];
                  updated[index].ageAtDeath = e.target.value;
                  onChange('familyHistory', updated);
                }}
                placeholder="e.g., 75 or Living"
                fullWidth
              />
              
              <TextField
                label="Cause of Death"
                value={family.causeOfDeath}
                onChange={(e) => {
                  const updated = [...(data.familyHistory || [])];
                  updated[index].causeOfDeath = e.target.value;
                  onChange('familyHistory', updated);
                }}
                placeholder="e.g., Heart Attack or N/A"
                fullWidth
              />
            </FormGrid>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  </Box>
);

// Lab Results Section Component - Updated to use LaboratoryReportData
const LabResultsSection: React.FC<LabResultsSectionProps> = ({ data, onChange }) => {
  if (!data) return null;

  const handleFieldChange = (field: string, value: any) => {
    const updated = { ...data, [field]: value };
    onChange(updated);
  };

  const handleResultChange = (resultIndex: number, field: string, value: any) => {
    const updated = { ...data };
    updated.results = [...data.results];
    updated.results[resultIndex] = { ...updated.results[resultIndex], [field]: value };
    onChange(updated);
  };

  return (
    <Box>      
      <SubTitle>Test Information</SubTitle>
      <FormGrid sx={{ mb: 4 }}>
        <TextField
          label="Test Name"
          value={data.testName}
          onChange={(e) => handleFieldChange('testName', e.target.value)}
          fullWidth
        />
        
        <TextField
          label="Specimen Type"
          value={data.specimenType}
          onChange={(e) => handleFieldChange('specimenType', e.target.value)}
          fullWidth
        />
        
        <TextField
          label="Collection Date"
          value={data.specimenCollectionDate}
          onChange={(e) => handleFieldChange('specimenCollectionDate', e.target.value)}
          placeholder="MM/DD/YYYY"
          fullWidth
        />
        
        <TextField
          label="Report Date"
          value={data.reportDate}
          onChange={(e) => handleFieldChange('reportDate', e.target.value)}
          placeholder="MM/DD/YYYY"
          fullWidth
        />
        
        <TextField
          label="Ordering Physician"
          value={data.orderingPhysician}
          onChange={(e) => handleFieldChange('orderingPhysician', e.target.value)}
          fullWidth
        />
      </FormGrid>

      <SubTitle>Test Results ({data.results.length})</SubTitle>
      {data.results.map((result, index) => (
        <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < data.results.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
          <FormGrid>
            <TextField
              label="Parameter"
              value={result.parameter}
              onChange={(e) => handleResultChange(index, 'parameter', e.target.value)}
              placeholder="e.g., WBC"
              fullWidth
            />
            
            <TextField
              label="Value"
              value={result.value}
              onChange={(e) => handleResultChange(index, 'value', e.target.value)}
              placeholder="e.g., 7.5"
              fullWidth
            />
            
            <TextField
              label="Unit"
              value={result.unit}
              onChange={(e) => handleResultChange(index, 'unit', e.target.value)}
              placeholder="e.g., K/uL"
              fullWidth
            />
            
            <TextField
              label="Reference Range"
              value={result.referenceRange}
              onChange={(e) => handleResultChange(index, 'referenceRange', e.target.value)}
              placeholder="e.g., 4.5-11.0"
              fullWidth
            />
            
            <FormControl fullWidth>
              <InputLabel>Flag</InputLabel>
              <Select
                value={result.flag}
                onChange={(e) => handleResultChange(index, 'flag', e.target.value)}
                label="Flag"
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Normal">Normal</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
                <MenuItem value="Abnormal">Abnormal</MenuItem>
              </Select>
            </FormControl>
          </FormGrid>
        </Box>
      ))}
    </Box>
  );
};

// Visit Record Section Component - Combined Visit Notes and Vital Signs
const VisitRecordSection: React.FC<VisitNotesSectionProps> = ({ data, onChange }) => {
  if (!data || !data.visit) return null;

  const handleVisitChange = (field: string, value: any) => {
    const updated = { ...data };
    updated.visit = { ...data.visit, [field]: value };
    onChange(updated);
  };

  const handleVitalChange = (field: string, value: any) => {
    const updated = { ...data };
    updated.vitalSigns = { ...data.vitalSigns, [field]: value };
    onChange(updated);
  };

  const visit = data.visit;

  return (
    <Box>
      <SubTitle>Visit Information</SubTitle>
      <FormGrid sx={{ mb: 4 }}>
        <TextField
          label="Visit Date"
          value={visit.date}
          onChange={(e) => handleVisitChange('date', e.target.value)}
          placeholder="MM/DD/YYYY"
          fullWidth
        />
        
        <TextField
          label="Visit Type"
          value={visit.type}
          onChange={(e) => handleVisitChange('type', e.target.value)}
          placeholder="e.g., Follow-up, Annual Physical"
          fullWidth
        />
        
        <TextField
          label="Duration"
          value={visit.duration}
          onChange={(e) => handleVisitChange('duration', e.target.value)}
          placeholder="e.g., 30 minutes"
          fullWidth
        />
        
        <TextField
          label="Provider"
          value={visit.provider}
          onChange={(e) => handleVisitChange('provider', e.target.value)}
          placeholder="Provider name"
          fullWidth
        />
        
        <TextField
          label="Chief Complaint"
          value={visit.chiefComplaint}
          onChange={(e) => handleVisitChange('chiefComplaint', e.target.value)}
          placeholder="Patient's main concern..."
          multiline
          rows={2}
          fullWidth
          sx={{ gridColumn: 'span 2' }}
        />
        
        <TextField
          label="Assessment (comma-separated)"
          value={visit.assessment.join(', ')}
          onChange={(e) => handleVisitChange('assessment', e.target.value.split(',').map(a => a.trim()).filter(a => a))}
          placeholder="Diagnoses and findings..."
          multiline
          rows={2}
          fullWidth
          sx={{ gridColumn: 'span 2' }}
        />
        
        <TextField
          label="Plan (comma-separated)"
          value={visit.plan.join(', ')}
          onChange={(e) => handleVisitChange('plan', e.target.value.split(',').map(p => p.trim()).filter(p => p))}
          placeholder="Treatment plan and next steps..."
          multiline
          rows={2}
          fullWidth
          sx={{ gridColumn: 'span 2' }}
        />
      </FormGrid>
      
      <SubTitle>Vital Signs</SubTitle>
      <FormGrid>
        <TextField
          label="Blood Pressure"
          value={data.vitalSigns.bloodPressure}
          onChange={(e) => handleVitalChange('bloodPressure', e.target.value)}
          placeholder="120/80"
          fullWidth
        />
        
        <TextField
          label="Heart Rate (bpm)"
          type="number"
          value={data.vitalSigns.heartRate}
          onChange={(e) => handleVitalChange('heartRate', parseInt(e.target.value) || 0)}
          placeholder="72"
          fullWidth
        />
        
        <TextField
          label="Temperature (°F)"
          type="number"
          value={data.vitalSigns.temperature}
          onChange={(e) => handleVitalChange('temperature', parseFloat(e.target.value) || 0)}
          placeholder="98.6"
          fullWidth
          inputProps={{ step: 0.1 }}
        />
        
        <TextField
          label="Weight (lbs)"
          type="number"
          value={data.vitalSigns.weight}
          onChange={(e) => handleVitalChange('weight', parseInt(e.target.value) || 0)}
          placeholder="150"
          fullWidth
        />
        
        <TextField
          label="Height"
          value={data.vitalSigns.height}
          onChange={(e) => handleVitalChange('height', e.target.value)}
          placeholder="5'8&quot;"
          fullWidth
        />
        
        <TextField
          label="BMI"
          value={data.vitalSigns.bmi}
          onChange={(e) => handleVitalChange('bmi', e.target.value)}
          placeholder="22.8"
          fullWidth
        />
        
        <TextField
          label="Oxygen Saturation (%)"
          type="number"
          value={data.vitalSigns.oxygenSaturation}
          onChange={(e) => handleVitalChange('oxygenSaturation', parseInt(e.target.value) || 0)}
          placeholder="98"
          fullWidth
        />
        
        <TextField
          label="Respiratory Rate (breaths/min)"
          type="number"
          value={data.vitalSigns.respiratoryRate}
          onChange={(e) => handleVitalChange('respiratoryRate', parseInt(e.target.value) || 0)}
          placeholder="16"
          fullWidth
        />
      </FormGrid>
    </Box>
  );
};

export default EditDataStep;

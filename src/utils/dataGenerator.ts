import { faker } from '@faker-js/faker';
import {
  Individual,
  InsuranceInfo,
  Provider,
  Address,
  Insurance,
  ClaimInfo,
  LabReport,
  LabTestType,
  LabTestResult,
  SurgicalHistory,
  Allergy,
  Complexity,
  FamilyHistory,
  Medications,
  ChronicCondition,
  CurrentMedication,
  DiscontinuedMedication,
  MedicalHistory,
  LabReports,
  VitalSigns,
  VisitReport,
  VisitNote,
  CMS1500,
  Insured,
  Subscriber,
  InsuranceTypeSchema,
  W2,
  Passport
} from './zodSchemas';

import { DataPreset } from './zodSchemas';

// ============================================================================
// CONSTANTS AND TYPE DEFINITIONS
// ============================================================================

// Medical Specialties
export const MEDICAL_SPECIALTIES = [
  'Family Medicine',
  'Internal Medicine',
  'General Practice',
  'Pediatrics',
  'Geriatrics',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Hematology',
  'Nephrology',
  'Neurology',
  'Obstetrics and Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Otolaryngology (ENT)',
  'Psychiatry',
  'Pulmonology',
  'Rheumatology',
  'Urology',
  'Emergency Medicine',
  'Anesthesiology',
  'Radiology',
  'Pathology'
] as const;

export type MedicalSpecialty = typeof MEDICAL_SPECIALTIES[number];

export const FACILITY_NAMES = [
  'City Medical Center',
  'Regional Health Clinic',
  'Community Health Associates',
  'Primary Care Partners',
  'Family Health Center',
  'Medical Arts Building',
  'Healthcare Plaza',
  'Medical Group Associates',
  'University Hospital',
  'Memorial Medical Center',
  'St. Mary\'s Hospital',
  'General Hospital',
  'County Medical Center',
  'Mercy Hospital',
  'Providence Health Center',
  'Valley View Medical Group',
  'Lakeside Clinic',
  'Mountain View Healthcare',
  'Riverside Medical Associates',
  'Central Health Clinic',
  'Metro Medical Center',
  'Suburban Health Services',
  'Northwest Medical Group',
  'Eastside Family Medicine',
  'Southside Health Partners'
] as const;

export type FacilityName = typeof FACILITY_NAMES[number];

export const PHARMACY_NAMES = [
  'CVS Pharmacy',
  'Walgreens',
  'Rite Aid',
  'Walmart Pharmacy',
  'Target Pharmacy',
  'Kroger Pharmacy',
  'Safeway Pharmacy',
  'Community Pharmacy',
  'HealthMart Pharmacy',
  'Costco Pharmacy'
] as const;

export type PharmacyName = typeof PHARMACY_NAMES[number];

export const INSURANCE_COMPANIES = [
  'Blue Cross Blue Shield',
  'Aetna',
  'Cigna',
  'UnitedHealthcare',
  'Humana',
  'Kaiser Permanente',
  'Medicare',
  'Medicaid',
  'Anthem',
  'Independence Blue Cross',
  'HealthPartners',
  'Molina Healthcare',
  'WellCare',
  'Centene',
  'Oscar Health',
  'Bright Health',
  'Tricare',
  'Geisinger Health Plan',
  'HealthFirst',
  'EmblemHealth'
] as const;

export type InsuranceCompany = typeof INSURANCE_COMPANIES[number];

export const INSURANCE_PLAN_TYPES = [
  'HMO',
  'PPO',
  'EPO',
  'POS',
  'HDHP',
  'Indemnity'
] as const;

export type InsurancePlanType = typeof INSURANCE_PLAN_TYPES[number];


export const COPAY_AMOUNTS = [
  '$0',
  '$10',
  '$15',
  '$20',
  '$25',
  '$30',
  '$35',
  '$40',
  '$45',
  '$50',
  '$75',
  '$100'
] as const;

export type CopayAmount = typeof COPAY_AMOUNTS[number];

export const DEDUCTIBLE_AMOUNTS = [
  '$0',
  '$250',
  '$500',
  '$750',
  '$1000',
  '$1500',
  '$2000',
  '$2500',
  '$3000',
  '$4000',
  '$5000',
  '$6000',
  '$7500',
  '$10000'
] as const;

export type DeductibleAmount = typeof DEDUCTIBLE_AMOUNTS[number];

export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Retail',
  'Manufacturing',
  'Education',
  'Construction',
  'Transportation',
  'Energy',
  'Telecommunications',
  'Media & Entertainment',
  'Real Estate',
  'Professional Services',
  'Hospitality',
  'Pharmaceuticals',
  'Aerospace & Defense',
  'Automotive',
  'Agriculture',
  'Legal Services',
  'Human Resources',
  'Marketing & Advertising',
  'Consulting',
  'Software Development',
  'Financial Services',
  'Insurance',
  'Utilities',
  'Logistics',
  'Food & Beverage',
  'Fashion & Retail',
  'Publishing'
] as const;

export type Industry = typeof INDUSTRIES[number];

// Data generation presets
export const DATA_GENERATION_PRESETS: Record<string, DataPreset> = {
  simple: {
    name: 'Simple Patient',
    description: 'Basic patient with minimal medical history',
    options: {
      complexity: 'low',
      numberOfVisits: 1,
      numberOfLabTests: 1,
      includeSecondaryInsurance: false
    }
  },
  standard: {
    name: 'Standard Patient',
    description: 'Typical patient with moderate medical complexity',
    options: {
      complexity: 'medium',
      numberOfVisits: 2,
      numberOfLabTests: 2,
      includeSecondaryInsurance: true
    }
  },
  complex: {
    name: 'Complex Patient',
    description: 'Patient with multiple conditions and extensive history',
    options: {
      complexity: 'high',
      numberOfVisits: 3,
      numberOfLabTests: 3,
      includeSecondaryInsurance: true
    }
  }
};

// Medical conditions and medications
export const MEDICAL_CONDITIONS: string[] = [
  'Hypertension', 'Diabetes Type 2', 'Hyperlipidemia', 'Asthma', 'COPD',
  'Arthritis', 'Depression', 'Anxiety', 'Migraine', 'GERD',
  'Thyroid Disease', 'Osteoporosis', 'Allergic Rhinitis', 'Sleep Apnea',
  'Atrial Fibrillation', 'Chronic Kidney Disease', 'Heart Disease'
];

export const MEDICATIONS: string[] = [
  'Lisinopril 10mg', 'Metformin 500mg', 'Atorvastatin 20mg', 'Albuterol inhaler',
  'Levothyroxine 50mcg', 'Omeprazole 20mg', 'Sertraline 50mg', 'Ibuprofen 400mg',
  'Acetaminophen 500mg', 'Vitamin D3 1000IU', 'Multivitamin', 'Aspirin 81mg',
  'Prednisone 10mg', 'Losartan 50mg', 'Amlodipine 5mg', 'Gabapentin 300mg'
];

// Allergies and adverse reactions
export const ALLERGY_NAMES = [
  { name: 'Penicillin', reaction: 'Severe rash and difficulty breathing', severity: 'High' },
  { name: 'Sulfa drugs', reaction: 'Hives and swelling', severity: 'Moderate' },
  { name: 'Latex', reaction: 'Contact dermatitis and itching', severity: 'Moderate' },
  { name: 'Shellfish', reaction: 'Hives and swelling', severity: 'Moderate' },
  { name: 'Nuts', reaction: 'Anaphylactic reaction', severity: 'High' },
  { name: 'Pollen', reaction: 'Seasonal allergies, sneezing', severity: 'Low' }
];

// Surgical and family history
export const SURGICAL_PROCEDURES = [
  'Appendectomy', 'Cholecystectomy', 'Hernia repair', 'Knee arthroscopy',
  'Cataract surgery', 'Colonoscopy', 'Skin lesion removal', 'Gallbladder removal'
] as const;

export const HOSPITALS = [
  'Springfield Medical Center', 'Regional Hospital', 'City General Hospital',
  'University Medical Center', 'Community Health Center'
] as const;

export const SURGICAL_COMPLICATIONS = [
  'None', 'Minor bleeding', 'Infection', 'Delayed healing', 'None reported'
] as const;

export const FAMILY_CONDITIONS = [
  'Diabetes', 'Hypertension', 'Cancer', 'Heart disease', 'Stroke'
] as const;

export const CAUSES_OF_DEATH = [
  'Cancer', 'Heart disease', 'Stroke', 'Natural causes', 'Heart attack'
] as const;

// Condition statuses and medication details
export const CONDITION_STATUSES = [
  'Active', 'Stable', 'Improving', 'Monitoring'
] as const;

export const CONDITION_NOTES = [
  'Well controlled with medication',
  'Regular monitoring required',
  'Lifestyle modifications recommended',
  'Specialist follow-up scheduled',
  'Patient compliant with treatment'
] as const;

export const DOSAGE_FREQUENCIES = [
  'Once daily', 'Twice daily', 'Three times daily', 'As needed'
] as const;

export const MEDICATION_INSTRUCTIONS = [
  'Take with food', 'Take on empty stomach', 'Take at bedtime',
  'Take with plenty of water', 'Do not crush or chew', 'May cause drowsiness'
] as const;

export const DISCONTINUATION_REASONS = [
  'Adverse reaction', 'No longer needed', 'Replaced with better option',
  'Side effects', 'Cost concerns', 'Drug interaction', 'Ineffective'
] as const;

// Condition-medication mapping
export const CONDITION_MEDICATION_MAP: Record<string, Array<{ name: string, strength: string, purpose: string }>> = {
  'Hypertension': [
    { name: 'Lisinopril', strength: '10mg', purpose: 'Blood pressure control' },
    { name: 'Losartan', strength: '50mg', purpose: 'Blood pressure control' },
    { name: 'Amlodipine', strength: '5mg', purpose: 'Blood pressure control' }
  ],
  'Diabetes Type 2': [
    { name: 'Metformin', strength: '500mg', purpose: 'Diabetes management' },
    { name: 'Glipizide', strength: '5mg', purpose: 'Blood sugar control' }
  ],
  'Hyperlipidemia': [
    { name: 'Atorvastatin', strength: '20mg', purpose: 'Cholesterol management' },
    { name: 'Simvastatin', strength: '40mg', purpose: 'Cholesterol management' }
  ],
  'Asthma': [
    { name: 'Albuterol', strength: 'inhaler', purpose: 'Asthma control' },
    { name: 'Fluticasone', strength: 'inhaler', purpose: 'Asthma prevention' }
  ],
  'COPD': [
    { name: 'Albuterol', strength: 'inhaler', purpose: 'COPD management' },
    { name: 'Tiotropium', strength: 'inhaler', purpose: 'COPD control' }
  ],
  'Depression': [
    { name: 'Sertraline', strength: '50mg', purpose: 'Depression treatment' },
    { name: 'Escitalopram', strength: '10mg', purpose: 'Depression management' }
  ],
  'Anxiety': [
    { name: 'Buspirone', strength: '10mg', purpose: 'Anxiety management' },
    { name: 'Hydroxyzine', strength: '25mg', purpose: 'Anxiety relief' }
  ],
  'Thyroid Disease': [
    { name: 'Levothyroxine', strength: '50mcg', purpose: 'Thyroid regulation' }
  ],
  'GERD': [
    { name: 'Omeprazole', strength: '20mg', purpose: 'Acid reflux control' },
    { name: 'Pantoprazole', strength: '40mg', purpose: 'Stomach acid reduction' }
  ],
  'Arthritis': [
    { name: 'Ibuprofen', strength: '400mg', purpose: 'Pain and inflammation relief' },
    { name: 'Naproxen', strength: '500mg', purpose: 'Arthritis pain management' }
  ]
} as const;

// General medications
export const GENERAL_MEDICATIONS = [
  { name: 'Vitamin D3', strength: '1000IU', purpose: 'Bone health', dosage: 'Daily' },
  { name: 'Multivitamin', strength: 'As directed', purpose: 'General health', dosage: 'Daily' },
  { name: 'Aspirin', strength: '81mg', purpose: 'Heart health', dosage: 'Daily' },
  { name: 'Acetaminophen', strength: '500mg', purpose: 'Pain relief', dosage: 'As needed' },
  { name: 'Calcium', strength: '600mg', purpose: 'Bone health', dosage: 'Twice daily' },
  { name: 'Fish Oil', strength: '1000mg', purpose: 'Heart health', dosage: 'Daily' },
  { name: 'Probiotic', strength: 'As directed', purpose: 'Digestive health', dosage: 'Daily' },
  { name: 'Vitamin B12', strength: '1000mcg', purpose: 'Energy and nerve health', dosage: 'Daily' },
  { name: 'Magnesium', strength: '400mg', purpose: 'Muscle and nerve function', dosage: 'Daily' },
  { name: 'Zinc', strength: '50mg', purpose: 'Immune support', dosage: 'Daily' }
] as const;

// Visit reports and assessments
export const VISIT_TYPES: string[] = [
  'Annual Physical Exam', 'Follow-up Visit', 'Sick Visit', 'Preventive Care',
  'Chronic Disease Management', 'Medication Review', 'Consultation',
  'Emergency Visit', 'Urgent Care', 'Specialist Referral'
];

export const CHIEF_COMPLAINTS: string[] = [
  'Annual wellness exam',
  'Follow-up for hypertension',
  'Chest pain',
  'Shortness of breath',
  'Abdominal pain',
  'Headache',
  'Back pain',
  'Fatigue',
  'Cough and cold symptoms',
  'Joint pain',
  'Diabetes management',
  'Medication refill',
  'Skin rash',
  'Fever'
];

export const VISIT_ASSESSMENTS: string[][] = [
  ['Hypertension, controlled', 'Type 2 Diabetes Mellitus, stable'],
  ['Acute upper respiratory infection'],
  ['Chest pain, rule out cardiac origin', 'Hypertension, uncontrolled'],
  ['Gastroesophageal reflux disease (GERD)'],
  ['Migraine headache without aura'],
  ['Acute low back pain'],
  ['Generalized anxiety disorder'],
  ['Hyperlipidemia'],
  ['Osteoarthritis, right knee'],
  ['Allergic rhinitis'],
  ['Acute bronchitis'],
  ['Essential hypertension', 'Hyperlipidemia', 'Obesity']
];

export const VISIT_PLANS: string[][] = [
  ['Continue current medications', 'Follow-up in 3 months', 'Labs ordered: CBC, CMP, HbA1c'],
  ['Prescribed Amoxicillin 500mg TID x 7 days', 'Rest and fluids', 'Return if symptoms worsen'],
  ['ECG performed - normal sinus rhythm', 'Cardiac enzymes ordered', 'Chest X-ray ordered', 'Follow-up in 48 hours or sooner if symptoms worsen'],
  ['Prescribed Omeprazole 20mg daily', 'Dietary modifications advised', 'Follow-up in 4 weeks'],
  ['Prescribed Sumatriptan 50mg PRN', 'Headache diary recommended', 'Follow-up in 2 months'],
  ['Physical therapy referral', 'NSAIDs as needed', 'Core strengthening exercises', 'Follow-up in 6 weeks'],
  ['Continue current SSRIs', 'Referral to counseling services', 'Follow-up in 4 weeks'],
  ['Start Atorvastatin 20mg daily', 'Diet and exercise counseling', 'Lipid panel in 3 months'],
  ['Referral to orthopedics', 'NSAIDs for pain', 'Weight loss counseling', 'Follow-up in 4 weeks'],
  ['Prescribed Fluticasone nasal spray', 'Avoid known allergens', 'Follow-up PRN'],
  ['Prescribed Benzonatate 200mg TID PRN', 'Cough suppressant', 'Increase fluid intake', 'Follow-up if no improvement in 1 week'],
  ['Increase Lisinopril to 20mg daily', 'Continue Metformin', 'Weight management plan', 'Follow-up in 2 months with labs']
];

// ICD-10 Diagnosis Codes
export const DIAGNOSIS_CODES: string[] = [
  // Common chronic conditions
  'I10',      // Essential hypertension
  'E11.9',    // Type 2 diabetes mellitus without complications
  'E11.65',   // Type 2 diabetes with hyperglycemia
  'E78.5',    // Hyperlipidemia, unspecified
  'E78.0',    // Pure hypercholesterolemia
  'Z00.00',   // General adult medical examination without abnormal findings
  'J44.9',    // COPD, unspecified
  'J44.1',    // COPD with acute exacerbation
  'M19.90',   // Osteoarthritis, unspecified site
  'M79.3',    // Panniculitis, unspecified
  'F41.9',    // Anxiety disorder, unspecified
  'F32.9',    // Major depressive disorder, single episode, unspecified
  'K21.9',    // GERD without esophagitis
  'G43.909',  // Migraine, unspecified, not intractable, without status migrainosus
  'M54.5',    // Low back pain
  'J45.909',  // Asthma, unspecified, uncomplicated
  'N18.3',    // Chronic kidney disease, stage 3
  'E66.9',    // Obesity, unspecified
  'K58.9',    // Irritable bowel syndrome without diarrhea
  'R51',      // Headache

  // Critical diseases - Cardiovascular
  'I21.3',    // ST elevation myocardial infarction (STEMI)
  'I21.4',    // Non-ST elevation myocardial infarction (NSTEMI)
  'I50.9',    // Heart failure, unspecified
  'I50.23',   // Acute on chronic systolic heart failure
  'I63.9',    // Cerebral infarction (stroke), unspecified
  'I64',      // Stroke, not specified as hemorrhage or infarction
  'I48.91',   // Atrial fibrillation, unspecified
  'I71.4',    // Abdominal aortic aneurysm, without rupture

  // Critical diseases - Cancer
  'C50.919',  // Malignant neoplasm of breast, unspecified
  'C34.90',   // Malignant neoplasm of lung, unspecified
  'C18.9',    // Malignant neoplasm of colon, unspecified
  'C61',      // Malignant neoplasm of prostate
  'C25.9',    // Malignant neoplasm of pancreas, unspecified
  'C79.51',   // Secondary malignant neoplasm of bone
  'C91.10',   // Chronic lymphocytic leukemia, not having achieved remission

  // Critical diseases - Respiratory
  'J18.9',    // Pneumonia, unspecified organism
  'J96.00',   // Acute respiratory failure, unspecified
  'J80',      // Acute respiratory distress syndrome (ARDS)
  'J81.0',    // Acute pulmonary edema

  // Critical diseases - Neurological
  'G40.909',  // Epilepsy, unspecified, not intractable, without status epilepticus
  'G20',      // Parkinson's disease
  'G30.9',    // Alzheimer's disease, unspecified
  'G35',      // Multiple sclerosis

  // Critical diseases - Renal
  'N17.9',    // Acute kidney failure, unspecified
  'N18.6',    // End stage renal disease

  // Critical diseases - Infectious
  'A41.9',    // Sepsis, unspecified organism
  'B20',      // HIV disease
  'U07.1',    // COVID-19

  // Critical diseases - Other
  'E10.65',   // Type 1 diabetes with hyperglycemia
  'K72.90',   // Hepatic failure, unspecified without coma
  'D61.9',    // Aplastic anemia, unspecified
];

// ============================================================================
// GENERATOR FUNCTIONS - BASIC BUILDING BLOCKS
// ============================================================================

/**
 * Generate an address
 */
export const generateAddress = (country: string | null = 'USA'): Address => {
  return {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode('#####'),
    country
  };
};

/**
 * Generate contact information
 */
export const generateContact = () => {
  return {
    phone: `(${faker.string.numeric(3)}) ${faker.string.numeric(3)}-${faker.string.numeric(4)}`,
    email: faker.internet.email(),
    emergencyContact: `${faker.person.fullName()} - (${faker.string.numeric(3)}) ${faker.string.numeric(3)}-${faker.string.numeric(4)}`
  };
};

/**
 * Generate pharmacy information
 */
export const generatePharmacy = () => {
  const cityName = faker.location.city();
  const pharmacyName = faker.helpers.arrayElement(PHARMACY_NAMES);
  const fullPharmacyName = pharmacyName.includes('Pharmacy')
    ? `${cityName} ${pharmacyName}`
    : `${cityName} ${pharmacyName} Pharmacy`;

  return {
    name: fullPharmacyName,
    address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state({ abbreviated: true })} ${faker.location.zipCode()}`,
    phone: `(${faker.string.numeric(3)}) ${faker.string.numeric(3)}-${faker.string.numeric(4)}`
  };
};

// ============================================================================
// GENERATOR FUNCTIONS - INDIVIDUAL AND PROVIDER
// ============================================================================

/**
 * Generate individual demographics
 */
export const generateIndividual = (): Individual => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const middleInitial = faker.string.alpha({ length: 1, casing: 'upper' });
  const dateOfBirth = faker.date.birthdate({ min: 18, max: 85, mode: 'age' });
  const gender = faker.helpers.arrayElement(['Male', 'Female', 'Other'] as const);

  // Calculate accurate age
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }

  // Generate consistent IDs
  const patientId = `PAT-${faker.string.numeric(6)}`;
  const mrn = `MRN-${faker.string.numeric(8)}`;

  // Generate employer information
  const companyName = faker.company.name();
  const industry = faker.helpers.arrayElement(INDUSTRIES);
  const employerEIN = `${faker.number.int({ min: 10, max: 99 })}-${faker.number.int({ min: 1000000, max: 9999999 })}`;
  const employerAddress = generateAddress();
  const employerPhone = faker.phone.number();

  return {
    id: patientId,
    name: `${lastName}, ${firstName} ${middleInitial}`,
    firstName,
    lastName,
    middleInitial,
    dateOfBirth: dateOfBirth.toLocaleDateString('en-US'),
    age,
    gender: gender,
    address: generateAddress(),
    contact: generateContact(),
    pharmacy: generatePharmacy(),
    medicalRecordNumber: mrn,
    ssn: faker.helpers.replaceSymbols('###-##-####'),
    accountNumber: patientId,
    // Employer Information
    companyName,
    employerEIN,
    employerAddress,
    employerIndustry: industry,
    employerPhone
  };
};

/**
 * Generate provider information
 */
export const generateProvider = (): Provider => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const providerNPI = faker.string.numeric(10);
  const facilityNPI = faker.string.numeric(10);
  const specialty = faker.helpers.arrayElement(MEDICAL_SPECIALTIES);

  // Generate consistent facility information
  const facilityName = faker.helpers.arrayElement(FACILITY_NAMES);

  const facilityAddress = generateAddress();

  const providerAddress = faker.datatype.boolean(0.7)
    ? facilityAddress // 70% chance provider works at the facility
    : generateAddress();

  const facilityPhone = faker.phone.number();
  const taxId = faker.helpers.replaceSymbols('##-#######');

  return {
    name: `Dr. ${firstName} ${lastName}`,
    npi: providerNPI,
    specialty,
    phone: faker.phone.number(),
    address: providerAddress,
    taxId,
    taxIdType: 'EIN' as const,
    signature: `Dr. ${firstName} ${lastName}`,
    facilityName,
    facilityAddress,
    facilityPhone,
    facilityFax: faker.phone.number(),
    facilityNPI,
    billingName: facilityName,
    billingAddress: `${facilityAddress.street}, ${facilityAddress.city}, ${facilityAddress.state} ${facilityAddress.zipCode}`,
    billingPhone: facilityPhone,
    billingNPI: facilityNPI,
    referringProvider: faker.datatype.boolean(0.3) ? {
      name: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
      qualifier: faker.helpers.arrayElement(['DN', 'DK', 'DQ'] as const),
      npi: faker.string.numeric(10)
    } : null
  };
};

// ============================================================================
// GENERATOR FUNCTIONS - INSURANCE
// ============================================================================

/**
 * Generate insurance (policy) information
 * Returns just the Insurance object without subscriber/insured details
 */
export const generateInsurance = (excludeProvider?: string): Insurance => {
  // Ensure different provider if specified (useful for secondary insurance)
  const availableProviders = excludeProvider
    ? INSURANCE_COMPANIES.filter(p => p !== excludeProvider)
    : INSURANCE_COMPANIES;

  const provider = faker.helpers.arrayElement(availableProviders);
  const policyNumber = faker.string.alphanumeric({ length: 12, casing: 'upper' });
  const groupNumber = `GRP-${faker.string.alphanumeric({ length: 6, casing: 'upper' })}`;
  const effectiveDate = faker.date.past({ years: 2 });

  return {
    provider,
    policyNumber,
    groupNumber,
    memberId: policyNumber,
    effectiveDate: effectiveDate.toLocaleDateString('en-US'),
    copay: faker.helpers.arrayElement(COPAY_AMOUNTS),
    deductible: faker.helpers.arrayElement(DEDUCTIBLE_AMOUNTS)
  };
};

/**
 * Generate insured person information
 * Used for secondary insured or when subscriber is different from patient
 */
export const generateInsured = (
  policyNumber?: string,
  insuranceProvider?: string
): Insured => {
  const provider = insuranceProvider || faker.helpers.arrayElement(INSURANCE_COMPANIES);
  const policy = policyNumber || faker.string.alphanumeric({ length: 12, casing: 'upper' });

  return {
    name: `${faker.person.lastName()}, ${faker.person.firstName()}`,
    policyNumber: policy,
    planName: `${provider} ${faker.helpers.arrayElement(INSURANCE_PLAN_TYPES)} Plan`
  };
};

/**
 * Generate subscriber information
 * Used for insurance subscriber details (can be different from patient)
 */
export const generateSubscriber = (): Subscriber => {
  const gender = faker.helpers.arrayElement(['Male', 'Female', 'Other'] as const);

  return {
    name: `${faker.person.lastName()}, ${faker.person.firstName()} ${faker.string.alpha({ length: 1, casing: 'upper' })}`,
    dateOfBirth: faker.date.birthdate({ min: 18, max: 85, mode: 'age' }).toLocaleDateString('en-US'),
    gender,
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode('#####'),
      country: 'USA'
    },
    phone: faker.phone.number()
  };
};

/**
 * Generate complete insurance information with subscriber details
 * Uses the new modular generateInsurance() and generateInsured() functions
 */
export const generateInsuranceInfo = (
  individual: Individual,
  includeSecondary: boolean = false
): InsuranceInfo => {
  const primaryInsurance = generateInsurance();

  // 70% chance to use individual as subscriber
  const subscriber = faker.datatype.boolean(0.7) 
    ? {
        name: individual.name,
        dateOfBirth: individual.dateOfBirth,
        gender: individual.gender,
        address: individual.address,
        phone: individual.contact.phone
      }
    : generateSubscriber();

  // Generate secondary insurance if requested
  const secondaryInsurance = includeSecondary ? generateInsurance(primaryInsurance.provider) : null;
  const secondaryInsured = includeSecondary 
    ? generateInsured(secondaryInsurance!.policyNumber, secondaryInsurance!.provider) 
    : null;

  return {
    primaryInsurance,
    secondaryInsurance,
    subscriberName: subscriber.name,
    subscriberDOB: subscriber.dateOfBirth,
    subscriberGender: subscriber.gender,
    insuranceType: faker.helpers.arrayElement(InsuranceTypeSchema.options),
    picaCode: faker.datatype.boolean(0.3) ? faker.string.alphanumeric({ length: 2, casing: 'upper' }) : '',
    phone: subscriber.phone,
    address: subscriber.address,
    secondaryInsured
  };
};

// ============================================================================
// GENERATOR FUNCTIONS - CLAIMS AND BILLING
// ============================================================================

/**
 * Generate a service line for CMS-1500
 */
export const generateServiceLine = (
  serviceDate: string,
  placeOfService: string,
  diagnosisCodes: string[],
  renderingProviderNPI: string
) => {
  const diagnosisPointers = diagnosisCodes.slice(0, 4).map((_, i) =>
    String.fromCharCode(65 + i) // A, B, C, D
  ).join('');

  // Select appropriate CPT code
  const procedures = [
    { code: '99214', charges: '200.00', description: 'Office visit level 4' },
    { code: '99213', charges: '150.00', description: 'Office visit level 3' },
    { code: '99215', charges: '250.00', description: 'Office visit level 5' },
    { code: '93000', charges: '45.00', description: 'ECG' },
    { code: '80053', charges: '85.00', description: 'Comprehensive metabolic panel' },
    { code: '85025', charges: '35.00', description: 'Complete blood count' },
  ];

  const selectedProcedure = faker.helpers.arrayElement(procedures);

  return {
    dateFrom: serviceDate,
    dateTo: serviceDate,
    placeOfService,
    emg: '',
    procedureCode: selectedProcedure.code,
    modifier: '',
    diagnosisPointer: diagnosisPointers.charAt(0) || 'A',
    charges: selectedProcedure.charges,
    units: '1',
    epsdt: '',
    idQual: '1B',
    renderingProviderNPI
  };
};

/**
 * Generate claim information for CMS-1500 forms
 * Creates chronologically consistent dates and diagnosis codes
 */
export const generateClaimInfo = (
  individual: Individual,
  insuranceInfo: InsuranceInfo,
  provider: Provider
): ClaimInfo => {
  // Generate dates in logical chronological order
  // 1. Date of illness (earliest, 15-45 days ago)
  const dateOfIllness = faker.date.recent({ days: faker.number.int({ min: 15, max: 45 }) });

  // 2. Hospitalization dates (if applicable, 5-15 days after illness)
  const hasHospitalization = faker.datatype.boolean(0.1);
  let hospitalizationFrom: Date | null = null;
  let hospitalizationTo: Date | null = null;
  if (hasHospitalization) {
    hospitalizationFrom = faker.date.between({
      from: new Date(dateOfIllness.getTime() + 5 * 24 * 60 * 60 * 1000),
      to: new Date(dateOfIllness.getTime() + 15 * 24 * 60 * 60 * 1000)
    });
    hospitalizationTo = faker.date.between({
      from: hospitalizationFrom,
      to: new Date(hospitalizationFrom.getTime() + 7 * 24 * 60 * 60 * 1000)
    });
  }

  // 3. Unable to work dates (if applicable, overlaps with illness/hospitalization)
  const hasUnableToWork = faker.datatype.boolean(0.1);
  let unableToWorkFrom: Date | null = null;
  let unableToWorkTo: Date | null = null;
  if (hasUnableToWork) {
    unableToWorkFrom = faker.date.between({
      from: dateOfIllness,
      to: new Date(dateOfIllness.getTime() + 10 * 24 * 60 * 60 * 1000)
    });
    unableToWorkTo = faker.date.between({
      from: unableToWorkFrom,
      to: new Date(unableToWorkFrom.getTime() + 14 * 24 * 60 * 60 * 1000)
    });
  }

  // 4. Service date (after illness, 7-30 days ago)
  const serviceDate = faker.date.recent({
    days: faker.number.int({ min: 7, max: 30 })
  });

  // Ensure service date is after illness date
  const adjustedServiceDate = serviceDate < dateOfIllness
    ? new Date(dateOfIllness.getTime() + faker.number.int({ min: 1, max: 7 }) * 24 * 60 * 60 * 1000)
    : serviceDate;

  // 5. Provider signature date (same as or shortly after service date)
  const providerSignatureDate = faker.date.between({
    from: adjustedServiceDate,
    to: new Date(adjustedServiceDate.getTime() + 3 * 24 * 60 * 60 * 1000)
  });

  // 6. Patient signature date (same as or after provider signature)
  const signatureDate = faker.date.between({
    from: providerSignatureDate,
    to: new Date(providerSignatureDate.getTime() + 2 * 24 * 60 * 60 * 1000)
  });

  // Other date (if applicable)
  const hasOtherDate = faker.datatype.boolean(0.2);
  const otherDate = hasOtherDate ? faker.date.between({
    from: dateOfIllness,
    to: adjustedServiceDate
  }) : null;

  const result: ClaimInfo = {
    patientRelationship: (() => {
      // Determine if patient is the subscriber      
      // If names match, patient is self; otherwise randomly select relationship
      return insuranceInfo.subscriberName === `${individual.firstName} ${individual.lastName}`
        ? 'self' as const
        : faker.helpers.arrayElement(['spouse', 'child', 'other'] as const);
    })(),
    signatureDate: signatureDate.toLocaleDateString('en-US'),
    providerSignatureDate: providerSignatureDate.toLocaleDateString('en-US'),
    dateOfIllness: dateOfIllness.toLocaleDateString('en-US'),
    serviceDate: adjustedServiceDate.toLocaleDateString('en-US'),  // Add service date for use in service lines
    illnessQualifier: faker.helpers.arrayElement(['431', '484', '439']),
    otherDate: otherDate ? otherDate.toLocaleDateString('en-US') : '',
    otherDateQualifier: otherDate ? faker.helpers.arrayElement(['454', '304', '453']) : '',
    unableToWorkFrom: unableToWorkFrom ? unableToWorkFrom.toLocaleDateString('en-US') : '',
    unableToWorkTo: unableToWorkTo ? unableToWorkTo.toLocaleDateString('en-US') : '',
    hospitalizationFrom: hospitalizationFrom ? hospitalizationFrom.toLocaleDateString('en-US') : '',
    hospitalizationTo: hospitalizationTo ? hospitalizationTo.toLocaleDateString('en-US') : '',
    additionalInfo: '',
    outsideLab: faker.datatype.boolean(0.2),
    outsideLabCharges: faker.datatype.boolean(0.2) ? `${faker.number.int({ min: 50, max: 300 })}.00` : '',

    // Diagnosis codes (ICD-10)
    diagnosisCodes: faker.helpers.arrayElements(DIAGNOSIS_CODES, faker.number.int({ min: 2, max: 4 })),

    resubmissionCode: '',
    originalRefNo: '',
    priorAuthNumber: faker.datatype.boolean(0.1) ? faker.string.alphanumeric({ length: 10, casing: 'upper' }) : '',

    // Placeholder values - will be set after service lines are generated
    serviceLines: [],
    hasOtherHealthPlan: false,
    otherClaimId: '',
    acceptAssignment: true,
    totalCharges: '0.00',
    amountPaid: '0.00',
  };


  // Now generate service lines using the actual diagnosis codes from the claim
  result.serviceLines = (() => {
    const serviceProviderNPI = provider.npi || faker.string.numeric(10);
    const numServices = faker.number.int({ min: 1, max: 4 });

    // Map diagnosis codes to appropriate CPT codes
    const diagnosisBasedServices: Record<string, Array<{ code: string, chargeRange: [number, number], description: string }>> = {
      // Cardiovascular
      'I10': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '93000', chargeRange: [40, 60], description: 'ECG' },
        { code: '80053', chargeRange: [75, 95], description: 'Comprehensive metabolic panel' },
      ],
      'I21.3': [
        { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
        { code: '93000', chargeRange: [40, 60], description: 'ECG' },
        { code: '82550', chargeRange: [30, 50], description: 'CK-MB' },
        { code: '85025', chargeRange: [30, 50], description: 'CBC' },
      ],
      'I21.4': [
        { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
        { code: '93000', chargeRange: [40, 60], description: 'ECG' },
        { code: '82550', chargeRange: [30, 50], description: 'CK-MB' },
      ],
      'I50.9': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '93000', chargeRange: [40, 60], description: 'ECG' },
        { code: '71045', chargeRange: [60, 90], description: 'Chest x-ray' },
        { code: '80053', chargeRange: [75, 95], description: 'Comprehensive metabolic panel' },
      ],
      'I50.23': [
        { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
        { code: '93000', chargeRange: [40, 60], description: 'ECG' },
        { code: '71045', chargeRange: [60, 90], description: 'Chest x-ray' },
      ],
      'I48.91': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '93000', chargeRange: [40, 60], description: 'ECG' },
        { code: '85025', chargeRange: [30, 50], description: 'CBC' },
      ],

      // Diabetes
      'E11.9': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '83036', chargeRange: [25, 40], description: 'Hemoglobin A1C' },
        { code: '80053', chargeRange: [75, 95], description: 'Comprehensive metabolic panel' },
        { code: '80061', chargeRange: [50, 75], description: 'Lipid panel' },
      ],
      'E11.65': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '83036', chargeRange: [25, 40], description: 'Hemoglobin A1C' },
        { code: '82947', chargeRange: [15, 25], description: 'Glucose' },
      ],
      'E10.65': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '83036', chargeRange: [25, 40], description: 'Hemoglobin A1C' },
        { code: '82947', chargeRange: [15, 25], description: 'Glucose' },
      ],

      // Respiratory
      'J44.9': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '94060', chargeRange: [50, 80], description: 'Spirometry' },
        { code: '71045', chargeRange: [60, 90], description: 'Chest x-ray' },
      ],
      'J44.1': [
        { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
        { code: '94640', chargeRange: [30, 50], description: 'Nebulizer therapy' },
        { code: '71045', chargeRange: [60, 90], description: 'Chest x-ray' },
      ],
      'J45.909': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '94060', chargeRange: [50, 80], description: 'Spirometry' },
      ],
      'J18.9': [
        { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
        { code: '71045', chargeRange: [60, 90], description: 'Chest x-ray' },
        { code: '85025', chargeRange: [30, 50], description: 'CBC' },
      ],
      'J96.00': [
        { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
        { code: '94762', chargeRange: [40, 70], description: 'Pulse oximetry' },
        { code: '71045', chargeRange: [60, 90], description: 'Chest x-ray' },
      ],
      'J80': [
        { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
        { code: '71045', chargeRange: [60, 90], description: 'Chest x-ray' },
        { code: '85025', chargeRange: [30, 50], description: 'CBC' },
      ],

      // Cancer
      'C50.919': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '77065', chargeRange: [100, 150], description: 'Mammography screening' },
        { code: '19083', chargeRange: [200, 350], description: 'Breast biopsy' },
      ],
      'C34.90': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '71260', chargeRange: [300, 500], description: 'CT chest' },
        { code: '85025', chargeRange: [30, 50], description: 'CBC' },
      ],
      'C18.9': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '45378', chargeRange: [500, 800], description: 'Colonoscopy' },
        { code: '82274', chargeRange: [30, 50], description: 'Blood occult' },
      ],
      'C61': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '84153', chargeRange: [40, 60], description: 'PSA' },
        { code: '55700', chargeRange: [300, 500], description: 'Prostate biopsy' },
      ],

      // Musculoskeletal
      'M19.90': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '73560', chargeRange: [80, 120], description: 'Knee x-ray' },
        { code: '20610', chargeRange: [100, 150], description: 'Joint injection' },
      ],
      'M54.5': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '72100', chargeRange: [80, 120], description: 'Spine x-ray' },
        { code: '97110', chargeRange: [60, 90], description: 'Physical therapy' },
      ],

      // Mental health
      'F41.9': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '90834', chargeRange: [100, 150], description: 'Psychotherapy 45 min' },
      ],
      'F32.9': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '90834', chargeRange: [100, 150], description: 'Psychotherapy 45 min' },
      ],

      // Renal
      'N17.9': [
        { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
        { code: '80053', chargeRange: [75, 95], description: 'Comprehensive metabolic panel' },
        { code: '85025', chargeRange: [30, 50], description: 'CBC' },
      ],
      'N18.3': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '80053', chargeRange: [75, 95], description: 'Comprehensive metabolic panel' },
      ],
      'N18.6': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '90935', chargeRange: [200, 350], description: 'Hemodialysis' },
        { code: '80053', chargeRange: [75, 95], description: 'Comprehensive metabolic panel' },
      ],

      // Infectious
      'A41.9': [
        { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
        { code: '85025', chargeRange: [30, 50], description: 'CBC' },
        { code: '87070', chargeRange: [40, 70], description: 'Blood culture' },
      ],
      'U07.1': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '87635', chargeRange: [50, 100], description: 'COVID-19 test' },
        { code: '71045', chargeRange: [60, 90], description: 'Chest x-ray' },
      ],

      // Neurological
      'G40.909': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '95819', chargeRange: [300, 500], description: 'EEG' },
      ],
      'G20': [
        { code: '99214', chargeRange: [200, 250], description: 'Office visit level 4' },
        { code: '95860', chargeRange: [200, 350], description: 'EMG' },
      ],
      'I63.9': [
        { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
        { code: '70450', chargeRange: [400, 700], description: 'CT head' },
      ],
      'I64': [
        { code: '99285', chargeRange: [400, 600], description: 'Emergency visit level 5' },
        { code: '70450', chargeRange: [400, 700], description: 'CT head' },
      ],
    };

    // Default services for codes not specifically mapped
    const defaultServices = [
      { code: '99214', chargeRange: [200, 250] as [number, number], description: 'Office visit level 4' },
      { code: '99213', chargeRange: [150, 180] as [number, number], description: 'Office visit level 3' },
      { code: '80053', chargeRange: [75, 95] as [number, number], description: 'Comprehensive metabolic panel' },
      { code: '85025', chargeRange: [30, 50] as [number, number], description: 'CBC' },
      { code: '36415', chargeRange: [10, 20] as [number, number], description: 'Venipuncture' },
    ];

    // Reference the actual diagnosis codes from the claim
    const selectedDiagnoses = result.diagnosisCodes;

    // Map procedure codes to their appropriate place of service
    const procedurePlaceOfService: Record<string, string> = {
      // Emergency visits
      '99285': '23',  // Emergency visit level 5 - ER

      // Office visits
      '99211': '11',  // Office visit, established patient, level 1
      '99212': '11',  // Office visit, established patient, level 2
      '99213': '11',  // Office visit, established patient, level 3
      '99214': '11',  // Office visit, established patient, level 4
      '99215': '11',  // Office visit, established patient, level 5

      // Lab tests (typically done in office or independent lab)
      '80053': '11',  // Comprehensive metabolic panel - Office
      '80061': '11',  // Lipid panel - Office
      '82274': '81',  // Blood occult test - Independent Lab
      '82550': '11',  // CK-MB (cardiac marker) - Office/Hospital
      '82947': '11',  // Glucose - Office
      '83036': '11',  // Hemoglobin A1C - Office
      '84153': '11',  // PSA - Office
      '85025': '11',  // Complete blood count (CBC) - Office
      '87070': '11',  // Blood culture - Office/Hospital
      '87635': '11',  // COVID-19 test - Office

      // Imaging (typically outpatient hospital or imaging center)
      '70450': '22',  // CT head - Outpatient Hospital
      '71045': '22',  // Chest x-ray - Outpatient Hospital
      '71260': '22',  // CT chest - Outpatient Hospital
      '72100': '22',  // Spine x-ray - Outpatient Hospital
      '73560': '22',  // Knee x-ray - Outpatient Hospital
      '77065': '22',  // Mammography screening - Outpatient Hospital

      // Cardiovascular procedures
      '93000': '11',  // Electrocardiogram (ECG) - Office

      // Respiratory procedures
      '94060': '11',  // Spirometry - Office
      '94640': '23',  // Nebulizer therapy - ER (typically for acute exacerbation)
      '94762': '11',  // Pulse oximetry - Office

      // Surgical/Invasive procedures
      '19083': '22',  // Breast biopsy - Outpatient Hospital
      '20610': '11',  // Joint injection - Office
      '36415': '11',  // Venipuncture - Office
      '45378': '24',  // Colonoscopy - Ambulatory Surgical Center
      '55700': '22',  // Prostate biopsy - Outpatient Hospital

      // Specialized procedures
      '90834': '11',  // Psychotherapy 45 min - Office
      '90935': '11',  // Hemodialysis - Dialysis Center (coded as Office)
      '95819': '22',  // EEG - Outpatient Hospital
      '95860': '22',  // EMG - Outpatient Hospital
      '97110': '11',  // Physical therapy - Office/PT Clinic
    };

    // Build available services based on diagnosis codes
    const availableServices: Array<{ code: string, charges: number, pointer: string, primaryDiagnosis: string }> = [];
    const diagnosisPointers = ['A', 'B', 'C', 'D'];

    selectedDiagnoses.forEach((diagnosis, index) => {
      const pointer = diagnosisPointers[index] || 'A';
      const serviceList = diagnosisBasedServices[diagnosis] || defaultServices;

      // Add 1-2 services for each diagnosis
      const servicesForDiagnosis = faker.helpers.arrayElements(
        serviceList,
        faker.number.int({ min: 1, max: 2 })
      );

      servicesForDiagnosis.forEach(service => {
        // Avoid duplicate procedure codes
        if (!availableServices.find(s => s.code === service.code)) {
          availableServices.push({
            code: service.code,
            charges: faker.number.int({ min: service.chargeRange[0], max: service.chargeRange[1] }),
            pointer: pointer,
            primaryDiagnosis: diagnosis
          });
        }
      });
    });

    // If we have too few services, add some defaults
    if (availableServices.length < 2) {
      defaultServices.forEach(service => {
        if (availableServices.length < 3 && !availableServices.find(s => s.code === service.code)) {
          availableServices.push({
            code: service.code,
            charges: faker.number.int({ min: service.chargeRange[0], max: service.chargeRange[1] }),
            pointer: 'A',
            primaryDiagnosis: selectedDiagnoses[0]
          });
        }
      });
    }

    // Select final services (1-4 max)
    const finalServices = faker.helpers.arrayElements(
      availableServices,
      Math.min(numServices, availableServices.length)
    );

    return finalServices.map(service => {
      // Determine appropriate place of service
      const placeOfService = procedurePlaceOfService[service.code] ||
        (service.code.startsWith('99285') ? '23' : '11');

      // Set emergency flag for ER visits
      const isEmergency = placeOfService === '23' || service.code === '99285';

      // Build diagnosis pointers - start with primary
      let pointers = [service.pointer];

      // For office visits and E/M services, add additional relevant diagnoses
      if (['99213', '99214', '99215', '99285'].includes(service.code)) {
        // E/M visits often address multiple conditions
        // Add up to 2 more diagnoses (randomly, weighted toward 1-2 total)
        const additionalCount = faker.number.int({ min: 0, max: 2 });
        const otherPointers = diagnosisPointers.filter(p =>
          p !== service.pointer &&
          diagnosisPointers.indexOf(p) < selectedDiagnoses.length
        );

        if (otherPointers.length > 0 && additionalCount > 0) {
          const additional = faker.helpers.arrayElements(
            otherPointers,
            Math.min(additionalCount, otherPointers.length)
          );
          pointers = pointers.concat(additional).sort();
        }
      }

      // For general lab tests (metabolic panel, CBC), sometimes add related diagnoses
      if (['80053', '85025'].includes(service.code)) {
        if (faker.datatype.boolean(0.3)) { // 30% chance
          const otherPointers = diagnosisPointers.filter(p =>
            p !== service.pointer &&
            diagnosisPointers.indexOf(p) < selectedDiagnoses.length
          );
          if (otherPointers.length > 0) {
            const additional = faker.helpers.arrayElement(otherPointers);
            pointers.push(additional);
            pointers.sort();
          }
        }
      }

      return {
        dateFrom: result.serviceDate,
        dateTo: result.serviceDate,
        placeOfService: placeOfService,
        emg: isEmergency && faker.datatype.boolean(0.3) ? 'Y' : '',
        procedureCode: service.code,
        modifier: '',
        diagnosisPointer: pointers.join(','),
        charges: `${service.charges}.00`,
        units: '1',
        epsdt: '',
        idQual: 'NPI',
        renderingProviderNPI: serviceProviderNPI,
      };
    });
  })();

  // Set additional claim fields
  result.hasOtherHealthPlan = faker.datatype.boolean(0.2);
  result.otherClaimId = faker.datatype.boolean(0.2) ? faker.string.alphanumeric({ length: 10, casing: 'upper' }) : '';
  result.acceptAssignment = faker.datatype.boolean(0.9);
  result.totalCharges = '0.00'; // Will be calculated below
  result.amountPaid = faker.datatype.boolean(0.3) ? `${faker.number.int({ min: 10, max: 100 })}.00` : '0.00';

  // Calculate total charges from service lines
  const totalCharges = result.serviceLines.reduce((sum, line) => {
    return sum + parseFloat(line.charges);
  }, 0);
  result.totalCharges = totalCharges.toFixed(2);
  return result
};

// ============================================================================
// LAB TEST PANEL DEFINITIONS
// ============================================================================

// Lab test panel definitions with realistic reference ranges
const LAB_TEST_PANELS = {
  CBC: {
    name: 'Complete Blood Count (CBC) with Differential',
    specimenType: 'Whole Blood (EDTA)',
    tests: [
      { parameter: 'White Blood Cell Count (WBC)', unit: '×10³/µL', range: '4.5-11.0', normalRange: [4.5, 11.0] },
      { parameter: 'Red Blood Cell Count (RBC)', unit: '×10⁶/µL', range: '4.20-5.80 (M), 3.90-5.20 (F)', normalRange: [3.9, 5.8] },
      { parameter: 'Hemoglobin (Hgb)', unit: 'g/dL', range: '13.5-17.5 (M), 12.0-16.0 (F)', normalRange: [12.0, 17.5] },
      { parameter: 'Hematocrit (Hct)', unit: '%', range: '40-52 (M), 36-46 (F)', normalRange: [36, 52] },
      { parameter: 'Mean Corpuscular Volume (MCV)', unit: 'fL', range: '80-100', normalRange: [80, 100] },
      { parameter: 'Mean Corpuscular Hemoglobin (MCH)', unit: 'pg', range: '27-33', normalRange: [27, 33] },
      { parameter: 'Mean Corpuscular Hemoglobin Concentration (MCHC)', unit: 'g/dL', range: '32-36', normalRange: [32, 36] },
      { parameter: 'Red Cell Distribution Width (RDW)', unit: '%', range: '11.5-14.5', normalRange: [11.5, 14.5] },
      { parameter: 'Platelet Count', unit: '×10³/µL', range: '150-400', normalRange: [150, 400] },
      { parameter: 'Mean Platelet Volume (MPV)', unit: 'fL', range: '7.5-11.5', normalRange: [7.5, 11.5] },
      { parameter: 'Neutrophils', unit: '%', range: '40-70', normalRange: [40, 70] },
      { parameter: 'Lymphocytes', unit: '%', range: '20-45', normalRange: [20, 45] },
      { parameter: 'Monocytes', unit: '%', range: '2-10', normalRange: [2, 10] },
      { parameter: 'Eosinophils', unit: '%', range: '1-6', normalRange: [1, 6] },
      { parameter: 'Basophils', unit: '%', range: '0-2', normalRange: [0, 2] }
    ]
  },
  BMP: {
    name: 'Basic Metabolic Panel (BMP)',
    specimenType: 'Serum',
    tests: [
      { parameter: 'Glucose', unit: 'mg/dL', range: '70-100 (fasting)', normalRange: [70, 100] },
      { parameter: 'Calcium', unit: 'mg/dL', range: '8.5-10.5', normalRange: [8.5, 10.5] },
      { parameter: 'Sodium', unit: 'mEq/L', range: '136-145', normalRange: [136, 145] },
      { parameter: 'Potassium', unit: 'mEq/L', range: '3.5-5.0', normalRange: [3.5, 5.0] },
      { parameter: 'Chloride', unit: 'mEq/L', range: '98-107', normalRange: [98, 107] },
      { parameter: 'Carbon Dioxide (CO2)', unit: 'mEq/L', range: '23-29', normalRange: [23, 29] },
      { parameter: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', range: '7-20', normalRange: [7, 20] },
      { parameter: 'Creatinine', unit: 'mg/dL', range: '0.7-1.3 (M), 0.6-1.1 (F)', normalRange: [0.6, 1.3] }
    ]
  },
  CMP: {
    name: 'Comprehensive Metabolic Panel (CMP)',
    specimenType: 'Serum',
    tests: [
      { parameter: 'Glucose', unit: 'mg/dL', range: '70-100 (fasting)', normalRange: [70, 100] },
      { parameter: 'Calcium', unit: 'mg/dL', range: '8.5-10.5', normalRange: [8.5, 10.5] },
      { parameter: 'Sodium', unit: 'mEq/L', range: '136-145', normalRange: [136, 145] },
      { parameter: 'Potassium', unit: 'mEq/L', range: '3.5-5.0', normalRange: [3.5, 5.0] },
      { parameter: 'Chloride', unit: 'mEq/L', range: '98-107', normalRange: [98, 107] },
      { parameter: 'Carbon Dioxide (CO2)', unit: 'mEq/L', range: '23-29', normalRange: [23, 29] },
      { parameter: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', range: '7-20', normalRange: [7, 20] },
      { parameter: 'Creatinine', unit: 'mg/dL', range: '0.7-1.3 (M), 0.6-1.1 (F)', normalRange: [0.6, 1.3] },
      { parameter: 'Albumin', unit: 'g/dL', range: '3.5-5.5', normalRange: [3.5, 5.5] },
      { parameter: 'Total Protein', unit: 'g/dL', range: '6.0-8.3', normalRange: [6.0, 8.3] },
      { parameter: 'Alkaline Phosphatase (ALP)', unit: 'U/L', range: '30-120', normalRange: [30, 120] },
      { parameter: 'Alanine Aminotransferase (ALT)', unit: 'U/L', range: '7-56', normalRange: [7, 56] },
      { parameter: 'Aspartate Aminotransferase (AST)', unit: 'U/L', range: '10-40', normalRange: [10, 40] },
      { parameter: 'Total Bilirubin', unit: 'mg/dL', range: '0.1-1.2', normalRange: [0.1, 1.2] }
    ]
  },
  Urinalysis: {
    name: 'Urinalysis, Complete',
    specimenType: 'Random Urine',
    tests: [
      { parameter: 'Color', unit: '', range: 'Yellow', normalRange: [0, 0], categorical: ['Yellow', 'Pale Yellow', 'Amber'] },
      { parameter: 'Appearance', unit: '', range: 'Clear', normalRange: [0, 0], categorical: ['Clear', 'Slightly Cloudy', 'Cloudy'] },
      { parameter: 'Specific Gravity', unit: '', range: '1.005-1.030', normalRange: [1.005, 1.030] },
      { parameter: 'pH', unit: '', range: '4.5-8.0', normalRange: [4.5, 8.0] },
      { parameter: 'Glucose', unit: '', range: 'Negative', normalRange: [0, 0], categorical: ['Negative', 'Trace', 'Positive'] },
      { parameter: 'Protein', unit: '', range: 'Negative', normalRange: [0, 0], categorical: ['Negative', 'Trace', 'Positive'] },
      { parameter: 'Ketones', unit: '', range: 'Negative', normalRange: [0, 0], categorical: ['Negative', 'Trace', 'Positive'] },
      { parameter: 'Blood', unit: '', range: 'Negative', normalRange: [0, 0], categorical: ['Negative', 'Trace', 'Positive'] },
      { parameter: 'Bilirubin', unit: '', range: 'Negative', normalRange: [0, 0], categorical: ['Negative', 'Positive'] },
      { parameter: 'Urobilinogen', unit: 'EU/dL', range: '0.1-1.0', normalRange: [0.1, 1.0] },
      { parameter: 'Nitrite', unit: '', range: 'Negative', normalRange: [0, 0], categorical: ['Negative', 'Positive'] },
      { parameter: 'Leukocyte Esterase', unit: '', range: 'Negative', normalRange: [0, 0], categorical: ['Negative', 'Trace', 'Positive'] },
      { parameter: 'WBC', unit: '/HPF', range: '0-5', normalRange: [0, 5] },
      { parameter: 'RBC', unit: '/HPF', range: '0-2', normalRange: [0, 2] },
      { parameter: 'Epithelial Cells', unit: '/HPF', range: 'Few', normalRange: [0, 0], categorical: ['Few', 'Moderate', 'Many'] },
      { parameter: 'Bacteria', unit: '', range: 'None', normalRange: [0, 0], categorical: ['None', 'Few', 'Moderate', 'Many'] }
    ]
  },
  Lipid: {
    name: 'Lipid Panel (Fasting)',
    specimenType: 'Serum',
    tests: [
      { parameter: 'Total Cholesterol', unit: 'mg/dL', range: '<200 Desirable', normalRange: [120, 200] },
      { parameter: 'Triglycerides', unit: 'mg/dL', range: '<150 Desirable', normalRange: [50, 150] },
      { parameter: 'HDL Cholesterol', unit: 'mg/dL', range: '>40 (M), >50 (F)', normalRange: [40, 80] },
      { parameter: 'LDL Cholesterol (calculated)', unit: 'mg/dL', range: '<100 Optimal', normalRange: [50, 100] },
      { parameter: 'VLDL Cholesterol', unit: 'mg/dL', range: '5-40', normalRange: [5, 40] },
      { parameter: 'Total/HDL Cholesterol Ratio', unit: '', range: '<5.0', normalRange: [2.0, 5.0] },
      { parameter: 'Non-HDL Cholesterol', unit: 'mg/dL', range: '<130', normalRange: [70, 130] }
    ]
  },
  LFT: {
    name: 'Liver Function Panel',
    specimenType: 'Serum',
    tests: [
      { parameter: 'Total Protein', unit: 'g/dL', range: '6.0-8.3', normalRange: [6.0, 8.3] },
      { parameter: 'Albumin', unit: 'g/dL', range: '3.5-5.5', normalRange: [3.5, 5.5] },
      { parameter: 'Globulin', unit: 'g/dL', range: '2.0-3.5', normalRange: [2.0, 3.5] },
      { parameter: 'Albumin/Globulin Ratio', unit: '', range: '1.0-2.5', normalRange: [1.0, 2.5] },
      { parameter: 'Total Bilirubin', unit: 'mg/dL', range: '0.1-1.2', normalRange: [0.1, 1.2] },
      { parameter: 'Direct Bilirubin', unit: 'mg/dL', range: '0.0-0.3', normalRange: [0.0, 0.3] },
      { parameter: 'Indirect Bilirubin', unit: 'mg/dL', range: '0.1-1.0', normalRange: [0.1, 1.0] },
      { parameter: 'Alkaline Phosphatase (ALP)', unit: 'U/L', range: '30-120', normalRange: [30, 120] },
      { parameter: 'Alanine Aminotransferase (ALT)', unit: 'U/L', range: '7-56', normalRange: [7, 56] },
      { parameter: 'Aspartate Aminotransferase (AST)', unit: 'U/L', range: '10-40', normalRange: [10, 40] },
      { parameter: 'Gamma-Glutamyl Transferase (GGT)', unit: 'U/L', range: '9-48', normalRange: [9, 48] }
    ]
  },
  Thyroid: {
    name: 'Thyroid Function Panel',
    specimenType: 'Serum',
    tests: [
      { parameter: 'Thyroid Stimulating Hormone (TSH)', unit: 'µIU/mL', range: '0.4-4.0', normalRange: [0.4, 4.0] },
      { parameter: 'Free Thyroxine (Free T4)', unit: 'ng/dL', range: '0.8-1.8', normalRange: [0.8, 1.8] },
      { parameter: 'Free Triiodothyronine (Free T3)', unit: 'pg/mL', range: '2.3-4.2', normalRange: [2.3, 4.2] },
      { parameter: 'Total T4', unit: 'µg/dL', range: '4.5-12.0', normalRange: [4.5, 12.0] },
      { parameter: 'Total T3', unit: 'ng/dL', range: '80-200', normalRange: [80, 200] },
      { parameter: 'Thyroid Peroxidase Antibody (TPO)', unit: 'IU/mL', range: '<35', normalRange: [0, 35] }
    ]
  },
  HbA1c: {
    name: 'Hemoglobin A1c (Glycated Hemoglobin)',
    specimenType: 'Whole Blood (EDTA)',
    tests: [
      { parameter: 'Hemoglobin A1c', unit: '%', range: '<5.7 Normal, 5.7-6.4 Prediabetes, ≥6.5 Diabetes', normalRange: [4.0, 5.7] },
      { parameter: 'Estimated Average Glucose (eAG)', unit: 'mg/dL', range: '97 (corresponds to 5% A1c)', normalRange: [70, 126] }
    ]
  },
  Coagulation: {
    name: 'Coagulation Panel',
    specimenType: 'Citrated Plasma',
    tests: [
      { parameter: 'Prothrombin Time (PT)', unit: 'seconds', range: '11.0-13.5', normalRange: [11.0, 13.5] },
      { parameter: 'International Normalized Ratio (INR)', unit: '', range: '0.8-1.2', normalRange: [0.8, 1.2] },
      { parameter: 'Activated Partial Thromboplastin Time (aPTT)', unit: 'seconds', range: '25-35', normalRange: [25, 35] },
      { parameter: 'Fibrinogen', unit: 'mg/dL', range: '200-400', normalRange: [200, 400] },
      { parameter: 'D-Dimer', unit: 'µg/mL FEU', range: '<0.50', normalRange: [0, 0.5] },
      { parameter: 'Platelet Count', unit: '×10³/µL', range: '150-400', normalRange: [150, 400] }
    ]
  },
  Microbiology: {
    name: 'Microbiology Culture and Sensitivity',
    specimenType: 'Various (Blood, Urine, Wound, Throat)',
    tests: [
      { parameter: 'Culture Source', unit: '', range: 'Various', normalRange: [0, 0], categorical: ['Blood', 'Urine', 'Wound', 'Throat', 'Sputum'] },
      { parameter: 'Gram Stain', unit: '', range: 'Various', normalRange: [0, 0], categorical: ['No organisms seen', 'Gram positive cocci', 'Gram negative rods', 'Mixed flora'] },
      { parameter: 'Culture Result', unit: '', range: 'Various', normalRange: [0, 0], categorical: ['No growth', 'Normal flora', 'E. coli', 'S. aureus', 'Streptococcus', 'Enterococcus'] },
      { parameter: 'Colony Count', unit: 'CFU/mL', range: 'Variable', normalRange: [0, 100000] }
    ]
  },
  Pathology: {
    name: 'Surgical Pathology Report',
    specimenType: 'Tissue Biopsy',
    tests: [
      { parameter: 'Specimen Type', unit: '', range: 'Various', normalRange: [0, 0], categorical: ['Skin biopsy', 'Colon polyp', 'Breast biopsy', 'Lymph node'] },
      { parameter: 'Gross Description', unit: '', range: 'Descriptive', normalRange: [0, 0] },
      { parameter: 'Microscopic Description', unit: '', range: 'Descriptive', normalRange: [0, 0] },
      { parameter: 'Diagnosis', unit: '', range: 'Various', normalRange: [0, 0] }
    ]
  },
  Hormone: {
    name: 'Hormone Panel',
    specimenType: 'Serum',
    tests: [
      { parameter: 'Testosterone, Total', unit: 'ng/dL', range: '300-1000 (M), 15-70 (F)', normalRange: [15, 1000] },
      { parameter: 'Estradiol', unit: 'pg/mL', range: '10-40 (M), 30-400 (F)', normalRange: [10, 400] },
      { parameter: 'Follicle Stimulating Hormone (FSH)', unit: 'mIU/mL', range: '1.5-12.4 (M), 3.5-12.5 (F)', normalRange: [1.5, 12.5] },
      { parameter: 'Luteinizing Hormone (LH)', unit: 'mIU/mL', range: '1.7-8.6 (M), 2.4-12.6 (F)', normalRange: [1.7, 12.6] },
      { parameter: 'Prolactin', unit: 'ng/mL', range: '4-15 (M), 4-23 (F)', normalRange: [4, 23] },
      { parameter: 'Cortisol (AM)', unit: 'µg/dL', range: '6-23', normalRange: [6, 23] },
      { parameter: 'DHEA-Sulfate', unit: 'µg/dL', range: '80-560 (M), 35-430 (F)', normalRange: [35, 560] }
    ]
  },
  Infectious: {
    name: 'Infectious Disease Panel',
    specimenType: 'Serum',
    tests: [
      { parameter: 'HIV-1/HIV-2 Antibody', unit: '', range: 'Non-Reactive', normalRange: [0, 0], categorical: ['Non-Reactive', 'Reactive'] },
      { parameter: 'Hepatitis B Surface Antigen', unit: '', range: 'Non-Reactive', normalRange: [0, 0], categorical: ['Non-Reactive', 'Reactive'] },
      { parameter: 'Hepatitis B Surface Antibody', unit: 'mIU/mL', range: '≥10 Immune', normalRange: [10, 1000] },
      { parameter: 'Hepatitis C Antibody', unit: '', range: 'Non-Reactive', normalRange: [0, 0], categorical: ['Non-Reactive', 'Reactive'] },
      { parameter: 'RPR (Syphilis)', unit: '', range: 'Non-Reactive', normalRange: [0, 0], categorical: ['Non-Reactive', 'Reactive'] },
      { parameter: 'COVID-19 Antibody (IgG)', unit: '', range: 'Negative', normalRange: [0, 0], categorical: ['Negative', 'Positive'] }
    ]
  }
};

// ============================================================================
// GENERATOR FUNCTIONS - LABORATORY REPORTS
// ============================================================================

export const generateLabReport = (
  testType: LabTestType,
  orderingPhysician: string
): LabReport => {

  // Generate test panel data
  const panel = LAB_TEST_PANELS[testType];

  // Generate realistic lab results
  const generateLabTestResult = (test: any): LabTestResult => {
    let value: string;
    let flag: 'Normal' | 'High' | 'Low' | 'Critical' | 'Abnormal' | '' = '';

    if (test.categorical) {
      // Categorical values (90% normal, 10% abnormal)
      const isNormal = faker.datatype.boolean(0.9);
      value = isNormal ? test.categorical[0] : faker.helpers.arrayElement(test.categorical.slice(1));
      if (!isNormal && test.range !== value) {
        flag = 'Abnormal';
      }
    } else {
      // Numeric values with some abnormalities
      const isNormal = faker.datatype.boolean(0.85);
      const [min, max] = test.normalRange;

      if (isNormal) {
        value = faker.number.float({ min, max, fractionDigits: test.unit.includes('µ') || test.unit === '%' ? 1 : 2 }).toFixed(test.unit.includes('seconds') ? 1 : 2);
      } else {
        // Generate abnormal value
        const isHigh = faker.datatype.boolean();
        if (isHigh) {
          const numValue = faker.number.float({ min: max, max: max * 1.3, fractionDigits: 2 });
          value = numValue.toFixed(test.unit.includes('seconds') ? 1 : 2);
          flag = numValue > max * 1.2 ? 'Critical' : 'High';
        } else {
          const numValue = faker.number.float({ min: min * 0.7, max: min, fractionDigits: 2 });
          value = numValue.toFixed(test.unit.includes('seconds') ? 1 : 2);
          flag = numValue < min * 0.8 ? 'Critical' : 'Low';
        }
      }
    }

    return {
      parameter: test.parameter,
      value,
      unit: test.unit,
      referenceRange: test.range,
      flag,
      notes: null
    };
  };

  const results: LabTestResult[] = panel.tests.map(generateLabTestResult);

  // Generate dates and times
  const collectionDate = faker.date.recent({ days: 7 });
  const receivedDate = new Date(collectionDate.getTime() + faker.number.int({ min: 1, max: 6 }) * 3600000);
  const reportDate = new Date(receivedDate.getTime() + faker.number.int({ min: 12, max: 48 }) * 3600000);

  // Generate performing lab info
  const performingLab = {
    name: `${faker.helpers.arrayElement(['Regional', 'Central', 'Metropolitan', 'University', 'City'])} Laboratory Services`,
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode('#####'),
      country: 'USA'
    },
    phone: faker.phone.number(),
    cliaNumber: faker.helpers.replaceSymbols('##D#######'),
    director: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}, MD, PhD`
  };

  // Generate interpretation for certain test types
  let interpretation: string | null = null;
  const hasAbnormal = results.some(r => r.flag && r.flag !== 'Normal');

  if (testType === 'Lipid' && hasAbnormal) {
    interpretation = 'Results indicate elevated lipid levels. Recommend lifestyle modifications including diet and exercise. Consider statin therapy if cardiovascular risk is elevated.';
  } else if (testType === 'Thyroid' && hasAbnormal) {
    interpretation = 'Thyroid function tests show abnormalities. Recommend clinical correlation and possible endocrinology referral.';
  } else if (testType === 'HbA1c') {
    const a1cValue = parseFloat(results[0].value);
    if (a1cValue < 5.7) {
      interpretation = 'Normal glucose metabolism. No evidence of diabetes.';
    } else if (a1cValue >= 5.7 && a1cValue < 6.5) {
      interpretation = 'Prediabetes range. Recommend lifestyle modifications and regular monitoring.';
    } else {
      interpretation = 'Diagnostic of diabetes mellitus. Recommend diabetes management program and endocrinology consultation.';
    }
  }

  // Get critical values if any
  const criticalValues = results
    .filter(r => r.flag === 'Critical')
    .map(r => `${r.parameter}: ${r.value} ${r.unit}`);

  return {
    testType,
    testName: panel.name,
    specimenType: panel.specimenType,
    specimenCollectionDate: collectionDate.toLocaleDateString('en-US'),
    specimenCollectionTime: collectionDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    specimenReceivedDate: receivedDate.toLocaleDateString('en-US'),
    reportDate: reportDate.toLocaleDateString('en-US'),
    reportTime: reportDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    orderingPhysician: orderingPhysician,
    performingLab,
    results,
    interpretation,
    comments: hasAbnormal ? 'Abnormal results noted. Clinical correlation recommended.' : null,
    criticalValues: criticalValues.length > 0 ? criticalValues : null,
    technologist: `${faker.person.firstName()} ${faker.person.lastName()}, MT(ASCP)`,
    pathologist: testType === 'Pathology' ? `Dr. ${faker.person.firstName()} ${faker.person.lastName()}, MD` : null
  };
};

// ============================================================================
// GENERATOR FUNCTIONS - MEDICAL HISTORY AND MEDICATIONS
// ============================================================================

// ============================================================================
// GENERATOR FUNCTIONS - MEDICAL HISTORY COMPONENTS
// ============================================================================

/**
 * Generate a single allergy
 */
export const generateAllergy = (): Allergy => {
  const allergy = faker.helpers.arrayElement(ALLERGY_NAMES);
  return {
    allergen: allergy.name,
    reaction: allergy.reaction,
    severity: allergy.severity,
    dateIdentified: faker.date.past({ years: 10 }).toLocaleDateString('en-US')
  };
};

/**
 * Generate a chronic condition
 */
export const generateChronicCondition = (): ChronicCondition => {
  const condition = faker.helpers.arrayElement(MEDICAL_CONDITIONS);
  return {
    condition,
    diagnosedDate: faker.date.past({ years: 5 }).toLocaleDateString('en-US'),
    status: faker.helpers.arrayElement(CONDITION_STATUSES),
    notes: faker.helpers.arrayElement(CONDITION_NOTES)
  };
};

/**
 * Generate surgical history entry
 */
export const generateSurgicalHistory = (): SurgicalHistory => {
  return {
    procedure: faker.helpers.arrayElement(SURGICAL_PROCEDURES),
    date: faker.date.past({ years: 10 }).toLocaleDateString('en-US'),
    hospital: faker.helpers.arrayElement(HOSPITALS),
    surgeon: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
    complications: faker.helpers.arrayElement(SURGICAL_COMPLICATIONS)
  };
};

/**
 * Generate family history entry
 */
export const generateFamilyHistory = (relation: string = ''): FamilyHistory => {
  const selectedRelation = relation || faker.helpers.arrayElement(['Mother', 'Father', 'Sibling', 'Grandparent']);
  const isDeceased = faker.datatype.boolean(0.3);

  return {
    relation: selectedRelation,
    conditions: faker.helpers.arrayElements(FAMILY_CONDITIONS, faker.number.int({ min: 0, max: 3 })),
    ageAtDeath: isDeceased ? faker.number.int({ min: 60, max: 90 }).toString() : 'Living',
    causeOfDeath: isDeceased ? faker.helpers.arrayElement(CAUSES_OF_DEATH) : 'N/A'
  };
};

/**
 * Generate a current medication
 */
export const generateCurrentMedication = (purpose?: string): CurrentMedication => {
  const med = purpose
    ? faker.helpers.arrayElement(GENERAL_MEDICATIONS)
    : faker.helpers.arrayElement(GENERAL_MEDICATIONS);

  return {
    name: med.name,
    strength: med.strength,
    dosage: med.dosage,
    purpose: purpose || med.purpose,
    prescribedBy: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
    startDate: faker.date.past({ years: 1 }).toLocaleDateString('en-US'),
    instructions: faker.helpers.arrayElement(MEDICATION_INSTRUCTIONS)
  };
};

/**
 * Generate a discontinued medication
 */
export const generateDiscontinuedMedication = (): DiscontinuedMedication => {
  const med = faker.helpers.arrayElement(MEDICATIONS);
  return {
    name: med.split(' ')[0],
    strength: med.includes('mg') ? med.split(' ')[1] : 'As directed',
    reason: faker.helpers.arrayElement(DISCONTINUATION_REASONS),
    discontinuedDate: faker.date.past({ years: 2 }).toLocaleDateString('en-US'),
    prescribedBy: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`
  };
};

/**
 * Generate medications list that correlate with chronic conditions
 */
export const generateMedications = (
  complexity: Complexity = 'medium',
  chronicConditions: ChronicCondition[] = []
): Medications => {
  const currentMedCount = complexity === 'low' ? 3 : complexity === 'high' ? 8 : 5;
  const discontinuedMedCount = complexity === 'low' ? 1 : complexity === 'high' ? 4 : 2;

  // Generate medications based on conditions
  const currentMedications: CurrentMedication[] = [];
  const usedMedications = new Set<string>();

  // Add medications for each chronic condition
  chronicConditions.forEach(condition => {
    const medOptions = CONDITION_MEDICATION_MAP[condition.condition];
    if (medOptions && currentMedications.length < currentMedCount) {
      const med = faker.helpers.arrayElement(medOptions);
      if (!usedMedications.has(med.name)) {
        usedMedications.add(med.name);
        currentMedications.push({
          name: med.name,
          strength: med.strength,
          dosage: faker.helpers.arrayElement(DOSAGE_FREQUENCIES),
          purpose: med.purpose,
          prescribedBy: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
          startDate: faker.date.between({
            from: new Date(condition.diagnosedDate),
            to: new Date()
          }).toLocaleDateString('en-US'),
          instructions: faker.helpers.arrayElement(MEDICATION_INSTRUCTIONS)
        });
      }
    }
  });

  // Safety counter to prevent infinite loops
  let attempts = 0;
  const maxAttempts = GENERAL_MEDICATIONS.length * 2;

  while (currentMedications.length < currentMedCount && attempts < maxAttempts) {
    attempts++;
    const med = faker.helpers.arrayElement(GENERAL_MEDICATIONS);
    if (!usedMedications.has(med.name)) {
      usedMedications.add(med.name);
      currentMedications.push({
        name: med.name,
        strength: med.strength,
        dosage: med.dosage,
        purpose: med.purpose,
        prescribedBy: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
        startDate: faker.date.past({ years: 1 }).toLocaleDateString('en-US'),
        instructions: 'Take as directed'
      });
    }
  }

  // Generate discontinued medications
  const discontinued: DiscontinuedMedication[] = Array.from({ length: discontinuedMedCount }, () => {
    const med = faker.helpers.arrayElement(MEDICATIONS);
    const discontinuedDate = faker.date.past({ years: 2 });
    return {
      name: med.split(' ')[0],
      strength: med.includes('mg') ? med.split(' ')[1] : 'As directed',
      reason: faker.helpers.arrayElement(DISCONTINUATION_REASONS),
      discontinuedDate: discontinuedDate.toLocaleDateString('en-US'),
      prescribedBy: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`
    };
  });

  return {
    current: currentMedications,
    discontinued
  };
};

export const generateMedicalHistory = (complexity: Complexity = 'medium'): MedicalHistory => {
  // Generate medical history and medications using imported functions from medicalRecordsGenerator
  const conditionCount = complexity === 'low' ? 2 : complexity === 'high' ? 6 : 4;
  const conditions = faker.helpers.arrayElements(MEDICAL_CONDITIONS, conditionCount);

  const allergyCount = faker.datatype.boolean(0.6) ? faker.number.int({ min: 1, max: 3 }) : 0;
  const allergies: Allergy[] = allergyCount > 0 ?
    faker.helpers.arrayElements(ALLERGY_NAMES, allergyCount).map(allergy => ({
      allergen: allergy.name,
      reaction: allergy.reaction,
      severity: allergy.severity,
      dateIdentified: faker.date.past({ years: 10 }).toLocaleDateString('en-US')
    })) : [{
      allergen: 'No known allergies',
      reaction: 'None',
      severity: 'None',
      dateIdentified: 'N/A'
    }];

  // Generate surgical history as objects
  const surgicalCount = faker.datatype.boolean(0.4) ? faker.number.int({ min: 1, max: 3 }) : 0;
  const surgicalHistory: SurgicalHistory[] = surgicalCount > 0 ?
    Array.from({ length: surgicalCount }, () => ({
      procedure: faker.helpers.arrayElement(SURGICAL_PROCEDURES),
      date: faker.date.past({ years: 10 }).toLocaleDateString('en-US'),
      hospital: faker.helpers.arrayElement(HOSPITALS),
      surgeon: `Dr. ${faker.person.firstName()} ${faker.person.lastName()}`,
      complications: faker.helpers.arrayElement(SURGICAL_COMPLICATIONS)
    })) : [{
      procedure: 'No surgical history',
      date: 'N/A',
      hospital: 'N/A',
      surgeon: 'N/A',
      complications: 'N/A'
    }];

  // Generate family history as objects
  const familyHistory: FamilyHistory[] = [
    {
      relation: 'Mother',
      conditions: faker.helpers.arrayElements(FAMILY_CONDITIONS,
        faker.number.int({ min: 0, max: 2 })),
      ageAtDeath: faker.datatype.boolean(0.3) ? faker.number.int({ min: 65, max: 90 }).toString() : 'Living',
      causeOfDeath: faker.datatype.boolean(0.3) ? faker.helpers.arrayElement(CAUSES_OF_DEATH) : 'N/A'
    },
    {
      relation: 'Father',
      conditions: faker.helpers.arrayElements(FAMILY_CONDITIONS,
        faker.number.int({ min: 0, max: 2 })),
      ageAtDeath: faker.datatype.boolean(0.4) ? faker.number.int({ min: 60, max: 85 }).toString() : 'Living',
      causeOfDeath: faker.datatype.boolean(0.4) ? faker.helpers.arrayElement(CAUSES_OF_DEATH) : 'N/A'
    }
  ];

  const chronicConditions: ChronicCondition[] = conditions.map(condition => ({
    condition,
    diagnosedDate: faker.date.past({ years: 5 }).toLocaleDateString('en-US'),
    status: faker.helpers.arrayElement(CONDITION_STATUSES),
    notes: faker.helpers.arrayElement(CONDITION_NOTES)
  }));

  const medications = generateMedications(complexity, chronicConditions);

  return {
    medications,
    allergies: allergies,
    chronicConditions: chronicConditions,
    surgicalHistory: surgicalHistory,
    familyHistory: familyHistory
  };
};

export const generateLabReports = (
  testType: LabTestType[],
  orderingPhysician: string
): LabReports => {
  const labReports: LabReports = [];
  testType.forEach(type => {
    const report = generateLabReport(type, orderingPhysician);
    labReports.push(report);
  });
  return labReports;
};

// ============================================================================
// GENERATOR FUNCTIONS - VISIT REPORTS
// ============================================================================

/**
 * Generate visit vitals
 */
export const generateVisitVitals = () => {
  return {
    bloodPressure: `${faker.number.int({ min: 110, max: 145 })}/${faker.number.int({ min: 70, max: 95 })}`,
    heartRate: faker.number.int({ min: 60, max: 100 }),
    temperature: parseFloat(faker.number.float({ min: 97.0, max: 99.5, fractionDigits: 1 }).toFixed(1)),
    weight: faker.number.int({ min: 120, max: 250 }),
    height: `${faker.number.int({ min: 60, max: 75 })}"`,
    oxygenSaturation: faker.number.int({ min: 95, max: 100 })
  };
};

/**
 * Generate vital signs with full details
 */
export const generateVitalSigns = (visitDate: string = new Date().toLocaleDateString('en-US')) => {
  const vitals = generateVisitVitals();

  return {
    date: visitDate,
    time: faker.date.recent({ days: 1 }).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    bloodPressure: vitals.bloodPressure,
    heartRate: vitals.heartRate.toString(),
    temperature: `${vitals.temperature}°F`,
    weight: `${vitals.weight} lbs`,
    height: vitals.height,
    bmi: calculateBMI(vitals.weight, vitals.height),
    oxygenSaturation: `${vitals.oxygenSaturation}%`,
    respiratoryRate: `${faker.number.int({ min: 12, max: 20 })} breaths/min`
  };
};

/**
 * Generate a visit note
 */
export const generateVisitNote = (providerName: string, visitDate?: Date): VisitNote => {
  const visitTypes = ['Office Visit', 'Follow-up Visit', 'Annual Physical', 'Sick Visit', 'Consultation', 'Initial Visit'];
  const visitType = faker.helpers.arrayElement(visitTypes);
  const date = visitDate || faker.date.recent({ days: 30 });
  const selectedAssessment = faker.helpers.arrayElement(VISIT_ASSESSMENTS);
  const selectedPlan = faker.helpers.arrayElement(VISIT_PLANS);

  return {
    date: date.toLocaleDateString('en-US'),
    type: visitType,
    chiefComplaint: faker.helpers.arrayElement(CHIEF_COMPLAINTS),
    assessment: selectedAssessment,
    plan: selectedPlan,
    provider: providerName,
    duration: `${faker.number.int({ min: 15, max: 60 })} minutes`,
    vitals: generateVisitVitals()
  };
};

export const generateVisitsReport = (numberOfVisits: number = 1, providerName: string): VisitReport[] => {
  const visitReports: VisitReport[] = [];

  for (let i = 0; i < numberOfVisits; i++) {
    visitReports.push(generateVisitReport(i, providerName));
  }

  return visitReports;
};

const generateVisitReport = (visitIndex: number = 0, providerName: string): VisitReport => {

  // Generate visit note
  const visitTypes = ['Office Visit', 'Follow-up Visit', 'Annual Physical', 'Sick Visit', 'Consultation', 'Initial Visit'];
  const visitType = faker.helpers.arrayElement(visitTypes);

  // Generate visit date based on index - spread visits over the past year
  const daysAgo = 30 + (visitIndex * 60); // Space visits ~60 days apart, starting from 30 days ago
  const visitDate = faker.date.recent({ days: Math.min(daysAgo, 365) });
  const selectedAssessment = faker.helpers.arrayElement(VISIT_ASSESSMENTS);
  const selectedPlan = faker.helpers.arrayElement(VISIT_PLANS);

  const visit: VisitNote = {
    date: visitDate.toLocaleDateString('en-US'),
    type: visitType,
    chiefComplaint: faker.helpers.arrayElement(CHIEF_COMPLAINTS),
    assessment: selectedAssessment,
    plan: selectedPlan,
    provider: providerName,
    duration: `${faker.number.int({ min: 15, max: 60 })} minutes`,
    vitals: {
      bloodPressure: `${faker.number.int({ min: 110, max: 145 })}/${faker.number.int({ min: 70, max: 95 })}`,
      heartRate: faker.number.int({ min: 60, max: 100 }),
      temperature: parseFloat(faker.number.float({ min: 97.0, max: 99.5, fractionDigits: 1 }).toFixed(1)),
      weight: faker.number.int({ min: 120, max: 250 }),
      height: `${faker.number.int({ min: 60, max: 75 })}"`,
      oxygenSaturation: faker.number.int({ min: 95, max: 100 })
    }
  };

  // Generate vital signs with full details
  const vitalSigns: VitalSigns = {
    date: visit.date,
    time: faker.date.recent({ days: 1 }).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    bloodPressure: visit.vitals.bloodPressure,
    heartRate: visit.vitals.heartRate.toString(),
    temperature: `${visit.vitals.temperature}°F`,
    weight: `${visit.vitals.weight} lbs`,
    height: visit.vitals.height,
    bmi: calculateBMI(visit.vitals.weight, visit.vitals.height),
    oxygenSaturation: `${visit.vitals.oxygenSaturation}%`,
    respiratoryRate: `${faker.number.int({ min: 12, max: 20 })} breaths/min`
  };

  return {
    visit,
    vitalSigns
  };
};

// Helper function to calculate BMI
function calculateBMI(weight: number, height: string): string {
  const heightInInches = parseInt(height);
  const bmi = (weight / (heightInInches * heightInInches)) * 703;
  return bmi.toFixed(1);
}

export const generateW2 = (_individual: Individual): W2 => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  
  // Generate wages between $30,000 and $150,000
  const annualWages = faker.number.int({ min: 30000, max: 150000 });
  
  // Calculate taxes (approximate percentages)
  const federalTaxRate = 0.15; // ~15% federal
  const socialSecurityRate = 0.062; // 6.2% social security
  const medicareRate = 0.0145; // 1.45% medicare
  const stateTaxRate = 0.05; // ~5% state
  
  const federalTax = Math.round(annualWages * federalTaxRate * 100) / 100;
  const socialSecurityTax = Math.round(annualWages * socialSecurityRate * 100) / 100;
  const medicareTax = Math.round(annualWages * medicareRate * 100) / 100;
  const stateTax = Math.round(annualWages * stateTaxRate * 100) / 100;
  
  // Generate Box 12 codes (common examples: D for 401k, DD for employer health coverage)
  const box12Codes = [];
  if (faker.datatype.boolean()) {
    // 401k contribution
    const contribution401k = Math.round(annualWages * faker.number.float({ min: 0.03, max: 0.06 }) * 100) / 100;
    box12Codes.push({
      code: 'D',
      amount: contribution401k.toFixed(2)
    });
  }
  if (faker.datatype.boolean()) {
    // Employer health coverage
    const healthCoverage = faker.number.int({ min: 5000, max: 15000 });
    box12Codes.push({
      code: 'DD',
      amount: healthCoverage.toFixed(2)
    });
  }
  
  return {    
    // Wage and Tax Information
    taxYear: previousYear.toString(),
    wages: annualWages.toFixed(2),
    federalIncomeTaxWithheld: federalTax.toFixed(2),
    socialSecurityWages: annualWages.toFixed(2),
    socialSecurityTaxWithheld: socialSecurityTax.toFixed(2),
    medicareWages: annualWages.toFixed(2),
    medicareTaxWithheld: medicareTax.toFixed(2),
    socialSecurityTips: null,
    allocatedTips: null,
    dependentCareBenefits: faker.datatype.boolean() ? faker.number.int({ min: 1000, max: 5000 }).toFixed(2) : null,
    nonqualifiedPlans: null,
    box12Codes: box12Codes.length > 0 ? box12Codes : null,
    statutoryEmployee: false,
    retirementPlan: box12Codes.some(c => c.code === 'D'),
    thirdPartySickPay: false,
    
    // State and Local Information
    stateWages: annualWages.toFixed(2),
    stateIncomeTax: stateTax.toFixed(2),
    localWages: null,
    localIncomeTax: null,
    localityName: null,
    
    // Control Number
    controlNumber: faker.string.alphanumeric(10).toUpperCase()
  };
};

/**
 * Generate a US Passport document
 * Creates realistic passport data with number, dates, and Machine Readable Zone
 * @param individual Individual data for passport holder
 * @returns Passport object
 */
export const generatePassport = (individual: Individual): Passport => {
  // Generate a realistic passport number (9 digits starting with 5-6)
  const passportNumber = (Math.floor(Math.random() * 2) + 5).toString() + 
    Math.floor(Math.random() * 100000000).toString().padStart(8, '0');

  // Generate issuance date (random within last 10 years)
  const issuanceDate = new Date();
  const yearsAgo = faker.number.int({ min: 0, max: 10 });
  issuanceDate.setFullYear(issuanceDate.getFullYear() - yearsAgo);
  issuanceDate.setMonth(faker.number.int({ min: 0, max: 11 }));
  issuanceDate.setDate(faker.number.int({ min: 1, max: 28 }));

  // Expiry date is 10 years after issuance
  const expiryDate = new Date(issuanceDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 10);

  // Format dates as ISO strings
  const issuanceDateISO = issuanceDate.toISOString().split('T')[0];
  const expiryDateISO = expiryDate.toISOString().split('T')[0];

  // Generate Machine Readable Zone (MRZ) lines
  const lastName = individual.lastName.substring(0, 33).toUpperCase().padEnd(33, '<');
  const firstName = individual.firstName.substring(0, 14).toUpperCase().padEnd(14, '<');
  const mrzLine1 = `P<USA${lastName}<<${firstName}`;
  
  const birthDate = individual.dateOfBirth.replace(/-/g, '').substring(2, 8);
  const expiryDateMrz = expiryDateISO.replace(/-/g, '').substring(2, 8);
  const checkDigits = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  const mrzLine2 = `${passportNumber}7USA${birthDate}${individual.gender === 'Female' ? 'F' : 'M'}${expiryDateMrz}${checkDigits}<<<<<<<<`;

  return {
    passportNumber,
    issuanceDate: issuanceDateISO,
    expiryDate: expiryDateISO,
    authority: 'United States Department of State',
    mrzLine1,
    mrzLine2,
    endorsements: null
  };
};
/**
 * AI-Powered Medical Data Generator using Azure OpenAI
 * Generates realistic medical records using large language models
 * 
 * This module provides AI-powered alternatives to the faker-based generators
 * in dataGenerator.ts. All functions use Azure OpenAI to generate realistic,
 * clinically coherent medical data.
 */

import { AzureOpenAI } from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { 
  Individual,
  Provider,
  InsuranceInfo,
  LabReport,
  VisitReports,
  MedicalHistory,
  Complexity,
  IndividualSchema,
  ProviderSchema,
  InsuranceInfoSchema,
  ClaimInfoSchema,
  LabReportSchema,
  VisitReportSchema,
  MedicalHistorySchema,
  VisitReport,
  W2,
  W2Schema,
  Passport,
  PassportSchema,
  ClaimInfo,
} from './zodSchemas';
import { 
  ResponseFormats, 
  validateWithSchema, 
  formatZodErrors
} from './jsonSchemaGenerator';
import {
  CacheConfig,
  DEFAULT_CACHE_CONFIG,
  generateCacheKey,
  getFromCache,
  saveToCache,
} from './cache';

// ============================================================================
// Azure OpenAI Configuration and Helper Functions
// ============================================================================

export interface AzureOpenAIConfig {
  endpoint: string;
  apiKey: string;
  deploymentName: string;
  apiVersion?: string;
}

/**
 * Validate Azure OpenAI configuration
 */
export function validateAzureConfig(config: AzureOpenAIConfig): { valid: boolean; error?: string } {
  if (!config.endpoint || !config.endpoint.trim()) {
    return { valid: false, error: 'Endpoint is required' };
  }
  
  if (!config.apiKey || !config.apiKey.trim()) {
    return { valid: false, error: 'API Key is required' };
  }
  
  if (!config.deploymentName || !config.deploymentName.trim()) {
    return { valid: false, error: 'Deployment Name is required' };
  }
  
  // Validate endpoint format
  try {
    new URL(config.endpoint);
  } catch {
    return { valid: false, error: 'Invalid endpoint URL format' };
  }
  
  return { valid: true };
}

/**
 * Create Azure OpenAI client
 */
function createAzureOpenAIClient(config: AzureOpenAIConfig): AzureOpenAI {
  const apiVersion = config.apiVersion || '2025-04-01-preview';
  
  return new AzureOpenAI({
    endpoint: config.endpoint,
    apiKey: config.apiKey,
    apiVersion: apiVersion,
    deployment: config.deploymentName,
    dangerouslyAllowBrowser: true
  });
}

/**
 * Call Azure OpenAI to generate data with retry logic
 */
async function generateDataWithAI(
  config: AzureOpenAIConfig,
  prompt: string,
  systemPrompt: string,
  retries: number = 3,
  responseFormat?: any
): Promise<any> {
  console.log('[generateDataWithAI] Starting generation with', retries, 'max retries');
  console.log('[generateDataWithAI] Prompt length:', prompt.length, 'characters');

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    console.log(`[generateDataWithAI] Attempt ${attempt + 1}/${retries}`);
    try {
      const client = createAzureOpenAIClient(config);
      
      const messages: ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ];

      console.log('[Azure OpenAI] Sending request...');
      const requestStartTime = Date.now();

      const completion = await client.chat.completions.create({
        model: config.deploymentName,
        messages: messages,
        max_completion_tokens: 32 * 1024,
        temperature: 1.0,
        response_format: responseFormat || { type: 'json_object' }
      });

      const requestDuration = Date.now() - requestStartTime;
      console.log('[Azure OpenAI] Response received in', requestDuration, 'ms');

      if (!completion.choices || completion.choices.length === 0) {
        throw new Error('No response from Azure OpenAI');
      }

      const content = completion.choices[0].message.content;
      if (!content || content.trim() === '') {
        throw new Error('Empty response from Azure OpenAI');
      }

      console.log('[generateDataWithAI] Parsing JSON response...');
      const parsedData = JSON.parse(content);

      if (typeof parsedData !== 'object' || parsedData === null) {
        throw new Error('Invalid JSON structure: expected object, got ' + typeof parsedData);
      }

      console.log('[generateDataWithAI] ✅ Generation successful!');
      return parsedData;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      console.error(`[generateDataWithAI] ❌ Attempt ${attempt + 1}/${retries} failed:`, error);
      
      // Retry logic
      if (attempt < retries - 1) {
        const waitTime = 1000 * (attempt + 1);
        console.warn(`[generateDataWithAI] Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      console.error('[generateDataWithAI] All retry attempts exhausted');
      break;
    }
  }

  throw lastError || new Error('Failed to generate medical data after all retries');
}

// ============================================================================
// AI-Powered Generator Functions (Compatible with dataGenerator.ts interface)
// ============================================================================

/**
 * Generate a patient using AI
 * Creates realistic patient demographics using Azure OpenAI
 * 
 * @param config Azure OpenAI configuration
 * @param cacheConfig Cache configuration
 * @returns Patient object
 */
export async function generateIndividualWithAI(
  config?: AzureOpenAIConfig,
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<Individual> {
  
  // Generate cache key based on parameters
  const cacheKey = generateCacheKey('generateIndividual');
  
  // Try to get from cache first
  const cached = getFromCache<Individual>(cacheConfig, cacheKey);
  if (cached) {
    console.log('✨ Patient data retrieved from cache');
    return cached;
  }

  const prompt = `Generate complete patient demographics for a synthetic medical record.

**Requirements:**
- Complete demographics:
  - First name, last name, middle initial (nullable)
  - Medical Record Number (MRN)
  - Date of Birth in MM/DD/YYYY format
  - Age (integer)
  - Gender: Male, Female, or Other
- Contact Information:
  - Phone in format (XXX) XXX-XXXX
  - Email address (valid format)
  - Emergency contact name and phone
- Address (US format):
  - Street, city, state (2-letter code), ZIP code, country
- Insurance/Account Information:
  - Social Security Number (XXX-XX-XXXX format)
  - Account number
- Pharmacy Information:
  - Name, address, phone
- Employment Information:
  - Company/Employer name
  - Employer Identification Number (EIN) in XX-XXXXXXX format
  - Employer address (street, city, state, ZIP)
  - Industry/business type
  - Employer phone (optional)

Generate realistic, clinically coherent data following US healthcare standards. All data must be completely synthetic and HIPAA-compliant.`;

  const systemPrompt = 'You are an expert medical data generator creating synthetic, realistic patient demographics for educational purposes. Generate completely fictional yet realistic data.';

  try {
    if (!config) {
      throw new Error('Azure OpenAI configuration is required for AI data generation');
    }
    const data = await generateDataWithAI(
      config,
      prompt,
      systemPrompt,
      3,
      ResponseFormats.Patient
    );
    
    // Validate with Zod schema
    const validation = validateWithSchema(IndividualSchema, data);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      throw new Error(`AI generated invalid patient data: ${errors.join(', ')}`);
    }

    console.log('✅ Patient data validated successfully');
    const validatedData = validation.data;
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, validatedData);
    
    return validatedData;
  } catch (error) {
    console.error('Failed to generate patient data with AI:', error);
    throw new Error(
      `Patient data generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate a provider using AI
 * Creates realistic provider and facility information using Azure OpenAI
 * 
 * @param config Azure OpenAI configuration
 * @param cacheConfig Cache configuration
 * @returns Provider object
 */
export async function generateProviderWithAI(
  config: AzureOpenAIConfig,
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<Provider> {
  
  // Generate cache key based on parameters
  const cacheKey = generateCacheKey('generateProvider');
  
  // Try to get from cache first
  const cached = getFromCache<Provider>(cacheConfig, cacheKey);
  if (cached) {
    console.log('✨ Provider data retrieved from cache');
    return cached;
  }

  const prompt = `Generate complete provider and facility information for a medical practice.

**Requirements:**
- Provider Information:
  - Full name with credentials (e.g., Dr. John Smith, MD)
  - National Provider Identifier (NPI): exactly 10 digits
  - Medical specialty (realistic specialty name)
  - Provider phone: (XXX) XXX-XXXX format
  - Provider address: street, city, state (2-letter), ZIP code
  - Tax ID: valid format for type (SSN: XXX-XX-XXXX or EIN: XX-XXXXXXX)
  - Tax ID Type: "SSN" or "EIN"
  - Signature: provider name (can be null)
- Facility Information:
  - Facility name
  - Facility address: street, city, state (2-letter), ZIP code
  - Facility phone: (XXX) XXX-XXXX format
  - Facility fax: (XXX) XXX-XXXX format
  - Facility NPI: exactly 10 digits
- Billing Provider Information:
  - Billing name
  - Billing address: street address (e.g., "123 Main St, Suite 100")
  - Billing phone: (XXX) XXX-XXXX format
  - Billing NPI: exactly 10 digits
- Referring Provider (optional): name, qualifier code (DN/DK/DQ), NPI (10 digits)

Generate realistic, professional provider and facility data following healthcare standards.`;

  const systemPrompt = 'You are an expert medical data generator creating synthetic provider and facility information for educational purposes. Generate completely fictional yet realistic data.';

  try {
    const data = await generateDataWithAI(
      config,
      prompt,
      systemPrompt,
      3,
      ResponseFormats.Provider
    );
    
    // Validate with Zod schema
    const validation = validateWithSchema(ProviderSchema, data);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      throw new Error(`AI generated invalid provider data: ${errors.join(', ')}`);
    }

    console.log('✅ Provider data validated successfully');
    const validatedData = validation.data;
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, validatedData);
    
    return validatedData;
  } catch (error) {
    console.error('Failed to generate provider data with AI:', error);
    throw new Error(
      `Provider data generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate insurance information using AI
 * Creates realistic insurance data using Azure OpenAI
 * 
 * @param config Azure OpenAI configuration
 * @param patient Patient object (70% chance patient will be the subscriber)
 * @param includeSecondary Whether to include secondary insurance
 * @param cacheConfig Cache configuration
 * @returns InsuranceInfo object
 */
export async function generateInsuranceInfoWithAI(
  config: AzureOpenAIConfig,
  individual: Individual,
  includeSecondary: boolean = false,
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<InsuranceInfo> {
  // Generate cache key based on parameters
  const cacheKey = generateCacheKey('generateInsuranceInfo', individual.id, includeSecondary);
  
  // Try to get from cache first
  const cached = getFromCache<InsuranceInfo>(cacheConfig, cacheKey);
  if (cached) {
    console.log('✨ Insurance data retrieved from cache');
    return cached;
  }

  // 70% chance to use individual as subscriber (matching dataGenerator.ts logic)
  const useIndividualAsSubscriber = Math.random() < 0.7;

  const prompt = `Generate complete insurance information for a medical record.

**Individual Information:**
- Name: ${individual.firstName} ${individual.lastName}
- DOB: ${individual.dateOfBirth}
- Gender: ${individual.gender}
- Address: ${individual.address.street}, ${individual.address.city}, ${individual.address.state} ${individual.address.zipCode}
- Phone: ${individual.contact.phone}

**Requirements:**
- Primary Insurance (required):
  - Provider name (major US insurer like UnitedHealth, Aetna, BlueCross, Cigna, etc.)
  - Policy number
  - Group number (can be null)
  - Member ID (can be null)
  - Effective date (YYYY-MM-DD format, current year)
  - Copay amount (e.g., "$20", can be null)
  - Deductible amount (e.g., "$1000", can be null)
${includeSecondary ? '- Secondary Insurance (required):\n  - Different provider from primary\n  - Similar structure to primary insurance' : '- Secondary Insurance: null (not included)'}
- Insurance Type: Medicare, Medicaid, TRICARE, CHAMPVA, Group, FECA, or Other
- PICA Code: null or specific code if applicable
- Subscriber Information:
  ${useIndividualAsSubscriber 
    ? '- IMPORTANT: Use EXACT individual information above for subscriber (name, DOB, gender, address, phone)'
    : '- Generate DIFFERENT subscriber (different person from individual)'}
  - Subscriber first name, last name
  - Subscriber date of birth (MM/DD/YYYY format)
  - Subscriber gender
  - Subscriber phone: (XXX) XXX-XXXX format
  - Subscriber address: street, city, state (2-letter), ZIP code
- Secondary Insured Information (nullable):
  - If applicable, include first name, last name, policy number, plan name

Generate realistic insurance information following US healthcare standards. All data must be completely synthetic.`;  const systemPrompt = 'You are an expert medical data generator creating synthetic insurance information for educational purposes. Generate completely fictional yet realistic data.';

  try {
    const data = await generateDataWithAI(
      config,
      prompt,
      systemPrompt,
      3,
      ResponseFormats.InsuranceInfo
    );
    
    // Validate with Zod schema
    const validation = validateWithSchema(InsuranceInfoSchema, data);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      throw new Error(`AI generated invalid insurance data: ${errors.join(', ')}`);
    }

    console.log('✅ Insurance data validated successfully');
    let validatedData = validation.data;
    
    // Enforce the 70% rule: if we decided individual should be subscriber, override AI's response
    if (useIndividualAsSubscriber) {
      validatedData = {
        ...validatedData,
        subscriberFirstName: individual.firstName,
        subscriberLastName: individual.lastName,
        subscriberDOB: individual.dateOfBirth,
        subscriberGender: individual.gender,
        address: individual.address,
        phone: individual.contact.phone
      };
    }
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, validatedData);
    
    return validatedData;
  } catch (error) {
    console.error('Failed to generate insurance data with AI:', error);
    throw new Error(
      `Insurance data generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate CMS-1500 form using AI
 * Creates a complete CMS-1500 claim form with service lines
 * 
 * @param config Azure OpenAI configuration
 * @param patient Patient object
 * @param insuranceInfo Insurance information
 * @param provider Provider object
 * @param cacheConfig Cache configuration
 * @returns ClaimInfo object
 */
export async function generateClaimInfoWithAI(
  config: AzureOpenAIConfig,
  individual: Individual,
  insuranceInfo: InsuranceInfo,
  provider: Provider,
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<ClaimInfo> {
  // Generate cache key based on individual ID
  const cacheKey = generateCacheKey('generateClaimInfo', individual.id);
  
  // Try to get from cache first
  const cached = getFromCache<ClaimInfo>(cacheConfig, cacheKey);
  if (cached) {
    console.log('✨ ClaimInfo data retrieved from cache');
    return cached;
  }

  const prompt = `Based on this individual data, generate realistic CMS-1500 insurance claim form data:

Individual: ${individual.firstName} ${individual.lastName}
DOB: ${individual.dateOfBirth}
Insurance: ${insuranceInfo.primaryInsurance.provider}
Provider: ${provider.name}

**Service Lines (generate 2-5 services):**
For each service line include:
- Service date from and to (MM/DD/YYYY format)
- Place of service code (e.g., 11=office, 21=inpatient hospital, 23=emergency room)
- Emergency indicator (Y/N)
- Procedure code (CPT code like 99213, 99214, 85025, etc.)
- Modifier (if applicable, e.g., 25, 59)
- Diagnosis pointer (A, B, C, D)
- Charges (realistic dollar amount as string, e.g., "150.00")
- Units (typically 1)
- EPSDT indicator (Y/N)
- ID Qualifier
- Rendering provider NPI

**Claim Information:**
- Patient relationship to subscriber: self, spouse, child, or other
- Signature date (MM/DD/YYYY)
- Provider signature date (MM/DD/YYYY)
- Date of current illness/injury (MM/DD/YYYY, or leave blank)
- Service date (MM/DD/YYYY)
- Illness qualifier code (if applicable)
- Unable to work from/to dates (if applicable, MM/DD/YYYY)
- Hospitalization from/to dates (if applicable, MM/DD/YYYY)
- Additional info (relevant claim information)
- Outside lab used: true/false
- Outside lab charges: dollar amount (string) or null
- Diagnosis codes: ICD-10 format (e.g., E11.9, I10, J06.9)
- Resubmission code: null or code
- Original reference number: null or number
- Prior authorization number: null or number
- Has other health plan: true/false
- Other claim ID: claim identifier
- Accept assignment: true/false
- Total charges: sum of service line charges
- Amount paid: amount already paid (usually "0.00" for new claims)

Generate realistic, compliant claims data. All data must be completely synthetic.`;

  const systemPrompt = 'You are a medical billing expert specializing in CMS-1500 forms. Generate realistic, compliant claims data. Always respond with ONLY valid JSON.';

  try {
    const data = await generateDataWithAI(
      config,
      prompt,
      systemPrompt,
      3,
      ResponseFormats.ClaimInfo
    );
    
    // Validate with Zod schema (validate only the claimInfo part)
    const validation = validateWithSchema(ClaimInfoSchema, data);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      throw new Error(`AI generated invalid CMS-1500 claim data: ${errors.join(', ')}`);
    }

    console.log('✅ CMS-1500 claim data validated successfully');
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, data);

    return data;
  } catch (error) {
    console.error('Failed to generate CMS-1500 data with AI:', error);
    throw new Error(
      `CMS-1500 data generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate laboratory reports using AI
 * Creates multiple lab reports for different test types
 * 
 * @param config Azure OpenAI configuration
 * @param testTypes Array of test types to generate
 * @param orderingPhysician Name of the ordering physician
 * @param cacheConfig Cache configuration
 * @returns Array of LabReport objects
 */
export async function generateLabReportsWithAI(
  config: AzureOpenAIConfig,
  testTypes: string[],
  orderingPhysician: string,
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<LabReport[]> {
  const labReports: LabReport[] = [];
  const totalTests = testTypes.length;

  // Test type details for prompts
  const testTypeDetails: Record<string, string> = {
    'CBC': 'Complete Blood Count (WBC, RBC, Hemoglobin, Hematocrit, Platelets, etc.)',
    'BMP': 'Basic Metabolic Panel (Glucose, Calcium, Sodium, Potassium, CO2, Chloride, BUN, Creatinine)',
    'CMP': 'Comprehensive Metabolic Panel (includes BMP + liver enzymes)',
    'Urinalysis': 'Color, Clarity, pH, Specific Gravity, Protein, Glucose, Ketones, Blood, etc.',
    'Lipid': 'Total Cholesterol, HDL, LDL, Triglycerides',
    'LFT': 'Liver Function Tests (ALT, AST, ALP, Bilirubin, Albumin, Total Protein)',
    'Thyroid': 'TSH, T3, T4',
    'HbA1c': 'Hemoglobin A1c percentage',
    'Coagulation': 'PT, PTT, INR',
    'Microbiology': 'Culture results, organism identification, sensitivities',
    'Pathology': 'Tissue examination, diagnosis',
    'Hormone': 'Various hormone levels',
    'Infectious': 'Disease markers, antibody tests'
  };

  console.log(`\n🧪 Generating ${totalTests} laboratory reports...`);

  // Generate each laboratory report individually
  for (let i = 0; i < testTypes.length; i++) {
    const testType = testTypes[i];
    const currentStep = i + 1;

    // Check cache for individual test type
    const cacheKey = generateCacheKey('generateLabReport', testType, orderingPhysician);
    const cached = getFromCache<LabReport>(cacheConfig, cacheKey);
    
    if (cached) {
      console.log(`  ✨ [${currentStep}/${totalTests}] ${testType}: Retrieved from cache`);
      labReports.push(cached);
      continue;
    }

    // Generate prompt for this specific test type
    const testDetail = testTypeDetails[testType] || testType;
    const prompt = `Generate a realistic laboratory test result for a ${testType} test:

Ordering Physician: ${orderingPhysician}
Test Type: ${testType}
Test Description: ${testDetail}

**Required Fields:**
- testType: "${testType}" (exact match)
- testName: Full name of the test (e.g., "Complete Blood Count")
- specimenType: Type of specimen (e.g., Blood, Urine, Serum, Plasma)
- specimenCollectionDate: Collection date (YYYY-MM-DD format)
- specimenCollectionTime: Collection time (HH:MM format, 24-hour)
- specimenReceivedDate: Date received by lab (YYYY-MM-DD format)
- reportDate: Report generation date (YYYY-MM-DD format)
- reportTime: Report generation time (HH:MM format, 24-hour)
- orderingPhysician: "${orderingPhysician}"
- performingLab:
  - name: Laboratory facility name
  - address: street, city, state, ZIP code, country
  - phone: (XXX) XXX-XXXX format
  - cliaNumber: CLIA certification number
  - director: Lab director name
- results: Array of test results, each with:
  - parameter: Test parameter name (e.g., "WBC", "Hemoglobin")
  - value: Numerical result value
  - unit: Unit of measurement (e.g., "K/mcL", "g/dL")
  - referenceRange: Normal range (e.g., "4.5-11.0")
  - flag: "Normal", "High", "Low", "Critical", "Abnormal", or empty string
  - notes: Additional notes (or null)
- interpretation: Clinical interpretation (string or null)
- comments: Additional comments (or null)
- criticalValues: Array of critical values (or null)
- technologist: Technologist name (or null)
- pathologist: Pathologist name (or null)

Make results clinically coherent and realistic for the test type.`;

    const systemPrompt = 'You are a clinical laboratory specialist. Generate realistic, clinically accurate laboratory test results. Always respond with ONLY valid JSON.';

    try {
      console.log(`  🔬 [${currentStep}/${totalTests}] Generating ${testType}...`);
      const data = await generateDataWithAI(config, prompt, systemPrompt, 3, ResponseFormats.LabReportData);
      
      // Validate with Zod schema
      const validation = validateWithSchema(LabReportSchema, data);
      
      if (!validation.success) {
        const errors = formatZodErrors(validation.errors);
        console.error(`  ❌ [${currentStep}/${totalTests}] ${testType} validation failed:`, errors);
        continue;
      }

      const validatedReport = validation.data;
      
      // Ensure testType is set
      if (!validatedReport.testType && !validatedReport.testName) {
        validatedReport.testType = testType as any;
      }

      // Save individual report to cache
      saveToCache(cacheConfig, cacheKey, validatedReport);
      
      labReports.push(validatedReport);
      console.log(`  ✅ [${currentStep}/${totalTests}] ${testType} generated successfully`);
      
    } catch (error) {
      console.error(`  ❌ [${currentStep}/${totalTests}] Failed to generate ${testType}:`, error);
      // Continue with other tests even if one fails
    }
  }

  console.log(`✅ Generated ${labReports.length}/${totalTests} laboratory reports\n`);
  
  return labReports;
}

/**
 * Generate visit reports using AI
 * Creates medical visit reports with vitals, examination, and plan
 * 
 * @param config Azure OpenAI configuration
 * @param numberOfVisits Number of visits to generate
 * @param providerName Name of the provider
 * @param cacheConfig Cache configuration
 * @returns Array of VisitReport objects
 */
export async function generateVisitReportsWithAI(
  config: AzureOpenAIConfig,
  numberOfVisits: number = 1,
  providerName: string,
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<VisitReports> {
  const visitReports: VisitReports = [];

  console.log(`\n🏥 Generating ${numberOfVisits} visit reports...`);

  for (let i = 0; i < numberOfVisits; i++) {
    const visitIndex = i;
    const currentStep = i + 1;

    // Generate cache key for individual visit
    const cacheKey = generateCacheKey('generateVisitReport', visitIndex, providerName);
    
    // Try to get from cache first
    const cached = getFromCache<VisitReport>(cacheConfig, cacheKey);
    if (cached) {
      console.log(`  ✨ [${currentStep}/${numberOfVisits}] Visit ${visitIndex + 1}: Retrieved from cache`);
      visitReports.push(cached);
      continue;
    }

    const daysAgo = 30 + (visitIndex * 60); // Space visits ~60 days apart
    const prompt = `Generate a realistic medical visit report:

Provider: ${providerName}
Visit Number: ${visitIndex + 1} of ${numberOfVisits}
Visit Date: approximately ${daysAgo} days ago

**Visit Information:**
- date: Visit date in MM/DD/YYYY format (approximately ${daysAgo} days ago)
- type: Visit type (Office Visit, Follow-up, Annual Physical, Consultation, etc.)
- provider: "${providerName}"
- duration: Duration (e.g., "30 minutes", "45 minutes")
- chiefComplaint: Chief complaint (realistic and age-appropriate)

**Vital Signs (required):**
- date: Date in MM/DD/YYYY format
- time: Time in HH:MM format (24-hour)
- bloodPressure: Format "XXX/XX" (e.g., "120/80")
- heartRate: String with "bpm" (e.g., "72 bpm")
- temperature: String with unit (e.g., "98.6°F")
- weight: String with unit (e.g., "180 lbs")
- height: String format like "5'10\"" or inches (e.g., "70 inches")
- bmi: Calculate BMI and format as string (e.g., "25.8")
- oxygenSaturation: String with % (e.g., "98%")
- respiratoryRate: String per minute (e.g., "16")

**Visit Details (required):**
- assessment: Array of diagnosis/assessment items (array of strings)
- plan: Array of treatment plan items (array of strings)

Make the visit clinically coherent with all vital signs filled out completely. All data must be completely synthetic.`;

    const systemPrompt = 'You are an experienced physician creating synthetic medical visit documentation for educational purposes. Generate realistic, clinically accurate visit reports.';

    try {
      console.log(`  🩺 [${currentStep}/${numberOfVisits}] Generating visit ${visitIndex + 1}...`);
      const data = await generateDataWithAI(
        config,
        prompt,
        systemPrompt,
        3,
        ResponseFormats.VisitReport
      );
      
      // Validate with Zod schema
      const validation = validateWithSchema(VisitReportSchema, data);
      
      if (!validation.success) {
        const errors = formatZodErrors(validation.errors);
        console.error(`  ❌ [${currentStep}/${numberOfVisits}] Visit ${visitIndex + 1} validation failed:`, errors);
        continue;
      }

      console.log(`  ✅ [${currentStep}/${numberOfVisits}] Visit ${visitIndex + 1} generated successfully`);
      const validatedData = validation.data;
      
      // Save to cache on success
      saveToCache(cacheConfig, cacheKey, validatedData);
      
      visitReports.push(validatedData);
    } catch (error) {
      console.error(`  ❌ [${currentStep}/${numberOfVisits}] Failed to generate visit ${visitIndex + 1}:`, error);
      // Continue with other visits even if one fails
    }
  }

  console.log(`✅ Generated ${visitReports.length}/${numberOfVisits} visit reports\n`);
  
  return visitReports;
}

/**
 * Generate medical history using AI
 * Creates a comprehensive patient medical history
 * 
 * @param config Azure OpenAI configuration
 * @param complexity Complexity level: 'low', 'medium', or 'high'
 * @param cacheConfig Cache configuration
 * @returns MedicalHistory object
 */
export async function generateMedicalHistoryWithAI(
  config: AzureOpenAIConfig,
  complexity: Complexity = 'medium',
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<MedicalHistory> {
  // Generate cache key based on complexity
  const cacheKey = generateCacheKey('generateMedicalHistory', complexity);
  
  // Try to get from cache first
  const cached = getFromCache<MedicalHistory>(cacheConfig, cacheKey);
  if (cached) {
    console.log('✨ Medical history retrieved from cache');
    return cached;
  }

  const complexityDetails = {
    low: '1-2 chronic conditions, 2-3 current medications, 1 allergy, minimal history',
    medium: '2-4 chronic conditions, 4-6 current medications, 2-3 allergies, moderate history',
    high: '4+ chronic conditions, 7+ medications, 3+ allergies, extensive history'
  };

  const prompt = `Generate a comprehensive medical history for a patient:

**Complexity Level: ${complexity}** (${complexityDetails[complexity]})

**Medications:**
- Current medications (array):
  - name, strength (e.g., "10mg"), dosage instructions (e.g., "Take 1 tablet twice daily")
  - purpose/indication, prescribing provider, start date (MM/DD/YYYY), special instructions
- Discontinued medications (array):
  - name, strength, reason for discontinuation, discontinued date (MM/DD/YYYY), prescribing provider

**Allergies (array):**
- allergen (substance name), reaction (e.g., "Rash", "Anaphylaxis")
- severity (Mild, Moderate, Severe), date identified (MM/DD/YYYY)

**Chronic Conditions (array):**
- condition name (e.g., "Hypertension", "Type 2 Diabetes")
- diagnosed date (MM/DD/YYYY), status (Active, Controlled, Resolved), notes

**Surgical History (array):**
- procedure name, date of surgery (MM/DD/YYYY), hospital/facility name
- surgeon name, complications ("None" if none)

**Family History (array):**
- relation (Mother, Father, Brother, Sister, Sibling, Cousin, etc.)
- conditions (array of condition names), age at death or "Living"
- cause of death (specific cause or "N/A")

Make all conditions and medications clinically appropriate and internally consistent. All data must be completely synthetic.`;

  const systemPrompt = 'You are an experienced physician creating comprehensive synthetic medical histories for educational purposes. Generate realistic, clinically coherent medical data.';

  try {
    const data = await generateDataWithAI(
      config,
      prompt,
      systemPrompt,
      3,
      ResponseFormats.MedicalHistory
    );
    
    // Validate with Zod schema
    const validation = validateWithSchema(MedicalHistorySchema, data);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      throw new Error(`AI generated invalid medical history: ${errors.join(', ')}`);
    }

    console.log('✅ Medical history validated successfully');
    const validatedData = validation.data;
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, validatedData);
    
    return validatedData;
  } catch (error) {
    console.error('Failed to generate medical history with AI:', error);
    throw new Error(
      `Medical history generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate W-2 form using AI
 * Creates realistic W-2 wage and tax statement using Azure OpenAI
 * 
 * @param config Azure OpenAI configuration
 * @param individual Individual data with employer information
 * @param cacheConfig Cache configuration
 * @returns W2 object
 */
export async function generateW2WithAI(
  config: AzureOpenAIConfig,
  individual: Individual,
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<W2> {
  // Generate cache key based on parameters
  const cacheKey = generateCacheKey('generateW2', individual.id);
  
  // Try to get from cache first
  const cached = getFromCache<W2>(cacheConfig, cacheKey);
  if (cached) {
    console.log('✨ W-2 data retrieved from cache');
    return cached;
  }

  const prompt = `Generate a complete W-2 wage and tax statement for an employee.

**Employee Information:**
- Name: ${individual.firstName} ${individual.lastName}
- SSN: ${individual.ssn}
- Address: ${individual.address.street}, ${individual.address.city}, ${individual.address.state} ${individual.address.zipCode}

**Employer Information:**
- Company: ${individual.companyName}
- EIN: ${individual.employerEIN}
- Address: ${individual.employerAddress.street}, ${individual.employerAddress.city}, ${individual.employerAddress.state} ${individual.employerAddress.zipCode}

**Required Fields (all amounts as decimal strings, e.g., "12345.67"):**
- taxYear: Current year minus 1 (YYYY format)
- wages: Annual wages $30,000-$150,000
- federalIncomeTaxWithheld: ~15% of wages
- socialSecurityWages: Usually same as wages
- socialSecurityTaxWithheld: 6.2% of social security wages
- medicareWages: Usually same as wages
- medicareTaxWithheld: 1.45% of medicare wages
- socialSecurityTips: null or dollar amount
- allocatedTips: null or dollar amount
- dependentCareBenefits: null or dollar amount
- nonqualifiedPlans: null or dollar amount
- box12Codes: Array of {code, amount} pairs (or null)
  - Common codes: "D"=401k, "DD"=health insurance premiums, "W"=401k distribution
- Checkboxes (nullable booleans):
  - statutoryEmployee, retirementPlan, thirdPartySickPay
- State/Local Information:
  - stateWages: State wages (or null), stateIncomeTax: State tax (or null)
  - localWages: Local wages (or null), localIncomeTax: Local tax (or null)
  - localityName: Locality name (or null)
- controlNumber: Employer control number (or null)

Generate a complete, realistic W-2 statement with all amounts consistent and realistic.`;

  const systemPrompt = 'You are an expert tax document generator creating synthetic W-2 forms for educational purposes. Generate completely fictional yet realistic tax data that follows IRS W-2 format requirements.';

  try {
    const data = await generateDataWithAI(
      config,
      prompt,
      systemPrompt,
      3,
      ResponseFormats.W2
    );
    
    // Validate with Zod schema
    const validation = validateWithSchema(W2Schema, data);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      throw new Error(`AI generated invalid W-2 data: ${errors.join(', ')}`);
    }

    console.log('✅ W-2 data validated successfully');
    const validatedData = validation.data;
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, validatedData);
    
    return validatedData;
  } catch (error) {
    console.error('Failed to generate W-2 data with AI:', error);
    throw new Error(
      `W-2 data generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate Passport using AI
 * Creates realistic US passport data using Azure OpenAI
 * 
 * @param config Azure OpenAI configuration
 * @param individual Individual data for passport holder
 * @param cacheConfig Cache configuration
 * @returns Passport object
 */
export async function generatePassportWithAI(
  config: AzureOpenAIConfig,
  individual: Individual,
  cacheConfig: CacheConfig = DEFAULT_CACHE_CONFIG
): Promise<Passport> {
  // Generate cache key based on parameters
  const cacheKey = generateCacheKey('generatePassport', individual.id);
  
  // Try to get from cache first
  const cached = getFromCache<Passport>(cacheConfig, cacheKey);
  if (cached) {
    console.log('✨ Passport data retrieved from cache');
    return cached;
  }

  const prompt = `Generate a complete US Passport document for an individual.

**Passport Holder Information:**
- Full Name: ${individual.firstName} ${individual.lastName}
- Date of Birth: ${individual.dateOfBirth}
- Gender: ${individual.gender}
- Address: ${individual.address.street}, ${individual.address.city}, ${individual.address.state} ${individual.address.zipCode}

**Required Fields:**
- passportNumber: 9 digits, format starting with 5-6 (e.g., "520123456")
- issuanceDate: ISO 8601 format (YYYY-MM-DD), within last 10 years
- expiryDate: ISO 8601 format (YYYY-MM-DD), exactly 10 years after issuance
- authority: "United States Department of State"
- mrzLine1: Machine Readable Zone Line 1
  - Format: P<USA followed by last name in CAPS (padded with < to 44 chars)
  - Example: "P<USASMITH<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
- mrzLine2: Machine Readable Zone Line 2
  - Format: [9-digit passport#][check digit][country][YYMMDD DOB][check][gender][YYMMDD expiry][check][other]
  - Must include valid check digits
- endorsements: null or specific endorsement text if applicable

**Important:**
- All dates in ISO 8601 format (YYYY-MM-DD)
- MRZ lines must follow exact US passport format
- Ensure internal consistency between dates
- Generate realistic, properly formatted passport data

All data must be completely synthetic and follow US State Department standards.`;

  const systemPrompt = 'You are an expert passport document generator creating synthetic US passport data for educational purposes. Generate completely fictional yet realistic passport documents following US State Department standards.';

  try {
    const data = await generateDataWithAI(
      config,
      prompt,
      systemPrompt,
      3,
      ResponseFormats.Passport
    );
    
    // Add individual reference
    const passportData = {
      ...data,
      individual
    };
    
    // Validate with Zod schema
    const validation = validateWithSchema(PassportSchema, passportData);
    
    if (!validation.success) {
      const errors = formatZodErrors(validation.errors);
      throw new Error(`AI generated invalid passport data: ${errors.join(', ')}`);
    }

    console.log('✅ Passport data validated successfully');
    const validatedData = validation.data;
    
    // Save to cache on success
    saveToCache(cacheConfig, cacheKey, validatedData);
    
    return validatedData;
  } catch (error) {
    console.error('Failed to generate passport data with AI:', error);
    throw new Error(
      `Passport data generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

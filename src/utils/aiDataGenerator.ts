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
  CMS1500,
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
- Complete demographics with realistic US address, contact info
- Medical Record Number (MRN), Social Security Number (SSN format: XXX-XX-XXXX)
- Account number
- Age
- Gender, randomly selected from Male, Female and Other
- All dates in MM/DD/YYYY format
- Pharmacy information with name, address, and phone
- All data must be completely synthetic and HIPAA-compliant

Generate realistic, clinically coherent data following US healthcare standards.`;

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
- Provider: Full name with credentials (Dr. First Last, MD)
- National Provider Identifier (NPI): 10 digits
- Medical specialty, choose appropriate specialty
- Provider phone, address (US format)
- Tax ID (EIN or SSN format) with type
- Provider signature (provider's name)
- Facility information:
  - Facility name
  - Facility address (US format)
  - Facility phone and fax numbers
  - Facility NPI (10 digits)
- Billing provider information
- All data must be completely synthetic

Generate realistic, professional provider and facility data.`;

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
- Primary insurance (required):
  - Provider name (major US insurer)
  - Policy number
  - Group number
  - Member ID
  - Effective date (current year)
  - Copay and deductible amounts
${includeSecondary ? '- Secondary insurance with similar details and different provider' : '- No secondary insurance (set to null)'}
- Subscriber information:
  ${useIndividualAsSubscriber 
    ? '- IMPORTANT: Use the EXACT individual information above for subscriber (name, DOB, gender, address, phone)'
    : '- Generate DIFFERENT subscriber information (different person from individual)'}
- Insurance type (e.g., HMO, PPO, Medicare)
- All data must be completely synthetic

Generate realistic insurance information following US healthcare standards.`;

  const systemPrompt = 'You are an expert medical data generator creating synthetic insurance information for educational purposes. Generate completely fictional yet realistic data.';

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
        subscriberName: individual.name,
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

Generate comprehensive service lines (2-5 services) with:
- Date of service (within last 90 days)
- Place of service code (appropriate for service type)
- Procedure codes (CPT codes like 99213, 99214, 85025, etc.)
- Diagnosis pointers (linking to conditions)
- Charges (realistic amounts)
- Units and modifiers

Include claim information with:
- Patient relationship to subscriber
- Signature date
- Illness/injury date (if applicable)
- Diagnosis codes (ICD-10)
- Prior authorization number (if applicable)
- Total charges

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
    const prompt = `Generate a realistic laboratory test result:

Ordering Physician: ${orderingPhysician}

Generate a ${testType} laboratory report: ${testDetail}

Include:
- Test name and type
- Date of collection and reporting (within last 30 days)
- Specimen type and collection method
- Individual test results with values, units, and reference ranges
- Flags for abnormal values (High/Low)
- Performing laboratory information
- Ordering provider

Make results clinically coherent with patient age and realistic for the test type.`;

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

Include:
- Visit date and time
- Visit type (Office Visit, Follow-up, Annual Physical, etc.)
- Chief complaint (realistic and age-appropriate)
- History of present illness
- Vital signs (BP, HR, Temp, RR, O2 Sat, Height, Weight, BMI)
- Physical examination findings
- Assessment and diagnosis
- Treatment plan
- Follow-up instructions
- Medications prescribed or refilled
- Visit duration

Make the visit clinically coherent. All data must be completely synthetic.`;

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
    high: '4+ chronic conditions, 7+ current medications, 3+ allergies, extensive history'
  };

  const prompt = `Generate a comprehensive medical history for a patient:

**Complexity Level: ${complexity}** (${complexityDetails[complexity]})

Include:
- Current medications (with dosages, frequencies, start dates)
- Discontinued medications (with reasons)
- Chronic conditions (with diagnosis dates, status)
- Allergies (allergen, reaction, severity)
- Surgical history (procedures with dates)
- Family history (relatives, conditions, ages)
- Social history (smoking, alcohol, exercise, occupation)
- Immunizations (vaccines with dates)

Make all conditions and medications clinically appropriate.
Ensure internal consistency across all medical history elements.
All data must be completely synthetic.`;

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

**Requirements:**
- Annual wages: $30,000 - $150,000 (realistic amount)
- Calculate realistic tax withholdings (federal ~15%, Social Security 6.2%, Medicare 1.45%, state ~5%)
- Include realistic Box 12 codes (e.g., D for 401k, DD for health coverage)
- All amounts formatted as decimal strings (e.g., "12345.67")
- Tax year: current year minus 1
- Include all wage and tax information
- All data must be consistent and realistic

Generate a complete, realistic W-2 statement.`;

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

**Requirements:**
- Passport Number: 9 digits starting with 5-6
- Issue Date: Within the last 10 years (ISO 8601 format: YYYY-MM-DD)
- Expiry Date: 10 years after issue date (ISO 8601 format: YYYY-MM-DD)
- Authority: "United States Department of State"
- Machine Readable Zone (MRZ) Line 1: Format P<USA + last name (padded with <) + first name (padded with <)
- Machine Readable Zone (MRZ) Line 2: Passport number + check digit + country code + birth date + gender + expiry date + check digit
- All dates in ISO 8601 format (YYYY-MM-DD)
- Endorsements: null or specific text if applicable

Generate realistic, properly formatted passport data.`;

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

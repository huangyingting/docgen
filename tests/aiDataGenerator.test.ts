/**
 * Test suite for AI Data Generator Functions
 * Tests all AI-powered medical data generation functions
 * 
 * Prerequisites:
 * - Azure OpenAI credentials configured in .env file
 * - Valid deployment with sufficient quota
 * 
 * Run with: npm run test:ai
 */

// Load environment variables from .env file
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import {
  generateIndividualWithAI,
  generateProviderWithAI,
  generateInsuranceInfoWithAI,
  generateClaimInfoWithAI,
  generateLabReportsWithAI,
  generateVisitReportsWithAI,
  generateMedicalHistoryWithAI,
  generateW2WithAI,
  generatePassportWithAI,
  AzureOpenAIConfig,
} from '../src/utils/aiDataGenerator';
import { Individual, Provider, Complexity, W2, Passport } from '../src/utils/zodSchemas';
import { CacheConfig } from '../src/utils/cache';

// ============================================================================
// Test Configuration
// ============================================================================

// Load Azure OpenAI configuration from environment variables
const config: AzureOpenAIConfig = {
  endpoint: process.env.VITE_AZURE_OPENAI_ENDPOINT || '',
  apiKey: process.env.VITE_AZURE_OPENAI_API_KEY || '',
  deploymentName: process.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME || '',
  apiVersion: process.env.VITE_AZURE_OPENAI_API_VERSION || '2025-04-01-preview',
};

// Cache configuration for tests (enable caching to speed up repeated runs)
const cacheConfig: CacheConfig = {
  enabled: true,
  directory: '.cache/ai-data-tests',
  ttl: 3600000, // 1 hour
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate that Azure OpenAI is configured
 */
function validateConfiguration(): boolean {
  if (!config.endpoint || !config.apiKey || !config.deploymentName) {
    console.error('❌ Azure OpenAI configuration is missing!');
    console.error('Please configure the following environment variables:');
    console.error('  - VITE_AZURE_OPENAI_ENDPOINT');
    console.error('  - VITE_AZURE_OPENAI_API_KEY');
    console.error('  - VITE_AZURE_OPENAI_DEPLOYMENT_NAME');
    console.error('\nCopy .env.example to .env and fill in your credentials.');
    return false;
  }
  return true;
}

/**
 * Print test section header
 */
function printHeader(title: string) {
  console.log('\n' + '='.repeat(80));
  console.log(`  ${title}`);
  console.log('='.repeat(80) + '\n');
}

/**
 * Print test result
 */
function printResult(testName: string, success: boolean, data?: any, error?: any) {
  if (success) {
    console.log(`✅ ${testName}`);
    if (data) {
      console.log(`   Data preview:`, JSON.stringify(data, null, 2).substring(0, 200) + '...');
    }
  } else {
    console.log(`❌ ${testName}`);
    if (error) {
      console.log(`   Error: ${error.message || error}`);
    }
  }
}

/**
 * Run a test with error handling
 */
async function runTest<T>(
  testName: string,
  testFn: () => Promise<T>
): Promise<{ success: boolean; data?: T; error?: any }> {
  try {
    const data = await testFn();
    printResult(testName, true, data);
    return { success: true, data };
  } catch (error) {
    printResult(testName, false, undefined, error);
    return { success: false, error };
  }
}

// ============================================================================
// Test Functions
// ============================================================================

/**
 * Test 1: Generate Individual
 */
async function testGenerateIndividual() {
  printHeader('Test 1: Generate Individual');

  // Test 1a: Basic individual generation
  const result1 = await runTest('Generate basic individual', async () => {
    return await generateIndividualWithAI(config, cacheConfig);
  });

  // Test 1b: Second individual generation
  const result2 = await runTest('Generate another individual', async () => {
    return await generateIndividualWithAI(config, cacheConfig);
  });

  // Test 1c: Third individual generation
  const result3 = await runTest('Generate third individual', async () => {
    return await generateIndividualWithAI(config, cacheConfig);
  });

  return {
    passed: result1.success && result2.success && result3.success,
    individual: result1.data, // Return for use in subsequent tests
  };
}

/**
 * Test 2: Generate Provider
 */
async function testGenerateProvider() {
  printHeader('Test 2: Generate Provider');

  // Test 2a: Basic provider generation
  const result1 = await runTest('Generate basic provider', async () => {
    return await generateProviderWithAI(config, cacheConfig);
  });

  // Test 2b: Second provider generation
  const result2 = await runTest('Generate another provider', async () => {
    return await generateProviderWithAI(config, cacheConfig);
  });

  // Test 2c: Third provider generation
  const result3 = await runTest('Generate third provider', async () => {
    return await generateProviderWithAI(config, cacheConfig);
  });

  return {
    passed: result1.success && result2.success && result3.success,
    provider: result1.data, // Return for use in subsequent tests
  };
}

/**
 * Test 3: Generate Insurance Information
 */
async function testGenerateInsurance(individual: Individual) {
  printHeader('Test 3: Generate Insurance Information');

  if (!individual) {
    console.log('❌ Skipping insurance test - no individual data available');
    return { passed: false };
  }

  // Test 3a: Primary insurance only
  const result1 = await runTest('Generate primary insurance only', async () => {
    return await generateInsuranceInfoWithAI(config, individual, false, cacheConfig);
  });

  // Test 3b: Primary and secondary insurance
  const result2 = await runTest('Generate primary and secondary insurance', async () => {
    return await generateInsuranceInfoWithAI(config, individual, true, cacheConfig);
  });

  return {
    passed: result1.success && result2.success,
    insurance: result1.data, // Return for use in subsequent tests
  };
}

/**
 * Test 4: Generate CMS-1500 Form
 */
async function testGenerateClaimInfo(
  individual: Individual,
  insurance: any,
  provider: Provider
) {
  printHeader('Test 4: Generate CMS-1500 Form');

  if (!individual || !insurance || !provider) {
    console.log('❌ Skipping CMS-1500 test - missing prerequisite data');
    return { passed: false };
  }

  const result = await runTest('Generate CMS-1500 claim form', async () => {
    return await generateClaimInfoWithAI(
      config,
      individual,
      insurance,
      provider,
      cacheConfig
    );
  });

  return { passed: result.success };
}

/**
 * Test 5: Generate Laboratory Reports
 */
async function testGenerateLabReports(individual: Individual, provider: Provider) {
  printHeader('Test 5: Generate Laboratory Reports');

  if (!individual || !provider) {
    console.log('❌ Skipping lab reports test - missing prerequisite data');
    return { passed: false };
  }

  // Test 5a: Generate single lab report (CBC)
  const result1 = await runTest('Generate single lab report (CBC)', async () => {
    return await generateLabReportsWithAI(
      config,
      ['CBC'],
      provider.name,
      cacheConfig
    );
  });

  // Test 5b: Generate multiple lab reports
  const result2 = await runTest('Generate multiple lab reports (CBC, BMP, Lipid)', async () => {
    return await generateLabReportsWithAI(
      config,
      ['CBC', 'BMP', 'Lipid'],
      provider.name,
      cacheConfig
    );
  });

  // Test 5c: Generate comprehensive panel
  const result3 = await runTest('Generate comprehensive panel', async () => {
    return await generateLabReportsWithAI(
      config,
      ['CBC', 'CMP', 'Lipid', 'Thyroid', 'HbA1c'],
      provider.name,
      cacheConfig
    );
  });

  return {
    passed: result1.success && result2.success && result3.success,
  };
}

/**
 * Test 6: Generate Visit Report
 */
async function testGenerateVisitReport(individual: Individual, provider: Provider) {
  printHeader('Test 6: Generate Visit Report');

  if (!individual || !provider) {
    console.log('❌ Skipping visit report test - missing prerequisite data');
    return { passed: false };
  }

  // Test 6a: Single visit report
  const result1 = await runTest('Generate single visit report', async () => {
    return await generateVisitReportsWithAI(
      config,
      1,
      provider.name,
      cacheConfig
    );
  });

  // Test 6b: Multiple visits
  const result2 = await runTest('Generate multiple visit reports (3 visits)', async () => {
    return await generateVisitReportsWithAI(
      config,
      3,
      provider.name,
      cacheConfig
    );
  });

  return { passed: result1.success && result2.success };
}

/**
 * Test 7: Generate Medical History
 */
async function testGenerateMedicalHistory(individual: Individual) {
  printHeader('Test 7: Generate Medical History');

  if (!individual) {
    console.log('❌ Skipping medical history test - no individual data available');
    return { passed: false };
  }

  // Test 7a: Low complexity
  const result1 = await runTest('Generate medical history (low complexity)', async () => {
    return await generateMedicalHistoryWithAI(
      config,
      'low' as Complexity,
      cacheConfig
    );
  });

  // Test 7b: Medium complexity
  const result2 = await runTest('Generate medical history (medium complexity)', async () => {
    return await generateMedicalHistoryWithAI(
      config,
      'medium' as Complexity,
      cacheConfig
    );
  });

  // Test 7c: High complexity
  const result3 = await runTest('Generate medical history (high complexity)', async () => {
    return await generateMedicalHistoryWithAI(
      config,
      'high' as Complexity,
      cacheConfig
    );
  });

  return {
    passed: result1.success && result2.success && result3.success,
  };
}

/**
 * Test 10: Generate W-2 Form
 */
async function testGenerateW2(individual: Individual) {
  printHeader('Test 8: Generate W-2 Form');

  if (!individual) {
    console.log('❌ Skipping W-2 test - no individual data available');
    return { passed: false };
  }

  // Test 8a: Generate W-2 form
  const result1 = await runTest('Generate W-2 wage and tax statement', async () => {
    const w2 = await generateW2WithAI(config, individual, cacheConfig);
    
    // Validate key fields
    if (!w2.taxYear || !w2.wages || !w2.federalIncomeTaxWithheld) {
      throw new Error('Missing required W-2 fields');
    }
    
    // Validate amounts are strings (decimal format)
    if (typeof w2.wages !== 'string' || typeof w2.federalIncomeTaxWithheld !== 'string') {
      throw new Error('W-2 amounts must be strings in decimal format');
    }
    
    return w2;
  });

  // Test 8b: Verify tax calculations are realistic
  if (result1.data) {
    const result2 = await runTest('Validate W-2 tax calculations', async () => {
      const w2 = result1.data as W2;
      const wages = parseFloat(w2.wages);
      const federalTax = parseFloat(w2.federalIncomeTaxWithheld);
      const ssTax = parseFloat(w2.socialSecurityTaxWithheld);
      const medicareTax = parseFloat(w2.medicareTaxWithheld);

      // Federal tax should be 10-20% of wages
      if (federalTax < wages * 0.10 || federalTax > wages * 0.25) {
        throw new Error(`Federal tax ${federalTax} not in realistic range for wages ${wages}`);
      }

      // Social Security tax should be ~6.2% of wages
      const expectedSS = wages * 0.062;
      if (Math.abs(ssTax - expectedSS) > wages * 0.01) {
        console.warn(`  Warning: Social Security tax ${ssTax} differs from expected ${expectedSS}`);
      }

      return { validated: true };
    });

    return {
      passed: result1.success && result2.success,
      w2: result1.data,
    };
  }

  return { passed: result1.success };
}

/**
 * Test 9: Generate Passport
 */
async function testGeneratePassport(individual: Individual) {
  printHeader('Test 9: Generate Passport');

  if (!individual) {
    console.log('❌ Skipping Passport test - no individual data available');
    return { passed: false };
  }

  // Test 9a: Generate passport
  const result1 = await runTest('Generate US Passport document', async () => {
    const passport = await generatePassportWithAI(config, individual, cacheConfig);
    
    // Validate required fields
    if (!passport.passportNumber || !passport.issuanceDate || !passport.expiryDate) {
      throw new Error('Missing required passport fields');
    }
    
    // Validate passport number format (9 digits)
    if (!/^\d{9}$/.test(passport.passportNumber)) {
      throw new Error(`Invalid passport number format: ${passport.passportNumber}`);
    }
    
    return passport;
  });

  // Test 9b: Verify date validity and MRZ
  if (result1.data) {
    const result2 = await runTest('Validate Passport dates and MRZ', async () => {
      const passport = result1.data as Passport;
      
      // Parse dates
      const issueDate = new Date(passport.issuanceDate);
      const expiryDate = new Date(passport.expiryDate);
      
      // Expiry should be 10 years after issuance
      const expectedExpiry = new Date(issueDate);
      expectedExpiry.setFullYear(expectedExpiry.getFullYear() + 10);
      
      const daysDiff = Math.abs(
        (expiryDate.getTime() - expectedExpiry.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysDiff > 1) {
        throw new Error(`Expiry date ${expiryDate} not 10 years from issue date ${issueDate}`);
      }
      
      // Validate MRZ lines exist and have content
      if (!passport.mrzLine1 || !passport.mrzLine2) {
        throw new Error('Missing MRZ lines');
      }
      
      // MRZ Line 1 should start with P<USA
      if (!passport.mrzLine1.startsWith('P<USA')) {
        console.warn(`  Warning: MRZ Line 1 format may be incorrect: ${passport.mrzLine1.substring(0, 30)}...`);
      }
      
      return { validated: true };
    });

    return {
      passed: result1.success && result2.success,
      passport: result1.data,
    };
  }

  return { passed: result1.success };
}
async function testCompleteIntegration() {
  printHeader('Test 10: Integration Test - Complete Medical Record Generation');

  console.log('Generating a complete medical record with all components...\n');

  try {
    // Step 1: Generate Individual
    console.log('Step 1/9: Generating individual...');
    const individual = await generateIndividualWithAI(config, cacheConfig);
    console.log(`✅ Individual: ${individual.firstName} ${individual.lastName}`);

    // Step 2: Generate Provider
    console.log('\nStep 2/9: Generating provider...');
    const provider = await generateProviderWithAI(config, cacheConfig);
    console.log(`✅ Provider: ${provider.name}`);

    // Step 3: Generate Insurance
    console.log('\nStep 3/9: Generating insurance...');
    const insurance = await generateInsuranceInfoWithAI(config, individual, true, cacheConfig);
    console.log(`✅ Insurance: ${insurance.primaryInsurance.provider}`);

    // Step 4: Generate Medical History
    console.log('\nStep 4/9: Generating medical history...');
    const medicalHistory = await generateMedicalHistoryWithAI(config, 'medium', cacheConfig);
    console.log(`✅ Medical History: ${medicalHistory.medications.current.length} medications, ${medicalHistory.chronicConditions.length} conditions`);

    // Step 5: Generate Visit Reports
    console.log('\nStep 5/9: Generating visit reports...');
    const visitReports = await generateVisitReportsWithAI(config, 1, provider.name, cacheConfig);
    console.log(`✅ Visit Reports: ${visitReports[0]?.visit.chiefComplaint}`);

    // Step 6: Generate Lab Reports
    console.log('\nStep 6/9: Generating lab reports...');
    const labReports = await generateLabReportsWithAI(
      config,
      ['CBC', 'BMP'],
      provider.name,
      cacheConfig
    );
    console.log(`✅ Lab Reports: Generated ${labReports.length} reports`);

    // Step 7: Generate Claim Information
    console.log('\nStep 7/9: Generating claim information...');
    const claimInfo = await generateClaimInfoWithAI(config, individual, insurance, provider, cacheConfig);
    console.log(`✅ Claim Information: ${claimInfo.serviceLines.length} service lines`);

    // Step 8: Generate W-2 Form
    console.log('\nStep 8/9: Generating W-2 form...');
    const w2 = await generateW2WithAI(config, individual, cacheConfig);
    console.log(`✅ W-2 Form: Tax year ${w2.taxYear}, Wages: $${parseFloat(w2.wages).toLocaleString()}`);

    // Step 9: Generate Passport
    console.log('\nStep 9/9: Generating passport...');
    const passport = await generatePassportWithAI(config, individual, cacheConfig);
    console.log(`✅ Passport: Number ${passport.passportNumber}, Expires ${passport.expiryDate}`);

    console.log('\n' + '='.repeat(80));
    console.log('✅ Complete medical record generated successfully!');
    console.log('='.repeat(80));

    return { passed: true };
  } catch (error) {
    console.error('\n❌ Integration test failed:', error);
    return { passed: false };
  }
}

// ============================================================================
// Main Test Runner
// ============================================================================

async function runAllTests() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                     AI Data Generator Test Suite                              ║');
  console.log('║                  Testing Azure OpenAI Integration                             ║');
  console.log('║                  Testing all 9 AI generation functions                       ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝');

  // Validate configuration
  if (!validateConfiguration()) {
    process.exit(1);
  }

  console.log('\n✅ Azure OpenAI configuration validated');
  console.log(`   Endpoint: ${config.endpoint}`);
  console.log(`   Deployment: ${config.deploymentName}`);
  console.log(`   API Version: ${config.apiVersion}`);
  console.log(`   Cache: ${cacheConfig.enabled ? 'Enabled' : 'Disabled'}`);

  const startTime = Date.now();
  const results: { [key: string]: boolean } = {};

  // Run tests sequentially to reuse generated data
  let individual: Individual | undefined;
  let provider: Provider | undefined;
  let insurance: any;

  // Test 1: Individual Generation
  const test1 = await testGenerateIndividual();
  results['Test 1: Individual Generation'] = test1.passed;
  individual = test1.individual;

  // Test 2: Provider Generation
  const test2 = await testGenerateProvider();
  results['Test 2: Provider Generation'] = test2.passed;
  provider = test2.provider;

  // Test 3: Insurance Information (requires individual)
  if (individual) {
    const test3 = await testGenerateInsurance(individual);
    results['Test 3: Insurance Information'] = test3.passed;
    insurance = test3.insurance;
  }

  // Test 4: CMS-1500 Form (requires individual, insurance, provider)
  if (individual && insurance && provider) {
    const test4 = await testGenerateClaimInfo(individual, insurance, provider);
    results['Test 4: CMS-1500 Form'] = test4.passed;
  }

  // Test 5: Laboratory Reports (requires individual, provider)
  if (individual && provider) {
    const test5 = await testGenerateLabReports(individual, provider);
    results['Test 5: Laboratory Reports'] = test5.passed;
  }

  // Test 6: Visit Report (requires individual, provider)
  if (individual && provider) {
    const test6 = await testGenerateVisitReport(individual, provider);
    results['Test 6: Visit Report'] = test6.passed;
  }

  // Test 7: Medical History (requires individual)
  if (individual) {
    const test7 = await testGenerateMedicalHistory(individual);
    results['Test 7: Medical History'] = test7.passed;
  }

  // Test 8: W-2 Form (requires individual)
  if (individual) {
    const test8 = await testGenerateW2(individual);
    results['Test 8: W-2 Form'] = test8.passed;
  }

  // Test 9: Passport (requires individual)
  if (individual) {
    const test9 = await testGeneratePassport(individual);
    results['Test 9: Passport'] = test9.passed;
  }

  // Test 10: Complete Integration Test
  const test10 = await testCompleteIntegration();
  results['Test 10: Complete Integration'] = test10.passed;

  // Print summary
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  printHeader('Test Summary');

  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;

  console.log('Test Results:');
  Object.entries(results).forEach(([name, passed]) => {
    console.log(`  ${passed ? '✅' : '❌'} ${name}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log(`Total: ${passed}/${total} tests passed`);
  console.log(`Duration: ${duration}s`);
  console.log('='.repeat(80) + '\n');

  // Exit with appropriate code
  if (passed === total) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Please review the errors above.');
    process.exit(1);
  }
}

// ============================================================================
// Execute Tests
// ============================================================================

// Run all tests
runAllTests().catch((error) => {
  console.error('\n💥 Fatal error running tests:', error);
  process.exit(1);
});

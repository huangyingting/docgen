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
  AzureOpenAIConfig,
} from '../src/utils/aiDataGenerator';
import { Individual, Provider, Complexity } from '../src/utils/zodSchemas';
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
async function testGenerateCMS1500(
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
 * Test 8: Integration Test - Complete Medical Record
 */
async function testCompleteIntegration() {
  printHeader('Test 8: Integration Test - Complete Medical Record Generation');

  console.log('Generating a complete medical record with all components...\n');

  try {
    // Step 1: Generate Individual
    console.log('Step 1/7: Generating individual...');
    const individual = await generateIndividualWithAI(config, cacheConfig);
    console.log(`✅ Individual: ${individual.name}`);

    // Step 2: Generate Provider
    console.log('\nStep 2/7: Generating provider...');
    const provider = await generateProviderWithAI(config, cacheConfig);
    console.log(`✅ Provider: ${provider.name}`);

    // Step 3: Generate Insurance
    console.log('\nStep 3/7: Generating insurance...');
    const insurance = await generateInsuranceInfoWithAI(config, individual, true, cacheConfig);
    console.log(`✅ Insurance: ${insurance.primaryInsurance.provider}`);

    // Step 4: Generate Medical History
    console.log('\nStep 4/7: Generating medical history...');
    const medicalHistory = await generateMedicalHistoryWithAI(config, 'medium', cacheConfig);
    console.log(`✅ Medical History: ${medicalHistory.medications.current.length} medications, ${medicalHistory.chronicConditions.length} conditions`);

    // Step 5: Generate Visit Reports
    console.log('\nStep 5/7: Generating visit reports...');
    const visitReports = await generateVisitReportsWithAI(config, 1, provider.name, cacheConfig);
    console.log(`✅ Visit Reports: ${visitReports[0]?.visit.chiefComplaint}`);

    // Step 6: Generate Lab Reports
    console.log('\nStep 6/7: Generating lab reports...');
    const labReports = await generateLabReportsWithAI(
      config,
      ['CBC', 'BMP'],
      provider.name,
      cacheConfig
    );
    console.log(`✅ Lab Reports: Generated ${labReports.length} reports`);

    // Step 7: Generate Claim Information
    console.log('\nStep 7/7: Generating Claim Information...');
    const claimInfo = await generateClaimInfoWithAI(config, individual, insurance, provider, cacheConfig);
    console.log(`✅ Claim Information: ${claimInfo.serviceLines.length} service lines`);

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
  results['Individual Generation'] = test1.passed;
  individual = test1.individual;

  // Test 2: Provider Generation
  const test2 = await testGenerateProvider();
  results['Provider Generation'] = test2.passed;
  provider = test2.provider;

  // Test 3: Insurance Information (requires individual)
  if (individual) {
    const test3 = await testGenerateInsurance(individual);
    results['Insurance Information'] = test3.passed;
    insurance = test3.insurance;
  }

  // Test 4: CMS-1500 Form (requires individual, insurance, provider)
  if (individual && insurance && provider) {
    const test4 = await testGenerateCMS1500(individual, insurance, provider);
    results['CMS-1500 Form'] = test4.passed;
  }

  // Test 5: Laboratory Reports (requires individual, provider)
  if (individual && provider) {
    const test5 = await testGenerateLabReports(individual, provider);
    results['Laboratory Reports'] = test5.passed;
  }

  // Test 6: Visit Report (requires individual, provider)
  if (individual && provider) {
    const test6 = await testGenerateVisitReport(individual, provider);
    results['Visit Report'] = test6.passed;
  }

  // Test 7: Medical History (requires individual)
  if (individual) {
    const test7 = await testGenerateMedicalHistory(individual);
    results['Medical History'] = test7.passed;
  }

  // Test 8: Complete Integration Test
  const test8 = await testCompleteIntegration();
  results['Complete Integration'] = test8.passed;

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

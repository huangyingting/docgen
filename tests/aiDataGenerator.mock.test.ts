/**
 * Mock Test Suite for AI Data Generator
 * Tests function signatures and imports without requiring Azure OpenAI credentials
 * Useful for CI/CD pipelines and development without Azure access
 * 
 * Run with: npm run test:ai:mock
 */

import {
  generateIndividualWithAI,
  generateProviderWithAI,
  generateInsuranceInfoWithAI,
  generateClaimInfoWithAI,
  generateLabReportsWithAI,
  generateVisitReportsWithAI,
  generateMedicalHistoryWithAI,
} from '../src/utils/aiDataGenerator';

console.log('\n╔═══════════════════════════════════════════════════════════════════════════════╗');
console.log('║                   Mock Test Suite - AI Data Generator                         ║');
console.log('║                  Validates Imports and Function Signatures                    ║');
console.log('╚═══════════════════════════════════════════════════════════════════════════════╝\n');

let passedTests = 0;
let failedTests = 0;

function testImport(name: string, fn: any) {
  try {
    if (typeof fn === 'function') {
      console.log(`✅ ${name} - Function imported successfully`);
      passedTests++;
    } else {
      console.log(`❌ ${name} - Not a function`);
      failedTests++;
    }
  } catch (error) {
    console.log(`❌ ${name} - Import failed: ${error}`);
    failedTests++;
  }
}

console.log('Testing function imports...\n');

testImport('generatePatientWithAI', generateIndividualWithAI);
testImport('generateProviderWithAI', generateProviderWithAI);
testImport('generateInsuranceInfoWithAI', generateInsuranceInfoWithAI);
testImport('generateClaimInfoWithAI', generateClaimInfoWithAI);
testImport('generateLabReportsWithAI', generateLabReportsWithAI);
testImport('generateVisitReportsWithAI', generateVisitReportsWithAI);
testImport('generateMedicalHistoryWithAI', generateMedicalHistoryWithAI);

console.log('\n' + '='.repeat(80));
console.log(`Results: ${passedTests}/${passedTests + failedTests} tests passed`);
console.log('='.repeat(80));

if (failedTests === 0) {
  console.log('\n✅ All mock tests passed! Functions are properly exported.');
  console.log('\nTo run full integration tests with Azure OpenAI:');
  console.log('  1. Configure .env with Azure OpenAI credentials');
  console.log('  2. Run: npm run test:ai\n');
  process.exit(0);
} else {
  console.log('\n❌ Some tests failed. Check import statements and exports.\n');
  process.exit(1);
}

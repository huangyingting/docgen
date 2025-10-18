/**
 * JSON Schema Generator (Zod-based)
 * 
 * Converts Zod schemas to JSON Schema format for Azure OpenAI structured outputs.
 * Uses zod-to-json-schema for automatic conversion from Zod to JSON Schema.
 * 
 * Benefits:
 * - Single source of truth (Zod schemas define both TS types and JSON schemas)
 * - Runtime validation available via Zod
 * - Automatic JSON Schema generation
 * - Less code duplication
 */

import { z } from 'zod';
import {
  IndividualSchema,
  ProviderSchema,
  MedicalHistorySchema,
  CMS1500Schema,
  VisitReportSchema,
  LabReportSchema,
  LabReportsSchema,
  InsuranceInfoSchema,
  ClaimInfoSchema,
  W2Schema,
  PassportSchema
} from './zodSchemas';

/**
 * Convert a Zod schema to JSON Schema format compatible with Azure OpenAI
 * 
 * @param zodSchema - The Zod schema to convert
 * @param name - Name for the schema (used in OpenAI API)
 * @param options - Additional options for conversion
 */
export function zodToOpenAISchema(
  zodSchema: z.ZodType<any>,
  name: string,
  options?: {
    strict?: boolean;
    description?: string;
  }
) {
  // Use Zod v4's built-in z.toJSONSchema() static method
  // target: 'openapi-3.0' removes the $schema property automatically
  const jsonSchema = z.toJSONSchema(zodSchema, {
    target: 'openapi-3.0'
  });

  return {
    type: 'json_schema',
    json_schema: {
      name,
      strict: options?.strict !== false, // Default to strict mode
      schema: jsonSchema,
      ...(options?.description && { description: options.description })
    }
  };
}

/**
 * Helper function to create a response format object for Azure OpenAI
 * (Backward compatible with old API)
 */
export function createResponseFormat(schemaName: string, schema: any) {
  return {
    type: 'json_schema',
    json_schema: {
      name: schemaName,
      strict: true,
      schema: {
        ...schema,
        additionalProperties: false
      }
    }
  };
}

/**
 * Pre-built response formats using Zod schemas
 * These automatically convert Zod schemas to JSON Schema format
 */
export const ResponseFormats = {
  /**
   * Standalone individual data generation
   */
  Patient: zodToOpenAISchema(
    IndividualSchema,
    'IndividualResponse',
    { description: 'Healthcare individual data', strict: true }
  ),

  /**
   * Standalone provider data generation
   */
  Provider: zodToOpenAISchema(
    ProviderSchema,
    'ProviderResponse',
    { description: 'Insurance provider information', strict: true }
  ),

  /**
   * Standalone insurance data generation
   */
  InsuranceInfo: zodToOpenAISchema(
    InsuranceInfoSchema,
    'InsuranceResponse',
    { description: 'Insurance information', strict: true }
  ),

  /**
   * CMS-1500 claim form data with patient, insurance, provider, and claim details
   */
  CMS1500: zodToOpenAISchema(
    CMS1500Schema,
    'CMS1500Response',
    { description: 'CMS-1500 claim form data', strict: true }
  ),

  /**
   * Visit report with patient, provider, visit notes, and vital signs
   */
  VisitReport: zodToOpenAISchema(
    VisitReportSchema,
    'VisitReportResponse',
    { description: 'Medical visit report', strict: true }
  ),

  /**
   * Medical history with medications, allergies, conditions, and family history
   */
  MedicalHistory: zodToOpenAISchema(
    MedicalHistorySchema,
    'MedicalHistoryResponse',
    { description: 'Complete medical history', strict: true }
  ),

  /**
   * Laboratory report with test results
   */
  LabReportData: zodToOpenAISchema(
    LabReportSchema,
    'LaboratoryReportDataResponse',
    { description: 'Laboratory test report', strict: true }
  ),

  /**
   * Multiple laboratory reports wrapped in object (Azure OpenAI requires object root)
   */
  LabReportsData: zodToOpenAISchema(
    LabReportsSchema,
    'LaboratoryReportsDataResponse',
    { description: 'Multiple laboratory test reports', strict: true }
  ),

  /**
   * CMS-1500 claim information only (without patient, insurance, provider)
   */
  ClaimInfo: zodToOpenAISchema(
    ClaimInfoSchema,
    'ClaimInfoResponse',
    { description: 'CMS-1500 claim information', strict: true }
  ),

  /**
   * W-2 wage and tax statement
   */
  W2: zodToOpenAISchema(
    W2Schema,
    'W2Response',
    { description: 'W-2 wage and tax statement', strict: true }
  ),

  /**
   * US Passport document
   */
  Passport: zodToOpenAISchema(
    PassportSchema,
    'PassportResponse',
    { description: 'US Passport document', strict: true }
  )
};


/**
 * Validate data against a Zod schema at runtime
 * 
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns Validation result with parsed data or errors
 * 
 * @example
 * ```typescript
 * const result = validateWithSchema(PatientDemographicsSchema, patientData);
 * if (result.success) {
 *   console.log('Valid data:', result.data);
 * } else {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export function validateWithSchema<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}

/**
 * Format Zod validation errors for display
 * 
 * @param error - Zod validation error
 * @returns Human-readable error messages
 */
export function formatZodErrors(error: z.ZodError): string[] {
  return error.issues.map(err => {
    const path = err.path.join('.');
    return `${path}: ${err.message}`;
  });
}
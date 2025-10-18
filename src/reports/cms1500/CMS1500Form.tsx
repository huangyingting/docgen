import React from 'react';
import './CMS1500Form.css';
import { Individual, Provider, InsuranceInfo, ClaimInfo } from '../../utils/zodSchemas';

interface CMS1500FormProps {
  individual: Individual,
  insuranceInfo: InsuranceInfo,
  provider: Provider,
  claimInfo: ClaimInfo,
  fontFamily?: string;
}

const CMS1500Form: React.FC<CMS1500FormProps> = ({ individual, insuranceInfo, provider, claimInfo, fontFamily = "'Arial', sans-serif" }) => {

  return (
    <div
      className="cms1500-report"
      id="cms1500-report"
      style={{ fontFamily: fontFamily }}
    >
      {/* Page 1: Main CMS-1500 Form */}
      <div className="cms1500-page">
        {/* Header */}
        <div className="cms1500-header">
          <div className="header-left">
            <div className="pica-checkbox">
              <div className="checkbox-group">
                <label>Type</label>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" checked={insuranceInfo?.insuranceType === 'Medicare'} readOnly />
                <label>MEDICARE</label>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" checked={insuranceInfo?.insuranceType === 'Medicaid'} readOnly />
                <label>MEDICAID</label>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" checked={insuranceInfo?.insuranceType === 'TRICARE'} readOnly />
                <label>TRICARE</label>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" checked={insuranceInfo?.insuranceType === 'CHAMPVA'} readOnly />
                <label>CHAMPVA</label>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" checked={insuranceInfo?.insuranceType === 'Group'} readOnly />
                <label>GROUP HEALTH PLAN</label>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" checked={insuranceInfo?.insuranceType === 'FECA'} readOnly />
                <label>FECA BLK LUNG</label>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" checked={insuranceInfo?.insuranceType === 'Other'} readOnly />
                <label>OTHER</label>
              </div>
            </div>
          </div>
          <div className="header-right">
            <h1>HEALTH INSURANCE CLAIM FORM</h1>
            <p className="approved-text">APPROVED BY NATIONAL UNIFORM CLAIM COMMITTEE (NUCC) 02/12</p>
          </div>
          <div className="header-pica">
            <label>PICA</label>
            <div className="pica-box">{insuranceInfo?.picaCode || ''}</div>
          </div>
        </div>

        {/* Section 1: Patient and Insured Information */}
        <div className="cms1500-section">
          <div className="form-row">
            <div className="form-field field-1a">
              <label>1. INSURED'S I.D. NUMBER</label>
              <div className="field-value">{insuranceInfo?.primaryInsurance?.memberId || ''}</div>
            </div>
            <div className="form-field field-1">
              <label>1a. INSURED'S I.D. NUMBER</label>
              <div className="field-value">{insuranceInfo?.primaryInsurance?.memberId || ''}</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field field-2">
              <label>2. PATIENT'S NAME (Last Name, First Name, Middle Initial)</label>
              <div className="field-value">{individual?.lastName}, {individual?.firstName} {individual?.middleInitial || ''}</div>
            </div>
            <div className="form-field field-3">
              <label>3. PATIENT'S BIRTH DATE</label>
              <div className="field-value">{individual?.dateOfBirth}</div>
              <div className="sex-group">
                <label>SEX</label>
                <input type="checkbox" checked={individual?.gender === 'Male'} readOnly />
                <label>M</label>
                <input type="checkbox" checked={individual?.gender === 'Female'} readOnly />
                <label>F</label>
                <input type="checkbox" checked={individual?.gender === 'Other'} readOnly />
                <label>Other</label>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field field-4">
              <label>4. INSURED'S NAME (Last Name, First Name, Middle Initial)</label>
              <div className="field-value">{insuranceInfo?.subscriberName || individual?.name}</div>
            </div>
            <div className="form-field field-5">
              <label>5. PATIENT'S ADDRESS (No., Street)</label>
              <div className="field-value">{individual?.address?.street || ''}</div>
              <div className="address-line2">
                <div className="field-city">
                  <label>CITY</label>
                  <div className="field-value">{individual?.address?.city || ''}</div>
                </div>
                <div className="field-state">
                  <label>STATE</label>
                  <div className="field-value">{individual?.address?.state || ''}</div>
                </div>
              </div>
              <div className="address-line3">
                <div className="field-zip">
                  <label>ZIP CODE</label>
                  <div className="field-value">{individual?.address?.zipCode || ''}</div>
                </div>
                <div className="field-telephone">
                  <label>TELEPHONE (Include Area Code)</label>
                  <div className="field-value">{individual?.contact?.phone || ''}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field field-6">
              <label>6. PATIENT RELATIONSHIP TO INSURED</label>
              <div className="checkbox-group">
                <input type="checkbox" checked={claimInfo?.patientRelationship === 'self'} readOnly />
                <label>Self</label>
                <input type="checkbox" checked={claimInfo?.patientRelationship === 'spouse'} readOnly />
                <label>Spouse</label>
                <input type="checkbox" checked={claimInfo?.patientRelationship === 'child'} readOnly />
                <label>Child</label>
                <input type="checkbox" checked={claimInfo?.patientRelationship === 'other'} readOnly />
                <label>Other</label>
              </div>
            </div>
            <div className="form-field field-7">
              <label>7. INSURED'S ADDRESS (No., Street)</label>
              <div className="field-value">{insuranceInfo?.address?.street || ''}</div>
              <div className="address-line2">
                <div className="field-city">
                  <label>CITY</label>
                  <div className="field-value">{insuranceInfo?.address?.city || ''}</div>
                </div>
                <div className="field-state">
                  <label>STATE</label>
                  <div className="field-value">{insuranceInfo?.address?.state || ''}</div>
                </div>
              </div>
              <div className="address-line3">
                <div className="field-zip">
                  <label>ZIP CODE</label>
                  <div className="field-value">{insuranceInfo?.address?.zipCode || ''}</div>
                </div>
                <div className="field-telephone">
                  <label>TELEPHONE (Include Area Code)</label>
                  <div className="field-value">{insuranceInfo?.phone || ''}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field field-9">
              <label>9. OTHER INSURED'S NAME (Last Name, First Name, Middle Initial)</label>
              <div className="field-value">{insuranceInfo?.secondaryInsured?.name || ''}</div>
              <div className="subfield">
                <label>a. OTHER INSURED'S POLICY OR GROUP NUMBER</label>
                <div className="field-value">{insuranceInfo?.secondaryInsured?.policyNumber || ''}</div>
              </div>
              <div className="subfield">
                <label>b. RESERVED FOR NUCC USE</label>
                <div className="field-value"></div>
              </div>
              <div className="subfield">
                <label>c. RESERVED FOR NUCC USE</label>
                <div className="field-value"></div>
              </div>
              <div className="subfield">
                <label>d. INSURANCE PLAN NAME OR PROGRAM NAME</label>
                <div className="field-value">{insuranceInfo?.secondaryInsured?.planName || ''}</div>
              </div>
            </div>
            <div className="form-field field-11">
              <label>11. INSURED'S POLICY GROUP OR FECA NUMBER</label>
              <div className="field-value">{insuranceInfo?.primaryInsurance?.groupNumber || ''}</div>
              <div className="subfield">
                <label>a. INSURED'S DATE OF BIRTH</label>
                <div className="field-value">{insuranceInfo?.subscriberDOB || ''}</div>
                <div className="sex-group">
                  <label>SEX</label>
                  <input type="checkbox" checked={insuranceInfo?.subscriberGender === 'Male'} readOnly />
                  <label>M</label>
                  <input type="checkbox" checked={insuranceInfo?.subscriberGender === 'Female'} readOnly />
                  <label>F</label>
                  <input type="checkbox" checked={insuranceInfo?.subscriberGender === 'Other'} readOnly />
                  <label>Other</label>
                </div>
              </div>
              <div className="subfield">
                <label>b. OTHER CLAIM ID (Designated by NUCC)</label>
                <div className="field-value">{claimInfo?.otherClaimId || ''}</div>
              </div>
              <div className="subfield">
                <label>c. INSURANCE PLAN NAME OR PROGRAM NAME</label>
                <div className="field-value">{insuranceInfo?.primaryInsurance?.provider || ''}</div>
              </div>
              <div className="subfield checkbox-row">
                <label>d. IS THERE ANOTHER HEALTH BENEFIT PLAN?</label>
                <input type="checkbox" checked={claimInfo?.hasOtherHealthPlan === true} readOnly />
                <label>YES</label>
                <input type="checkbox" checked={claimInfo?.hasOtherHealthPlan === false} readOnly />
                <label>NO</label>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="form-row signature-row">
            <div className="form-field field-12">
              <label>12. PATIENT'S OR AUTHORIZED PERSON'S SIGNATURE</label>
              <div className="signature-field">
                <div className="signature-text">Signature on File</div>
                <div className="date-field">
                  <label>DATE</label>
                  <div className="field-value">{claimInfo?.signatureDate || ''}</div>
                </div>
              </div>
            </div>
            <div className="form-field field-13">
              <label>13. INSURED'S OR AUTHORIZED PERSON'S SIGNATURE</label>
              <div className="signature-field">
                <div className="signature-text">Signature on File</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Condition Information */}
        <div className="cms1500-section">
          <div className="form-row">
            <div className="form-field field-14">
              <label>14. DATE OF CURRENT ILLNESS, INJURY, or PREGNANCY (LMP)</label>
              <div className="field-value">{claimInfo?.dateOfIllness || ''}</div>
              <div className="qual-field">
                <label>QUAL</label>
                <div className="field-value">{claimInfo?.illnessQualifier || '431'}</div>
              </div>
            </div>
            <div className="form-field field-15">
              <label>15. OTHER DATE</label>
              <div className="field-value">{claimInfo?.otherDate || ''}</div>
              <div className="qual-field">
                <label>QUAL</label>
                <div className="field-value">{claimInfo?.otherDateQualifier || ''}</div>
              </div>
            </div>
            <div className="form-field field-16">
              <label>16. DATES PATIENT UNABLE TO WORK IN CURRENT OCCUPATION</label>
              <div className="date-range">
                <div className="from-field">
                  <label>FROM</label>
                  <div className="field-value">{claimInfo?.unableToWorkFrom || ''}</div>
                </div>
                <div className="to-field">
                  <label>TO</label>
                  <div className="field-value">{claimInfo?.unableToWorkTo || ''}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field field-17">
              <label>17. NAME OF REFERRING PROVIDER OR OTHER SOURCE</label>
              <div className="field-value">{provider?.referringProvider?.name || ''}</div>
              <div className="npi-field">
                <label>17a.</label>
                <div className="field-value">{provider?.referringProvider?.qualifier || ''}</div>
              </div>
              <div className="qualifier-field">
                <label>17b. NPI</label>
                <div className="field-value">{provider?.referringProvider?.npi || ''}</div>
              </div>
            </div>
            <div className="form-field field-18">
              <label>18. HOSPITALIZATION DATES RELATED TO CURRENT SERVICES</label>
              <div className="date-range">
                <div className="from-field">
                  <label>FROM</label>
                  <div className="field-value">{claimInfo?.hospitalizationFrom || ''}</div>
                </div>
                <div className="to-field">
                  <label>TO</label>
                  <div className="field-value">{claimInfo?.hospitalizationTo || ''}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field field-19">
              <label>19. ADDITIONAL CLAIM INFORMATION (Designated by NUCC)</label>
              <div className="field-value">{claimInfo?.additionalInfo || ''}</div>
            </div>
            <div className="form-field field-20">
              <label>20. OUTSIDE LAB?</label>
              <div className="checkbox-group">
                <input type="checkbox" checked={claimInfo?.outsideLab === true} readOnly />
                <label>YES</label>
                <input type="checkbox" checked={claimInfo?.outsideLab === false} readOnly />
                <label>NO</label>
              </div>
              <div className="charges-field">
                <label>$ CHARGES</label>
                <div className="field-value">{claimInfo?.outsideLabCharges || ''}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="cms1500-footer">
          <div className="footer-text">
            <p>NUCC Instruction Manual available at: www.nucc.org</p>
            <p>PLEASE PRINT OR TYPE</p>
          </div>
          <div className="form-info">
            <p>APPROVED OMB-0938-1197 FORM 1500 (02-12)</p>
          </div>
        </div>
      </div>
      {/* Page Break */}
      <div className="page-break"></div>

      {/* Page 2: Service Lines and Provider Information */}
      <div className="cms1500-page">
        {/* Page 2 Header */}
        <div className="cms1500-header">
          <div className="header-left">
            <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>CMS-1500 CLAIM FORM</h2>
            <p style={{ margin: '2mm 0 0 0', fontSize: '9px' }}>Page 2 - Service Details</p>
          </div>
          <div className="header-right">
            <p style={{ margin: 0, fontSize: '9px' }}>Patient: {individual?.name}</p>
            <p style={{ margin: '1mm 0 0 0', fontSize: '9px' }}>Account #: {individual?.accountNumber}</p>
          </div>
        </div>

        {/* Section 3: Diagnosis Codes */}
        <div className="cms1500-section diagnosis-section">
          <div className="form-field field-21">
            <label>21. DIAGNOSIS OR NATURE OF ILLNESS OR INJURY (Relate A-L to service line below)</label>
            <div className="diagnosis-grid">
              {claimInfo?.diagnosisCodes?.map((code, index) => (
                <div key={index} className="diagnosis-item">
                  <label>{String.fromCharCode(65 + index)}.</label>
                  <div className="diagnosis-code">{code}</div>
                </div>
              )) || []}
            </div>
          </div>
          <div className="form-field field-22">
            <label>22. RESUBMISSION CODE</label>
            <div className="field-value">{claimInfo?.resubmissionCode || ''}</div>
            <div className="original-ref">
              <label>ORIGINAL REF. NO.</label>
              <div className="field-value">{claimInfo?.originalRefNo || ''}</div>
            </div>
          </div>
          <div className="form-field field-23">
            <label>23. PRIOR AUTHORIZATION NUMBER</label>
            <div className="field-value">{claimInfo?.priorAuthNumber || ''}</div>
          </div>
        </div>
        {/* Section 4: Service Lines */}
        <div className="cms1500-section service-section">
          <div className="service-line-header">
            <div className="col-dates">
              <div className="col-label">24. A. DATE(S) OF SERVICE</div>
              <div className="subcol">
                <div className="subcol-label">From</div>
              </div>
              <div className="subcol">
                <div className="subcol-label">To</div>
              </div>
            </div>
            <div className="col-place">
              <div className="col-label">B. PLACE OF SERVICE</div>
            </div>
            <div className="col-emg">
              <div className="col-label">C. EMG</div>
            </div>
            <div className="col-procedures">
              <div className="col-label">D. PROCEDURES, SERVICES, OR SUPPLIES</div>
              <div className="subcol-group">
                <div className="subcol-label">CPT/HCPCS</div>
                <div className="subcol-label">MODIFIER</div>
              </div>
            </div>
            <div className="col-diagnosis">
              <div className="col-label">E. DIAGNOSIS POINTER</div>
            </div>
            <div className="col-charges">
              <div className="col-label">F. $ CHARGES</div>
            </div>
            <div className="col-days">
              <div className="col-label">G. DAYS OR UNITS</div>
            </div>
            <div className="col-epsdt">
              <div className="col-label">H. EPSDT Family Plan</div>
            </div>
            <div className="col-id">
              <div className="col-label">I. ID. QUAL</div>
            </div>
            <div className="col-rendering">
              <div className="col-label">J. RENDERING PROVIDER ID. #</div>
            </div>
          </div>

          {/* Service Lines Data */}
          {claimInfo?.serviceLines?.map((line, index) => (
            <div key={index} className="service-line-row">
              <div className="col-dates">
                <div className="subcol">{line.dateFrom}</div>
                <div className="subcol">{line.dateTo}</div>
              </div>
              <div className="col-place">{line.placeOfService}</div>
              <div className="col-emg">{line.emg || ''}</div>
              <div className="col-procedures">
                <div className="proc-code">{line.procedureCode}</div>
                <div className="modifier">{line.modifier || ''}</div>
              </div>
              <div className="col-diagnosis">{line.diagnosisPointer}</div>
              <div className="col-charges">{line.charges}</div>
              <div className="col-days">{line.units}</div>
              <div className="col-epsdt">{line.epsdt || ''}</div>
              <div className="col-id">{line.idQual || 'NPI'}</div>
              <div className="col-rendering">{line.renderingProviderNPI}</div>
            </div>
          )) || []}
        </div>

        {/* Section 5: Provider Information */}
        <div className="cms1500-section provider-section">
          <div className="form-row">
            <div className="form-field field-25">
              <label>25. FEDERAL TAX I.D. NUMBER</label>
              <div className="field-value">{provider?.taxId || ''}</div>
              <div className="checkbox-group">
                <input type="checkbox" checked={provider?.taxIdType === 'SSN'} readOnly />
                <label>SSN</label>
                <input type="checkbox" checked={provider?.taxIdType === 'EIN'} readOnly />
                <label>EIN</label>
              </div>
            </div>
            <div className="form-field field-26">
              <label>26. PATIENT'S ACCOUNT NO.</label>
              <div className="field-value">{individual?.accountNumber || ''}</div>
            </div>
            <div className="form-field field-27">
              <label>27. ACCEPT ASSIGNMENT?</label>
              <div className="checkbox-group">
                <input type="checkbox" checked={claimInfo?.acceptAssignment === true} readOnly />
                <label>YES</label>
                <input type="checkbox" checked={claimInfo?.acceptAssignment === false} readOnly />
                <label>NO</label>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field field-28">
              <label>28. TOTAL CHARGE</label>
              <div className="field-value">${claimInfo?.totalCharges || '0.00'}</div>
            </div>
            <div className="form-field field-29">
              <label>29. AMOUNT PAID</label>
              <div className="field-value">${claimInfo?.amountPaid || '0.00'}</div>
            </div>
            <div className="form-field field-30">
              <label>30. RSVD FOR NUCC USE</label>
              <div className="field-value"></div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field field-31">
              <label>31. SIGNATURE OF PHYSICIAN OR SUPPLIER</label>
              <div className="signature-field">
                <div className="signature-text">{provider?.signature || 'Signature on File'}</div>
                <div className="date-field">
                  <label>DATE</label>
                  <div className="field-value">{claimInfo?.providerSignatureDate || ''}</div>
                </div>
              </div>
            </div>
            <div className="form-field field-32">
              <label>32. SERVICE FACILITY LOCATION INFORMATION</label>
              <div className="field-value">{provider?.facilityName || ''}</div>
              <div className="field-value">
                {provider?.facilityAddress
                  ? typeof provider.facilityAddress === 'string'
                    ? provider.facilityAddress
                    : `${provider.facilityAddress.street}, ${provider.facilityAddress.city}, ${provider.facilityAddress.state} ${provider.facilityAddress.zipCode}`
                  : ''}
              </div>
              <div className="npi-field">
                <label>a. NPI</label>
                <div className="field-value">{provider?.facilityNPI || ''}</div>
              </div>
              <div className="qualifier-field">
                <label>b.</label>
                <div className="field-value"></div>
              </div>
            </div>
            <div className="form-field field-33">
              <label>33. BILLING PROVIDER INFO & PH #</label>
              <div className="field-value">{provider?.billingName || ''}</div>
              <div className="field-value">{provider?.billingAddress || ''}</div>
              <div className="field-value">{provider?.billingPhone || ''}</div>
              <div className="npi-field">
                <label>a. NPI</label>
                <div className="field-value">{provider?.billingNPI || ''}</div>
              </div>
              <div className="qualifier-field">
                <label>b.</label>
                <div className="field-value"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="cms1500-footer">
          <div className="footer-text">
            <p>NUCC Instruction Manual available at: www.nucc.org</p>
            <p>PLEASE PRINT OR TYPE</p>
          </div>
          <div className="form-info">
            <p>APPROVED OMB-0938-1197 FORM 1500 (02-12)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMS1500Form;

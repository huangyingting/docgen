import React from 'react';
import './InsurancePolicyDocument.css';
import { Individual, InsuranceInfo } from '../../utils/zodSchemas';

interface InsurancePolicyDocumentProps {
  individual: Individual;
  insuranceInfo: InsuranceInfo;
  fontFamily?: string;
}

const InsurancePolicyDocument: React.FC<InsurancePolicyDocumentProps> = ({
  individual,
  insuranceInfo,
  fontFamily = "'Arial', sans-serif"
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const policyEffectiveDate = insuranceInfo.primaryInsurance.effectiveDate;
  const policyEndDate = new Date(new Date(policyEffectiveDate).setFullYear(
    new Date(policyEffectiveDate).getFullYear() + 1
  )).toLocaleDateString('en-US');

  return (
    <div
      className="insurance-policy-report"
      id="insurance-policy-report"
      style={{ fontFamily: fontFamily }}
    >
      {/* Page 1: Policy Certificate */}
      <div className="insurance-policy-page page-1">
        {/* Letterhead */}
        <div className="policy-letterhead">
          <div className="company-header">
            <h1 className="company-name">{insuranceInfo.primaryInsurance.provider.toUpperCase()}</h1>
            <p className="company-address">P.O. Box {Math.floor(Math.random() * 90000 + 10000)} • {insuranceInfo.address?.city || individual.address.city}, {insuranceInfo.address?.state || individual.address.state} {insuranceInfo.address?.zipCode || individual.address.zipCode}</p>
          </div>
          <div className="company-contact">
            <p>Customer Service: 1-800-{Math.floor(Math.random() * 900 + 100)}-{Math.floor(Math.random() * 9000 + 1000)}</p>
            <p>www.{insuranceInfo.primaryInsurance.provider.toLowerCase().replace(/\s+/g, '')}.com</p>
          </div>
        </div>

        {/* Document Title */}
        <div className="policy-title-section">
          <h2 className="policy-title">CERTIFICATE OF INSURANCE</h2>
        </div>

        {/* Policy Information Box */}
        <div className="policy-info-box">
          <div className="info-row">
            <div className="info-label">Policy Number:</div>
            <div className="info-value strong">{insuranceInfo.primaryInsurance.policyNumber}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Group Number:</div>
            <div className="info-value strong">{insuranceInfo.primaryInsurance.groupNumber}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Member ID:</div>
            <div className="info-value strong">{insuranceInfo.primaryInsurance.memberId}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Effective Date:</div>
            <div className="info-value">{policyEffectiveDate}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Expiration Date:</div>
            <div className="info-value">{policyEndDate}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Plan Type:</div>
            <div className="info-value">{insuranceInfo.insuranceType?.toUpperCase() || 'GROUP'} HEALTH PLAN</div>
          </div>
        </div>

        {/* Subscriber Information */}
        <div className="compact-section">
          <h3 className="section-title">SUBSCRIBER INFORMATION</h3>
          <table className="info-table">
            <tbody>
              <tr>
                <td className="label-col">Name:</td>
                <td className="value-col">{insuranceInfo.subscriberFirstName && insuranceInfo.subscriberLastName ? `${insuranceInfo.subscriberFirstName} ${insuranceInfo.subscriberLastName}` : `${individual.firstName} ${individual.lastName}`}</td>
                <td className="label-col">DOB:</td>
                <td className="value-col">{insuranceInfo.subscriberDOB || individual.dateOfBirth}</td>
                <td className="label-col">Gender:</td>
                <td className="value-col">{insuranceInfo.subscriberGender || individual.gender}</td>
              </tr>
              <tr>
                <td className="label-col">Address:</td>
                <td className="value-col" colSpan={5}>
                  {insuranceInfo.address?.street || individual.address.street}, {insuranceInfo.address?.city || individual.address.city}, {insuranceInfo.address?.state || individual.address.state} {insuranceInfo.address?.zipCode || individual.address.zipCode}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Dependent Information (if subscriber is different from patient) */}
        {insuranceInfo.subscriberFirstName && insuranceInfo.subscriberLastName && (insuranceInfo.subscriberFirstName !== individual.firstName || insuranceInfo.subscriberLastName !== individual.lastName) && (
          <div className="compact-section">
            <h3 className="section-title">DEPENDENT INFORMATION</h3>
            <table className="info-table">
              <tbody>
                <tr>
                  <td className="label-col">Name:</td>
                  <td className="value-col">{`${individual.firstName} ${individual.lastName}`}</td>
                  <td className="label-col">DOB:</td>
                  <td className="value-col">{individual.dateOfBirth}</td>
                  <td className="label-col">Gender:</td>
                  <td className="value-col">{individual.gender}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Coverage Details */}
        <div className="compact-section">
          <h3 className="section-title">BENEFIT SUMMARY</h3>
          <table className="benefit-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>In-Network</th>
                <th>Out-of-Network</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Annual Deductible</td>
                <td>{insuranceInfo.primaryInsurance.deductible || '$1,000'}</td>
                <td>{insuranceInfo.primaryInsurance.deductible ? `$${parseInt(insuranceInfo.primaryInsurance.deductible.replace(/\D/g, '')) * 2}` : '$2,000'}</td>
              </tr>
              <tr>
                <td>Primary Care</td>
                <td>{insuranceInfo.primaryInsurance.copay || '$20'} copay</td>
                <td>40% coinsurance</td>
              </tr>
              <tr>
                <td>Specialist</td>
                <td>{insuranceInfo.primaryInsurance.copay ? `$${parseInt(insuranceInfo.primaryInsurance.copay.replace(/\D/g, '')) + 20}` : '$40'} copay</td>
                <td>40% coinsurance</td>
              </tr>
              <tr>
                <td>Emergency Room</td>
                <td>$250 copay</td>
                <td>$250 copay</td>
              </tr>
              <tr>
                <td>Urgent Care</td>
                <td>$75 copay</td>
                <td>40% coinsurance</td>
              </tr>
              <tr>
                <td>Hospital Stay</td>
                <td>$500/admission</td>
                <td>40% coinsurance</td>
              </tr>
              <tr>
                <td>Outpatient Surgery</td>
                <td>$250 copay</td>
                <td>40% coinsurance</td>
              </tr>
              <tr>
                <td>Prescriptions (Generic/Preferred/Non-Preferred)</td>
                <td>$10 / $35 / $70</td>
                <td>Not covered</td>
              </tr>
              <tr>
                <td>Preventive Care</td>
                <td>$0</td>
                <td>Not covered</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Out-of-Pocket Maximum */}
        <div className="compact-section highlight-section">
          <h3 className="section-title">OUT-OF-POCKET MAXIMUM (In-Network)</h3>
          <table className="info-table">
            <tbody>
              <tr>
                <td className="label-col">Individual:</td>
                <td className="value-col">${insuranceInfo.primaryInsurance.deductible ? parseInt(insuranceInfo.primaryInsurance.deductible.replace(/\D/g, '')) * 5 : '5,000'}</td>
                <td className="label-col">Family:</td>
                <td className="value-col">${insuranceInfo.primaryInsurance.deductible ? parseInt(insuranceInfo.primaryInsurance.deductible.replace(/\D/g, '')) * 10 : '10,000'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="policy-footer">
          <p className="footer-notice">
            This is a certificate of coverage summary. Complete policy documents contain full details of benefits, exclusions, and limitations.
            For questions, contact customer service at the number above.
          </p>
          <div className="footer-info">
            <span>Issued: {currentDate}</span>
            <span>Policy Administrator</span>
          </div>
        </div>
      </div>
      {/* Page Break */}
      <div className="page-break"></div>
      {/* Page 2: Additional Policy Information */}
      <div className="insurance-policy-page page-2">
        <div className="policy-letterhead compact">
          <div className="company-header">
            <h1 className="company-name small">{insuranceInfo.primaryInsurance.provider.toUpperCase()}</h1>
            <span className="policy-ref">Policy #{insuranceInfo.primaryInsurance.policyNumber}</span>
          </div>
          <div className="page-number">Page 2 of 2</div>
        </div>
        <h2 className="page-title">POLICY INFORMATION &amp; PROVISIONS</h2>

        {/* Important Contact Information */}
        <div className="compact-section">
          <h3 className="section-title">IMPORTANT CONTACT NUMBERS</h3>
          <table className="contact-table">
            <tbody>
              <tr>
                <td>Customer Service:</td>
                <td>1-800-{Math.floor(Math.random() * 900 + 100)}-{Math.floor(Math.random() * 9000 + 1000)}</td>
                <td>Claims:</td>
                <td>1-800-{Math.floor(Math.random() * 900 + 100)}-{Math.floor(Math.random() * 9000 + 1000)}</td>
              </tr>
              <tr>
                <td>Prior Authorization:</td>
                <td>1-800-{Math.floor(Math.random() * 900 + 100)}-{Math.floor(Math.random() * 9000 + 1000)}</td>
                <td>Nurse Line (24/7):</td>
                <td>1-800-{Math.floor(Math.random() * 900 + 100)}-{Math.floor(Math.random() * 9000 + 1000)}</td>
              </tr>
              <tr>
                <td>Pharmacy Services:</td>
                <td>1-800-{Math.floor(Math.random() * 900 + 100)}-{Math.floor(Math.random() * 9000 + 1000)}</td>
                <td>Mental Health:</td>
                <td>1-800-{Math.floor(Math.random() * 900 + 100)}-{Math.floor(Math.random() * 9000 + 1000)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Using Your Coverage */}
        <div className="compact-section">
          <h3 className="section-title">USING YOUR COVERAGE</h3>
          <ul className="compact-list">
            <li><strong>ID Card:</strong> Present your insurance ID card at each visit for coverage verification.</li>
            <li><strong>Network Providers:</strong> Use in-network providers to maximize benefits and minimize costs.</li>
            <li><strong>Prior Authorization:</strong> Required for certain services - call before scheduling procedures.</li>
            <li><strong>Claims Filing:</strong> Providers typically file claims; if self-filing, submit within 90 days.</li>
          </ul>
        </div>

        {/* Exclusions and Limitations */}
        <div className="compact-section">
          <h3 className="section-title">EXCLUSIONS &amp; LIMITATIONS</h3>
          <p className="compact-text">This policy does not cover: services outside policy dates; experimental treatments; cosmetic procedures (unless medically necessary); non-medically necessary services; out-of-network services without authorization (except emergencies); charges exceeding allowed amounts; services covered by workers' compensation or other insuranceInfo.</p>
        </div>

        {/* Rights and Responsibilities */}
        <div className="compact-section two-column">
          <div className="column">
            <h3 className="section-title">MEMBER RIGHTS</h3>
            <ul className="compact-list">
              <li>Emergency medical care access</li>
              <li>File appeals and grievances</li>
              <li>Medical record confidentiality</li>
              <li>Choose primary care physician</li>
              <li>Understand benefits coverage</li>
            </ul>
          </div>
          <div className="column">
            <h3 className="section-title">MEMBER RESPONSIBILITIES</h3>
            <ul className="compact-list">
              <li>Pay premiums and cost-sharing</li>
              <li>Provide accurate information</li>
              <li>Follow plan procedures</li>
              <li>Report information changes</li>
              <li>Use network providers</li>
            </ul>
          </div>
        </div>

        {/* Secondary Insurance Information */}
        {insuranceInfo.secondaryInsurance && (
          <div className="compact-section highlight-section">
            <h3 className="section-title">COORDINATION OF BENEFITS - SECONDARY INSURANCE</h3>
            <table className="info-table">
              <tbody>
                <tr>
                  <td className="label-col">Carrier:</td>
                  <td className="value-col">{insuranceInfo.secondaryInsurance.provider}</td>
                  <td className="label-col">Policy #:</td>
                  <td className="value-col">{insuranceInfo.secondaryInsurance.policyNumber}</td>
                </tr>
                <tr>
                  <td className="label-col">Group #:</td>
                  <td className="value-col">{insuranceInfo.secondaryInsurance.groupNumber}</td>
                  <td className="label-col">Member ID:</td>
                  <td className="value-col">{insuranceInfo.secondaryInsurance.memberId}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Legal Notice */}
        <div className="legal-notice">
          <p className="legal-title">IMPORTANT NOTICES</p>
          <p className="legal-text">
            <strong>Privacy:</strong> We maintain the privacy of your protected health information as required by law. Complete Notice of Privacy Practices available at our website or by calling customer service.
          </p>
          <p className="legal-text">
            <strong>Certificate Status:</strong> This certificate is a summary of coverage. Complete terms and conditions are in the group policy, which governs in case of conflict.
          </p>
        </div>

        {/* Document Footer */}
        <div className="document-footer">
          <span>{insuranceInfo.primaryInsurance.provider} | Policy #{insuranceInfo.primaryInsurance.policyNumber} | Issued {currentDate}</span>
        </div>
      </div>
    </div>
  );
};

export default InsurancePolicyDocument;

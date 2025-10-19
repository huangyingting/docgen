import React from 'react';
import { faker } from '@faker-js/faker';
import './LabReportDocument.css';
import { Individual, LabReport } from '../../utils/zodSchemas';

interface LabReportProps {
  individual: Individual;
  labReport: LabReport;
  fontFamily?: string;
}

const LabReportDocument: React.FC<LabReportProps> = ({
  individual,
  labReport,
  fontFamily = "'Arial', sans-serif"
}) => {
  const { performingLab, results, testName, specimenType,
    specimenCollectionDate, specimenCollectionTime, specimenReceivedDate,
    reportDate, reportTime, orderingPhysician, interpretation, comments,
    criticalValues, technologist, pathologist, testType } = labReport;

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Check if there are any abnormal results
  const hasAbnormal = results.some((r: any) => r.flag && r.flag !== 'Normal');
  const hasCritical = results.some((r: any) => r.flag === 'Critical');

  return (
    <div
      className="laboratory-report-document"
      id={`laboratory-report-${testType.toLowerCase()}`}
      style={{ fontFamily: fontFamily }}
    >
      <div className="laboratory-report-page page-1">
        {/* Letterhead */}
        <div className="lab-letterhead">
          <div className="lab-header">
            <h1 className="lab-name">{performingLab.name.toUpperCase()}</h1>
            <p className="lab-address">
              {performingLab.address.street} • {performingLab.address.city}, {performingLab.address.state} {performingLab.address.zipCode}
            </p>
            <p className="lab-contact">Phone: {performingLab.phone} • CLIA#: {performingLab.cliaNumber}</p>
          </div>
        </div>

        {/* Document Title */}
        <div className="lab-title-section">
          <h2 className="lab-title">LABORATORY REPORT</h2>
          {hasCritical && (
            <div className="critical-alert">
              ⚠ CRITICAL VALUES - IMMEDIATE ATTENTION REQUIRED
            </div>
          )}
        </div>

        {/* Patient and Specimen Information */}
        <div className="lab-info-grid">
          <div className="info-box patient-info">
            <h3 className="info-box-title">PATIENT INFORMATION</h3>
            <div className="info-grid-2col">
              <div className="info-item">
                <span className="info-label">Patient Name:</span>
                <span className="info-value strong">{individual.firstName} {individual.middleInitial ? individual.middleInitial + ' ' : ''}{individual.lastName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">MRN:</span>
                <span className="info-value strong">{individual.id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Date of Birth:</span>
                <span className="info-value">{individual.dateOfBirth}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Age/Gender:</span>
                <span className="info-value">{individual.age} years / {individual.gender}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Patient ID:</span>
                <span className="info-value">{individual.id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Account:</span>
                <span className="info-value">{individual.accountNumber}</span>
              </div>
            </div>
          </div>

          <div className="info-box specimen-info">
            <h3 className="info-box-title">SPECIMEN INFORMATION</h3>
            <div className="info-grid-2col">
              <div className="info-item">
                <span className="info-label">Test Ordered:</span>
                <span className="info-value strong">{testName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Specimen Type:</span>
                <span className="info-value">{specimenType}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Collection Date:</span>
                <span className="info-value">{specimenCollectionDate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Collection Time:</span>
                <span className="info-value">{specimenCollectionTime}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Received Date:</span>
                <span className="info-value">{specimenReceivedDate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Ordering Physician:</span>
                <span className="info-value">{orderingPhysician}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Values Alert */}
        {criticalValues && criticalValues.length > 0 && (
          <div className="critical-values-section">
            <h3 className="critical-values-title">🔴 CRITICAL VALUES REPORTED</h3>
            <div className="critical-values-content">
              <p className="critical-note">The following critical values were called to {orderingPhysician} on {reportDate} at {reportTime}</p>
              <ul className="critical-list">
                {criticalValues.map((value: any, index: number) => (
                  <li key={index} className="critical-item">{value}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="results-section">
          <h3 className="section-title">TEST RESULTS</h3>
          <table className="results-table">
            <thead>
              <tr>
                <th className="col-parameter">Test</th>
                <th className="col-result">Result</th>
                <th className="col-flag">Flag</th>
                <th className="col-unit">Units</th>
                <th className="col-reference">Reference Range</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result: any, index: number) => (
                <tr
                  key={index}
                  className={`
                    ${result.flag === 'Critical' ? 'row-critical' : ''}
                    ${result.flag === 'High' || result.flag === 'Low' ? 'row-abnormal' : ''}
                    ${result.flag === 'Abnormal' ? 'row-abnormal' : ''}
                  `}
                >
                  <td className="cell-parameter">{result.parameter}</td>
                  <td className="cell-result">{result.value}</td>
                  <td className="cell-flag">
                    {result.flag && (
                      <span className={`flag-badge flag-${result.flag.toLowerCase()}`}>
                        {result.flag}
                      </span>
                    )}
                  </td>
                  <td className="cell-unit">{result.unit}</td>
                  <td className="cell-reference">{result.referenceRange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className="lab-footer">
          <div className="footer-info">
            <span>MRN: {individual.id}</span>
            <span>Accession: {faker.string.alphanumeric({ length: 10, casing: 'upper' })}</span>
            <span>Page 1 of 2</span>
            <span>Printed: {currentDate}</span>
          </div>
          <p className="footer-notice">
            This laboratory is certified under the Clinical Laboratory Improvement Amendments (CLIA) of 1988.
          </p>
        </div>
      </div>

      <div className="laboratory-report-page page-2">
        {/* Letterhead */}
        <div className="lab-letterhead">
          <div className="lab-header">
            <h1 className="lab-name">{performingLab.name.toUpperCase()}</h1>
            <p className="lab-address">
              {performingLab.address.street} • {performingLab.address.city}, {performingLab.address.state} {performingLab.address.zipCode}
            </p>
            <p className="lab-contact">Phone: {performingLab.phone} • CLIA#: {performingLab.cliaNumber}</p>
          </div>
        </div>

        <div className="page-break"></div>
        {/* Interpretation */}
        {interpretation && (
          <div className="interpretation-section">
            <h3 className="section-title">INTERPRETATION</h3>
            <div className="interpretation-content">
              <p className="interpretation-text">{interpretation}</p>
            </div>
          </div>
        )}

        {/* Comments */}
        {comments && (
          <div className="comments-section">
            <h3 className="section-title">COMMENTS</h3>
            <div className="comments-content">
              <p className="comments-text">{comments}</p>
            </div>
          </div>
        )}

        {/* Result Legend */}
        {hasAbnormal && (
          <div className="legend-section">
            <h4 className="legend-title">Result Flags:</h4>
            <div className="legend-items">
              <div className="legend-item">
                <span className="flag-badge flag-high">High</span> Above reference range
              </div>
              <div className="legend-item">
                <span className="flag-badge flag-low">Low</span> Below reference range
              </div>
              <div className="legend-item">
                <span className="flag-badge flag-critical">Critical</span> Critically abnormal - requires immediate attention
              </div>
              {results.some((r: any) => r.flag === 'Abnormal') && (
                <div className="legend-item">
                  <span className="flag-badge flag-abnormal">Abnormal</span> Outside normal parameters
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lab Certification and Signatures */}
        <div className="certification-section">
          <div className="certification-grid">
            <div className="cert-item">
              <p className="cert-label">Performed By:</p>
              <p className="cert-value">{technologist}</p>
            </div>
            {pathologist && (
              <div className="cert-item">
                <p className="cert-label">Reviewed By:</p>
                <p className="cert-value">{pathologist}</p>
              </div>
            )}
            <div className="cert-item">
              <p className="cert-label">Laboratory Director:</p>
              <p className="cert-value">{performingLab.director}</p>
            </div>
            <div className="cert-item">
              <p className="cert-label">Report Date/Time:</p>
              <p className="cert-value">{reportDate} {reportTime}</p>
            </div>
          </div>
        </div>

        {/* Lab Disclaimers */}
        <div className="disclaimer-section">
          <h4 className="disclaimer-title">Important Laboratory Information:</h4>
          <ul className="disclaimer-list">
            <li>This report is for the exclusive use of the ordering physician and the patient.</li>
            <li>Reference ranges are provided for comparative purposes only. Clinical interpretation should consider patient-specific factors.</li>
            <li>If you have questions about these results, please contact the laboratory or your healthcare provider.</li>
            <li>These results have been reviewed and released by the laboratory director or designee.</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="lab-footer">
          <div className="footer-info">
            <span>MRN: {individual.id}</span>
            <span>Accession: {faker.string.alphanumeric({ length: 10, casing: 'upper' })}</span>
            <span>Page 2 of 2</span>
            <span>Printed: {currentDate}</span>
          </div>
          <p className="footer-notice">
            This laboratory is certified under the Clinical Laboratory Improvement Amendments (CLIA) of 1988.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LabReportDocument;

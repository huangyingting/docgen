import React from 'react';
import { Individual, Provider, LabReport, VisitReport } from '../../utils/zodSchemas';

interface LabReportsPageProps {
  individual: Individual;
  provider: Provider;
  labReports?: LabReport[];
  visitReport?: VisitReport;
}

const LabReportsPage: React.FC<LabReportsPageProps> = ({
  individual,
  provider,
  labReports,
  visitReport,
}) => {
  const currentDate = new Date().toLocaleDateString();

  // Facility information with fallbacks
  const facilityName = provider?.facilityName || 'Metropolitan General Hospital';
  const facilityPhone = provider?.facilityPhone || '(555) 123-4567';
  const facilityAddressLine = provider?.facilityAddress
    ? `${provider.facilityAddress.street}, ${provider.facilityAddress.city}, ${provider.facilityAddress.state} ${provider.facilityAddress.zipCode}`
    : '123 Medical Center Drive, Healthcare City, HC 12345';

  const renderVitalSigns = () => {
    const vitalSigns = visitReport?.vitalSigns;
    if (!vitalSigns) return null;

    return (
      <div className="compact-section">
        <h3>Vital Signs</h3>
        <table className="compact-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Temperature</th>
              <th>Blood Pressure</th>
              <th>Heart Rate</th>
              <th>Respiratory Rate</th>
              <th>Oxygen Sat</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{visitReport.visit?.date || 'N/A'}</td>
              <td>{vitalSigns.temperature} °F</td>
              <td>{vitalSigns.bloodPressure}</td>
              <td>{vitalSigns.heartRate} bpm</td>
              <td>{vitalSigns.respiratoryRate || 'N/A'}</td>
              <td>{vitalSigns.oxygenSaturation || 'N/A'}%</td>
              <td>{vitalSigns.weight} lbs</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderLabReport = (labReport: any) => {
    return () => (
      <div className="compact-section">
        <h3>{labReport.testName} - {labReport.reportDate}</h3>

        <div style={{ marginBottom: '3mm' }}>
          <table className="info-table">
            <tbody>
              <tr>
                <td className="label">Test Type</td>
                <td className="value">{labReport.testType}</td>
              </tr>
              <tr>
                <td className="label">Specimen Type</td>
                <td className="value">{labReport.specimenType}</td>
              </tr>
              <tr>
                <td className="label">Collection Date</td>
                <td className="value">{labReport.specimenCollectionDate} at {labReport.specimenCollectionTime}</td>
              </tr>
              <tr>
                <td className="label">Ordering Physician</td>
                <td className="value">{labReport.orderingPhysician}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4>Test Results</h4>
        <table className="compact-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Result</th>
              <th>Units</th>
              <th>Reference Range</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {labReport.results.map((result: any, idx: number) => (
              <tr key={idx}>
                <td style={{ fontWeight: 'bold' }}>{result.parameter}</td>
                <td style={{ textAlign: 'center', fontWeight: result.flag !== 'Normal' ? 'bold' : 'normal' }}>
                  {result.value}
                </td>
                <td style={{ textAlign: 'center' }}>{result.unit}</td>
                <td style={{ textAlign: 'center' }}>{result.referenceRange}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`status-badge status-${result.flag?.toLowerCase().replace(' ', '-')}`}>
                    {result.flag}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {labReport.interpretation && (
          <div style={{ marginTop: '3mm' }}>
            <h4>Interpretation</h4>
            <p>{labReport.interpretation}</p>
          </div>
        )}

        {labReport.comments && (
          <div style={{ marginTop: '3mm' }}>
            <h4>Comments</h4>
            <p>{labReport.comments}</p>
          </div>
        )}
      </div>
    );
  };

  const renderCriticalAlerts = () => {
    if (!labReports || labReports.length === 0) return null;

    // Collect critical results from all lab reports
    const allCriticalResults = labReports.flatMap(labReport =>
      labReport.results
        .filter((result: any) =>
          result.flag === 'High' || result.flag === 'Low' || result.flag === 'Critical' || result.flag === 'Abnormal'
        )
        .map((result: any) => ({ ...result, testName: labReport.testName }))
    );

    if (allCriticalResults.length === 0) return null;

    return (
      <div className="compact-section">
        <h3>Critical Values & Alerts</h3>
        <div className="alert-summary">
          {allCriticalResults.slice(0, 4).map((result, index) => (
            <div key={index} className={`alert-box ${result.flag === 'Critical' ? 'critical' : result.flag === 'High' ? 'warning' : 'info'}`}>
              <strong>{result.parameter}</strong> - {result.value} {result.unit}
              <span style={{ fontSize: '9px', color: '#666' }}>
                (Normal: {result.referenceRange}) - Status: {result.flag}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLabSummary = () => {
    if (!labReports || labReports.length === 0) return null;

    // Calculate total abnormal results across all lab reports
    const totalAbnormalCount = labReports.reduce((sum: number, labReport) => {
      return sum + labReport.results.filter((r: any) => r.flag !== 'Normal' && r.flag !== '').length;
    }, 0);

    return (
      <section className="compact-section">
        <h3>Laboratory Summary</h3>
        <div className="reference-grid">
          <div className="reference-item">
            <strong>Tests Ordered</strong>
            <div>{labReports.length} test{labReports.length !== 1 ? 's' : ''}</div>
            <div className="note">Recent reports available</div>
          </div>
          <div className="reference-item">
            <strong>Abnormal Results</strong>
            <div>
              {totalAbnormalCount} finding{totalAbnormalCount !== 1 ? 's' : ''}
            </div>
            <div className="note">{totalAbnormalCount > 0 ? 'Require follow-up review' : 'All values normal'}</div>
          </div>
        </div>

        <div style={{ marginTop: '3mm' }}>
          <h4>Test Information</h4>
          {labReports.slice(0, 2).map((labReport, index) => (
            <div key={index} style={{ marginBottom: index < 1 ? '3mm' : '0' }}>
              <table className="info-table">
                <tbody>
                  <tr>
                    <td className="label">Test Type</td>
                    <td className="value">{labReport.testType}</td>
                  </tr>
                  <tr>
                    <td className="label">Specimen Type</td>
                    <td className="value">{labReport.specimenType}</td>
                  </tr>
                  <tr>
                    <td className="label">Collection Date</td>
                    <td className="value">{labReport.specimenCollectionDate} at {labReport.specimenCollectionTime}</td>
                  </tr>
                  <tr>
                    <td className="label">Ordering Physician</td>
                    <td className="value">{labReport.orderingPhysician}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderNoData = () => {
    return (
      <div className="no-data-message">
        <p>No laboratory or vital sign data available for this patient.</p>
      </div>
    );
  };

  const renderPage = (contentRenderer: () => React.ReactNode, page: string) => {
    return (
      <div className="medical-page">
        <div className="medical-page-header">
          <div className="hospital-info">
            <h2>{facilityName}</h2>
            <p>{facilityAddressLine} | Phone: {facilityPhone}</p>
          </div>
          <div className="page-title">
            <h1>Laboratory Results</h1>
            <p className="generated-date">Generated: {currentDate}</p>
          </div>
        </div>

        <div className="medical-page-content">
          {contentRenderer()}
        </div>

        <div className="medical-page-footer">
          <div className="confidentiality-notice">
            <p><strong>CONFIDENTIAL MEDICAL RECORD:</strong> This document contains privileged and confidential information intended only for the addressee. If you have received this in error, please notify the sender immediately.</p>
          </div>
          <div className="page-info">
            <span>Patient ID: {individual?.id || 'N/A'} | DOB: {individual?.dateOfBirth || 'N/A'}</span>
            <span>Page 4.{page} of 5 | Lab Results</span>
          </div>
        </div>
      </div>
    );
  };

  let pageChar = 'a'; // Initialize with 'a'

  const getNextChar = () => {
    const current = pageChar;
    pageChar = String.fromCharCode(pageChar.charCodeAt(0) + 1); // Increment to next letter
    return current;
  };

  return (
    <>
      {(!visitReport?.vitalSigns && !labReports) &&
      renderPage(renderNoData, getNextChar())}

      {visitReport?.vitalSigns && (
        <div>
          {renderPage(renderVitalSigns, getNextChar())}
          <div className="page-break"></div>
        </div>
      )}
      {labReports && labReports.map((labReport, index) => (
        <div key={`${labReport.testName}-${labReport.reportDate}-${index}`}>
          {renderPage(renderLabReport(labReport), getNextChar())}
          <div className="page-break"></div>
        </div>

      ))}
      {labReports && labReports.length > 0 && (
        <div>
          {renderPage(renderCriticalAlerts, getNextChar())}
          <div className="page-break"></div>
        </div>
      )}

      {labReports && labReports.length > 0 && (
        <div>
          {renderPage(renderLabSummary, getNextChar())}
        </div>
      )}
    </>
  );
};

export default LabReportsPage;
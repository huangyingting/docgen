import React from 'react';
import './VisitReportDocument.css';
import { Individual, VisitReport, Provider } from '../../utils/zodSchemas';

interface VisitReportDocumentProps {
  individual: Individual;
  provider: Provider;
  visitReport: VisitReport;
  fontFamily?: string;
}

const VisitReportDocument: React.FC<VisitReportDocumentProps> = ({
  individual,
  provider,
  visitReport,
  fontFamily = "'Arial', sans-serif"
}) => {
  const { visit, vitalSigns } = visitReport;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div
      className="visit-report-document"
      id="visit-report-document"
      style={{ fontFamily: fontFamily }}
    >
      {/* Page 1: Visit Summary */}
      <div className="visit-report-page page-1">
        {/* Letterhead */}
        <div className="visit-letterhead">
          <div className="facility-header">
            <h1 className="facility-name">{provider.facilityName?.toUpperCase() || 'MEDICAL CENTER'}</h1>
            <p className="facility-address">
              {provider.address.street} • {provider.address.city}, {provider.address.state} {provider.address.zipCode}
            </p>
          </div>
          <div className="facility-contact">
            <p>Phone: {provider.facilityPhone || provider.phone}</p>
            <p>Fax: {provider.facilityFax || provider.phone}</p>
            <p>NPI: {provider.facilityNPI || provider.npi}</p>
          </div>
        </div>

        {/* Document Title */}
        <div className="visit-title-section">
          <h2 className="visit-title">CLINICAL VISIT REPORT</h2>
          <p className="visit-subtitle">Confidential Patient Medical Record</p>
        </div>

        {/* Patient Information Box */}
        <div className="visit-info-box">
          <div className="info-section">
            <h3 className="info-section-title">PATIENT INFORMATION</h3>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Patient Name:</span>
                <span className="info-value strong">{individual.firstName} {individual.middleInitial ? individual.middleInitial + ' ' : ''}{individual.lastName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">MRN:</span>
                <span className="info-value strong">{individual.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Date of Birth:</span>
                <span className="info-value">{individual.dateOfBirth}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Age:</span>
                <span className="info-value">{individual.age} years</span>
              </div>
              <div className="info-row">
                <span className="info-label">Gender:</span>
                <span className="info-value">{individual.gender}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone:</span>
                <span className="info-value">{individual.contact.phone}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3 className="info-section-title">VISIT INFORMATION</h3>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Visit Date:</span>
                <span className="info-value strong">{visit.date}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Visit Type:</span>
                <span className="info-value">{visit.type}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Provider:</span>
                <span className="info-value">{provider.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Specialty:</span>
                <span className="info-value">{provider.specialty}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Duration:</span>
                <span className="info-value">{visit.duration}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Report Date:</span>
                <span className="info-value">{currentDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="visit-section">
          <h3 className="section-title">VITAL SIGNS</h3>
          <table className="vitals-table">
            <thead>
              <tr>
                <th>Blood Pressure</th>
                <th>Heart Rate</th>
                <th>Temperature</th>
                <th>Resp. Rate</th>
                <th>O₂ Saturation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="vital-value">{vitalSigns.bloodPressure}</td>
                <td className="vital-value">{vitalSigns.heartRate} bpm</td>
                <td className="vital-value">{vitalSigns.temperature}</td>
                <td className="vital-value">{vitalSigns.respiratoryRate}</td>
                <td className="vital-value">{vitalSigns.oxygenSaturation}</td>
              </tr>
            </tbody>
          </table>
          <table className="vitals-table secondary-vitals">
            <thead>
              <tr>
                <th>Height</th>
                <th>Weight</th>
                <th>BMI</th>
                <th>Time Recorded</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="vital-value">{vitalSigns.height}</td>
                <td className="vital-value">{vitalSigns.weight}</td>
                <td className="vital-value">{vitalSigns.bmi}</td>
                <td className="vital-value">{vitalSigns.time}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Chief Complaint */}
        <div className="visit-section">
          <h3 className="section-title">CHIEF COMPLAINT</h3>
          <div className="content-box">
            <p className="content-text">{visit.chiefComplaint}</p>
          </div>
        </div>

        {/* Assessment */}
        <div className="visit-section">
          <h3 className="section-title">ASSESSMENT / DIAGNOSIS</h3>
          <div className="content-box">
            <ol className="assessment-list">
              {visit.assessment.map((diagnosis, index) => (
                <li key={index} className="assessment-item">{diagnosis}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Plan */}
        <div className="visit-section">
          <h3 className="section-title">TREATMENT PLAN</h3>
          <div className="content-box">
            <ul className="plan-list">
              {visit.plan.map((planItem, index) => (
                <li key={index} className="plan-item">{planItem}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Provider Signature Section */}
        <div className="signature-section">
          <div className="signature-line">
            <div className="signature-box">
              <div className="signature-placeholder"></div>
              <div className="signature-info">
                <p className="signature-name">{provider.name}</p>
                <p className="signature-credentials">{provider.specialty}</p>
                <p className="signature-npi">NPI: {provider.npi}</p>
              </div>
            </div>
            <div className="signature-date">
              <p>Date: _______________</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="visit-footer">
          <p className="footer-notice">
            This document contains confidential patient health information protected by HIPAA regulations.
            Unauthorized disclosure is prohibited by law.
          </p>
          <div className="footer-info">
            <span>MRN: {individual.id}</span>
            <span>Page 1 of 1</span>
            <span>Printed: {currentDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitReportDocument;

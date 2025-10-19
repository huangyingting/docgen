import React from 'react';
import './MedicationHistoryDocument.css';
import { Individual, MedicalHistory, Provider } from '../../utils/zodSchemas';

interface MedicationHistoryDocumentProps {
  individual: Individual;
  provider: Provider;
  medicalHistory: MedicalHistory;
  fontFamily?: string;
}

const MedicationHistoryDocument: React.FC<MedicationHistoryDocumentProps> = ({
  individual,
  provider,
  medicalHistory,
  fontFamily = "'Arial', sans-serif"
}) => {
  const { medications, allergies } = medicalHistory;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div
      className="medication-history-document"
      id="medication-history-document"
      style={{ fontFamily: fontFamily }}
    >
      {/* Page 1: Medication History */}
      <div className="medication-history-page page-1">
        {/* Letterhead */}
        <div className="medication-letterhead">
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
        <div className="medication-title-section">
          <h2 className="medication-title">MEDICATION HISTORY REPORT</h2>
          <p className="medication-subtitle">Comprehensive Medication & Allergy Record</p>
        </div>

        {/* Patient Information */}
        <div className="medication-info-box">
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
            <span className="info-label">Age / Gender:</span>
            <span className="info-value">{individual.age} years / {individual.gender}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Primary Care Provider:</span>
            <span className="info-value">{provider.name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Report Date:</span>
            <span className="info-value">{currentDate}</span>
          </div>
        </div>

        {/* Allergy Alert Section */}
        <div className="allergy-alert-section">
          <h3 className="alert-title">⚠ ALLERGY INFORMATION</h3>
          <div className="allergy-content">
            {allergies.length > 0 ? (
              <table className="allergy-table">
                <thead>
                  <tr>
                    <th>Allergen</th>
                    <th>Reaction</th>
                    <th>Severity</th>
                    <th>Date Identified</th>
                  </tr>
                </thead>
                <tbody>
                  {allergies.map((allergy, index) => (
                    <tr key={index} className={allergy.severity === 'Severe' ? 'severe-allergy' : ''}>
                      <td className="allergen-name">{allergy.allergen}</td>
                      <td>{allergy.reaction}</td>
                      <td className={`severity severity-${allergy.severity.toLowerCase()}`}>
                        {allergy.severity}
                      </td>
                      <td>{allergy.dateIdentified}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-allergies">No Known Drug Allergies (NKDA)</p>
            )}
          </div>
        </div>

        {/* Current Medications */}
        <div className="medication-section">
          <h3 className="section-title">CURRENT MEDICATIONS</h3>
          {medications.current.length > 0 ? (
            <table className="medication-table">
              <thead>
                <tr>
                  <th className="med-name-col">Medication</th>
                  <th className="med-strength-col">Strength</th>
                  <th className="med-dosage-col">Dosage / Instructions</th>
                  <th className="med-purpose-col">Purpose</th>
                  <th className="med-date-col">Start Date</th>
                  <th className="med-prescriber-col">Prescribed By</th>
                </tr>
              </thead>
              <tbody>
                {medications.current.map((med, index) => (
                  <tr key={index}>
                    <td className="med-name">{med.name}</td>
                    <td className="med-strength">{med.strength}</td>
                    <td className="med-instructions">{med.dosage}</td>
                    <td>{med.purpose}</td>
                    <td>{med.startDate}</td>
                    <td>{med.prescribedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-medications">No current medications on file</p>
          )}
        </div>

        {/* Discontinued Medications */}
        {medications.discontinued.length > 0 && (
          <div className="medication-section">
            <h3 className="section-title">DISCONTINUED MEDICATIONS</h3>
            <table className="discontinued-table">
              <thead>
                <tr>
                  <th className="med-name-col">Medication</th>
                  <th className="med-strength-col">Strength</th>
                  <th className="med-reason-col">Reason for Discontinuation</th>
                  <th className="med-date-col">Date Discontinued</th>
                  <th className="med-prescriber-col">Prescribed By</th>
                </tr>
              </thead>
              <tbody>
                {medications.discontinued.map((med, index) => (
                  <tr key={index} className="discontinued-row">
                    <td className="med-name">{med.name}</td>
                    <td className="med-strength">{med.strength}</td>
                    <td>{med.reason}</td>
                    <td>{med.discontinuedDate}</td>
                    <td>{med.prescribedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Important Notes */}
        <div className="notes-section">
          <h3 className="section-title">IMPORTANT NOTES</h3>
          <div className="notes-content">
            <ul className="notes-list">
              <li>This medication list should be reviewed and updated at each healthcare visit.</li>
              <li>Always inform healthcare providers of all medications, including over-the-counter drugs, vitamins, and supplements.</li>
              <li>Report any adverse reactions or side effects to your healthcare provider immediately.</li>
              <li>Do not stop or change medications without consulting your healthcare provider.</li>
              <li>Keep medications in their original containers and store as directed.</li>
            </ul>
          </div>
        </div>

        {/* Provider Verification */}
        <div className="verification-section">
          <div className="verification-box">
            <p className="verification-text">
              <strong>Reviewed By:</strong> {provider.name}, {provider.specialty}
            </p>
            <p className="verification-text">
              <strong>Review Date:</strong> {currentDate}
            </p>
            <p className="verification-text">
              <strong>NPI:</strong> {provider.npi}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="medication-footer">
          <p className="footer-notice">
            This document contains confidential patient health information protected by HIPAA regulations.
            Unauthorized disclosure is prohibited by law.
          </p>
          <div className="footer-info">
            <span>MRN: {individual.id}</span>
            <span>Page 1 of 1</span>
            <span>Generated: {currentDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationHistoryDocument;

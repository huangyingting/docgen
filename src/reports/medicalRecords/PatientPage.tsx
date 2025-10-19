import React from 'react';
import { Individual, Provider, InsuranceInfo, LabReports, MedicalHistory } from '../../utils/zodSchemas';

interface PatientPageProps {
  individual: Individual;
  provider: Provider;
  insuranceInfo: InsuranceInfo;
  labReports?: LabReports;
  medicalHistory?: MedicalHistory;
}

const PatientPage: React.FC<PatientPageProps> = ({ individual, provider, insuranceInfo, labReports: labReports, medicalHistory: medicalHistoryData }) => {

  // Extract primary insurance from InsuranceInfo
  const primaryInsurance = insuranceInfo?.primaryInsurance;
  const currentDate = new Date().toLocaleDateString();

  // Extract dynamic data from medicalHistoryData
  const allergiesText = medicalHistoryData?.allergies && medicalHistoryData.allergies.length > 0
    ? medicalHistoryData.allergies.map(a => `${a.allergen} (${a.severity})`).join(', ')
    : 'No known allergies';

  const chronicConditionsText = medicalHistoryData?.chronicConditions && medicalHistoryData.chronicConditions.length > 0
    ? medicalHistoryData.chronicConditions.map(c => c.condition).join(', ')
    : 'None documented';

  const currentMedicationsText = medicalHistoryData?.medications?.current && medicalHistoryData.medications.current.length > 0
    ? medicalHistoryData.medications.current.slice(0, 3).map(m => m.name).join(', ') + (medicalHistoryData.medications.current.length > 3 ? `, +${medicalHistoryData.medications.current.length - 3} more` : '')
    : 'No current medications';

  // Try to find blood type from all laboratory reports
  let bloodTypeResult = null;
  let bloodTypeDate = null;
  if (labReports && labReports.length > 0) {
    for (const report of labReports) {
      const result = report.results?.find((r: any) =>
        r.parameter?.toLowerCase().includes('blood type') || r.parameter?.toLowerCase().includes('abo')
      );
      if (result) {
        bloodTypeResult = result;
        bloodTypeDate = report.reportDate;
        break;
      }
    }
  }
  const bloodType = bloodTypeResult?.value || 'Not on file';

  // Use pharmacy data from individual demographics
  const pharmacy = individual?.pharmacy || { name: 'Not specified', address: 'Not specified', phone: 'Not specified' };

  return (
    <div className="medical-page demographics-page">
      <header className="medical-page-header">
        <div className="hospital-info">
          <h2>{provider?.facilityName || 'Healthcare Facility'}</h2>
          <p>
            {provider?.facilityAddress?.street && provider?.facilityAddress?.city && provider?.facilityAddress?.state && provider?.facilityAddress?.zipCode
              ? `${provider.facilityAddress.street}, ${provider.facilityAddress.city}, ${provider.facilityAddress.state} ${provider.facilityAddress.zipCode}`
              : '123 Healthcare Blvd, Springfield, IL 62701'}
            {' | '}
            {provider?.facilityPhone || '(555) 555-0100'}
          </p>
        </div>
        <div className="page-title">
          <h1>Patient Demographics & Information</h1>
          <p className="generated-date">Generated: {currentDate}</p>
        </div>
      </header>

      <main className="medical-page-content">
        {/* Compact Patient Basic Information Table */}
        <section className="patient-basic-info compact-section">
          <h3>Patient Information</h3>
          <table className="info-table">
            <tbody>
              <tr>
                <td className="label">Medical Record #:</td>
                <td className="value">{individual.id}</td>
                <td className="label">Full Name:</td>
                <td className="value">{individual.firstName} {individual.middleInitial ? individual.middleInitial + ' ' : ''}{individual.lastName}</td>
              </tr>
              <tr>
                <td className="label">Date of Birth:</td>
                <td className="value">{individual.dateOfBirth}</td>
                <td className="label">Age:</td>
                <td className="value">{individual.age} years</td>
              </tr>
              <tr>
                <td className="label">Gender:</td>
                <td className="value">{individual.gender}</td>
                <td className="label">SSN:</td>
                <td className="value">{individual.ssn}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Compact Contact Information */}
        <section className="contact-information compact-section">
          <h3>Contact Information</h3>
          <table className="info-table">
            <tbody>
              <tr>
                <td className="label">Address:</td>
                <td className="value" colSpan={3}>
                  {individual.address.street}, {individual.address.city}, {individual.address.state} {individual.address.zipCode}, {individual.address.country}
                </td>
              </tr>
              <tr>
                <td className="label">Phone:</td>
                <td className="value">{individual.contact.phone}</td>
                <td className="label">Email:</td>
                <td className="value">{individual.contact.email}</td>
              </tr>
              <tr>
                <td className="label">Emergency Contact:</td>
                <td className="value" colSpan={3}>{individual.contact.emergencyContact}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Compact Insurance Information */}
        <section className="insurance-information compact-section">
          <h3>Insurance Information</h3>
          <table className="info-table">
            <tbody>
              <tr>
                <td className="label">Provider:</td>
                <td className="value">{primaryInsurance?.provider || 'Not specified'}</td>
                <td className="label">Policy Number:</td>
                <td className="value">{primaryInsurance?.policyNumber || 'Not specified'}</td>
              </tr>
              <tr>
                <td className="label">Group Number:</td>
                <td className="value">{primaryInsurance?.groupNumber || 'Not specified'}</td>
                <td className="label">Effective Date:</td>
                <td className="value">{primaryInsurance?.effectiveDate || 'Not specified'}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Medical Alerts Summary */}
        <section className="medical-alerts compact-section">
          <h3>Medical Alerts & Allergies</h3>
          <div className="alert-summary">
            <div className="alert-box critical">
              <strong>⚠️ DRUG ALLERGIES:</strong> {allergiesText}
            </div>
            <div className="alert-box warning">
              <strong>🩺 CHRONIC CONDITIONS:</strong> {chronicConditionsText}
            </div>
            <div className="alert-box info">
              <strong>💊 CURRENT MEDICATIONS:</strong> {currentMedicationsText}
            </div>
          </div>
        </section>

        {/* Quick Reference Summary */}
        <section className="quick-reference compact-section">
          <h3>Quick Reference</h3>
          <div className="reference-grid">
            <div className="reference-item">
              <strong>Primary Care Physician:</strong><br />
              {provider?.name || 'Not assigned'}<br />
              {provider?.specialty || 'General Practice'}<br />
              {provider?.phone || 'N/A'}
            </div>
            <div className="reference-item">
              <strong>Last Visit:</strong><br />
              No visits on record<br />
              N/A<br />
              N/A
            </div>
            <div className="reference-item">
              <strong>Blood Type:</strong><br />
              {bloodType}<br />
              <span className="note">{bloodTypeDate ? `Verified ${bloodTypeDate}` : 'Pending verification'}</span>
            </div>
            <div className="reference-item">
              <strong>Preferred Pharmacy:</strong><br />
              {pharmacy.name}<br />
              {pharmacy.address}<br />
              {pharmacy.phone}
            </div>
          </div>
        </section>
      </main>

      <footer className="medical-page-footer">
        <div className="confidentiality-notice">
          <p><strong>CONFIDENTIAL:</strong> This document contains protected health information.
            Unauthorized disclosure is prohibited by law.</p>
        </div>
        <div className="page-info">
          <span>Page 1 of 5</span>
          <span>Patient: {individual.firstName} {individual.middleInitial ? individual.middleInitial + ' ' : ''}{individual.lastName}</span>
          <span>MRN: {individual.id}</span>
        </div>
      </footer>
    </div>
  );
};

export default PatientPage;

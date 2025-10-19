import React from 'react';
import './PassportDocument.css';
import { Individual, Passport } from '../../utils/zodSchemas';

interface PassportDocumentProps {
  individual: Individual
  passport: Passport;
  fontFamily?: string;
}

const PassportDocument: React.FC<PassportDocumentProps> = ({ 
  individual,
  passport,
  fontFamily = "'Arial', sans-serif" 
}) => {

  
  // Select a random user photo (1-4)
  const photoIndex = Math.floor(Math.random() * 4) + 1;
  const photoUrl = `/docgen/user-${photoIndex}.jpg`;

  // Format dates for passport - DD Mon YYYY format
  const formatDateForPassport = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${monthName} ${year}`;
  };

  // Extract address info
  const address = individual.address || { street: '', city: '', state: '', zipCode: '', country: 'USA' };

  return (
    <div
      className="passport-document"
      id="passport-report"
      style={{ fontFamily: fontFamily }}
    >
      <div className="passport-page">
        <div className="passport-card">
          {/* Red-White-Blue Gradient Background */}
          <div className="passport-bg-gradient"></div>
          
          {/* Watermark Image */}
          <div className="passport-watermark"></div>

          <div className="passport-content">
          {/* Left Section */}
          <div className="passport-left">
            {/* Vertical Text */}
            <div className="vertical-labels">
              <div className="vertical-text">PASSPORT</div>
              <div className="vertical-text">PASSEPORT</div>
              <div className="vertical-text">PASAPORTE</div>
            </div>

            {/* USA Text */}
            <div className="usa-text">USA</div>

            {/* Photo */}
            <div className="photo-wrapper">
              <img src={photoUrl} alt="Passport" className="passport-photo" />
            </div>
          </div>

          {/* Right Section - Main Data */}
          <div className="passport-right-section">
            {/* Header */}
            <div className="passport-header">
              <div className="usa-title">UNITED STATES OF AMERICA</div>
            </div>

            {/* Type/Code/Number Row */}
            <div className="header-fields">
              <div className="header-field">
                <div className="header-label">Type / Type / Tipo</div>
                <div className="header-value">P</div>
              </div>
              <div className="header-field">
                <div className="header-label">Code / Code / Código</div>
                <div className="header-value">USA</div>
              </div>
              <div className="header-field-wide">
                <div className="header-label">Passport No. / Nº de passeport / No. de Pasaporte</div>
                <div className="header-value-large">{passport.passportNumber}</div>
              </div>
            </div>

            {/* Data Fields Grid */}
            <div className="data-fields-container">
              <div className="data-fields-left">
                {/* Surname */}
                <div className="data-field">
                  <div className="data-label">Surname / Nom / Apellidos</div>
                  <div className="data-value">{individual.lastName.toUpperCase()}</div>
                </div>

                {/* Given Names */}
                <div className="data-field">
                  <div className="data-label">Given Names / Prénoms / Nombres</div>
                  <div className="data-value">
                    {individual.firstName.toUpperCase()} {individual.middleInitial ? individual.middleInitial.toUpperCase() : ''}
                  </div>
                </div>

                {/* Nationality */}
                <div className="data-field">
                  <div className="data-label">Nationality / Nationalité / Nacionalidad</div>
                  <div className="data-value">UNITED STATES OF AMERICA</div>
                </div>

                {/* Date of Birth */}
                <div className="data-field">
                  <div className="data-label">Date of birth / Date de naissance / Fecha de nacimiento</div>
                  <div className="data-value">{formatDateForPassport(individual.dateOfBirth)}</div>
                </div>

                {/* Place of Birth */}
                <div className="data-field">
                  <div className="data-label">Place of birth / Lieu de naissance / Lugar de nacimiento</div>
                  <div className="data-value">{address.city?.toUpperCase() || 'INDIANAPOLIS'}</div>
                </div>

                {/* Date of Issue */}
                <div className="data-field">
                  <div className="data-label">Date of issue / Date de délivrance / Fecha de expedición</div>
                  <div className="data-value">{formatDateForPassport(passport.issuanceDate)}</div>
                </div>

                {/* Date of Expiry */}
                <div className="data-field">
                  <div className="data-label">Date of expiration / Date d'expiration / Fecha de caducidad</div>
                  <div className="data-value">{formatDateForPassport(passport.expiryDate)}</div>
                </div>

                {/* Endorsements */}
                <div className="data-field">
                  <div className="data-label">Endorsements / Mentions Spéciales / Anotaciones</div>
                  <div className="data-value-endorsement">SEE PAGE 27</div>
                </div>
              </div>

              <div className="data-fields-right">
                {/* Sex */}
                <div className="data-field-right">
                  <div className="data-label">Sex / Sexe / Sexo</div>
                  <div className="data-value">{individual.gender === 'Female' ? 'F' : 'M'}</div>
                </div>

                {/* Authority */}
                <div className="data-field-right authority-field">
                  <div className="data-label">Authority / Autorité / Autoridad</div>
                  <div className="data-value-small">United States<br />Department of State</div>
                </div>

                {/* USA Large */}
                <div className="usa-large">USA</div>
              </div>
            </div>
          </div>
        </div>

        {/* Machine Readable Zone */}
        <div className="mrz">
          <div className="mrz-line">{passport.mrzLine1}</div>
          <div className="mrz-line">{passport.mrzLine2}</div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default PassportDocument;

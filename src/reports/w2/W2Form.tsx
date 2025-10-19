import React from 'react';
import './W2Form.css';
import { Individual, W2 } from '../../utils/zodSchemas';

interface W2FormProps {
  individual: Individual;
  w2: W2;
  fontFamily?: string;
}

const W2Form: React.FC<W2FormProps> = ({ individual, w2, fontFamily = "'Helvetica Neue', Arial, sans-serif" }) => {
  return (
    <div className="w2-report" id="w2-report" style={{ fontFamily }}>
      <div className="w2-page">
        <div className="w2-form">
          {/* Main grid container */}
          <div className="w2-grid">
            {/* Row 1: Box a + OMB */}
            <div className="w2-row w2-row-1">
              <div className="w2-box w2-box-a">
                <div className="w2-label">a  Employee's social security number</div>
                <div className="w2-value">{individual.ssn}</div>
              </div>
              <div className="w2-box w2-box-omb">
                <div className="w2-label">OMB No. 1545-0008</div>
              </div>
            </div>

            {/* Row 2: Box b + Boxes 1-2 */}
            <div className="w2-row w2-row-2">
              <div className="w2-box w2-box-b">
                <div className="w2-label">b  Employer identification number (EIN)</div>
                <div className="w2-value">{individual.employerEIN}</div>
              </div>
              <div className="w2-box w2-box-1">
                <div className="w2-label">1   Wages, tips, other compensation</div>
                <div className="w2-value">{w2.wages}</div>
              </div>
              <div className="w2-box w2-box-2">
                <div className="w2-label">2   Federal income tax withheld</div>
                <div className="w2-value">{w2.federalIncomeTaxWithheld}</div>
              </div>
            </div>

            {/* Rows 3-5: Box c + Boxes 3-8 */}
            <div className="w2-row w2-row-3-5">
              <div className="w2-box w2-box-c">
                <div className="w2-label">c  Employer's name, address, and ZIP code</div>
                <div className="w2-value w2-multiline">
                  <div>{individual.companyName}</div>
                  <div>{individual.employerAddress.street}</div>
                  <div>{individual.employerAddress.city}, {individual.employerAddress.state} {individual.employerAddress.zipCode}</div>
                </div>
              </div>
              <div className="w2-boxes-3-8">
                <div className="w2-box w2-box-3">
                  <div className="w2-label">3   Social security wages</div>
                  <div className="w2-value">{w2.socialSecurityWages}</div>
                </div>
                <div className="w2-box w2-box-4">
                  <div className="w2-label">4   Social security tax withheld</div>
                  <div className="w2-value">{w2.socialSecurityTaxWithheld}</div>
                </div>
                <div className="w2-box w2-box-5">
                  <div className="w2-label">5   Medicare wages and tips</div>
                  <div className="w2-value">{w2.medicareWages}</div>
                </div>
                <div className="w2-box w2-box-6">
                  <div className="w2-label">6   Medicare tax withheld</div>
                  <div className="w2-value">{w2.medicareTaxWithheld}</div>
                </div>
                <div className="w2-box w2-box-7">
                  <div className="w2-label">7   Social security tips</div>
                  <div className="w2-value">{w2.socialSecurityTips || ''}</div>
                </div>
                <div className="w2-box w2-box-8">
                  <div className="w2-label">8   Allocated tips</div>
                  <div className="w2-value">{w2.allocatedTips || ''}</div>
                </div>
              </div>
            </div>

            {/* Row 6: Box d + Boxes 9-10 */}
            <div className="w2-row w2-row-6">
              <div className="w2-box w2-box-d">
                <div className="w2-label">d  Control number</div>
                <div className="w2-value">{w2.controlNumber || ''}</div>
              </div>
              <div className="w2-box w2-box-9">
                <div className="w2-label">9</div>
                <div className="w2-value"></div>
              </div>
              <div className="w2-box w2-box-10">
                <div className="w2-label">10   Dependent care benefits</div>
                <div className="w2-value">{w2.dependentCareBenefits || ''}</div>
              </div>
            </div>

            {/* Row 7: Box e (employee name) + Box 11 */}
            <div className="w2-row w2-row-7">
              <div className="w2-box w2-box-e-first">
                <div className="w2-label">e  Employee's first name and initial</div>
                <div className="w2-value">{individual.firstName} {individual.middleInitial}</div>
              </div>
              <div className="w2-box w2-box-e-last">
                <div className="w2-label">Last name</div>
                <div className="w2-value">{individual.lastName}</div>
              </div>
              <div className="w2-box w2-box-e-suff">
                <div className="w2-label">Suff.</div>
                <div className="w2-value"></div>
              </div>
              <div className="w2-box w2-box-11">
                <div className="w2-label">11   Nonqualified plans</div>
                <div className="w2-value">{w2.nonqualifiedPlans || ''}</div>
              </div>
            </div>

            {/* Rows 8-9: Box f + Box 12/13 + Box 14 */}
            <div className="w2-row w2-row-8-9">
              <div className="w2-box w2-box-f">
                <div className="w2-label">f  Employee's address and ZIP code</div>
                <div className="w2-value w2-multiline">
                  <div>{individual.address.street}</div>
                  <div>{individual.address.city}, {individual.address.state} {individual.address.zipCode}</div>
                </div>
              </div>
              <div className="w2-right-section">
              <div className="w2-box-12-13-container">
                <div className="w2-box w2-box-12">
                  <div className="w2-label">12a</div>
                  <div className="w2-box-12-row">
                    <span className="w2-code-vertical">Code</span>
                    <span className="w2-code-val">{w2.box12Codes?.[0]?.code || ''}</span>
                    <span className="w2-code-amt">{w2.box12Codes?.[0]?.amount || ''}</span>
                  </div>
                  <div className="w2-box-12-row">
                    <span className="w2-code-label">12b</span>
                    <span className="w2-code-vertical">Code</span>
                    <span className="w2-code-val">{w2.box12Codes?.[1]?.code || ''}</span>
                    <span className="w2-code-amt">{w2.box12Codes?.[1]?.amount || ''}</span>
                  </div>
                  <div className="w2-box-12-row">
                    <span className="w2-code-label">12c</span>
                    <span className="w2-code-vertical">Code</span>
                    <span className="w2-code-val">{w2.box12Codes?.[2]?.code || ''}</span>
                    <span className="w2-code-amt">{w2.box12Codes?.[2]?.amount || ''}</span>
                  </div>
                  <div className="w2-box-12-row">
                    <span className="w2-code-label">12d</span>
                    <span className="w2-code-vertical">Code</span>
                    <span className="w2-code-val">{w2.box12Codes?.[3]?.code || ''}</span>
                    <span className="w2-code-amt">{w2.box12Codes?.[3]?.amount || ''}</span>
                  </div>
                </div>
                <div className="w2-box w2-box-13">
                  <div className="w2-label">13</div>
                  <div className="w2-checkboxes">
                    <label>
                      <span className="w2-checkbox-text">Statutory<br/>employee</span>
                      <input type="checkbox" checked={w2.statutoryEmployee || false} readOnly />
                    </label>
                    <label>
                      <span className="w2-checkbox-text">Retirement<br/>plan</span>
                      <input type="checkbox" checked={w2.retirementPlan || false} readOnly />
                    </label>
                    <label>
                      <span className="w2-checkbox-text">Third-party<br/>sick pay</span>
                      <input type="checkbox" checked={w2.thirdPartySickPay || false} readOnly />
                    </label>
                  </div>
                </div>
              </div>
                <div className="w2-box w2-box-14">
                  <div className="w2-label">14  Other</div>
                  <div className="w2-value"></div>
                </div>
              </div>
            </div>

            {/* Row 10: State/Local boxes 15-20 */}
            <div className="w2-row w2-row-10">
              <div className="w2-box w2-box-15">
                <div className="w2-label">15  State</div>
                <div className="w2-value">{individual.address.state}</div>
              </div>
              <div className="w2-box w2-box-15b">
                <div className="w2-label">Employer's state ID number</div>
                <div className="w2-value">{individual.employerEIN.split('-')[0]}</div>
              </div>
              <div className="w2-box w2-box-16">
                <div className="w2-label">16  State wages, tips, etc.</div>
                <div className="w2-value">{w2.stateWages || w2.wages}</div>
              </div>
              <div className="w2-box w2-box-17">
                <div className="w2-label">17  State income tax</div>
                <div className="w2-value">{w2.stateIncomeTax || ''}</div>
              </div>
              <div className="w2-box w2-box-18">
                <div className="w2-label">18  Local wages, tips, etc.</div>
                <div className="w2-value">{w2.localWages || ''}</div>
              </div>
              <div className="w2-box w2-box-19">
                <div className="w2-label">19  Local income tax</div>
                <div className="w2-value">{w2.localIncomeTax || ''}</div>
              </div>
              <div className="w2-box w2-box-20">
                <div className="w2-label">20  Locality name</div>
                <div className="w2-value">{w2.localityName || ''}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="w2-footer">
            <div className="w2-footer-left">
              Form <strong>W-2</strong> Wage and Tax Statement
            </div>
            <div className="w2-footer-year">{w2.taxYear}</div>
            <div className="w2-footer-right">
              Department of the Treasury—Internal Revenue Service
            </div>
          </div>
          <div className="w2-copy">
            Copy 1—For State, City, or Local Tax Department
          </div>
        </div>
      </div>
    </div>
  );
};

export default W2Form;

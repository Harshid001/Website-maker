import React from 'react';

export default function StepWizard({ children }) {
  return (
    <div className="step-wizard-container">
      {children}
    </div>
  );
}

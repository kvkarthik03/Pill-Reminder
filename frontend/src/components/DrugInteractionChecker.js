import React, { useState } from 'react';
import '../styles/DrugInteractionChecker.css';

const DrugInteractionChecker = () => {
  const [drug1, setDrug1] = useState("");
  const [drug2, setDrug2] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatInteractionText = (text) => {
    // Split by periods to create separate paragraphs
    return text.split('.').filter(Boolean).map(sentence => sentence.trim());
  };

  const analyzeInteractionSeverity = (text) => {
    const severeKeywords = ['severe', 'serious', 'dangerous', 'avoid', 'death', 'fatal'];
    const moderateKeywords = ['moderate', 'caution', 'careful', 'monitor'];
    const minorKeywords = ['mild', 'minor', 'slight'];

    text = text.toLowerCase();

    if (severeKeywords.some(word => text.includes(word))) {
      return {
        level: 'HIGH',
        color: '#dc3545',
        message: '⚠️ SEVERE INTERACTION DETECTED',
        description: 'These medications have a severe interaction risk. Alternative medications should be considered.'
      };
    }
    if (moderateKeywords.some(word => text.includes(word))) {
      return {
        level: 'MODERATE',
        color: '#ffc107',
        message: '⚠️ MODERATE INTERACTION DETECTED',
        description: 'Use these medications together with caution. Monitor for side effects.'
      };
    }
    if (minorKeywords.some(word => text.includes(word))) {
      return {
        level: 'MINOR',
        color: '#28a745',
        message: 'ℹ️ MINOR INTERACTION',
        description: 'Minor interaction possible. Monitor for any unusual effects.'
      };
    }
    return {
      level: 'UNKNOWN',
      color: '#17a2b8',
      message: 'ℹ️ NO KNOWN INTERACTION',
      description: 'Please review the detailed information below.'
    };
  };

  const handleCheckInteraction = async () => {
    if (!drug1 || !drug2) {
      setError("Please enter both drug names");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const query = 'drug_interactions:"' + drug1 + '" AND drug_interactions:"' + drug2 + '"';
      const encodedQuery = encodeURIComponent(query);
      const url = 'https://api.fda.gov/drug/label.json?search=' + encodedQuery;

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const interactions = data.results[0].drug_interactions;
        if (interactions && interactions.length > 0) {
          const interactionText = interactions[0];
          const severity = analyzeInteractionSeverity(interactionText);
          setResult({
            text: interactionText,
            severity: severity
          });
        } else {
          setError("No specific interaction information found in the FDA database.");
        }
      } else {
        setError("No results found for these medications in the FDA database.");
      }
    } catch (error) {
      console.error("Error fetching data from openFDA:", error);
      setError("Error accessing FDA database. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderAnalysis = (analysis) => {
    if (!analysis) return null;

    const severityColors = {
      'HIGH': '#dc3545',
      'MODERATE': '#ffc107',
      'SAFE': '#28a745',
      'UNKNOWN': '#6c757d'
    };

    return (
      <div 
        className="interaction-analysis"
        style={{
          padding: '1rem',
          marginBottom: '1rem',
          borderRadius: '8px',
          backgroundColor: `${severityColors[analysis.severity]}20`,
          borderLeft: `4px solid ${severityColors[analysis.severity]}`,
          marginTop: '1rem'
        }}
      >
        <h4 style={{ color: severityColors[analysis.severity] }}>
          {analysis.message}
        </h4>
        <p style={{ 
          marginTop: '0.5rem', 
          color: '#555',
          fontSize: '0.9rem' 
        }}>
          <strong>Severity Level:</strong> {analysis.severity}<br/>
          {analysis.severityDescription}
        </p>
      </div>
    );
  };

  return (
    <div className="drug-interaction-container">
      <h2>Drug Interaction Checker</h2>
      <p className="checker-description">
        Enter two medications to check for potential interactions between them.
      </p>

      <div className="drug-inputs">
        <div className="input-group">
          <label>First Medication</label>
          <input
            type="text"
            value={drug1}
            onChange={(e) => setDrug1(e.target.value)}
            placeholder="e.g., Aspirin"
          />
        </div>

        <div className="input-group">
          <label>Second Medication</label>
          <input
            type="text"
            value={drug2}
            onChange={(e) => setDrug2(e.target.value)}
            placeholder="e.g., Warfarin"
          />
        </div>
      </div>

      <button 
        onClick={handleCheckInteraction}
        disabled={loading || !drug1 || !drug2}
        className="check-button"
      >
        {loading ? "Checking..." : "Check Interaction"}
      </button>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {result && (
        <div className="result-container">
          <div 
            className="severity-banner"
            style={{
              backgroundColor: `${result.severity.color}20`,
              borderLeft: `4px solid ${result.severity.color}`,
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '4px'
            }}
          >
            <h3 style={{ color: result.severity.color }}>{result.severity.message}</h3>
            <p>{result.severity.description}</p>
          </div>

          <div className="interaction-details">
            <h4>Detailed Information:</h4>
            {formatInteractionText(result.text).map((paragraph, index) => (
              <p key={index}>{paragraph}.</p>
            ))}
          </div>
        </div>
      )}

      <div className="disclaimer">
        <p>
          <strong>Disclaimer:</strong> This information is sourced from FDA drug labeling. 
          Always consult with a healthcare professional before making any medical decisions.
        </p>
      </div>
    </div>
  );
};

export default DrugInteractionChecker;

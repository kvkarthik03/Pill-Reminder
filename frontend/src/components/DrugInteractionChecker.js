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
          setResult(interactions[0]); // Taking first interaction text
        } else {
          setError("No drug interaction information found in the label.");
        }
      } else {
        setError("No results found for these drugs.");
      }
    } catch (error) {
      console.error("Error fetching data from openFDA:", error);
      setError("Error fetching data from FDA database.");
    } finally {
      setLoading(false);
    }
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
          <h3>Interaction Information</h3>
          <div className="interaction-details">
            <h4>Between {drug1} and {drug2}:</h4>
            {formatInteractionText(result).map((paragraph, index) => (
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

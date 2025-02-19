import React, { useState } from 'react';
import '../styles/DrugInteractionChecker.css';

const DrugInteractionChecker = () => {
  const [drug1, setDrug1] = useState("");
  const [drug2, setDrug2] = useState("");
  const [result, setResult] = useState("");

  const handleCheckInteraction = async () => {
    setResult("Checking for interactions...");
    // Note: Using raw string for query construction, not template literals
    const query = 'drug_interactions:"' + drug1 + '" AND drug_interactions:"' + drug2 + '"';
    const encodedQuery = encodeURIComponent(query);
    const url = 'https://api.fda.gov/drug/label.json?search=' + encodedQuery;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const interactions = data.results[0].drug_interactions;
        if (interactions && interactions.length > 0) {
          setResult(interactions.join(" | "));
        } else {
          setResult("No drug interaction information found in the label.");
        }
      } else {
        setResult("No results found for these drugs.");
      }
    } catch (error) {
      console.error("Error fetching data from openFDA:", error);
      setResult("Error fetching data.");
    }
  };

  return (
    <div className="App">
      <h1>Drug Interaction Checker using openFDA</h1>
      <div>
        <input
          type="text"
          placeholder="Enter first drug"
          value={drug1}
          onChange={(e) => setDrug1(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter second drug"
          value={drug2}
          onChange={(e) => setDrug2(e.target.value)}
        />
      </div>
      <button onClick={handleCheckInteraction}>Check Interaction</button>
      <div style={{ marginTop: "20px" }}>
        {result && <p>{result}</p>}
      </div>
      <small>
        Disclaimer: Data is from openFDA drug labeling. Not all labels include detailed interaction information.
      </small>
    </div>
  );
};

export default DrugInteractionChecker;

import React, { useState } from 'react';
import './App.css';
import Step1Simulation from './components/Step1Simulation';
import Step2Extraction from './components/Step2Extraction';
import Step3PCR from './components/Step3PCR';
import Step4Sequencing from './components/Step4Sequencing';
import Step5Alignment from './components/Step5Alignment';
import Step6SamViewer from './components/Step6SamViewer';
import Step7CountMatrix from './components/Step7CountMatrix';
import Step8Normalization from './components/Step8Normalization';
import Step9DEA from './components/Step9DEA';

const steps = [
  { id: 1, title: 'Cell Simulation', description: 'Observe the two cells. The treated cell has more copies of Gene A (red) than the control cell. Gene B (green) is unchanged, and Gene C (yellow) has fewer copies in the treated cell.' },
  { id: 2, title: 'RNA Extraction', description: 'We burst the cell open and isolate the RNA into separate tubes.' },
  { id: 3, title: 'Library Prep & PCR', description: 'Adapters are added to the RNA sequences. PCR amplification produces millions of copies (represented here as x1000).' },
  { id: 4, title: 'Sequencing', description: 'The sequencer reads the fragments, generating a FastQ file. Notice we have lost the gene color—reads are now just unmarked strings of text.' },
  { id: 5, title: 'Alignment', description: 'We map the raw reads back to the reference genome to figure out which gene each read came from. Watch them regain their colors upon matching!' },
  { id: 6, title: 'SAM Output', description: 'The aligned reads are saved in a SAM format, restoring our knowledge of their origin.' },
  { id: 7, title: 'Raw Count Matrix', description: 'We sum up the reads mapping to each gene to create our raw count matrix.' },
  { id: 8, title: 'Normalization', description: 'We normalize the counts by the sequencing depth to make the samples comparable.' },
  { id: 9, title: 'Differential Expression', description: 'Finally, we compute the Log2 Fold Change to see which genes went up or down significantly.' }
];

function App() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const stepInfo = steps.find(s => s.id === currentStep);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>RNAseq Interactive Educational Pipeline</h1>
      </header>

      <main className="main-content">
        <aside className="pedagogy-panel">
          <div className="step-indicator">Step {currentStep} of {steps.length}</div>
          <h2>{stepInfo.title}</h2>
          <p>{stepInfo.description}</p>

          <div className="controls">
            <button onClick={handlePrev} disabled={currentStep === 1}>Previous</button>
            <button onClick={handleNext} disabled={currentStep === steps.length}>Next Step</button>
          </div>
        </aside>

        <section className="visualizer-area">
          {currentStep === 1 && <Step1Simulation />}
          {currentStep === 2 && <Step2Extraction />}
          {currentStep === 3 && <Step3PCR />}
          {currentStep === 4 && <Step4Sequencing />}
          {currentStep === 5 && <Step5Alignment />}
          {currentStep === 6 && <Step6SamViewer />}
          {currentStep === 7 && <Step7CountMatrix />}
          {currentStep === 8 && <Step8Normalization />}
          {currentStep === 9 && <Step9DEA />}
        </section>
      </main>
    </div>
  );
}

export default App;

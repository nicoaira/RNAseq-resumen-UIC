import React from 'react';
import './App.css';
import Step1Simulation from './components/Step1Simulation';
import Step2Extraction from './components/Step2Extraction';
import Step3RT from './components/Step3RT';
import Step3Adapters from './components/Step3Adapters';
import Step5PCR from './components/Step5PCR';
import Step4Sequencing from './components/Step4Sequencing';
import Step5Alignment from './components/Step5Alignment';
import Step6SamViewer from './components/Step6SamViewer';
import Step7CountMatrix from './components/Step7CountMatrix';
import Step8Normalization from './components/Step8Normalization';
import Step9DEA from './components/Step9DEA';

const steps = [
  { id: 1, title: 'Cell Simulation', component: <Step1Simulation />, connector: 'dual', description: 'Observe the two cells. The treated cell has more copies of Gene A (red) than the control cell. Gene B (green) is unchanged, and Gene C (yellow) has fewer copies in the treated cell.' },
  { id: 2, title: 'RNA Extraction', component: <Step2Extraction />, connector: 'dual', description: 'We burst the cell open and isolate the RNA into separate tubes.' },
  { id: 3, title: 'Reverse Transcription', component: <Step3RT />, connector: 'dual', description: 'Reverse transcriptase enzyme converts the extracted mRNA into stable double-stranded complementary DNA (cDNA) for sequencing.' },
  { id: 4, title: 'Addition of Adapters', component: <Step3Adapters />, connector: 'dual', description: 'Adapters are ligated to the ends of the cDNA fragments. These Illumina adapters contain regions for Flow cell binding, Indices for sample multiplexing, and Sequencing primer binding.' },
  { id: 5, title: 'PCR Amplification', component: <Step5PCR />, connector: 'dual', description: 'PCR amplification exponentially copies the cDNA libraries to produce millions of fragments (represented here as x1000), ensuring we have enough genetic material for the sequencer.' },
  { id: 6, title: 'Sequencing', component: <Step4Sequencing />, connector: 'dual', description: 'The sequencer reads the fragments, generating a FastQ file. Notice we have lost the gene color—reads are now just unmarked strings of text.' },
  { id: 7, title: 'Alignment', component: <Step5Alignment />, connector: 'dual', description: 'We map the raw reads back to the reference genome to figure out which gene each read came from. Watch them regain their colors upon matching!' },
  { id: 8, title: 'SAM Output', component: <Step6SamViewer />, connector: 'merge', description: 'The aligned reads are saved in a SAM format, restoring our knowledge of their origin.' },
  { id: 9, title: 'Raw Count Matrix', component: <Step7CountMatrix />, connector: 'single', description: 'We sum up the reads mapping to each gene to create our raw count matrix.' },
  { id: 10, title: 'Normalization', component: <Step8Normalization />, connector: 'single', description: 'We normalize the counts by the sequencing depth to make the samples comparable.' },
  { id: 11, title: 'Differential Expression', component: <Step9DEA />, connector: 'none', description: 'Finally, we compute the Log2 Fold Change to see which genes went up or down significantly.' }
];

function DualConnector() {
  return (
    <div className="connector-grid dual-grid">
      <div className="connector-col">
        <div className="vline control-line"></div>
        <div className="varrow">▼</div>
      </div>
      <div className="connector-col">
        <div className="vline treated-line"></div>
        <div className="varrow treated-arrow">▼</div>
      </div>
    </div>
  );
}

function MergeConnector() {
  return (
    <div className="connector-merge">
      <svg width="100%" height="80" preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 80">
        <path d="M 25 0 Q 25 40, 50 80" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 75 0 Q 75 40, 50 80" fill="none" stroke="var(--gene-a)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div className="varrow merge-arrow">▼</div>
    </div>
  );
}

function SingleConnector() {
  return (
    <div className="connector-grid single-grid">
      <div className="connector-col">
        <div className="vline control-line"></div>
        <div className="varrow">▼</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>RNAseq Interactive Educational Pipeline</h1>
        <p>Scroll down to follow the journey of RNA from the cell to differential expression analysis.</p>
      </header>

      <main className="scroll-content">
        {steps.map((step, index) => (
          <section key={step.id} className="pipeline-step">
            <div className="step-content">
              <div className="step-info">
                <div className="step-indicator">Step {step.id}</div>
                <h2>{step.title}</h2>
                <p>{step.description}</p>
              </div>

              <div className="step-visualizer">
                {step.component}
              </div>
            </div>

            {/* Connector between steps */}
            {index < steps.length - 1 && (
              <div className="step-connector-row">
                <div className="spacer-info"></div>
                <div className="connector-area">
                  {step.connector === 'dual' && <DualConnector />}
                  {step.connector === 'merge' && <MergeConnector />}
                  {step.connector === 'single' && <SingleConnector />}
                </div>
              </div>
            )}
          </section>
        ))}
      </main>
    </div>
  );
}

export default App;

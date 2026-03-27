import React, { useState } from 'react';
import './App.css';
import uicLogo from './assets/uic_logo.png';
import Step1Simulation from './components/Step1Simulation';
import Step2Extraction from './components/Step2Extraction';
import Step3RT from './components/Step3RT';
import Step3Adapters from './components/Step3Adapters';
import Step5PCR from './components/Step5PCR';
import Step4Sequencing from './components/Step4Sequencing';
import Step5Alignment from './components/Step5Alignment';
import Step7CountMatrix from './components/Step7CountMatrix';
import Step8Normalization from './components/Step8Normalization';
import Step9DEA from './components/Step9DEA';
import TPMNormalization from './components/TPMNormalization';

function ReplicateConnector() {
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
  const [mode, setMode] = useState('simplified'); // 'simplified', 'normalized', 'replicates', 'tpm'
  const goToTPMMode = () => {
    setMode('tpm');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [
    {
      id: 1,
      title: 'Specimens Simulation',
      component: <Step1Simulation mode={mode} />,
      connector: mode === 'replicates' ? 'replicates' : 'dual',
      description: mode === 'replicates'
        ? 'We use biological replicates (3 control specimens, 3 treated specimens) to account for natural variation within the same condition.'
        : 'Observe the two specimens. The treated specimen has more copies of Gene A (red) than the control specimen. Gene B (green) is unchanged, and Gene C (yellow) has fewer copies in the treated specimen.'
    },
    {
      id: 2,
      title: 'RNA Extraction',
      component: <Step2Extraction mode={mode} />,
      connector: mode === 'replicates' ? 'replicates' : 'dual',
      description: 'We burst the cells open and isolate the RNA into separate tubes.'
    },
    {
      id: 3,
      title: 'Reverse Transcription',
      component: <Step3RT mode={mode} />,
      connector: mode === 'replicates' ? 'replicates' : 'dual',
      description: 'Reverse transcriptase converts the mRNA into stable cDNA for sequencing.'
    },
    {
      id: 4,
      title: 'Addition of Adapters',
      component: <Step3Adapters mode={mode} />,
      connector: mode === 'replicates' ? 'replicates' : 'dual',
      description: 'Adapters are ligated to the ends of the cDNA fragments for Illumina sequencing.'
    },
    {
      id: 5,
      title: 'PCR Amplification',
      component: <Step5PCR mode={mode} />,
      connector: mode === 'replicates' ? 'replicates' : 'dual',
      description: 'PCR exponentially amplifies the library. Replicates will now have slightly different compositions due to both biological and technical noise.'
    },
    {
      id: 6,
      title: 'Sequencing',
      component: <Step4Sequencing mode={mode} />,
      connector: mode === 'replicates' ? 'replicates' : 'dual',
      description: mode === 'replicates'
        ? 'Each replicate is sequenced. Depth varies technically between flowcell lanes, adding another layer of complexity.'
        : (mode === 'normalized' ? 'Different sequencing depths (5,010 vs 2,507 reads) are generated due to technical variation on the flowcell.' : 'Idealized sequencing at equal depth.')
    },
    {
      id: 7,
      title: 'Alignment & Mapping',
      component: <Step5Alignment mode={mode} />,
      connector: 'merge',
      description: 'We map raw reads to the reference. For simplicity, we process them independently and aggregate counts.'
    },
    {
      id: 8,
      title: 'Raw Count Matrix',
      component: <Step7CountMatrix mode={mode} />,
      connector: 'single',
      description: mode === 'replicates'
        ? 'We now have a matrix with 6 columns. Notice the variability (Gene B is not exactly the same in Ctrl 1, 2, and 3!)'
        : 'We count reads per gene for each sample.'
    },
  ];

  if (mode !== 'simplified') {
    steps.push({
      id: 9,
      title: 'CPM Normalization',
      component: <Step8Normalization mode={mode} onGoToTPM={goToTPMMode} />,
      connector: 'single',
      description: 'We use CPM here as a first simplification because it is easier to understand, but CPM only corrects for sequencing depth and not gene length. Use the TPM button below to see the more complete normalization method.'
    });
  }

  steps.push({
    id: 10,
    title: 'Differential Expression',
    component: <Step9DEA mode={mode} />,
    connector: 'none',
    description: mode === 'replicates'
      ? 'Using 3 replicates per group allows us to calculate statistical significance (e.g. p-values) to ensure differences are not just random noise.'
      : 'Finally, we compute the Log2 Fold Change to identify up- and down-regulated genes.'
  });

  steps.forEach((s, i) => s.id = i + 1);

  return (
    <div className="app-container">
      <header className="app-header">
        <img src={uicLogo} alt="UIC logo" className="header-logo" />
        <h1>Pipeline RNAseq</h1>

        <div className="mode-tabs">
          <button
            className={`mode-btn ${mode === 'simplified' ? 'active-mode' : ''}`}
            onClick={() => setMode('simplified')}
          >
            Simplified (No Normalization)
          </button>
          <button
            className={`mode-btn ${mode === 'normalized' ? 'active-mode' : ''}`}
            onClick={() => setMode('normalized')}
          >
            Realistic (With Normalization)
          </button>
          <button
            className={`mode-btn ${mode === 'replicates' ? 'active-mode' : ''}`}
            onClick={() => setMode('replicates')}
          >
            With Replicates (Triplicates)
          </button>
          <button
            className={`mode-btn ${mode === 'tpm' ? 'active-mode' : ''}`}
            onClick={() => setMode('tpm')}
          >
            TPM Normalization Explained
          </button>
        </div>
      </header>

      <main className="scroll-content">
        {mode === 'tpm' ? (
          <section className="pipeline-step" style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
            <TPMNormalization />
          </section>
        ) : (
          steps.map((step, index) => (
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

              {index < steps.length - 1 && (
                <div className="step-connector-row">
                  <div className="spacer-info"></div>
                  <div className="connector-area">
                    {step.connector === 'dual' && <DualConnector />}
                    {step.connector === 'merge' && <MergeConnector />}
                    {step.connector === 'single' && <SingleConnector />}
                    {step.connector === 'replicates' && <ReplicateConnector />}
                  </div>
                </div>
              )}
            </section>
          ))
        )}
      </main>
    </div>
  );
}

export default App;

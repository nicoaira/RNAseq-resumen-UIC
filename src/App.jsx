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
import WhyRNAseq from './components/WhyRNAseq';
import DesignExperiment from './components/DesignExperiment';
import StepFastqQC from './components/StepFastqQC';
import Checkpoint from './components/Checkpoint';
import { getCheckpoint } from './data/checkpoints';

const MODES = ['why', 'design', 'simplified', 'normalized', 'replicates', 'tpm'];
const modeFromHash = () => {
  const h = window.location.hash.replace('#', '');
  return MODES.includes(h) ? h : 'why';
};

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
  const [mode, setModeState] = useState(modeFromHash); // 'why', 'design', 'simplified', 'normalized', 'replicates', 'tpm'
  const [classMode, setClassMode] = useState(false);
  // Keep the current tab in the URL (#why, #design, ...) so the teacher can open a view directly
  const setMode = m => {
    setModeState(m);
    window.history.replaceState(null, '', `#${m}`);
  };
  const goToTPMMode = () => {
    setMode('tpm');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [
    {
      id: 1,
      key: 'specimens',
      title: 'Specimens Simulation',
      component: <Step1Simulation mode={mode} />,
      connector: mode === 'replicates' ? 'replicates' : 'dual',
      description: mode === 'replicates'
        ? 'We use biological replicates (3 control specimens, 3 treated specimens) to account for natural variation within the same condition.'
        : 'Observe the two specimens. The treated specimen has more copies of Gene A (red) than the control specimen. Gene B (green) is unchanged, and Gene C (yellow) has fewer copies in the treated specimen.'
    },
    {
      id: 2,
      key: 'extraction',
      title: 'RNA Extraction',
      component: <Step2Extraction mode={mode} />,
      connector: mode === 'replicates' ? 'replicates' : 'dual',
      description: 'We burst the cells open and isolate the RNA into separate tubes.'
    },
    {
      id: 3,
      key: 'rt',
      title: 'Reverse Transcription',
      component: <Step3RT mode={mode} />,
      connector: mode === 'replicates' ? 'replicates' : 'dual',
      description: 'Reverse transcriptase converts the mRNA into stable cDNA for sequencing.'
    },
    {
      id: 4,
      key: 'adapters',
      title: 'Addition of Adapters',
      component: <Step3Adapters mode={mode} />,
      connector: mode === 'replicates' ? 'replicates' : 'dual',
      description: 'Adapters are ligated to the ends of the cDNA fragments for Illumina sequencing.'
    },
    {
      id: 5,
      key: 'pcr',
      title: 'PCR Amplification',
      component: <Step5PCR mode={mode} />,
      connector: mode === 'replicates' ? 'replicates' : 'dual',
      description: 'PCR exponentially amplifies the library. Replicates will now have slightly different compositions due to both biological and technical noise.'
    },
    {
      id: 6,
      key: 'sequencing',
      title: 'Sequencing',
      component: <Step4Sequencing mode={mode} />,
      connector: mode === 'replicates' ? 'replicates' : 'dual',
      description: mode === 'replicates'
        ? 'Each replicate is sequenced. Depth varies technically between flowcell lanes, adding another layer of complexity.'
        : (mode === 'normalized' ? 'Different sequencing depths (5,010 vs 2,507 reads) are generated due to technical variation on the flowcell.' : 'Idealized sequencing at equal depth.')
    },
    {
      id: 7,
      key: 'fastq',
      title: 'FASTQ & Quality',
      component: <StepFastqQC mode={mode} />,
      connector: 'dual',
      description: 'The sequencer writes each read as 4 lines in a FASTQ file. Every base gets a quality score: how sure the machine is about it. Click a quality character to decode it, then judge three files.'
    },
    {
      id: 7,
      key: 'alignment',
      title: 'Alignment & Mapping',
      component: <Step5Alignment mode={mode} />,
      connector: 'merge',
      description: 'We map raw reads to the reference. For simplicity, we process them independently and aggregate counts.',
      extra: (
        <details className="step-extra-note">
          <summary>Alignment or pseudo-alignment?</summary>
          <p>
            Aligners such as STAR place every read base by base on the genome, including reads that jump across exon junctions.
            Pseudo-aligners such as Salmon only check which transcripts a read is compatible with, which is much faster.
            Some reads fit several genes equally well (multi-mapping reads): tools either drop them or share them out by probability.
          </p>
        </details>
      )
    },
    {
      id: 8,
      key: 'counts',
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
      key: 'cpm',
      title: 'CPM Normalization',
      component: <Step8Normalization mode={mode} onGoToTPM={goToTPMMode} />,
      connector: 'single',
      description: 'We use CPM here as a first simplification because it is easier to understand, but CPM only corrects for sequencing depth and not gene length. Use the TPM button below to see the more complete normalization method.'
    });
  }

  steps.push({
    id: 10,
    key: 'de',
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
        <div className="header-brand">
          <img src={uicLogo} alt="UIC logo" className="header-logo" />
          <h1>Pipeline RNAseq</h1>
          <div className="header-class-tabs">
            <button
              className={`mode-btn ${mode === 'why' ? 'active-mode' : ''}`}
              onClick={() => setMode('why')}
            >
              Why RNA-seq?
            </button>
            <button
              className={`mode-btn ${mode === 'design' ? 'active-mode' : ''}`}
              onClick={() => setMode('design')}
            >
              Design your experiment
            </button>
            <button
              type="button"
              className={`class-mode-toggle ${classMode ? 'on' : ''}`}
              onClick={() => setClassMode(!classMode)}
              aria-pressed={classMode}
              title="Show 'Predict first' questions for the class"
            >
              <span className="switch-track"><span className="switch-thumb"></span></span>
              Class mode
            </button>
          </div>
        </div>

        <div className="mode-tabs">
          <div className="mode-tabs-primary">
            <button
              className={`mode-btn ${mode === 'simplified' ? 'active-mode' : ''}`}
              onClick={() => setMode('simplified')}
            >
              Simplified (one sample, no normalization)
            </button>
            <button
              className={`mode-btn ${mode === 'normalized' ? 'active-mode' : ''}`}
              onClick={() => setMode('normalized')}
            >
              With normalization
            </button>
            <button
              className={`mode-btn ${mode === 'replicates' ? 'active-mode' : ''}`}
              onClick={() => setMode('replicates')}
            >
              With replicates (Realistic)
            </button>
          </div>

          <div className="mode-tabs-secondary">
            <button
              className={`mode-btn ${mode === 'tpm' ? 'active-mode' : ''}`}
              onClick={() => setMode('tpm')}
            >
              TPM Normalization Explained
            </button>
          </div>
        </div>
      </header>

      <main className="scroll-content">
        {mode === 'why' ? (
          <WhyRNAseq />
        ) : mode === 'design' ? (
          <DesignExperiment classMode={classMode} />
        ) : mode === 'tpm' ? (
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
                  {step.extra}
                  {classMode && getCheckpoint(step.key, mode) && (
                    <Checkpoint
                      key={`${mode}-${step.key}`}
                      question={getCheckpoint(step.key, mode).question}
                      answer={getCheckpoint(step.key, mode).answer}
                    />
                  )}
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

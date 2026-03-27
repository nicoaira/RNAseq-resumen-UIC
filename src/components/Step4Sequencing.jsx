import React, { useState } from 'react';
import './Step4Sequencing.css';
import sequencerImg from '../assets/sequencer.png';
import {
    CONTROL_STD, TREATED_STD, TREATED_NORMALIZED,
    CONTROL_REPLICATES, TREATED_REPLICATES,
} from '../data/reads';

const FastqBlock = ({ reads, repNum, onNext, onPrev, isReplicates, totalReads }) => {
    return (
        <div className="fastq-item">
            {isReplicates && (
                <div className="rep-nav">
                    <button onClick={onPrev} className="nav-btn">←</button>
                    <span className="rep-indicator">Replicate {repNum}</span>
                    <button onClick={onNext} className="nav-btn">→</button>
                </div>
            )}
            <div className="fastq-file">
                {reads.map((read, i) => (
                    <div key={i} className="fastq-entry">
                        <div className="fq-id">@{read.name}:1:N:0:1</div>
                        <div className="fq-seq" style={{ color: read.isOther ? 'var(--text-muted)' : 'inherit', opacity: read.isOther ? 0.6 : 1 }}>
                            {read.seq}
                        </div>
                        <div className="fq-plus">+</div>
                        <div className="fq-qual">{Array(read.seq.length).fill('H').join('')}</div>
                    </div>
                ))}
            </div>
            <div className="fastq-total-reads">
                Total reads: <span className="fastq-total-count">{totalReads.toLocaleString()}</span>
            </div>
        </div>
    );
};

const ConditionBox = ({ title, children }) => {
    return (
        <div className="condition-panel">
            <div className="condition-header">{title}</div>
            <div className="condition-content">
                {children}
            </div>
        </div>
    );
};

export default function Step4Sequencing({ mode }) {
    const [stage, setStage] = useState(0); // 0: start, 1: sequencing, 2: complete, 3: fastqs
    const [ctrlIdx, setCtrlIdx] = useState(0);
    const [treatedIdx, setTreatedIdx] = useState(0);

    const isRealistic = mode === 'normalized';
    const isReplicates = mode === 'replicates';

    const handleStart = () => {
        setStage(1);
        setTimeout(() => setStage(2), 2000);
    };

    const toFastq = reads => reads.map(r => ({ name: r.id, seq: r.seq, isOther: !r.targetRef }));

    const nextCtrl = () => setCtrlIdx((ctrlIdx + 1) % 3);
    const prevCtrl = () => setCtrlIdx((ctrlIdx + 2) % 3);
    const nextTreated = () => setTreatedIdx((treatedIdx + 1) % 3);
    const prevTreated = () => setTreatedIdx((treatedIdx + 2) % 3);

    if (stage < 3) {
        return (
            <div className="step-container">
                <div className="sequencer-animation-area">
                    <img src={sequencerImg} alt="DNA Sequencer" className={`sequencer-img ${stage === 1 ? 'processing' : ''}`} />
                    <div className="sequencer-controls">
                        {stage === 0 && <button className="action-button" onClick={handleStart}>Start Sequencing</button>}
                        {stage === 1 && <div className="sequencer-status">Sequencing...</div>}
                        {stage === 2 && <button className="action-button success-btn" onClick={() => setStage(3)}>Get Results</button>}
                    </div>
                </div>
            </div>
        );
    }

    const currentCtrlReads = toFastq(isReplicates ? CONTROL_REPLICATES[ctrlIdx] : CONTROL_STD);
    const currentTreatedReads = toFastq(isReplicates ? TREATED_REPLICATES[treatedIdx] : (isRealistic ? TREATED_NORMALIZED : TREATED_STD));

    const readsPerRep = (reads, repIdx) => reads.length * 487 + [141, 263, 89][repIdx % 3];
    const ctrlTotal = readsPerRep(currentCtrlReads, ctrlIdx);
    const treatedTotal = readsPerRep(currentTreatedReads, treatedIdx);

    return (
        <div className="step-container replicates-step">
            <div className="fastq-area">
                <ConditionBox title="Control FastQ">
                    <FastqBlock
                        reads={currentCtrlReads}
                        repNum={ctrlIdx + 1}
                        onNext={nextCtrl}
                        onPrev={prevCtrl}
                        isReplicates={isReplicates}
                        totalReads={ctrlTotal}
                    />
                </ConditionBox>
                <ConditionBox title="Treated FastQ">
                    <FastqBlock
                        reads={currentTreatedReads}
                        repNum={treatedIdx + 1}
                        onNext={nextTreated}
                        onPrev={prevTreated}
                        isReplicates={isReplicates}
                        totalReads={treatedTotal}
                    />
                </ConditionBox>
            </div>
            {isReplicates && (
                <div className="info-box">
                    <strong>Note:</strong> Each FASTQ file contains a number of reads proportional to the original mRNA copies.
                </div>
            )}
        </div>
    );
}

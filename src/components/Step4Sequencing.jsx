import React, { useState } from 'react';
import './Step4Sequencing.css';
import sequencerImg from '../assets/sequencer.png';

const FastqBlock = ({ title, reads }) => {
    return (
        <div className="fastq-container">
            <h3>{title}</h3>
            <div className="fastq-file">
                {reads.map((read, i) => (
                    <div key={i} className="fastq-entry">
                        <div className="fq-id">@{read.name}:1:N:0:1</div>
                        <div className="fq-seq">{read.seq}</div>
                        <div className="fq-plus">+</div>
                        <div className="fq-qual">{Array(read.seq.length).fill('H').join('')}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function Step4Sequencing() {
    const [stage, setStage] = useState(0); // 0: start, 1: sequencing, 2: complete, 3: fastqs

    const handleStart = () => {
        setStage(1);
        setTimeout(() => setStage(2), 3000);
    };

    // These must match Step5 alignment reads exactly
    const controlReads = [
        { name: 'CTRL_7', seq: 'GGCCTAA' },
        { name: 'CTRL_3', seq: 'ACTTGAC' },
        { name: 'CTRL_9', seq: 'CCGAATG' },
        { name: 'CTRL_5', seq: 'GATCGAG' },
        { name: 'CTRL_10', seq: 'AATGCTT' },
        { name: 'CTRL_2', seq: 'GTACTTG' },
        { name: 'CTRL_8', seq: 'TAATCCG' },
        { name: 'CTRL_6', seq: 'GAGCCTT' },
        { name: 'CTRL_4', seq: 'TACGATC' },
    ];

    const treatedReads = [
        { name: 'TREAT_12', seq: 'TGCGTAC' },
        { name: 'TREAT_10', seq: 'GGCCTAA' },
        { name: 'TREAT_2', seq: 'TGCGTAC' },
        { name: 'TREAT_7', seq: 'TACGATC' },
        { name: 'TREAT_5', seq: 'ACTTGAC' },
        { name: 'TREAT_11', seq: 'GAATGCT' },
        { name: 'TREAT_1', seq: 'ATGCGTA' },
        { name: 'TREAT_13', seq: 'ACTTGAC' },
        { name: 'TREAT_8', seq: 'TCGAGCC' },
        { name: 'TREAT_4', seq: 'GTACTTG' },
        { name: 'TREAT_9', seq: 'AGCCTTA' },
        { name: 'TREAT_6', seq: 'ATGCGTA' },
        { name: 'TREAT_3', seq: 'CGTACTT' },
    ];

    return (
        <div className="step-container">
            {stage < 3 ? (
                <div className="sequencer-animation-area">
                    <img
                        src={sequencerImg}
                        alt="DNA Sequencer"
                        className={`sequencer-img ${stage === 1 ? 'processing' : ''}`}
                    />

                    <div className="sequencer-controls">
                        {stage === 0 && (
                            <button className="action-button" onClick={handleStart}>
                                Start Sequencing
                            </button>
                        )}
                        {stage === 1 && (
                            <div className="sequencer-status processing-text">
                                Sequencing in progress... Machine is reading bases.
                            </div>
                        )}
                        {stage === 2 && (
                            <div className="sequencer-completed-area">
                                <div className="sequencer-status success-text">
                                    Sequencing Complete!
                                </div>
                                <button className="action-button success-btn" onClick={() => setStage(3)}>
                                    Get Results
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    <div className="fastq-area">
                        <FastqBlock title="Control FastQ" reads={controlReads} />
                        <FastqBlock title="Treated FastQ" reads={treatedReads} />
                    </div>

                    <div className="info-box sequencer-info-box">
                        <strong>Observation:</strong> The sequencing reads are uncolored — just plain A, T, C, G text. The sequencer cannot tell which gene these short fragments came from. We have lost spatial and color information!
                    </div>
                </>
            )}
        </div>
    );
}

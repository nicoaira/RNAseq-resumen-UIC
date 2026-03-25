import React from 'react';
import './Step4Sequencing.css';

const FastqBlock = ({ title, reads }) => {
    return (
        <div className="fastq-container">
            <h3>{title}</h3>
            <div className="fastq-file">
                {reads.map((read, i) => (
                    <div key={i} className="fastq-entry">
                        <div className="fq-id">@SEQ_MOCK_{i + 1}_1:N:0:1</div>
                        <div className="fq-seq">{read}</div>
                        <div className="fq-plus">+</div>
                        <div className="fq-qual">{Array(read.length).fill('H').join('')}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function Step4Sequencing() {
    const controlReads = [
        "ATGCGTAC", "TACGATCG", "GGCCTAAT", "TTAACCGG", "CCGGAAAT"
    ];

    const treatedReads = [
        "ATGCGTAC", "ATGCGTAC", "GGCCTAAT", "CCGGAATT", "TACGATCG", "ATGCGTAC"
    ];

    return (
        <div className="step-container">

            <div className="fastq-area">
                <FastqBlock title="Control FastQ" reads={controlReads} />
                <FastqBlock title="Treated FastQ" reads={treatedReads} />
            </div>

            <div className="info-box">
                <strong>Observation:</strong> The sequencing reads are uncolored standard text (A, T, C, G). The sequencer cannot tell which gene (A, B, or C) these short fragments originated from. We have lost spatial and color information!
            </div>

        </div>
    );
}

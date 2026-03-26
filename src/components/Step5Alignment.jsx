import React, { useState } from 'react';
import './Step5Alignment.css';

// Gene references with different lengths
const REFERENCES = [
    { id: 'A', seq: 'ATGCGTACTTGACTAG', color: 'var(--gene-a)' },
    { id: 'B', seq: 'TACGATCGAGCCTTATGC', color: 'var(--gene-b)' },
    { id: 'C', seq: 'GGCCTAATCCGAATGCTTCA', color: 'var(--gene-c)' },
];

// Read length = 6bp, offset = position on reference (0-indexed)
const CONTROL_READS = [
    { id: 'c7', seq: 'GGCCTAA', targetRef: 'C', offset: 0, delay: 300 },
    { id: 'c3', seq: 'ACTTGAC', targetRef: 'A', offset: 6, delay: 600 },
    { id: 'c9', seq: 'CCGAATG', targetRef: 'C', offset: 8, delay: 900 },
    { id: 'c5', seq: 'GATCGAG', targetRef: 'B', offset: 3, delay: 1500 },
    { id: 'c10', seq: 'AATGCTT', targetRef: 'C', offset: 11, delay: 1800 },
    { id: 'c2', seq: 'GTACTTG', targetRef: 'A', offset: 4, delay: 2100 },
    { id: 'c8', seq: 'TAATCCG', targetRef: 'C', offset: 4, delay: 2400 },
    { id: 'c6', seq: 'GAGCCTT', targetRef: 'B', offset: 7, delay: 2700 },
    { id: 'c4', seq: 'TACGATC', targetRef: 'B', offset: 0, delay: 3000 },
];

const TREATED_READS = [
    { id: 't12', seq: 'TGCGTAC', targetRef: 'A', offset: 1, delay: 100 },
    { id: 't10', seq: 'GGCCTAA', targetRef: 'C', offset: 0, delay: 300 },
    { id: 't2', seq: 'TGCGTAC', targetRef: 'A', offset: 1, delay: 600 },
    { id: 't7', seq: 'TACGATC', targetRef: 'B', offset: 0, delay: 900 },
    { id: 't5', seq: 'ACTTGAC', targetRef: 'A', offset: 6, delay: 1200 },
    { id: 't11', seq: 'GAATGCT', targetRef: 'C', offset: 10, delay: 1500 },
    { id: 't1', seq: 'ATGCGTA', targetRef: 'A', offset: 0, delay: 1800 },
    { id: 't13', seq: 'ACTTGAC', targetRef: 'A', offset: 6, delay: 1950 },
    { id: 't8', seq: 'TCGAGCC', targetRef: 'B', offset: 5, delay: 2100 },
    { id: 't4', seq: 'GTACTTG', targetRef: 'A', offset: 4, delay: 2400 },
    { id: 't9', seq: 'AGCCTTA', targetRef: 'B', offset: 8, delay: 2700 },
    { id: 't6', seq: 'ATGCGTA', targetRef: 'A', offset: 0, delay: 3000 },
    { id: 't3', seq: 'CGTACTT', targetRef: 'A', offset: 3, delay: 3300 },
];

// Char width for monospace positioning (in ch units)
const CHAR_W = 1;

function AlignmentPanel({ title, reads, isTreated }) {
    const [alignedReads, setAlignedReads] = useState([]);
    const [started, setStarted] = useState(false);

    const startAlignment = () => {
        setStarted(true);
        setAlignedReads([]);
        reads.forEach(read => {
            setTimeout(() => {
                setAlignedReads(prev => [...prev, read]);
            }, read.delay);
        });
    };

    const totalAligned = alignedReads.length;
    const done = totalAligned === reads.length;

    return (
        <div className={`alignment-panel ${isTreated ? 'treated-panel' : 'control-panel'}`}>
            <h3>{title}</h3>

            <button className="align-btn" onClick={startAlignment} disabled={started && !done}>
                {!started ? 'Align' : done ? '✓ Done' : `Aligning... (${totalAligned}/${reads.length})`}
            </button>

            <div className="ref-and-pool">
                <div className="reference-genome">
                    <div className="ref-title">Reference Transcripts</div>
                    {REFERENCES.map(ref => {
                        const matched = alignedReads.filter(r => r.targetRef === ref.id);
                        return (
                            <div key={ref.id} className="reference-track">
                                <div className="ref-name" style={{ color: ref.color }}>Gene {ref.id}</div>
                                <div className="ref-seq-wrapper">
                                    <div className="ref-seq" style={{ borderColor: ref.color }}>{ref.seq}</div>
                                    <div className="mapped-reads-area">
                                        {matched.map((r, i) => (
                                            <div
                                                key={`${r.id}-${i}`}
                                                className="mapped-read"
                                                style={{
                                                    backgroundColor: ref.color,
                                                    marginLeft: `${r.offset * CHAR_W}ch`,
                                                }}
                                            >
                                                {r.seq}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="fastq-pool">
                    <div className="pool-title">Unmapped</div>
                    <div className="pool-list">
                        {reads.map(r => {
                            const isAligned = alignedReads.find(ar => ar.id === r.id);
                            return (
                                <div key={r.id} className={`pool-read ${isAligned ? 'hidden' : ''}`}>
                                    {r.seq}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {done && (
                <div className="align-summary">
                    {REFERENCES.map(ref => {
                        const count = alignedReads.filter(r => r.targetRef === ref.id).length;
                        return (
                            <div key={ref.id} className="summary-row">
                                <span className="summary-dot" style={{ backgroundColor: ref.color }}></span>
                                Gene {ref.id}: <strong>{count}</strong> reads
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function Step5Alignment() {
    return (
        <div className="step-container">
            <div className="dual-alignment">
                <AlignmentPanel title="Control Alignment" reads={CONTROL_READS} isTreated={false} />
                <AlignmentPanel title="Treated Alignment" reads={TREATED_READS} isTreated={true} />
            </div>
        </div>
    );
}

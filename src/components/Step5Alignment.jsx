import React, { useState, useEffect } from 'react';
import './Step5Alignment.css';

const REFERENCES = [
    { id: 'A', seq: 'ATGCGTAC', color: 'var(--gene-a)' },
    { id: 'B', seq: 'TACGATCG', color: 'var(--gene-b)' },
    { id: 'C', seq: 'GGCCTAAT', color: 'var(--gene-c)' },
];

const READS_POOL = [
    { id: 1, seq: 'ATGCGTAC', targetRef: 'A', delay: 500 },
    { id: 2, seq: 'TACGATCG', targetRef: 'B', delay: 1500 },
    { id: 3, seq: 'GGCCTAAT', targetRef: 'C', delay: 2500 },
    { id: 4, seq: 'ATGCGTAC', targetRef: 'A', delay: 3500 },
    { id: 5, seq: 'GGCCTAAT', targetRef: 'C', delay: 4500 },
];

export default function Step5Alignment() {
    const [alignedReads, setAlignedReads] = useState([]);
    const [started, setStarted] = useState(false);

    const startAlignment = () => {
        setStarted(true);
        setAlignedReads([]);

        READS_POOL.forEach(read => {
            setTimeout(() => {
                setAlignedReads(prev => [...prev, read]);
            }, read.delay);
        });
    };

    return (
        <div className="step-container">
            <div className="alignment-header">
                <p>Reads from the FastQ are mapped against the Reference Genome. Watch them find their matches.</p>
                <button onClick={startAlignment} disabled={started && alignedReads.length < READS_POOL.length}>
                    {started ? 'Aligning...' : 'Start Alignment Animation'}
                </button>
            </div>

            <div className="alignment-area">
                <div className="reference-genome">
                    <h3>Reference Genome</h3>
                    {REFERENCES.map(ref => (
                        <div key={ref.id} className="reference-track">
                            <div className="ref-name" style={{ color: ref.color }}>Gene {ref.id}</div>
                            <div className="ref-seq" style={{ borderColor: ref.color }}>{ref.seq}</div>

                            <div className="mapped-reads-area">
                                {alignedReads.filter(r => r.targetRef === ref.id).map((r, i) => (
                                    <div
                                        key={`${r.id}-${i}`}
                                        className="mapped-read"
                                        style={{ backgroundColor: ref.color, animationDelay: '0s' }}
                                    >
                                        {r.seq}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="fastq-pool">
                    <h3>Unmapped Reads</h3>
                    <div className="pool-container">
                        {READS_POOL.map(r => {
                            const isAligned = alignedReads.find(ar => ar.id === r.id);
                            return (
                                <div
                                    key={r.id}
                                    className={`pool-read ${isAligned ? 'hidden' : ''}`}
                                >
                                    {r.seq}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

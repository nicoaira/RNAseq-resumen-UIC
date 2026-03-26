import React from 'react';
import './StepMatrix.css';

export default function Step9DEA() {
    const data = [
        { gene: 'Gene A', color: 'var(--gene-a)', log2fc: 1.47, rawLabel: 'Up-regulated' },
        { gene: 'Gene B', color: 'var(--gene-b)', log2fc: -0.53, rawLabel: 'Unchanged' },
        { gene: 'Gene C', color: 'var(--gene-c)', log2fc: -1.53, rawLabel: 'Down-regulated' },
    ];

    return (
        <div className="step-container">
            <div className="matrix-area">
                <h3>Differential Expression (Log2 Fold Change)</h3>

                <div className="bar-chart">
                    {data.map(d => (
                        <div key={d.gene} className="bar-row">
                            <div className="bar-label">
                                <span className="gene-dot" style={{ backgroundColor: d.color }}></span> {d.gene}
                            </div>

                            <div className="bar-track">
                                {/* Center line */}
                                <div className="center-line"></div>

                                {/* Bar */}
                                {d.log2fc >= 0 ? (
                                    <div className="bar positive" style={{ width: `${Math.abs(d.log2fc) * 40}%`, backgroundColor: d.color }}>
                                        <span className="bar-value">+{d.log2fc}</span>
                                    </div>
                                ) : (
                                    <div className="bar negative" style={{ width: `${Math.abs(d.log2fc) * 40}%`, right: '50%', backgroundColor: d.color }}>
                                        <span className="bar-value">{d.log2fc}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="info-box success">
                <strong>Conclusion:</strong>
                Gene A is Up-regulated, Gene C is Down-regulated, and Gene B's apparent changes were mostly noise from composition bias!
            </div>
        </div>
    );
}

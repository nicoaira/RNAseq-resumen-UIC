import React, { useState } from 'react';
import './Step3Adapters.css';

export default function Step3Adapters() {
    const [stage, setStage] = useState(0);

    const startAnimation = () => {
        if (stage > 0) return;
        setStage(1);
        setTimeout(() => setStage(2), 1500);
    };

    const resetAnimation = () => {
        setStage(0);
    };

    return (
        <div className="step-container">
            <div className="adapters-header">
                <button
                    className="action-button"
                    onClick={startAnimation}
                    disabled={stage > 0}
                >
                    {stage === 0 ? "Add Adapters" : (stage === 1 ? "Adding..." : "Adapters Added")}
                </button>
                {stage >= 2 && (
                    <button
                        className="reset-button"
                        onClick={resetAnimation}
                    >
                        Reset Animation
                    </button>
                )}
            </div>

            <div className="adapters-status">
                {stage === 0 && "Target Molecule (cDNA fragment)"}
                {stage === 1 && "Adding Illumina Adapters..."}
                {stage >= 2 && "Adapters Ligated!"}
            </div>

            <div className="adapters-animation-area">
                <div className="molecules-container">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="molecule-wrap">
                            {/* Left Adapter */}
                            <div
                                className={`adapter left-adapter ${stage >= 1 ? 'animate-in' : ''} ${stage >= 2 ? 'attached' : ''}`}
                                style={{ transitionDelay: `${i * 0.15}s` }}
                            >
                                <div className="adapter-part flow-cell-p5" title="P5 Flow Cell Binding"></div>
                                <div className="adapter-part index-i5" title="i5 Index"></div>
                                <div className="adapter-part seq-primer-1" title="Read 1 Sequencing Primer Binding"></div>
                            </div>

                            {/* Target cDNA */}
                            <div className="target-cdna">
                                cDNA
                            </div>

                            {/* Right Adapter */}
                            <div
                                className={`adapter right-adapter ${stage >= 1 ? 'animate-in' : ''} ${stage >= 2 ? 'attached' : ''}`}
                                style={{ transitionDelay: `${i * 0.15}s` }}
                            >
                                <div className="adapter-part seq-primer-2" title="Read 2 Sequencing Primer Binding"></div>
                                <div className="adapter-part index-i7" title="i7 Index"></div>
                                <div className="adapter-part flow-cell-p7" title="P7 Flow Cell Binding"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="adapters-legend">
                <div className="legend-item">
                    <div className="color-box flow-cell"></div>
                    <span>Flow Cell Binding (P5/P7)</span>
                </div>
                <div className="legend-item">
                    <div className="color-box index"></div>
                    <span>Indices (i5/i7)</span>
                </div>
                <div className="legend-item">
                    <div className="color-box seq-primer"></div>
                    <span>Sequencing Primer Binding (Read 1/Read 2)</span>
                </div>
            </div>
        </div>
    );
}

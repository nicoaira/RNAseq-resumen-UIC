import React, { useEffect, useState } from 'react';
import './Step3PCR.css';

const RnaWithAdapters = ({ color, id, x, y, size = "normal" }) => {
    return (
        <svg
            className={`rna-strand-pcr scale-${size}`}
            width="40"
            height="40"
            viewBox="0 0 100 100"
            style={{ left: `${x}%`, top: `${y}%` }}
            title={`Gene ${id}`}
        >
            {/* Adapters */}
            <rect x="0" y="45" width="10" height="10" fill="#a855f7" />
            <rect x="90" y="45" width="10" height="10" fill="#a855f7" />

            {/* RNA Strand */}
            <path
                d="M 10 50 Q 25 20, 50 50 T 90 50"
                stroke={color}
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
            />
        </svg>
    );
};

const PCRTube = ({ title, results, showAdapters }) => {
    return (
        <div className="pcr-tube-container">
            <h3>{title}</h3>
            <div className="pcr-tube">
                <div className="pcr-liquid"></div>
                <div className="pcr-genes">
                    <RnaWithAdapters color="var(--gene-a)" id="A" x={30} y={40} />
                    <RnaWithAdapters color="var(--gene-b)" id="B" x={70} y={60} />
                    <RnaWithAdapters color="var(--gene-c)" id="C" x={50} y={80} />
                </div>

                {showAdapters && (
                    <div className="pcr-legend-overlay">
                        <div className="pcr-legend-title">PCR Product (x1000)</div>
                        {results.map(r => (
                            <div key={r.id} className="pcr-legend-row">
                                <span className="pcr-legend-color" style={{ backgroundColor: r.color }}></span>
                                <span>Gene {r.id}: {r.count} copies</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Step3PCR() {
    const [stage, setStage] = useState(0); // 0: initial, 1: adapters added, 2: PCR amplified

    useEffect(() => {
        const t1 = setTimeout(() => setStage(1), 1000);
        const t2 = setTimeout(() => setStage(2), 2500);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    const controlResults = [
        { id: 'A', color: 'var(--gene-a)', count: 3000 },
        { id: 'B', color: 'var(--gene-b)', count: 3000 },
        { id: 'C', color: 'var(--gene-c)', count: 4000 },
    ];

    const treatedResults = [
        { id: 'A', color: 'var(--gene-a)', count: 6000 },
        { id: 'B', color: 'var(--gene-b)', count: 3000 },
        { id: 'C', color: 'var(--gene-c)', count: 2000 },
    ];

    return (
        <div className="step-container">

            <div className="pcr-status">
                {stage === 0 && "Preparing RNA..."}
                {stage === 1 && "Ligating Adapters (purple caps)..."}
                {stage === 2 && "PCR Amplification Complete!"}
            </div>

            <div className="pcr-area">
                <PCRTube title="Control Library" results={controlResults} showAdapters={stage >= 2} />
                <PCRTube title="Treated Library" results={treatedResults} showAdapters={stage >= 2} />
            </div>

            <div className="adapter-legend">
                <div className="adapter-box"></div> = Sequencing Adapters
            </div>
        </div>
    );
}

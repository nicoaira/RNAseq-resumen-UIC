import React, { useEffect, useState, useMemo } from 'react';
import './Step5PCR.css';

const CdnaWithAdapters = ({ color, id, x, y, size = "normal" }) => {
    return (
        <svg
            className={`cdna-strand-pcr scale-${size}`}
            width="30"
            height="30"
            viewBox="0 0 100 100"
            style={{ left: `${x}%`, top: `${y}%` }}
            title={`Gene ${id}`}
        >
            {/* Adapters */}
            <rect x="0" y="45" width="10" height="10" fill="#a855f7" />
            <rect x="90" y="45" width="10" height="10" fill="#a855f7" />

            {/* cDNA Strand */}
            <line
                x1="10" y1="50" x2="90" y2="50"
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
            />
        </svg>
    );
};

// Seeded pseudo-random for stable positions
function seededRandom(seed) {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

const PCRTube = ({ title, results, isAmplified }) => {
    // Stable gene placement
    const displayGenes = useMemo(() => {
        const arr = [];
        const rng = seededRandom(title.length * 42); // specific seed for each tube
        results.forEach((r) => {
            const originalCount = r.count / 1000;
            // 4x when amplified, otherwise 1x
            const num = isAmplified ? originalCount * 4 : originalCount;
            for (let j = 0; j < num; j++) {
                arr.push({
                    id: r.id,
                    color: r.color,
                    x: 15 + rng() * 70, // 15% to 85% width
                    y: 25 + rng() * 70, // 25% to 95% height (liquid area)
                    key: `${r.id}-${j}`
                });
            }
        });
        return arr;
    }, [results, isAmplified, title]);

    return (
        <div className="pcr-tube-container">
            <h3>{title}</h3>
            <div className="pcr-tube-row">
                <div className="pcr-tube">
                    <div className="pcr-liquid"></div>
                    <div className="pcr-genes">
                        {displayGenes.map((g) => (
                            <CdnaWithAdapters key={g.key} color={g.color} id={g.id} x={g.x} y={g.y} />
                        ))}
                    </div>
                </div>

                {isAmplified && (
                    <div className="pcr-legend-side">
                        <div className="pcr-legend-title">PCR Product<br />(x1000)</div>
                        <div className="pcr-legend-items">
                            {results.map(r => (
                                <div key={r.id} className="pcr-legend-row">
                                    <span className="pcr-legend-color" style={{ backgroundColor: r.color }}></span>
                                    <div className="pcr-legend-text">
                                        <div>Gene {r.id}:</div>
                                        <div>{r.count} copies</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Step5PCR() {
    const [stage, setStage] = useState(0);

    useEffect(() => {
        const t1 = setTimeout(() => setStage(1), 1500);
        return () => clearTimeout(t1);
    }, []);

    const controlResults = [
        { id: 'A', color: 'var(--gene-a)', count: 2000 },
        { id: 'B', color: 'var(--gene-b)', count: 3000 },
        { id: 'C', color: 'var(--gene-c)', count: 4000 },
    ];

    const treatedResults = [
        { id: 'A', color: 'var(--gene-a)', count: 8000 },
        { id: 'B', color: 'var(--gene-b)', count: 3000 },
        { id: 'C', color: 'var(--gene-c)', count: 2000 },
    ];

    return (
        <div className="step-container">
            <div className="pcr-status">
                {stage === 0 ? "Preparing Library for PCR..." : "PCR Amplification Complete!"}
            </div>

            <div className="pcr-area">
                <PCRTube title="Control Library" results={controlResults} isAmplified={stage >= 1} />
                <PCRTube title="Treated Library" results={treatedResults} isAmplified={stage >= 1} />
            </div>

            <div className="adapter-legend">
                <div className="adapter-box"></div> = Sequencing Adapters
            </div>
        </div>
    );
}

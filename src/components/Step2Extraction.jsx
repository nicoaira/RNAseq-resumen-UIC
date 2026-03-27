import React, { useEffect, useState } from 'react';
import './Step2Extraction.css';

const RnaStrand = ({ color, id, x, y, delay }) => {
    return (
        <svg
            className="rna-strand-tube"
            width="30"
            height="30"
            viewBox="0 0 100 100"
            style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s` }}
            title={`Gene ${id}`}
        >
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

const Tube = ({ genes, dropping, small }) => {
    return (
        <div className={`tube-item ${small ? 'small-tube-item' : ''}`}>
            <div className={`tube ${small ? 'small-tube' : ''}`}>
                <div className="tube-liquid"></div>
                <div className={`genes-container ${dropping ? 'dropping' : ''}`}>
                    {genes.map((g, i) => (
                        <RnaStrand
                            key={i}
                            color={g.color}
                            id={g.id}
                            x={g.x}
                            y={g.y}
                            delay={g.delay}
                        />
                    ))}
                </div>
            </div>
            {small && <div className="tube-label">Rep {small}</div>}
        </div>
    );
};

const ConditionBox = ({ title, children, isTreated }) => {
    return (
        <div className={`condition-panel ${isTreated ? 'treated-panel' : 'control-panel'}`}>
            <div className="condition-header">{title}</div>
            <div className="condition-content">
                {children}
            </div>
        </div>
    );
};

const OTHER_GENES_TUBE = [
    { id: 'O', x: 55, y: 35, delay: 0.2 },
    { id: 'O', x: 25, y: 70, delay: 0.5 },
    { id: 'O', x: 75, y: 55, delay: 0.8 },
    { id: 'O', x: 40, y: 45, delay: 1.1 },
];
const OTHER_COLOR = 'rgba(160, 170, 185, 0.4)';

export default function Step2Extraction({ mode }) {
    const [dropping, setDropping] = useState(false);
    const isReplicates = mode === 'replicates';

    useEffect(() => {
        const timer = setTimeout(() => setDropping(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const getTubeGenes = (a, b, c) => [
        ...Array(a).fill(0).map(() => ({ id: 'A', color: 'var(--gene-a)', x: 15 + Math.random() * 70, y: 30 + Math.random() * 50, delay: Math.random() * 2 })),
        ...Array(b).fill(0).map(() => ({ id: 'B', color: 'var(--gene-b)', x: 15 + Math.random() * 70, y: 30 + Math.random() * 50, delay: Math.random() * 2 })),
        ...Array(c).fill(0).map(() => ({ id: 'C', color: 'var(--gene-c)', x: 15 + Math.random() * 70, y: 30 + Math.random() * 50, delay: Math.random() * 2 })),
        ...OTHER_GENES_TUBE.map(g => ({ ...g, color: OTHER_COLOR }))
    ];

    if (isReplicates) {
        return (
            <div className="step-container replicates-step">
                <div className="replicates-area">
                    <ConditionBox title="Control RNA" isTreated={false}>
                        <div className="tubes-row">
                            <Tube genes={getTubeGenes(2, 4, 4)} dropping={dropping} small="1" />
                            <Tube genes={getTubeGenes(3, 3, 4)} dropping={dropping} small="2" />
                            <Tube genes={getTubeGenes(2, 4, 5)} dropping={dropping} small="3" />
                        </div>
                    </ConditionBox>
                    <ConditionBox title="Treated RNA" isTreated={true}>
                        <div className="tubes-row">
                            <Tube genes={getTubeGenes(7, 4, 2)} dropping={dropping} small="1" />
                            <Tube genes={getTubeGenes(8, 4, 2)} dropping={dropping} small="2" />
                            <Tube genes={getTubeGenes(9, 4, 2)} dropping={dropping} small="3" />
                        </div>
                    </ConditionBox>
                </div>
            </div>
        );
    }

    return (
        <div className="step-container">
            <div className="tubes-area">
                <ConditionBox title="Control RNA" isTreated={false}>
                    <Tube genes={getTubeGenes(2, 4, 4)} dropping={dropping} />
                </ConditionBox>
                <ConditionBox title="Treated RNA" isTreated={true}>
                    <Tube genes={getTubeGenes(8, 4, 2)} dropping={dropping} />
                </ConditionBox>
            </div>
        </div>
    );
}

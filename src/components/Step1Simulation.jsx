import React from 'react';
import './Step1Simulation.css';

const RnaStrand = ({ color, id, x, y, delay, small }) => {
    return (
        <svg
            className="rna-strand"
            width={small ? "20" : "40"}
            height={small ? "20" : "40"}
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

const CellCountBox = ({ genes, small }) => {
    const aCount = genes.filter(g => g.id === 'A').length;
    const bCount = genes.filter(g => g.id === 'B').length;
    const cCount = genes.filter(g => g.id === 'C').length;

    return (
        <div className={`cell-summary-box ${small ? 'small-box' : ''}`}>
            <div className="count-item"><span className="dot" style={{ background: 'var(--gene-a)' }}></span> {small ? '' : 'A:'} <strong>{aCount}</strong></div>
            <div className="count-item"><span className="dot" style={{ background: 'var(--gene-b)' }}></span> {small ? '' : 'B:'} <strong>{bCount}</strong></div>
            <div className="count-item"><span className="dot" style={{ background: 'var(--gene-c)' }}></span> {small ? '' : 'C:'} <strong>{cCount}</strong></div>
            {!small && <div className="count-item" style={{ opacity: 0.7 }}><span className="dot" style={{ background: 'rgba(255,255,255,0.4)' }}></span> Others: <strong>5000</strong></div>}
        </div>
    );
};

const Cell = ({ genes, isTreated, small }) => {
    return (
        <div className={`cell-item ${small ? 'small-cell-item' : ''}`}>
            <div className={`cell ${isTreated ? 'treated-cell' : ''} ${small ? 'small-cell' : ''}`}>
                <div className="nucleus"></div>
                {genes.map((g, i) => (
                    <RnaStrand
                        key={i}
                        color={g.color}
                        id={g.id}
                        x={g.x}
                        y={g.y}
                        delay={g.delay}
                        small={small}
                    />
                ))}
            </div>
            <CellCountBox genes={genes} small={small} />
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

const OTHER_GENES = [
    { id: 'O', x: 52, y: 48, delay: 0.15 },
    { id: 'O', x: 73, y: 58, delay: 0.35 },
    { id: 'O', x: 18, y: 52, delay: 0.55 },
    { id: 'O', x: 58, y: 38, delay: 0.75 },
    { id: 'O', x: 82, y: 68, delay: 0.25 },
    { id: 'O', x: 14, y: 75, delay: 0.45 },
    { id: 'O', x: 68, y: 28, delay: 0.65 },
    { id: 'O', x: 44, y: 62, delay: 0.85 },
];
const OTHER_COLOR = 'rgba(160, 170, 185, 0.4)';

export default function Step1Simulation({ mode }) {
    const isReplicates = mode === 'replicates';

    const getGenes = (a, b, c) => [
        ...Array(a).fill(0).map((_, i) => ({ id: 'A', color: 'var(--gene-a)', x: 15 + Math.random() * 30, y: 15 + Math.random() * 30, delay: Math.random() })),
        ...Array(b).fill(0).map((_, i) => ({ id: 'B', color: 'var(--gene-b)', x: 55 + Math.random() * 30, y: 15 + Math.random() * 30, delay: Math.random() })),
        ...Array(c).fill(0).map((_, i) => ({ id: 'C', color: 'var(--gene-c)', x: 30 + Math.random() * 40, y: 55 + Math.random() * 30, delay: Math.random() })),
        ...OTHER_GENES.map(g => ({ ...g, color: OTHER_COLOR }))
    ];

    if (isReplicates) {
        return (
            <div className="step-container replicates-step">
                <div className="replicates-area">
                    <ConditionBox title="Control Replicates">
                        <div className="replicate-column">
                            <Cell genes={getGenes(2, 4, 4)} isTreated={false} small={true} />
                            <Cell genes={getGenes(3, 3, 4)} isTreated={false} small={true} />
                            <Cell genes={getGenes(2, 4, 5)} isTreated={false} small={true} />
                        </div>
                    </ConditionBox>
                    <ConditionBox title="Treated Replicates">
                        <div className="replicate-column">
                            <Cell genes={getGenes(7, 4, 2)} isTreated={true} small={true} />
                            <Cell genes={getGenes(8, 4, 2)} isTreated={true} small={true} />
                            <Cell genes={getGenes(9, 4, 2)} isTreated={true} small={true} />
                        </div>
                    </ConditionBox>
                </div>
                <div className="legend-panel">
                    <div className="legend-item"><span className="color-box" style={{ backgroundColor: 'var(--gene-a)' }}></span> Gene A</div>
                    <div className="legend-item"><span className="color-box" style={{ backgroundColor: 'var(--gene-b)' }}></span> Gene B</div>
                    <div className="legend-item"><span className="color-box" style={{ backgroundColor: 'var(--gene-c)' }}></span> Gene C</div>
                </div>
            </div>
        );
    }

    // Default modes
    const controlGenes = getGenes(2, 4, 4);
    const treatedGenes = getGenes(8, 4, 2);

    return (
        <div className="step-container">
            <div className="simulation-area">
                <ConditionBox title="Control Specimen">
                    <Cell genes={controlGenes} isTreated={false} />
                </ConditionBox>
                <ConditionBox title="Treated Specimen">
                    <Cell genes={treatedGenes} isTreated={true} />
                </ConditionBox>
            </div>
            <div className="legend-panel">
                <h4>Genes</h4>
                <div className="legend-item"><span className="color-box" style={{ backgroundColor: 'var(--gene-a)' }}></span> Gene A</div>
                <div className="legend-item"><span className="color-box" style={{ backgroundColor: 'var(--gene-b)' }}></span> Gene B</div>
                <div className="legend-item"><span className="color-box" style={{ backgroundColor: 'var(--gene-c)' }}></span> Gene C</div>
                <div className="legend-item"><span className="color-box" style={{ backgroundColor: OTHER_COLOR }}></span> Others: 5000</div>
            </div>
        </div>
    );
}

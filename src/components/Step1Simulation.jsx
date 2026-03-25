import React from 'react';
import './Step1Simulation.css';

const RnaStrand = ({ color, id, x, y, delay }) => {
    return (
        <svg
            className="rna-strand"
            width="40"
            height="40"
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

const Cell = ({ title, genes, isTreated }) => {
    return (
        <div className="cell-container">
            <h3>{title}</h3>
            <div className={`cell ${isTreated ? 'treated-cell' : ''}`}>
                <div className="nucleus"></div>
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
    );
};

export default function Step1Simulation() {
    const controlGenes = [
        // Gene A (Red) - 3 copies (Clustered Top Left)
        { id: 'A', color: 'var(--gene-a)', x: 25, y: 25, delay: 0.1 },
        { id: 'A', color: 'var(--gene-a)', x: 35, y: 15, delay: 0.4 },
        { id: 'A', color: 'var(--gene-a)', x: 15, y: 40, delay: 0.7 },

        // Gene B (Green) - 3 copies (Clustered Top Right)
        { id: 'B', color: 'var(--gene-b)', x: 75, y: 22, delay: 0.2 },
        { id: 'B', color: 'var(--gene-b)', x: 60, y: 18, delay: 0.5 },
        { id: 'B', color: 'var(--gene-b)', x: 85, y: 35, delay: 0.8 },

        // Gene C (Yellow) - 4 copies (Clustered Bottom)
        { id: 'C', color: 'var(--gene-c)', x: 40, y: 70, delay: 0.3 },
        { id: 'C', color: 'var(--gene-c)', x: 55, y: 75, delay: 0.6 },
        { id: 'C', color: 'var(--gene-c)', x: 35, y: 85, delay: 0.9 },
        { id: 'C', color: 'var(--gene-c)', x: 65, y: 82, delay: 1.0 },
    ];

    const treatedGenes = [
        // Gene A (Red) - 6 copies (Clustered Top Left)
        { id: 'A', color: 'var(--gene-a)', x: 15, y: 25, delay: 0.1 },
        { id: 'A', color: 'var(--gene-a)', x: 25, y: 15, delay: 0.2 },
        { id: 'A', color: 'var(--gene-a)', x: 35, y: 30, delay: 0.3 },
        { id: 'A', color: 'var(--gene-a)', x: 12, y: 40, delay: 0.4 },
        { id: 'A', color: 'var(--gene-a)', x: 28, y: 42, delay: 0.5 },
        { id: 'A', color: 'var(--gene-a)', x: 42, y: 20, delay: 0.6 },

        // Gene B (Green) - 3 copies (Clustered Top Right)
        { id: 'B', color: 'var(--gene-b)', x: 75, y: 22, delay: 0.7 },
        { id: 'B', color: 'var(--gene-b)', x: 60, y: 18, delay: 0.8 },
        { id: 'B', color: 'var(--gene-b)', x: 85, y: 35, delay: 0.9 },

        // Gene C (Yellow) - 2 copies (Clustered Bottom)
        { id: 'C', color: 'var(--gene-c)', x: 45, y: 75, delay: 1.0 },
        { id: 'C', color: 'var(--gene-c)', x: 60, y: 80, delay: 1.1 },
    ];

    return (
        <div className="step-container">
            <div className="simulation-area">
                <Cell title="Control Cell" genes={controlGenes} isTreated={false} />
                <Cell title="Treated Cell" genes={treatedGenes} isTreated={true} />
            </div>
            <div className="legend-panel">
                <h4>Genes</h4>
                <div className="legend-item"><span className="color-box" style={{ backgroundColor: 'var(--gene-a)' }}></span> Gene A</div>
                <div className="legend-item"><span className="color-box" style={{ backgroundColor: 'var(--gene-b)' }}></span> Gene B</div>
                <div className="legend-item"><span className="color-box" style={{ backgroundColor: 'var(--gene-c)' }}></span> Gene C</div>
            </div>
        </div>
    );
}

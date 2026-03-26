import React, { useEffect, useState } from 'react';
import './Step3RT.css';

const CdnaStrand = ({ color, id, x, y }) => {
    return (
        <svg
            className="cdna-strand-tube"
            width="30"
            height="30"
            viewBox="0 0 100 100"
            style={{ left: `${x}%`, top: `${y}%` }}
            title={`Gene ${id}`}
        >
            <line
                x1="10" y1="50" x2="90" y2="50"
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
            />
        </svg>
    );
};

const Tube = ({ title, genes, dropping }) => {
    return (
        <div className="tube-container">
            <h3>{title}</h3>
            <div className="tube">
                <div className="tube-liquid"></div>
                <div className={`genes-container ${dropping ? 'dropping' : ''}`}>
                    {genes.map((g, i) => (
                        <CdnaStrand
                            key={i}
                            color={g.color}
                            id={g.id}
                            x={g.x}
                            y={g.y}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function Step3RT() {
    const [dropping, setDropping] = useState(false);

    useEffect(() => {
        // Trigger the animation shortly after mount
        const timer = setTimeout(() => setDropping(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const controlGenes = [
        { id: 'A', color: 'var(--gene-a)', x: 30, y: 70 },
        { id: 'A', color: 'var(--gene-a)', x: 50, y: 85 },
        { id: 'B', color: 'var(--gene-b)', x: 40, y: 55 },
        { id: 'B', color: 'var(--gene-b)', x: 70, y: 80 },
        { id: 'B', color: 'var(--gene-b)', x: 20, y: 58 },
        { id: 'C', color: 'var(--gene-c)', x: 50, y: 60 },
        { id: 'C', color: 'var(--gene-c)', x: 30, y: 85 },
        { id: 'C', color: 'var(--gene-c)', x: 80, y: 55 },
        { id: 'C', color: 'var(--gene-c)', x: 50, y: 65 },
    ];

    const treatedGenes = [
        { id: 'A', color: 'var(--gene-a)', x: 20, y: 85 },
        { id: 'A', color: 'var(--gene-a)', x: 40, y: 60 },
        { id: 'A', color: 'var(--gene-a)', x: 60, y: 80 },
        { id: 'A', color: 'var(--gene-a)', x: 80, y: 65 },
        { id: 'A', color: 'var(--gene-a)', x: 50, y: 90 },
        { id: 'A', color: 'var(--gene-a)', x: 30, y: 70 },
        { id: 'A', color: 'var(--gene-a)', x: 45, y: 55 },
        { id: 'A', color: 'var(--gene-a)', x: 75, y: 80 },
        { id: 'B', color: 'var(--gene-b)', x: 60, y: 58 },
        { id: 'B', color: 'var(--gene-b)', x: 70, y: 85 },
        { id: 'B', color: 'var(--gene-b)', x: 20, y: 60 },
        { id: 'C', color: 'var(--gene-c)', x: 50, y: 58 },
        { id: 'C', color: 'var(--gene-c)', x: 40, y: 80 },
    ];

    return (
        <div className="step-container">
            <div className="tubes-area">
                <Tube title="Control cDNA" genes={controlGenes} dropping={dropping} />
                <Tube title="Treated cDNA" genes={treatedGenes} dropping={dropping} />
            </div>
        </div>
    );
}

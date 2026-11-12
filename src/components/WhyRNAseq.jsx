import { useState } from 'react';
import './Step1Simulation.css';
import './WhyRNAseq.css';

// Real genes (ACTB, ALB, SNAP25, PTPRC) with their textbook roles.
// INFL1 and RESP1 are INVENTED genes from the RX-42 example used in the RNA-seq classes.
const GENES = [
    { id: 'ACTB', role: 'cell skeleton; on in almost every cell', color: '#94a3b8' },
    { id: 'ALB', role: 'albumin, a blood protein made by the liver', color: '#f59e0b' },
    { id: 'SNAP25', role: 'helps neurons release signals', color: '#a855f7' },
    { id: 'PTPRC', role: 'marks immune cells (also called CD45)', color: '#3b82f6' },
    { id: 'INFL1', role: 'inflammation gene', color: 'var(--gene-a)', invented: true },
    { id: 'RESP1', role: 'drug-response gene', color: 'var(--gene-b)', invented: true },
];

// Amounts are illustrative (0–10 scale), not measured data.
const STATES = [
    {
        id: 'liver', label: 'Liver cell',
        expr: { ACTB: 6, ALB: 10, SNAP25: 0, PTPRC: 0, INFL1: 1, RESP1: 0 },
        caption: 'Liver cells pour out albumin RNA, so they can make albumin protein for the blood.',
    },
    {
        id: 'neuron', label: 'Neuron',
        expr: { ACTB: 6, ALB: 0, SNAP25: 9, PTPRC: 0, INFL1: 0, RESP1: 0 },
        caption: 'Neurons switch on genes for sending signals. Albumin is off.',
    },
    {
        id: 'immune', label: 'Immune cell, untreated',
        expr: { ACTB: 6, ALB: 0, SNAP25: 0, PTPRC: 8, INFL1: 9, RESP1: 1 },
        caption: 'An immune cell from a patient with inflammation: the inflammation gene is high.',
    },
    {
        id: 'immuneRx', label: 'Immune cell + RX-42', drug: true,
        expr: { ACTB: 6, ALB: 0, SNAP25: 0, PTPRC: 8, INFL1: 2, RESP1: 8 },
        caption: 'Same kind of cell after 24 h with the drug: INFL1 goes down, RESP1 goes up. Same DNA, new RNA.',
    },
];

// Fixed pseudo-random positions so the picture does not jump on every render
const seeded = n => {
    const x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
};

function RnaCell({ state }) {
    const strands = [];
    GENES.forEach((g, gi) => {
        for (let k = 0; k < state.expr[g.id]; k++) {
            const s = gi * 31 + k * 7;
            const angle = seeded(s) * Math.PI * 2;
            const radius = 26 + seeded(s + 1) * 18; // % from centre, outside the nucleus
            strands.push({
                key: `${g.id}-${k}`,
                color: g.color,
                x: 50 + Math.cos(angle) * radius,
                y: 50 + Math.sin(angle) * radius,
                delay: seeded(s + 2),
            });
        }
    });

    return (
        <div className="why-cell-wrap">
            <div className={`cell why-cell ${state.drug ? 'treated-cell' : ''}`}>
                <div className="nucleus why-nucleus"><span>DNA</span></div>
                {strands.map(s => (
                    <svg key={s.key} className="rna-strand" width="30" height="30" viewBox="0 0 100 100"
                        style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.delay}s` }}>
                        <path d="M 10 50 Q 25 20, 50 50 T 90 50" stroke={s.color} strokeWidth="7" fill="none" strokeLinecap="round" />
                    </svg>
                ))}
            </div>
            <div className="why-cell-caption">Squiggles = RNA molecules</div>
        </div>
    );
}

function GeneTable({ state }) {
    return (
        <div className="why-genes">
            <div className="why-genes-head">
                <span>Gene in the DNA</span>
                <span>RNA made (illustrative)</span>
            </div>
            {GENES.map(g => {
                const v = state.expr[g.id];
                return (
                    <div key={g.id} className={`why-gene-row ${v === 0 ? 'off' : ''}`}>
                        <div className="why-dna-box" style={{ borderColor: g.color }}>
                            <strong style={{ color: g.color }}>{g.id}{g.invented ? '*' : ''}</strong>
                            <span className="why-role">{g.role}</span>
                        </div>
                        <div className="why-bar-track">
                            <div className="why-bar" style={{ width: `${v * 10}%`, background: g.color }} />
                            {v === 0 && <span className="why-off-label">off</span>}
                        </div>
                    </div>
                );
            })}
            <div className="why-footnote">
                * Invented genes from our made-up RX-42 drug example.
                RX-42 is not a real drug. The other four genes are real.
            </div>
        </div>
    );
}

const USES = [
    {
        title: 'Diagnosis',
        text: 'In 50 patients with rare muscle disease and no answer from DNA tests, RNA-seq of muscle found the cause in 35%.',
        cite: 'Cummings et al. 2017, Sci Transl Med',
    },
    {
        title: 'Drug response',
        text: 'See which genes a drug switches on or off, and whether patients respond differently.',
        cite: 'e.g. the invented RX-42 in our classes',
    },
    {
        title: 'Biomarkers',
        text: 'Find genes whose RNA level flags a disease or predicts who will benefit from a treatment.',
        cite: '',
    },
];

export default function WhyRNAseq() {
    const [stateId, setStateId] = useState('liver');
    const state = STATES.find(s => s.id === stateId);

    return (
        <>
            <section className="pipeline-step">
                <div className="step-content">
                    <div className="step-info">
                        <div className="step-indicator">Why RNA-seq?</div>
                        <h2>Same genome, different RNA</h2>
                        <p>
                            Almost every cell in your body carries the same DNA (genome).
                            What differs is which genes are copied into RNA, and how much.
                        </p>
                        <p className="why-lead">
                            RNA tells you what a cell is doing <em>right now</em>.
                            RNA-seq counts the RNA of every gene at once.
                        </p>
                    </div>
                    <div className="step-visualizer why-visualizer">
                        <div className="why-state-picker">
                            {STATES.map(s => (
                                <button key={s.id} type="button"
                                    className={`mode-btn ${s.id === stateId ? 'active-mode' : ''}`}
                                    onClick={() => setStateId(s.id)}>
                                    {s.label}
                                </button>
                            ))}
                        </div>
                        <div className="why-main">
                            <RnaCell state={state} />
                            <GeneTable state={state} />
                        </div>
                        <div className="info-box why-caption" key={state.id}>{state.caption}</div>
                    </div>
                </div>
            </section>

            <div className="step-connector-row">
                <div className="spacer-info"></div>
                <div className="connector-area">
                    <div className="connector-grid single-grid">
                        <div className="connector-col">
                            <div className="vline control-line"></div>
                            <div className="varrow">▼</div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="pipeline-step">
                <div className="step-content">
                    <div className="step-info">
                        <div className="step-indicator">In the clinic</div>
                        <h2>What RNA-seq is used for</h2>
                        <p>Three real uses. Next: how to design an experiment that can answer a question.</p>
                    </div>
                    <div className="step-visualizer">
                        <div className="why-uses">
                            {USES.map((u, i) => (
                                <div key={u.title} className="why-use-card">
                                    <div className="why-use-num">{i + 1}</div>
                                    <h3>{u.title}</h3>
                                    <p>{u.text}</p>
                                    {u.cite && <div className="why-cite">{u.cite}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

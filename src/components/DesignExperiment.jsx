import { useState } from 'react';
import './Checkpoint.css';
import './DesignExperiment.css';
import { DESIGN_PRESETS, sampleIds, judgeDesign } from '../data/designPresets';

const defaultBatches = n => {
    const b = {};
    sampleIds(n).forEach(id => { b[id] = (Number(id.slice(1)) - 1) % 2; });
    return b;
};

// Fixed "biological noise" per sample (patients differ a little), so dots do not jump around
const NOISE = {
    C: [[-0.55, 0.35], [0.45, -0.45], [0.05, 0.75], [-0.35, -0.7], [0.7, 0.3], [-0.75, -0.1]],
    T: [[0.5, 0.45], [-0.5, -0.3], [0.1, -0.75], [-0.2, 0.75], [0.75, -0.2], [-0.7, 0.2]],
};
const noise = (id, axis) => NOISE[id[0]][Number(id.slice(1)) - 1][axis === 'x' ? 0 : 1];

const DRUG_SHIFT = { x: 2.4, y: 0.5 };
const BATCH_SHIFT = { x: 1.3, y: 1.7 };
const BATCH_LEVELS = [
    { id: 0, label: 'None', k: 0 },
    { id: 1, label: 'Small', k: 0.6 },
    { id: 2, label: 'Large', k: 1.2 },
];

function SampleChip({ id, onToggle }) {
    const treated = id[0] === 'T';
    return (
        <button
            type="button"
            draggable
            onDragStart={e => e.dataTransfer.setData('text/plain', id)}
            onClick={() => onToggle(id)}
            className={`sample-chip ${treated ? 'treated' : 'control'}`}
            title="Click (or drag) to move to the other batch"
        >
            {id}
        </button>
    );
}

function BatchColumn({ index, name, ids, onDropSample, onToggle }) {
    const [over, setOver] = useState(false);
    return (
        <div
            className={`batch-col ${over ? 'drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setOver(true); }}
            onDragLeave={() => setOver(false)}
            onDrop={e => {
                e.preventDefault();
                setOver(false);
                const id = e.dataTransfer.getData('text/plain');
                if (id) onDropSample(id, index);
            }}
        >
            <div className="batch-col-title">
                <span className={`batch-shape ${index === 0 ? 'circle' : 'square'}`}></span>
                {name}
            </div>
            <div className="batch-chips">
                {ids.length === 0 && <span className="batch-empty">empty</span>}
                {ids.map(id => <SampleChip key={id} id={id} onToggle={onToggle} />)}
            </div>
        </div>
    );
}

function PcaPlot({ ids, batches, drugWorks, batchK }) {
    const W = 400, H = 300, m = 26;
    const xMin = -1.4, xMax = 5.4, yMin = -1.3, yMax = 4.0;
    const xs = x => m + (x - xMin) / (xMax - xMin) * (W - 2 * m);
    const ys = y => H - m - (y - yMin) / (yMax - yMin) * (H - 2 * m);

    const points = ids.map(id => {
        const treated = id[0] === 'T';
        const b = batches[id];
        const x = noise(id, 'x') + (treated && drugWorks ? DRUG_SHIFT.x : 0) + b * batchK * BATCH_SHIFT.x;
        const y = noise(id, 'y') + (treated && drugWorks ? DRUG_SHIFT.y : 0) + b * batchK * BATCH_SHIFT.y;
        return { id, treated, b, x, y };
    });

    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="pca-plot" role="img"
            aria-label="Toy PCA-like plot of the samples">
            <rect x={m} y={m} width={W - 2 * m} height={H - 2 * m} rx="6" fill="#0b1222" stroke="rgba(255,255,255,0.1)" />
            <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="13" fill="#94a3b8">Axis 1 (biggest difference between samples)</text>
            <text x={12} y={H / 2} textAnchor="middle" fontSize="13" fill="#94a3b8" transform={`rotate(-90 12 ${H / 2})`}>Axis 2</text>
            {points.map(p => {
                const cx = xs(p.x), cy = ys(p.y);
                const fill = p.treated ? 'var(--gene-a)' : 'var(--accent)';
                return (
                    <g key={p.id} className="pca-point" style={{ transform: `translate(${cx}px, ${cy}px)` }}>
                        {p.b === 0
                            ? <circle r="10" fill={fill} stroke="#fff" strokeWidth="1.5" />
                            : <rect x="-9" y="-9" width="18" height="18" rx="2" fill={fill} stroke="#fff" strokeWidth="1.5" />}
                        <text y="-14" textAnchor="middle" fontSize="13" fontWeight="600" fill="#e2e8f0">{p.id}</text>
                    </g>
                );
            })}
        </svg>
    );
}

export default function DesignExperiment({ classMode }) {
    const [n, setN] = useState(3);
    const [batches, setBatches] = useState(() => defaultBatches(3));
    const [batchKind, setBatchKind] = useState('day');
    const [drugWorks, setDrugWorks] = useState(true);
    const [batchLevel, setBatchLevel] = useState(2);
    const [presetId, setPresetId] = useState(null);
    const [revealed, setRevealed] = useState(false);

    const batchName = batchKind === 'day' ? 'day' : 'lane';
    const batchLabels = batchKind === 'day' ? ['Day 1', 'Day 2'] : ['Lane 1', 'Lane 2'];
    const ids = sampleIds(n);
    const verdict = judgeDesign(n, batches, batchName);
    const showVerdict = !classMode || revealed;

    const edited = () => { setPresetId(null); setRevealed(false); };

    const changeN = v => {
        const next = { ...batches };
        sampleIds(v).forEach(id => {
            if (next[id] === undefined) next[id] = (Number(id.slice(1)) - 1) % 2;
        });
        setN(v);
        setBatches(next);
        edited();
    };

    const moveSample = (id, b) => {
        setBatches(prev => ({ ...prev, [id]: b }));
        edited();
    };
    const toggleSample = id => moveSample(id, batches[id] === 0 ? 1 : 0);

    const applyPreset = p => {
        setN(p.n);
        setBatches({ ...defaultBatches(p.n), ...p.batches });
        setPresetId(p.id);
        setRevealed(false);
    };

    const activePreset = DESIGN_PRESETS.find(p => p.id === presetId);

    return (
        <>
            <section className="pipeline-step">
                <div className="step-content">
                    <div className="step-info">
                        <div className="step-indicator">Design</div>
                        <h2>Design your experiment</h2>
                        <p>
                            Question: does the drug change gene activity in patients&apos; cells?
                            Choose how many patients per group, then decide which samples are processed together.
                        </p>
                        <p className="design-def">
                            <strong>Batch</strong> = samples handled together (same day, same kit, same sequencing lane).
                            Batches always differ a little for technical reasons.
                        </p>
                        <div className="preset-box">
                            <div className="preset-title">Can this be analyzed?</div>
                            {DESIGN_PRESETS.map(p => (
                                <button key={p.id} type="button"
                                    className={`preset-btn ${presetId === p.id ? 'active' : ''}`}
                                    onClick={() => applyPreset(p)}>
                                    <strong>{p.label}</strong>
                                    <span>{p.summary.replace(/day/g, batchName)}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="step-visualizer design-visualizer">
                        <div className="design-controls">
                            <div className="control-group">
                                <span>Biological replicates per group: <strong>{n}</strong></span>
                                <div className="n-buttons">
                                    {[1, 2, 3, 4, 5, 6].map(v => (
                                        <button key={v} type="button"
                                            className={`n-btn ${v === n ? 'active' : ''}`}
                                            onClick={() => changeN(v)}>{v}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="control-group">
                                <span>Batches are</span>
                                <div className="seg">
                                    <button type="button" className={batchKind === 'day' ? 'active' : ''} onClick={() => setBatchKind('day')}>processing days</button>
                                    <button type="button" className={batchKind === 'lane' ? 'active' : ''} onClick={() => setBatchKind('lane')}>sequencing lanes</button>
                                </div>
                            </div>
                        </div>

                        <div className="design-board">
                            <div className="board-hint">
                                <span className="chip-legend control">C</span> control
                                <span className="chip-legend treated">T</span> treated with drug
                                <span className="board-hint-sep">·</span> click or drag a sample to move it
                            </div>
                            <div className="batch-cols">
                                {[0, 1].map(b => (
                                    <BatchColumn key={b} index={b} name={batchLabels[b]}
                                        ids={ids.filter(id => batches[id] === b)}
                                        onDropSample={moveSample} onToggle={toggleSample} />
                                ))}
                            </div>
                        </div>

                        <div className="design-result">
                            <div className="pca-wrap">
                                <div className="pca-title">What the data would look like (toy &quot;PCA&quot;)</div>
                                <PcaPlot ids={ids} batches={batches} drugWorks={drugWorks} batchK={BATCH_LEVELS[batchLevel].k} />
                                <div className="pca-legend">
                                    <span><i className="dot-c"></i>control</span>
                                    <span><i className="dot-t"></i>treated</span>
                                    <span><i className="shape-circle"></i>{batchLabels[0]}</span>
                                    <span><i className="shape-square"></i>{batchLabels[1]}</span>
                                </div>
                                <p className="pca-note">Each dot is one sample. Samples with similar RNA sit close together.</p>
                            </div>

                            <div className="design-side">
                                <div className="control-group">
                                    <span>Does the drug really work?</span>
                                    <div className="seg">
                                        <button type="button" className={drugWorks ? 'active' : ''} onClick={() => setDrugWorks(true)}>Yes</button>
                                        <button type="button" className={!drugWorks ? 'active' : ''} onClick={() => setDrugWorks(false)}>No</button>
                                    </div>
                                </div>
                                <div className="control-group">
                                    <span>Technical {batchName} effect</span>
                                    <div className="seg">
                                        {BATCH_LEVELS.map(l => (
                                            <button key={l.id} type="button" className={batchLevel === l.id ? 'active' : ''} onClick={() => setBatchLevel(l.id)}>{l.label}</button>
                                        ))}
                                    </div>
                                </div>

                                {showVerdict ? (
                                    <div className={`verdict verdict-${verdict.level}`} key={`${verdict.level}-${presetId}`}>
                                        <div className="verdict-tag">
                                            {activePreset ? `${activePreset.label}: ` : ''}
                                            {verdict.level === 'bad' ? '✗' : verdict.level === 'weak' ? '!' : '✓'} {verdict.title}
                                        </div>
                                        <p>{verdict.reason}</p>
                                    </div>
                                ) : (
                                    <div className="verdict verdict-hidden">
                                        <div className="verdict-tag">Can this be analyzed?</div>
                                        <p>Discuss first. Try switching the drug effect off: do the groups still separate?</p>
                                        <button type="button" className="checkpoint-reveal" onClick={() => setRevealed(true)}>Reveal verdict</button>
                                    </div>
                                )}
                            </div>
                        </div>
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
                        <div className="step-indicator">Rules of thumb</div>
                        <h2>Replicates and depth</h2>
                        <p>Two choices you make before any sample is sequenced.</p>
                    </div>
                    <div className="step-visualizer">
                        <div className="design-notes">
                            <div className="design-note-card">
                                <h3>Biological vs technical replicates</h3>
                                <p>
                                    <strong>Biological</strong>: a different patient, mouse or culture. It captures natural variation, which is what statistics need.
                                    <br />
                                    <strong>Technical</strong>: the same RNA measured again. It only shows measurement noise, so it cannot replace biological replicates.
                                </p>
                            </div>
                            <div className="design-note-card">
                                <h3>More replicates or more depth?</h3>
                                <p>
                                    <strong>Depth</strong> = number of reads per sample. In one study of a human cell line, going beyond about 10 million reads helped little,
                                    while adding biological replicates helped a lot.
                                </p>
                                <div className="design-cite">Liu, Zhou &amp; White 2014, Bioinformatics</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

import { useState } from 'react';
import './StepFastqQC.css';
import { CONTROL_STD, CONTROL_REPLICATES } from '../data/reads';

// Realistic quality string for the 7-base read shown (quality drops towards the end, as in real runs).
const QUAL = 'IIFF:5#';

const phredOf = ch => ch.charCodeAt(0) - 33;
const errorProb = q => Math.pow(10, -q / 10);

function formatProb(p) {
    if (p >= 0.01) return p.toFixed(2);
    return p.toPrecision(1);
}

function trustLabel(q) {
    if (q >= 30) return { text: 'very reliable', cls: 'q-good' };
    if (q >= 20) return { text: 'acceptable', cls: 'q-ok' };
    return { text: 'doubtful', cls: 'q-bad' };
}

function FastqRecord({ read, selected, onSelect }) {
    const header = `@${read.id}:1:N:0:1`;
    const bases = read.seq.split('');
    const quals = QUAL.slice(0, bases.length).split('');

    return (
        <div className="fq-record">
            <div className="fq-line">
                <code className="fq-text fq-line-id">{header}</code>
                <span className="fq-label">1 · Read name: which read this is</span>
            </div>
            <div className="fq-line">
                <code className="fq-text">
                    {bases.map((b, i) => (
                        <span key={i} className={`fq-char fq-base ${selected === i ? 'sel' : ''}`}>{b}</span>
                    ))}
                </code>
                <span className="fq-label">2 · Sequence: the bases read</span>
            </div>
            <div className="fq-line">
                <code className="fq-text fq-line-plus">+</code>
                <span className="fq-label">3 · Separator (always "+")</span>
            </div>
            <div className="fq-line">
                <code className="fq-text">
                    {quals.map((c, i) => (
                        <button
                            key={i}
                            type="button"
                            className={`fq-char fq-qchar ${selected === i ? 'sel' : ''}`}
                            onClick={() => onSelect(i)}
                            title="Click to decode"
                        >
                            {c}
                        </button>
                    ))}
                </code>
                <span className="fq-label">4 · Quality: one character per base <em>(click one)</em></span>
            </div>
        </div>
    );
}

function Decoder({ ch, base }) {
    const ascii = ch.charCodeAt(0);
    const q = phredOf(ch);
    const p = errorProb(q);
    const trust = trustLabel(q);
    const oneIn = Math.round(1 / p);

    return (
        <div className="phred-decoder">
            <div className="phred-chain">
                <div className="phred-cell">
                    <div className="phred-k">Character</div>
                    <div className="phred-v mono">{ch}</div>
                    <div className="phred-s">for base {base}</div>
                </div>
                <div className="phred-arrow">→</div>
                <div className="phred-cell">
                    <div className="phred-k">ASCII code</div>
                    <div className="phred-v mono">{ascii}</div>
                    <div className="phred-s">the number a computer stores</div>
                </div>
                <div className="phred-arrow">→</div>
                <div className="phred-cell">
                    <div className="phred-k">Phred Q = code − 33</div>
                    <div className="phred-v mono">{ascii} − 33 = {q}</div>
                    <div className="phred-s">quality score</div>
                </div>
                <div className="phred-arrow">→</div>
                <div className={`phred-cell ${trust.cls}`}>
                    <div className="phred-k">Error chance = 10<sup>−Q/10</sup></div>
                    <div className="phred-v mono">{formatProb(p)}</div>
                    <div className="phred-s">
                        {oneIn <= 1 ? 'almost surely wrong' : `about 1 wrong in ${oneIn.toLocaleString('en-US')}`} · {trust.text}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---- Toy per-base quality curves (three made-up FASTQ files) ----
const POSITIONS = Array.from({ length: 100 }, (_, i) => i + 1);

const QC_FILES = [
    {
        id: 1,
        curve: x => 36 - 3 * Math.pow(x / 100, 3),
        answer: 'proceed',
        explain: 'Quality stays high (green) along the whole read. Nothing to fix: go on to alignment.',
    },
    {
        id: 2,
        curve: x => (x < 65 ? 35 - 0.03 * x : 35 - 0.03 * x - 0.018 * Math.pow(x - 65, 2)),
        answer: 'trim',
        explain: 'Good start, but the last bases fall into the red. This is normal wear at read ends: trim (cut off) the low-quality tail, then continue.',
    },
    {
        id: 3,
        curve: x => 35 - 22 * Math.exp(-Math.pow((x - 47) / 6, 2)),
        answer: 'investigate',
        explain: 'A sudden dip in the middle is not normal wear. Something went wrong in the run (for example, the instrument or flow cell). Check other samples from the same run before using it.',
    },
];

const CHOICES = [
    { id: 'proceed', label: 'Proceed' },
    { id: 'trim', label: 'Trim' },
    { id: 'investigate', label: 'Investigate' },
];

function QualityPlot({ file }) {
    const W = 560, H = 260;
    const ml = 44, mr = 12, mt = 12, mb = 38;
    const pw = W - ml - mr, ph = H - mt - mb;
    const yMax = 40;
    const xs = x => ml + ((x - 1) / 99) * pw;
    const ys = q => mt + ph - (Math.max(0, Math.min(q, yMax)) / yMax) * ph;

    const median = POSITIONS.map(x => file.curve(x));
    const line = median.map((q, i) => `${i === 0 ? 'M' : 'L'}${xs(POSITIONS[i]).toFixed(1)},${ys(q).toFixed(1)}`).join(' ');
    // Spread band (25th–75th percentile, made up): wider where quality is lower
    const spread = q => 1.5 + (40 - q) * 0.25;
    const upper = median.map((q, i) => `${xs(POSITIONS[i]).toFixed(1)},${ys(q + spread(q)).toFixed(1)}`);
    const lower = median.map((q, i) => `${xs(POSITIONS[i]).toFixed(1)},${ys(q - spread(q)).toFixed(1)}`).reverse();
    const band = `M${upper.join(' L')} L${lower.join(' L')} Z`;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="qc-plot" role="img"
            aria-label={`Toy per-base quality curve for file ${file.id}`}>
            <rect x={ml} y={ys(40)} width={pw} height={ys(28) - ys(40)} fill="rgba(16,185,129,0.14)" />
            <rect x={ml} y={ys(28)} width={pw} height={ys(20) - ys(28)} fill="rgba(234,179,8,0.14)" />
            <rect x={ml} y={ys(20)} width={pw} height={ys(0) - ys(20)} fill="rgba(239,68,68,0.14)" />
            {[0, 10, 20, 30, 40].map(q => (
                <g key={q}>
                    <line x1={ml} x2={ml + pw} y1={ys(q)} y2={ys(q)} stroke="rgba(255,255,255,0.08)" />
                    <text x={ml - 6} y={ys(q) + 4} textAnchor="end" fontSize="11" fill="#94a3b8">{q}</text>
                </g>
            ))}
            {[1, 25, 50, 75, 100].map(x => (
                <text key={x} x={xs(x)} y={H - mb + 16} textAnchor="middle" fontSize="11" fill="#94a3b8">{x}</text>
            ))}
            <path d={band} fill="rgba(59,130,246,0.25)" />
            <path d={line} fill="none" stroke="#93c5fd" strokeWidth="2.5" />
            <text x={ml + pw / 2} y={H - 4} textAnchor="middle" fontSize="12" fill="#94a3b8">Position in the read (base 1 → 100)</text>
            <text x={12} y={mt + ph / 2} textAnchor="middle" fontSize="12" fill="#94a3b8"
                transform={`rotate(-90 12 ${mt + ph / 2})`}>Quality (Q)</text>
        </svg>
    );
}

function QCPanel() {
    const [fileIdx, setFileIdx] = useState(0);
    const [choice, setChoice] = useState(null);
    const file = QC_FILES[fileIdx];

    const pickFile = i => { setFileIdx(i); setChoice(null); };

    return (
        <div className="qc-panel">
            <div className="qc-header">
                <h3>Quality check (QC)</h3>
                <div className="qc-file-tabs">
                    {QC_FILES.map((f, i) => (
                        <button key={f.id} type="button"
                            className={`mode-btn qc-file-btn ${i === fileIdx ? 'active-mode' : ''}`}
                            onClick={() => pickFile(i)}>
                            File {f.id}
                        </button>
                    ))}
                </div>
            </div>
            <p className="qc-intro">
                A QC tool (such as FastQC) summarizes the quality of millions of reads, position by position.
                Line = typical quality; band = spread. Toy data.
            </p>
            <QualityPlot file={file} />
            <div className="qc-question">
                <span>Proceed, trim, or investigate?</span>
                <div className="qc-choices">
                    {CHOICES.map(c => (
                        <button key={c.id} type="button"
                            className={`qc-choice ${choice === c.id ? (c.id === file.answer ? 'right' : 'wrong') : ''}`}
                            onClick={() => setChoice(c.id)}>
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>
            {choice && (
                <div className={`qc-feedback ${choice === file.answer ? 'right' : 'wrong'}`}>
                    <strong>{choice === file.answer ? 'Yes.' : `Not quite: the answer is "${CHOICES.find(c => c.id === file.answer).label}".`}</strong>{' '}
                    {file.explain}
                </div>
            )}
        </div>
    );
}

export default function StepFastqQC({ mode }) {
    const read = mode === 'replicates' ? CONTROL_REPLICATES[0][0] : CONTROL_STD[0];
    const [selected, setSelected] = useState(6);
    const ch = QUAL[selected];

    return (
        <div className="step-container fastqqc-step">
            <div className="fq-panel">
                <h3>One read from the control FASTQ file</h3>
                <FastqRecord read={read} selected={selected} onSelect={setSelected} />
                <Decoder ch={ch} base={read.seq[selected]} />
                <p className="fq-footnote">
                    Real reads are 50–150 bases long; ours have 7 to fit on screen.
                    The Sequencing step showed every quality as "H" (Q = 39) to keep it simple; here they vary, as in real data.
                </p>
            </div>
            <QCPanel />
        </div>
    );
}

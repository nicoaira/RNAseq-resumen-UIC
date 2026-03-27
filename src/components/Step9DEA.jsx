import './StepMatrix.css';
import { VOLCANO_BG } from '../data/volcanoBackground';

// VOLCANO_BG: 10% sample of real DESeq2 results [log2FoldChange, -log10(padj)]

const REPLICATE_STATS = [
    { gene: 'Gene A', color: 'var(--gene-a)', log2fc:  1.77, pvalue: 2.39e-6, padj: 8.11e-5 },
    { gene: 'Gene B', color: 'var(--gene-b)', log2fc:  0.00, pvalue: 0.972,   padj: 0.989   },
    { gene: 'Gene C', color: 'var(--gene-c)', log2fc: -1.00, pvalue: 8.11e-5, padj: 5.02e-3 },
];

function VolcanoPlot() {
    const W = 600, H = 420;
    const ml = 58, mr = 24, mt = 24, mb = 52;
    const pw = W - ml - mr;
    const ph = H - mt - mb;

    const xMin = -4, xMax = 4;
    const yMin = 0,  yMax = 8;

    const xs = v => ml + (v - xMin) / (xMax - xMin) * pw;
    // cap data at yMax before scaling
    const ys = v => mt + ph - (Math.min(v, yMax) - yMin) / (yMax - yMin) * ph;

    const xTicks = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    const yTicks = [0, 2, 4, 6, 8];

    return (
        <svg
            width="100%"
            viewBox={`0 0 ${W} ${H}`}
            style={{ fontFamily: 'inherit', display: 'block', maxWidth: 720 }}
        >
            {/* Plot area background */}
            <rect x={ml} y={mt} width={pw} height={ph} fill="#12121f" rx="4" />

            {/* Grid */}
            {yTicks.map(y => (
                <line key={`gy${y}`} x1={ml} x2={ml + pw} y1={ys(y)} y2={ys(y)}
                    stroke="#2a2a3e" strokeWidth="1" />
            ))}
            {xTicks.map(x => (
                <line key={`gx${x}`} x1={xs(x)} x2={xs(x)} y1={mt} y2={mt + ph}
                    stroke="#2a2a3e" strokeWidth="1" />
            ))}

            {/* Zero vertical line */}
            <line x1={xs(0)} x2={xs(0)} y1={mt} y2={mt + ph}
                stroke="#444" strokeWidth="1.2" />

            {/* p=0.05 threshold: -log10(0.05) ≈ 1.301 */}
            <line x1={ml} x2={ml + pw} y1={ys(1.301)} y2={ys(1.301)}
                stroke="#666" strokeWidth="1" strokeDasharray="5,4" />
            <text x={ml + pw - 3} y={ys(1.301) - 4}
                textAnchor="end" fontSize="9" fill="#888">p = 0.05</text>

            {/* Background gray points — real DESeq2 data (10% sample) */}
            {VOLCANO_BG.map(([x, y], i) => (
                <circle key={i} cx={xs(x)} cy={ys(y)}
                    r="2.5" fill="#6b7280" opacity="0.45" />
            ))}

            {/* Our 3 gene points */}
            {REPLICATE_STATS.map(d => {
                const cx = xs(d.log2fc);
                const cy = ys(-Math.log10(d.padj));
                const labelY = cy - 10;
                return (
                    <g key={d.gene}>
                        <circle cx={cx} cy={cy} r="6" fill={d.color} opacity="0.95"
                            stroke="white" strokeWidth="0.8" />
                        <text x={cx} y={labelY} textAnchor="middle"
                            fontSize="10" fill={d.color} fontWeight="bold">
                            {d.gene}
                        </text>
                    </g>
                );
            })}

            {/* X axis */}
            <line x1={ml} x2={ml + pw} y1={mt + ph} y2={mt + ph} stroke="#888" strokeWidth="1.2" />
            {xTicks.map(x => (
                <g key={`xt${x}`}>
                    <line x1={xs(x)} x2={xs(x)} y1={mt + ph} y2={mt + ph + 5} stroke="#888" strokeWidth="1" />
                    <text x={xs(x)} y={mt + ph + 16} textAnchor="middle" fontSize="10" fill="#aaa">{x}</text>
                </g>
            ))}
            <text x={ml + pw / 2} y={H - 4} textAnchor="middle" fontSize="11" fill="#ccc">
                Log₂ Fold Change
            </text>

            {/* Y axis */}
            <line x1={ml} x2={ml} y1={mt} y2={mt + ph} stroke="#888" strokeWidth="1.2" />
            {yTicks.map(y => (
                <g key={`yt${y}`}>
                    <line x1={ml - 5} x2={ml} y1={ys(y)} y2={ys(y)} stroke="#888" strokeWidth="1" />
                    <text x={ml - 8} y={ys(y) + 4} textAnchor="end" fontSize="10" fill="#aaa">{y}</text>
                </g>
            ))}
            <text
                transform={`translate(13, ${mt + ph / 2}) rotate(-90)`}
                textAnchor="middle" fontSize="11" fill="#ccc"
            >
                −log₁₀(padj)
            </text>
        </svg>
    );
}

export default function Step9DEA({ mode }) {
    const isReplicates = mode === 'replicates';

    const data = [
        { gene: 'Gene A', color: 'var(--gene-a)', log2fc: isReplicates ? 1.77 : 2.00, pvalue: '2.39e-6' },
        { gene: 'Gene B', color: 'var(--gene-b)', log2fc: 0.00,                        pvalue: '0.972'   },
        { gene: 'Gene C', color: 'var(--gene-c)', log2fc: -1.00,                       pvalue: '8.11e-5' },
    ];

    return (
        <div className="step-container">
            <div className="matrix-area">
                <h3>Differential Expression (Log2 Fold Change)</h3>

                <div className="bar-chart">
                    {data.map(d => (
                        <div key={d.gene} className="bar-row">
                            <div className="bar-label">
                                <span className="gene-dot" style={{ backgroundColor: d.color }}></span> {d.gene}
                                {isReplicates && (
                                    <span style={{ fontSize: '0.7rem', opacity: 0.6, marginLeft: '0.5rem' }}>
                                        p = {d.pvalue}
                                    </span>
                                )}
                            </div>

                            <div className="bar-track">
                                <div className="center-line"></div>
                                {d.log2fc === 0 ? (
                                    <span style={{ position: 'absolute', left: '52%', top: '50%', transform: 'translateY(-50%)', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                                        0
                                    </span>
                                ) : d.log2fc > 0 ? (
                                    <div className="bar positive" style={{ width: `${Math.abs(d.log2fc) * 20}%`, backgroundColor: d.color }}>
                                        <span className="bar-value">+{d.log2fc}</span>
                                    </div>
                                ) : (
                                    <div className="bar negative" style={{ width: `${Math.abs(d.log2fc) * 20}%`, right: '50%', backgroundColor: d.color }}>
                                        <span className="bar-value">{d.log2fc}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {isReplicates && (
                    <>
                        {/* Statistics table */}
                        <h3 style={{ marginTop: '0.5rem' }}>Statistical Results</h3>

                        <div style={{ overflowX: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <table className="data-table" style={{ maxWidth: 560 }}>
                                <thead>
                                    <tr>
                                        <th>Gene</th>
                                        <th>Log₂FC</th>
                                        <th>pvalue</th>
                                        <th>padj</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {REPLICATE_STATS.map(d => (
                                        <tr key={d.gene}>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                <span className="gene-dot" style={{ backgroundColor: d.color }}></span>
                                                {d.gene}
                                            </td>
                                            <td style={{ fontFamily: 'monospace' }}>
                                                {d.log2fc > 0 ? '+' : ''}{d.log2fc.toFixed(2)}
                                            </td>
                                            <td style={{ fontFamily: 'monospace', color: d.pvalue < 0.05 ? '#6ee7b7' : 'var(--text-muted)' }}>
                                                {d.pvalue < 0.001 ? d.pvalue.toExponential(2) : d.pvalue.toFixed(3)}
                                            </td>
                                            <td style={{ fontFamily: 'monospace', color: d.padj < 0.05 ? '#6ee7b7' : 'var(--text-muted)' }}>
                                                {d.padj < 0.001 ? d.padj.toExponential(2) : d.padj.toFixed(3)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Volcano plot */}
                        <h3 style={{ marginTop: '0.5rem' }}>Volcano Plot</h3>
                        <div style={{ width: '100%', maxWidth: 720, background: 'var(--panel-bg)', padding: '1.25rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                            <VolcanoPlot />
                        </div>
                    </>
                )}
            </div>

            <div className="info-box success">
                <strong>Biological Conclusion:</strong>
                Gene A is UP-regulated, Gene C is DOWN-regulated, and Gene B remains unchanged.
                {isReplicates
                    ? " By comparing biological triplicates, we can see that Gene A's increase (p=2.39e-6) and Gene C's decrease (p=8.11e-5) are statistically significant, whereas Gene B's fluctuations are confirmed to be random variation."
                    : (mode === 'normalized'
                        ? " At realistic half-depth (2,507 reads), Gene B dropped to 2 raw reads, but CPM normalization properly confirmed its 1:1 stability relative to the control's 4 reads at full depth (5,010)."
                        : " In simplified mode at equal depth, the 4-vs-4 reads for Gene B directly indicate its stability.")
                }
            </div>
        </div>
    );
}

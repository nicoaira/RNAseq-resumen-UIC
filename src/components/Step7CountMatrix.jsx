import React from 'react';
import './StepMatrix.css';

export default function Step7CountMatrix({ mode }) {
    const isRealistic = mode === 'normalized';
    const isReplicates = mode === 'replicates';

    if (isReplicates) {
        return (
            <div className="step-container">
                <div className="matrix-area">
                    <h3>Raw Count Matrix (Triplicates)</h3>

                    <div style={{ overflowX: 'auto', width: '100%', marginBottom: '1rem' }}>
                        <table className="data-table replicates-table">
                            <thead>
                                <tr>
                                    <th rowSpan="2">Gene</th>
                                    <th colSpan="3" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>Control</th>
                                    <th colSpan="3" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>Treated</th>
                                </tr>
                                <tr>
                                    <th>R1</th>
                                    <th>R2</th>
                                    <th>R3</th>
                                    <th>R1</th>
                                    <th>R2</th>
                                    <th>R3</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span className="gene-dot" style={{ backgroundColor: 'var(--gene-a)' }}></span> Gene A</td>
                                    <td>2</td>
                                    <td>3</td>
                                    <td>2</td>
                                    <td>7</td>
                                    <td>8</td>
                                    <td>9</td>
                                </tr>
                                <tr>
                                    <td><span className="gene-dot" style={{ backgroundColor: 'var(--gene-b)' }}></span> Gene B</td>
                                    <td>4</td>
                                    <td>3</td>
                                    <td>4</td>
                                    <td>4</td>
                                    <td>4</td>
                                    <td>4</td>
                                </tr>
                                <tr>
                                    <td><span className="gene-dot" style={{ backgroundColor: 'var(--gene-c)' }}></span> Gene C</td>
                                    <td>4</td>
                                    <td>4</td>
                                    <td>5</td>
                                    <td>2</td>
                                    <td>2</td>
                                    <td>2</td>
                                </tr>
                                <tr className="ellipsis-row">
                                    <td>…</td>
                                    <td>…</td>
                                    <td>…</td>
                                    <td>…</td>
                                    <td>…</td>
                                    <td>…</td>
                                    <td>…</td>
                                </tr>
                                <tr>
                                    <td><span className="gene-dot" style={{ backgroundColor: 'rgba(160,170,185,0.7)' }}></span> Gene X</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>5</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>4</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>5</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>3</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>4</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>3</td>
                                </tr>
                                <tr>
                                    <td><span className="gene-dot" style={{ backgroundColor: 'rgba(160,170,185,0.7)' }}></span> Gene Y</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>3</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>4</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>3</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>4</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>3</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>4</td>
                                </tr>
                                <tr>
                                    <td><span className="gene-dot" style={{ backgroundColor: 'rgba(160,170,185,0.7)' }}></span> Gene Z</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>3</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>3</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>2</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>3</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>2</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>3</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td>Total Reads</td>
                                    <td>6234</td>
                                    <td>3891</td>
                                    <td>5487</td>
                                    <td>4102</td>
                                    <td>6518</td>
                                    <td>3734</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

            </div>
        );
    }

    const counts = {
        ctrl: { a: 2, b: 4, c: 4, others: 5000, total: 5010 },
        treated: isRealistic
            ? { a: 4, b: 2, c: 1, others: 2500, total: 2507 }
            : { a: 8, b: 4, c: 2, others: 5000, total: 5014 }
    };

    return (
        <div className="step-container">
            <div className="matrix-area">
                <h3>Raw Count Matrix</h3>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Control depth: {counts.ctrl.total} reads</span>
                    <span style={{ color: 'var(--gene-a)', fontWeight: 'bold' }}>Treated depth: {counts.treated.total} reads</span>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Gene</th>
                            <th>Control Reads</th>
                            <th>Treated Reads</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span className="gene-dot" style={{ backgroundColor: 'var(--gene-a)' }}></span> Gene A</td>
                            <td>{counts.ctrl.a}</td>
                            <td>{counts.treated.a}</td>
                        </tr>
                        <tr>
                            <td><span className="gene-dot" style={{ backgroundColor: 'var(--gene-b)' }}></span> Gene B</td>
                            <td>{counts.ctrl.b}</td>
                            <td>{counts.treated.b}</td>
                        </tr>
                        <tr>
                            <td><span className="gene-dot" style={{ backgroundColor: 'var(--gene-c)' }}></span> Gene C</td>
                            <td>{counts.ctrl.c}</td>
                            <td>{counts.treated.c}</td>
                        </tr>
                        <tr className="ellipsis-row">
                            <td>…</td>
                            <td>…</td>
                            <td>…</td>
                        </tr>
                        <tr>
                            <td><span className="gene-dot" style={{ backgroundColor: 'rgba(160,170,185,0.7)' }}></span> Gene X</td>
                            <td style={{ color: 'rgba(160,170,185,0.9)' }}>5</td>
                            <td style={{ color: 'rgba(160,170,185,0.9)' }}>3</td>
                        </tr>
                        <tr>
                            <td><span className="gene-dot" style={{ backgroundColor: 'rgba(160,170,185,0.7)' }}></span> Gene Y</td>
                            <td style={{ color: 'rgba(160,170,185,0.9)' }}>3</td>
                            <td style={{ color: 'rgba(160,170,185,0.9)' }}>4</td>
                        </tr>
                        <tr>
                            <td><span className="gene-dot" style={{ backgroundColor: 'rgba(160,170,185,0.7)' }}></span> Gene Z</td>
                            <td style={{ color: 'rgba(160,170,185,0.9)' }}>4</td>
                            <td style={{ color: 'rgba(160,170,185,0.9)' }}>2</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr className="totals-row">
                            <td>Total Reads (N)</td>
                            <td>{counts.ctrl.total}</td>
                            <td>{counts.treated.total}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="info-box">
                {isRealistic
                    ? "⚠️ Gene B (unchanged) appears as 2 vs 4! This drop is entirely due to the half-depth sequencing. CPM normalization will restore the true 1:1 ratio."
                    : "✓ Simplified mode: Both samples produced full depth. Gene B is 4 vs 4, directly reflecting its stable molecular abundance."}
            </div>
        </div>
    );
}

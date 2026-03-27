import React, { useEffect, useState } from 'react';
import './StepMatrix.css';

export default function Step5BPooling() {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="step-container">
            <div className="matrix-area">
                <h3>Equimolar Library Pooling</h3>
                <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-muted)' }}>
                    Sequencers have limited space (flowcell lanes). We load a fixed amount from each library.
                    Here, we target <strong>900 reads</strong> from Control and <strong>1,200 reads</strong> from Treated.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', opacity: animated ? 1 : 0, transition: 'opacity 1s ease' }}>
                    <table className="data-table" style={{ width: 'auto' }}>
                        <thead>
                            <tr>
                                <th colSpan="2">Control (Taking 900 / 10,900 = 8.26%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Others</td>
                                <td style={{ color: 'rgba(160,170,185,0.9)' }}>826 <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>(10,000 × 8.26%)</span></td>
                            </tr>
                            <tr>
                                <td>Gene A</td>
                                <td style={{ color: 'var(--gene-a)' }}>17 <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>(200 × 8.26%)</span></td>
                            </tr>
                            <tr>
                                <td>Gene B</td>
                                <td style={{ color: 'var(--gene-b)' }}>25 <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>(300 × 8.26%)</span></td>
                            </tr>
                            <tr>
                                <td>Gene C</td>
                                <td style={{ color: 'var(--gene-c)' }}>33 <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>(400 × 8.26%)</span></td>
                            </tr>
                            <tr className="totals-row">
                                <td>Total Sent</td>
                                <td>901 ≈ 900</td>
                            </tr>
                        </tbody>
                    </table>

                    <table className="data-table" style={{ width: 'auto' }}>
                        <thead>
                            <tr>
                                <th colSpan="2">Treated (Taking 1,200 / 11,300 = 10.62%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Others</td>
                                <td style={{ color: 'rgba(160,170,185,0.9)' }}>1,062 <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>(10,000 × 10.62%)</span></td>
                            </tr>
                            <tr>
                                <td>Gene A</td>
                                <td style={{ color: 'var(--gene-a)' }}>85 <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>(800 × 10.62%)</span></td>
                            </tr>
                            <tr>
                                <td>Gene B</td>
                                <td style={{ color: 'var(--gene-b)' }}>32 <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>(300 × 10.62%)</span></td>
                            </tr>
                            <tr>
                                <td>Gene C</td>
                                <td style={{ color: 'var(--gene-c)' }}>21 <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>(200 × 10.62%)</span></td>
                            </tr>
                            <tr className="totals-row">
                                <td>Total Sent</td>
                                <td>1,200</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="info-box" style={{ marginTop: '2rem' }}>
                <strong>Key Insight:</strong> The PCR libraries were nearly equal (10,900 vs 11,300 — only ~3.7% difference), because <em>Others</em> dominates and is unchanged.
                Yet, because the Treated library is slightly larger, we sample it at a slightly higher fraction (10.62% vs 8.26%).
                This different sub-sampling rate means even stable genes like Gene B appear at different raw counts (25 vs 32), which is why we need a <strong>Size Factor</strong> to correct for it.
            </div>
        </div>
    );
}

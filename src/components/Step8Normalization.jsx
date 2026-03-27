import React from 'react';
import './StepMatrix.css';

export default function Step8Normalization({ mode, onGoToTPM }) {
    if (mode === 'simplified') return null;

    const isReplicates = mode === 'replicates';
    const cpmWarning = (
        <div className="info-box warning step-note">
            <strong>Warning:</strong> CPM is not used as often for expression comparisons because it corrects for sequencing depth but not for gene length.
            We use it here as a simplification because it is easier to understand at first.
            {onGoToTPM && (
                <button type="button" className="step-link-button" onClick={onGoToTPM}>
                    Go to TPM Normalization
                </button>
            )}
        </div>
    );

    if (isReplicates) {
        return (
            <div className="step-container">
                <div className="matrix-area">
                    <h3>CPM Normalization (Triplicates)</h3>
                    <div className="formula-box">
                        <p>CPM = (Raw Count / Total Reads) × 1,000,000</p>
                    </div>

                    <div style={{ overflowX: 'auto', width: '100%', marginBottom: '1rem' }}>
                        <table className="data-table replicates-table">
                            <thead>
                                <tr>
                                    <th rowSpan="2">Gene</th>
                                    <th colSpan="3">Control CPM</th>
                                    <th colSpan="3">Treated CPM</th>
                                </tr>
                                <tr>
                                    <th>C1</th>
                                    <th>C2</th>
                                    <th>C3</th>
                                    <th>T1</th>
                                    <th>T2</th>
                                    <th>T3</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span className="gene-dot" style={{ backgroundColor: 'var(--gene-a)' }}></span> Gene A</td>
                                    <td>399</td>
                                    <td>598</td>
                                    <td>399</td>
                                    <td>1,196</td>
                                    <td>1,596</td>
                                    <td>1,994</td>
                                </tr>
                                <tr>
                                    <td><span className="gene-dot" style={{ backgroundColor: 'var(--gene-b)' }}></span> Gene B</td>
                                    <td>798</td>
                                    <td>598</td>
                                    <td>798</td>
                                    <td>798</td>
                                    <td>798</td>
                                    <td>798</td>
                                </tr>
                                <tr>
                                    <td><span className="gene-dot" style={{ backgroundColor: 'var(--gene-c)' }}></span> Gene C</td>
                                    <td>798</td>
                                    <td>798</td>
                                    <td>998</td>
                                    <td>399</td>
                                    <td>399</td>
                                    <td>398</td>
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
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>998</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>798</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>998</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>598</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>798</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>598</td>
                                </tr>
                                <tr>
                                    <td><span className="gene-dot" style={{ backgroundColor: 'rgba(160,170,185,0.7)' }}></span> Gene Y</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>599</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>798</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>599</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>798</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>599</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>798</td>
                                </tr>
                                <tr>
                                    <td><span className="gene-dot" style={{ backgroundColor: 'rgba(160,170,185,0.7)' }}></span> Gene Z</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>599</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>599</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>399</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>598</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>399</td>
                                    <td style={{ color: 'rgba(160,170,185,0.9)' }}>598</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td>Total CPM</td>
                                    <td>1,000,000</td>
                                    <td>1,000,000</td>
                                    <td>1,000,000</td>
                                    <td>1,000,000</td>
                                    <td>1,000,000</td>
                                    <td>1,000,000</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                </div>

                <div className="info-box success">
                    <strong>Corrected!</strong> By normalizing each library by its own total read count, we removed the technical depth difference. Now we can compare the groups directly! Notice the variations between replicates (the biological noise).
                </div>

                {cpmWarning}
            </div>
        );
    }

    return (
        <div className="step-container">
            <div className="matrix-area">
                <h3>CPM Normalization</h3>

                <div className="formula-box">
                    <p>Counts Per Million (CPM) = (Raw Count / Total Reads) × 1,000,000</p>
                </div>

                <table className="data-table normalized-table">
                    <thead>
                        <tr>
                            <th>Gene</th>
                            <th>Control CPM</th>
                            <th>Treated CPM</th>
                            <th>Ratio (T/C)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span className="gene-dot" style={{ backgroundColor: 'var(--gene-a)' }}></span> Gene A</td>
                            <td>399 <span className="math-hint">(2/5,010)</span></td>
                            <td>1,595 <span className="math-hint">(4/2,507)</span></td>
                            <td className="success"><b>1,595 / 399 ≈ 4</b></td>
                        </tr>
                        <tr>
                            <td><span className="gene-dot" style={{ backgroundColor: 'var(--gene-b)' }}></span> Gene B</td>
                            <td>798 <span className="math-hint">(4/5,010)</span></td>
                            <td>798 <span className="math-hint">(2/2,507)</span></td>
                            <td className="success"><b>798 / 798 ≈ 1</b></td>
                        </tr>
                        <tr>
                            <td><span className="gene-dot" style={{ backgroundColor: 'var(--gene-c)' }}></span> Gene C</td>
                            <td>798 <span className="math-hint">(4/5,010)</span></td>
                            <td>399 <span className="math-hint">(1/2,507)</span></td>
                            <td className="success"><b>399 / 798 ≈ 0.5</b></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="info-box success">
                <strong>Corrected!</strong> By normalizing relative to sequencing depth, we see that Gene B is actually stable (a ratio of **1**). This accounts for the technical variation in the flowcell and recovers the true **4×** increase of Gene A!
            </div>

            {cpmWarning}
        </div>
    );
}

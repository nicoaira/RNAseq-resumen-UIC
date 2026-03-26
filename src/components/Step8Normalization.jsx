import React from 'react';
import './StepMatrix.css';

export default function Step8Normalization() {
    return (
        <div className="step-container">
            <div className="matrix-area">
                <h3>Depth-Normalized Count Matrix (CPM)</h3>
                <table className="data-table normalized-table">
                    <thead>
                        <tr>
                            <th>Gene</th>
                            <th>Control (CPM)</th>
                            <th>Treated (CPM)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span className="gene-dot" style={{ backgroundColor: 'var(--gene-a)' }}></span> Gene A</td>
                            <td>222,222 <span className="math-hint">(2k ÷ 9k)</span></td>
                            <td>615,384 <span className="math-hint">(8k ÷ 13k)</span></td>
                        </tr>
                        <tr>
                            <td><span className="gene-dot" style={{ backgroundColor: 'var(--gene-b)' }}></span> Gene B</td>
                            <td>333,333 <span className="math-hint">(3k ÷ 9k)</span></td>
                            <td>230,769 <span className="math-hint">(3k ÷ 13k)</span></td>
                        </tr>
                        <tr>
                            <td><span className="gene-dot" style={{ backgroundColor: 'var(--gene-c)' }}></span> Gene C</td>
                            <td>444,444 <span className="math-hint">(4k ÷ 9k)</span></td>
                            <td>153,846 <span className="math-hint">(2k ÷ 13k)</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="info-box">
                <strong>Normalization:</strong> We divided each gene count by the total sequencing depth to get Counts Per Million (CPM). Now the values are perfectly comparable across conditions! Gene B, which was unchanged, now correctly shows a slight drop because Gene A stole a larger fraction of the finite sequencing space.
            </div>
        </div>
    );
}

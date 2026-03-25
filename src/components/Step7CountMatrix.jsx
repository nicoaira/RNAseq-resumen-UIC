import React from 'react';
import './StepMatrix.css';

export default function Step7CountMatrix() {
    return (
        <div className="step-container">
            <div className="matrix-area">
                <h3>Raw Count Matrix</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Gene</th>
                            <th>Control Counts</th>
                            <th>Treated Counts</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span className="gene-dot" style={{ backgroundColor: 'var(--gene-a)' }}></span> Gene A</td>
                            <td>3000</td>
                            <td>6000</td>
                        </tr>
                        <tr>
                            <td><span className="gene-dot" style={{ backgroundColor: 'var(--gene-b)' }}></span> Gene B</td>
                            <td>3000</td>
                            <td>3000</td>
                        </tr>
                        <tr>
                            <td><span className="gene-dot" style={{ backgroundColor: 'var(--gene-c)' }}></span> Gene C</td>
                            <td>4000</td>
                            <td>2000</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr className="totals-row">
                            <td>Total Sequencing Depth</td>
                            <td>10,000</td>
                            <td>11,000</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="info-box">
                Notice that the Treated sample got slightly more reads in total (11,000 vs 10,000). We must correct for this sequencing depth difference before comparing the samples!
            </div>
        </div>
    );
}

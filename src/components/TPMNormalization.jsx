import React from 'react';
import './TPMNormalization.css';

const geneACopies = 4;
const geneBCopies = 4;
const geneAFragmentsPerCopy = 4;
const geneBFragmentsPerCopy = 12;
const sample2SequencedGeneBFragments = 24;

function renderCopies(className, color, copies) {
    return Array.from({ length: copies }).map((_, index) => (
        <div
            key={`${className}-${index}`}
            className={`tpm-rna ${className}`}
            style={{ '--color': color }}
        ></div>
    ));
}

function renderFragmentRows(sizeClass, color, rows, fragmentsPerRow, sequencedCount = rows * fragmentsPerRow) {
    let seen = 0;

    return Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`${color}-${rowIndex}`} className={`tpm-fragments-inline ${sizeClass}`}>
            {Array.from({ length: fragmentsPerRow }).map((_, fragmentIndex) => {
                const isSequenced = seen < sequencedCount;
                seen += 1;

                return (
                    <div
                        key={`${rowIndex}-${fragmentIndex}`}
                        className={`tpm-fragment${isSequenced ? '' : ' unsequenced'}`}
                        style={{ '--color': color }}
                    ></div>
                );
            })}
        </div>
    ));
}

export default function TPMNormalization() {
    return (
        <div className="tpm-container">
            <h2>Understanding TPM (Transcripts Per Kilobase Million) Normalization</h2>
            <p className="tpm-intro">
                In RNA-seq, longer transcripts produce more fragments (and thus more reads) than shorter transcripts, even if they have the exact same number of copies in the cell.
                TPM normalization corrects for both <strong>gene length</strong> and <strong>sequencing depth</strong>.
            </p>

            <section className="tpm-section">
                <h3>Case 1: Same Copy Number, Different Lengths</h3>
                <p>Both genes have exactly 4 copies in the cell and are fragmented into 250 bp pieces.</p>

                <div className="tpm-comparison">
                    <div className="tpm-gene-box">
                        <h4>Gene A (Short, 1 kb)</h4>
                        <div className="tpm-rna-list" style={{ alignItems: 'center' }}>
                            {renderCopies('short', 'var(--gene-a)', geneACopies)}
                        </div>
                        <p>4 Copies</p>
                        <div className="tpm-arrow">▼ Fragmentation into 250 bp pieces</div>
                        <div className="tpm-rna-list" style={{ alignItems: 'center', gap: '8px' }}>
                            {renderFragmentRows('short', 'var(--gene-a)', geneACopies, geneAFragmentsPerCopy)}
                        </div>
                        <p>4 fragments per copy → 16 reads total</p>
                    </div>

                    <div className="tpm-gene-box">
                        <h4>Gene B (Long, 3 kb)</h4>
                        <div className="tpm-rna-list" style={{ alignItems: 'center' }}>
                            {renderCopies('long', 'var(--gene-b)', geneBCopies)}
                        </div>
                        <p>4 Copies</p>
                        <div className="tpm-arrow">▼ Fragmentation into 250 bp pieces</div>
                        <div className="tpm-rna-list" style={{ alignItems: 'center', gap: '8px' }}>
                            {renderFragmentRows('long', 'var(--gene-b)', geneBCopies, geneBFragmentsPerCopy)}
                        </div>
                        <p>12 fragments per copy → 48 reads total</p>
                    </div>
                </div>

                <div className="info-box warning">
                    <strong>Problem:</strong> Looking just at raw reads, it seems like Gene B (48 reads) is expressed 3x more than Gene A (16 reads), even though they both have 4 copies.
                </div>

                <div className="tpm-step-box">
                    <h4>Step 1: Normalize by Length (Reads per Kilobase, RPK)</h4>
                    <p>We divide the number of reads by the length of the gene in kilobases (kb).</p>
                    <ul className="tpm-math">
                        <li><strong>Gene A RPK:</strong> 16 reads / 1 kb = <strong>16</strong></li>
                        <li><strong>Gene B RPK:</strong> 48 reads / 3 kb = <strong>16</strong></li>
                    </ul>
                </div>

                <div className="info-box success">
                    <strong>Solved!</strong> Applying length normalization reveals both genes are equally expressed.
                </div>
            </section>

            <section className="tpm-section">
                <h3>Case 2: Same Molecules, Different Sequencing Depth</h3>
                <p>
                    Both samples start with the same fragment counts as Case 1. Sample 2 is sequenced at half the depth of Sample 1, so only half of Gene B&apos;s fragments are observed.
                    The gray fragments represent molecules that exist but were not sequenced.
                </p>

                <div className="tpm-comparison">
                    <div className="tpm-gene-box">
                        <h4>Sample 1 (Full Depth)</h4>
                        <p>Gene A (1 kb), 4 copies</p>
                        <div className="tpm-rna-list" style={{ alignItems: 'center' }}>
                            {renderCopies('short', 'var(--gene-a)', geneACopies)}
                        </div>
                        <div className="tpm-arrow">▼ Fragmentation into 250 bp pieces</div>
                        <div className="tpm-rna-list" style={{ alignItems: 'center', gap: '8px' }}>
                            {renderFragmentRows('short', 'var(--gene-a)', geneACopies, geneAFragmentsPerCopy)}
                        </div>
                        <p><strong>Total fragments:</strong> 16</p>
                        <p><strong>Sequenced reads:</strong> 16</p>
                        <p><strong>RPK:</strong> 16 / 1 kb = 16</p>
                    </div>

                    <div className="tpm-gene-box">
                        <h4>Sample 2 (Half Depth)</h4>
                        <p>Gene B (3 kb), 4 copies</p>
                        <div className="tpm-rna-list" style={{ alignItems: 'center' }}>
                            {renderCopies('long', 'var(--gene-b)', geneBCopies)}
                        </div>
                        <div className="tpm-arrow">▼ Fragmentation into 250 bp pieces</div>
                        <div className="tpm-rna-list" style={{ alignItems: 'center', gap: '8px' }}>
                            {renderFragmentRows('long', 'var(--gene-b)', geneBCopies, geneBFragmentsPerCopy, sample2SequencedGeneBFragments)}
                        </div>
                        <p><strong>Total fragments:</strong> 48</p>
                        <p><strong>Sequenced reads:</strong> 24</p>
                        <p><strong>RPK:</strong> 24 / 3 kb = 8</p>
                    </div>
                </div>

                <div className="info-box warning">
                    <strong>Problem:</strong> Even after length normalization, Sample 2 looks lower because half the Gene B fragments were never sequenced. Raw reads are 24 vs 16, but the RPK values are 8 vs 16 purely because of sequencing depth.
                </div>

                <div className="tpm-step-box">
                    <h4>Step 2: Normalize by Depth (TPM)</h4>
                    <p>We divide each gene&apos;s RPK by the sample-specific scaling factor derived from the total RPK in that sample.</p>
                    <ul className="tpm-math">
                        <li>Assume Sample 1 total RPK sum = 4,000. Scaling factor = 4,000 / 1,000,000 = <strong>0.004</strong></li>
                        <li>Assume Sample 2 total RPK sum = 2,000. Scaling factor = 2,000 / 1,000,000 = <strong>0.002</strong></li>
                        <li><strong>Sample 1 TPM (Gene A):</strong> 16 / 0.004 = <strong>4,000</strong></li>
                        <li><strong>Sample 2 TPM (Gene B):</strong> 8 / 0.002 = <strong>4,000</strong></li>
                    </ul>
                </div>

                <div className="info-box success">
                    <strong>Final Result:</strong> TPM accounts for both gene length and sequencing depth. Even though only half of Sample 2&apos;s Gene B fragments were sequenced, the final TPM correctly shows that both genes had the same underlying abundance.
                </div>
            </section>
        </div>
    );
}

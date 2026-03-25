import React from 'react';
import './Step6SamViewer.css';

export default function Step6SamViewer() {
    const samLines = [
        { qname: 'SEQ_MOCK_1', flag: '99', rname: 'Gene_A', pos: '1', mapq: '60', cigar: '8M', seq: 'ATGCGTAC', qual: 'IIIIIIII', color: 'var(--gene-a)' },
        { qname: 'SEQ_MOCK_2', flag: '99', rname: 'Gene_B', pos: '1', mapq: '60', cigar: '8M', seq: 'TACGATCG', qual: 'IIIIIIII', color: 'var(--gene-b)' },
        { qname: 'SEQ_MOCK_3', flag: '147', rname: 'Gene_C', pos: '1', mapq: '60', cigar: '8M', seq: 'GGCCTAAT', qual: 'IIIIIIII', color: 'var(--gene-c)' },
        { qname: 'SEQ_MOCK_4', flag: '147', rname: 'Gene_A', pos: '1', mapq: '60', cigar: '8M', seq: 'ATGCGTAC', qual: 'IIIIIIII', color: 'var(--gene-a)' },
        { qname: 'SEQ_MOCK_5', flag: '99', rname: 'Gene_C', pos: '1', mapq: '60', cigar: '8M', seq: 'GGCCTAAT', qual: 'IIIIIIII', color: 'var(--gene-c)' },
    ];

    return (
        <div className="step-container">
            <div className="sam-viewer-area">
                <div className="sam-header">
                    <div>@HD VN:1.6 SO:coordinate</div>
                    <div>@SQ SN:Gene_A LN:1000</div>
                    <div>@SQ SN:Gene_B LN:1500</div>
                    <div>@SQ SN:Gene_C LN:1200</div>
                    <div>@PG ID:mock_aligner VN:1.0.0</div>
                </div>

                <div className="sam-table">
                    <div className="sam-row sam-th">
                        <span className="col-qname">QNAME</span>
                        <span className="col-flag">FLAG</span>
                        <span className="col-rname">RNAME</span>
                        <span className="col-pos">POS</span>
                        <span className="col-mapq">MAPQ</span>
                        <span className="col-cigar">CIGAR</span>
                        <span className="col-seq">SEQ</span>
                        <span className="col-qual">QUAL</span>
                    </div>
                    {samLines.map((line, i) => (
                        <div key={i} className="sam-row" style={{ borderLeftColor: line.color }}>
                            <span className="col-qname" style={{ color: line.color }}>{line.qname}</span>
                            <span className="col-flag">{line.flag}</span>
                            <span className="col-rname" style={{ color: line.color, fontWeight: 'bold' }}>{line.rname}</span>
                            <span className="col-pos">{line.pos}</span>
                            <span className="col-mapq">{line.mapq}</span>
                            <span className="col-cigar">{line.cigar}</span>
                            <span className="col-seq" style={{ color: line.color }}>{line.seq}</span>
                            <span className="col-qual">{line.qual}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="info-box" style={{ marginTop: '2rem' }}>
                <strong>SAM Format:</strong> The Sequence Alignment/Map format stores our aligned reads. Notice how each line corresponds to a read, and because we aligned them, they have regained their identity (RNAME) and color!
            </div>
        </div>
    );
}

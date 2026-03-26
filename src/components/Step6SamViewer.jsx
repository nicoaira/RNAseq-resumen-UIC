import React from 'react';
import './Step6SamViewer.css';

const SamPanel = ({ title, lines, isTreated }) => {
    return (
        <div className={`sam-panel ${isTreated ? 'treated-sam' : 'control-sam'}`}>
            <h3>{title}</h3>
            <div className="sam-viewer-area">
                <div className="sam-header">
                    <div>@HD VN:1.6 SO:coordinate</div>
                    <div>@SQ SN:Gene_A LN:1000</div>
                    <div>@SQ SN:Gene_B LN:1500</div>
                    <div>@SQ SN:Gene_C LN:1200</div>
                </div>

                <div className="sam-table">
                    <div className="sam-row sam-th">
                        <span className="col-qname">QNAME</span>
                        <span className="col-flag">FLAG</span>
                        <span className="col-rname">RNAME</span>
                        <span className="col-pos">POS</span>
                        <span className="col-mapq">MAPQ</span>
                        <span className="col-seq">SEQ</span>
                    </div>
                    {lines.map((line, i) => (
                        <div key={i} className="sam-row" style={{ borderLeftColor: line.color }}>
                            <span className="col-qname" style={{ color: line.color }}>{line.qname}</span>
                            <span className="col-flag">{line.flag}</span>
                            <span className="col-rname" style={{ color: line.color, fontWeight: 'bold' }}>{line.rname}</span>
                            <span className="col-pos">{line.pos}</span>
                            <span className="col-mapq">{line.mapq}</span>
                            <span className="col-seq" style={{ color: line.color }}>{line.seq}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function Step6SamViewer() {
    // Control: 2A, 3B, 4C
    const controlLines = [
        { qname: 'CTRL_2', flag: '99', rname: 'Gene_A', pos: '1', mapq: '60', seq: 'ATGCGTAC', color: 'var(--gene-a)' },
        { qname: 'CTRL_3', flag: '147', rname: 'Gene_A', pos: '1', mapq: '60', seq: 'ATGCGTAC', color: 'var(--gene-a)' },
        { qname: 'CTRL_4', flag: '99', rname: 'Gene_B', pos: '1', mapq: '60', seq: 'TACGATCG', color: 'var(--gene-b)' },
        { qname: 'CTRL_5', flag: '147', rname: 'Gene_B', pos: '1', mapq: '60', seq: 'TACGATCG', color: 'var(--gene-b)' },
        { qname: 'CTRL_6', flag: '99', rname: 'Gene_B', pos: '1', mapq: '60', seq: 'TACGATCG', color: 'var(--gene-b)' },
        { qname: 'CTRL_7', flag: '147', rname: 'Gene_C', pos: '1', mapq: '60', seq: 'GGCCTAAT', color: 'var(--gene-c)' },
        { qname: 'CTRL_8', flag: '99', rname: 'Gene_C', pos: '1', mapq: '60', seq: 'GGCCTAAT', color: 'var(--gene-c)' },
        { qname: 'CTRL_9', flag: '147', rname: 'Gene_C', pos: '1', mapq: '60', seq: 'GGCCTAAT', color: 'var(--gene-c)' },
        { qname: 'CTRL_10', flag: '99', rname: 'Gene_C', pos: '1', mapq: '60', seq: 'GGCCTAAT', color: 'var(--gene-c)' },
    ];

    // Treated: 8A, 3B, 2C
    const treatedLines = [
        { qname: 'TREAT_1', flag: '99', rname: 'Gene_A', pos: '1', mapq: '60', seq: 'ATGCGTAC', color: 'var(--gene-a)' },
        { qname: 'TREAT_2', flag: '147', rname: 'Gene_A', pos: '1', mapq: '60', seq: 'ATGCGTAC', color: 'var(--gene-a)' },
        { qname: 'TREAT_3', flag: '99', rname: 'Gene_A', pos: '1', mapq: '60', seq: 'ATGCGTAC', color: 'var(--gene-a)' },
        { qname: 'TREAT_4', flag: '147', rname: 'Gene_A', pos: '1', mapq: '60', seq: 'ATGCGTAC', color: 'var(--gene-a)' },
        { qname: 'TREAT_5', flag: '99', rname: 'Gene_A', pos: '1', mapq: '60', seq: 'ATGCGTAC', color: 'var(--gene-a)' },
        { qname: 'TREAT_6', flag: '147', rname: 'Gene_A', pos: '1', mapq: '60', seq: 'ATGCGTAC', color: 'var(--gene-a)' },
        { qname: 'TREAT_7', flag: '99', rname: 'Gene_A', pos: '1', mapq: '60', seq: 'ATGCGTAC', color: 'var(--gene-a)' },
        { qname: 'TREAT_8', flag: '147', rname: 'Gene_A', pos: '1', mapq: '60', seq: 'ATGCGTAC', color: 'var(--gene-a)' },
        { qname: 'TREAT_9', flag: '99', rname: 'Gene_B', pos: '1', mapq: '60', seq: 'TACGATCG', color: 'var(--gene-b)' },
        { qname: 'TREAT_10', flag: '147', rname: 'Gene_B', pos: '1', mapq: '60', seq: 'TACGATCG', color: 'var(--gene-b)' },
        { qname: 'TREAT_11', flag: '99', rname: 'Gene_B', pos: '1', mapq: '60', seq: 'TACGATCG', color: 'var(--gene-b)' },
        { qname: 'TREAT_12', flag: '147', rname: 'Gene_C', pos: '1', mapq: '60', seq: 'GGCCTAAT', color: 'var(--gene-c)' },
        { qname: 'TREAT_13', flag: '99', rname: 'Gene_C', pos: '1', mapq: '60', seq: 'GGCCTAAT', color: 'var(--gene-c)' },
    ];

    return (
        <div className="step-container">
            <div className="dual-sam">
                <SamPanel title="Control SAM" lines={controlLines} isTreated={false} />
                <SamPanel title="Treated SAM" lines={treatedLines} isTreated={true} />
            </div>
            <div className="info-box" style={{ marginTop: '1.5rem' }}>
                <strong>SAM Format:</strong> Each row is an aligned read. The RNAME column tells us which gene it mapped to. Notice the Treated sample has many more Gene A (red) rows!
            </div>
        </div>
    );
}

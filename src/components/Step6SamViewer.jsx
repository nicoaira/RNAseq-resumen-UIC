import React from 'react';
import './Step6SamViewer.css';

const SamLine = ({ line }) => {
    return (
        <div className="sam-row">
            <span className="col-qname" style={{ color: line.color || '#94a3b8', opacity: line.rname === '*' ? 0.6 : 1 }}>{line.qname}</span>
            <span className="col-flag">{line.flag}</span>
            <span className="col-rname" style={{ color: line.color || '#94a3b8' }}>{line.rname}</span>
            <span className="col-pos">{line.pos}</span>
            <span className="col-mapq">{line.mapq}</span>
            <span className="col-seq" style={{ color: line.color || '#94a3b8', opacity: line.rname === '*' ? 0.6 : 1 }}>{line.seq}</span>
        </div>
    );
};

const SamFile = ({ title, lines }) => {
    return (
        <div className="sam-panel">
            <h3>{title}</h3>
            <div className="sam-viewer-area">
                <div className="sam-header">
                    <div>@HD VN:1.6 SO:coordinate</div>
                    <div>@SQ SN:Gene_A LN:16</div>
                    <div>@SQ SN:Gene_B LN:18</div>
                    <div>@SQ SN:Gene_C LN:20</div>
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
                        <SamLine key={i} line={line} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function Step6SamViewer({ mode }) {
    // Control: 1A, 2B, 1C, 5 Others (Total 9)
    const controlLines = [
        { qname: 'CTRL_2', flag: '0', rname: 'Gene_A', pos: '1', mapq: '60', seq: 'ATGCGTA', color: 'var(--gene-a)' },
        { qname: 'CTRL_3', flag: '0', rname: 'Gene_B', pos: '1', mapq: '60', seq: 'TACGATC', color: 'var(--gene-b)' },
        { qname: 'CTRL_7', flag: '0', rname: 'Gene_B', pos: '1', mapq: '60', seq: 'TACGATC', color: 'var(--gene-b)' },
        { qname: 'CTRL_4', flag: '0', rname: 'Gene_C', pos: '1', mapq: '60', seq: 'GGCCTAA', color: 'var(--gene-c)' },
        { qname: 'CTRL_1', flag: '4', rname: '*', pos: '0', mapq: '0', seq: 'GCTAGCT' },
        { qname: 'CTRL_5', flag: '4', rname: '*', pos: '0', mapq: '0', seq: 'AAGCTTC' },
        { qname: 'CTRL_6', flag: '4', rname: '*', pos: '0', mapq: '0', seq: 'TTCGGAA' },
        { qname: 'CTRL_8', flag: '4', rname: '*', pos: '0', mapq: '0', seq: 'CCGATAA' },
        { qname: 'CTRL_9', flag: '4', rname: '*', pos: '0', mapq: '0', seq: 'GGATCGA' },
    ];

    // Treated: 5A, 3B, 1C, 3 Others (Total 12)
    const treatedLines = [
        { qname: 'TREAT_1', flag: '0', rname: 'Gene_A', pos: '1', mapq: '60', seq: 'ATGCGTA', color: 'var(--gene-a)' },
        { qname: 'TREAT_2', flag: '0', rname: 'Gene_A', pos: '1', mapq: '60', seq: 'ATGCGTA', color: 'var(--gene-a)' },
        { qname: 'TREAT_5', flag: '0', rname: 'Gene_A', pos: '1', mapq: '60', seq: 'ATGCGTA', color: 'var(--gene-a)' },
        { qname: 'TREAT_6', flag: '0', rname: 'Gene_A', pos: '1', mapq: '60', seq: 'ATGCGTA', color: 'var(--gene-a)' },
        { qname: 'TREAT_8', flag: '0', rname: 'Gene_A', pos: '1', mapq: '60', seq: 'ATGCGTA', color: 'var(--gene-a)' },
        { qname: 'TREAT_3', flag: '0', rname: 'Gene_B', pos: '1', mapq: '60', seq: 'TACGATC', color: 'var(--gene-b)' },
        { qname: 'TREAT_7', flag: '0', rname: 'Gene_B', pos: '1', mapq: '60', seq: 'TACGATC', color: 'var(--gene-b)' },
        { qname: 'TREAT_9', flag: '0', rname: 'Gene_B', pos: '1', mapq: '60', seq: 'TACGATC', color: 'var(--gene-b)' },
        { qname: 'TREAT_4', flag: '0', rname: 'Gene_C', pos: '1', mapq: '60', seq: 'GGCCTAA', color: 'var(--gene-c)' },
        { qname: 'TREAT_10', flag: '4', rname: '*', pos: '0', mapq: '0', seq: 'TTCGGAA' },
        { qname: 'TREAT_11', flag: '4', rname: '*', pos: '0', mapq: '0', seq: 'AAGCTTC' },
        { qname: 'TREAT_12', flag: '4', rname: '*', pos: '0', mapq: '0', seq: 'GGATCGA' },
    ];

    return (
        <div className="step-container">
            <div className="dual-sam">
                <SamFile title="Control SAM" lines={controlLines} />
                <SamFile title="Treated SAM" lines={treatedLines} />
            </div>
        </div>
    );
}

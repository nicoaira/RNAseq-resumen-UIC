import { useState, useEffect } from 'react';
import './Step5Alignment.css';
import './Step6SamViewer.css';
import {
    REFERENCES,
    CONTROL_STD, TREATED_STD, TREATED_NORMALIZED,
    CONTROL_REPLICATES, TREATED_REPLICATES,
} from '../data/reads';

const CHAR_W = 1;

function SamModal({ title, alignedReads, unmappedReads, onClose }) {
    const refColor = r => REFERENCES.find(ref => ref.id === r.targetRef)?.color ?? '#94a3b8';
    return (
        <div className="sam-modal-overlay" onClick={onClose}>
            <div className="sam-modal" onClick={e => e.stopPropagation()}>
                <div className="sam-modal-header">
                    <span>{title} — SAM Output</span>
                    <button className="sam-close-btn" onClick={onClose}>✕</button>
                </div>
                <div className="sam-viewer-area">
                    <div className="sam-header">
                        <div>@HD VN:1.6 SO:coordinate</div>
                        {REFERENCES.map(ref => (
                            <div key={ref.id}>@SQ SN:Gene_{ref.id} LN:{ref.seq.length}</div>
                        ))}
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
                        {alignedReads.map((r, i) => (
                            <div key={i} className="sam-row">
                                <span className="col-qname" style={{ color: refColor(r) }}>{r.id}</span>
                                <span className="col-flag">0</span>
                                <span className="col-rname" style={{ color: refColor(r) }}>Gene_{r.targetRef}</span>
                                <span className="col-pos">{r.offset + 1}</span>
                                <span className="col-mapq">60</span>
                                <span className="col-seq" style={{ color: refColor(r) }}>{r.seq}</span>
                            </div>
                        ))}
                        {unmappedReads.map((r, i) => (
                            <div key={`u${i}`} className="sam-row">
                                <span className="col-qname" style={{ opacity: 0.5 }}>{r.id}</span>
                                <span className="col-flag">4</span>
                                <span className="col-rname" style={{ opacity: 0.5 }}>*</span>
                                <span className="col-pos">0</span>
                                <span className="col-mapq">0</span>
                                <span className="col-seq" style={{ opacity: 0.5 }}>{r.seq}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function AlignmentPanel({ title, reads, isTreated, isReplicates, repIdx, onNext, onPrev }) {
    const [alignedReads, setAlignedReads] = useState([]);
    const [started, setStarted] = useState(false);
    const [showSam, setShowSam] = useState(false);

    // Reset when replicate changes
    useEffect(() => {
        setAlignedReads([]);
        setStarted(false);
        setShowSam(false);
    }, [repIdx]);

    const startAlignment = () => {
        setStarted(true);
        setAlignedReads([]);
        reads.forEach(read => {
            setTimeout(() => {
                if (read.targetRef) setAlignedReads(prev => [...prev, read]);
            }, read.delay);
        });
    };

    const targetReadCount = reads.filter(r => r.targetRef).length;
    const totalAligned = alignedReads.length;
    const done = totalAligned === targetReadCount && started;

    return (
        <div className={`alignment-panel ${isTreated ? 'treated-alignment' : 'control-alignment'}`}>
            {showSam && (
                <SamModal
                    title={title}
                    alignedReads={alignedReads}
                    unmappedReads={reads.filter(r => !r.targetRef)}
                    onClose={() => setShowSam(false)}
                />
            )}
            <div className="rep-nav">
                {isReplicates && <button onClick={onPrev} className="nav-btn">←</button>}
                <span className="rep-indicator">{title}</span>
                {isReplicates && <button onClick={onNext} className="nav-btn">→</button>}
            </div>

            <div className="align-row">
                <button className="align-btn" onClick={startAlignment} disabled={started && !done}>
                    {!started ? 'Align' : done ? '✓ Done' : `Aligning...`}
                </button>
                <button className="sam-output-btn" onClick={() => setShowSam(true)} disabled={alignedReads.length === 0}>
                    SAM output
                </button>
            </div>

            <div className="ref-and-pool">
                <div className="reference-genome">
                    {REFERENCES.map(ref => (
                        <div key={ref.id} className="reference-track">
                            <div className="ref-name" style={{ color: ref.color }}>
                                Gene {ref.id}
                                <span className="ref-count">({alignedReads.filter(r => r.targetRef === ref.id).length} reads)</span>
                            </div>
                            <div className="ref-seq-wrapper">
                                <div className="ref-seq">{ref.seq}</div>
                                <div className="mapped-reads-area">
                                    {alignedReads.filter(r => r.targetRef === ref.id).map((r, i) => (
                                        <div key={i} className="mapped-read" style={{ backgroundColor: ref.color, marginLeft: `${r.offset * CHAR_W}ch` }}>{r.seq}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="fastq-pool">
                    <div className="pool-title">{started ? "Unmapped" : "Reads"}</div>
                    <div className="pool-list">
                        {reads.map(r => {
                            const isAligned = alignedReads.find(ar => ar.id === r.id);
                            return (
                                <div key={r.id} className={`pool-read ${isAligned ? 'hidden' : ''} ${started && !r.targetRef ? 'other-read' : ''}`}>
                                    {r.seq}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

const ConditionBox = ({ children }) => (
    <div className="condition-panel" style={{ padding: '0.5rem' }}>
        <div className="condition-content">
            {children}
        </div>
    </div>
);

export default function Step5Alignment({ mode }) {
    const isReplicates = mode === 'replicates';
    const isRealistic = mode === 'normalized';
    const [ctrlIdx, setCtrlIdx] = useState(0);
    const [treatedIdx, setTreatedIdx] = useState(0);

    const nextCtrl = () => setCtrlIdx((ctrlIdx + 1) % 3);
    const prevCtrl = () => setCtrlIdx((ctrlIdx + 2) % 3);
    const nextTreated = () => setTreatedIdx((treatedIdx + 1) % 3);
    const prevTreated = () => setTreatedIdx((treatedIdx + 2) % 3);

    const ctrlReads = isReplicates ? CONTROL_REPLICATES[ctrlIdx] : CONTROL_STD;
    const treatedReads = isReplicates ? TREATED_REPLICATES[treatedIdx] : (isRealistic ? TREATED_NORMALIZED : TREATED_STD);

    return (
        <div className="step-container">
            <div className="dual-alignment" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%' }}>
                <ConditionBox>
                    <AlignmentPanel
                        title={isReplicates ? `Control R${ctrlIdx + 1}` : "Control"}
                        reads={ctrlReads}
                        isTreated={false}
                        isReplicates={isReplicates}
                        repIdx={ctrlIdx}
                        onNext={nextCtrl}
                        onPrev={prevCtrl}
                    />
                </ConditionBox>
                <ConditionBox>
                    <AlignmentPanel
                        title={isReplicates ? `Treated R${treatedIdx + 1}` : "Treated"}
                        reads={treatedReads}
                        isTreated={true}
                        isReplicates={isReplicates}
                        repIdx={treatedIdx}
                        onNext={nextTreated}
                        onPrev={prevTreated}
                    />
                </ConditionBox>
            </div>
        </div>
    );
}

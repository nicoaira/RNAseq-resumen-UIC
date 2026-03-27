import React from 'react';
import './Step5PCR.css';

const ADAPTER_COLOR = '#00d2ff';

const PCRTube = ({ genes, small }) => {
    return (
        <div className={`pcr-tube-item ${small ? 'small-pcr-item' : ''}`}>
            <div className={`pcr-tube ${small ? 'small-pcr-tube' : ''}`}>
                <div className="pcr-liquid"></div>
                <div className="pcr-genes">
                    {genes.map((g, i) => {
                        const isOthers = g.id === 'Others';
                        const adapterSize = small ? 2 : 4;
                        const totalWidth = isOthers ? (small ? 4 : 12) : (small ? 8 : 20);
                        return (
                            <div
                                key={i}
                                className="cdna-strand-pcr"
                                style={{
                                    left: `${10 + Math.random() * 80}%`,
                                    top: `${25 + Math.random() * 65}%`,
                                    width: `${totalWidth}px`,
                                    height: '2px',
                                    borderRadius: '1px',
                                    transform: `rotate(${Math.random() * 180}deg)`,
                                    opacity: isOthers ? 0.3 : 0.9,
                                    display: 'flex',
                                    alignItems: 'center',
                                    overflow: 'hidden',
                                }}
                            >
                                {!isOthers && (
                                    <div style={{
                                        width: `${adapterSize}px`,
                                        height: '2px',
                                        backgroundColor: ADAPTER_COLOR,
                                        flexShrink: 0,
                                        boxShadow: `0 0 3px ${ADAPTER_COLOR}`,
                                    }} />
                                )}
                                <div style={{
                                    flex: 1,
                                    height: '2px',
                                    backgroundColor: g.color,
                                    boxShadow: `0 0 5px ${g.color}`,
                                }} />
                                {!isOthers && (
                                    <div style={{
                                        width: `${adapterSize}px`,
                                        height: '2px',
                                        backgroundColor: ADAPTER_COLOR,
                                        flexShrink: 0,
                                        boxShadow: `0 0 3px ${ADAPTER_COLOR}`,
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            {small && <div className="tube-label">Rep {small}</div>}
        </div>
    );
};

const ConditionBox = ({ title, children, legend }) => {
    return (
        <div className="condition-panel">
            <div className="condition-header">{title}</div>
            <div className="condition-content">
                {children}
                {legend && (
                    <div className="pcr-legend-side">
                        <div className="pcr-legend-title">PCR Product</div>
                        <div className="pcr-legend-items">
                            <div className="pcr-legend-row">
                                <span className="pcr-legend-color" style={{ backgroundColor: ADAPTER_COLOR, boxShadow: `0 0 4px ${ADAPTER_COLOR}` }}></span>
                                <span className="pcr-legend-text">Adapter</span>
                            </div>
                            <div className="pcr-legend-row">
                                <span className="pcr-legend-color" style={{ backgroundColor: 'rgba(160,170,185,0.7)' }}></span>
                                <span className="pcr-legend-text">Gene Others</span>
                            </div>
                            <div className="pcr-legend-row"><span className="pcr-legend-color" style={{ backgroundColor: 'var(--gene-a)' }}></span><span className="pcr-legend-text">Gene A</span></div>
                            <div className="pcr-legend-row"><span className="pcr-legend-color" style={{ backgroundColor: 'var(--gene-b)' }}></span><span className="pcr-legend-text">Gene B</span></div>
                            <div className="pcr-legend-row"><span className="pcr-legend-color" style={{ backgroundColor: 'var(--gene-c)' }}></span><span className="pcr-legend-text">Gene C</span></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Step5PCR({ mode }) {
    const isReplicates = mode === 'replicates';

    const getPCRGenes = (a, b, c) => [
        ...Array(a * 4).fill(0).map(() => ({ id: 'A', color: 'var(--gene-a)' })),
        ...Array(b * 4).fill(0).map(() => ({ id: 'B', color: 'var(--gene-b)' })),
        ...Array(c * 4).fill(0).map(() => ({ id: 'C', color: 'var(--gene-c)' })),
        ...Array(20).fill({ id: 'Others', color: 'rgba(160,170,185,0.5)' })
    ];

    if (isReplicates) {
        return (
            <div className="step-container replicates-step">
                <div className="replicates-area">
                    <ConditionBox title="Control Libraries">
                        <div className="tubes-row" style={{ display: 'flex', gap: '1rem' }}>
                            <PCRTube genes={getPCRGenes(2, 4, 4)} small="1" />
                            <PCRTube genes={getPCRGenes(3, 3, 4)} small="2" />
                            <PCRTube genes={getPCRGenes(2, 4, 5)} small="3" />
                        </div>
                    </ConditionBox>
                    <ConditionBox title="Treated Libraries">
                        <div className="tubes-row" style={{ display: 'flex', gap: '1rem' }}>
                            <PCRTube genes={getPCRGenes(7, 4, 2)} small="1" />
                            <PCRTube genes={getPCRGenes(8, 4, 2)} small="2" />
                            <PCRTube genes={getPCRGenes(9, 4, 2)} small="3" />
                        </div>
                    </ConditionBox>
                </div>
                <div className="legend-panel" style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                    <div className="legend-item"><span className="color-box" style={{ background: ADAPTER_COLOR, width: '12px', height: '12px', borderRadius: '2px', boxShadow: `0 0 4px ${ADAPTER_COLOR}` }}></span> Adapter</div>
                    <div className="legend-item"><span className="color-box" style={{ background: 'var(--gene-a)', width: '12px', height: '12px', borderRadius: '2px' }}></span> Gene A</div>
                    <div className="legend-item"><span className="color-box" style={{ background: 'var(--gene-b)', width: '12px', height: '12px', borderRadius: '2px' }}></span> Gene B</div>
                    <div className="legend-item"><span className="color-box" style={{ background: 'var(--gene-c)', width: '12px', height: '12px', borderRadius: '2px' }}></span> Gene C</div>
                </div>
            </div>
        );
    }

    return (
        <div className="step-container">
            <div className="pcr-area">
                <ConditionBox title="Control Library" legend={true}>
                    <PCRTube genes={getPCRGenes(2, 4, 4)} />
                </ConditionBox>
                <ConditionBox title="Treated Library" legend={true}>
                    <PCRTube genes={getPCRGenes(8, 4, 2)} />
                </ConditionBox>
            </div>
        </div>
    );
}

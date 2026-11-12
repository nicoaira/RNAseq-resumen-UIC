// "Predict first" questions shown in Class mode, keyed by pipeline step.
// `byMode` overrides the default question for a given mode.

export const CHECKPOINTS = {
    specimens: {
        question: 'Every cell in both specimens has the same genes in its DNA. So what are we actually going to measure?',
        answer: 'The RNA: how many copies of each gene\'s message the cells are making right now. That is what the treatment changes.',
    },
    rt: {
        question: 'Why turn RNA into cDNA? Why not read the RNA directly?',
        answer: 'Illumina sequencers read DNA, and DNA is much more stable than RNA. (Some newer machines, such as nanopore, can read RNA directly.)',
    },
    pcr: {
        question: 'PCR makes millions of copies. Does that change the ratio between Gene A and Gene B?',
        answer: 'Ideally no: every fragment is copied at about the same rate, so the proportions stay the same. Too many cycles add bias and duplicate reads, which quality control can detect.',
    },
    sequencing: {
        question: 'If the treated sample were sequenced twice as deep, what would happen to the raw count of Gene B?',
        answer: 'It would roughly double (about 4 → 8), even though Gene B did not change in the cells. Raw counts depend on sequencing depth, not only on biology.',
    },
    fastq: {
        question: 'One base has the quality character "#". Would you trust that base?',
        answer: 'No. "#" is ASCII code 35, so Q = 35 − 33 = 2: about a 63% chance the base is wrong. Click "#" in the record to check.',
    },
    counts: {
        question: 'Why can\'t we compare raw counts directly between samples?',
        answer: 'Each sample has a different total number of reads (sequencing depth). A gene can look higher just because its sample got more reads. Normalization corrects for depth (the CPM step in "With normalization"); statistics then tell real change from noise.',
    },
    de: {
        question: 'With one sample per group, can we say a gene changed?',
        answer: 'No. We can compute a fold change, but we cannot tell whether it is bigger than the natural differences between individuals. For that we need biological replicates and statistics (classes 2 and 3).',
        byMode: {
            replicates: {
                question: 'Gene B reads 4, 3, 4 in the controls and 4, 4, 4 in the treated replicates. Did it change?',
                answer: 'No. The difference is no bigger than the spread inside each group. Replicates let statistics measure that spread (here p ≈ 0.97, far from significant).',
            },
        },
    },
};

export function getCheckpoint(stepKey, mode) {
    const cp = CHECKPOINTS[stepKey];
    if (!cp) return null;
    return (cp.byMode && cp.byMode[mode]) || cp;
}

// Preset layouts for the "Can this be analyzed?" class question.
// batches: sample id -> batch index (0 = Day/Lane 1, 1 = Day/Lane 2)

export const DESIGN_PRESETS = [
    {
        id: 'A',
        label: 'Layout A',
        summary: '3 vs 3 · all controls on day 1, all treated on day 2',
        n: 3,
        batches: { C1: 0, C2: 0, C3: 0, T1: 1, T2: 1, T3: 1 },
    },
    {
        id: 'B',
        label: 'Layout B',
        summary: '3 vs 3 · day 1 has 3 controls + 1 treated, day 2 has 2 treated',
        n: 3,
        batches: { C1: 0, C2: 0, C3: 0, T1: 0, T2: 1, T3: 1 },
    },
    {
        id: 'C',
        label: 'Layout C',
        summary: '4 vs 4 · each day has 2 controls + 2 treated',
        n: 4,
        batches: { C1: 0, C2: 0, C3: 1, C4: 1, T1: 0, T2: 0, T3: 1, T4: 1 },
    },
];

export const sampleIds = n => [
    ...Array.from({ length: n }, (_, i) => `C${i + 1}`),
    ...Array.from({ length: n }, (_, i) => `T${i + 1}`),
];

// Plain-language verdict on a design.
// level: 'bad' (not analyzable), 'weak' (analyzable but weak), 'good'
export function judgeDesign(n, batches, batchName) {
    const ids = sampleIds(n);
    const used = [0, 1].filter(b => ids.some(id => batches[id] === b));
    const count = (b, cond) => ids.filter(id => id[0] === cond && batches[id] === b).length;

    if (n === 1) {
        return {
            level: 'bad',
            title: 'Not analyzable',
            reason: 'One sample per group. We can see a difference, but we cannot tell it from the natural differences between individuals.',
        };
    }

    const confounded = used.length > 1 && used.every(b => count(b, 'C') === 0 || count(b, 'T') === 0);
    if (confounded) {
        return {
            level: 'bad',
            title: 'Not analyzable: treatment is confounded with batch',
            reason: `Every ${batchName} holds only one condition. Any difference could be the drug, the ${batchName}, or both, and no statistics can split them.`,
        };
    }

    const balanced = used.length === 1 || used.every(b => count(b, 'C') === count(b, 'T'));

    if (!balanced) {
        return {
            level: 'weak',
            title: 'Analyzable, but weak',
            reason: `The ${batchName}s are unbalanced: only a few samples compare control and treated within the same ${batchName}. Statistics can correct for the ${batchName}, but you lose power.`,
        };
    }

    if (n === 2) {
        return {
            level: 'weak',
            title: 'Analyzable, but weak',
            reason: 'Two replicates per group give a very rough idea of the natural variation. Only big changes will be detected. Three or more is the usual minimum.',
        };
    }

    return {
        level: 'good',
        title: used.length === 1 ? 'Good design' : 'Good design: balanced across batches',
        reason: used.length === 1
            ? `Enough biological replicates, all processed in the same ${batchName}.`
            : `Each ${batchName} has the same number of control and treated samples, so the ${batchName} effect can be measured and removed.`,
    };
}

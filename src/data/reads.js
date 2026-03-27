// Seeded PRNG (mulberry32) — guarantees identical reads on every page load
let _seed = 44;
const rng = () => {
    _seed += 0x6D2B79F5;
    let z = _seed;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 0x100000000;
};

export const REFERENCES = [
    { id: 'A', seq: 'ATGCGTACTTGACTAG', color: 'var(--gene-a)' },
    { id: 'B', seq: 'TACGATCGAGCCTTATGC', color: 'var(--gene-b)' },
    { id: 'C', seq: 'GGCCTAATCCGAATGCTTCA', color: 'var(--gene-c)' },
];

const READ_LEN = 7;

const makeRead = (ref, delay) => {
    const maxOffset = ref.seq.length - READ_LEN;
    const offset = Math.floor(rng() * (maxOffset + 1));
    return { seq: ref.seq.slice(offset, offset + READ_LEN), targetRef: ref.id, offset, delay };
};

const shuffle = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const generateReads = (a, b, c, prefix) => {
    const mapped = shuffle([
        ...Array(a).fill(0).map((_, i) => makeRead(REFERENCES[0], 200 + i * 150)),
        ...Array(b).fill(0).map((_, i) => makeRead(REFERENCES[1], 400 + i * 150)),
        ...Array(c).fill(0).map((_, i) => makeRead(REFERENCES[2], 600 + i * 150)),
    ]);
    const all = [...mapped, { seq: 'GCTAGCT', targetRef: null, delay: 1000 }];
    return all.map((r, i) => ({ ...r, id: `${prefix}_${i + 1}` }));
};

export const CONTROL_REPLICATES = [
    generateReads(2, 4, 4, 'C1'),
    generateReads(3, 3, 4, 'C2'),
    generateReads(2, 4, 5, 'C3'),
];

export const TREATED_REPLICATES = [
    generateReads(7, 4, 2, 'T1'),
    generateReads(8, 4, 2, 'T2'),
    generateReads(9, 4, 2, 'T3'),
];

export const CONTROL_STD = generateReads(2, 4, 4, 'CTRL');
export const TREATED_STD = generateReads(8, 4, 2, 'TREAT');
export const TREATED_NORMALIZED = generateReads(4, 2, 1, 'TREAT');

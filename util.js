const f = (a, b) => [].concat(...a.map((d) => b.map((e) => [].concat(d, e))));
export const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

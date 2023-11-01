function fz(obj) {
    return Object.freeze(obj)
}

// The config is immutable at runtime and any effort to change it will have no effect
export const config = fz({
    timeSlot: fz({
        min: 1,
        max: 3600,
        step: 1,
    }),
    slo: fz({
        min: 0,
        max: 99.999,
    }),
    windowDays: fz({
        min: 1,
        max: 90,
        step: 1,
    }),
    errorBudgetValidExample: fz({
        min: 1,
        max: 1_000_000,
    }),
    burnRate: fz({
        min: 1,
        max: 20,
        step: 0.1,
    }),
    longWindowPerc: fz({
        min: 1,
        max: 100,
        step: 1,
    }),
    shortWindowDivider: fz({
        min: 2,
        max: 20,
        step: 1,
    }),
})
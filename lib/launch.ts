// Launch date of the program builder. The "New" badge shows for 60 days.
export const BUILDER_LAUNCH = Date.UTC(2026, 10, 21);
export const builderIsNew = () => Date.now() - BUILDER_LAUNCH < 60 * 86400000;

// Launch date of the Partner pipeline calculator. The "New" badge shows for 60 days.
export const CALC_LAUNCH = Date.UTC(2026, 10, 23);
export const calcIsNew = () => Date.now() - CALC_LAUNCH < 60 * 86400000;

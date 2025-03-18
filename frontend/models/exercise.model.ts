export enum Operation {
    Add,
    Sub,
    Mul,
    Div,
}

export const OperationSymbols: { [key in Operation]: string } = {
    [Operation.Add]: "+",
    [Operation.Sub]: "-",
    [Operation.Mul]: "\u00D7",
    [Operation.Div]: ":",
};

export interface OperationToUse {
    useAdd: boolean;
    useSub: boolean;
    useMul: boolean;
    useDiv: boolean;
}

export interface Exercise {
    id: number;
    name: string;
    timeout: number;
    problems: string[];
    answers: string[];
}

export const EMPTY_EXERCISE: Exercise = {
    id: 0,
    name: "Упражнение",
    timeout: 5,
    problems: [],
    answers: [],
}

export const ExerciseLimits = {
    MIN_VALUE: -10000,
    MAX_VALUE: 10000,
    MIN_EPXRESSIONS_AMOUNT: 1,
    MAX_EPXRESSIONS_AMOUNT: 100,
    MIN_TIMEOUT: 1,
    MAX_TIMEOUT: 60,
}

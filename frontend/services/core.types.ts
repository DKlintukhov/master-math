export interface GenerateExpressionsResponse {
    expressions: string[];
    answers: string[];
    error: string | null;
}

export interface GenerateExpressionsConfig {
    amount: number,
    min: number,
    max: number,
    useAdd: boolean,
    useSub: boolean,
    useMul: boolean,
    useDiv: boolean,
}

export interface GeneratedExpressions {
    expressions: string[];
    answers: string[];
}

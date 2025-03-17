import { Exercise } from "../models";

export interface GenerateExpressionsConfig {
    name: string;
    timeout: number;
    amount: number;
    min: number;
    max: number;
    useAdd: boolean;
    useSub: boolean;
    useMul: boolean;
    useDiv: boolean;
}

export interface GenerateExpressionsResponse {
    expressions: string[];
    answers: string[];
    error: string | null;
}

export interface GeneratedExpressions {
    expressions: string[];
    answers: string[];
}

export interface SaveExercisePayload {
    exercise: Exercise;
}

export interface LoadExercisesResponse {
    exercises: Exercise[];
    error: string;
}

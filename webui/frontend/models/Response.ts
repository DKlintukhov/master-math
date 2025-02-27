import { Expression } from "./Expression";

export interface Response {
    expressions: Expression[];
    answers: number[];
    error: string | undefined;
}

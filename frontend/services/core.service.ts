import { Exercise } from "../models";
import {
    DeleteExercisePayload,
    GenerateExpressionsConfig,
    GenerateExpressionsResponse,
    GeneratedExpressions,
    LoadExercisesResponse,
    SaveExercisePayload
} from "./core.types";

export class CoreService {

    public static async GenerateExpressions(conf: GenerateExpressionsConfig): Promise<GeneratedExpressions | never> {
        const json = await globalThis.webui.call("GenerateExpressions", JSON.stringify(conf));
        const { error, expressions, answers } = JSON.parse(json) as GenerateExpressionsResponse;
        if (error) {
            throw error;
        }

        return { expressions, answers };

        return {
            expressions: [
                "2+2", "2+3-2+3+(2+3)", "10-3-6+(5/10)", 
                "2+2", "2+3-2+3+(2+3)", "10-3-6+(5/10)", 
                "2+2", "2+3-2+3+(2+3)", "10-3-6+(5/10)",
                "2+2", "2+3-2+3+(2+3)", "10-3-6+(5/10)", 
                "2+2", "2+3-2+3+(2+3)", "10-3-6+(5/10)", 
                "2+2", "2+3-2+3+(2+3)", "10-3-6+(5/10)",
                "Лыжник прошёл дистанцию 24 км за три часа. С какой скоростью он шёл?, Лыжник прошёл дистанцию 24 км за три часа. С какой скоростью он шёл?"
            ],
            answers: [
                "4", "5", "7", 
                "4", "5", "7", 
                "4", "5", "7",
                "4", "5", "7", 
                "4", "5", "7", 
                "4", "5", "7",
                "24 км/ч"
            ]
        };
    }

    public static async SaveExercise(payload: SaveExercisePayload): Promise<void | never> {
        const { error } = await globalThis.webui.call("SaveExercise", JSON.stringify(payload));
        if (error) {
            throw error;
        }
    }

    public static async DeleteExercise(payload: DeleteExercisePayload): Promise<void | never> {
        const { error } = await globalThis.webui.call("DeleteExercise", JSON.stringify(payload));
        if (error) {
            throw error;
        }
    }

    public static async LoadExercises(): Promise<Exercise[] | never> {
        const json = await globalThis.webui.call("LoadExercises", "");
        const { error, exercises } = JSON.parse(json) as LoadExercisesResponse;
        if (error) {
            throw error;
        }

        return exercises;
        return [
            { id: 0, answers: ["2", "3"], problems: ["1+1", "1+2"], timeout: 3, name: "name 1" },
            { id: 0, answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2" },
            { id: 0, answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 23" },
            { id: 0, answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 24" },
            { id: 0, answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 25" },
            { id: 0, answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 26" },
            { id: 0, answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 27" },
            { id: 0, answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2 имя вфлиорвофрывшв" },
            { id: 0, answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2 имя вфлиорвофрывшв1" },
            { id: 0, answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2 имя вфлиорвофрывшв2" },
            { id: 0, answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2 имя вфлиорвофрывшв3" },
            { id: 0, answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2 имя вфлиорвофрывшв4" },
            { id: 0, answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2 имя вфлиорвофрывшв5" },
            { id: 0, answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2 имя вфлиорвофрывшв6" },
            { id: 0, answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2 имя вфлиорвофрывшв7" },
            { id: 0, answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2 имя вфлиорвофрывшв8" },
        ]
    }
}

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
            expressions: ["2+2", "2+3-2+3+(2+3)", "10-3-6+(5/10)"],
            answers: ["4", "5", "7"]
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
        // return [
        //     { answers: ["2", "3"], problems: ["1+1", "1+2"], timeout: 3, name: "name 1" },
        //     { answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2" },
        //     { answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 23" },
        //     { answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 24" },
        //     { answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 25" },
        //     { answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 26" },
        //     { answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 27" },
        //     { answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2 имя вфлиорвофрывшв" },
        //     { answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2 имя вфлиорвофрывшв1" },
        //     { answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2 имя вфлиорвофрывшв2" },
        //     { answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2 имя вфлиорвофрывшв3" },
        //     { answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2 имя вфлиорвофрывшв4" },
        //     { answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2 имя вфлиорвофрывшв5" },
        //     { answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2 имя вфлиорвофрывшв6" },
        //     { answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2 имя вфлиорвофрывшв7" },
        //     { answers: ["3", "5"], problems: ["1+2", "1+4"], timeout: 3, name: "name 2 имя вфлиорвофрывшв8" },
        // ]
    }
}

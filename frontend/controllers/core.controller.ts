import { AppInfo, Exercise, Operation, OPERATION_SYMBOLS } from "../models";
import { CoreService, GenerateExpressionsConfig } from "../services";

export class CoreController {

    public static async GenerateExpressions(config: GenerateExpressionsConfig): Promise<Exercise | never> {
        try {
            const { expressions, answers } = await CoreService.GenerateExpressions(config);
            const problems = expressions.map((expression) => {
                let res = expression
                    .replaceAll("+", ` ${OPERATION_SYMBOLS[Operation.Add]} `)
                    .replaceAll("-", ` ${OPERATION_SYMBOLS[Operation.Sub]} `)
                    .replaceAll("*", ` ${OPERATION_SYMBOLS[Operation.Mul]} `)
                    .replaceAll("/", ` ${OPERATION_SYMBOLS[Operation.Div]} `);

                return res;
            });

            return { id: 0, name: config.name, timeout: config.timeout, problems, answers, solution: [] }
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    public static async SaveExercise(exercise: Exercise): Promise<void | never> {
        try {
            await CoreService.SaveExercise({ exercise });
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    public static async DeleteExercise(name: string): Promise<void | never> {
        try {
            await CoreService.DeleteExercise({ name });
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    public static async LoadExercises(): Promise<Exercise[] | never> {
        try {
            const exercises = await CoreService.LoadExercises();
            return exercises
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    public static async GetAppInfo(): Promise<AppInfo | never> {
        try {
            const appInfo = await CoreService.GetAppInfo();
            return appInfo
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }
}

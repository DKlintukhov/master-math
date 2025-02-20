import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Button from "@mui/material/Button";

import Grid from "@mui/material/Grid2";
import { OperationToUse, Expression, mapExpression, ExpressionDTO } from "../models";
import { NumericInputControl, OperatorsSelector } from "../components";
import { Container, FormHelperText } from "@mui/material";

interface Props {
    onStarted: (timeout: number, expressions: Expression[]) => void;
}

const MIN_VALUE = -10000;
const MAX_VALUE = 10000;
const MIN_EPXRESSIONS_AMOUNT = 1;
const MAX_EPXRESSIONS_AMOUNT = 100;
const MIN_TIMEOUT = 1;
const MAX_TIMEOUT = 60;

export function ExerciseSetup({ onStarted }: Props) {
    const [inputsInvalid, setInputsInvalid] = useState(false);
    const [timeout, setTimeout] = useState(5);
    const [amount, setAmount] = useState(15);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(100);
    const [minmaxInvalid, setMinMaxInvalid] = useState(false);
    const [operators, setOperators] = useState<OperationToUse>();
    const [checkOperatorsError, setCheckOperatorsError] = useState<boolean>();

    async function start() {
        const { expressions } = await invoke<{ expressions: ExpressionDTO[] }>("start", {
            config: {
                amount,
                min,
                max,
                ...operators
            }
        });
        onStarted(timeout, expressions.map(mapExpression));
    }

    useEffect(() => {
        if (checkOperatorsError) {
            setInputsInvalid(true);
            return;
        }

        setInputsInvalid(false);
    }, [checkOperatorsError]);

    useEffect(() => {
        if (max <= min) {
            setMinMaxInvalid(true);
            return;
        }

        setMinMaxInvalid(false);
    }, [min, max]);

    const handleInputsError = (isError: boolean) => {
        setInputsInvalid(isError);
    }

    return (
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
            <Grid size={6}>
                <NumericInputControl
                    label="Время (мин.)"
                    defaultValue={timeout}
                    min={MIN_TIMEOUT}
                    max={MAX_TIMEOUT}
                    onChanged={setTimeout}
                    onError={handleInputsError} />
            </Grid>

            <Grid size={6}>
                <NumericInputControl
                    label="Количество примеров"
                    defaultValue={amount}
                    min={MIN_EPXRESSIONS_AMOUNT}
                    max={MAX_EPXRESSIONS_AMOUNT}
                    onChanged={setAmount}
                    onError={handleInputsError} />
            </Grid>

            <Grid size={6}>
                <NumericInputControl
                    label="Мин. число"
                    defaultValue={min}
                    min={MIN_VALUE}
                    max={MAX_VALUE}
                    onChanged={setMin}
                    onError={handleInputsError} />
            </Grid>

            <Grid size={6}>
                <NumericInputControl
                    label="Макс. число"
                    defaultValue={max}
                    min={MIN_VALUE}
                    max={MAX_VALUE}
                    onChanged={setMax}
                    onError={handleInputsError} />
            </Grid>

            <Grid size={12} style={{
                display: "flex",
                justifyContent: "center",
            }}>
                <OperatorsSelector onChecked={setOperators} onError={setCheckOperatorsError} />
            </Grid>

            <Grid size={12}>
                <Container style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column"
                }}>
                    <Button disabled={inputsInvalid || minmaxInvalid} variant="outlined" onClick={() => start()}>Начать</Button>
                    {minmaxInvalid && <FormHelperText error={true}>{"Мин. не может быть >= чем Макс."}</FormHelperText>}
                </Container>
            </Grid>
        </Grid>
    );
}

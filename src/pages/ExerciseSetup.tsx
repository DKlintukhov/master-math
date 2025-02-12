import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Button from "@mui/material/Button";
import {
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Operations, OperationSymbols, SimpleExpression } from "../models";
import { NumericInputControl } from "../components";

interface Props {
    onStarted: (timeout: number, expressions: SimpleExpression[]) => void;
}

const MIN_VALUE = -10000;
const MAX_VALUE = 10000;
const MIN_EPXRESSIONS_AMOUNT = 1;
const MAX_EPXRESSIONS_AMOUNT = 100;
const MIN_TIMEOUT = 1;
const MAX_TIMEOUT = 60;

export function ExerciseSetup({ onStarted }: Props) {
    const [timeout, setTimeout] = useState(5);
    const [amount, setAmount] = useState(15);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(100);
    const [useAdd, setUseAdd] = useState(true);
    const [useSub, setUseSub] = useState(true);
    const [useMul, setUseMul] = useState(false);
    const [useDiv, setUseDiv] = useState(false);

    async function start() {
        const { expressions } = await invoke<{ expressions: SimpleExpression[] }>("start", {
            config: {
                amount,
                min,
                max,
                useAdd,
                useSub,
                useMul,
                useDiv
            }
        });
        onStarted(timeout, expressions);
    }

    return (
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
            <Grid size={6}>
                <NumericInputControl
                    label="Время (мин.)"
                    defaultValue={timeout}
                    min={MIN_TIMEOUT}
                    max={MAX_TIMEOUT}
                    onChanged={setTimeout} />
            </Grid>

            <Grid size={6}>
                <NumericInputControl
                    label="Количество примеров"
                    defaultValue={amount}
                    min={MIN_EPXRESSIONS_AMOUNT}
                    max={MAX_EPXRESSIONS_AMOUNT}
                    onChanged={setAmount} />
            </Grid>

            <Grid size={6}>
                <NumericInputControl
                    label="Мин. число"
                    defaultValue={min}
                    min={MIN_VALUE}
                    max={MAX_VALUE}
                    onChanged={setMin} />
            </Grid>

            <Grid size={6}>
                <NumericInputControl
                    label="Макс. число"
                    defaultValue={max}
                    min={MIN_VALUE}
                    max={MAX_VALUE}
                    onChanged={setMax} />
            </Grid>

            <Grid size={12} style={{
                display: "flex",
                justifyContent: "center",
            }}>
                <FormControlLabel control={
                    <Checkbox checked={useAdd} onChange={(e) => setUseAdd(Boolean(e.target.value))} />
                } label={"Сложение " + OperationSymbols[Operations.Add]} />
                <FormControlLabel control={
                    <Checkbox checked={useSub} onChange={(e) => setUseSub(Boolean(e.target.value))} />
                } label={"Вычитание " + OperationSymbols[Operations.Sub]} />
                <FormControlLabel control={
                    <Checkbox checked={useMul} onChange={(e) => setUseMul(Boolean(e.target.value))} />
                } label={"Умножение " + OperationSymbols[Operations.Mul]} />
                <FormControlLabel control={
                    <Checkbox checked={useDiv} onChange={(e) => setUseDiv(Boolean(e.target.value))} />
                } label={"Деление " + OperationSymbols[Operations.Div]} />
            </Grid>

            <Grid size={12} style={{
                display: "flex",
                justifyContent: "center",
            }}>
                <Button variant="outlined" onClick={() => start()}>Начать</Button>
            </Grid>
        </Grid>
    );
}

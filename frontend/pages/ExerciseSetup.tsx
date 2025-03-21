import React from "react";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { ExerciseLimits, OperationToUse } from "../models";
import { NumericInputControl, OperationMultiSelect } from "../components";
import { Box, FormHelperText } from "@mui/material";
import { GenerateExpressionsConfig } from "../services";

interface Props {
    onStart: (genExpressionsConf: GenerateExpressionsConfig) => void;
    onCancel: () => void;
}

export function ExerciseSetup({ onStart, onCancel }: Props) {
    const name = "";
    const [inputsInvalid, setInputsInvalid] = useState(false);
    const [timeout, setTimeout] = useState(5);
    const [amount, setAmount] = useState(15);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(25);
    const [minmaxInvalid, setMinMaxInvalid] = useState(false);
    const [operators, setOperators] = useState<OperationToUse>({
        useAdd: true,
        useSub: true,
        useMul: false,
        useDiv: false
    });
    const [checkOperatorsError, setCheckOperatorsError] = useState<boolean>();

    const handleStart = () => {
        onStart({ name, timeout, amount, min, max, ...operators });
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
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: "15px",
            maxWidth: "960px",
            padding: "50px",
        }}>
            <Box sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ flex: '1 1 300px' }}>
                    <NumericInputControl
                        label="Время (мин.)"
                        defaultValue={timeout}
                        min={ExerciseLimits.MIN_TIMEOUT}
                        max={ExerciseLimits.MAX_TIMEOUT}
                        onChange={setTimeout}
                        onError={handleInputsError} />
                </Box>

                <Box sx={{ flex: '1 1 300px' }}>
                    <NumericInputControl
                        label="Количество примеров"
                        defaultValue={amount}
                        min={ExerciseLimits.MIN_EPXRESSIONS_AMOUNT}
                        max={ExerciseLimits.MAX_EPXRESSIONS_AMOUNT}
                        onChange={setAmount}
                        onError={handleInputsError} />
                </Box>
            </Box>

            <Box sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ flex: '1 1 300px' }}>
                    <NumericInputControl
                        label="Мин. число"
                        defaultValue={min}
                        min={ExerciseLimits.MIN_VALUE}
                        max={ExerciseLimits.MAX_VALUE}
                        onChange={setMin}
                        onError={handleInputsError} />
                </Box>

                <Box sx={{ flex: '1 1 300px' }}>
                    <NumericInputControl
                        label="Макс. число"
                        defaultValue={max}
                        min={ExerciseLimits.MIN_VALUE}
                        max={ExerciseLimits.MAX_VALUE}
                        onChange={setMax}
                        onError={handleInputsError} />
                </Box>
            </Box>

            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                <OperationMultiSelect onCheck={setOperators} onError={setCheckOperatorsError} />
            </Box>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
            }}>
                <Button disabled={inputsInvalid || minmaxInvalid} variant="outlined" onClick={handleStart}>Начать</Button>
                {minmaxInvalid && <FormHelperText error={true}>{"Мин. не может быть >= чем Макс."}</FormHelperText>}
                <Button variant="outlined" onClick={onCancel}>Отмена</Button>
            </Box>
        </Box>
    );
}

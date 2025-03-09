import { FormControl, FormHelperText, InputLabel, OutlinedInput } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
    label: string;
    defaultValue: number;
    min: number;
    max: number;
    onChange: (time: number) => void;
    onError: (isError: boolean) => void;
}

export function NumericInputControl({ label, defaultValue, min, max, onChange, onError }: Props) {
    const [input, setInput] = useState(defaultValue);
    const [isError, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (input < min || input > max) {
            setErrorMessage(`${label} должно быть >= ${min} <= ${max}`);
            setError(true);
            onError(true);
            return;
        }

        setErrorMessage("");
        setError(false);
        onError(false);

        onChange(input)
    }, [input]);

    return (
        <>
            <FormControl variant="outlined" fullWidth={true}>
                <InputLabel>{label}</InputLabel>
                <OutlinedInput
                    error={isError}
                    label={label}
                    required
                    type="number"
                    defaultValue={input}
                    onChange={(e) => setInput(Number(e.target.value))}
                />
                {isError && <FormHelperText>{errorMessage}</FormHelperText>}
            </FormControl>
        </>
    );
}

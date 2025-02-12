import { FormControl, FormHelperText, InputLabel, OutlinedInput } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
    label: string;
    defaultValue: number;
    min: number;
    max: number;
    onChanged: (time: number) => void;
}

export function NumericInputControl({ label, defaultValue, min, max, onChanged }: Props) {
    const [input, setInput] = useState(defaultValue);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (input < min || input > max) {
            setErrorMessage(`${label} должно быть >= ${min} <= ${max}`);
            setError(true);
            return;
        }

        setErrorMessage("");
        setError(false);

        onChanged(input)
    }, [input]);

    return (
        <>
            <FormControl variant="outlined" fullWidth={true}>
                <InputLabel>{label}</InputLabel>
                <OutlinedInput
                    error={error}
                    label={label}
                    required
                    type="number"
                    defaultValue={input}
                    onChange={(e) => setInput(Number(e.target.value))}
                />
                {error && <FormHelperText>{errorMessage}</FormHelperText>}
            </FormControl>
        </>
    );
}

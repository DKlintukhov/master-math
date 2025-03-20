import { FormControl, MenuItem, Select } from "@mui/material";
import { Operation, OPERATION_SYMBOLS } from "../models";
import React, { useEffect, useState } from "react";

interface Props {
    onSelect: (op: Operation) => void;
}

export function OperationSelector({ onSelect }: Props) {
    const [operation, setOperation] = useState(Operation.Add);

    useEffect(() => {
    }, [operation]);

    const selectHandler = (event) => {
        const op = event.target.value;
        setOperation(op);
        onSelect(op);
    }

    return (
        <FormControl size="medium">
            <Select
                value={operation}
                onChange={selectHandler}
            >
                <MenuItem value={Operation.Add}>{OPERATION_SYMBOLS[Operation.Add]}</MenuItem>
                <MenuItem value={Operation.Sub}>{OPERATION_SYMBOLS[Operation.Sub]}</MenuItem>
                <MenuItem value={Operation.Mul}>{OPERATION_SYMBOLS[Operation.Mul]}</MenuItem>
                <MenuItem value={Operation.Div}>{OPERATION_SYMBOLS[Operation.Div]}</MenuItem>
            </Select>
        </FormControl>
    );
}

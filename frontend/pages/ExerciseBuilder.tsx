import Button from "@mui/material/Button";
import React, { useState } from "react";
import { Container } from "@mui/material";

interface Props {
    onStart: () => string[];
    onCancel: () => void;
}

export function ExerciseBuilder({ onStart, onCancel }: Props) {
    const [expressions, setExpressions] = useState<string[]>([]);

    const expressionAdded = (expr: string) => {
        console.log(expr)
    }

    return (
        <Container>
            <Button variant="outlined" onClick={onCancel}>Отмена</Button>
        </Container>
    );
}

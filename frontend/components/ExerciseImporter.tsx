import { Box, Button, Alert, Snackbar } from "@mui/material";
import React, { useState } from "react";
import { Exercise } from "../models";

interface Props {
    onImported: (exercise: Exercise) => void;
}

const validateExerciseData = (data: any): void | never => {
    if (!data.id) {
        throw "Ошибка импорта упражнения: отсутствует свойство 'id'";
    }
    if (!data.name) {
        throw "Ошибка импорта упражнения: отсутствует свойство 'name'";
    }
    if (!data.answers || !Array.isArray(data.answers)) {
        throw "Ошибка импорта упражнения: отсутствует или имеет неверный формат свойство 'answers' (должен быть массивом)";
    }
    if (!data.problems || !Array.isArray(data.problems)) {
        throw "Ошибка импорта упражнения: отсутствует или имеет неверный формат свойство 'problems' (должен быть массивом)";
    }
    if (!data.solution) {
        throw "Ошибка импорта упражнения: отсутствует свойство 'solution'";
    }
    if (typeof data.timeout !== 'number' || isNaN(data.timeout)) {
        throw "Ошибка импорта упражнения: отсутствует или имеет неверный формат свойство 'timeout' (должно быть числом)";
    }
};

export function ExerciseImporter({ onImported }: Props) {
    const [error, setError] = useState<string>("");
    const [snackbarOpen, setErrorSnackbarOpen] = useState<boolean>(false);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (!e.target) {
                return;
            }

            try {
                const jsonString = e.target.result as string;
                const data = JSON.parse(jsonString) as Exercise;
                validateExerciseData(data);

                setError("");
                onImported(data);
            } catch (error) {
                setError(`Ошибка импорта упражнения: ${error}`);
                setErrorSnackbarOpen(true);
                return;
            }
        };

        reader.onerror = () => {
            setError("Ошибка чтения файла");
            setErrorSnackbarOpen(true);
        };

        reader.readAsText(file);
    };

    const handleClick = () => {
        const fileInput = globalThis.document.getElementById('fileInput');
        if (fileInput) {
            fileInput.click();
        }
    };

    const handleSnackbarClose = () => {
        setErrorSnackbarOpen(false);
    }

    return (
        <Box>
            <Button variant="outlined" onClick={handleClick}>Импортировать</Button>

            <input
                type="file"
                id="fileInput"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
            />

            <Snackbar
                open={snackbarOpen}
                onClose={handleSnackbarClose}
                autoHideDuration={3000}
                anchorOrigin={{
                    horizontal: "center",
                    vertical: "bottom",
                }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="error"
                    variant="filled"
                >
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
}
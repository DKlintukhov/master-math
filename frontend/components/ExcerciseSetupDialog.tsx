import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    OutlinedInput,
    FormHelperText,
    InputLabel,
} from '@mui/material';
import { ExerciseLimits } from '../models';

interface Props {
    name: string;
    onCancel: () => void;
    onConfirm: (name: string, timeout: number) => void;
}

export function ExcerciseSetupDialog({ name, onConfirm, onCancel }: Props) {
    const [currName, setName] = useState<string>(name);
    const [timeout, setTimeout] = useState<number>(5);
    const [isTimeoutInvalid, setIsTimeoutInvalid] = useState<boolean>(false);
    const [isNameInvalid, setIsNameinvalid] = useState<boolean>(true);

    const handleSubmit = () => {
        onConfirm(currName, timeout);
    };

    const timeouthangeHandler = (rawtimeout: string) => {
        const timeout = Number(rawtimeout.trim());
        if (isNaN(timeout) || timeout <= 0 || timeout > ExerciseLimits.MAX_TIMEOUT) {
            setIsTimeoutInvalid(true);
            return;
        }

        setIsTimeoutInvalid(false);
        setTimeout(timeout);
    };

    const nameChangeHandler = (rawname: string) => {
        const name = rawname.trim();
        if (!name) {
            setIsNameinvalid(true);
            return;
        }

        setIsNameinvalid(false);
        setName(name);
    };

    return (
        <Dialog open={true} onClose={onCancel}>
            <DialogTitle>Сохранить упражнение</DialogTitle>
            <DialogContent style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px"
            }}>
                <div>
                    <InputLabel>Время (мин.)</InputLabel>
                    <OutlinedInput
                        error={isTimeoutInvalid}
                        required
                        defaultValue={timeout}
                        type="number"
                        onChange={(e) => timeouthangeHandler(e.target.value)}
                    />
                    {isTimeoutInvalid && <FormHelperText>Время некорректное</FormHelperText>}
                </div>

                <div>
                    <InputLabel>Название упражнения</InputLabel>
                    <OutlinedInput
                        error={isNameInvalid}
                        required
                        defaultValue=""
                        onChange={(e) => nameChangeHandler(e.target.value)}
                    />
                    {isNameInvalid && <FormHelperText>Название некорректное</FormHelperText>}
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onCancel}>
                    Отмена
                </Button>
                <Button variant="outlined" onClick={handleSubmit} disabled={isTimeoutInvalid || isNameInvalid}>
                    Подтвердить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

import { Button } from "@mui/material";

interface Props {
    onFinished: Function;
}

export function Results({ onFinished }: Props) {
    return (
        <Button variant="outlined" onClick={() => onFinished()}>Финиш</Button>
    );
}

import { Button } from "@mui/material";

interface Props {
    ready: Function;
}

export function Exercise({ ready }: Props) {
    return (
        <Button onClick={() => ready()}>Готово</Button>
    );
}

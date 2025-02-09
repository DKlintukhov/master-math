import { Button } from "@mui/material";

interface Props {
    finished: Function;
}

export function Results({ finished }: Props) {
    return (
        <Button onClick={() => finished()}>Финиш</Button>
    );
}

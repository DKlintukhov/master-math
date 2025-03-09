import Button from "@mui/material/Button";
import { Container } from "@mui/material";

interface Props {
    onGeneratedExcersizeNavigated: () => void;
    onExcersizeBuilderNavigated: () => void;
}

export function Main({ onGeneratedExcersizeNavigated, onExcersizeBuilderNavigated }: Props) {

    return (
        <Container style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px"
        }}>
            <Button variant="outlined" onClick={onGeneratedExcersizeNavigated}>Сгенерировать упражнение</Button>
            <Button variant="outlined" onClick={onExcersizeBuilderNavigated}>Создать упражнение</Button>
        </Container>
    );
}

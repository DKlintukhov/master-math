import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Container } from "@mui/material";
import { Exercise, ExerciseSetup, Results } from "./pages";
import { useEffect, useState } from "react";
import { ExerciseConfig, Expression, Response } from "./models";

export function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [expressions, setExpressions] = useState<Expression[]>([]);
    const [answers, setAnswers] = useState<number[]>([]);
    const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
    const [timeout, setTimeout] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    const exerciseStarted = async (config: ExerciseConfig, timeout: number) => {
        try {
            const json = await window.webui.call('GenerateExpressions', JSON.stringify(config));
            const { error, expressions, answers } = JSON.parse(json) as Response;
            if (error) {
                throw error;
            }

            setTimeout(timeout);
            setExpressions(expressions);
            setCorrectAnswers([...answers]);
            navigate("/exercise");
        } catch (e) {
            console.error(e);
        }
    }

    const exerciseFinished = (duration: number, answers: number[]) => {
        setDuration(duration);
        setAnswers([...answers]);
        navigate("/results");
    }

    const finished = () => {
        navigate("/");
    }

    useEffect(() => {
        if (location.pathname !== "/") {
            navigate("/");
        }
    }, []);

    return (
        <Container maxWidth="md"
            style={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden"
            }}>
            <Routes>
                <Route path="/" element={<ExerciseSetup onStarted={exerciseStarted} />} />
                <Route path="/exercise" element={<Exercise timeout={timeout} expressions={expressions} onFinished={exerciseFinished} />} />
                <Route path="/results" element={<Results
                    expressions={expressions}
                    duration={duration}
                    answers={answers}
                    correctAnswers={correctAnswers}
                    onReplay={() => navigate("/exercise")}
                    onFinished={finished} />}
                />
            </Routes>
        </Container>
    );
}

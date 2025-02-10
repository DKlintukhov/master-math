import { Routes, Route, useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { Exercise, ExerciseSetup, Results } from './pages';
import { useState } from 'react';
import { SimpleExpression } from './models';

export function App() {
    const navigate = useNavigate();
    const [expressions, setExpressions] = useState<SimpleExpression[]>([]);
    const [timeout, setTimeout] = useState<number>(0);

    const exerciseStarted = (timeout: number, expressions: SimpleExpression[]) => {
        setTimeout(timeout);
        setExpressions(expressions);
        navigate('/exercise');
    }

    const exerciseFinished = (duration: number, answers: number[]) => {
        console.log(duration, answers);
        navigate('/results');
    }

    const finished = () => {
        navigate('/');
    }

    return (
        <Container maxWidth='md'
            style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
            }}>
            <Routes>
                <Route path='/' element={<ExerciseSetup onStarted={exerciseStarted} />} />
                <Route path='/exercise' element={<Exercise timeout={timeout} expressions={expressions} onFinished={exerciseFinished} />} />
                <Route path='/results' element={<Results onFinished={finished} />} />
            </Routes>
        </Container>

    );
}

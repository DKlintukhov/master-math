import { Routes, Route, useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { Exercise, Main, Results } from './pages';

export function App() {
    const navigate = useNavigate();

    const exerciseStarted = () => {
        navigate('/exercise');
    }

    const exerciseReady = () => {
        navigate('/results');
    }

    const exerciseFinished = () => {
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
                <Route path='/' element={<Main started={exerciseStarted} />} />
                <Route path='/exercise' element={<Exercise ready={exerciseReady} />} />
                <Route path='/results' element={<Results finished={exerciseFinished} />} />
            </Routes>
        </Container>

    );
}

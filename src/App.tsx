import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { 
  FormControl, 
  OutlinedInput, 
  InputLabel,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { ExerciseConfig } from "./models/ExerciseConfig";


function App() {
  const [config, setConfig] = useState(new ExerciseConfig(15, 0, 100, true, true, false, false));
  const [timeout, setTimeout] = useState(5);
  const [amount, setAmount] = useState(5);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [useAdd, setUseAdd] = useState(true);
  const [useSub, setUseSub] = useState(true);
  const [useMul, setUseMul] = useState(false);
  const [useDiv, setUseDiv] = useState(false);

  async function start() {
    setConfig(await invoke("start", {
      config: {
        amount,
        min,
        max,
        useAdd,
        useSub,
        useMul,
        useDiv
      }
    }));
  }

  return (
    <Container>
      <Box>
        <>
          <FormControl variant="outlined">
            <InputLabel htmlFor="timeoutInput">Время</InputLabel>
            <OutlinedInput 
              label="Время" 
              id="timeoutInput"
              defaultValue={timeout} 
              onChange={(e) => setTimeout(Number(e.target.value))}
            />
          </FormControl>

          <FormControl variant="outlined">
            <InputLabel htmlFor="amountInput">Количество примеров</InputLabel>
            <OutlinedInput 
              label="Количество примеров" 
              id="amountInput"
              defaultValue={amount} 
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </FormControl>

          <FormControl variant="outlined">
            <InputLabel htmlFor="minInput">Мин. число</InputLabel>
            <OutlinedInput 
              label="Мин. число" 
              id="minInput"
              defaultValue={min} 
              onChange={(e) => setMin(Number(e.target.value))}
            />
          </FormControl>

          <FormControl variant="outlined">
            <InputLabel htmlFor="maxInput">Макс. число</InputLabel>
            <OutlinedInput 
              label="Макс. число" 
              id="maxInput"
              defaultValue={max} 
              onChange={(e) => setMax(Number(e.target.value))}
            />
          </FormControl>

          <FormGroup>
            <FormControlLabel control={<Checkbox checked={useAdd} onChange={(e) => setUseAdd(Boolean(e.target.value))} />} label="+" />
            <FormControlLabel control={<Checkbox checked={useSub} onChange={(e) => setUseSub(Boolean(e.target.value))} />} label="-" />
            <FormControlLabel control={<Checkbox checked={useMul} onChange={(e) => setUseMul(Boolean(e.target.value))} />} label="*" />
            <FormControlLabel control={<Checkbox checked={useDiv} onChange={(e) => setUseDiv(Boolean(e.target.value))} />} label=":" />
          </FormGroup>
        </>
        <Button variant="outlined" onClick={() => start()}>Начать</Button>
        <Box>{JSON.stringify(config)}</Box>
      </Box>
    </Container>
  );
}

export default App;

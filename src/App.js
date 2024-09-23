import React, { useState, useEffect } from 'react';
import PersonTable from './components/PersonTable';
import { ThemeProvider, createTheme} from '@mui/material/styles'
import { CssBaseline, DialogContent, DialogTitle, TextField } from '@mui/material';
import { getTable, peopleTasksToDayMap } from './utils';
import ChangeAvailability from './components/ChangeAvailability';


function App() {
  const [map, setMap] = useState({});
  

  

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPeople = await getTable('people');
      const fetchedTasks = await getTable('task_list');
      const sourcedMap = await peopleTasksToDayMap(fetchedPeople, fetchedTasks);
      setMap(sourcedMap);
    };

    fetchData();
  }, []);

  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <h1>Task list for the week</h1>
        <ChangeAvailability/>
        <PersonTable map={map} />
      </div>
    </ThemeProvider>
    
  )
}

export default App;

// src/App.tsx
import React from 'react';
import { YearlyMaxMinTable, AverageYieldAndAreaTable } from './components/DataTable';

const App = () => {
  return (
    <div>
      <h1>Indian Agriculture Data Analysis</h1>
      <h2>Yearly Max and Min Production</h2>
      <YearlyMaxMinTable />
      <h2>Average Yield and Cultivation Area</h2>
      <AverageYieldAndAreaTable />
    </div>
  );
};

export default App;

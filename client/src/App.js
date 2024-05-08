import './App.css';
import {useState} from "react";
import {Axios} from "axios";
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';
import Menu from './components/menu';

function App() { //NOTA: USAR EL ROUTER
  return (
    <div className="App">
      <Menu/>
    </div>
  );
}

export default App;

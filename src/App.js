import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import FileSearch from './components/FileSearch'

import './App.css';

function App() {
  return (
    <div className="App container-fluid">
      <div class="row">
        <div className="col-3 bg-danger left-panel">
          <FileSearch
            title="我的云文档"
          >
          </FileSearch>
        </div>
        <div className="col-9 bg-primary right-panel">
          <h1>This is the  right</h1>
        </div>
      </div>
    </div>
  ); 
}

export default App;

import './App.css';
import { useState } from "react";
import { usePapaParse } from 'react-papaparse';

function App() {
  const { readString } = usePapaParse();
  const [error, setError] = useState("");
  const [data, setData] = useState([])

  const onChangeFileHandler = (e) => {
    setError("");
    const inputFile = e.target.files[0];
    const fileType = inputFile?.type;

    if (fileType != "text/csv") {
      setError("Please enter CSV file.");
      e.target.value = null;
      return;
    }

    parseData(inputFile);

    function parseData(data) {
      readString(data, {
        worker: true,
        complete: (results) => {
          setData(results.data); 
        }
      });
    }
  }


  return (
    <div className="App">
      <div className='fileInput'>
        <input onChange={onChangeFileHandler} type='file' name='file' />
      </div>
      {
        error ?
          <div className='error'>
            {error}
          </div>
          : data
      }
    </div>
  );
}

export default App;

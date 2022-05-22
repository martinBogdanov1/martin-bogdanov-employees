import './App.css';
import { useState } from "react";
import { usePapaParse } from 'react-papaparse';

function App() {
  const { readString } = usePapaParse();
  const [error, setError] = useState("");
  const [pairDetails, setPairDetails] = useState([])

  const onChangeFileHandler = (e) => {
    setPairDetails([]);
    setError("");
    const inputFile = e.target.files[0];
    const fileType = inputFile?.type;

    if (fileType !== "text/csv") {
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
    <div className="container text-center">
      <div>
        <label className='btn btn-primary' htmlFor="inputTag">
          Select CSV
          <input onChange={onChangeFileHandler} id="inputTag" type="file" />
        </label>
      </div>
      {
        error
          ?
          <div className='error'>
            {error}
          </div>
          :
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">EmployeeID #1</th>
                <th scope="col">EmployeeID #2</th>
                <th scope="col">ProjectID</th>
                <th scope="col">Total Days</th>
              </tr>
            </thead>
            <tbody>
              {pairDetails.map(x => {
                return <tr key={x.firstEmployeeId + x.projectId}>
                  <td>{x.firstEmployeeId}</td>
                  <td>{x.secondEmployeeId}</td>
                  <td>{x.projectId}</td>
                  <td>{x.daysWorked}</td>
                </tr>
              })}
            </tbody>
          </table>
      }
    </div>
  );
}

export default App;
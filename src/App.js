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
  }

  function parseData(data) {
    readString(data, {
      worker: true,
      complete: (results) => {
        let employees = [];

        results.data.forEach((x, i) => {
          if (i > 0 && x[0] !== '') {

            if (x[3] === 'NULL') {
              x[3] = Date();
            }

            const employeeDetails = {
              id: x[0],
              projectId: x[1],
              dateFrom: x[2],
              dateTo: x[3]
            };
            employees.push(employeeDetails);
          }
        });

        const employeesByProjectId = groupByProjectId(employees);
        setPairDetails(getPairDetails(employeesByProjectId));
      }
    });
  }

  function getPairDetails(employees) {
    let pairDetails = [];

    for (let [projectId, employeesByProject] of Object.entries(employees)) {
      if (employeesByProject.length < 2) {
        continue;
      }

      if (employeesByProject.length === 2) {
        setDaysWorkedPerEmployee(employeesByProject);
        const daysWorkedByPair = employeesByProject[0].workDays + employeesByProject[1].workDays;

        pairDetails.push(buildPairDetails(employeesByProject, projectId, daysWorkedByPair));
      }

      if (employeesByProject.length > 2) {
        setDaysWorkedPerEmployee(employeesByProject);

        employeesByProject.sort((a, b) => b.workDays - a.workDays);

        const longestPair = employeesByProject.slice(0, 2);
        const daysWorkedByPair = longestPair[0].workDays + longestPair[1].workDays;

        pairDetails.push(buildPairDetails(longestPair, projectId, daysWorkedByPair));
      }
    }

    return pairDetails.sort((a, b) => b.days - a.days);
  }

  function setDaysWorkedPerEmployee(employees) {
    employees.map(x => {
      const daysWorked = dateRangeToDaysConverter(x.dateTo, x.dateFrom);
      x.workDays = daysWorked
    });
  }

  function buildPairDetails(groupedEmployees, projectId, daysWorked) {
    return {
      firstEmployeeId: groupedEmployees[0].id,
      secondEmployeeId: groupedEmployees[1].id,
      projectId: projectId,
      daysWorked: daysWorked
    }
  }

  function groupByProjectId(employees) {
    return employees.reduce((group, employee) => {
      if (!group[employee.projectId]) {
        group[employee.projectId] = [];
      }
      group[employee.projectId].push(employee);

      return group;
    }, {});
  }

  function dateRangeToDaysConverter(dateTo, dateFrom) {
    return Math.ceil((Date.parse(dateTo) - Date.parse(dateFrom)) / (1000 * 60 * 60 * 24));
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
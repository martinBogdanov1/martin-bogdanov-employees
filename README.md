# Longest period pair on a project finder

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Acceptance criteria
'Create an application that identifies the pair of employees who have worked 
together on common projects for the longest period of time.'

### Additional requirements
- DateTo can be NULL, equivalent to today
- The input data must be loaded to the program from a CSV file
- Create an UI:
The user picks up a file from the file system and, after selecting it, all common 
projects of the pair are displayed in datagrid with the following columns:
Employee ID #1, Employee ID #2, Project ID, Days worked
- The task solution needs to be uploaded in github.com, repository name must be in 
format: {FirstName}-{LastName}-employees

## Solution
The solution is implemented on React.js. It is also using 'papaparse' package to help with parsing the passed csv of the employees. The UI is simple and also making usage of Bootstrap.
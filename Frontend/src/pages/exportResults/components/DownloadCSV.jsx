import React from 'react';
//https://medium.com/@gb.usmanumar/how-to-export-data-to-csv-json-in-react-js-ea45d940652a
const DownloadCSV = ({ data, fileName, id }) => {
  // This function converts the data array to CSV format
  const convertToCSV = (objArray) => {
    // Convert the data to an array if it's not already
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = 'Participant Number,Status,Age,Gender,Number of Responses\r\n';
    
    // Process each object (participant) in the array
    for (let i = 0; i < array.length; i++) {
      let line = '';
      
      // Create a row with participant number (instead of MongoDB ID)
      line += `Participant ${i + 1},`;
      
      // Add status
      line += `${array[i].isCompleted ? 'Completed' : 'In Progress'},`;
      
      // Add demographics if available
      line += `${array[i].demographics?.age || ''},`;
      line += `${array[i].demographics?.gender || ''},`;
      
      // Add number of responses
      line += `${array[i].responses?.length || 0}`;
      
      // Add this line to our result string
      str += line + '\r\n';
    }
    
    // Return the CSV string
    return str;
  };
  
  // This function handles the download process
  const downloadCSV = () => {
    // Convert data to CSV
    const csvData = new Blob([convertToCSV(data)], { type: 'text/csv' });
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement('a');
    link.href = csvURL;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return ( // the id is being also used in exportdropdown.jsx
    <button id={id} onClick={downloadCSV}>Download CSV</button>
  );
};

export default DownloadCSV;
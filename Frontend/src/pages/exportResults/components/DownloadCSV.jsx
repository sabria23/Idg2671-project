/*
//https://medium.com/@gb.usmanumar/how-to-export-data-to-csv-json-in-react-js-ea45d940652a
*/

  import React from 'react';

  const DownloadCSV = ({ data, fileName, id }) => {
    // This function converts the data array to CSV format with semicolons as separators
    const convertToCSV = (objArray) => {
      // Use semicolon as delimiter instead of comma
      const delimiter = ';';
      
      const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
      
      if (!array || array.length === 0) {
        return `Participant Number${delimiter}Status${delimiter}Number of Responses\n`;
      }
      
      const demographicKeys = new Set();
      array.forEach(participant => {
        if (participant.demographics && participant.demographics instanceof Map) {
          for (const key of participant.demographics.keys()) {
            demographicKeys.add(key);
          }
        } else if (participant.demographics && typeof participant.demographics === 'object') {
          Object.keys(participant.demographics).forEach(key => {
            demographicKeys.add(key);
          });
        }
      });
      
      const sortedDemographicKeys = Array.from(demographicKeys).sort();
      
      let headers = `Participant Number${delimiter}Status`;
      
      sortedDemographicKeys.forEach(key => {
        headers += `${delimiter}${key}`;
      });
      
      headers += `${delimiter}Number of Responses\n`;
      
      let str = headers;
      for (let i = 0; i < array.length; i++) {
        let line = '';
        
        line += `Participant ${i + 1}${delimiter}`;
        line += `${array[i].isCompleted ? 'Completed' : 'In Progress'}`;
      
        sortedDemographicKeys.forEach(key => {
          let value = '';
          
          if (array[i].demographics instanceof Map) {
            value = array[i].demographics.get(key) || '';
          } 
          else if (array[i].demographics && typeof array[i].demographics === 'object') {
            value = array[i].demographics[key] || '';
          }
          
          line += `${delimiter}${value}`;
        });
        
        line += `${delimiter}${array[i].responses?.length || 0}`;
      
        str += line + '\n';
      }
      
      return str;
    };
    
    // This function handles the download process
    const downloadCSV = () => {
      const BOM = '\uFEFF';
      const csvString = BOM + convertToCSV(data);
      const csvData = new Blob([csvString], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      const csvURL = URL.createObjectURL(csvData);
      const link = document.createElement('a');
      link.href = csvURL;
      link.setAttribute('download', `${fileName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    
    return (
      <button id={id} onClick={downloadCSV}>Download CSV</button>
    );
  };
  
  export default DownloadCSV;
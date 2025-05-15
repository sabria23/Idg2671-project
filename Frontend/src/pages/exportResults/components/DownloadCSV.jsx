/*import React from 'react';
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
  };*/

  import React from 'react';

  const DownloadCSV = ({ data, fileName, id }) => {
    // This function converts the data array to CSV format with semicolons as separators
    const convertToCSV = (objArray) => {
      // Use semicolon as delimiter instead of comma
      const delimiter = ';';
      
      // Convert the data to an array if it's not already
      const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
      
      // If there's no data, return an empty CSV with headers
      if (!array || array.length === 0) {
        return `Participant Number${delimiter}Status${delimiter}Number of Responses\n`;
      }
      
      // Extract all unique demographic field keys from all participants
      const demographicKeys = new Set();
      array.forEach(participant => {
        if (participant.demographics && participant.demographics instanceof Map) {
          // Handle Map instance
          for (const key of participant.demographics.keys()) {
            demographicKeys.add(key);
          }
        } else if (participant.demographics && typeof participant.demographics === 'object') {
          // Handle regular object
          Object.keys(participant.demographics).forEach(key => {
            demographicKeys.add(key);
          });
        }
      });
      
      // Convert Set to Array and sort alphabetically for consistency
      const sortedDemographicKeys = Array.from(demographicKeys).sort();
      
      // Create header row
      let headers = `Participant Number${delimiter}Status`;
      
      // Add demographic headers
      sortedDemographicKeys.forEach(key => {
        headers += `${delimiter}${key}`;
      });
      
      // Add responses count header
      headers += `${delimiter}Number of Responses\n`;
      
      // Process each object (participant) in the array
      let str = headers;
      for (let i = 0; i < array.length; i++) {
        let line = '';
        
        // Add participant number
        line += `Participant ${i + 1}${delimiter}`;
        
        // Add status
        line += `${array[i].isCompleted ? 'Completed' : 'In Progress'}`;
        
        // Add demographics values
        sortedDemographicKeys.forEach(key => {
          let value = '';
          
          // Check if demographics is a Map
          if (array[i].demographics instanceof Map) {
            value = array[i].demographics.get(key) || '';
          } 
          // Check if demographics is a regular object
          else if (array[i].demographics && typeof array[i].demographics === 'object') {
            value = array[i].demographics[key] || '';
          }
          
          // No need to escape commas since we're using semicolons as delimiters
          line += `${delimiter}${value}`;
        });
        
        // Add number of responses
        line += `${delimiter}${array[i].responses?.length || 0}`;
        
        // Add this line to our result string
        str += line + '\n';
      }
      
      return str;
    };
    
    // This function handles the download process
    const downloadCSV = () => {
      // Add BOM for Excel to recognize UTF-8
      const BOM = '\uFEFF';
      
      // Convert data to CSV with BOM
      const csvString = BOM + convertToCSV(data);
      
      // For Excel compatibility, use the right mime type
      const csvData = new Blob([csvString], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      // Create download link
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
import React from 'react';
// https://medium.com/@gb.usmanumar/how-to-export-data-to-csv-json-in-react-js-ea45d940652a
const DownloadJSON = ({ data, fileName }) => {
  const downloadJSON = () => {
    const jsonData = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const jsonURL = URL.createObjectURL(jsonData);
    const link = document.createElement('a');
    link.href = jsonURL;
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={downloadJSON}>Download JSON</button>
  );
}

export default DownloadJSON;
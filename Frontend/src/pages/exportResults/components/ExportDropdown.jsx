/*import React from 'react';
import DropdownMenu from '../../../components/common/DropDownMenu';
import DownloadCSV from './DownloadCSV';
import DownloadJSON from './DownloadJson';
import styles from "../styles/ExportDropdown.module.css";

const ExportDropdown = ({data, fileName}) => {

    //options for the drowpdown menu: either json or csv for now
    const exportOptions = [
        {
            label: 'Download CSV',
            action: () => document.getElementById('csv-download-btn').click()
        },
        {
            label: 'Download JSON',
            action: () => document.getElementById('json-download-btn').click()
          }
    ];
  return (
    <div className='export-container'>
        <DropdownMenu
        options={exportOptions}
        buttonLabel="Export data ▼"
        buttonClassName={styles.exportButton}
        />
        <div style={{display: 'none'}}>
            <DownloadCSV
            data={data}
            fileName={fileName}
            id="csv-download-btn"
            />
            <DownloadJSON 
            data={data} 
            fileName={fileName}
            id="json-download-btn" 
            />
        </div>
    </div>
  );
};

export default ExportDropdown;*/
import React from 'react';
import DropdownMenu from '../../../components/common/DropDownMenu';
import DownloadCSV from './DownloadCSV';
import DownloadJSON from './DownloadJson';
import styles from "../styles/ExportDropdown.module.css";

const ExportDropdown = ({data, fileName}) => {
  const exportOptions = [
    {
      label: 'Download CSV',
      action: () => document.getElementById('csv-download-btn').click()
    },
    {
      label: 'Download JSON',
      action: () => document.getElementById('json-download-btn').click()
    }
  ];

  return (
    <div className={styles.exportContainer}>
      <DropdownMenu
        options={exportOptions}
        buttonLabel="Export data"
        buttonClassName={styles.exportButton}
        menuClassName={styles.exportDropdownMenu}
      />
      <div style={{display: 'none'}}>
        <DownloadCSV
          data={data}
          fileName={fileName}
          id="csv-download-btn"
        />
        <DownloadJSON
          data={data}
          fileName={fileName}
          id="json-download-btn"
        />
      </div>
    </div>
  );
};

export default ExportDropdown;
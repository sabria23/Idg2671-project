import React from 'react'
import styles from "../../styles/ConfirmationMsg.module.css";

const ConfirmationMsg = ({ isOpen, message, onConfirm, onCancel}) => {
    if (!isOpen) return null;

  return (
    <div className={StyleSheet.modalOverlay}>
        <div className={StyleSheet.modalContent}>
            <h3>Confirm Action</h3>
            <p>{message}</p>
            <div className={StyleSheet.modalBtn}>
                <button className={styles.cancelButton} onClick={onCancel}>
                 Cancel
                </button>
                <button className={styles.confirmButton} onClick={onConfirm} >
                    Confirm
                </button>
            </div>
        </div>
    </div>
  );
};

export default ConfirmationMsg;
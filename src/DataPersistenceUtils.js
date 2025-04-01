import React from 'react';

// Data persistence utility functions
const DataPersistenceUtils = {
  // Save data to localStorage
  saveToLocalStorage: (key, data) => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  // Load data from localStorage
  loadFromLocalStorage: (key, defaultValue = null) => {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return defaultValue;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  },

  // Export data to JSON file
  exportToJson: (data, filename) => {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFilename = filename || `quality-reorg-export-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFilename);
      linkElement.style.display = 'none';
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      
      return true;
    } catch (error) {
      console.error('Error exporting data:', error);
      return false;
    }
  },

  // Import data from JSON file
  importFromJson: (file) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          try {
            const importedData = JSON.parse(event.target.result);
            resolve(importedData);
          } catch (parseError) {
            reject(new Error('Invalid JSON format'));
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Error reading file'));
        };
        
        reader.readAsText(file);
      } catch (error) {
        reject(error);
      }
    });
  },

  // Create a backup of current data
  createBackup: (data) => {
    try {
      const timestamp = new Date().toISOString();
      const backupKey = `quality-reorg-backup-${timestamp}`;
      DataPersistenceUtils.saveToLocalStorage(backupKey, data);
      
      // Keep track of backups
      const backupsList = DataPersistenceUtils.loadFromLocalStorage('quality-reorg-backups', []);
      backupsList.push({
        key: backupKey,
        timestamp,
        description: `Automatic backup - ${new Date(timestamp).toLocaleString()}`
      });
      
      // Limit to last 10 backups
      if (backupsList.length > 10) {
        const oldestBackup = backupsList.shift();
        localStorage.removeItem(oldestBackup.key);
      }
      
      DataPersistenceUtils.saveToLocalStorage('quality-reorg-backups', backupsList);
      return true;
    } catch (error) {
      console.error('Error creating backup:', error);
      return false;
    }
  },

  // List available backups
  listBackups: () => {
    return DataPersistenceUtils.loadFromLocalStorage('quality-reorg-backups', []);
  },

  // Restore from backup
  restoreFromBackup: (backupKey) => {
    return DataPersistenceUtils.loadFromLocalStorage(backupKey, null);
  },

  // Clear all data
  clearAllData: () => {
    try {
      // Get list of backups first
      const backupsList = DataPersistenceUtils.loadFromLocalStorage('quality-reorg-backups', []);
      
      // Remove all backups
      backupsList.forEach(backup => {
        localStorage.removeItem(backup.key);
      });
      
      // Remove main data and backups list
      localStorage.removeItem('quality-reorg-backups');
      localStorage.removeItem('qualityReorgData');
      
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
};

// Data persistence hook for React components
const useDataPersistence = (initialData) => {
  const [data, setData] = React.useState(() => {
    // Try to load from localStorage on initial render
    return DataPersistenceUtils.loadFromLocalStorage('qualityReorgData', initialData);
  });
  
  // Save to localStorage whenever data changes
  React.useEffect(() => {
    DataPersistenceUtils.saveToLocalStorage('qualityReorgData', data);
    
    // Create periodic backups (every 10 changes)
    const changeCount = React.useRef(0);
    changeCount.current += 1;
    
    if (changeCount.current % 10 === 0) {
      DataPersistenceUtils.createBackup(data);
    }
  }, [data]);
  
  // Export current data
  const exportData = (filename) => {
    return DataPersistenceUtils.exportToJson(data, filename);
  };
  
  // Import data
  const importData = async (file) => {
    try {
      const importedData = await DataPersistenceUtils.importFromJson(file);
      setData(importedData);
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  };
  
  // Reset to initial data
  const resetData = () => {
    setData(initialData);
  };
  
  return {
    data,
    setData,
    exportData,
    importData,
    resetData,
    backups: {
      create: () => DataPersistenceUtils.createBackup(data),
      list: DataPersistenceUtils.listBackups,
      restore: (backupKey) => {
        const backupData = DataPersistenceUtils.restoreFromBackup(backupKey);
        if (backupData) {
          setData(backupData);
          return true;
        }
        return false;
      }
    },
    clearAll: () => {
      DataPersistenceUtils.clearAllData();
      setData(initialData);
    }
  };
};

export { DataPersistenceUtils, useDataPersistence };

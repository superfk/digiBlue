import React from 'react';

const sysContext = React.createContext({
    bleDevice: null,
    data: '',
    historyData: [],
    startScan: () => { },
    disconnect: () => { },
    handleCommandSend: () => { },
    toggleDrawer: () => {},
    setSystemLoaded: () => {},
    
  });

export default sysContext;
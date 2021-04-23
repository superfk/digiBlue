import React from 'react';

const sysContext = React.createContext({
    bleDevice: null,
    data: '',
    historyData: [],
    devices: [],
    connecting: false,
    startScan: () => { },
    disconnect: () => { },
    handleCommandSend: () => { },
    toggleDrawer: () => {},
    setSystemLoaded: () => {},
    handleConnect: () => {},
    
  });

export default sysContext;
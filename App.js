import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import base64 from 'react-native-base64';
import SideBar from './components/SideBar/SideBar';
import AnimatedSplash from "react-native-animated-splash-screen";

import { createDrawerNavigator, DrawerActions } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from './screens/HomeScreen';
import SetupScreen from './screens/SetupScreen';

import SysContext from './context/sys-context';

const manager = new BleManager();

const Drawer = createDrawerNavigator();

export default function App(props) {

  const [bleDevice, setBleDevice] = useState(null);
  const [deviceName, setDeviceName] = useState('');
  const [connected, setConnected] = useState(false);
  const [toggleDisconnect, setToggleDisconnect] = useState(false);
  const [data, setData] = useState(null);
  const [startMonitor, setStartMonitor] = useState(false);
  const [histData, setHistData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
        if (result) {
          console.log("Permission is OK");
        } else {
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
            if (result) {
              console.log("User accept");
            } else {
              console.log("User refuse");
            }
          });
        }
      });
    }
    return () => {
      const subscription = manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          subscription.remove();
        }
      }, true);
    }
  }, [])

  useEffect(() => {

    if (startMonitor && bleDevice !== null) {
      const manufData = bleDevice.manufacturerData
      const serviceData = bleDevice.serviceData
      const serviceUUID = bleDevice.serviceUUIDs
      console.log(manufData)
      console.log(serviceData)
      console.log(serviceUUID)

      bleDevice.monitorCharacteristicForService(
        "49535343-FE7D-4AE5-8FA9-9FAFD205E455",
        "49535343-1E4D-4BD9-BA61-23C647249616",
        (error, characteristic) => {
          // console.log('characteristic:', characteristic)
          if (error) {
            console.log('error occurred in read function,', error)
          } else {
            const resp = base64.decode(characteristic.value).trim();
            try {
              console.log(`resp: ${resp}`)
              const floatData = parseFloat(resp);
              console.log(`float data: ${floatData}`)
              const curHistory = [...histData];
              curHistory.push(floatData);
              setHistData(curHistory);
            } catch (err) {
              console.log(err)
            }
            setData(resp);
          }
        }

      );
      setStartMonitor(false);
    }

  }, [bleDevice, startMonitor, histData])

  const startScan = (e) => {
    console.log('start to connect device')
    manager.startDeviceScan(null, { scanMode: 'Balanced' }, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return
      }

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device.name === 'BAR_1017667_1113') {
        console.log(device)
        console.log('device name: ', device.name)

        // Stop scanning as it's not necessary if you are scanning for one device.
        manager.stopDeviceScan();
        if (!connected) {
          device.connect()
            .then((d) => {
              return d.discoverAllServicesAndCharacteristics()
            })
            .then((d) => {
              // Do work on device with services and characteristics
              setBleDevice(d);
              setDeviceName(d.name);
              setConnected(true);
              setStartMonitor(true);
            })
            .catch((error) => {
              console.log('error occurred in connect function,', error)
              // Handle errors
            });
        }
      }
    }
    )
  }

  const disconnect = (e) => {
    setToggleDisconnect(true);
  }

  const handleCommandSend = async (cmd) => {
    console.log('send command:', cmd)
    console.log('send id device id:', bleDevice.id)
    try {
      await manager.writeCharacteristicWithoutResponseForDevice(
        bleDevice.id,
        "49535343-FE7D-4AE5-8FA9-9FAFD205E455",
        "49535343-1E4D-4BD9-BA61-23C647249616",
        base64.encode(cmd.value));

    } catch (error) {

      console.log('send command error:', error)
    }
  }

  useEffect(() => {
    const disconnetDevice = async (device) => {
      const disconnected = await device.cancelConnection();
      return disconnected
    }
    if (toggleDisconnect && bleDevice !== null) {
      console.log('start to disconnect device')
      disconnetDevice(bleDevice)
        .then((res) => {
        })
        .catch((error) => {
          console.log('error occurred in diconnect function,', error)
        });
      setBleDevice(null);
      setConnected(false);
      setStartMonitor(false);
      setToggleDisconnect(false);
    }

  }, [toggleDisconnect, bleDevice])

  const toggleDrawer = () => {
    console.log(props)
    props.navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const setSystemLoaded = () => {
    setIsLoaded(true)
  };

  return (
    <SysContext.Provider value={{
      bleDevice: bleDevice,
      data: data,
      historyData: histData,
      startScan: startScan,
      disconnect: disconnect,
      handleCommandSend: handleCommandSend,
      toggleDrawer: toggleDrawer,
      setSystemLoaded: setSystemLoaded,

    }}>
      <AnimatedSplash
        translucent={true}
        isLoaded={isLoaded}
        logoImage={require("./assets/logo.png")}
        backgroundColor={"#262626"}
        logoHeight={150}
        logoWidth={150}
      >
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Home" drawerContent={props => <SideBar {...props} />}>
            <Drawer.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Home',
                headerStyle: {
                  backgroundColor: '#f4511e',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },

              }} />
            <Drawer.Screen name="Setup" component={SetupScreen} options={{ title: 'Setup' }} />
          </Drawer.Navigator>
        </NavigationContainer>
      </AnimatedSplash>
    </SysContext.Provider>
  );
}


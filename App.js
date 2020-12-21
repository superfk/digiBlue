import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform, PermissionsAndroid, Image } from 'react-native';
import { Container, Header, Body, Footer, FooterTab, Button, Icon, Badge } from 'native-base';
import { BleManager } from 'react-native-ble-plx';
import base64 from 'react-native-base64';
import MainButton from './components/MainButton.android';
import { set } from 'react-native-reanimated';

const manager = new BleManager();

export default function App() {
  const [bleDevice, setBleDevice] = useState(null);
  const [deviceName, setDeviceName] = useState('');
  const [connected, setConnected] = useState(false);
  const [toggleDisconnect, setToggleDisconnect] = useState(false);
  const [data, setData] = useState(null);
  const [startMonitor, setStartMonitor] = useState(false);

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
            setData(resp);
          }
        }

      );
      setStartMonitor(false);
    }

  }, [bleDevice, startMonitor])

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

  useEffect(() => {
    const disconnetDevice = async (device) => {
      const disconnected = await device.cancelConnection();
      return disconnected
    }
    if (toggleDisconnect && bleDevice !== null) {
      console.log('start to disconnect device')
      disconnetDevice(bleDevice)
        .then((res) => {
          setBleDevice(null);
          console.log('disconnected', res)
          setConnected(false);
          setStartMonitor(false);
          setToggleDisconnect(false);
        })
        .catch((error) => {
          console.log('error occurred in diconnect function,', error)
        });
    }

  }, [toggleDisconnect, bleDevice])

  return (
    <Container>

      <Header transparent>
        <Body style={{ flex: 1 }}>
          <Image style={styles.tinyLogo} source={require('./assets/Bareiss_LOGO.png')} />
          <Text>digiBlue App Demo</Text>
        </Body>
      </Header>

      <View style={styles.container}>
        <Button block primary onPress={startScan} style={styles.button}>
          <Text style={{ color: 'white' }}>Scan</Text>
        </Button>
        <Button block warning onPress={disconnect}>
          <Text style={{ color: 'white' }}>Disconnect</Text>
        </Button>
      </View>
      <View style={styles.infoContainer}>
        <Text adjustsFontSizeToFit>Device name: {bleDevice ? bleDevice.name : '--'}</Text>
        <Text adjustsFontSizeToFit>Device address: {bleDevice ? bleDevice.id : '--'}</Text>
        <Text style={styles.valueText} adjustsFontSizeToFit>{bleDevice ? data : '--'}</Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 50,
  },
  tinyLogo: {
    maxWidth: 180,
    maxHeight: 20
  },
  infoContainer: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 30,
    height: 250,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2,
    padding: 20

  },
  button: {
    marginBottom: 10
  },
  valueText: {
    flex: 1,
    fontSize: 48,
    color: '#0075be',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    maxHeight: 200,
  }
});

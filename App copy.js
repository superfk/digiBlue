import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform, PermissionsAndroid, Image, ActionSheetIOS, ScrollView } from 'react-native';
import { Container, Header, Body, Footer, FooterTab, Button, Icon, Badge, Input, Item } from 'native-base';
import { BleManager } from 'react-native-ble-plx';
import base64 from 'react-native-base64';
import { Picker } from '@react-native-community/picker';

const manager = new BleManager();

const options = [
  { idx: 0, value: "GET(DEV_NAME),DB21", label: "GET(DEV_NAME),DB21" },
  { idx: 1, value: "GET(DEV_SV),563B", label: "GET(DEV_SV),563B" },
  { idx: 2, value: "GET(MS_DURATION),EC15", label: "GET(MS_DURATION),EC15" },
  { idx: 3, value: "GET(MS_METHOD),2C41", label: "GET(MS_METHOD),2C41" },
  { idx: 4, value: "GET(SYSTEM),E9D5", label: "GET(SYSTEM),E9D5" },
  { idx: 5, value: "SET(MS_DURATION=5),3A3D", label: "SET(MS_DURATION=5),3A3D" },
]

export default function App() {
  const [bleDevice, setBleDevice] = useState(null);
  const [deviceName, setDeviceName] = useState('');
  const [connected, setConnected] = useState(false);
  const [toggleDisconnect, setToggleDisconnect] = useState(false);
  const [data, setData] = useState(null);
  const [startMonitor, setStartMonitor] = useState(false);
  const [command, setCommand] = useState(options[0]);

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

  const onPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: options.map(elm => {
          return elm.label;
        })
      },
      buttonIndex => {
        const selectedCommand = options.find(elm => elm.idx === buttonIndex);
        if (selectedCommand !== undefined) {
          handleCommandChange(selectedCommand);
        }
      }
    );

  const pickerSwitch = () => {
    if (Platform.OS === 'ios') {
      return <Button transparent small onPress={onPress}>
        <Text style={{ fontSize: 16 }}>{command.label}</Text>
      </Button>
    } else {
      return <Picker
        prompt={"select command"}
        selectedValue={command.value}
        style={{ height: 50, width: '80%' }}
        onValueChange={async (value, index) => {
          const selectedCommand = options.find(elm => elm.idx === index);
          handleCommandChange(selectedCommand);
        }}>
        {options.map(elm => <Picker.Item key={elm.value} label={elm.label} value={elm.value} />)}
      </Picker>
    }
  }

  const handleCommandChange = (selectedCommand) => {
    console.log(selectedCommand);
    setCommand(selectedCommand);
  }

  const handleCommandSend = async () => {
    console.log('send command:', command)
    console.log('send id device id:', bleDevice.id)
    try {
      await manager.writeCharacteristicWithoutResponseForDevice(
        bleDevice.id,
        "49535343-FE7D-4AE5-8FA9-9FAFD205E455",
        "49535343-1E4D-4BD9-BA61-23C647249616",
        base64.encode(command.value));

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

  return (
    <Container>

      <Header transparent>
        <Body style={{ flex: 1 }}>
          <Image style={styles.tinyLogo} source={require('./assets/Bareiss_LOGO.png')} />
          <Text>digiBlue App Demo</Text>
        </Body>
      </Header>
      <ScrollView>
        <View style={styles.container}>
          <Button block primary onPress={startScan} style={styles.button}>
            <Text style={{ color: 'white' }}>Scan</Text>
          </Button>
          <Button block warning onPress={disconnect}>
            <Text style={{ color: 'white' }}>Disconnect</Text>
          </Button>
        </View>
        <View style={styles.infoContainer}>
          <Text adjustsFontSizeToFit={true} numberOfLines={1}>Device name: {bleDevice ? bleDevice.name : '--'}</Text>
          <Text adjustsFontSizeToFit={true} numberOfLines={1}>Device address: {bleDevice ? bleDevice.id : '--'}</Text>
          <View>
            {pickerSwitch()}
          </View>
          <Button block primary onPress={handleCommandSend}>
            <Text style={{ color: 'white' }}>Send</Text>
          </Button>
          <View style={styles.respContainer}>
            <Text style={styles.valueText} adjustsFontSizeToFit={true} numberOfLines={1}>{bleDevice ? data : '--'}</Text>
          </View>
        </View>
      </ScrollView>
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
  respContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    borderWidth: 1,
    marginTop: 5,
    borderColor: '#ccc',
  },
  valueText: {
    color: '#0075be',
    fontWeight: 'bold',
  }
});

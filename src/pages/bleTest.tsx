import { BleClient, numberToUUID } from "@capacitor-community/bluetooth-le";
import { Capacitor } from "@capacitor/core";
import { IonContent, IonPage } from "@ionic/react";
import React, { useCallback, useEffect, useState } from "react";
import { Devices, Loading, Services, Terminal, TopBar } from "../components";
//import { KeepAwake } from '@capacitor-community/keep-awake';
import { preventSleep } from '../helpers/keepAwake';

interface DataType{
  chx: any,
  bin: string,
  type: string,
  ascii: string
}

const BleTest: React.FC = () => {

  const isNative = Capacitor.isNativePlatform();
  const [ devices, setDevices ] = useState({});
  const [ services, setServices ] = useState({});
  const [ selectedDevice, setSelectedDevice ] = useState<any>({});
  const [ selectedService, setSelectedService ] = useState({});
  const [ message, setMessage ] = useState("idle");
  const [ isBtEnabled, setIsBtEnabled ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ isConnected, setIsConnected ] = useState(false);
  const [ showTerminal, setShowTerminal ] = useState(false);
  const [ data, setData ] = useState<DataType[]>([]); //{type: read/write/notify/error, bin: 8 int binary, ascii: ASCII Value}
  //const [ connectBt, setConnectBt] = useState({});
  const [ doReset, setDoReset] = useState(false); //simple flag to rerender getBtStatus
    
  const [ optionalService, setOptionalService ] = useState<any>({});
  const [ prefixFilter ] = useState("IBA");


  const createOptionalService = () => {
    const SERV_GENERIC_ACCESS_PROFILE = 0x1800;
    const CHAR_DEVICE_NAME = 0x2a00;
    const CHAR_APPEARANCE = 0x2a01;

    const SERV_DEVICE_INFORMATION = 0x180A;
    const CHAR_MODEL_NUMBER = 0x2a24;
    const CHAR_SERIAL_NUMBER = 0x2a25;
    const CHAR_FIRMWARE_REVISION = 0x2a26;
    const CHAR_MANUFACTURER_NAME = 0x2a29;
    
    const SERV_BATTERY = 0x180F;
    const CHAR_BATTERY_LEVEL = 0x2a19;

    const SERV_ENVIRONMENT = "3964f2f1-6fe0-476b-ba24-7dd39fdc2b01";
    const CHAR_BATTERY_TEMPERATURE = "f685c0fe-6ae8-4461-a8ef-2ec64853c5f7";
    
    const SERV_SYSTEM_SETTINGS = "d8c3c059-e82d-43dd-ad15-4080c689910a";
    const CHAR_AUTO_SHUTDOWN = "f685c0fe-6ae8-4461-a8ef-2ec64853c5f7";
    const CHAR_RTC = "16b5b322-022e-11eb-adc1-0242ac120002";

    const SERV_STATE_ERROR_FLAGS = "cb1c60f0-735c-44f5-a923-648c836d9451";
    const CHAR_STATE_FLAGS = "3c789ded-b60c-4585-8512-787940437feb";
    const CHAR_ERROR_FLAGS = "ced22e3f-6c48-489d-8a7d-9677c9de392a";

    const SERV_DOSE_DLP_DAP = "f0738d7d-91bb-4e72-a08e-862e3205b9fb";
    const CHAR_DOSE_DLP_DAP = "819193cd-7a14-4a08-8dee-8b6f14c78277";
    const CHAR_DOSERATE_DLP_DAP = "9fd808b4-8286-4229-afdf-3995f274df83";
    const CHAR_DOSE_UNIT = "5fd50c60-3916-11ea-a137-2e728ce88125";
    const CHAR_EXPOSURE_TIME = "feba75b0-36d4-4512-bcd3-98f071de83ed";

    const SERV_KV_MEASUREMENT = "eebde2f1-1953-4fa7-abbc-47e6afba218c";
    const CHAR_AVERAGE_KV = "2870518e-e35a-4731-b388-c5b3669081e9";
    const CHAR_KVP = "2100314b-3bc2-4937-8952-10c03ddbfaf6";
    const CHAR_PPV = "faae2cb6-1f78-47d6-bc3c-ca7a48cbfb7d";
    const CHAR_HVL = "73181530-d1ab-4dae-9079-f808bca9ff5b";
    const CHAR_TOTAL_FILTRATION = "ba4583db-fca2-409b-ba25-66822a6189d9";

    const SERV_PULSE_ANALYSIS = "2e1ed982-bfec-4b6d-b658-e23d69110224";
    const CHAR_PULSE_DOSE = "3873729e-1c68-437b-a572-6dfa3b368d74";
    const CHAR_PULSE_FREQUENCY = "ccb6fd01-b098-43da-a715-88beff693b65";
    const CHAR_PULSE_LENGTH = "ab789173-3e28-4756-b6a6-b26d14276b5e";

    const SERV_SYSTEM_CONTROL = "b172ef6c-8261-46c5-8d77-25fb7b14cced";
    const CHAR_OPERATIONAL_MODE = "00f74b00-31dc-449e-a5a9-9ff973e21d41";

    const SERV_BEAM_QUALITY_SETTINGS = "d78d97f9-f463-4598-912d-2593a1958c8f";
    const CHAR_BEAM_QUALITY_INDEX = "af94831c-288f-4b59-a801-3dea922fdfcd";
    const CHAR_BEAM_QUALITY_NAME = "33faaa4f-82e0-4107-bc3c-3ad721967e30";
    const CHAR_QUALITY_PROFILE = "d7844a71-ba3c-44bf-9964-1d6141cf6a1c";
    const CHAR_BEAM_QUALITY_DEFAULT = "4d0fb35e-ba2e-4b01-b860-4aed44c0d0f9";

    const SERV_COEFFICIENT_RECORD_SETTINGS = "27d2a31a-4b44-4446-9ae2-3ee65e5fe76a";
    const CHAR_COEFFICIENT_RECORD_INDEX = "e2a8b91b-b684-4f43-8919-91cab77afc09";
    const CHAR_COEFFICIENT_RECORD_NAME = "cc18e3da-ec0d-4187-ad58-9afa56e7e484";
    const CHAR_COEFFICIENT_RECORD_PROFILE = "9be0071e-7108-4038-b328-0679b2f80d7e";
    const CHAR_COEFFICIENT_RECORD_DEFAULT = "ba29d84d-16ab-4b5c-a388-5bdbe406fde2";

    const SERV_SENSOR_SETTINGS = "8ec55562-22b7-4f2a-9e95-e8e05f0ceb04";
    const CHAR_SENSOR_INDEX = "b5e54ca9-449e-4ae3-9c7d-c438959acf76";
    const CHAR_SENSOR_NAME = "cc18e3da-ec0d-4187-ad58-9afa56e7e484";
    const CHAR_SENSOR_CAPABILITY = "0fea7240-6662-461a-b18c-36df6fc9669a";
    const CHAR_SENSOR_IDENTIFICATION = "35df3b2e-0247-11eb-adc1-0242ac120002";
    const CHAR_SENSOR_PROFILE = "9fa1db20-56f9-4b30-b384-283f2f762cba";
    const CHAR_SENSOR_DEFAULT = "60671b01-db72-4c0d-916c-2c2ae2b646bb";

    const SERV_SYNCHRONIZATION = "1350179c-c3ce-4116-a16e-190caa40d6b2";
    const CHAR_SYNCHRONIZATION_MSG = "93845949-1782-423b-997d-a3113d7ce02f";


    setOptionalService([SERV_GENERIC_ACCESS_PROFILE, CHAR_DEVICE_NAME, CHAR_APPEARANCE, SERV_DEVICE_INFORMATION, CHAR_MODEL_NUMBER, CHAR_SERIAL_NUMBER, 
      CHAR_FIRMWARE_REVISION, CHAR_MANUFACTURER_NAME, SERV_BATTERY, CHAR_BATTERY_LEVEL, SERV_ENVIRONMENT, CHAR_BATTERY_TEMPERATURE, SERV_SYSTEM_SETTINGS, 
      CHAR_AUTO_SHUTDOWN, CHAR_RTC, SERV_STATE_ERROR_FLAGS, CHAR_STATE_FLAGS, CHAR_ERROR_FLAGS, SERV_DOSE_DLP_DAP, CHAR_DOSE_DLP_DAP, CHAR_DOSERATE_DLP_DAP, 
      CHAR_DOSE_UNIT, CHAR_EXPOSURE_TIME, SERV_KV_MEASUREMENT, CHAR_AVERAGE_KV, CHAR_KVP, CHAR_PPV, CHAR_HVL, CHAR_TOTAL_FILTRATION, SERV_PULSE_ANALYSIS, 
      CHAR_PULSE_DOSE, CHAR_PULSE_FREQUENCY, CHAR_PULSE_LENGTH, SERV_SYSTEM_CONTROL, CHAR_OPERATIONAL_MODE, SERV_BEAM_QUALITY_SETTINGS, CHAR_BEAM_QUALITY_INDEX, 
      CHAR_TOTAL_FILTRATION, CHAR_BEAM_QUALITY_NAME, CHAR_QUALITY_PROFILE, CHAR_BEAM_QUALITY_DEFAULT, SERV_COEFFICIENT_RECORD_SETTINGS, 
      CHAR_COEFFICIENT_RECORD_INDEX, CHAR_COEFFICIENT_RECORD_NAME, CHAR_COEFFICIENT_RECORD_PROFILE,CHAR_COEFFICIENT_RECORD_DEFAULT, SERV_SENSOR_SETTINGS, 
      CHAR_SENSOR_INDEX, CHAR_SENSOR_NAME, CHAR_SENSOR_CAPABILITY, CHAR_SENSOR_IDENTIFICATION, CHAR_SENSOR_PROFILE, CHAR_SENSOR_DEFAULT, SERV_SYNCHRONIZATION, 
      CHAR_SYNCHRONIZATION_MSG])
  }

  useEffect(() => {
    preventSleep();
    createOptionalService();
    // code to run on component mount
    /*
    if (prefixFilter) {
      setPrefixFilter(prefixFilter);
    }
    if (optionalService) {
      setOptionalService(optionalService);
    }
    */
  }, [])


  const getBtStatus = useCallback(async () => {
    try {
      await BleClient.initialize();
      let isBtEnabled = await BleClient.isEnabled();
      setIsBtEnabled(isBtEnabled);
      if (!isBtEnabled) {
          setMessage("BT not enabled, or not supported!");
      }
    } catch (e) {
      catchError(e, "Bluetooth Unavailable");
    }
    setDoReset(false);
  }, [doReset]);


  useEffect(() => {
    getBtStatus();
  }, [getBtStatus])

  const scanBt = async () => {
    try {

      setDevices([]);
      setSelectedDevice({});
      setData([]);
      setServices([]);
      setMessage("Scanning...");

      await BleClient.initialize();
      const device = await BleClient.requestDevice({
        //services: [TEST_SERVICE],
        optionalServices: optionalService ? optionalService : [],
        namePrefix: prefixFilter ? prefixFilter : '',
      });

      setDevices([device]);
      connectBt(device);

    } catch (e) {
      catchError(e, "Scan Error");
    }
  };

  const connectBt = async (device:any) => {
    try {
      
      setLoading(true);
      setSelectedDevice(device);
      setServices([]);
      setData([]);
      setMessage("Connecting...");

      await BleClient.initialize().then(
        async() => await BleClient.disconnect(device.deviceId).then(
          async() => await BleClient.connect(device.deviceId, (id) =>
            console.log(`Device ${id} disconnected!`)
          ).then(
            async() => await BleClient.getServices(device.deviceId).then(
              (services) => {
                if (services[0]) {
                  setMessage("Connected");
                  setServices(services);
                  setLoading(false);
                  setIsConnected(true);
                } else {
                  setMessage("No Services Found");
                  setLoading(false);
                  setIsConnected(false);
                }
              }
            )
          ) //selectedDevice.deviceId
        )
      );
    } catch (e) {
      catchError(e, "Connection Failed.");
    }
  };

  const selectService = async (service:string) => {
    try {
      setData([]);
      setSelectedService(service);
      setShowTerminal(true);
    } catch (e) {
      catchError(e, "Select Service Error");
    }
  };

  const closeTerminal = async () => {
    try {
      setLoading(false);
      setShowTerminal(false);
    } catch (e) {
      catchError(e, "Error Closing Terminal");
    }
  };

  const reset = async (device:any) => {
    try {
      await BleClient.initialize();
      if(selectedDevice.deviceId){
        await BleClient.disconnect(selectedDevice.deviceId)
      }
      setMessage("Disconnected");
      setLoading(false);
      setIsConnected(false);
      setData([]);
      setDevices([]);
      setSelectedDevice({});
      setServices([]);
      setDoReset(true);
      
      //const prefixFilter = localStorage.getItem("prefix")
      //const optionalService = localStorage.getItem("optionalService")
      /*
      if (prefixFilter) {
        setPrefixFilter(prefixFilter);
      }
      if (optionalService) {
        setOptionalService(optionalService);
      }
      */
      getBtStatus();
    } catch (e) {
      catchError(e, "Cannot Disconnect: Error");
      //catchError(e, ""+e);
    }
  };

  const parse = (chx:unknown, type:string, value:any) => {
    let ascii = '', bin = ''
    for (let i = 0; i < value.byteLength; i++) {
      bin += `${value.getUint8(i)} `;
      const asciiF = () => {
        let v;
        switch (value.getUint8(i)) {
          case 0xa0:
            v = "+ ";
            break;
          case 0x00:
            v = "<NUL> ";
            break;
          case 0x01:
            v = "<SOH> ";
            break;
          case 0x02:
            v = "<STX> ";
            break;
          case 0x03:
            v = "<ETX> ";
            break;
          case 0x04:
            v = "<EOT> ";
            break;
          case 0x05:
            v = "<ENQ> ";
            break;
          case 0x06:
            v = "<ACK> ";
            break;
          case 0x07:
            v = "<BEL> ";
            break;
          case 0x08:
            v = "<BS> ";
            break;
          case 0x09:
            v = "<HT> ";
            break;
          case 0x0a:
            v = "<LF/NL> ";
            break;
          case 0x0b:
            v = "<VT> ";
            break;
          case 0x0c:
            v = "<FF> ";
            break;
          case 0x0d:
            v = "<CR> ";
            break;
          case 0x0e:
            v = "<SO> ";
            break;
          case 0x0f:
            v = "<SI> ";
            break;
          case 0x10:
            v = "<DLE> ";
            break;
          case 0x11:
            v = "<DC1> ";
            break;
          case 0x12:
            v = "<DC2> ";
            break;
          case 0x13:
            v = "<DC3> ";
            break;
          case 0x14:
            v = "<DC4> ";
            break;
          case 0x15:
            v = "<NAK> ";
            break;
          case 0x16:
            v = "<SYN> ";
            break;
          case 0x17:
            v = "<ETB> ";
            break;
          case 0x18:
            v = "<CAN> ";
            break;
          case 0x19:
            v = "<EM> ";
            break;
          case 0x1a:
            v = "<SUB> ";
            break;
          case 0x1b:
            v = "<ESC> ";
            break;
          case 0x1c:
            v = "<FS> ";
            break;
          case 0x1d:
            v = "<GS> ";
            break;
          case 0x1e:
            v = "<RS> ";
            break;
          case 0x1f:
            v = "<US> ";
            break;
          default:
            v = `${String.fromCharCode(value.getUint8(i))} `;
            break;
        }
        return v;
      };
      ascii += asciiF();
    }
    setData([
      ...data,
      {
        chx: chx,
        type: type,
        bin: bin,
        ascii: ascii,
      }
    ]);
  };

  const read = async (deviceId:any, serviceUUID:any, chxUUID:any) => {
    try {
      await BleClient.initialize();
      await BleClient.disconnect(selectedDevice.deviceId);
      await BleClient.connect(selectedDevice.deviceId, (id) =>
        console.log(`Device ${id} disconnected!`)
      );
      let value = await BleClient.read(deviceId, serviceUUID, chxUUID);
      parse(chxUUID, "read", value);
    } catch (e) {
      setData([
        ...data,
        {
          chx: chxUUID,
          type: "error",
          bin: "0x0",
          ascii: "Error on Read from Device: " + e,
        }
      ]);
    }
  };

  const notify = async (deviceId:any, serviceUUID:any, chxUUID:any, stop = false) => {
    try {
      if (stop) {
        await BleClient.initialize();
        await BleClient.disconnect(selectedDevice.deviceId);
        await BleClient.connect(selectedDevice.deviceId, (id) =>
          console.log(`Device ${id} disconnected!`)
        );
        await BleClient.stopNotifications(deviceId, serviceUUID, chxUUID);
        setData([
          ...data,
          {
            chx: chxUUID,
            type: "notify",
            bin: "0x0",
            ascii: "Stopped Notifications",
          }
        ]);
        return null;
      }
      await BleClient.initialize();
      await BleClient.disconnect(selectedDevice.deviceId);
      await BleClient.connect(selectedDevice.deviceId, (id) =>
        console.log(`Device ${id} disconnected!`)
      );
      await BleClient.stopNotifications(deviceId, serviceUUID, chxUUID);
      setData([
        ...data,
        {
          chx: chxUUID,
          type: "notify",
          bin: "0x0",
          ascii: "Started Notifications",
        }
      ]);
      await BleClient.startNotifications(
        deviceId,
        serviceUUID,
        chxUUID,
        (value) => {
          parse(chxUUID, "notify", value);
        }
      );
    } catch (e) {
      setData([
        ...data,
        {
          chx: chxUUID,
          type: "error",
          bin: "0x0",
          ascii: "Notify Error",
        }
      ]);
    }
  };

  const write = async (toWrtieArray = [], deviceId:any, serviceUUID:any, chxUUID:any) => {
    try {
      let buffer = new ArrayBuffer(toWrtieArray.length);
      let view = new DataView(buffer, 0);
      for (let i = 0; i < toWrtieArray.length; i++) {
        let v
        if ( typeof toWrtieArray[i] === 'string' && (toWrtieArray[i] as string).charAt(1) === 'x' ) {
          let hexString = toWrtieArray[i]
          let hex = (hexString as string).replace(/^0x/, '');
          v = hex.match(/[\dA-F]{2}/gi);
        }
        else if ( typeof toWrtieArray[i] === 'number' ) {
          v = toWrtieArray[i]
        }
        else {
          v = new TextEncoder().encode(toWrtieArray[i])
        }

        view.setUint8(i,(v as any))
      }
      parse(chxUUID, "write", view);
      await BleClient.initialize();
      await BleClient.disconnect(selectedDevice.deviceId);
      await BleClient.connect(selectedDevice.deviceId, (id) =>
        console.log(`Device ${id} disconnected!`)
      );
      await BleClient.write(deviceId, serviceUUID, chxUUID, view);
    } catch (e) {
      setData([
        ...data,
        {
          chx: chxUUID,
          type: "error",
          bin: "0x0",
          ascii: "Cannot Write to Device: " + e,
        }
      ]);
    }
  };

  const catchError = (e:any, message:string) => {
    //throw new Error(e)
    setMessage(message);
    setLoading(false);
    console.error(e);
  };

  return(
    //this is some placeholder content
    <IonPage>
        <IonContent fullscreen>
          <TopBar
            isBtEnabled={isBtEnabled}
            scanBt={() => scanBt()}
            preset={() => reset(selectedDevice)}
          />
          <Devices
            isNative={isNative}
            message={message}
            isBtEnabled={isBtEnabled}
            devices={devices}
            connectBt={(device:any) => connectBt(device)}
          />
          <Services
            services={services}
            handleServiceSelect={(service:string) => selectService(service)}
          />
        <Loading loading={loading} />
        <Terminal
          device={selectedDevice}
          service={selectedService}
          show={showTerminal}
          data={data}
          handleCloseTerminal={() => closeTerminal()}
          handleWrite={(ascii:any, deviceId:any, serviceUUID:any, chxUUID:any) =>
            write(ascii, deviceId, serviceUUID, chxUUID)
          }
          handleRead={(deviceId:any, serviceUUID:any, chxUUID:any) =>
            read(deviceId, serviceUUID, chxUUID)
          }
          handleStartNotify={(deviceId:any, serviceUUID:any, chxUUID:any) =>
            notify(deviceId, serviceUUID, chxUUID)
          }
          handleStopNotify={(deviceId:any, serviceUUID:any, chxUUID:any) =>
            notify(deviceId, serviceUUID, chxUUID, true)
          }
        />
        </IonContent>
      </IonPage>
  );
}

export default BleTest;

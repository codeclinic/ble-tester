import React from "react";
import {
    IonIcon,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonList,
    IonCardHeader,
    IonToolbar,
    IonTitle,
} from "@ionic/react";
import { bluetoothSharp } from "ionicons/icons";

interface ContainerProps {
  isNative:boolean;
  message:string;
  isBtEnabled:boolean;
  devices:any;
  connectBt:any;
}

const DevicesList: React.FC<ContainerProps> = ({isNative, message, isBtEnabled, devices, connectBt}) => {

  return (
      <IonCard>
        <IonCardHeader>
          <IonToolbar>
            <IonTitle slot="end">{message}</IonTitle>
            {isBtEnabled || message === "Error" ? (
              <IonIcon slot="end" color="warning" icon={bluetoothSharp} />
            ) : (
              <IonIcon slot="end" color="danger" icon={bluetoothSharp} />
            )}
          </IonToolbar>
          {
            !isNative && (
            <IonLabel color="danger">
              Web Bluetooth is experimental on this platform.
              <a
                rel="noreferrer"
                target="_blank"
                href="https://github.com/WebBluetoothCG/web-bluetooth/blob/main/implementation-status.md"
              >
                See here
              </a>
            </IonLabel>
            )
          }
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            {devices.map && devices.map((device:any) => {
              return (
                <IonItem
                  button
                  key={device.deviceId}
                  onClick={() => connectBt(device)}
                >
                  {device.name ? (
                    <IonLabel>{device.name}</IonLabel>
                  ) : (
                    <IonLabel>{device.deviceId}</IonLabel>
                  )}
                </IonItem>
              );
            })}
          </IonList>
        </IonCardContent>
      </IonCard>
)};

export default DevicesList;

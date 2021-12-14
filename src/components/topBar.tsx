import React from "react";
import { IonCardContent, IonButton, IonIcon } from "@ionic/react";
import { refreshOutline } from "ionicons/icons";


interface ContainerProps {
    isBtEnabled: boolean, 
    scanBt: any, 
    preset: any
  }
  
const TopBarC: React.FC<ContainerProps> = ({ isBtEnabled, scanBt, preset }) => {

    return (
      <IonCardContent>
        <IonButton
          disabled={!isBtEnabled}
          fill="outline"
          onClick={scanBt}
        >
          Scan
        </IonButton>
        <IonButton onClick={preset}>
          <IonIcon icon={refreshOutline} />
        </IonButton>
      </IonCardContent>
    );

}
export default TopBarC;

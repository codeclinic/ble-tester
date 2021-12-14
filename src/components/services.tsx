import React from "react";
import {
  IonCard,
  IonCardContent,
  IonLabel,
  IonCardHeader,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonList
} from "@ionic/react";

interface ContainerProps {
  services: any, 
  handleServiceSelect: any
}

const ServicesC: React.FC<ContainerProps> = ({ services, handleServiceSelect }) => {
  return (
    <IonList>
      {services.map &&
        services.map((service: any) => {
          return (
            <IonCard
              button
              onClick={() => handleServiceSelect(service)}
              key={service.uuid}
            >
              <IonCardHeader>
                <IonLabel color="success" text-wrap>
                  {service.uuid}
                </IonLabel>
              </IonCardHeader>
              <IonCardContent>
                {service.characteristics.map((chx: any) => {
                  return (
                    <IonGrid key={chx.uuid}>
                      <IonRow class="ion-justify-content-center">
                        <IonCol size="12" size-xs>
                          <IonTitle color="primary" size="small" text-wrap>
                            {chx.uuid}
                          </IonTitle>
                        </IonCol>
                      </IonRow>
                      <IonRow class="ion-justify-content-center">
                        <IonCol size="12" size-xs>
                          <IonLabel
                            color={chx.properties.read ? "primary" : "medium"}
                          >
                            | read |
                          </IonLabel>
                          <IonLabel
                            color={chx.properties.notify ? "primary" : "medium"}
                          >
                            | notify |
                          </IonLabel>
                          <IonLabel
                            color={chx.properties.write ? "primary" : "medium"}
                          >
                            | write |
                          </IonLabel>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  );
                })}
              </IonCardContent>
            </IonCard>
          )
        })
      }
    </IonList>
  )

}
export default ServicesC;

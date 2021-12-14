import React, { useState } from "react";
import {
  IonLoading
} from "@ionic/react";

interface ContainerProps{
    loading:boolean
}

const LoadingWrapper: React.FC<ContainerProps> = ({loading}) => {

    return (
        <IonLoading
        isOpen={loading}
        message={"Finding Services...<br/>(Takes up to 30 sconds.)"}
        duration={50000}
      />
    )
}

export default LoadingWrapper;
import { useState } from 'react';

export const useCatchError = (e:any, newMessage:string) => {
    const [ message, setMessage ] = useState("idle");
    const [ loading, setLoading ] = useState(false);
    //throw new Error(e)
    setMessage(newMessage);
    setLoading(false);
    console.error(e);
}
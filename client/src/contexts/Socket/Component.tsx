import React, { PropsWithChildren, useEffect, useReducer, useState } from 'react'
import { useSocket } from '../../hooks/useSocket';
import { defaultContextState, SocketContextProvider, SocketReducer } from './Context';

export interface ISocketContextComponentProps extends PropsWithChildren {}

const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = (props) => {
    const { children } = props;
    const [ SocketState, SocketDispatch ] = useReducer(SocketReducer, defaultContextState);
    const [ loading, setLoading ] = useState<boolean>(true);

    const socket = useSocket('ws://localhost:1337', {
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
        autoConnect: false
    });

    useEffect(() => {
        // Connect to web socket
        socket.connect();

        // savve socket in context
        SocketDispatch({ type: 'update_socket', payload: socket });

        // start event listeners;
        StartListeners();

        // send handshake;
        SendHandshake();
    }, []);

    const StartListeners = () => {
        // user connected event
        socket.on('user_connected', (users: string[]) => {
            console.info('User connected, new user list received');
            SocketDispatch({ type: 'update_users', payload: users })
        });

        //user disconnected event
        socket.on('user_disconnected', (uid: string) => {
            console.info('User connected, new user list received');
            SocketDispatch({ type: 'remove_user', payload: uid })
        });

        // reconnect
        socket.io.on('reconnect', (attempt) => {
            console.info('Reconnected on attempt: ' + attempt)
        })

        // reconnect attempt event 
        socket.io.on('reconnect_attempt', (attempt) => {
            console.info('Reconnection attempt: ' + attempt)
        })

        // reconnection error
        socket.io.on('reconnect_error', (error) => {
            console.info('Reconnection error: ', error)
        })

        // reconnection failed
        socket.io.on('reconnect_failed', () => {
            console.info('Reconnection failure');
            alert('We are unable to connect you to the web socket')
        })
    };

    const SendHandshake = () => {
        console.info('Sending handshake to server ...');

        socket.emit('handshake', (uid: string, users: string[]) => {
            console.log('User handshake callback message received');
            SocketDispatch({ type: 'update_uid', payload: uid });
            SocketDispatch({ type: 'update_users', payload: users });

            setLoading(false);
        });
    };

    if (loading) return <p>Loading socket IO ...</p>

  return <SocketContextProvider value={{ SocketState, SocketDispatch }}>{children}</SocketContextProvider>
}

export default SocketContextComponent

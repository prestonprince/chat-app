import React from 'react';
import SocketContext from './contexts/Socket/Context';
import { useContext } from 'react';

export interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = (props) => {
  const { socket, uid, users } = useContext(SocketContext).SocketState;


  return (
    <div>
      <h2>Socket IO Information</h2>
      <p>
        Your user ID: <strong>{uid}</strong><br />
        Users online: <strong>{users.length}</strong><br />
        Socket ID: <strong>{socket?.id}</strong><br />
      </p>
    </div>
  )
}

export default App;

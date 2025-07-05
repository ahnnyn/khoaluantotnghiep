import List from "../components/list/List";
import Chat from "../components/chat/Chat";

import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

const ChatPage = () => {


  return (
    <div className="container">
        <>
            <List />
            <Chat />  
        </>

    </div>
  );
};

export default ChatPage;
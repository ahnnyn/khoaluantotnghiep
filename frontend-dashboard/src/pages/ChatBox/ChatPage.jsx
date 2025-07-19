import List from "components/ChatBox/list/List";
import Chat from "components/ChatBox/chat/Chat";
import "./ChatPage.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

const ChatPage = () => {


  return (
    <div className="container-chat">
        <>
            <List />
            <Chat />  
        </>

    </div>
  );
};

export default ChatPage;
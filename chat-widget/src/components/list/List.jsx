import ChatList from "./chatList/ChatList"
import "./List.css"
import Userinfor from "./userInfor/UserInfor"

const List = () => {
  return (
    <div className='list'>
      <Userinfor/>
      <ChatList/>
    </div>
  )
}

export default List
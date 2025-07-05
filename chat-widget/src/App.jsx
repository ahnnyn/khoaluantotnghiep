import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import VideoCallPage from "./pages/VideoCallPage";

const App = () => {
  return (
      <Routes>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/video-call" element={<VideoCallPage />} />
      </Routes>
  );
};

export default App;

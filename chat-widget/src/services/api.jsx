import axios from "../utils/axios-customize";


// lấy bác sĩ thông qua id
export const fetchBacSiByMaBS = (maBacSi) => {
    console.log("Đang gọi API với maBacSi: ", maBacSi); // 👈 debug ở đây
    const URL_BACKEND = `/api/bacsi.php?action=getBacSiByID&maBacSi=${maBacSi}`;
    return axios.get(URL_BACKEND);
};

//Lưu tin nhắn vào database
export const saveMessage = (message) => {
    const URL_BACKEND = `/api/message.php?action=luu-tin-nhan`;
    return axios.post(URL_BACKEND, message);
};

//Lấy tin nhắn từ database
export const fetchMessages = (appointmentId) => {
    const URL_BACKEND = `/api/message.php?action=lay-tin-nhan&appointmentId=${appointmentId}`;
    return axios.get(URL_BACKEND);
};

export const callUploadChatFile = async (file) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);

    return axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/uploadChat.php`, bodyFormData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};


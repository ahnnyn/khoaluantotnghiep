// import '../../../pages/TrangChu/BodyHomePage/bodyHomePage.scss'

import { useNavigate } from "react-router-dom"

const HinhTron = (props) => {

    const {src, txtP, redirectChuyenKhoa} = props
    const navigate = useNavigate()

    return (
        <>
            <div className="htron" onClick={() => navigate(redirectChuyenKhoa)}>
                <img className="htron" src={src} alt="" />
            </div>
            <p style={{fontSize: "3vh", fontWeight: "500"}}>{txtP}</p>
        </>
    )
}
export default HinhTron
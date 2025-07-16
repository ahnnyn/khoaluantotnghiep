// import { IoHomeSharp } from "react-icons/io5";
// import Footer from "components/Footer/Footer";
// import Header from "components/Header/Header";
// import { useState } from "react";
// import HoSoBenhNhan from "components/HoSoBenhNhan/HoSoBenhNhan";
// import PhieuKhamBenh from "components/PhieuKhamBenh/PhieuKhamBenh";
// import "./hoSoCuaToi.css";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// const HoSoCuaToi = () => {
//   const acc = useSelector((state) => state.account.user);
//   console.log("acc:", acc); // kiểm tra xem acc có tồn tại không

//   const [activeTab, setActiveTab] = useState("hoSoCuaToi");
//   const navigate = useNavigate();
//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//   };

//   return (
//     <>
//       <Header />
//       <div style={{ marginBottom: "150px" }}></div>

//       <div className="container-2">
//         <p className="txt-title">
//           <IoHomeSharp /> / Hồ sơ của tôi
//         </p>

//         <div className="tab-wrapper">
//           {/* Sidebar */}
//           <div className="sidebar-left">
//             <div className="sidebar-menu">
//               <button
//                 className={`sidebar-item ${
//                   activeTab === "hoSoCuaToi" ? "active" : ""
//                 }`}
//                 onClick={() => setActiveTab("hoSoCuaToi")}
//               >
//                 <i className="fa-solid fa-file-medical"></i> Hồ sơ bệnh nhân
//               </button>
//               <button
//                 className={`sidebar-item ${
//                   activeTab === "phieuKham" ? "active" : ""
//                 }`}
//                 onClick={() => setActiveTab("phieuKham")}
//               >
//                 <i className="fa-solid fa-file-medical-alt"></i> Phiếu khám bệnh
//               </button>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="content-area">
//             {activeTab === "hoSoCuaToi" && (
//               <div>
//                 {/* Component hiển thị hồ sơ cá nhân */}
//                 <HoSoBenhNhan />
//               </div>
//             )}
//             {activeTab === "phieuKham" && (
//               <div>
//                 {/* Component phiếu khám */}
//                 <PhieuKhamBenh />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <div style={{ marginBottom: "150px" }}></div>

//       <Footer />
//     </>
//   );
// };

// export default HoSoCuaToi;

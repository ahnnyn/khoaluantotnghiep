import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTop = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            onClick={scrollToTop}
            style={{
                position: "fixed",
                bottom: "100px",
                right: "35px",
                backgroundColor: "#278DCA",
                color: "white",
                border: "none",
                borderRadius: "50%",
                padding: "15px",
                display: showButton ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease-in-out",
                transform: showButton ? "scale(1)" : "scale(0.8)",
                opacity: showButton ? "1" : "0",
                zIndex: "999999",
                width: "50px",
                height: "50px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1b6a94")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#278DCA")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            <FaArrowUp size={22} />
        </button>
    );
};

export default ScrollToTop;

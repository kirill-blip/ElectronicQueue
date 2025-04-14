import "../styles/Registration.css";
import { useNavigate } from "react-router-dom";

function Main() {
    const navigate = useNavigate();
    
    const handleTicketIssue = () => {
        navigate("/ticket-issue");
    };

    return (
        <div className="registration-container">
            <p>Добро пожаловать!</p>
            
            <button className="issue-ticket-button" onClick={handleTicketIssue}>
                Выдать талон
            </button>
        </div>
    );
}

export default Main;
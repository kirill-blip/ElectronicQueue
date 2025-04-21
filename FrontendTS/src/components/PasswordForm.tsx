import { Form } from "react-bootstrap";
import "../styles/LoginForm.css";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useState } from "react";

interface PasswordFormProps {
  password: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PasswordForm({ password, handleInputChange }: PasswordFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="password-container">
      <Form.Control
        type={isPasswordVisible ? "text" : "password"}
        id="password-input"
        name="Password"
        value={password}
        onChange={handleInputChange}
      />
      <span className="visibility-icon" onClick={togglePasswordVisibility}>
        {isPasswordVisible ? <MdVisibilityOff /> : <MdVisibility />}
      </span>
    </div>
  );
}

export default PasswordForm;

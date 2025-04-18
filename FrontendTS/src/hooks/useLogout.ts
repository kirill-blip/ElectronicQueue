import { useNavigate } from "react-router-dom";

export const useLogout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/admin/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                navigate("/login");
            } else if (response.status === 401) {
                throw new Error("Unauthorized");
            }
        } catch (error) { }
    }

    return handleLogout;
};

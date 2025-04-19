import Entry from "../models/Entry";
import User from "../models/User";

const addUser = async (user: User) => {
    const response = await fetch("http://localhost:8080/api/user/add", {
        method: "POST",
        body: JSON.stringify({
            number_phone: user.PhoneNumber,
            first_name: user.FirstName,
            last_name: user.LastName,
        }),
        credentials: "include",
    });

    return response;
};

const generateTicket = async () => {
    const response = await fetch("http://localhost:8080/api/entry/generate", {
        method: "POST",
        credentials: "include",
    });

    return response;
};

const createTicket = async (user:User) => {
    const response = await fetch("http://localhost:8080/api/entry/create", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            number_phone: user.PhoneNumber,
            first_name: user.FirstName,
            last_name: user.LastName,
        }),
    });

    return response;
}

export const useTicketIssue = () => {
    return async (
        user: User,
        setErrorMessage: React.Dispatch<React.SetStateAction<string>>
    ) => {
        try {
            const response = await createTicket(user);

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Произошла ошибка при получении талона.");
                return;
            }            
        } catch (error) {
            console.error("Ошибка при выдаче талона:", error);
            setErrorMessage("Произошла ошибка при получении талона.");
        }
    };
};

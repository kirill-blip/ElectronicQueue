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

export const useTicketIssue = () => {
    return async (
        user: User,
        setTicketData: React.Dispatch<React.SetStateAction<Entry>>,
        setErrorMessage: React.Dispatch<React.SetStateAction<string>>
    ) => {
        try {
            const response = await addUser(user);

            if (response.ok) {
                const ticketResponse = await generateTicket();

                if (ticketResponse.ok) {
                    const entryData = await ticketResponse.json();
                    console.log(entryData);

                    setTicketData({
                        user_id: entryData.user_id,
                        admin_id: entryData.admin_id,
                        ticketNumber: entryData.ticket_number,
                    });
                }
            } else {
                const errorData = await response.json();

                if (errorData.error === "first name isn't valid") {
                    setErrorMessage("Имя должно содержать только буквы русского или казахского алфавитов.");
                }
                if (errorData.error === "last name isn't valid") {
                    setErrorMessage("Фамилия должна содержать только буквы русского или казахского алфавитов.");
                }

                if (errorData.error === "invalid phone") {
                    setErrorMessage("Некорректный номер телефона.");
                }
            }
        } catch (error) {
            console.error("Ошибка при выдаче талона:", error);
            setErrorMessage("Произошла ошибка при получении талона.");
        }
    };
};

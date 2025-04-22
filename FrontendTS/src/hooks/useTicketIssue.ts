import User from "../models/User";

const createTicket = async (user: User) => {
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

                if (errorData.error === "pq: duplicate key value violates unique constraint \"user_number_phone_key\"") {
                    setErrorMessage("Пользователь с таким номером телефона уже существует.");
                }
                else if (errorData.error === "invalid phone"){
                    setErrorMessage("Номер телефона должен быть только казахским.");
                }
                else if (errorData.error === "first name isn't valid") {
                    setErrorMessage("Имя должно быть из букв русского или казахского алфавитов.");
                } else if (errorData.error === "last name isn't valid") {
                    setErrorMessage("Фамилия должна быть из букв русского или казахского алфавитов.");
                } else {
                    setErrorMessage(errorData.message || "Произошла ошибка при получении талона.");
                }
            }
        } catch (error) {
            setErrorMessage("Произошла ошибка при получении талона.1");
        }
    };
};

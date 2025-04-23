import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation()

    return async (
        user: User,
        setErrorMessage: React.Dispatch<React.SetStateAction<string>>
    ) => {
        try {
            const response = await createTicket(user);

            if (!response.ok) {
                const errorData = await response.json();

                if (errorData.error === "pq: duplicate key value violates unique constraint \"user_number_phone_key\"") {
                    setErrorMessage(t('errors.phone-number-error'));
                }
                else if (errorData.error === "invalid phone"){
                    setErrorMessage(t('errors.invalid-phone-number-error'));
                }
                else if (errorData.error === "first name isn't valid") {
                    setErrorMessage(t("errors.first-name-error"));
                } else if (errorData.error === "last name isn't valid") {
                    setErrorMessage(t("errors.last-name-error"));
                } else {
                    setErrorMessage(errorData.message || t("errors.ticket-issue-error"));
                }
            }
        } catch (error) {
            setErrorMessage(t("errors.ticket-issue-error"));
        }
    };
};

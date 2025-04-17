import { useEffect, useState } from "react";
import Entry from "../models/Entry";
import User from "../models/User";
import { Admin } from "../models/Admin";

const fetchTicketData = async () => {
    const response = await fetch("http://localhost:8080/api/entry/get", {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch ticket info");
    }

    return response.json();
}

const fetchUserInfo = async () => {
    const response = await fetch("http://localhost:8080/api/user/get", {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user info");
    }

    return response.json();
}

const fetchAdminInfo = async () => {
    const response = await fetch("http://localhost:8080/api/entry/get-admin", {
        method: "POST",
        body: JSON.stringify(
            {
                id: 1
            }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch admin info");
    }

    return response.json();
}

export const useGetTicketInfo = () => {
    const [ticketData, setTicketData] = useState<Entry>({
        user_id: 0,
        admin_id: 0,
        ticketNumber: 0,
    })

    const [user, setUser] = useState<User>({
        FirstName: "",
        LastName: "",
        PhoneNumber: "",
    });

    const [admin, setAdmin] = useState<Admin>({
        FirstName: "",
        LastName: "",
        TableNumber: 0,
    })

    useEffect(() => {
        async function fetchTicketInfo() {
            try {
                const ticketResponse = await fetchTicketData();

                setTicketData({
                    user_id: ticketResponse.user_id,
                    admin_id: ticketResponse.admin_id,
                    ticketNumber: ticketResponse.ticket_number,
                });

                const userResponse = await fetchUserInfo();
                setUser({
                    FirstName: userResponse.first_name,
                    LastName: userResponse.last_name,
                    PhoneNumber: userResponse.number_phone,
                });

                const adminResponse = await fetchAdminInfo();
                setAdmin({
                    FirstName: adminResponse.first_name,
                    LastName: adminResponse.last_name,
                    TableNumber: adminResponse.table_number,
                });
            } catch (error) {
                console.log(error);
            } finally {
                console.log("Ticket info fetched successfully.");
            }
        }

        fetchTicketInfo();
    }, []);

    return { ticketData, user, admin };
}

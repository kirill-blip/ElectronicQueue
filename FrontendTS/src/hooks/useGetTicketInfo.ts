import { useEffect, useState } from "react";
import { Entry, EntryStatus } from "../models/Entry";
import User from "../models/User";
import { AdminInfo } from "../models/Admin";

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

const fetchAdminInfo = async (admin_id:number) => {
    const response = await fetch("http://localhost:8080/api/entry/get-admin", {
        method: "POST",
        body: JSON.stringify(
        {
            id: admin_id
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch admin info");
    }

    return response.json();
}

export const useGetTicketInfo = (refreshKey: number) => {
    const [ticketData, setTicketData] = useState<Entry>({
        UserId: 0,
        AdminId: 0,
        TicketNumber: 0,
        EntryStatus: EntryStatus.None,
    })

    const [user, setUser] = useState<User>({
        FirstName: "",
        LastName: "",
        PhoneNumber: "",
    });

    const [admin, setAdmin] = useState<AdminInfo>({
        FirstName: "",
        LastName: "",
        TableNumber: 0,
    })

    useEffect(() => {
        async function fetchTicketInfo() {
            try {
                const ticketResponse = await fetchTicketData();

                setTicketData({
                    UserId: ticketResponse.user_id,
                    AdminId: ticketResponse.admin_id,
                    TicketNumber: ticketResponse.ticket_number,
                    EntryStatus: EntryStatus[ticketResponse.status as keyof typeof EntryStatus],
                });

                
                const userResponse = await fetchUserInfo();
                setUser({
                    FirstName: userResponse.first_name,
                    LastName: userResponse.last_name,
                    PhoneNumber: userResponse.number_phone,
                });

                const adminResponse = await fetchAdminInfo(ticketResponse.admin_id);
                
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
    }, [refreshKey]);

    return { ticketData, user, admin };
}

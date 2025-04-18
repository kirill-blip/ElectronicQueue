import { useEffect, useState } from "react";

export const useGetTickets = () => {
    const tickets = [
        {
            "TicketNumber": 1,
            "TableNumber": 2,
        },
        {
            "TicketNumber": 2,
            "TableNumber": 1,
        },
        {
            "TicketNumber": 3,
            "TableNumber": 5,
        },
        {
            "TicketNumber": 2,
            "TableNumber": 2,
        },
    ]

    const [isRefresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {
        const delay = 10000
        const interval = setInterval(() => {
            setRefresh((refreshCount) => !refreshCount);
        }, delay);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // try {
        //     const fetchTickets = async () => {
        //         const response = await fetch("http://localhost:8080/api/tickets", {
        //             method: "GET",
        //             credentials: "include",
        //         });

        //         if (!response.ok) {
        //             throw new Error("Failed to fetch tickets");
        //         }

        //         return response.json();
        //     };

        //     fetchTickets().then((data) => {
        //         console.log(data);
        //     });
        // } catch (error) {
        //     console.error("Error fetching tickets:", error);
        // }
    }, [isRefresh]);

    return tickets;
}
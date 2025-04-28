import { useEffect, useState } from "react";

export const useGetTickets = () => {
    const [isRefresh, setRefresh] = useState<boolean>(false);
    const [tickets, setTickets] = useState<any[]>([]);

    useEffect(() => {
        const delay = 10000
        const interval = setInterval(() => {
            setRefresh((refreshCount) => !refreshCount);
        }, delay);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        try {
            const fetchTickets = async () => {
                const response = await fetch("http://localhost:8080/api/entry/dashboard", {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok" + response.statusText);
                }
                const data = await response.json();
                setTickets(data);
            };

            fetchTickets()
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    }, [isRefresh]);

    if (tickets === null) {
        return []
    }

    return tickets;
}
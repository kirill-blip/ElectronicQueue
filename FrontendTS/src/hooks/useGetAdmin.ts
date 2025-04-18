import { useEffect, useState } from "react";
import { AdminInfo } from "../models/Admin";

export const useAdmin = () => {
    const [admin, setAdmin] = useState<AdminInfo>({
        FirstName: "",
        LastName: "",
        TableNumber: 0,
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/admin/get", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (response.ok) {
                    const json = await response.json();
                    setAdmin({
                        FirstName: json.first_name,
                        LastName: json.last_name,
                        TableNumber: json.table_number,
                    });
                } else if (response.status === 401) {
                    throw new Error("Unauthorized");
                } else {
                    throw new Error("Failed to fetch admin data");
                }
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchAdmin();
    }, []);

    return { admin, error, loading };
};

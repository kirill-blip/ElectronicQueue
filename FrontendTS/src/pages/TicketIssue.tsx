import { useEffect, useState } from "react";
import User from "../models/User";
import "../models/Entry";
import "../styles/TicketIssue.css";
import "react-international-phone/style.css";
import { useGetTicketInfo } from "../hooks/useGetTicketInfo";
import { useTicketIssue } from "../hooks/useTicketIssue";
import Loading from "../components/Loading";
import TicketIssueForm from "../components/TicketIssueForm";
import TicketIssueInfo from "../components/TicketIssueInfo";
import { EntryStatus } from "../models/Entry";
import TicketIssueRecreate from "../components/TicketIssueRecreate";

function TicketIssue() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<User>({
    FirstName: "",
    LastName: "",
    PhoneNumber: "",
  });

  const {
    ticketData: fetchedTicketData,
    user: fetchedUser,
    admin: fetchedAdmin,
  } = useGetTicketInfo(refreshKey);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [refreshKey]);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const issueTicket = useTicketIssue();

  const handleSumbit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await issueTicket(user, setErrorMessage);
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error(error);
      setErrorMessage("Произошла ошибка при получении талона.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const handlePhoneChange = (value: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      PhoneNumber: value,
    }));
  };

  if (isLoading) {
    return <Loading />;
  }

  console.log(fetchedTicketData.EntryStatus);

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "calc(95vh - 56px - 56px)" }}
    >
      {fetchedTicketData.EntryStatus === EntryStatus.None && (
        <TicketIssueForm
          user={user}
          handleSumbit={handleSumbit}
          handleInputChange={handleInputChange}
          handlePhoneChange={handlePhoneChange}
          errorMessage={errorMessage}
        />
      )}
      {(fetchedTicketData.EntryStatus === EntryStatus.Waiting ||
        fetchedTicketData.EntryStatus === EntryStatus.Processing) && (
          <TicketIssueInfo
            fetchedTicketData={fetchedTicketData}
            fetchedAdmin={fetchedAdmin}
            fetchedUser={fetchedUser}
          />
        )}
      {fetchedTicketData.EntryStatus !== EntryStatus.None &&
      fetchedTicketData.EntryStatus !== EntryStatus.Waiting &&
      fetchedTicketData.EntryStatus !== EntryStatus.Processing && (
          <TicketIssueRecreate user={fetchedUser} />
        )}
    </div>
  );
}

export default TicketIssue;

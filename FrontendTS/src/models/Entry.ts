import Admin from "./Admin";
import User from "./User";

type Entry = {
    TicketNumber: number;
    User: User;
    Admin: Admin;
    Date: Date;
    Status: EntryStatus;
}

enum EntryStatus {
    Processing = "Processing",
    CanceledByUser =  "CanceledByUser", 
    Canceled = "Canceled",
    Accepted = "Accepted"
}

export default Entry;
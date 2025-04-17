interface Entry {
    TicketNumber: number;
    UserId: number;
    AdminId: number;
}

enum EntryStatus {
    Processing = "Processing",
    CanceledByUser = "CanceledByUser",
    Canceled = "Canceled",
    Accepted = "Accepted"
}

export default Entry;
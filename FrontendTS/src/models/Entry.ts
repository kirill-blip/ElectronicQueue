class Entry {
    ticketNumber: number;
    user_id: number;
    admin_id: number;

    constructor() {
        this.ticketNumber = 0;
        this.user_id = 0;
        this.admin_id = 0;
    }
}

enum EntryStatus {
    Processing = "Processing",
    CanceledByUser = "CanceledByUser",
    Canceled = "Canceled",
    Accepted = "Accepted"
}

export default Entry;
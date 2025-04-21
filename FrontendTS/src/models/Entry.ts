import User from "./User";

export interface Entry {
    TicketNumber: number;
    UserId: number;
    AdminId: number;
    EntryStatus: EntryStatus;
}

export interface EntryInfo {
    EntryId: number;
    UserId: number;
    User: User;
}

export enum EntryStatus {
    None = "None",
    Waiting = "Waiting",
    Processing = "Processing",
    CanceledByUser = "CanceledByUser",
    Canceled = "Canceled",
    Accepted = "Accepted"
}

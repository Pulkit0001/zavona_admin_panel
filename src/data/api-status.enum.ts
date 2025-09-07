export enum ApiStatus {
    SUCCESS = 200,
    NOT_AUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
    ERR_NETWORK = "ERR_NETWORK"
}

export enum TaskLogStatus {
    ASSIGNED = "Assigned",
    RESUMED = "Resumed",
    UNASSIGNED = "Unassigned",
    CLOSED = "Closed",
    ON_HOLD = "On Hold",
    IN_PROGRESS = "In Progress",
    DECLINED = "Declined",
    RE_ASSIGNED = "Reassigned",
    APPROVED = "Approved", //In case of release node, store the log for status = Approved
    REJECTED = "Rejected", //In case of release node, store the log for status = Rejected
    RELEASE = "Release", //In case of release node, if there is no approve or reject type then store release type
    MANUAL_ASSIGNMENT = "Manual Assignment"
}

export enum Reasons{
    PUT_ON_HOLD = "Put on hold",
    REASSIGN_TASK = "Re-assign task",
    DECLINE_TASK = "Decline task",
    RESUME_TASK = "Resume task"
}
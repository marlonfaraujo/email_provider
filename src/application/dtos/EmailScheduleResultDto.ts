export type EmailScheduleResultDto = {
    id: string,
    name: string,
    scheduledDate: Date,
    scheduleStatus: string,
    publishStatus: string,
    publishDate: Date | null,
    subject: string,
    from: string
    recipients: string[]
}
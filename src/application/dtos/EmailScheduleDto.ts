export type EmailScheduleDto = {
    name: string,
    body: string,
    subject: string,
    from: string
    to?: string[],
    cc?: string[],
    cco?: string[]
}
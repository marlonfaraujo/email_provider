export type SendEmailDto = {
    to?: string[],
    cc?: string[],
    bcc?: string[],
    from: string,
    subject: string,
    body: string
}
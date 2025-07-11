import { EmailProvider, EmailProviderLevel } from "../../../src/domain/entities/EmailProvider"

test("Must change the primary provider to secondary", () => {
    const provider = new EmailProvider("","","","", EmailProviderLevel.Primary);
    provider.setSecondary();
    expect(EmailProviderLevel.Secondary).toBe(provider.getLevel());
})
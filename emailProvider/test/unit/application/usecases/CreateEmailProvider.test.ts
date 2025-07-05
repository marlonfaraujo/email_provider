import CreateEmailProvider from "../../../../src/application/usecases/provider/CreateEmailProvider";
import ListEmailProvider from "../../../../src/application/usecases/provider/ListEmailProvider";
import EmailProviderMemoryRepository from "../../../../src/infra/repositories/EmailProviderMemoryRepository";
import { CryptoUuidGenerator } from "../../../../src/infra/uuid/CryptoUuidGenerator";

test("Must create the provider record and return the result by searching for by server field", async () => {
    const repository = new EmailProviderMemoryRepository();
    const crypto = new CryptoUuidGenerator();
    const createProvider = new CreateEmailProvider(repository, crypto);

    const dto : any = {
        server: "127.0.0.1",
        port: "12345",
        credentials: ""
    };
    await createProvider.execute(dto);

    const providers = await new ListEmailProvider(repository).execute();
    expect(providers).toBeDefined();
    expect(providers.find(x => x.server === dto.server)?.id).toBeDefined();
});
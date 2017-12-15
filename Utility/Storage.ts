const FileStorage = require("file-storage");

export default class Storage {
    private static storage;

    public static Initialize(path: string) {
        Storage.storage = new FileStorage(path);
    }

    public static async Save(data: Buffer | string, id?: string): Promise<string> {
        return (await Storage.storage.saveData(data, id)).id;
    }

    public static async Get(id: string): Promise<Buffer> {
        return await Storage.storage.getData(id);
    }

    public static async Remove(id: string) {
        await Storage.storage.remove(id);
    }
}
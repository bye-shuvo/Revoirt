//Helper function to promisify the session storage access requests
const promisifyRequest = async (request: string | null): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        (request === null) ? reject("Item not found") : resolve(JSON.parse(request));
    })
}

export class useSessionStorage {
    get = async (key: any): Promise<any> => {
        return await promisifyRequest(sessionStorage.getItem(String(key)));
    }

    put = async (key: any, value: any) => {
        sessionStorage.setItem(String(key), JSON.stringify(value))
    }
}

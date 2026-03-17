//Helper function to promisify the IDBRequest 
const promisifyRequest = (request: IDBRequest):Promise<[]> => {
    return new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    })
}

//Helper function for open / upgrade the DB
const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("RevoirtDB", 1);

        request.onerror = () => reject(request.error);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains("files")) {
                const store = db.createObjectStore("files", { keyPath: "path" });
                store.createIndex("files_type", ["extension"], { unique: false });
            }
        }

        request.onsuccess = () => resolve(request.result);
    })
}

export const putFile = async (file: object) => {
    const db = await openDB();

    const tx = db.transaction("files", "readwrite");
    const store = tx.objectStore("files");

    await promisifyRequest(store.put(file));

    await new Promise((resolve, reject) => {
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
        tx.oncomplete = () => resolve(tx);
    })
}

export const getAllFiles = async ():Promise<[]> => {
    const db = await openDB();

    const tx = db.transaction("files", "readwrite");
    const store = tx.objectStore("files");

    return await promisifyRequest(store.getAll());
}

export const executeIDB = async (file: any) : Promise<[]> => {
    try {
        const indexedDB = window.indexedDB;
        if (!indexedDB) {
            console.warn("Browser does not support indexedDB");
            return [];
        }

        if (file) {
            await putFile(file);
        }

        const files = await getAllFiles();
        console.log("Retrived Files", files);
        return files;

    } catch (error) {
        console.error("indexedDB Error : ", error);
        return [];
    }

}
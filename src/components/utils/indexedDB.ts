export default async function initIndexedDB() {
    const indexedDB = window.indexedDB;

    if (!indexedDB) return;

    const request = indexedDB.open("RevoirtDB", 1);

    request.onerror = (e) => {
        console.log("Error occured when opening connection to the database");
        console.error(e);
    }

    request.onupgradeneeded = (e) => {
        const db = request.result;
        const store = db.createObjectStore("files", { keyPath: "path" });
        store.createIndex("files_type", ["extension"], { unique: false });
    }

    request.onsuccess = (e) => {
        const db = request.result;
        const transaction = db.transaction("files", "readwrite");
        const store = transaction.objectStore("files");
        const files_type = store.index("files_type");

        store.put({
            path: "src/components/Button.jsx",  // primary key
            name: "Button.jsx",
            type: "file",
            extension : ".jsx" ,
            parentPath: "src/components",
            content: "export default ...",
            createdAt: 1710000000000,
            updatedAt: 1710000001234,
        })

        console.log(store.get("src/components/Button.jsx"));
    }

}
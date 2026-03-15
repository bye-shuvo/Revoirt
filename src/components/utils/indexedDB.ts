export default async function initIndexedDB(){
    const indexedDB = window.indexedDB ;

    if(!indexedDB) return ;

    const request = indexedDB.open("RevoirtDB" , 1);

    request.onerror = (e) => {
        console.log("Error occured when opening connection to the database");
        console.error(e);
    }

    request.onupgradeneeded = (e) => {
        const db = request.result ;
        const store = db.createObjectStore("files" , { keyPath : "path"});
        store.createIndex("files_type" , ["type"] , {unique : false});
    }

    request.onsuccess = (e) => {
        const db = request.result ;
    }

}
export function createNewUrl(count){
    window.history.pushState({ page: 1 }, "saveUrl", `?${count}`);
    return window.location.href
}

export function saveDataIndexedDB(globalCode, testCasesCode, count){
    const IDBrequest = window.indexedDB.open("PerfLink", count);

    IDBrequest.onsuccess = function (event) {
        const db = event.target.result;

        const IDBtransaction = db.transaction(`page-${count}`, "readwrite");
        const objectStore = IDBtransaction.objectStore(`page-${count}`);

        const testCasesCodeArray = Array.from(testCasesCode)
        const codeTestCase = testCasesCodeArray.map(code => { return code.textContent});

        objectStore.put({ globalCode, codeTestCase }, 0);
    }
}

export function getDataIndexedDB(count) {
    return new Promise((resolve, reject) => {
        const IDBrequest = window.indexedDB.open("PerfLink", count);

        IDBrequest.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(`page-${count}`)) {
                db.createObjectStore(`page-${count}`, { autoIncrement: true })
                resolve(null);
            }
        };

        IDBrequest.onsuccess = function (event) {
            const db = event.target.result;
            const IDBtransaction = db.transaction(`page-${count}`, "readonly");
            const objectStore = IDBtransaction.objectStore(`page-${count}`);

            objectStore.getAll().onsuccess = function (event) {
                const data = event.target.result;
                if (data.length > 0) {
                    const globalCodeStorage = data[0].globalCode;
                    const codeTestCaseStorage = data[0].codeTestCase;
                    resolve({ globalCodeStorage, codeTestCaseStorage }); 
                } else {
                    resolve(null);
                }
            };

            objectStore.getAll().onerror = function (event) {
                reject(event.target.error);
            };
        };

        IDBrequest.onerror = function (event) {
            reject(event.target.error);
        };
    });
}
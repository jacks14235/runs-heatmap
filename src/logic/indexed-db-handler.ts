export function addData(filename: string, data: Int32Array, db?: IDBDatabase) {
  return new Promise<string>(async (resolve, reject) => {
    if (!db) db = await initDB();

    // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
    const newItem = { filename, data };

    // open a read/write db transaction, ready for adding the data
    const transaction = db.transaction(["latlng_os"], "readwrite");

    // call an object store that's already been added to the database
    const objectStore = transaction.objectStore("latlng_os");

    // Make a request to add our newItem object to the object store
    const addRequest = objectStore.add(newItem);

    addRequest.addEventListener("success", () => {
    //   console.log("Done adding");
    });

    // Report on the success of the transaction completing, when everything is done
    transaction.addEventListener("complete", () => {
    //   console.log("Transaction completed: database modification finished.");
      resolve("Transaction completed: database modification finished.");
    });

    transaction.addEventListener("error", () =>
      reject("Transaction not opened due to error")
    );
  });
}

export function getData(db?: IDBDatabase) {
  return new Promise<{ name: string; data: Int32Array }[]>(
    async (resolve, reject) => {
      if (!db) db = await initDB();
      // Open our object store and then get a cursor - which iterates through all the
      // different data items in the store
      const objectStore = db.transaction("latlng_os").objectStore("latlng_os");
      //   objectStore.openCursor().addEventListener("success", (e: any) => {
      //     // Get a reference to the cursor
      //     const cursor = e.target.result;
      //     // If there is still another data item to iterate through, keep running this code
      //     while (true)
      //       if (cursor) {
      //         data.push({ name: cursor.value.filename, data: cursor.value.data });
      //         cursor.continue();
      //       } else {
      //         break;
      //       }
      //     resolve(data);
      //   });
      const getAll = objectStore.getAll();
      getAll.addEventListener("success", () => {
        const all = getAll.result;
        resolve(all);
      });
    }
  );
}

export function initDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    let db: IDBDatabase;

    // Open our database; it is created if it doesn't already exist
    // (see the upgradeneeded handler below)
    const openRequest = window.indexedDB.open("latlng_os", 1);

    // error handler signifies that the database didn't open successfully
    openRequest.addEventListener("error", () =>
      reject("Database failed to open")
    );

    // success handler signifies that the database opened successfully
    openRequest.addEventListener("success", () => {
      console.log("Database opened successfully");

      // Store the opened database object in the db variable. This is used a lot below
      db = openRequest.result;
      resolve(db);
    });

    // Set up the database tables if this has not already been done
    openRequest.addEventListener("upgradeneeded", (e) => {
      // Grab a reference to the opened database
      const event = e as unknown as Event & {
        target: { result: IDBDatabase };
      };
      db = event.target.result;

      // Create an objectStore to store our notes in (basically like a single table)
      // including a auto-incrementing key
      const objectStore = db.createObjectStore("latlng_os", {
        keyPath: "id",
        autoIncrement: true,
      });

      // Define what data items the objectStore will contain
      objectStore.createIndex("File Name", "filename", { unique: false });
      objectStore.createIndex("LatLng Data", "data", { unique: false });

      console.log("Database setup complete");
    });
  });
  // Create an instance of a db object for us to store the open database in
}

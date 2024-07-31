export class IndexedDBService {
  static dbName = 'excelComparisonDB';
  static storeName = 'excelDataStore';

  static openDB() {
      return new Promise((resolve, reject) => {
          const request = indexedDB.open(this.dbName, 1);

          request.onupgradeneeded = (event) => {
              const db = event.target.result;
              db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
          };

          request.onsuccess = (event) => {
              resolve(event.target.result);
          };

          request.onerror = (event) => {
              reject(event.target.error);
          };
      });
  }

  static async saveData(data) {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
          const transaction = db.transaction([this.storeName], 'readwrite');
          const store = transaction.objectStore(this.storeName);

          const request = store.put({ data });

          request.onsuccess = () => {
              resolve();
          };

          request.onerror = (event) => {
              reject(event.target.error);
          };
      });
  }

  static async getData() {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
          const transaction = db.transaction([this.storeName], 'readonly');
          const store = transaction.objectStore(this.storeName);
          const request = store.getAll();

          request.onsuccess = (event) => {
              resolve(event.target.result);
          };

          request.onerror = (event) => {
              reject(event.target.error);
          };
      });
  }

  static async clearData() {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
          const transaction = db.transaction([this.storeName], 'readwrite');
          const store = transaction.objectStore(this.storeName);
          const request = store.clear();

          request.onsuccess = () => {
              resolve();
          };

          request.onerror = (event) => {
              reject(event.target.error);
          };
      });
  }
}

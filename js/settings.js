class Settings {
    constructor(db) {
        this.db = db
        this.createTable();
    }

    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT,
          value TEXT`;
        return this.dao.run(sql);
    }

    create(key,value) {
        return this.dao.run(
          'INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)',
          [key,value])
      }
}

module.exports = Settings;
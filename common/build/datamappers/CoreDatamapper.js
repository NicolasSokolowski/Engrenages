"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreDatamapper = void 0;
class CoreDatamapper {
    constructor() {
        this.findByPk = async (id) => {
            const result = await this.pool.query(`SELECT * FROM "${this.tableName}" WHERE "id" = $1`, [id]);
            return result.rows[0];
        };
        this.findAll = async () => {
            const result = await this.pool.query(`SELECT * FROM "${this.tableName}";`);
            return result.rows;
        };
        this.findBySpecificField = async (field, value) => {
            const result = await this.pool.query(`SELECT * FROM "${this.tableName}" WHERE ${field} = $1`, [value]);
            return result.rows[0];
        };
        this.insert = async (entityObject) => {
            const result = await this.pool.query(`SELECT * FROM create_${this.tableName}($1)`, [entityObject]);
            return result.rows[0];
        };
        this.update = async (entityObject, currentVersion) => {
            const result = await this.pool.query(`SELECT * FROM update_${this.tableName}($1, $2)`, [entityObject, currentVersion]);
            return result.rows[0];
        };
        this.delete = async (id) => {
            const result = await this.pool.query(`SELECT * FROM delete_${this.tableName}($1)`, [id]);
            return result.rows[0];
        };
        this.checkIfUsed = async (fieldName, value) => {
            const result = await this.pool.query(`SELECT 1 FROM ${this.tableName} WHERE ${fieldName} = $1`, [value]);
            return result.rows;
        };
        this.checkIfNotNull = async (fieldName, id) => {
            const result = await this.pool.query(`SELECT 1 FROM ${this.tableName} WHERE ${fieldName} IS NOT NULL AND "id" = $1`, [id]);
            return result.rows;
        };
    }
}
exports.CoreDatamapper = CoreDatamapper;

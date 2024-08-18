"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreDatamapper = void 0;
class CoreDatamapper {
    constructor() {
        this.findByPk = (id) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query(`SELECT * FROM "${this.tableName}" WHERE "id" = $1`, [id]);
            return result.rows[0];
        });
        this.findAll = () => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query(`SELECT * FROM "${this.tableName}";`);
            return result.rows;
        });
        this.findBySpecificField = (field, value) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query(`SELECT * FROM "${this.tableName}" WHERE ${field} = $1`, [value]);
            return result.rows[0];
        });
        this.insert = (entityObject) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query(`SELECT * FROM create_${this.tableName}($1)`, [entityObject]);
            return result.rows[0];
        });
        this.update = (entityObject, currentVersion) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query(`SELECT * FROM update_${this.tableName}($1, $2)`, [entityObject, currentVersion]);
            return result.rows[0];
        });
        this.delete = (id) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query(`SELECT * FROM delete_${this.tableName}($1)`, [id]);
            return result.rows[0];
        });
        this.checkIfUsed = (fieldName, value) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query(`SELECT 1 FROM ${this.tableName} WHERE ${fieldName} = $1`, [value]);
            return result.rows;
        });
        this.checkIfNotNull = (fieldName, id) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query(`SELECT 1 FROM ${this.tableName} WHERE ${fieldName} IS NOT NULL AND "id" = $1`, [id]);
            return result.rows;
        });
    }
}
exports.CoreDatamapper = CoreDatamapper;

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
exports.CoreController = void 0;
const BadRequestError_error_1 = require("../errors/BadRequestError.error");
const NotFoundError_error_1 = require("../errors/NotFoundError.error");
const DatabaseConnectionError_error_1 = require("../errors/DatabaseConnectionError.error");
class CoreController {
    constructor(datamapper) {
        this.datamapper = datamapper;
        this.getByPk = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            if (!id) {
                throw new BadRequestError_error_1.BadRequestError("You should provide an id");
            }
            const searchedItem = yield this.datamapper.findByPk(id);
            if (!searchedItem) {
                throw new NotFoundError_error_1.NotFoundError();
            }
            res.status(200).send(searchedItem);
        });
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const itemsList = yield this.datamapper.findAll();
            if (!itemsList) {
                throw new DatabaseConnectionError_error_1.DatabaseConnectionError();
            }
            res.status(200).send(itemsList);
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const item = req.body;
            const createdItem = yield this.datamapper.insert(item);
            res.status(201).json(createdItem);
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            if (!id) {
                throw new BadRequestError_error_1.BadRequestError("This id doesn't exist");
            }
            const itemToDelete = yield this.datamapper.findByPk(id);
            if (!itemToDelete) {
                throw new NotFoundError_error_1.NotFoundError();
            }
            const deletedItem = yield this.datamapper.delete(id);
            if (!deletedItem) {
                throw new DatabaseConnectionError_error_1.DatabaseConnectionError();
            }
            res.status(200).send(deletedItem);
        });
    }
}
exports.CoreController = CoreController;

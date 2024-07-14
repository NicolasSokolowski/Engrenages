"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRandomString = makeRandomString;
function makeRandomString(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
//# sourceMappingURL=makeRandomString.helper.js.map
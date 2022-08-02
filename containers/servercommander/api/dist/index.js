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
exports.handler = void 0;
const child_process_1 = require("child_process");
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Running terraform plan");
    (0, child_process_1.exec)(`ls -la`, (err, stdout, stderr) => {
        if (err) {
            throw err;
        }
        if (stderr) {
            throw Error(`terraform error ${stderr}`);
        }
        console.log(stdout);
    });
    return {
        statusCode: 201,
        body: JSON.stringify({
            message: 'server on',
        }),
    };
});
exports.handler = handler;

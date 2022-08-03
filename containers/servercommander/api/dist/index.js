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
    let terraformInit = yield (0, child_process_1.exec)(`terraform init`);
    if (terraformInit.stdout) {
        console.log("success");
    }
    else if (terraformInit.stderr) {
        console.log("error");
    }
    else {
        console.log("init failed");
    }
    return {
        statusCode: 201,
        body: JSON.stringify({
            message: 'server on',
        }),
    };
});
exports.handler = handler;

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const child_process_1 = require("child_process");
const stream_to_string_1 = __importDefault(require("stream-to-string"));
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Running terraform plan");
    let terraformInit = yield (0, child_process_1.exec)(`terraform init`);
    if (terraformInit.stdout) {
        console.log("success");
        let result = yield (0, stream_to_string_1.default)(terraformInit.stdout);
        console.log(result);
        console.log("applying terraform config");
        let terraformApply = yield (0, child_process_1.exec)(`terraform apply -var-file="secret.tfvars" main.tf -auto-approve`);
        if (terraformApply.stdout) {
            console.log("terraform apply success");
            let result = yield (0, stream_to_string_1.default)(terraformApply.stdout);
            console.log(result);
        }
        else if (terraformApply.stderr) {
            console.log("terraform apply error");
        }
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

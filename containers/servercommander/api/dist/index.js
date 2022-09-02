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
exports.onSwitch = exports.offSwitch = void 0;
const child_process_1 = require("child_process");
const offSwitch = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Running terraform destroy - turning off server");
    try {
        let terraformInit = yield runCommand(`terraform init`);
        console.log("terraformInit: " + terraformInit);
        let terraformDestroy = yield runCommand(`terraform apply -destroy -auto-approve`);
        console.log(`terraformDestroy: ${terraformDestroy}`);
    }
    catch (error) {
        console.log(`error: ${error}`);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'server error',
            }),
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'server off',
        }),
    };
});
exports.offSwitch = offSwitch;
const onSwitch = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Running terraform plan - turning on server");
    try {
        yield runCommand(`terraform init`);
        yield runCommand(`terraform apply -auto-approve`);
        let ipAddress = yield runCommand(`terraform output instance_ip`);
        return {
            statusCode: 201,
            body: JSON.stringify({
                ipAddress: `${ipAddress}`,
            }),
        };
    }
    catch (error) {
        console.log(`error: ${error}`);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'server error',
            }),
        };
    }
});
exports.onSwitch = onSwitch;
// TODO enum or sealed class
function runCommand(command) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, function (error, stdout, stderr) {
            if (error) {
                reject(error);
            }
            else if (stderr) {
                reject(stderr);
            }
            else if (stdout) {
                resolve(stdout);
            }
            else {
                reject('No output');
            }
        });
    });
}

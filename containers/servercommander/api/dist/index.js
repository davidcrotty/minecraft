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
        let terraformInit = yield readStream(`terraform init`);
        console.log(`terraformInit: ${terraformInit}`);
        let terraformDestory = yield readStream(`terraform apply -destroy -auto-approve`);
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
        let terraformInit = yield readStream(`terraform init`);
        console.log(`terraformInit: ${terraformInit}`);
        let terraformPlan = yield readStream(`terraform apply -auto-approve`);
        console.log(`terraformPlan: ${terraformPlan}`);
        // TODO query for ip here
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
        statusCode: 201,
        body: JSON.stringify({
            message: 'server on',
        }),
    };
});
exports.onSwitch = onSwitch;
function readStream(command) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error) {
                reject(error.name + error.message);
            }
            else if (stderr) {
                // TODO scan for specific errors here
                reject(stderr);
            }
            else if (stdout) {
                resolve(stdout);
            }
            else {
                reject("No output");
            }
        });
    });
}

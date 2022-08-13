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
        console.log("terraformInit: " + terraformInit);
        let terraformDestroy = yield readStream(`terraform apply -destroy -auto-approve`);
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
        yield readStream(`terraform init`);
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
        let process = (0, child_process_1.spawn)("unbuffer", ["terraform"]);
        process.stdout.on('data', function (data) {
            console.log('stdout: ' + data.toString());
        });
        process.stderr.on('data', function (data) {
            console.log('stderr: ' + data.toString());
        });
        process.on('exit', function (code) {
            console.log('child process exited with code ' + (code === null || code === void 0 ? void 0 : code.toString()));
            resolve((code === null || code === void 0 ? void 0 : code.toString()) || "-1");
        });
    });
}

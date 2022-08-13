import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { spawn } from 'child_process';

export const offSwitch = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log("Running terraform destroy - turning off server");
  try {
    let terraformInit = await readStream(`terraform init`);
    console.log("terraformInit: " + terraformInit);
    let terraformDestroy = await readStream(`terraform apply -destroy -auto-approve`);
    console.log(`terraformDestroy: ${terraformDestroy}`);
  } catch(error) {
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
}

export const onSwitch = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log("Running terraform plan - turning on server");
  
  try {
    await readStream(`terraform init`);
    // TODO query for ip here
  } catch(error) {
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
};

function readStream(command: string) : Promise<String> {
  return new Promise<String>((resolve, reject) => {
      let process = spawn("unbuffer", ["terraform"]);
      process.stdout.on('data', function (data) {
        console.log('stdout: ' + data.toString());
      });

      process.stderr.on('data', function (data) {
        console.log('stderr: ' + data.toString());
      });

      process.on('exit', function (code) {
        console.log('child process exited with code ' + code?.toString());
        resolve(code?.toString() || "-1");
      });
  });
}
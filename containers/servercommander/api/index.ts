import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { exec } from 'child_process';

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
    let terraformInit = await readStream(`terraform init`);
    console.log(`terraformInit: ${terraformInit}`);
    let terraformPlan = await readStream(`terraform apply -auto-approve`);
    console.log(`terraformPlan: ${terraformPlan}`);
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
      exec(command, {maxBuffer: 1024 * 1024 * 25}, (error, stdout, stderr) => {
        if (error) {
          reject(error.name + error.message);
        } else if (stderr) {
          // TODO scan for specific errors here
          reject(stderr);
        } else if (stdout) {
          resolve(stdout);
        } else {
          reject("No output");
        }
      })
  });
}
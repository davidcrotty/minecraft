import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { exec, ExecException } from 'child_process';

type Command = 'terraform init' | 'terraform apply -destroy -auto-approve' | 'terraform apply -auto-approve' | 'terraform output instance_ip';

export const offSwitch = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log("Running terraform destroy - turning off server");
  try {
    let terraformInit = await runCommand(`terraform init`);
    console.log("terraformInit: " + terraformInit);
    let terraformDestroy = await runCommand(`terraform apply -destroy -auto-approve`);
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
    await runCommand(`terraform init`);
    await runCommand(`terraform apply -auto-approve`);
    let ipAddress = await runCommand(`terraform output instance_ip`);
    return {
      statusCode: 201,
      body: JSON.stringify({
          ipAddress: `${ipAddress}`,
      }),
  };
  } catch(error) {
    console.log(`error: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
          message: 'server error',
      }),
    };
  }
};

// TODO enum or sealed class
function runCommand(command: Command) : Promise<String> {
  return new Promise<String>((resolve, reject) => {
      exec(command, function(error: ExecException | null, stdout: string, stderr: string) {
        if (error) {
          reject(error);
        } else if(stderr) {
          reject(stderr);
        } else if (stdout) {
          resolve(stdout);
        } else {
          reject('No output');
        }
      });
  });
}
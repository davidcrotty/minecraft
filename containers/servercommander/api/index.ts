import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { exec, ExecException } from 'child_process';

type Command = 'cp -R . /tmp' | 'ls /tmp -la' | 'terraform -chdir=/tmp/ init' | 'terraform -chdir=/tmp/ apply -destroy -auto-approve' | 'terraform -chdir=/tmp/ apply -auto-approve' | 'terraform -chdir=/tmp/ output instance_ip';

export const offSwitch = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log("Running terraform destroy - turning off server");
  try {
    console.log(`Copying terraform files`);
    await runCommand(`cp -R . /tmp`);
    console.log(`Copied terraform files`);
    let terraformInit = await runCommand(`terraform -chdir=/tmp/ init`);
    console.log("terraformInit: " + terraformInit);
    let terraformDestroy = await runCommand(`terraform -chdir=/tmp/ apply -destroy -auto-approve`);
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
    console.log(`Copying terraform files`);
    await runCommand(`cp -R . /tmp`);
    console.log(`Copied terraform files`);
    let initOutput = await runCommand(`terraform -chdir=/tmp/ init`);
    console.log(`Terraform init ran: ${initOutput}`);
    let dirOutput = await runCommand(`ls /tmp -la`);
    console.log(`Dir list ran: ${dirOutput}`);
    await runCommand(`terraform -chdir=/tmp/ apply -auto-approve`);
    let ipAddress = await runCommand(`terraform -chdir=/tmp/ output instance_ip`);
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
          resolve('No output');
        }
      });
  });
}
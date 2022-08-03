import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { exec } from 'child_process';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log("Running terraform plan");
  
  let terraformInit = await exec(`terraform init`);

  if (terraformInit.stdout) {
    console.log("success")
  } else if (terraformInit.stderr) {
    console.log("error")
  } else {
    console.log("init failed")
  }

  return {
      statusCode: 201,
      body: JSON.stringify({
          message: 'server on',
      }),
  };
};
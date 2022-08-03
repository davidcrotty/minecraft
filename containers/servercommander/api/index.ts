import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { exec } from 'child_process';
import streamToString from 'stream-to-string';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log("Running terraform plan");
  
  let terraformInit = await exec(`terraform init`);

  if (terraformInit.stdout) {
    console.log("success");
    let result = await streamToString(terraformInit.stdout);
    console.log(result);

    console.log("applying terraform config");
    let terraformApply = await exec(`terraform apply -auto-approve`);

    if(terraformApply.stdout) {
      console.log("terraform apply success");
      let result = await streamToString(terraformApply.stdout);
      console.log(result);
    } else if (terraformApply.stderr) {
      console.log("terraform apply error");
    }

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
import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { exec } from 'child_process';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log("Running terraform plan");
  
  exec(`terraform plan`, (err, stdout, stderr) => {
    if(err) {
      throw err;
    }

    if(stderr) {
      throw Error(`terraform error ${stderr}`);
    }

     console.log(stdout);
  }) 

  return {
      statusCode: 201,
      body: JSON.stringify({
          message: 'server on',
      }),
  };
};
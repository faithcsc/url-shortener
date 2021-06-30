const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

const tableName = 'LongToShort'

exports.handler = async (event, context) => {
    let body;
    let checkIfExists;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json"
    };

    try {
        switch (event.routeKey) {
            case "DELETE /items/{id}":
                await dynamo
                    .delete({
                        TableName: tableName,
                        Key: {
                            ShortUrl: event.pathParameters.id
                        }
                    })
                    .promise();
                body = JSON.stringify({
                    "success": `Deleted item ${event.pathParameters.id}`
                });
                break;
            case "GET /items/{id}":
                body = await dynamo
                    .get({
                        TableName: tableName,
                        Key: {
                            ShortUrl: event.pathParameters.id
                        }
                    })
                    .promise();
                break;
            case "PUT /items":
                let requestJSON = JSON.parse(event.body);
                checkIfExists = await dynamo
                    .get({
                        TableName: tableName,
                        Key: {
                            ShortUrl: requestJSON.ShortUrl,
                        }
                    })
                    .promise();
                if (JSON.stringify(checkIfExists) == "{}") {
                    await dynamo
                        .put({
                            TableName: tableName,
                            Item: {
                                ShortUrl: requestJSON.ShortUrl,
                                LongUrl: requestJSON.LongUrl
                            }
                        })
                        .promise();
                    body = JSON.stringify({
                        LongUrl: requestJSON.LongUrl,
                        ShortUrl: requestJSON.ShortUrl
                    });
                } else {
                    body = JSON.stringify({
                        "Error": "Already exists"
                    })
                }

                break;
            default:
                throw new Error(`Unsupported route: "${event.routeKey}"`);
        }
    } catch (err) {
        statusCode = 400;
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers
    };
};

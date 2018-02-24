export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  apiGateway: {
    URL: 'https://db8pgf5jn6.execute-api.us-east-2.amazonaws.com/prod',
    REGION: 'us-east-2',
  },
  cognito: {
    USER_POOL_ID: 'us-east-2_WzMHkKXFM',
    APP_CLIENT_ID: '4f535913cv958r6pn5uv5sm99',
    REGION: 'us-east-2',
    IDENTITY_POOL_ID: 'us-east-2:dd6785b4-f479-4c24-a5f9-4bc088747916',
  },
  s3: {
    BUCKET: 'eg-notes-app-uploads',
  },
};

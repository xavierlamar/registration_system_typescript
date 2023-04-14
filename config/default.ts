export default {
  port: process.env.PORT,
  dbUri: process.env.MONGODB,
  logLevel: "info",
  accessTokenPrivateKey: "",
  refreshTokenPrivateKey: "",
  smtp: {
    user: 'fgjj6ilwcrjzobqx@ethereal.email',
    pass: 'pwMAEdx1Damk48ZCMz',
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
  },
};

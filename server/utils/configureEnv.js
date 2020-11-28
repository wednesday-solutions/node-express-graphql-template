const dotenv = require('dotenv');

module.exports = () => {
  dotenv.config({ path: `.env.${process.env.ENVIRONMENT_NAME}` });
};

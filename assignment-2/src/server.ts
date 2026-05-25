import app from "./app.js";
import config from "./config/index.js";

const main = () => {
  app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
  });
};

main();
const axios = require("axios");

class ConfigInterface {
  getInterfaceMappingConfig(path, logger) {
    return new Promise((resolve, reject) => {
      const config = global.myCache.get(path);
      if (config) {
        logger.info("InterfaceMappingConfig cached", path);
        resolve(config);
      } else {
        axios
        .get(process.env.configServerUrl + path)
        .then((response) => {
          logger.info("InterfaceMappingConfig retrieved", path);
          global.myCache.set(path, response.data);
          resolve(response.data);
        })
        .catch((error) => {
          logger.error("InterfaceMappingConfig error", error);
          reject(error);
        });
      }
    });
  }
}

module.exports = new ConfigInterface();

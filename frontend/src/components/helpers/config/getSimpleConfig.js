export const getSimpleConfig = async (url, folder, configFiles = []) => {
  const response = await fetch(`${url}${folder}`);
  const files = await response.json();

  for (const file of files) {
    switch(file.type) {
      case "directory":
        await getSimpleConfig(url, `${folder}${file.name}/`, configFiles);
        break;
      case "file":
        configFiles.push(`${folder}${file.name}`);
        break;
      default:
        break;
    }
  }

  return configFiles;
};
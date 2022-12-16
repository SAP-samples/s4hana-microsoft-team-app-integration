export const isDate = (contentValue) => {
  if (typeof contentValue === "string" || contentValue instanceof String) {
    // SAP date format - handles POs/SOs
    const regexSAP = /^\/Date\([0-9]+\)\/$/;

    // format to handle the service date cases
    const regex =
      /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?Z?$/;

    if (regexSAP.test(contentValue)) {
      return contentValue;
    } else if (regex.test(contentValue)) {
      const date = new Date(contentValue);
      return `/Date(${date.getTime()})/`;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

class ResponseFormatter {
  formatTableData(data, logger) {
    let formattedData;
    logger.info("Start Re-Formatting The Response Data");

    try {
      formattedData = [{ values: { d: { results: [...data] } } }];
    } catch (e) {
      logger.error("Exception Happens While Re-Formatting The Response Data");
      logger.error(e);
    }

    logger.info("Re-Formatting The Response Data Complete");
    return formattedData;
  }

  successMessage(response) {
    let successMessage = {};
    successMessage.data = response.data;
    successMessage.status = response.status;
    console.log("Success message is: ", successMessage);
    return successMessage;
  }

  removeErrorMsg(errorSet, errorMsg) {
    if (errorSet.size > 1) {
      errorSet.delete(errorMsg);
    }
  }

  errorMessage(req, error, logger) {
    logger.error("error.response.data", error.response.data);
    let errorResponse = {};
    let businessLogicError = "";
    let invalidInputError = "";
    let businessLogicErrorSet = new Set();

    if (
      error.response.data.hasOwnProperty("innererror") &&
      typeof error.response.data.innererror === "object" &&
      error.response.data.innererror.hasOwnProperty("errordetails") &&
      typeof error.response.data.innererror.errordetails === "object" &&
      error.response.data.innererror.errordetails.hasOwnProperty(
        "errordetail"
      ) &&
      typeof error.response.data.innererror.errordetails.errordetail ===
        "object" &&
      Array.isArray(error.response.data.innererror.errordetails.errordetail)
    ) {
      // req.query is sometimes empty when error detail is not!
      if (Object.keys(req.query) > 0) {
        for (const key in req.query) {
          for (
            let i = 0;
            i < error.response.data.innererror.errordetails.errordetail.length;
            i++
          ) {
            let errorDetailObj =
              error.response.data.innererror.errordetails.errordetail[i];
            if (
              errorDetailObj.message != null &&
              errorDetailObj.message.includes(req.query[key])
            ) {
              businessLogicErrorSet.add(errorDetailObj.message);
            } else if (
              errorDetailObj.message != null &&
              errorDetailObj.message.includes("User")
            ) {
              businessLogicErrorSet.add(errorDetailObj.message);
            }
          }
        }
      } else {
        // use try/catch just in case these properties do not exist
        try {
          if (error.response.data.innererror.errordetails.errordetail) {
            const arr = error.response.data.innererror.errordetails.errordetail;
            for (let i = 0; i < arr.length; i++) {
              const msg = arr[i].message;
              businessLogicErrorSet.add(msg);
            }
          }

          // remove unspecific errors if we have more specific ones
          this.removeErrorMsg(businessLogicErrorSet, "An exception was raised");
          this.removeErrorMsg(
            businessLogicErrorSet,
            "Exception raised without specific error"
          );
        } catch (error) {
          console.error(error);
        }
      }
    } else if (
      error.response.data.error &&
      error.response.data.error.innererror && //sap graph structure
      error.response.data.error.innererror.datasources &&
      error.response.data.error.innererror.datasources[0].response.originalError
        .error.innererror.errordetails.length > 0
    ) {
      let errorDetailsArr =
        error.response.data.error.innererror.datasources[0].response
          .originalError.error.innererror.errordetails;
      for (const key in req.body) {
        for (let i = 0; i < errorDetailsArr.length; i++) {
          let errorDetailObj = errorDetailsArr[i];
          if (
            errorDetailObj.message != null &&
            errorDetailObj.message.includes(req.body[key])
          ) {
            businessLogicErrorSet.add(errorDetailObj.message);
          } else if (
            errorDetailObj.message != null &&
            errorDetailObj.message.includes("User")
          ) {
            businessLogicErrorSet.add(errorDetailObj.message);
          }
        }
      }
    } else {
      if (
        error.response.data.hasOwnProperty("message") &&
        typeof error.response.data.message === "object" &&
        error.response.data.message.hasOwnProperty("$") &&
        error.response.data.message.$ !== ""
      ) {
        invalidInputError = error.response.data.message.$;
      } else if (
        error.response.data.error &&
        typeof error.response.data.error === "object"
      ) {
        //sap graph structure
        invalidInputError = error.response.data.error.message;
      }
    }

    if (businessLogicErrorSet.size != 0) {
      businessLogicErrorSet.forEach((blError) => {
        businessLogicError = businessLogicError + blError + "\n";
      });
      businessLogicError = businessLogicError.substring(
        0,
        businessLogicError.lastIndexOf("\n")
      );
    }

    if (businessLogicError !== "" && invalidInputError === "") {
      errorResponse.data = businessLogicError;
    } else {
      errorResponse.data = invalidInputError;
    }
    errorResponse.status = error.response.status;

    return errorResponse;
  }

  toParams(query, searchFields, switchSubstringofParams = false) {
    let params;
    if(query.hasOwnProperty("top") && query.top !== ""){
      params = "$format=json&$top=" + query.top;
    }else{
      params = "$format=json&$top=" + process.env.REACT_APP_SCROLL_PAGE_SIZE;
    }

    if (searchFields && query["filter"]) {
      const filters = [];
      searchFields.forEach((field) => {
        /**
         * If switchParams is true, the order of the parameters in substringof
         * will be switched. This is done to work with odata v2 apis that expect
         * the opposite order from the default spec order.
         * */
        let substringParams = switchSubstringofParams
          ? `'${query["filter"]}',${field.trim()}`
          : `${field.trim()},'${query["filter"]}'`;
        filters.push(`substringof(${substringParams}) eq true`);
      });
      params += "&$filter=" + filters.join(" or ");
    }

    return params;
  }
}

module.exports = new ResponseFormatter();

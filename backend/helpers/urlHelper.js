class UrlHelper {

    generateFirstLevelRequestUrl(objectMapping, id, query) {

        let url = "";
        if (objectMapping.hasOwnProperty("pathParams") && objectMapping.pathParams.length > 0) {

            let map = new Map();
            Object.keys(query).forEach((key) => {
                map.set(key, query[key]);
            });

            url = objectMapping.url + "(";
            for (let i = 0; i < objectMapping.pathParams.length; i++) {

                if (i !== objectMapping.pathParams.length - 1) {
                    url += (objectMapping.pathParams[i] + "='" + map.get(objectMapping.pathParams[i]) + "',");
                } else {
                    url += (objectMapping.pathParams[i] + "='" + map.get(objectMapping.pathParams[i]) + "')");
                }
            }
        } else {
            url = `${objectMapping.url}('${id}')`;
        }

        return url;
    }

    generateSecondLevelRequestUrl(businessObject, id, businessObjectItem,
        itemId, objectItemMapping, query) {

        let url = "";
        if (objectItemMapping.hasOwnProperty("pathParams") && objectItemMapping.pathParams.length > 0) {

            let map = new Map();
            Object.keys(query).forEach((key) => {
                map.set(key, query[key]);
            });

            url = objectItemMapping.url + "(";
            for (let i = 0; i < objectItemMapping.pathParams.length; i++) {

                if (i !== objectItemMapping.pathParams.length - 1) {
                    url += (objectItemMapping.pathParams[i] + "='" + map.get(objectItemMapping.pathParams[i]) + "',");
                } else {
                    url += (objectItemMapping.pathParams[i] + "='" + map.get(objectItemMapping.pathParams[i]) + "')");
                }
            }
        } else {
            url = `${objectItemMapping.url}(${businessObject}='${id}',${businessObjectItem}='${itemId}')`;
        }

        return url;
    }
}

module.exports = new UrlHelper();
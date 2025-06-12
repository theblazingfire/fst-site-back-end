const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const generateNameFromPath = (path, method) => {
  const segments = path.split("/").filter((segment) => segment); // Remove empty segments
  const formattedSegments = segments.map((segment) =>
    segment.startsWith("{")
      ? "By" + capitalize(segment.slice(1, -1))
      : capitalize(segment),
  );
  return method.toLowerCase() + formattedSegments.join("");
};

function extractAllEndpoints(parsedYaml, baseUrl) {
  let result = [];
  const endpointsGroup = Object.keys(parsedYaml.paths);
  for (let path of endpointsGroup) {
    let data = parsedYaml.paths[path];
    let methods = Object.keys(data);
    for (let each of methods) {
      let individualData = data[each];
      individualData.method = each;
      individualData.path = path;
      individualData.baseUrl = baseUrl;
      result.push(individualData);
    }
  }
  return result;
}

function getQueryTemplate1(queryArray) {
  if (!Array.isArray(queryArray)) {
    throw new Error(
      "Input must be an array of strings in the format 'queryValue'.",
    );
  }
  let output = [];
  for (let each of queryArray) {
    output.push(each + "=${encodeURIComponent(" + each + ")}");
  }
  return output;
}

function getQueryTemplate(queryArray) {
  // Validate input
  if (!Array.isArray(queryArray)) {
    throw new Error(
      "Input must be an array of strings representing query keys.",
    );
  }

  // Generate templates
  const output = queryArray.map((key) => {
    if (typeof key !== "string" || !key.trim()) {
      throw new Error(
        `Invalid query key: "${key}". Query keys must be non-empty strings.`,
      );
    }
    // Create a template for each query key
    return `${key}=\${encodeURIComponent(${key})}`;
  });

  return output;
}

function processPath(path, parameters) {
  const pathParams = parameters?.filter((p) => p.in === "path");
  const queryParams = parameters?.filter((p) => p.in === "query");
  // generate query string write a function that takes this format of an array and returns the queryString
  let pathParamsLean = pathParams?.map((x) => x.name);
  let queryParamsLean = queryParams?.map((x) => x.name);
  let templatisedPath = path.replaceAll("{", "${");
  let queryPresent = Array.isArray(queryParams)
    ? queryParams.length > 0
    : !!queryParams;
  let pathParamsPresent = Array.isArray(pathParams)
    ? pathParams.length > 0
    : !!pathParams;
  let processed_query = queryPresent
    ? getQueryTemplate(queryParamsLean).join("&")
    : "";
  let processed_path = queryPresent
    ? `${templatisedPath}?${processed_query}`
    : `${templatisedPath}`;
  return {
    processed_path,
    queryPresent,
    pathParamsPresent,
    queryParams,
    pathParams,
    queryParamsLean,
    pathParamsLean,
  };
}

function parseRequest(requestBody, method) {
  if (requestBody === undefined) {
    return { contentType: false, properties: {}, method };
  } else {
    let contentType = Object.keys(requestBody.content)[0];
    let properties = Object.entries(
      requestBody.content[contentType]["schema"]?.properties || {},
    );
    return { contentType, properties, method };
  }
}

function generateBodyObjectTemplate(contentType, properties) {
  let output = [];
  let formDataTemplate = `
  let formData = new FormData();`;
  if (!contentType) {
    return { bodyTemp: "" };
  } else if (contentType === "application/json") {
    properties.forEach((x) => {
      let name = x[0];
      let template = `${name}`;
      output.push(template);
    });
    return {
      bodyTemp: "data: {" + output.join(",") + "}",
      formDataTemplate: "",
    };
  } else if (contentType === "multipart/form-data") {
    properties.forEach(([name, details]) => {
      if (details?.type === "array") {
        formDataTemplate += `${name}.forEach((x: any) => {
  formData.append("${name}", x); // Add each file to the "${name}" key
});`;
      } else {
        formDataTemplate +=
          `\n
        formData.append("` +
          name +
          `",` +
          name +
          ");";
      }
    });
    return { formDataTemplate, bodyTemp: "data: formData " };
  } else {
    return undefined;
  }
}

function generateFunctionArgsTemplate(
  {
    queryPresent,
    pathParamsPresent,
    queryParams,
    pathParams,
    queryParamsLean,
    pathParamsLean,
  },
  reqBodyProps,
  requiresAuth,
) {
  let temp = [];
  let warningTemp = {};
  if (requiresAuth) {
    temp.push("token");
    warningTemp["token"] = `if(typeof token !== 'string'){
            throw new Error("Argument 'token' should be of type string")
            }`;
  }
  if (queryPresent) {
    temp = temp.concat(queryParamsLean);
    queryParams.forEach((x) => {
      if (x.schema.type === "array") {
        let warningTypeGuardTemp = `if(!Array.isArray(${x.name})){
            throw new Error("Argument ${x.name} should be of type ${
              x.schema.type
            } and the items should be of the type ${
              x.schema?.items
                ? "in the " +
                  JSON.stringify(x.schema.items).replaceAll('"', "'") +
                  " format"
                : ""
            }")
            }`;
        warningTemp[x.name] = warningTypeGuardTemp;
      } else {
        let warningTypeGuardTemp = `if(typeof ${x.name} !== '${
          x.schema.type == "integer" ? "number" : x.schema.type
        }'){
            throw new Error("Argument \'${x.name}\' should be of type ${
              x.schema.type
            } ${
              x.schema?.format ? "in the " + x.schema.format + " format" : ""
            }")
            }`;
        warningTemp[x.name] = warningTypeGuardTemp;
      }
    });
  }
  if (pathParamsPresent) {
    temp = temp.concat(pathParamsLean);
    pathParams.forEach((x) => {
      if (x.schema.type === "array") {
        let warningTypeGuardTemp = `if(!Array.isArray(${x.name})){
              throw new Error("Argument \'${x.name}\' should be of type ${
                x.schema.type
              } and the items should be of the type ${
                x.schema?.items
                  ? "in the " +
                    JSON.stringify(x.schema.items).replaceAll('"', "'") +
                    " format"
                  : ""
              }")
              }`;
        warningTemp[x.name] = warningTypeGuardTemp;
      } else {
        let warningTypeGuardTemp = `if(typeof ${x.name} !== '${
          x.schema.type == "integer" ? "number" : x.schema.type
        }'){
              throw new Error("Argument \'${x.name}\' should be of type ${
                x.schema.type
              } ${
                x.schema?.format ? "in the " + x.schema.format + " format" : ""
              }")
              }`;
        warningTemp[x.name] = warningTypeGuardTemp;
      }
    });
  }
  if (reqBodyProps.contentType) {
    let reqBodyPropsLean = reqBodyProps.properties.map((x) => {
      let [name, value] = x;
      return name;
    });
    temp = temp.concat(reqBodyPropsLean);
    reqBodyProps.properties.forEach((x) => {
      let [name, value] = x;
      if (value.type === "array") {
        let warningTypeGuardTemp = `if(!Array.isArray(${name}) ${
          reqBodyProps.contentType === "multipart/form-data"
            ? "&& !" + name + ".every((item: any) => item instanceof File)"
            : ""
        }){
                throw new Error("Argument \'${name}\' should be of type ${
                  value.type
                } and the items should be of the type ${
                  value?.items
                    ? "in the " +
                      JSON.stringify(value).replaceAll('"', "'") +
                      " format"
                    : ""
                }")
                }`;
        warningTemp[name] = warningTypeGuardTemp;
      } else {
        let warningTypeGuardTemp = `if(typeof ${name} !== '${value.type}'){
                throw new Error("Argument \'${name}\' should be of type ${
                  value.type
                } ${value?.format ? "in the " + value.format + " format" : ""}")
                }`;
        warningTemp[name] = warningTypeGuardTemp;
      }
    });
  }
  return { temp, warningTemp };
}

module.exports = {
  capitalize,
  extractAllEndpoints,
  generateNameFromPath,
  processPath,
  parseRequest,
  generateFunctionArgsTemplate,
  generateBodyObjectTemplate,
};

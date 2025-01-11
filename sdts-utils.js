const fs = require("fs");
const prettier = require("prettier");
// get input and output and figure out the way to optimize this solution.
function generateAxiosInstanceFile(
  baseURL,
  outputPath = "./axiosInstance.js",
  headers = { "Content-Type": "application/json" },
) {
  const axiosInstanceCode = `
    import axios from 'axios';

    const axiosInstance = axios.create({
      baseURL: '${baseURL}',
      headers: ${JSON.stringify(headers, null, 2)}
    });

    export default axiosInstance;
  `;

  prettier
    .format(axiosInstanceCode, { parser: "babel" })
    .then((formattedCode) => {
      fs.writeFileSync(outputPath, formattedCode, "utf8");
      console.log(`Axios instance file generated at ${outputPath}`);
    })
    .catch((error) => {
      console.error("Error formatting or writing code:", error);
    });
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const getParamDefault = (type) => {
  if (type == "string") {
    return `""`;
  }
  if (type == "number" || type == "integer") {
    return `0`;
  }
  if (type == "object") {
    return `{}`;
  }
  if (type == "boolean") {
    return `true`;
  } else return undefined;
};

const generateNameFromPath = (path, method) => {
  const segments = path.split("/").filter((segment) => segment); // Remove empty segments
  const formattedSegments = segments.map((segment) =>
    segment.startsWith("{")
      ? "By" + capitalize(segment.slice(1, -1))
      : capitalize(segment),
  );
  return method.toLowerCase() + formattedSegments.join("");
};

function generateApiFunctionTemplate(endpoint) {
  const {
    name,
    method,
    summary,
    tags,
    security,
    parameters,
    requestBody,
    responses,
    path,
  } = endpoint;

  const requiresAuth = security ? true : false;
  const tokenParam = requiresAuth ? `token = ""` : "";
  const requestBodySchema = requestBody?.content;
  let requestBodySchemaExtracted = Object.entries(requestBodySchema || {})[0];
  requestBodySchemaExtracted
    ? (requestBodySchemaExtracted = requestBodySchemaExtracted[1].schema)
    : undefined;

  // Parse parameters
  const pathParams = parameters?.filter((p) => p.in === "path");
  const queryParams = parameters?.filter((p) => p.in === "query");

  const pathParamString = pathParams
    ?.map((p) => `${p.name} = ${getParamDefault(p.schema?.type)}`)
    .join(", ");
  const queryParamString = queryParams
    ?.map((q) => `${q.name} = ${getParamDefault(q.schema?.type)}`)
    .join(", ");

  console.log({
    path: path.replaceAll("{", "${"),
    requiresAuth,
    tokenParam,
    allParams: pathParamString?.toString() + queryParamString?.toString(),
    requestBodySchema: requestBodySchemaExtracted,
  });

  // Generate a comment for the function
  const comment = `
  /**
   * ${summary || "No description provided."}
   * Tags: ${tags ? tags.join(", ") : "None"}
   * Method: ${method.toUpperCase()}
   * Path: ${path}
   * Responses: ${Object.keys(responses || {}).join(", ")}
   */
  `;
  function generateQueryString(paramsArray) {
    if (!Array.isArray(paramsArray)) {
      throw new Error(
        "Input must be an array of strings in the format 'name=value'.",
      );
    }

    // Parse and join valid query parameters
    const queryString = paramsArray
      .map((param) => {
        const [key, value] = param.split("=");
        if (!key || value === undefined) {
          throw new Error(
            `Invalid format for parameter: "${param}". Expected "name=value".`,
          );
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join("&");

    return `?${queryString}`;
  }

  let combineParams = pathParamString || "" + queryParamString || "";

  console.log({ generateQueryString });
  // generateQuery
  if (method == "get") {
    const functionBody = `
    ${name || "unnamedFunction"}: async (${""}) =>{
      try {
        const response = await axiosInstance.get(${path.replaceAll("{", "${")})
      }
    
      }
 `;
  }

  // Generate the function body
  const functionBody = `
  ${comment}
  ${name || "unnamedFunction"}: async (${"" || ""}) => {
    try {
      const response = await axios({
        method: "${method}",
        url: \`/api${path}\`,
        ${parameters ? "params," : ""}
        ${requestBody ? "data," : ""}
      });
      return response.data;
    } catch (error) {
      console.error("Error in ${name || "unnamedFunction"}:", error);
      throw error;
    }
  }
  `;

  return functionBody.trim();
}
function generateApiFunctionTemplate1(endpoint) {
  const {
    name,
    method,
    summary,
    tags,
    parameters = [],
    requestBody,
    responses,
    path,
    security,
  } = endpoint;
  const requiresAuth = !!security;
  const tokenParam = requiresAuth ? `token = ""` : "";

  // Parse parameters
  const pathParams = parameters.filter((p) => p.in === "path");
  const queryParams = parameters.filter((p) => p.in === "query");

  const pathParamString = pathParams.map((p) => `${p.name}`).join(", ");
  const queryParamString = queryParams
    .map((q) => `${q.name} = ${getParamDefault(q.schema?.type)}`)
    .join(", ");

  const updatedParams = [tokenParam, pathParamString, queryParamString]
    .filter(Boolean)
    .join(", ");

  // Parse request body
  const requestBodySchema = requestBody?.content;
  const contentType = requestBodySchema
    ? Object.keys(requestBodySchema)[0]
    : null;

  const bodyParam = requestBody
    ? `data = ${contentType === "multipart/form-data" ? "{}" : "{}"}`
    : "";

  const allParams = [updatedParams, bodyParam].filter(Boolean).join(", ");

  // Generate headers
  const headers = [];
  if (requiresAuth) headers.push(`Authorization: \`Bearer \${token}\``);
  if (contentType) headers.push(`"Content-Type": "${contentType}"`);

  const headersString =
    headers.length > 0 ? `headers: { ${headers.join(", ")} },` : "";

  // Generate URL with path params
  const urlWithParams =
    pathParams.length > 0
      ? `\`${path.replace(
          /{([^}]+)}/g,
          (_, paramName) => `\${${paramName}}`,
        )}\``
      : `"${path}"`;

  // Generate function body
  const functionBody = `
  /**
   * ${summary || "No description provided."}
   * Tags: ${tags ? tags.join(", ") : "None"}
   * Method: ${method.toUpperCase()}
   * Path: ${path}
   * Responses: ${Object.keys(responses || {}).join(", ")}
   */
  ${name || "unnamedFunction"}: async (${allParams}) => {
    try {
      const response = await axios({
        method: "${method}",
        url: /api/${urlWithParams},
        ${
          queryParams.length > 0
            ? "params: { " +
              queryParams.map((q) => `${q.name}`).join(", ") +
              " }, "
            : ""
        }
        ${bodyParam ? "data," : ""}
        ${headersString}
      });
      return response.data;
    } catch (error) {
      console.error("Error in ${name || "unnamedFunction"}:", error);
      throw error;
    }
  },
  `.trim();
  return functionBody;
}

function extractAllEndpoints(parsedYaml, baseUrl) {
  let result = [];
  const endpointsGroup = Object.keys(parsedYaml.paths);
  console.log({ endpointsGroup });
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

function getQueryTemplate(queryArray) {
  if (!Array.isArray(queryArray)) {
    throw new Error(
      "Input must be an array of strings in the format 'queryValue'.",
    );
  }
  let output = [];
  for (let each of queryArray) {
    output.push(each + "=${" + each + "}");
  }
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
      let template = `${name}:` + "`${" + name + "}`";
      output.push(template);
    });
    return {
      bodyTemp: "data: {" + output.join(",") + "}",
      formDataTemplate: "",
    };
  } else if (contentType === "multipart/form-data") {
    properties.forEach((x) => {
      let name = x[0];
      formDataTemplate +=
        `\n
        formData.append("` +
        name +
        `",` +
        name +
        ");";
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
        let warningTypeGuardTemp = `if(typeof ${x.name} !== '${x.schema.type}'){
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
        let warningTypeGuardTemp = `if(typeof ${x.name} !== '${x.schema.type}'){
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
    console.log({ reqBodyProps });
    let reqBodyPropsLean = reqBodyProps.properties.map((x) => {
      let [name, value] = x;
      return name;
    });
    temp = temp.concat(reqBodyPropsLean);
    reqBodyProps.properties.forEach((x) => {
      let [name, value] = x;
      if (value.type === "array") {
        let warningTypeGuardTemp = `if(!Array.isArray(${name})){
                throw new Error("Argument \'${x.name}\' should be of type ${
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
  generateApiFunctionTemplate,
  generateNameFromPath,
  generateAxiosInstanceFile,
  processPath,
  parseRequest,
  generateFunctionArgsTemplate,
  generateBodyObjectTemplate,
};

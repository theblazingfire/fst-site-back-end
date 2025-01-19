const {
  processPath,
  parseRequest,
  generateFunctionArgsTemplate,
  generateBodyObjectTemplate,
} = require("./sdts-utils");

function generateApiFunctionTemplate(endpoint) {
  const {
    name,
    method,
    summary,
    tags,
    security,
    parameters,
    requestBody,
    baseUrl,
    responses,
    path,
  } = endpoint;
  const requiresAuth = !!security;
  let processed_path = processPath(path, parameters);
  let parsedRequest = parseRequest(requestBody, method);
  let bodyObjTemp = generateBodyObjectTemplate(
    parsedRequest.contentType,
    parsedRequest.properties,
  );

  let argTemp = generateFunctionArgsTemplate(
    processed_path,
    parsedRequest,
    requiresAuth,
  );

  let contentTypeHeader = "";
  if (parsedRequest.contentType) {
    contentTypeHeader = `'Content-Type': '${parsedRequest.contentType}'`;
  }

  let authHeader = requiresAuth ? "'Authorization': `Bearer ${token}`" : "";

  let configTemplate = `
  let config = {
    url: \`${baseUrl}${processed_path.processed_path}\`,
    method: '${method}',
    headers: {
    ${contentTypeHeader} ${contentTypeHeader ? "," : ""} ${authHeader}
    },
    ${bodyObjTemp.bodyTemp}
  };
  `;

  const functionBody = `
  /**
   * ${summary || "No description provided."}
   * Tags: ${tags ? tags.join(", ") : "None"}
   * Method: ${method.toUpperCase()}
   * Path: ${path}
   * Responses: ${Object.keys(responses || {}).join(", ")}
   */

  ${name || "unnamedFunction"}: async (${argTemp.temp.join(", ")}) => {
    ${Object.keys(argTemp.warningTemp)
      .map((x) => {
        return argTemp.warningTemp[x];
      })
      .join(" ")}
      ${
        parsedRequest?.contentType === "multipart/form-data"
          ? bodyObjTemp.formDataTemplate
          : ""
      }
    ${configTemplate}
    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("Error in ${name || "unnamedFunction"}:", error);
      throw error;
    }
  }
  `.trim();
  return { functionBody, args: argTemp.temp };
}

module.exports = generateApiFunctionTemplate;

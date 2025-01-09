const fs = require("fs");
const prettier = require("prettier");

function generateAxiosInstanceFile(baseURL, outputPath = "./axiosInstance.js", headers = { "Content-Type": "application/json" }) {
  const axiosInstanceCode = `
    import axios from 'axios';

    const axiosInstance = axios.create({
      baseURL: '${baseURL}',
      headers: ${JSON.stringify(headers, null, 2)}
    });

    export default axiosInstance;
  `;

  prettier.format(axiosInstanceCode, { parser: "babel" })
    .then((formattedCode) => {
      fs.writeFileSync(outputPath, formattedCode, "utf8");
      console.log(`Axios instance file generated at ${outputPath}`);
    })
    .catch((error) => {
      console.error("Error formatting or writing code:", error);
    });
}


const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function generateApiFunctionTemplate(endpoint) {
  const {
    name,
    method,
    summary,
    tags,
    parameters,
    requestBody,
    responses,
    path,
  } = endpoint;

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

  // Create a parameter string for the function
  const params = parameters ? "params = {}" : "";
  const bodyParam = requestBody ? "data = {}" : "";

  // Combine parameters
  const functionParams = [params, bodyParam].filter(Boolean).join(", ");

  // Generate the function body
  const functionBody = `
  ${comment}
  ${name || "unnamedFunction"}: async (${functionParams}) => {
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

const generateNameFromPath = (path, method) => {
  const segments = path.split("/").filter((segment) => segment); // Remove empty segments
  const formattedSegments = segments.map((segment) =>
    segment.startsWith("{")
      ? "By" + capitalize(segment.slice(1, -1))
      : capitalize(segment),
  );
  return method.toLowerCase() + formattedSegments.join("");
};

function extractAllEndpoints(parsedYaml) {
  let result = [];
  const endpoints = Object.keys(parsedYaml.paths);
  for (let path of endpoints) {
    let data = parsedYaml.paths[path];
    let methods = Object.keys(data);
    for (let each of methods) {
      let individualData = data[each];
      individualData.method = each;
      individualData.path = path;
      result.push(individualData);
    }
  }
  return result;
}

module.exports = {
  capitalize,
  extractAllEndpoints,
  generateApiFunctionTemplate,
  generateNameFromPath,
  generateAxiosInstanceFile
};

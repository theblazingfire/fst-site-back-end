//import fs from 'fs-extra'
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const prettier = require("prettier");

const pathToYaml = "./src/swagger.yaml";
const outputPath = "./api.json";

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
let outputObject = {};

let allEndpoints;

function generateApiFunctionTemplate(endpoint) {
  const { name, method, summary, tags, parameters, requestBody, responses } =
    endpoint;

  // Generate a comment for the function
  const comment = `
  /**
   * ${summary || "No description provided."}
   * Tags: ${tags ? tags.join(", ") : "None"}
   * Method: ${method.toUpperCase()}
   * Responses: ${Object.keys(responses || {}).join(", ")}
   */
  `;

  // Create a parameter string for the function
  const params = parameters
    ? parameters.map((param) => param.name).join(", ")
    : "params";

  // Determine if a request body is needed
  const bodyParam = requestBody ? "data" : "";

  // Combine parameters
  const functionParams = [params, bodyParam].filter(Boolean).join(", ");

  // Generate the function body
  const functionBody = `
  ${comment}
  async function ${name || "unnamedFunction"}(${functionParams}) {
    try {
      const response = await axios({
        method: "${method}",
        url: \`/api${endpoint.path || ""}\`,
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

// create a function that takes the loadedFile Output and returns the total endpoints individually
function extractAllEndpoints(parsedYaml) {
  let result = [];
  const endpoints = Object.keys(parsedYaml.paths);
  for (let path of endpoints) {
    let data = parsedYaml.paths[path];
    // each endpoint has a list of methods
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

try {
  const doc = yaml.load(fs.readFileSync(pathToYaml, "utf8"));
  // get all the paths
  allEndpoints = extractAllEndpoints(doc);

  // generate function templates
  allEndpoints.forEach((x) => {
    let tag = x.tags[0];
    if (!tag) return;
    let name = x.name || generateNameFromPath(x.path, x.method);

    if (!outputObject[tag]) {
      outputObject[tag] = {};
      outputObject[tag][name] = generateApiFunctionTemplate(x);
    }
  });

  fs.writeFileSync(outputPath, allEndpoints);
  console.log(outputObject);
} catch (e) {
  console.log(e);
}

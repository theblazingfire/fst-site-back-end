const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const prettier = require("prettier");

// import utility functions
const sdtsUtils = require("./sdts-utils.js");
const engine = require("./temp_gen_engine.js");

const pathToYaml = "./src/swagger.yaml";
const sdkOutputDir = "./sdkoutput";

const baseUrl = process.argv[2];

if (!baseUrl) {
  throw new Error("'baseUrl' command line argument required. process.argv[2]");
}

let outputObject = {};

try {
  // Load and parse the YAML file. format it and write it to its own file for inspection
  const doc = yaml.load(fs.readFileSync(pathToYaml, "utf8"));
  fs.writeFileSync("./yaml-formatted.json", JSON.stringify(doc), "utf8");

  // Extract all endpoints and organize them by tag
  const allEndpoints = sdtsUtils.extractAllEndpoints(doc, baseUrl);
  allEndpoints.forEach((x) => {
    const tag = x.tags?.[0];
    if (!tag) return;

    const name =
      x.name ||
      sdtsUtils.generateNameFromPath(x.path.split("-").join(""), x.method);

    if (!outputObject[tag]) {
      outputObject[tag] = {};
    }

    outputObject[tag][name] = engine({
      ...x,
      name,
    });
  });
  fs.writeFileSync("./endpoints.json", JSON.stringify(allEndpoints), "utf8");

  fs.writeFileSync("./outputObject.json", JSON.stringify(outputObject), "utf8");

  // Ensure the sdkoutput folder exists
  if (!fs.existsSync(sdkOutputDir)) {
    fs.mkdirSync(sdkOutputDir);
  }

  // Write each API group to its own file

  Object.entries(outputObject).forEach(async ([tag, functions]) => {
    const tagFilePath = path.join(sdkOutputDir, `${tag}.ts`);
    const functionsStr = Object.entries(functions)
      .map(([name, functionObj]) => `${functionObj.functionBody},`)
      .join("\n\n");
    const interfaceString = Object.entries(functions)
      .map(([name, functionObj]) => {
        return `${name}: (${functionObj.args.join(",")}) => Promise<any>`;
      })
      .join("\n");
    const fileContent = `// ${tag}\n\n import axios from "axios"; \ninterface ${tag}Api {\n${interfaceString}}; \n export const ${tag}: ${tag}Api = {\n${functionsStr}\n};`;

    try {
      /*
      const formattedContent = await prettier.format(fileContent, {
        parser: "babel",
      });
      */
      fs.writeFileSync(tagFilePath, fileContent, "utf8");
      console.log(`API group '${tag}' file written to ${tagFilePath}`);
    } catch (error) {
      console.error(
        `Error formatting or writing file for tag '${tag}':`,
        error,
      );
    }
  });

  console.log("API functions and Axios instance generated successfully!");
} catch (e) {
  console.error("Error processing the YAML file:", e);
}

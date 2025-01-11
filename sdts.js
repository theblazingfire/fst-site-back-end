const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const prettier = require("prettier");

// import utility functions
const sdtsUtils = require("./sdts-utils.js");
const engine = require("./temp_gen_engine.js");

const pathToYaml = "./src/swagger.yaml";
const sdkOutputDir = "./sdkoutput";

const baseUrl = "https://example.com";

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
    const tagFilePath = path.join(sdkOutputDir, `${tag}.js`);
    const functionsStr = Object.entries(functions)
      .map(([name, functionCode]) => `${functionCode},`)
      .join("\n\n");
    const fileContent = `// ${tag}\n\nexport const ${tag} = {\n${functionsStr}\n};`;

    try {
      const formattedContent = await prettier.format(fileContent, {
        parser: "babel",
      });
      fs.writeFileSync(tagFilePath, formattedContent, "utf8");
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

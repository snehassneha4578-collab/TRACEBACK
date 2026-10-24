/* eslint @typescript-eslint/no-require-imports: off */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const ts = require("typescript");

const webRoot = path.resolve(__dirname, "..");
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "traceback-regression-"));

function compile(sourcePath, outputName, aliasReplacements = []) {
  const source = fs.readFileSync(sourcePath, "utf8");
  let result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
  }).outputText;

  for (const [from, to] of aliasReplacements) {
    result = result.replaceAll(from, to);
  }
  fs.writeFileSync(path.join(tempRoot, outputName), result, "utf8");
}

compile(path.join(webRoot, "src/data/transistorCase.ts"), "transistorCase.js");
compile(
  path.join(webRoot, "src/lib/diagnosis.ts"),
  "diagnosis.js",
  [['require("@/data/transistorCase")', 'require("./transistorCase")']]
);

const { diagnoseReasoning } = require(path.join(tempRoot, "diagnosis.js"));
const status = (text, dependencyId) => {
  const result = diagnoseReasoning(text);
  assert.equal(result.sufficiency, "sufficient", "test explanation should pass sufficiency gate");
  return result.edges.find((edge) => edge.dependencyId === dependencyId).status;
};

const completeReasoning = [
  "A decrease in base bias reduces collector current, shifting the Q-point.",
  "The DC readings place the transistor in forward-active operation because VCE is well above the saturation voltage.",
  "The small-signal model is valid when the transistor operates in the forward-active region.",
  "Lower collector current reduces gm and reduces gain magnitude.",
].join("\n");

test("bias → collector current → Q-point: causal paraphrase", () => {
  assert.equal(status(completeReasoning, "bias-qpoint"), "demonstrated");
});

test("Q-point readings justify forward-active classification", () => {
  assert.equal(status(completeReasoning, "qpoint-region"), "demonstrated");
});

test("forward-active region supports small-signal model validity", () => {
  assert.equal(status(completeReasoning, "region-small-signal"), "demonstrated");
});

test("lower collector current reduces gm and gain", () => {
  assert.equal(status(completeReasoning, "small-signal-gain"), "demonstrated");
});

test("a high VCE claim used to justify saturation is inconsistent", () => {
  const text = [
    "The base bias changes and the collector current changes.",
    "The operating point is in saturation because VCE is high.",
    "The small-signal model is valid in the forward-active region.",
    "Lower collector current reduces gm and gain.",
  ].join("\n");
  assert.equal(status(text, "qpoint-region"), "inconsistent");
});

test("small-signal model explicitly invalid in saturation is valid reasoning", () => {
  const text = [
    "The base bias decreases and collector current falls.",
    "The DC readings show saturation because VCE is low.",
    "In saturation, the small-signal model is not valid.",
    "Lower collector current reduces gm and reduces gain.",
  ].join("\n");
  assert.equal(status(text, "region-small-signal"), "demonstrated");
});

test("claim that small-signal model remains valid in saturation is inconsistent", () => {
  const text = [
    "The base bias changes and the Q-point moves.",
    "The DC readings indicate saturation because VCE is low.",
    "In saturation, the small-signal model is still valid.",
    "Collector current affects gm and gain.",
  ].join("\n");
  assert.equal(status(text, "region-small-signal"), "inconsistent");
});

test("a relevant but unsupported region statement remains incomplete", () => {
  const text = [
    "The base bias changes the collector current and Q-point.",
    "The transistor may be in forward-active operation.",
    "The small-signal model is valid in forward-active operation.",
    "Lower collector current reduces gm and reduces gain.",
  ].join("\n");
  assert.equal(status(text, "qpoint-region"), "incomplete");
});

test("cutoff is not incorrectly treated as forward-active model validity", () => {
  const text = [
    "The base bias is lowered and collector current decreases.",
    "The readings indicate cutoff because collector current is zero.",
    "The small-signal model is not valid in cutoff.",
    "Collector current influences gm and gain.",
  ].join("\n");
  assert.equal(status(text, "region-small-signal"), "demonstrated");
});

process.on("exit", () => {
  try { fs.rmSync(tempRoot, { recursive: true, force: true }); } catch {}
});
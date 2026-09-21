const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "web-dist");

function writeJson(relativePath, value) {
  fs.writeFileSync(
    path.join(outputDir, relativePath),
    `${JSON.stringify(value, null, 2)}\n`,
  );
}

function copyRequiredFile(relativePath, targetName = relativePath) {
  const source = path.join(projectRoot, relativePath);
  const target = path.join(outputDir, targetName);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function injectPwaHead() {
  const indexPath = path.join(outputDir, "index.html");
  let html = fs.readFileSync(indexPath, "utf-8");

  if (!html.includes('rel="manifest"')) {
    const headTags = [
      '<meta name="description" content="Nudrub Bet is a responsible sportsbook demo with virtual odds and transparent bet slips." />',
      '<meta name="theme-color" content="#00f0ff" />',
      '<meta name="mobile-web-app-capable" content="yes" />',
      '<meta name="apple-mobile-web-app-capable" content="yes" />',
      '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />',
      '<link rel="manifest" href="/manifest.json" />',
      '<link rel="apple-touch-icon" href="/icon.png" />',
      '<link rel="icon" href="/icon.png" />',
    ].join("\n    ");

    html = html.replace("</head>", `    ${headTags}\n  </head>`);
    fs.writeFileSync(indexPath, html);
  }
}

console.log("Exporting Nudrub Bet for web hosting...");

if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}

const result = spawnSync(
  "pnpm",
  ["exec", "expo", "export", "--platform", "web", "--output-dir", "web-dist"],
  {
    cwd: projectRoot,
    env: {
      ...process.env,
      NODE_ENV: "production",
    },
    stdio: "inherit",
  },
);

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

copyRequiredFile("assets/images/icon.png", "icon.png");
copyRequiredFile("public/manifest.json", "manifest.json");
copyRequiredFile("public/service-worker.js", "service-worker.js");
copyRequiredFile("public/_redirects", "_redirects");
injectPwaHead();

writeJson("vercel.json", {
  rewrites: [{ source: "/(.*)", destination: "/" }],
});

console.log(`Web export ready at ${path.relative(process.cwd(), outputDir)}/`);
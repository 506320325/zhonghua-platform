const CHUNK_PUBLIC_PATH = "server/app/manifest.webmanifest/route.js";
const runtime = require("../../chunks/[turbopack]_runtime.js");
runtime.loadChunk("server/chunks/node_modules_next_765e3b._.js");
runtime.loadChunk("server/chunks/[root of the server]__e6253f._.js");
module.exports = runtime.getOrInstantiateRuntimeModule("[project]/node_modules/next/dist/esm/build/templates/app-route.js { INNER_APP_ROUTE => \"[project]/src/app/manifest--route-entry.js [app-rsc] (ecmascript)\" } [app-rsc] (ecmascript)", CHUNK_PUBLIC_PATH).exports;

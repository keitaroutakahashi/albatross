import { codeInspectorPlugin } from "code-inspector-plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  turbopack: {
    rules: codeInspectorPlugin({
      bundler: "turbopack",
    }),
  },
};

export default nextConfig;

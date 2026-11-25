import type { NextConfig } from "next"

const basePath = process.env.BASE_PATH ?? ""

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  agentRules: false,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
}

export default nextConfig

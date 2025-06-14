/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,

	experimental: {
		optimizePackageImports: ['@radix-ui/react-switch'],
	},

	eslint: {
		ignoreDuringBuilds: true,
	},

	typescript: {
		ignoreBuildErrors: true,
	},

	poweredByHeader: false,

	webpack: (config, { isServer }) => {
		config.ignoreWarnings = [/.*/];

		if (!isServer) {
			config.resolve.fallback = {
				fs: false,
				net: false,
				tls: false,
				crypto: false,
				stream: false,
				url: false,
				zlib: false,
				http: false,
				https: false,
				assert: false,
				os: false,
				path: false,
			};
		}

		return config;
	},
}

module.exports = nextConfig
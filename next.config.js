/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,

	// Configuração de headers para CORS
	async headers() {
		return [
			{
				source: "/api/:path*",
				headers: [
					{ key: "Access-Control-Allow-Credentials", value: "true" },
					{ key: "Access-Control-Allow-Origin", value: process.env.ALLOWED_ORIGIN || "http://localhost:3000" },
					{ key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
					{ key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
				]
			}
		]
	},

	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			'./Header': require.resolve('./app/components/Header.tsx')
		}
		return config
	}
}

module.exports = nextConfig
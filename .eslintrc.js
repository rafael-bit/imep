module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		"next/core-web-vitals",
		"eslint:recommended",
	],
	rules: {
		"@typescript-eslint/no-unused-vars": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"react-hooks/exhaustive-deps": "off",
		"jsx-a11y/alt-text": "off",
		"@next/next/no-img-element": "off",
		"prefer-const": "off",
		"react/no-unescaped-entities": "off",
		"@typescript-eslint/no-empty-interface": "off",
		"@typescript-eslint/no-empty-object-type": "off"
	},
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	ignorePatterns: ["node_modules/", ".next/", "out/"]
}; 
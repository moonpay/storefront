module.exports = {
	'env': {
		'browser': true,
		'es6': true
	},
	'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript'
    ],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaFeatures': {
			'jsx': true
		},
		'ecmaVersion': 2018,
		'sourceType': 'module'
	},
	'plugins': [
		'react',
		'import'
	],
	'rules': {
		'indent': 'error',
		'linebreak-style': ['error', 'unix'],
		'quotes': ['error', 'single'],
		'semi': ['error', 'always'],
		'object-curly-spacing': ['error', 'always'],
		'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
		'react/self-closing-comp': 'error',
		'import/no-unresolved': 'error',
		'import/order': 'error'
	}
};
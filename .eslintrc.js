module.exports = {
  'env': {
    'node':true,
    'es6': true
  },
  'extends': 'eslint:recommended',
  'rules': {
    'semi': ["error", "never"],
    // enable additional rules
    'linebreak-style': ['error', 'unix'],
    // node specific
    'global-require': 'error',
    'handle-callback-err': 'error',
    // override default options for rules from base configurations
    'no-cond-assign': ['error', 'always'],
    // disable rules from base configurations
    'arrow-body-style': 'off',
    'no-console': 'off',
    'no-inner-declarations': 'off',
    'no-redeclare': 'off',
    // style specific
    'no-trailing-spaces': 'error'
  },
  // known to throw warnings
  "parserOptions":{
    "ecmaVersion": 2018
  }
}                      

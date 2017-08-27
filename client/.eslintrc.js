module.exports = {
  parser: 'babel-eslint',
  plugins: ['graphql'],
  rules: {
    'graphql/template-strings': ['error', {
      env: 'literal',
      schemaJson: require('./server-schema.json'),
    }],
    'graphql/required-fields': [
      'error',
      {
        env: 'literal',
        schemaJson: require('./server-schema.json'),
        requiredFields: ['id']
      },
    ],
    'graphql/capitalized-type-name': ['warn', {
      schemaJson: require('./server-schema.json')
    }]
  }
}

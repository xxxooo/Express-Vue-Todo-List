module.exports = {
  extends: [
    'airbnb-base',
    'plugin:vue/essential',
  ],
  globals: {
    window: false,
    document: false,
    gapi: false,
  },
  env: {
    jest: true,
  },
  rules: {
    'no-param-reassign': [
      2,
      {
        props: true,
        ignorePropertyModificationsFor: ['state'],
      }
    ]
  },
}

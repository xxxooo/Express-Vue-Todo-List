module.exports = {
  extends: [
    'airbnb-base',
    'plugin:vue/essential',
  ],
  globals: {
    window: true,
    document: true,
    gapi: false,
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

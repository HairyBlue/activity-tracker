module.exports = {
  packagerConfig: {
    icon: "./src/favicon.ico",
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        setupIcon: "./src/favicon.ico",
      },
    },
    // {
    //   name: "@electron-forge/maker-zip",
    //   platforms: ['win32'],
    // },
    // {
    //   name: "@electron-forge/maker-deb",
    //   config: {},
    // },
    // {
    //   name: "@electron-forge/maker-rpm",
    //   config: {},
    // },
  ],
};
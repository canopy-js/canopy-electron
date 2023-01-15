module.exports = {
  packagerConfig: {
    icon: `build/_assets/electron-icon`
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
          options: {
            icon: `build/_assets/electron-icon.png`
          }
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ]
};

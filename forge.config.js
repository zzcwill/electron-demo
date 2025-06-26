const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {  
  packagerConfig: {
    name: "electronDemo",
    icon: "./src/images/app-icon.png",
    asar: true, // 是否打包为asar文件
  },
  rebuildConfig: {},
  makers: [
    { name: '@electron-forge/maker-zip' }, // 压缩包
    { name: '@electron-forge/maker-squirrel' }, // Windows 安装包
    { name: '@electron-forge/maker-dmg' } // macOS DMG
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

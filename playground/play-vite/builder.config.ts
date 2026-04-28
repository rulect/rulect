import type { Configuration } from "electron-builder";

const config: Configuration = {
  appId: "com.rulect.playreact",
  productName: "Rulect React",
  directories: {
    output: "release",
    buildResources: "public",
  },
  extraMetadata: {
    main: "dist/rulect/application.js",
  },
  files: ["dist/**/*", "./package.json"],
  asar: true,
  win: {
    target: "nsis",
    artifactName: "${productName}-Setup-${version}.${ext}",
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: "always",
    createStartMenuShortcut: true,
    runAfterFinish: true,
    deleteAppDataOnUninstall: true,
  },
};

export default config;

/**
 ** @see https://www.electron.build/
 **
 */
import type { Configuration } from "electron-builder";

const config: Configuration = {
  appId: "com.rulect.app",
  productName: "Rulect App",
  copyright: "Copyright © 2026 Rulect",
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
    runAfterFinish: true,
    createStartMenuShortcut: true,
    deleteAppDataOnUninstall: true,
    displayLanguageSelector: true,
    // installerSidebar: "public/installer-sidebar.bmp",
  },
};

export default config;

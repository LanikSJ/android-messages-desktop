export default {
  appId: "pw.kmr.amd",
  artifactName: (context) =>
    `${context.packager.appInfo.productName.replace(/ /g, "-")}-v${
      context.packager.appInfo.version
    }-${context.target.os}-${context.target.arch}.${context.target.ext}`,
  productName: "Android Messages",
  copyright: "Copyright 2025 Kyle Rosenberg",
  files: ["app/**/*", "resources/**/*"],
  directories: {
    buildResources: "resources",
    output: "dist",
  },
  linux: {
    target: ["AppImage", "snap", "deb", "pacman", "rpm", "freebsd", "zip"],
    executableName: "AndroidMessages",
    executableArgs: [
      "--ozone-platform-hint=auto",
      "--enable-features=WaylandWindowDecorations",
      "--gtk-version=3",
    ],
    category: "Internet",
    desktop: {
      entry: {
        Name: "Android Messages Desktop",
        StartupWMClass: "android-messages-desktop",
      },
    },
  },
  win: {
    target: ["nsis", "portable"],
  },
  mac: {
    category: "public.app-category.social-networking",
    target: { target: "default", arch: "universal" },
  },
  portable: {
    artifactName: (context) =>
      `${context.packager.appInfo.productName.replace(/ /g, "-")}-v${
        context.packager.appInfo.version
      }-${context.target.os}-${
        context.target.arch
      }.portable.${context.target.ext}`,
  },
  nsis: {
    allowToChangeInstallationDirectory: true,
    oneClick: false,
  },
};

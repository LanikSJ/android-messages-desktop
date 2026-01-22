export default {
  appId: "pw.kmr.amd",
  artifactName: "${productName}-v${version}-${os}-${arch}.${ext}",
  productName: "Android Messages",
  afterAllArtifactBuild: async (context) => {
    const { promises: fs } = await import("fs");
    const { default: path } = await import("path");

    // Get all artifacts that were built
    for (const artifact of context.artifacts) {
      const dir = path.dirname(artifact);
      const filename = path.basename(artifact);

      // If filename contains spaces, rename it to use dashes
      if (filename.includes(" ")) {
        const newFilename = filename.replace(/ /g, "-");
        const oldPath = artifact;
        const newPath = path.join(dir, newFilename);

        try {
          await fs.rename(oldPath, newPath);
          console.log(`Renamed: ${filename} -> ${newFilename}`);
        } catch (error) {
          console.error(`Failed to rename ${filename}:`, error);
        }
      }
    }
  },
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
    artifactName: "${productName}-v${version}-${os}-${arch}.portable.${ext}",
  },
  nsis: {
    allowToChangeInstallationDirectory: true,
    oneClick: false,
  },
};

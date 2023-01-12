
/** @type {import("next").NextConfig} */
const config = {/** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@citybiker/api"],
};

export default config;

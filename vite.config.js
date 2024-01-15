import glsl from "vite-plugin-glsl";

// const isCodeSandbox =
//   "SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env;

export default {
  // root: 'src/',
  // publicDir: "../static/",
  // base: './',
  // server:
  // {
  //     host: true,
  //     open: !isCodeSandbox // Open if it's not a CodeSandbox
  // },
  build: {
    rollupOptions: {
      input: {
        page1: "index.html",
        page2: "projects.html",
        // Add more entries for additional pages
      },
    },
  },
  plugins: [glsl()],
};

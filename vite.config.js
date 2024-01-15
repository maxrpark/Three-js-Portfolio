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
        home: "index.html",
        projects: "projects.html",
        target: "esnext",
        // Add more entries for additional pages
      },
    },
  },

  plugins: [glsl()],
};

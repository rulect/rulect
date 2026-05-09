import Rulect from "rulect";

const app = new Rulect({
  csp: "defaults",
  x: 5,
  y: 5,
});

const isDev = !app.isPackaged;

app.expose("minimize", () => {
  app.window?.minimize();
});

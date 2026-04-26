import { useRulect } from "./rulect/client";

export function setupIpcTest(container: HTMLElement) {
  const section = document.createElement("section");
  section.className = "ipc-test";
  section.innerHTML = `
    <h2>IPC Test</h2>
    <div class="ipc-test-row">
      <button id="ipc-ping">Ping</button>
      <span id="ipc-result" class="ipc-result"></span>
    </div>
    <div class="ipc-test-row ipc-window-buttons">
      <button id="ipc-minimize">Minimize</button>
      <button id="ipc-maximize">Maximize</button>
      <button id="ipc-close">Close</button>
    </div>
  `;

  const pingButton = section.querySelector<HTMLButtonElement>("#ipc-ping")!;
  const resultSpan = section.querySelector<HTMLSpanElement>("#ipc-result")!;
  const minimizeButton = section.querySelector<HTMLButtonElement>("#ipc-minimize")!;
  const maximizeButton = section.querySelector<HTMLButtonElement>("#ipc-maximize")!;
  const closeButton = section.querySelector<HTMLButtonElement>("#ipc-close")!;

  const rulectApi = useRulect();

  pingButton.addEventListener("click", async () => {
    try {
      resultSpan.textContent = "Ping...";
      const response = await rulectApi.ping();
      resultSpan.textContent = String(response);
    } catch (error) {
      resultSpan.textContent = String(error ?? "Ping failed");
    }
  });

  minimizeButton.addEventListener("click", () => {
    rulectApi.minimize();
  });

  maximizeButton.addEventListener("click", () => {
    rulectApi.maximize();
  });

  closeButton.addEventListener("click", () => {
    rulectApi.close();
  });

  container.appendChild(section);
}

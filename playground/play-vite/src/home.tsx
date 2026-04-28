import { useState } from "react";
import { useRulect } from "./rulect/client";

export default function Home() {
  const rulect = useRulect();
  const [result, setResult] = useState("Ready");

  async function handlePing() {
    try {
      setResult("Ping...");
      const response = await rulect.ping();
      setResult(String(response));
    } catch (error) {
      setResult(String(error ?? "Ping failed"));
    }
  }

  return (
    <section className="ipc-test">
      <h2>Electron Bridge</h2>
      <p>React renderer talking to preload-exposed APIs.</p>
      <div className="ipc-test-row">
        <button type="button" className="counter" onClick={handlePing}>
          Ping main
        </button>
        <span className="ipc-result">{result}</span>
      </div>
      <div className="ipc-test-row ipc-window-buttons">
        <button type="button" onClick={() => rulect.minimize()}>
          Minimize
        </button>
        <button type="button" onClick={() => rulect.maximize()}>
          Maximize
        </button>
        <button type="button" onClick={() => rulect.close()}>
          Close
        </button>
      </div>
    </section>
  );
}

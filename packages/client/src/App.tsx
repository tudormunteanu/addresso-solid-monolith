import { Component, createSignal, onMount } from "solid-js";

export const App: Component = () => {
  const [message, setMessage] = createSignal("Loading...");

  onMount(async () => {
    try {
      const response = await fetch("/api/hello");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Failed to load message. Please try again later.");
    }
  });

  return (
    <div>
      <h1>Hello World!</h1>
      <p>{message()}</p>
    </div>
  );
};

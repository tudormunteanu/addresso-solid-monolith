import { Component } from "solid-js";

const Footer: Component = () => (
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
    <div class="container mx-auto flex justify-between">
      <button class="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
        Add +
      </button>
      <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
        Add new device
      </button>
      <button class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
        Share
      </button>
    </div>
  </div>
);

export default Footer;

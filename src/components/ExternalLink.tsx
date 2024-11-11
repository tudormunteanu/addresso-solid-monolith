import { Component } from "solid-js";

type Props = {
  href: string;
  title: string;
};

const ExternalLink: Component<Props> = (props) => (
  <a
    href={props.href}
    target="_blank"
    rel="noopener noreferrer"
    class="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
    title={props.title}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  </a>
);

export default ExternalLink;

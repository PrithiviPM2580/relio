/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const elem = document.getElementById("root")!;
const app = (
	<StrictMode>
		<App />
	</StrictMode>
);

// https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
const hotData = import.meta.hot.data;

if (!hotData.root) {
	hotData.root = createRoot(elem);
}

hotData.root.render(app);

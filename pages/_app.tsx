import type { AppProps } from "next/app";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "react-markdown-editor-lite/lib/index.css";
import "react-resizable/css/styles.css";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <Component {...pageProps} />
    </DndProvider>
  );
}

export default MyApp;

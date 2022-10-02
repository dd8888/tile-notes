import type { AppProps } from "next/app";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "react-markdown-editor-lite/lib/index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import "react-resizable/css/styles.css";
import "../styles/globals.css";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <Component {...pageProps} />
      </DndProvider>
    </QueryClientProvider>
  );
}

export default MyApp;

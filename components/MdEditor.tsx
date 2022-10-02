import MarkdownIt from "markdown-it";
import dynamic from "next/dynamic";
const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});
export const MdEditorComp = ({
  view,
  value,
  handleValueChange,
}: {
  view: { html: boolean; md: boolean; menu: boolean };
  value: string;
  handleValueChange: (text: string) => void;
}) => {
  const mdParser = new MarkdownIt(/* Markdown-it options */);
  // Finish!
  function handleEditorChange({ html, text }: any) {
    handleValueChange(text);
    console.log("handleEditorChange", html, text);
    //You can use the text props to save it to your database
  }
  console.log(view);
  return (
    <MdEditor
      value={value}
      className="h-[90%] mt-5 bg-transparent max-w-full"
      renderHTML={(text) => mdParser.render(text)}
      onChange={handleEditorChange}
      view={view}
      key={`${view.md}`}
      allowPasteImage
      readOnly={!view.md}
    />
  );
};

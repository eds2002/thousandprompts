import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useState } from "react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { MdFormatListBulleted } from "react-icons/md";
import { VscListOrdered } from "react-icons/vsc";
import {
  BsBlockquoteLeft,
  BsChevronDown,
  BsCode,
  BsCodeSlash,
  BsJustify,
  BsQuote,
  BsTextCenter,
  BsTextIndentLeft,
  BsTextLeft,
  BsTextRight,
  BsTypeBold,
  BsTypeItalic,
  BsTypeStrikethrough,
  BsTypeUnderline,
} from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";

const MenuBar = ({ editor }: { editor: Editor }) => {
  const [selectedTag, setSelectedTag] = useState("Paragraph");
  if (!editor) {
    return null;
  }

  return (
    <div className="flex divide-x rounded-full bg-neutral-100 p-4">
      <TextTags
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        editor={editor}
      />
      <TextModifications editor={editor} />
      <Col3 editor={editor} />
      <div className="px-4">
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={
            editor.isActive("codeBlock")
              ? "h-5 w-5 rounded-md"
              : "h-5 w-5 rounded-md"
          }
        >
          <BsCodeSlash className="text-xl" />
        </button>
      </div>
      {/* <button
        onClick={() => editor.chain().focus().setColor("#958DF1").run()}
        className={
          editor.isActive("textStyle", { color: "#958DF1" }) ? "is-active" : ""
        }
      >
        purple
      </button> */}
    </div>
  );
};

const Col3 = ({ editor }: { editor: Editor }) => {
  return (
    <div className="flex items-center justify-center gap-x-1 px-4">
      <TextAlignments editor={editor} />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        <MdFormatListBulleted className="text-xl" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        <VscListOrdered className="text-xl" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        <BsBlockquoteLeft className="text-xl" />
      </button>
    </div>
  );
};

const TextAlignments = ({ editor }: { editor: Editor }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("left");
  const alignments = [
    {
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      icon: <BsTextLeft className="text-xl" />,
      className: editor.isActive({ textAlign: "left" })
        ? "w-5 h-5 rounded-sm"
        : "w-5 h-5 rounded-sm",
      type: "left",
    },
    {
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      icon: <BsTextCenter className="text-xl" />,
      className: editor.isActive({ textAlign: "center" })
        ? "w-5 h-5 rounded-sm"
        : "w-5 h-5 rounded-sm",
      type: "center",
    },
    {
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      icon: <BsTextRight className="text-xl" />,
      className: editor.isActive({ textAlign: "right" })
        ? "w-5 h-5 rounded-sm"
        : "w-5 h-5 rounded-sm",
      type: "right",
    },
    {
      onClick: () => editor.chain().focus().setTextAlign("justify").run(),
      icon: <BsJustify className="text-xl" />,
      className: editor.isActive({ textAlign: "justify" })
        ? "w-5 h-5 rounded-sm"
        : "w-5 h-5 rounded-sm",
      type: "justify",
    },
  ];
  return (
    <div className="relative flex items-center justify-center pr-1">
      {alignments.map((alignment, index) => (
        <>
          {alignment.type === selected && (
            <div
              className="flex items-center justify-center gap-x-0.5"
              onClick={() => setOpen(!open)}
            >
              <button key={index} className={alignment.className + "relative "}>
                {alignment.icon}
              </button>
              <BsChevronDown className=" text-[11px]" />
            </div>
          )}
        </>
      ))}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="absolute top-5 left-0 right-0 z-10  divide-y divide-black/10 rounded-md  bg-neutral-100 shadow-lg"
          >
            {alignments.map((alignment, index) => (
              <>
                {alignment.type !== selected && (
                  <div
                    className="flex items-center justify-center gap-x-0.5 px-2 py-2"
                    onClick={() => {
                      setSelected(alignment.type);
                      alignment.onClick();
                      setOpen(!open);
                    }}
                  >
                    <button
                      key={index}
                      className={alignment.className + "relative "}
                    >
                      {alignment.icon}
                    </button>
                  </div>
                )}
              </>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      Document,
      Paragraph,
      Text,
      Underline,
      TextAlign,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose  prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
    content: `<p>hi</p>`,
  });

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
};

function TextModifications({ editor }: { editor: Editor }) {
  const buttons = [
    {
      icon: <BsTypeBold className="text-xl" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      // disabled: !editor.can().chain().focus().toggleBold(),
      className: editor.isActive("bold")
        ? "bg-neutral-300 rounded-sm  w-5 h-5 flex items-center justify-center"
        : "rounded-sm  w-5 h-5 flex items-center justify-center",
    },
    {
      icon: <BsTypeItalic className="text-xl" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      // disabled: !editor.can().chain().focus().toggleItalic(),
      className: editor.isActive("italic")
        ? "bg-neutral-300 rounded-sm  w-5 h-5 flex items-center justify-center"
        : "rounded-sm  w-5 h-5 flex items-center justify-center",
    },
    {
      icon: <BsTypeStrikethrough className="text-xl" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      // disabled: !editor.can().chain().focus().toggleStrike(),
      className: editor.isActive("strike")
        ? "bg-neutral-300 rounded-sm  w-5 h-5 flex items-center justify-center"
        : "rounded-sm  w-5 h-5 flex items-center justify-center",
    },
    {
      icon: <BsTypeUnderline className="text-xl" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      // disabled: !editor.can().chain().focus().toggleUnderline(),
      className: editor.isActive("underline")
        ? "bg-neutral-300 rounded-sm  w-5 h-5 flex items-center justify-center"
        : "rounded-sm  w-5 h-5 flex items-center justify-center",
    },
  ];
  return (
    <div className="flex items-center justify-center gap-x-1 px-4 ">
      {buttons.map((button, index) => (
        <button
          key={`${index}`}
          onClick={button.onClick}
          // disabled={button.disabled}
          className={button.className}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
}

function TextTags({
  editor,
  selectedTag,
  setSelectedTag,
}: {
  editor: Editor;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
}) {
  const [selected, setSelected] = useState("Paragraph");
  const [open, setOpen] = useState(false);
  const tags = [
    {
      onClick: () => editor.chain().focus().setParagraph().run(),
      className: `${editor.isActive("paragraph") ? "" : ""}`,
      text: "Paragraph",
    },
    {
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      className: `${editor.isActive("heading", { level: 1 }) ? "" : ""}`,
      text: "Heading 1",
    },
    {
      onClick: () => {
        editor.chain().focus().toggleHeading({ level: 2 }).run();
      },
      className: `${editor.isActive("heading", { level: 2 }) ? "" : ""}`,
      text: "Heading 2",
    },
    {
      onClick: () => {
        editor.chain().focus().toggleHeading({ level: 3 }).run();
      },
      className: `${editor.isActive("heading", { level: 3 }) ? "" : ""}`,
      text: "Heading 3",
    },
    {
      onClick: () => {
        editor.chain().focus().toggleHeading({ level: 4 }).run();
      },
      className: `${editor.isActive("heading", { level: 4 }) ? "" : ""}`,
      text: "Heading 4",
    },
    {
      onClick: () => {
        editor.chain().focus().toggleHeading({ level: 5 }).run();
      },
      className: `${editor.isActive("heading", { level: 5 }) ? "" : ""}`,
      text: "Heading 5",
    },
    {
      onClick: () => {
        editor.chain().focus().toggleHeading({ level: 6 }).run();
      },
      className: `${editor.isActive("heading", { level: 6 }) ? "" : ""}`,
      text: "Heading 6",
    },
  ];
  return (
    <div className="relative px-4">
      {tags.map((tag) => (
        <>
          {selected === tag.text && (
            <div
              onClick={() => setOpen(!open)}
              className="relative flex items-center justify-center gap-x-0.5"
            >
              <button
                key={tag.text}
                className={
                  tag.className + "relative flex items-center justify-center"
                }
              >
                {tag.text}
              </button>
              <BsChevronDown className=" text-[11px]" />
            </div>
          )}
        </>
      ))}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="absolute top-10 right-0 divide-y  divide-black/10 rounded-md bg-neutral-100  shadow-md"
          >
            {tags.map((tag) => (
              <>
                {selected !== tag.text && (
                  <div
                    onClick={() => {
                      setSelected(tag.text);
                      tag.onClick();
                      setOpen(!open);
                    }}
                    className="relative flex items-center justify-center gap-x-0.5 px-3 py-1 "
                  >
                    <button
                      key={tag.text}
                      className={
                        tag.className +
                        "relative flex items-center justify-center "
                      }
                    >
                      {tag.text}
                    </button>
                  </div>
                )}
              </>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Tiptap;

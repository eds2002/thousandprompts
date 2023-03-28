import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import React, { useRef, useState } from "react";
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
  BsCodeSlash,
  BsJustify,
  BsTextCenter,
  BsTextLeft,
  BsTextRight,
  BsTypeBold,
  BsTypeItalic,
  BsTypeStrikethrough,
  BsTypeUnderline,
} from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "~/hooks/useClickOutside";
import { FaRedoAlt, FaUndoAlt } from "react-icons/fa";
import { AiOutlineUndo, AiOutlineRedo } from "react-icons/ai";

const MenuBar = ({ editor }: { editor: Editor }) => {
  const [selectedTag, setSelectedTag] = useState("Paragraph");
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col rounded-xl bg-neutral-100 md:flex-row  md:p-1">
      <div className="flex divide-x">
        <TextTags
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          editor={editor}
        />
        <TextModifications editor={editor} />
      </div>
      <div className="flex divide-x border-t md:border-t-0">
        <Col3 editor={editor} />
        <div className="flex items-center justify-center px-4">
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
        <div className="flex items-center justify-center px-4">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className={
              editor.isActive("codeBlock")
                ? "h-5 w-5 rounded-md"
                : "h-5 w-5 rounded-md"
            }
          >
            <AiOutlineUndo className="text-xl" />
          </button>
        </div>
        <div className="flex items-center justify-center px-4">
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className={
              editor.isActive("codeBlock")
                ? "h-5 w-5 rounded-md"
                : "h-5 w-5 rounded-md"
            }
          >
            <AiOutlineRedo className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Col3 = ({ editor }: { editor: Editor }) => {
  return (
    <div className="flex items-center justify-center gap-x-1 px-4">
      <TextAlignments editor={editor} />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList")
            ? "flex h-8  w-8 items-center justify-center rounded-md bg-neutral-200"
            : "flex  h-8 w-8 items-center justify-center rounded-sm"
        }
      >
        <MdFormatListBulleted className="text-xl" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive("orderedList")
            ? "flex h-8  w-8 items-center justify-center rounded-md bg-neutral-200"
            : "flex  h-8 w-8 items-center justify-center rounded-sm"
        }
      >
        <VscListOrdered className="text-xl" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={
          editor.isActive("blockquote")
            ? "flex h-8  w-8 items-center justify-center rounded-md bg-neutral-200"
            : "flex  h-8 w-8 items-center justify-center rounded-sm"
        }
      >
        <BsBlockquoteLeft className="text-xl" />
      </button>
    </div>
  );
};

const TextAlignments = ({ editor }: { editor: Editor }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("left");
  const listRef = useRef<HTMLDivElement>(null);
  const alignments = [
    {
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      icon: <BsTextLeft className="text-xl" />,
      className: editor.isActive({ textAlign: "left" })
        ? "w-8 h-8 rounded-sm"
        : "w-8 h-8 rounded-sm",
      type: "left",
    },
    {
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      icon: <BsTextCenter className="text-xl" />,
      className: editor.isActive({ textAlign: "center" })
        ? "w-8 h-8 rounded-sm"
        : "w-8 h-8 rounded-sm",
      type: "center",
    },
    {
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      icon: <BsTextRight className="text-xl" />,
      className: editor.isActive({ textAlign: "right" })
        ? "w-8 h-8 rounded-sm"
        : "w-8 h-8 rounded-sm",
      type: "right",
    },
    {
      onClick: () => editor.chain().focus().setTextAlign("justify").run(),
      icon: <BsJustify className="text-xl" />,
      className: editor.isActive({ textAlign: "justify" })
        ? "w-8 h-8 rounded-sm"
        : "w-8 h-8 rounded-sm",
      type: "justify",
    },
  ];

  useClickOutside(listRef, () => setOpen(false));

  return (
    <div className="relative z-20 flex items-center justify-center pr-1">
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
            className="absolute top-10 right-0 left-0 z-[50] min-w-full space-y-0.5  rounded-md bg-white p-1 shadow-xl"
            ref={listRef}
          >
            {alignments.map((alignment, index) => (
              <>
                <div
                  className={`relative flex items-center justify-center gap-x-0.5 rounded-md p-1 hover:bg-neutral-100 ${
                    selected === alignment.type ? "bg-neutral-100" : ""
                  }`}
                  onClick={() => {
                    setSelected(alignment.type);
                    alignment.onClick();
                    setOpen(!open);
                  }}
                >
                  <button
                    key={index}
                    className={
                      alignment.className +
                      "relative flex items-center justify-center"
                    }
                  >
                    {alignment.icon}
                  </button>
                </div>
              </>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Tiptap = ({
  setEditorContent,
  editorContent,
}: {
  setEditorContent: (val: string) => void;
  editorContent: string;
}) => {
  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      // TextStyle.configure({
      //   types: [ListItem.name],
      // }),
      Document,
      Paragraph,
      Text,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
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
        class: "prose",
      },
    },
    onUpdate({ editor }) {
      setEditorContent(JSON.stringify(editor.getHTML()));
    },
    content: editorContent
      ? (JSON.parse(editorContent) as string)
      : `<h1>My Amazing Story Title</h1><p>In this box, I will write the most amazing story people have every heard of. It will wow my readers into reading more of my stuff.</p><p>I can't wait to publish my new story. It will be amazing and everyone will love it.</p> <p>Yay</p>`,
  });

  const msg = editor?.getText();

  return (
    <>
      <MenuBar editor={editor as Editor} />
      <EditorContent
        editor={editor}
        className="text h-full  w-full  pt-10 pb-16 outline-none outline-0"
      />
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
        ? "bg-neutral-200 rounded-md  w-8 h-8 flex items-center justify-center"
        : "rounded-sm  w-8 h-8 flex items-center justify-center",
    },
    {
      icon: <BsTypeItalic className="text-xl" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      // disabled: !editor.can().chain().focus().toggleItalic(),
      className: editor.isActive("italic")
        ? "bg-neutral-200 rounded-md  w-8 h-8 flex items-center justify-center"
        : "rounded-sm  w-8 h-8 flex items-center justify-center",
    },
    {
      icon: <BsTypeStrikethrough className="text-xl" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      // disabled: !editor.can().chain().focus().toggleStrike(),
      className: editor.isActive("strike")
        ? "bg-neutral-200 rounded-md  w-8 h-8 flex items-center justify-center"
        : "rounded-sm  w-8 h-8 flex items-center justify-center",
    },
    {
      icon: <BsTypeUnderline className="text-xl" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      // disabled: !editor.can().chain().focus().toggleUnderline(),
      className: editor.isActive("underline")
        ? "bg-neutral-200 rounded-md  w-8 h-8 flex items-center justify-center"
        : "rounded-sm  w-8 h-8 flex items-center justify-center",
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

  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setOpen(false));

  return (
    <div className="relative flex items-center justify-center px-4">
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
            ref={containerRef}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="absolute top-10 left-0 z-20 min-w-full  space-y-0.5 rounded-xl  bg-white p-1 shadow-xl"
          >
            {tags.map((tag) => (
              <>
                <div
                  onClick={() => {
                    setSelected(tag.text);
                    tag.onClick();
                    setOpen(!open);
                  }}
                  className={`relative flex cursor-pointer items-center justify-center gap-x-0.5 rounded-lg px-4 py-1.5 hover:bg-neutral-100 ${
                    selected === tag.text ? "bg-neutral-100" : ""
                  }`}
                >
                  <button
                    key={tag.text}
                    className={
                      tag.className +
                      "relative flex items-center justify-center whitespace-nowrap"
                    }
                  >
                    {tag.text}
                  </button>
                </div>
              </>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Tiptap;

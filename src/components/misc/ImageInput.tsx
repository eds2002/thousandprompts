import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { MdRemove, MdUpload } from "react-icons/md";
import Button from "../ui/Button";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

function ImageInput({
  image,
  setImage,
  hideText = false,
  headingText,
  paragraphText,
  imageClassname,
  formClassname,
  labelClassname,
}: {
  image: string | Blob | null;
  setImage: (val: string | Blob | null) => void;
  hideText?: boolean;
  headingText?: string;
  paragraphText?: string;
  imageClassname?: string;
  formClassname?: string;
  labelClassname?: string;
}) {
  const [dragActive, setDragActive] = useState(false);
  // handle drag events
  const handleDrag = function (
    e: React.DragEvent<HTMLFormElement> | React.DragEvent<HTMLDivElement>
  ) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      if (
        e.target.files[0].type === "image/png" ||
        e.target.files[0].type === "image/jpeg" ||
        e.target.files[0].type === "image/webp"
      ) {
        // When all is good, display the image back to the user.
        setImage(e.target.files[0] as unknown as string);
      }
    }
  };

  const inputRef = useRef(null);
  const onButtonClick = () => {
    if (inputRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      inputRef.current.click();
    }
  };
  // triggers when file is dropped
  const handleDrop = function (
    e: React.DragEvent<HTMLFormElement> | React.DragEvent<HTMLDivElement>
  ) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (
        e.dataTransfer.files[0].type === "image/png" ||
        e.dataTransfer.files[0].type === "image/jpeg" ||
        e.dataTransfer.files[0].type === "image/webp"
      ) {
        // When all is good, display the image back to the user.a
        setImage(e.dataTransfer.files[0] as unknown as string);
      }
    }
  };
  return (
    <>
      {!hideText && <h2 className="mb-2 text-xl font-bold">Hero Image</h2>}
      <form
        className={`${twMerge(
          "relative mb-4 h-full overflow-hidden rounded-xl bg-neutral-100 p-4 lg:p-0",
          formClassname
        )}`}
        onDragEnter={(e) => handleDrag(e)}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={false}
          onChange={handleChange}
          accept="image/png, image/jpeg, image/webp"
          required
        />
        <label
          className={`${twMerge(
            "relative flex  h-full items-center justify-center rounded-xl border-2 border-dashed",
            labelClassname
          )}  `}
          htmlFor="input-file-upload"
        >
          <div className="flex max-w-xs flex-col items-center justify-center">
            <motion.div
              animate={{
                height: dragActive ? "50px" : "65px",
                width: dragActive ? "50px" : "65px",
              }}
              transition={{
                duration: 0.8,
                type: "spring",
                bounce: 0.6,
              }}
              className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-neutral-200 p-4"
            >
              <MdUpload className="text-6xl" />
            </motion.div>
            <p className="text-center font-medium">
              {headingText ?? "Drag and drop an image."}
            </p>
            <p className="text-center text-sm opacity-70">
              {paragraphText ??
                "Your posts will be private until you upload an image."}
            </p>
            <Button
              onClick={onButtonClick}
              className="mt-4 rounded-full bg-black px-4 py-1 text-white"
            >
              Pick a file
            </Button>
          </div>
        </label>
        {dragActive && (
          <div
            className="absolute inset-0 h-full w-full rounded-2xl"
            onDragEnter={(e) => handleDrag(e)}
            onDragLeave={(e) => handleDrag(e)}
            onDragOver={(e) => handleDrag(e)}
            onDrop={(e) => handleDrop(e)}
          ></div>
        )}
        {image && (
          <div className="absolute inset-0 bg-neutral-200">
            <div className="relative h-full w-full">
              <Image
                src={image instanceof Blob ? URL.createObjectURL(image) : image}
                alt="Selected image"
                fill
                className={`${twMerge("object-contain", imageClassname)} `}
              />
              <Button
                onClick={() => {
                  inputRef.current.value = "";
                  setImage(null);
                }}
                className="absolute bottom-4 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-white"
              >
                <MdRemove />
              </Button>
            </div>
          </div>
        )}
      </form>
    </>
  );
}

export default React.memo(ImageInput);

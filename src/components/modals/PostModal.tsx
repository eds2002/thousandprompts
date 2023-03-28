import { motion } from "framer-motion";
import { DateTime } from "luxon";
import React, { useRef, useState } from "react";
import { BsCheck, BsChevronRight } from "react-icons/bs";
import { useClickOutside } from "~/hooks/useClickOutside";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function PostModal({
  setState,
  handlePost,
  missing,
  isEditing,
}: {
  setState: (state: boolean) => void;
  handlePost: (val?: any) => void;
  missing: string[];
  isEditing: boolean;
}) {
  const [selectedPostOption, setSelectedPostOption] = useState("Now");
  const [scheduledPostDate, setScheduledPostDate] = useState("");
  const postOptions = ["Now", "Schedule"];

  // const [date, setDate];
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setState(false));
  return (
    <motion.div
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      animate={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      exit={{ backgroundColor: "rgba(0,0,0,0)" }}
      className="fixed inset-0 z-[50] flex items-center justify-center bg-black/50 "
    >
      <motion.div
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 25, opacity: 0 }}
        ref={ref}
        className="mx-auto w-screen max-w-xs rounded-xl bg-white p-4"
      >
        <h2 className="mb-2 text-xl font-bold">
          {isEditing ? "Save Changes" : "Publish"}
        </h2>
        <div className="space-y-1">
          {postOptions.map((option) => (
            <p
              key={option}
              onClick={() => setSelectedPostOption(option)}
              className={`flex cursor-pointer items-center justify-start gap-x-1 rounded-xl px-2 py-3 ${
                option === selectedPostOption
                  ? "bg-neutral-100"
                  : "hover:bg-neutral-100"
              } `}
            >
              <span
                className={`relative flex h-3 w-3  items-center justify-center rounded-full border border-black ${
                  option === selectedPostOption ? "bg-black" : ""
                }`}
              >
                {option === selectedPostOption && (
                  <BsCheck className="text-xs text-white" />
                )}
              </span>
              <span>{option}</span>
            </p>
          ))}
        </div>
        {selectedPostOption === "Schedule" && (
          <div className="mt-2 rounded-xl bg-neutral-100 p-4">
            <p className="mb-1.5  font-medium ">Schedule post</p>
            <Input
              value={scheduledPostDate}
              onChange={(e) => setScheduledPostDate(e.target.value)}
              type="datetime-local"
              className="w-full py-2"
            />
          </div>
        )}
        {missing.length > 0 && (
          <>
            <p>
              This post cannot be public since you are missing the following:
            </p>
            <div className="mt-2 space-y-1">
              {missing.map((missingDetails) => {
                switch (missingDetails) {
                  case "title":
                    return (
                      <p className="flex items-center justify-start text-sm text-red-400">
                        <span>
                          <BsChevronRight className="text-xs" />
                        </span>
                        <span>A title between 1-64 characters</span>
                      </p>
                    );
                  case "content":
                    return (
                      <p className="flex items-center justify-start text-sm text-red-400">
                        <span>
                          <BsChevronRight className="text-xs" />
                        </span>
                        <span>Content for your post</span>
                      </p>
                    );
                  case "image":
                    return (
                      <p className="flex items-center justify-start text-sm text-red-400">
                        <span>
                          <BsChevronRight className="text-xs" />
                        </span>
                        <span>A image for your post (png, jpg, or webp)</span>
                      </p>
                    );
                }
              })}
            </div>
          </>
        )}
        <Button
          disabled={
            (selectedPostOption === "Schedule" &&
              (scheduledPostDate === "" ||
                DateTime.fromISO(scheduledPostDate).valueOf() <
                  DateTime.now().valueOf())) ||
            missing.length > 0
          }
          onClick={() => {
            if (handlePost) {
              handlePost({
                postOption: selectedPostOption,
                scheduledPostDate,
                isPublic: true,
              });
            } else {
              setState(false);
            }
          }}
          className="mt-4 w-full rounded-xl border border-black bg-slate-900  px-4 py-2 font-medium text-white "
        >
          {isEditing ? "Save Changes" : "Publish"}
        </Button>
        <Button
          className="mt-2 w-full rounded-xl border-black px-4 py-2 font-medium hover:bg-neutral-200"
          style="outline"
          onClick={() => {
            if (handlePost) {
              handlePost({
                postOption: selectedPostOption,
                scheduledPostDate,
              });
            } else {
              setState(false);
            }
          }}
        >
          Save as draft
        </Button>
      </motion.div>
    </motion.div>
  );
}

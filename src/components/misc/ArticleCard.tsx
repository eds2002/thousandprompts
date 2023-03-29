import Link from "next/link";
import React from "react";
import Image from "next/image";
import { DateTime } from "luxon";
import Button from "../ui/Button";
import { BsArrowUpRight } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

export default function ArticleCard({
  postId,
  imgUrl,
  title,
  createdAt,
  includeAuthorImg,
  containerClassName,
}: {
  postId: string;
  imgUrl: string;
  title: string;
  createdAt: Date;
  includeAuthorImg?: string;
  containerClassName?: string;
}) {
  return (
    <Link
      className={`${twMerge(
        "relative h-full min-h-[250px] w-full rounded-xl bg-neutral-100 p-4",
        containerClassName
      )}`}
      href={`/journal/post/${postId}`}
    >
      <div className="absolute inset-0 rounded-xl">
        <Image
          src={imgUrl}
          fill
          alt={`image for ${title}`}
          className="h-full w-full rounded-xl object-cover"
        />
      </div>
      {/* Create a gradient for the background that goes from left to right, left being black and right being transparent, must be in tailwind */}
      <div className="absolute inset-0 flex items-end justify-start rounded-xl bg-gradient-to-r from-neutral-900/70 via-neutral-900/25 to-transparent p-4">
        <div>
          <p className="text-sm font-medium text-white opacity-70">
            {DateTime.fromJSDate(createdAt).toFormat("DD")}
          </p>
          <div className="mt-1 flex items-center gap-x-1">
            {includeAuthorImg && (
              <div className="relative flex h-6 w-6 gap-x-3 rounded-full">
                <Image
                  src={includeAuthorImg}
                  fill
                  className="rounded-full object-cover"
                  alt="Image of author"
                />
              </div>
            )}
            <p className="text-xl font-semibold text-white">{title}</p>
          </div>
          <Button className="mt-2 rounded-full  bg-white  p-2  text-black">
            <BsArrowUpRight className="" />
          </Button>
        </div>
      </div>
    </Link>
  );
}

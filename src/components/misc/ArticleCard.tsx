import Link from "next/link";
import React from "react";
import Image from "next/image";
import { DateTime } from "luxon";
import Button from "../ui/Button";
import { BsArrowUpRight } from "react-icons/bs";

export default function ArticleCard({
  postId,
  imgUrl,
  title,
  createdAt,
}: {
  postId: string;
  imgUrl: string;
  title: string;
  createdAt: Date;
}) {
  return (
    <Link
      className="relative h-full min-h-[250px] w-full rounded-xl bg-neutral-100 p-4"
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
          <p className="text-xl font-semibold text-white">{title}</p>
          <Button className="mt-2 rounded-full  bg-white  p-2  text-black">
            <BsArrowUpRight className="" />
          </Button>
        </div>
      </div>
    </Link>
  );
}

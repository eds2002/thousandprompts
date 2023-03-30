/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React from "react";
import Image from "next/image";
import { DateTime } from "luxon";
import Button from "../ui/Button";
import { BsArrowUpRight } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

// type Props<T extends boolean> = T extends true
//   ? {
//       loading?: boolean;
//       containerClassName: string;
//     }
//   : {
//       postId: string;
//       imgUrl: string;
//       title: string;
//       createdAt: Date;
//       includeAuthorImg: string;
//       containerClassName: string;
//     };

type Props =
  | ({ loading: true } & {
      postId?: never;
      imgUrl?: never;
      title?: never;
      createdAt?: never;
      includeAuthorImg?: never;
      containerClassName?: string;
    })
  | ({ loading: false } & {
      postId: string;
      imgUrl: string;
      title: string;
      createdAt: Date;
      includeAuthorImg: string;
      containerClassName: string;
    });

export default function ArticleCard({
  loading,
  postId,
  imgUrl,
  title,
  createdAt,
  includeAuthorImg,
  containerClassName,
}: Props) {
  function handleClick() {
    window.location = `/journal/post/${postId}` as unknown as Location;
  }

  return (
    <>
      {!loading ? (
        <div
          className={`${twMerge(
            "relative h-full min-h-[250px] w-full cursor-pointer rounded-xl bg-neutral-100 p-4",
            containerClassName
          )}`}
          onClick={handleClick}
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
        </div>
      ) : (
        <div
          className={`${twMerge(
            "relative h-full min-h-[250px] w-full rounded-xl bg-neutral-100 p-4",
            containerClassName
          )}`}
        >
          <div className="absolute inset-0 rounded-xl">
            <Image
              src="/placeholder.png"
              fill
              alt={`Placeholder image`}
              className="h-full w-full rounded-xl object-cover"
            />
          </div>
          {/* Create a gradient for the background that goes from left to right, left being black and right being transparent, must be in tailwind */}
          <div className="absolute inset-0 flex items-end justify-start rounded-xl bg-gradient-to-r from-neutral-900/70 via-neutral-900/25 to-transparent p-4">
            <div>
              <p className="w-max animate-pulse rounded-full bg-white text-sm font-medium text-white opacity-70">
                Mar 24, 2023
              </p>
              <div className="mt-1 flex items-center gap-x-1">
                {includeAuthorImg && (
                  <div className="relative flex h-6 w-6 gap-x-3 rounded-full">
                    <Image
                      src="/placeholder.png"
                      fill
                      className="rounded-full object-cover"
                      alt="Image of author"
                    />
                  </div>
                )}
                <p className="w-max animate-pulse rounded-full bg-white text-xl font-semibold text-white">
                  rounded-fullTitle
                </p>
              </div>
              <Button className="mt-2 animate-pulse  rounded-full  bg-white   p-2 text-white">
                <BsArrowUpRight className="" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

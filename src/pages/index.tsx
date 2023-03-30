import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import LayoutWidth from "~/components/ui/LayoutWidth";
import Image from "next/image";

import { api } from "~/utils/api";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import ArticleCard from "~/components/misc/ArticleCard";
import Header from "~/components/global/Header";

const Home: NextPage = () => {
  const router = useRouter();
  const { data, isLoading } = api.posts.getPosts.useQuery({ amount: null });

  const [animatedIndex, setAnimatedIndex] = useState(0);
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="h-full ">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <LayoutWidth className="pb-24">
              <div className="flex h-[90vh]    gap-x-2">
                {data?.map((data, index) => (
                  <>
                    {index < 1 && (
                      <motion.div
                        key={index}
                        onTap={() => setAnimatedIndex(index)}
                        onClick={() => {
                          void router.push(`/journal/post/${data!.id}`);
                        }}
                        className="flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-3xl"
                      >
                        <div className="relative flex-1 rounded-3xl bg-neutral-400">
                          {/* IMAGE */}
                          <Image
                            src={
                              data?.imageUrl
                                ? data.imageUrl
                                : "/placeholder.png"
                            }
                            fill
                            className={`object-cover ${
                              data?.imageUrl ? "opacity-100" : "opacity-20"
                            }`}
                            alt="placeholder image"
                          />
                          <motion.div
                            animate={{
                              opacity: animatedIndex === index ? 0 : 0.7,
                            }}
                            className="absolute inset-0 z-10 bg-black"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
                          <div className="absolute bottom-4 left-4 flex flex-col items-start">
                            <div className="cursor-auto rounded-full border-2 border-white py-1 px-4 font-medium text-white">
                              {data?.username}
                            </div>
                            <div className="mt-2 cursor-auto whitespace-nowrap  rounded-full bg-white px-4 py-1 font-medium">
                              {DateTime.fromJSDate(data!.createdAt).toFormat(
                                "DD"
                              )}
                            </div>
                            <div className="mt-4 w-screen max-w-xs text-3xl font-bold  text-white">
                              {data?.title}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                ))}
              </div>
            </LayoutWidth>
            <div className="bg-neutral-100 py-12 lg:py-24 ">
              <LayoutWidth className="px-0 lg:px-0">
                <h2 className="px-4 text-3xl font-bold lg:px-6">All posts</h2>
                <div className="flex w-full snap-x snap-proximity flex-col flex-nowrap gap-6 overflow-scroll py-2 px-4 md:flex-row md:px-0">
                  {data?.map((data, index) => (
                    <>
                      {index > 0 && (
                        <ArticleCard
                          createdAt={data!.createdAt}
                          imgUrl={data!.imageUrl}
                          postId={data!.id}
                          title={data!.title}
                          includeAuthorImg={data!.profilePic}
                          containerClassName="md:max-w-[300px] md:min-w-[300px] md:w-screen md:relative md:snap-center md:mx-4"
                          loading={false}
                        />
                      )}
                    </>
                  ))}
                </div>
              </LayoutWidth>
            </div>
          </>
        )}
      </main>
    </>
  );
};

const Loading = () => {
  return (
    <>
      <LayoutWidth>
        <div className="flex h-[85%]    gap-x-2">
          <motion.div className="flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-3xl">
            <div className="relative flex-1 rounded-3xl bg-neutral-400">
              {/* IMAGE */}
              <Image
                src="/placeholder.png"
                fill
                className="object-cover opacity-20"
                alt="placeholder image"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
              <div className="absolute bottom-4 left-4 flex flex-col items-start">
                <div className="animate-pulse cursor-auto rounded-full border-2 border-white bg-white py-1 px-4 font-medium  text-white ">
                  Author
                </div>
                <div className="mt-2 w-max animate-pulse  cursor-auto whitespace-nowrap rounded-full bg-white  px-4 py-1 font-medium text-white">
                  Mar 24, 2023
                </div>
                <div className="mt-4 w-max max-w-xs animate-pulse overflow-hidden  rounded-full bg-white text-3xl font-bold text-white">
                  A random title
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </LayoutWidth>
      <div className="bg-neutral-100 py-12 lg:py-24">
        <LayoutWidth className="px-0 lg:px-0">
          <h2 className="px-4 text-3xl font-bold lg:px-6">All posts</h2>
          <div className="flex w-full snap-x snap-proximity flex-col flex-nowrap gap-6 overflow-scroll py-2 px-4 md:flex-row md:px-0">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((data, index) => (
              <>
                {index > 0 && (
                  <ArticleCard
                    containerClassName="md:max-w-[600px] md:min-w-[600px] md:w-screen md:relative md:snap-center md:mx-4"
                    loading
                  />
                )}
              </>
            ))}
          </div>
        </LayoutWidth>
      </div>
    </>
  );
};

export default Home;

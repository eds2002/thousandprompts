import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { DateTime } from "luxon";
import { api, RouterOutputs } from "~/utils/api";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Link from "next/link";

const SelectedPost: NextPage<{ postId: number }> = ({ postId }) => {
  const { data } = api.posts.getById.useQuery({
    postId,
  });

  return (
    <>
      <Head>
        <title>Entry - {data?.post.title}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" min-h-screen ">
        <p>{data?.post.content}</p>
        <p>{data?.post.title}</p>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const postId = context.params?.postId;
  if (typeof postId !== "string") throw new Error("no slug");

  await ssg.posts.getById.prefetch({ postId: Number(postId) });

  return {
    props: { trpcState: ssg.dehydrate(), postId: Number(postId) },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SelectedPost;

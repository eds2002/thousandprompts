import { useUser } from "@clerk/nextjs";
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import Tiptap from "~/components/ui/Tiptap";
import LayoutWidth from "~/components/ui/LayoutWidth";
import Header from "~/components/global/Header";
import Input from "~/components/ui/Input";
import Button from "~/components/ui/Button";
import React, { useCallback, useState } from "react";
import { MdError } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { BsChevronRight, BsEye, BsFillEyeSlashFill } from "react-icons/bs";
import { supabase } from "~/utils/supabase";
import ErrorModal from "~/components/modals/ErrorModal";
import PostModal from "~/components/modals/PostModal";
import ImageInput from "~/components/misc/ImageInput";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { getAuth } from "@clerk/nextjs/server";
import { useRouter } from "next/router";

async function uploadImageToBucket({
  image,
  userId,
}: {
  image: string;
  userId: string;
}) {
  return await supabase.storage
    .from("journal-images")
    .upload(userId + "/" + crypto.randomUUID(), image);
}

function getImagePublicURL({ imagePath }: { imagePath: string }) {
  return supabase.storage.from("journal-images").getPublicUrl(imagePath);
}

const Create: NextPage<{ postId: string }> = ({ postId }) => {
  const router = useRouter();
  const { data } = api.posts.getById.useQuery({
    postId,
  });

  const { user } = useUser();
  const [image, setImage] = useState<string | null | Blob>(
    data?.post.imageUrl ?? null
  );
  const [title, setTitle] = useState<string>(data?.post.title ?? "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [textBoxContent, setTextBoxContent] = useState(
    data?.post.content ?? ""
  );
  const [isPublished, setIsPublished] = useState(data?.post.published ?? false);
  const [publishModal, setPublishModal] = useState(false);

  const {
    mutate: post,
    isLoading: isPublishing,
    variables,
  } = api.posts.create.useMutation({
    onSuccess: (e) => {
      if (e.redirectToPreview) {
        void router.push(`/journal/post/${e.id}?preview=true`);
      } else {
        void router.push(`/journal/post/${e.id}`);
      }
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.title;
      if (errorMessage && errorMessage[0]) {
        setErrorMessage(errorMessage[0]);
      } else {
        setErrorMessage(
          "Error in uploading your post, post will be saved as a draft."
        );
      }
    },
  });

  const { mutate: updatePost, isLoading: isUpdating } =
    api.posts.edit.useMutation({
      onSuccess: (e) => {
        if (e.redirectToPreview) {
          void router.push(`/journal/post/${e.id}?preview=true`);
        } else {
          void router.push(`/journal/post/${e.id}`);
        }
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.title;
        if (errorMessage && errorMessage[0]) {
          setErrorMessage(errorMessage[0]);
        } else {
          setErrorMessage(
            "Error in uploading your post, post will be saved as a draft."
          );
        }
      },
    });

  const handlePost = async ({
    postOption,
    scheduledPostDate,
    isPublic = false,
    redirectToPreview = false,
  }: {
    postOption: "Now" | "Schedule";
    scheduledPostDate: string;
    isPublic?: boolean;
    redirectToPreview?: boolean;
  }) => {
    if (postOption === "Now") {
      // Image cannot be null or undefined since error handling is done in the modal
      // User id cannot be null since page is protected
      if (!!postId) {
        let imageurl = image;

        // Handle uploading new image or reverting back to old image
        if (image instanceof Blob) {
          const { data, error } = await uploadImageToBucket({
            image: image as unknown as string,
            userId: user?.id as string,
          });
          if (error) throw new Error(error.message);
          const { data: imageData } = getImagePublicURL({
            imagePath: data.path,
          });
          imageurl = imageData.publicUrl;
        }
        updatePost({
          postId,
          content: textBoxContent,
          published: isPublic,
          title,
          imageUrl: imageurl as string,
          redirectToPreview,
        });
        return;
      }

      const { data, error } = await uploadImageToBucket({
        image: image as string,
        userId: user?.id as string,
      });
      if (error) throw new Error(error.message);
      const { data: imageData } = getImagePublicURL({ imagePath: data.path });
      post({
        content: textBoxContent,
        published: isPublic,
        title,
        imageUrl: imageData.publicUrl,
        redirectToPreview,
      });
      return;
    }
  };

  const isMissing = useCallback(() => {
    const missing = [];
    if (!title) missing.push("title");
    if (!image) missing.push("image");
    // Check if text box content is empty or null.
    if (
      !textBoxContent ||
      (JSON.parse(textBoxContent) as string).replace(/(<([^>]+)>)/gi, "") === ""
    )
      missing.push("content");
    return missing;
  }, [title, image, textBoxContent]);

  return (
    <>
      <Head>
        <title>My Journal</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="py-20 lg:h-[100dvh] lg:overflow-hidden lg:py-0 lg:pb-24">
        <Header
          forPage="create"
          headerStyle="lg:sticky fixed top-0 lg:top-0 bg-white z-50"
          setPublishState={setPublishModal}
          isEditing={!!postId}
          handlePreview={handlePost}
          currentPublishState={data?.post.published}
        />
        <LayoutWidth className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6 lg:overflow-hidden ">
          <TextArea
            setTextBoxContent={setTextBoxContent}
            textBoxContent={textBoxContent}
          />
          <PostDetails
            image={image}
            setImage={setImage}
            setTitle={setTitle}
            title={title}
            isPublished={isPublished}
            setIsPublished={setIsPublished}
          />
        </LayoutWidth>
      </main>
      <AnimatePresence>
        {errorMessage && (
          <ErrorModal setStateFn={() => setErrorMessage(null)} key="ErrorModal">
            <MdError className="text-5xl text-red-400" />
            <h1 className="mt-2 text-3xl font-semibold">We are so sorry</h1>
            <p className="mt-1">
              An error seems to have happened while posting. This usually
              doesn&apos;t happen. We will save your post as a draft.
            </p>
            <Button
              href="/journal"
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 text-white"
            >
              Take me back home
            </Button>
          </ErrorModal>
        )}
        {publishModal && (
          <PostModal
            key="PublishModal"
            setState={setPublishModal}
            missing={isMissing()}
            handlePost={handlePost}
            isEditing={!!postId}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const TextArea = ({
  setTextBoxContent,
  textBoxContent,
}: {
  setTextBoxContent: (val: string) => void;
  textBoxContent: string;
}) => {
  return (
    <div className="min-h-[50vh] lg:col-span-8 lg:overflow-y-scroll">
      <Tiptap
        editorContent={textBoxContent}
        setEditorContent={setTextBoxContent}
      />
    </div>
  );
};

const PostDetails = ({
  image,
  setImage,
  setTitle,
  title,
  isPublished,
  setIsPublished,
}: {
  image: string | Blob | null;
  setImage: (val: string | Blob | null) => void;
  setTitle: (val: string) => void;
  title: string;
  isPublished: boolean;
  setIsPublished: (val: boolean) => void;
}) => {
  return (
    <aside className="row-start-1 h-full rounded-lg pt-4 lg:col-span-4 lg:row-start-auto lg:bg-neutral-100 lg:px-4 lg:pb-16 ">
      <PostVisibilityStatus
        isPublished={isPublished}
        setIsPublished={setIsPublished}
      />
      <TitleInput title={title} setTitle={setTitle} />
      <ImageInput image={image} setImage={setImage} />
    </aside>
  );
};

function PostVisibilityStatus({
  isPublished,
  setIsPublished,
}: {
  isPublished: boolean;
  setIsPublished: (val: boolean) => void;
}) {
  return (
    <motion.div
      animate={{
        backgroundColor: isPublished ? "rgb(22,163,74)" : "rgb(2,132,199)",
      }}
      className="relative mb-4 rounded-lg"
    >
      <p className="flex w-[90%] items-center gap-x-3  px-4 py-3 text-white">
        {isPublished ? (
          <>
            <BsEye className="text-3xl" />
            <span className=" font-medium">
              This post will be visible to everyone.
            </span>
          </>
        ) : (
          <>
            <BsFillEyeSlashFill className="text-3xl" />
            <span className="font-medium">
              This post will only be visible to you.
            </span>
          </>
        )}
      </p>
      <div
        className="absolute right-0 top-0 bottom-0 cursor-pointer p-2"
        onClick={() => setIsPublished(!isPublished)}
      >
        <div className="flex h-full items-center justify-center rounded-xl bg-black/20 px-2 text-white">
          <BsChevronRight className="" />
        </div>
      </div>
    </motion.div>
  );
  if (isPublished) {
  } else {
    return (
      <div className="mb-4 rounded-lg bg-blue-600">
        <p className="flex items-center gap-x-3 px-4 py-3 text-white">
          <BsFillEyeSlashFill className="text-3xl" />
          <span className="font-medium">Only you can view this post.</span>
        </p>
      </div>
    );
  }
}

function TitleInput({
  title,
  setTitle,
}: {
  title: string;
  setTitle: (val: string) => void;
}) {
  return (
    <div className="w-full ">
      <h2 className="mb-2 text-xl font-bold">Title</h2>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Socks are the best. Heres why."
        className=" w-full rounded-xl"
        required
        error={title.length > 64}
      />
      <p className="relative mb-4 inline-block  text-sm font-medium">{`${title.length}/64`}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const { userId } = getAuth(req);
  const ssg = generateSSGHelper();
  const postId = query.p as string | null;

  if (postId) {
    const post = await ssg.posts.getById.fetch({ postId });
    if (post.post.authorId !== userId) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }
  }

  return {
    props: { trpcState: ssg.dehydrate(), postId: postId || null },
  };
};

export default Create;

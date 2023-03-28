import { useClerk, UserProfile, useUser } from "@clerk/nextjs";
import { users } from "@clerk/nextjs/dist/api";
import React, { useRef, useState } from "react";
import ImageInput from "~/components/misc/ImageInput";
import { api } from "~/utils/api";
import Image from "next/image";
import Header from "~/components/global/Header";
import Input from "~/components/ui/Input";
import Button from "~/components/ui/Button";
import { supabase } from "~/utils/supabase";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "~/hooks/useClickOutside";

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

export default function UserProfilePage() {
  const [modal, setModal] = useState({ isSuccess: false, open: false });
  // create an async function
  const { user } = useUser();

  const { mutate: updateBio } = api.user.updateBio.useMutation({
    onSuccess() {
      setModal({ isSuccess: true, open: true });
    },
    onError() {
      setModal({ isSuccess: false, open: true });
    },
  });
  const { mutate: updateBanner } = api.user.updateBanner.useMutation({
    onSuccess() {
      setModal({ isSuccess: true, open: true });
    },
    onError() {
      setModal({ isSuccess: false, open: true });
    },
  });

  const [image, setImage] = useState<string | Blob | null>(
    (user?.publicMetadata?.bannerURL as string) ?? null
  );
  const [bio, setBio] = useState<string>(
    (user?.publicMetadata.bio as string) ?? ""
  );

  const handlePost = async () => {
    if (user?.publicMetadata.bannerImage !== image || image !== null) {
      const { data, error } = await uploadImageToBucket({
        image: image as unknown as string,
        userId: user?.id as string,
      });
      if (error) throw new Error(error.message);
      const { data: imageData } = getImagePublicURL({
        imagePath: data.path,
      });
      // User id cannot be null since we are in the settings page
      updateBanner({
        publicMetaData: {
          bio: (user?.publicMetadata?.bio as string) ?? "",
          bannerURL: imageData.publicUrl,
        },
        userId: user?.id as string,
      });
    }

    if (bio !== user?.publicMetadata.bio && bio !== "") {
      // User id cannot be null since we are in the settings page
      updateBio({
        userId: user?.id as string,
        publicMetaData: {
          bio,
          bannerURL: (user?.publicMetadata?.bannerURL as string) ?? "",
        },
      });
    }
  };

  return (
    <>
      <div className=" h-full w-full bg-white pb-24">
        <Header />
        <div className="mx-auto h-[35vh] max-w-7xl  px-4 ">
          <div className="relative h-full rounded-xl bg-neutral-100 p-4">
            <div className="relative z-10 h-full w-full">
              <ImageInput
                headingText="A banner image (optional)"
                image={image}
                setImage={setImage}
                hideText
                paragraphText="Show off a bit more of your personality through pictures."
                imageClassname="object-cover"
              />
            </div>
            <div className="absolute inset-0 ">
              <Image
                src="/placeholder.png"
                alt="Placeholder image"
                fill
                className="h-full w-full object-cover opacity-5"
              />
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl">
          <div className="p-4">
            <h1 className="max-w-xs text-3xl font-semibold">
              Change or edit your details here.
            </h1>
          </div>
          <div className="px-4">
            <h2 className="font-medium">A short bio of yourself</h2>
            <Input
              placeholder="I am a writer based in New York City."
              className="mt-2 w-full max-w-[500px] rounded-xl bg-neutral-100"
              value={bio ?? ""}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>
        <UserProfile
          routing="path"
          path="/user"
          appearance={{
            elements: {
              profilePage__security: {
                display: "none",
              },
              pageScrollBox: "overflow-visible p-4",
              scrollBox: "w-full max-w-7xl mx-auto shadow-none h-full ",
              rootBox:
                "shadow-none pb-12  flex items-center justify-center w-screen ",
              card: "max-w-full rounded-none h-full w-full bg-white shadow-none",
              navbarButton__security: {
                display: "none",
              },
              navbar: {
                display: "none",
              },
              navbarMobileMenuButton: {
                display: "none",
              },
              header: "md:col-span-2 hidden",
              profileSection: "w-full bg-neutral-100 rounded-xl p-4 md:my-0",
              profilePage__account: "md:grid-cols-2 md:grid ",
              profileSectionTitle: {
                borderWidth: 0,
              },
              profileSectionContent: "bg-neutral-200  rounded-xl",
            },
          }}
        />
        <div className="mx-auto w-full max-w-7xl px-4 ">
          <Button
            onClick={handlePost}
            disabled={
              (user?.publicMetadata.bannerImage === image || image === null) &&
              (bio === user?.publicMetadata.bio || bio === "")
            }
            className="w-full rounded-xl bg-black py-4 px-24 text-white sm:float-right sm:w-auto"
          >
            Save changes
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {modal.open && (
          <SuccessModal
            isSuccess={modal.isSuccess}
            closeFn={() => setModal((val) => ({ ...val, open: false }))}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function SuccessModal({
  isSuccess,
  closeFn,
}: {
  isSuccess: boolean;
  closeFn: () => void;
}) {
  const ref = useRef(null);
  useClickOutside(ref, () => closeFn());
  return (
    <motion.div
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      animate={{ backgroundColor: "rgba(0,0,0,0.8)" }}
      exit={{ backgroundColor: "rgba(0,0,0,0)" }}
      className="fixed inset-0 z-[50] flex items-center justify-center"
    >
      <motion.div
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 25, opacity: 0 }}
        ref={ref}
        className="mx-auto w-screen max-w-md rounded-xl bg-white p-4"
      >
        <h4 className="text-2xl font-semibold md:text-3xl">
          {isSuccess
            ? "Your changes have been saved!"
            : "Something went wrong, please try again."}
        </h4>
        <p className="mt-2 text-base lg:text-lg">
          {isSuccess
            ? "Looking great! In order to see your changes you must refresh your page."
            : "This usually  doesn't happen, we're so sorry to keep you waiting. Please try again later."}
        </p>
        <Button
          onClick={() => closeFn()}
          className="mt-6 w-full rounded-xl bg-black p-4 text-white"
        >
          Great, thanks
        </Button>
      </motion.div>
    </motion.div>
  );
}

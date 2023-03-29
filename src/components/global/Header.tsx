import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import Button from "../ui/Button";
import LayoutWidth from "../ui/LayoutWidth";
import Image from "next/image";
import { BsArrowLeft } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/router";
import Link from "next/link";

type HeaderStyles = "create" | "default" | "post-preview";

export default function Header({
  forPage = "default",
  headerStyle,
  setPublishState,
  isEditing,
  handlePreview,
  postId,
  currentPublishState,
}: {
  forPage?: HeaderStyles;
  headerStyle?: string;
  setPublishState?: (val?: any) => void;
  isEditing?: boolean;
  handlePreview?: (val?: any) => void;
  postId?: string;
  currentPublishState?: boolean;
}) {
  const links = ["Home", "New", "About us"];
  const { isSignedIn, user } = useUser();
  return (
    <>
      {forPage === "default" && (
        <header className={`${twMerge("w-full py-2.5", headerStyle)}`}>
          <LayoutWidth className="flex items-center justify-between">
            <Link href="/" className="flex-1 text-xl font-semibold">
              Logo
            </Link>
            <nav className="hidden flex-1 items-center justify-center md:flex">
              {links.map((link) => (
                <li
                  className="mx-1 list-none whitespace-nowrap px-4 font-medium"
                  key={link}
                >
                  {link}
                </li>
              ))}
            </nav>
            <div className="flex flex-1 items-center justify-end gap-x-3">
              {isSignedIn ? (
                <Button href={`/author/${user?.username ?? ""}`}>
                  <Image
                    src={user.profileImageUrl}
                    width={100}
                    height={100}
                    alt={`${user.username ?? "my"}'s profile image`}
                    className="h-12 w-12 rounded-full"
                  />
                </Button>
              ) : (
                <>
                  <SignInButton />
                  <Button className="rounded-full bg-black px-4 py-2 font-medium text-white">
                    <SignUpButton />
                  </Button>
                </>
              )}
            </div>
          </LayoutWidth>
        </header>
      )}
      {forPage === "create" && (
        <CreatorHeading
          headerStyle={headerStyle}
          setPublishState={setPublishState}
          isEditing={isEditing}
          handlePreview={handlePreview}
          currentPublishState={currentPublishState}
        />
      )}
      {forPage === "post-preview" && (
        <PostPreview postId={postId} headerStyle={headerStyle} />
      )}
    </>
  );
}

const CreatorHeading = ({
  headerStyle,
  setPublishState,
  isEditing,
  handlePreview,
  currentPublishState,
}: {
  headerStyle?: string;
  setPublishState?: (val?: boolean) => void;
  isEditing?: boolean;
  handlePreview?: (val?: any) => void;
  currentPublishState?: boolean;
}) => {
  return (
    <header className={`${twMerge("w-full py-4", headerStyle)}`}>
      <LayoutWidth className="flex items-center justify-between">
        <div className="flex items-center justify-center">
          <Button className="flex items-center justify-center p-1">
            <BsArrowLeft className="text-2xl" />
          </Button>
          <Link href="/" className="flex-1 text-xl font-semibold">
            Logo
          </Link>
        </div>
        <div className="relative flex items-center justify-center gap-x-3">
          <Button
            onClick={() => {
              if (handlePreview) {
                handlePreview({
                  postOption: "Now",
                  redirectToPreview: true,
                  isPublic: currentPublishState,
                });
              }
            }}
          >
            Preview
          </Button>
          <Button
            onClick={() => {
              if (setPublishState) {
                setPublishState(true);
              }
            }}
            style="outline"
            className="bg-black py-1 text-white"
          >
            {isEditing ? "Save" : "Publish"}
          </Button>
        </div>
      </LayoutWidth>
    </header>
  );
};

const PostPreview = ({
  headerStyle,
  postId,
}: {
  headerStyle?: string;
  postId?: string;
}) => {
  const router = useRouter();
  return (
    <header className={`${twMerge("w-full py-4", headerStyle)}`}>
      <LayoutWidth className="flex items-center justify-between">
        <div
          onClick={() =>
            router.push(`/journal/create${postId ? `?p=${postId}` : ""} `)
          }
          className="flex cursor-pointer items-center justify-center"
        >
          <Button className="flex items-center justify-center p-1">
            <BsArrowLeft className="text-2xl" />
          </Button>
          <p className="flex-1 text-xl font-semibold">Back to editing</p>
        </div>
      </LayoutWidth>
    </header>
  );
};

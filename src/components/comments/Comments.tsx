import { useUser } from "@clerk/nextjs";
import React, { useCallback, useRef, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Image from "next/image";
import type { User } from "@clerk/nextjs/dist/api";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { DateTime } from "luxon";
import { FaEllipsisH, FaUser } from "react-icons/fa";
import { BsBackspace, BsChevronDown, BsPencil } from "react-icons/bs";
import { useClickOutside } from "~/hooks/useClickOutside";
import { useRouter } from "next/router";

type UserComment = RouterOutputs["comments"]["getByPostId"][number];

interface Comment extends UserComment {
  replies?: UserComment[];
}

export default function Comments({ postId }: { postId: string }) {
  const { data: postComments, isLoading } = api.comments.getByPostId.useQuery({
    postId,
  });
  const formatComments = useCallback(() => {
    return (
      postComments
        ?.filter((comment) => !comment.replyId)
        .map((comments) => ({
          ...comments,
          replies: postComments?.filter(
            (reply) => reply.replyId === comments.id
          ),
        })) ?? []
    );
  }, [postComments]);

  if (isLoading) return <Loading />;

  return (
    <div className="mt-12  ">
      <h2>{postComments?.length ?? 0} comments</h2>
      <CreateComment postId={postId} />
      <div className="mt-6 space-y-4">
        {formatComments().length > 0 ? (
          <>
            {formatComments()?.map((comment) => (
              <CommentContainer
                userDisplay={comment}
                key={comment.id}
                postId={postId}
              />
            ))}
          </>
        ) : (
          <div className="flex w-full items-center justify-center py-48 text-center">
            Be the first to comment.
          </div>
        )}
      </div>
    </div>
  );
}

const CommentContainer = ({
  userDisplay,
  postId,
}: {
  userDisplay: Comment;
  postId: string;
}) => {
  const [expandReplies, setExpandReplies] = useState(false);
  return (
    <>
      <CommentDisplay
        postId={postId}
        userDisplay={userDisplay}
        setExpandReplies={setExpandReplies}
        totalReplies={userDisplay.replies?.length ?? 0}
      />
      {expandReplies && (
        <div className="pl-6">
          {userDisplay?.replies?.map((reply: Comment) => (
            <CommentDisplay
              key={reply.id}
              postId={postId}
              userDisplay={reply}
            />
          ))}
        </div>
      )}
    </>
  );
};

const CreateComment = ({
  userData,
  isReply,
  closeFn,
  postId,
  edit,
}: {
  userData?: User;
  isReply?: string | null;
  closeFn?: () => void;
  postId: string;
  edit?: Comment;
}) => {
  const ctx = api.useContext();
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const [comment, setComment] = useState(edit?.content ?? "");
  const { user, isSignedIn } = useUser();

  const { mutate: postComment, isLoading: isPosting } =
    api.comments.create.useMutation({
      onSuccess: () => {
        void ctx.comments.getByPostId.invalidate();
        if (closeFn) {
          closeFn();
        }
        setIsFocused(false);
        setComment("");
      },
      onError: (e) => {
        throw new Error(e.message);
      },
    });

  const { mutate: editComment, isLoading: isEditing } =
    api.comments.edit.useMutation({
      onSuccess: () => {
        void ctx.comments.getByPostId.invalidate();
        if (closeFn) {
          closeFn();
        }
        setIsFocused(false);
      },
      onError: (e) => {
        throw new Error(e.message);
      },
    });

  return (
    <>
      {/* User is logged in */}
      {!!user && !!isSignedIn && (
        <>
          {edit ? (
            <div className="mt-4 flex items-start justify-start gap-x-3">
              <div
                className={`relative rounded-full bg-neutral-200 ${
                  isReply ? "h-6 w-6" : "h-10 w-10"
                }`}
              >
                <Image
                  src={user.profileImageUrl}
                  alt="My profile image"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div className="w-full flex-1">
                <Input
                  placeholder="Add a comment..."
                  className="w-full rounded-none border-b border-black border-black/25 bg-transparent p-0 text-sm transition focus:border-black"
                  onFocus={() => setIsFocused(true)}
                  value={comment}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      editComment({
                        id: edit.id,
                        content: comment,
                      });
                    }
                  }}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="mt-1 flex items-center justify-end gap-x-3">
                  <Button
                    className="text-sm"
                    onClick={() => {
                      if (closeFn) {
                        closeFn();
                      }
                      setIsFocused(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      editComment({
                        id: edit.id,
                        content: comment,
                      })
                    }
                    isLoading={isEditing}
                    disabled={comment === "" || isEditing}
                    className="rounded-full bg-black px-3 py-1.5 text-sm text-white"
                    style="primary"
                  >
                    {isReply ? "Reply" : edit ? "Save" : "Comment"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex items-start justify-start gap-x-3">
              <UserProfileImage
                username={user.username!}
                profileLink={user.profileImageUrl}
              />
              <div className="w-full flex-1">
                <Input
                  placeholder="Add a comment..."
                  className="w-full rounded-none border-b border-black border-black/25 bg-transparent p-0 text-sm transition focus:border-black"
                  onFocus={() => setIsFocused(true)}
                  onKeyUp={(e) => {
                    if (e.key === "Enter" && comment !== "") {
                      postComment({
                        content: comment,
                        postId: postId,
                        username: user.username!,
                        replyId: isReply ?? null,
                        userId: user.id,
                      });
                    }
                  }}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                {(isReply || isFocused) && (
                  <div className="mt-1 flex items-center justify-end gap-x-3">
                    <Button
                      className="text-sm"
                      onClick={() => {
                        if (closeFn) {
                          closeFn();
                        }
                        setIsFocused(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() =>
                        postComment({
                          content: comment,
                          postId: postId,
                          username: user.username!,
                          replyId: isReply ?? null,
                          userId: user.id,
                        })
                      }
                      isLoading={isPosting}
                      disabled={comment === "" || isPosting}
                      className="rounded-full bg-black px-3 py-1.5 text-sm text-white"
                      style="primary"
                    >
                      {isReply ? "Reply" : "Comment"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* If user is not logged in  */}
      {!user && !isSignedIn && (
        <div className="mt-4 flex items-start justify-start gap-x-3">
          <UserProfileImage username="" profileLink="" />
          <div className="w-full flex-1">
            <Input
              onFocus={() => router.push("/login")}
              placeholder="Add a comment..."
              className="w-full rounded-none border-b border-black border-black/25 bg-transparent p-0 text-sm transition focus:border-black"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            {(isReply || isFocused) && (
              <div className="mt-1 flex items-center justify-end gap-x-3">
                <Button
                  className="text-sm"
                  onClick={() => {
                    if (closeFn) {
                      closeFn();
                    }
                    setIsFocused(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => alert("not logged in")}
                  isLoading={isPosting}
                  disabled={comment === "" || isPosting}
                  className="rounded-full bg-black px-3 py-1.5 text-sm text-white"
                  style="primary"
                >
                  {isReply ? "Reply" : "Comment"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const CommentDisplay = ({
  userDisplay,
  postId,
  setExpandReplies,
  totalReplies,
}: {
  userDisplay: Comment | null;
  postId: string;
  setExpandReplies?: (value?: any) => void;
  totalReplies?: number;
}) => {
  const [isReply, setIsReply] = useState<null | string>();
  const [openSettings, setOpenSettings] = useState(false);
  const [edit, setEdit] = useState(false);
  const { user } = useUser();

  return (
    <>
      {!!userDisplay && (
        <>
          {edit ? (
            <CreateComment
              edit={userDisplay}
              postId={userDisplay.postId}
              closeFn={() => {
                setOpenSettings(false);
                setEdit(false);
              }}
            />
          ) : (
            <div className="">
              <div className="flex gap-x-2">
                <UserProfileImage
                  username={userDisplay.user?.username as string}
                  profileLink={userDisplay.user?.profilePic as string}
                />
                <div className="w-full flex-1">
                  <UsernameAndSettingsDisplay
                    username={userDisplay.user?.username as string}
                    createdAt={userDisplay.createdAt}
                    editedAt={userDisplay.updatedAt}
                    setOpenSettings={setOpenSettings}
                    openSettings={openSettings}
                    setEdit={setEdit}
                    commentId={userDisplay.id}
                  />
                  <p className="text-sm">{userDisplay.content}</p>
                  <div className="flex gap-x-6">
                    {totalReplies !== 0 && setExpandReplies && (
                      <Button
                        onClick={() =>
                          setExpandReplies((prev: boolean) => !prev)
                        }
                        className="m-0 flex cursor-pointer items-center justify-center gap-x-1 text-sm"
                      >
                        {totalReplies} replies <BsChevronDown />
                      </Button>
                    )}
                    <Button
                      onClick={() =>
                        setIsReply(userDisplay.replyId ?? userDisplay.id)
                      }
                      className="m-0 rounded-full p-1 text-sm font-medium hover:bg-neutral-200"
                    >
                      Reply
                    </Button>
                  </div>
                  {isReply && (
                    <CreateComment
                      postId={postId}
                      isReply={isReply}
                      closeFn={() => setIsReply(null)}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Loading components */}
      {!userDisplay && (
        <div className="">
          <div className="flex gap-x-2">
            <div className="h-12 w-12 animate-pulse rounded-full bg-neutral-200" />
            <div className="w-full flex-1">
              <p className="w-max animate-pulse rounded-full bg-neutral-200 text-sm">
                <span className="font-medium opacity-0">Username </span>
                <span className="opacity-0">fromToday()</span>
              </p>
              <p className="mt-0.5 w-max animate-pulse rounded-full bg-neutral-200 text-sm">
                <span className=" opacity-0">
                  A comment with absolutly no meaning, this is just a
                  placeholder.
                </span>
              </p>
              <div className="m-0 mt-0.5 w-max animate-pulse rounded-full bg-neutral-200 p-1 text-sm font-medium">
                <span className=" opacity-0">Reply</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const UsernameAndSettingsDisplay = ({
  commentId,
  username,
  createdAt,
  editedAt,
  setOpenSettings,
  openSettings,
  setEdit,
}: {
  commentId: string;
  username: string;
  createdAt: Date;
  editedAt: Date;
  setOpenSettings: (val: boolean) => void;
  openSettings: boolean;
  setEdit: (val: boolean) => void;
}) => {
  const ctx = api.useContext();
  const editContainer = useRef(null);
  const { user } = useUser();
  useClickOutside(editContainer, () => setOpenSettings(false));
  const { mutate: deletePost } = api.comments.delete.useMutation({
    onSuccess: () => {
      setOpenSettings(false);
      void ctx.comments.getByPostId.invalidate();
    },
    onError: (err) => {
      alert("error deleting comment");
    },
  });
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm">
        <span className="font-medium">{username} </span>
        <span className="opacity-70">
          {DateTime.fromJSDate(createdAt).toRelative()}
        </span>
        {DateTime.fromJSDate(createdAt).valueOf() !==
          DateTime.fromJSDate(editedAt).valueOf() && (
          <span className="opacity-70">(Edited)</span>
        )}
      </p>
      {user?.username === username && (
        <div className="relative">
          <FaEllipsisH
            onClick={() => setOpenSettings(!openSettings)}
            className="cursor-pointer p-2 text-3xl"
          />
          {openSettings && (
            <div
              ref={editContainer}
              className="absolute  top-5 right-0 w-[150px] rounded-xl bg-neutral-100  shadow-xl"
            >
              <div className="flex flex-col gap-1 py-2">
                <Button
                  onClick={() => setEdit(true)}
                  className="flex w-full items-center justify-start  gap-x-2 rounded-md px-2 py-1.5 text-sm hover:bg-neutral-200"
                >
                  <BsPencil className="text-lg" />
                  Edit
                </Button>
                <Button
                  onClick={() => deletePost({ id: commentId })}
                  className="flex w-full items-center justify-start  gap-x-2 rounded-md px-2 py-1.5 text-sm hover:bg-neutral-200"
                >
                  <BsBackspace className="text-lg" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Loading = () => (
  <div>
    <CreateComment postId={""} />
    <div className="mt-6 space-y-4">
      {[0, 1, 2, 3, 4, 5].map((val) => (
        <CommentDisplay postId={""} key={val} userDisplay={null} />
      ))}
    </div>
  </div>
);

const UserProfileImage = ({
  profileLink,
  username,
}: {
  profileLink: string;
  username: string;
}) => (
  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200">
    {profileLink ? (
      <Image
        src={profileLink}
        fill
        className="relative rounded-full object-cover"
        alt={`${username}'s profile image`}
      />
    ) : (
      <FaUser />
    )}
  </div>
);

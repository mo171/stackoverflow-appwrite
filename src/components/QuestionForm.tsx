/**
 * This component provides a form for creating and updating questions.
 * It handles title, content (via RTE), image attachments (Appwrite Storage),
 * and tag management.
 */

"use client";

import RTE from "@/components/RTE";
import Meteors from "@/components/magicui/meteors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import slugify from "@/utils/slugify";
import { IconX } from "@tabler/icons-react";
import { Models, ID } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";
import { databases, storage } from "@/models/client/config";
import {
  db,
  questionAttachmentBucket,
  questionCollection,
} from "@/models/name";
import { Confetti } from "@/components/magicui/confetti";

/**
 * A helper component to wrap input fields with a label and a background effect.
 */
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col space-y-2 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 p-6",
        className
      )}
    >
      <Meteors number={30} />
      {children}
    </div>
  );
};

const QuestionForm = ({ question }: { question?: Models.Document }) => {
  const { user } = useAuthStore();
  const [tag, setTag] = React.useState(""); // Temporary state for the tag currently being typed
  const router = useRouter();

  // --- Main Form State ---
  const [formData, setFormData] = React.useState({
    title: String(question?.title || ""),
    content: String(question?.content || ""),
    authorId: user?.$id,
    tags: new Set((question?.tags || []) as string[]), // Use a Set to ensure tags are unique
    attachment: null as File | null, // Stores the image file selected by the user
  });

  const [loading, setLoading] = React.useState(false); // Controls the submit button state
  const [error, setError] = React.useState(""); // Stores any error messages to display

  /**
   * Triggers a confetti animation on the screen.
   * Useful for celebrating a successful post!
   *
   * @param timeInMS - Duration of the confetti effect.
   */
  const loadConfetti = (timeInMS = 3000) => {
    const end = Date.now() + timeInMS;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      Confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      Confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  /**
   * Logic for creating a NEW question.
   * First uploads the image, then creates the database document.
   */
  const create = async () => {
    if (!formData.attachment) throw new Error("Please upload an image");

    // 1. Upload the image to Appwrite Storage
    const storageResponse = await storage.createFile(
      questionAttachmentBucket,
      ID.unique(),
      formData.attachment
    );

    // 2. Create the question document in the database
    const response = await databases.createDocument(
      db,
      questionCollection,
      ID.unique(),
      {
        title: formData.title,
        content: formData.content,
        authorId: formData.authorId,
        tags: Array.from(formData.tags), // Convert Set back to Array for Appwrite
        attachmentId: storageResponse.$id,
      }
    );

    loadConfetti();

    return response;
  };

  /**
   * Logic for UPDATING an existing question.
   * Handles optional re-upload of a new image.
   */
  const update = async () => {
    if (!question) throw new Error("Please provide a question");

    // Handle image update: if a new file is selected, delete the old one and upload the new one
    const attachmentId = await (async () => {
      if (!formData.attachment) return question?.attachmentId as string;

      // Delete the old file first to save space
      await storage.deleteFile(questionAttachmentBucket, question.attachmentId);

      // Upload the new file
      const file = await storage.createFile(
        questionAttachmentBucket,
        ID.unique(),
        formData.attachment
      );

      return file.$id;
    })();

    // Update the document in the database
    const response = await databases.updateDocument(
      db,
      questionCollection,
      question.$id,
      {
        title: formData.title,
        content: formData.content,
        authorId: formData.authorId,
        tags: Array.from(formData.tags),
        attachmentId: attachmentId,
      }
    );

    return response;
  };

  /**
   * Main form submission handler.
   */
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.content || !formData.authorId) {
      setError(() => "Please fill out all fields");
      return;
    }

    setLoading(() => true);
    setError(() => "");

    try {
      // Determine whether we are updating or creating
      const response = question ? await update() : await create();

      // Redirect to the newly created/updated question page
      router.push(`/questions/${response.$id}/${slugify(formData.title)}`);
    } catch (error: any) {
      setError(() => error.message);
    }

    setLoading(() => false);
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      {/* Error Message Display */}
      {error && (
        <LabelInputContainer>
          <div className="text-center">
            <span className="text-red-500">{error}</span>
          </div>
        </LabelInputContainer>
      )}

      {/* Title Input Section */}
      <LabelInputContainer>
        <Label htmlFor="title" className="text-black">
          Title Address
          <br />
          <small className="text-neutral-500">
            Be specific and imagine you&apos;re asking a question to another
            person.
          </small>
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
          type="text"
          className="text-black bg-white border-neutral-300"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </LabelInputContainer>

      {/* Content / Rich Text Editor Section */}
      <LabelInputContainer>
        <Label htmlFor="content" className="text-black">
          What are the details of your problem?
          <br />
          <small className="text-neutral-500">
            Introduce the problem and expand on what you put in the title.
            Minimum 20 characters.
          </small>
        </Label>
        <div
          data-color-mode="light"
          className="rounded-md border border-neutral-300 overflow-hidden"
        >
          <RTE
            value={formData.content}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, content: value || "" }))
            }
          />
        </div>
      </LabelInputContainer>

      {/* Image Upload Section */}
      <LabelInputContainer>
        <Label htmlFor="image" className="text-black">
          Image
          <br />
          <small className="text-neutral-500">
            Add image to your question to make it more clear and easier to
            understand.
          </small>
        </Label>
        <Input
          id="image"
          name="image"
          accept="image/*"
          placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
          type="file"
          className="text-black bg-white border-neutral-300"
          onChange={(e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            setFormData((prev) => ({
              ...prev,
              attachment: files[0],
            }));
          }}
        />
      </LabelInputContainer>

      {/* Tags Section */}
      <LabelInputContainer>
        <Label htmlFor="tag" className="text-black">
          Tags
          <br />
          <small className="text-neutral-500">
            Add tags to describe what your question is about. Start typing to
            see suggestions.
          </small>
        </Label>
        <div className="flex w-full gap-4">
          <div className="w-full">
            <Input
              id="tag"
              name="tag"
              placeholder="e.g. (java c objective-c)"
              type="text"
              className="text-black bg-white border-neutral-300"
              value={tag}
              onChange={(e) => setTag(() => e.target.value)}
            />
          </div>
          <button
            className="relative shrink-0 rounded-full border border-orange-200 bg-orange-600 px-8 py-2 text-sm text-white transition duration-200 hover:bg-orange-700"
            type="button"
            onClick={() => {
              if (tag.length === 0) return;
              setFormData((prev) => ({
                ...prev,
                tags: new Set([...Array.from(prev.tags), tag]),
              }));
              setTag(() => "");
            }}
          >
            {/* Fancy top line effect */}
            <div className="absolute inset-x-0 -top-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-orange-300 to-transparent shadow-2xl" />
            <span className="relative z-20">Add</span>
          </button>
        </div>

        {/* Displaying Added Tags */}
        <div className="flex flex-wrap gap-2">
          {Array.from(formData.tags).map((tag, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="group relative inline-block rounded-full bg-neutral-100 p-px text-xs font-semibold leading-6 text-neutral-700 no-underline shadow-sm border border-neutral-200">
                <div className="relative z-10 flex items-center space-x-2 rounded-full bg-white px-4 py-0.5 border border-neutral-100">
                  <span>{tag}</span>
                  <button
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        tags: new Set(
                          Array.from(prev.tags).filter((t) => t !== tag)
                        ),
                      }));
                    }}
                    type="button"
                    className="hover:text-red-500"
                  >
                    <IconX size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </LabelInputContainer>

      {/* Submit Button */}
      <button
        className="inline-flex h-12 items-center justify-center rounded-md border border-orange-200 bg-orange-600 px-6 font-medium text-white transition-colors hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        type="submit"
        disabled={loading}
      >
        {question ? "Update" : "Publish"}
      </button>
    </form>
  );
};

export default QuestionForm;

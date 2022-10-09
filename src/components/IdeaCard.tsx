import { Idea } from "@prisma/client";
import Link from "next/link";
import { UseTRPCMutationResult } from "@trpc/react/shared";

const IdeaCard = ({
  idea,
  deleteIdeaMutation,
  rateIdeaMutation,
}: {
  idea: Idea;
  deleteIdeaMutation: UseTRPCMutationResult<any, any, any, any>;
  rateIdeaMutation: UseTRPCMutationResult<any, any, any, any>;
  refetch: any;
}) => {
  const getPrefix = () => {
    if (idea.rating > 0) return "+";
    else if (idea.rating < 0) return "-";
    return " ";
  };
  const getTextColor = () => {
    if (idea.rating > 0) return "text-emerald-500";
    else if (idea.rating < 0) return "text-red-400";
    return "text-gray-400";
  };

  const handleDelete = () => {
    deleteIdeaMutation.mutate(idea.id);
  };

  const handleRate = (type: string) => {
    if (!["like", "dislike"].includes(type)) return;

    rateIdeaMutation.mutate({ id: idea.id, type });
  };

  return (
    <div
      key={idea.id}
      className="my-4 flex h-min  w-full max-w-md items-start rounded-md bg-slate-200 px-4 py-2"
    >
      <div className="flex h-max w-min flex-col items-end justify-center">
        <button
          onClick={() => handleRate("like")}
          className="py-1 text-emerald-500 transition-colors duration-200 hover:text-emerald-600"
        >
          <span className="material-symbols-outlined">thumb_up</span>
        </button>
        <button
          onClick={() => handleRate("dislike")}
          className=" text-emerald-500 transition-colors duration-200 hover:text-emerald-600"
        >
          <span className="material-symbols-outlined">thumb_down</span>
        </button>
      </div>

      {/* Center */}
      <div className="w-grow flex flex-grow flex-col items-start px-4 text-emerald-900">
        <div className="flex">
          <Link href={`/${idea.slug}`}>
            <h4 className="cursor-pointer text-xl font-semibold hover:underline">
              {idea.title}{" "}
            </h4>
          </Link>
          <span className={`px-2 text-lg font-bold ${getTextColor()}`}>
            {getPrefix()}
            {Math.abs(idea.rating)}
          </span>
        </div>
        <p className="w-full py-2">{idea.description}</p>
      </div>
      {/* Right */}
      <div className="flex w-min flex-col items-end justify-between border-2 ">
        <button
          onClick={handleDelete}
          className="text-emerald-500 transition-colors duration-200 hover:text-emerald-600"
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    </div>
  );
};

export default IdeaCard;

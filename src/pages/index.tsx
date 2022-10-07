/* eslint-disable @typescript-eslint/no-explicit-any */
import AddIdeaForm from "../components/AddIdeaForm";
import Head from "next/head";
import { Idea } from "@prisma/client";
import IdeaCard from "../components/IdeaCard";
import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useState } from "react";

type PageContentTypes = {
  data: Idea[];
  refetch: any;
};

const RenderServerState = ({
  load,
  error,
}: {
  load: boolean;
  error: boolean;
}) => {
  const getStateMessage = () => {
    if (load) return "Loading...";
    if (error) return "Error";

    return "";
  };

  return <h1 className="py-10 text-3xl text-red-400">{getStateMessage()}</h1>;
};

const PageContent = ({ data, refetch }: PageContentTypes) => {
  const [shouldShowInputForm, setShouldShowInputForm] = useState(false);

  const deleteIdeaMutation = trpc.idea.deleteIdea.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await refetch();
    },
  });
  const addIdeaMutation = trpc.idea.deleteIdea.useMutation();
  const rateIdeaMutation = trpc.idea.rateIdea.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await refetch();
    },
  });

  const toggleInputForm = () => setShouldShowInputForm(!shouldShowInputForm);

  const viewTitle = shouldShowInputForm ? "Add Idea" : "Project Ideas";

  const IdeaList = data.map((idea) => (
    <IdeaCard
      idea={idea}
      deleteIdeaMutation={deleteIdeaMutation}
      rateIdeaMutation={rateIdeaMutation}
      refetch={refetch}
      key={idea.id}
    />
  ));

  const buttonColor = shouldShowInputForm
    ? "bg-red-400 text-red-800"
    : "bg-emerald-400 text-emerald-800";

  return (
    <>
      <button
        onClick={toggleInputForm}
        className={`fixed left-10 bottom-10 z-10 rounded-md px-3 py-2 font-semibold ${buttonColor}`}
      >
        {shouldShowInputForm ? "Cancel" : "Add Idea"}
        {/* Add Idea */}
      </button>
      <h3 className="py-4 text-xl font-semibold  text-emerald-800 underline sm:text-2xl">
        {viewTitle}
      </h3>
      {shouldShowInputForm ? (
        <AddIdeaForm
          refetch={refetch}
          addIdeaMutation={addIdeaMutation}
          toggleScreen={toggleInputForm}
        />
      ) : (
        <>
          <div className="flex w-full flex-col items-center">{IdeaList}</div>
        </>
      )}
    </>
  );
};

const Home: NextPage = () => {
  // const  = trpc.example.hello.useQuery({ text: "from tRPC" });
  const { data, isLoading, isError, refetch } = trpc.idea.getAllIdeas.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <>
      <Head>
        <title>497s Ideas</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </Head>

      <main className="flex min-h-screen w-full flex-col items-center bg-slate-100 py-10 px-4">
        <h1 className="py-4 text-3xl font-black text-emerald-500 sm:text-5xl">
          Blazingly Fast 497s
        </h1>
        {isLoading || isError ? (
          <RenderServerState load={isLoading} error={isError} />
        ) : (
          <PageContent data={data} refetch={refetch} />
        )}
      </main>
    </>
  );
};

export default Home;

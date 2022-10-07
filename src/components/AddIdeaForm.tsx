import { UseTRPCMutationResult } from "@trpc/react/shared";
import { trpc } from "../utils/trpc";
import { useState } from "react";

const y_padding = 4;
const border_style = "rounded-md border-2 border-emerald-400";
const input_style = "py-1 px-2 text-lg";

type AddIdeaFormPageProps = {
  refetch: any;
  addIdeaMutation: UseTRPCMutationResult<any, any, any, any>;
  toggleScreen: () => void;
};

type IdeaFormType = {
  title: string;
  description: string;
};

const defaultForm = {
  title: "",
  description: "",
};

type formPropTypes = "title" | "description";

const validateFormData = ({ title, description }: IdeaFormType) => {
  return title && description && title.length > 0 && description.length > 0;
};

function AddIdeaForm({
  refetch,
  addIdeaMutation,
  toggleScreen,
}: AddIdeaFormPageProps) {
  const mutation = trpc.idea.submitIdea.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await refetch();
    },
  });
  const [ideaForm, setIdeaForm] = useState<IdeaFormType>({ ...defaultForm });

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    type: formPropTypes
  ) => {
    const handlers = {
      title: () => {
        setIdeaForm({ ...ideaForm, title: event.target.value });
      },
      description: () => {
        setIdeaForm({ ...ideaForm, description: event.target.value });
      },
    };

    handlers[type] && handlers[type]();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const submitData = async () => {
      if (!validateFormData(ideaForm)) return;
      await mutation.mutateAsync(ideaForm);
    };
    const clearForm = () => {
      setIdeaForm({ ...defaultForm });
      toggleScreen();
    };

    e.preventDefault();
    submitData();
    clearForm();
  };

  const Divider = () => <div className={`py-${y_padding}`}></div>;
  return (
    <form
      onSubmit={handleSubmit}
      className=" flex w-4/5 max-w-sm flex-col items-center py-2"
    >
      <input
        onChange={(e) => handleInputChange(e, "title")}
        value={ideaForm.title}
        type="text"
        className={`${border_style} ${input_style} w-full bg-slate-200/50`}
      />
      <Divider />
      <textarea
        onChange={(e) => handleInputChange(e, "description")}
        value={ideaForm.description}
        className={`${border_style} ${input_style} h-32 w-full bg-slate-200/50`}
      ></textarea>
      <Divider />
      <button className={` w-32 ${border_style} bg-slate-200/50`}>
        Submit
      </button>
    </form>
  );
}

export default AddIdeaForm;

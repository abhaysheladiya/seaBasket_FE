import { Spinner } from "@/components/ui/spinner";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spinner className="w-16 h-16 text-emerald-500" />
    </div>
  );
};

export default Loading;

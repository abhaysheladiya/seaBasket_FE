import { Spinner } from "@/components/ui/spinner";

const GlobalLoading = () => {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-gray-950/45 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-xl border border-white/30 bg-white/90 px-5 py-3 shadow-xl">
        <Spinner className="size-5 text-gray-600" />
        <p className="text-sm font-semibold text-gray-700">Loading page...</p>
      </div>
    </div>
  );
};

export default GlobalLoading;
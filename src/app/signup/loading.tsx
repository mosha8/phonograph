const Loading = () => {
  return (
    <div className="h-screen content-center bg-background">
      <div className="min-w-[578px] h-[734px] bg-white border border-light rounded-lg shadow-lg p-32 max-w-fit mx-auto space-y-8 mt-12">
        <div className="w-80 h-14 rounded-lg bg-zinc-400 animate-pulse" />
        <div className="flex flex-col items-center gap-y-8 py-12">
          <div className="w-80 h-10 rounded-lg bg-zinc-400 animate-pulse" />
          <div className="w-80 h-10 rounded-lg bg-zinc-400 animate-pulse" />
        </div>
        <div className="w-80 h-12 rounded-lg bg-zinc-400 animate-pulse" />
      </div>
    </div>
  );
};
export default Loading;

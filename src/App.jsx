import { RouterProvider } from "react-router-dom";
import { appRouter } from "./routes/routes";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="font-play  bg-[#0D0B21] ">
      <Toaster richColors containerClassName="overflow-auto" />
      <RouterProvider
        key="default" // Ensures re-render when settings change
        router={appRouter}
      />
    </div>
  );
}

export default App;

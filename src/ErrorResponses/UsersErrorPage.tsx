import { useRouteError, useNavigate } from "react-router-dom";
import { LuServerOff } from "react-icons/lu";
import { RiWifiOffLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";

const UsersErrorPage = () => {
  const error = useRouteError() as { message?: string }; // Explicitly type the error object
  const navigate = useNavigate(); // Hook to programmatically navigate

  console.log(error?.message);
  console.log(navigator.onLine);

  const handleRetry = () => {
    if (navigator.onLine) {
      navigate(0); // Refresh the current route without a full reload
    } else {
      alert("You are still offline. Please check your internet connection.");
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 w-full h-full flex-col p-16">
      {navigator.onLine ? (
        error?.message === "Network Error" ? (
          <>
            <h2 className="text-5xl text-orange-500">
              <LuServerOff />
            </h2>
            <h1>Server Connection Error</h1>
          </>
        ) : (
          <>
            <h1>Dang!</h1>
          </>
        )
      ) : (
        <>
          <h2 className="text-5xl text-red-500">
            <RiWifiOffLine />
          </h2>
          <h1>No Internet Connection</h1>
        </>
      )}

      <Button
        className="cursor-pointer mt-4"
        variant={"secondary"}
        onClick={handleRetry}
      >
        Try Again
      </Button>
    </div>
  );
};

export default UsersErrorPage;

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import { IoTrashBin } from "react-icons/io5";
import { getUserFavorites, removeFavorites } from "@/backend_api/favorites";
import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaStar } from "react-icons/fa"; // Importing the star icon
import { ActionFunction, Form } from "react-router-dom";
export const loader = async () => {
  const user = localStorage.getItem("user");
  const userData: any = JSON.parse(user as any);

  const favorites = await getUserFavorites(userData.id);
  return { userData, favorites };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries()
  );

  const removedFavorites = await removeFavorites(data);
  return removedFavorites;
};

const Favorites = () => {
  const { favorites, userData } = useLoaderData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState<any>(null);

  const handleRemoveClick = (favorite: any) => {
    setSelectedFavorite(favorite);
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full h-full p-4">
      {favorites.length === 0 ? ( // Check if favorites array is empty
        <div className="flex items-center justify-center text-gray-500">
          <FaStar className="mr-2" /> {/* Star icon */}
          <span>Your favorites list is empty. Add some favorites!</span>
        </div>
      ) : (
        favorites.map((favorite: any) => (
          <Card
            key={favorite?._id}
            className="dark:bg-[#303030] mt-4 bg-slate-100"
          >
            <CardHeader>
              <CardTitle>{favorite.thesisId?.thesisTitle}</CardTitle>
              <CardDescription>
                Authors:{" "}
                <span className="font-bold">
                  {favorite.thesisId?.students
                    .map((student: any) => student.lastname)
                    .join(", ")}
                </span>
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex gap-3 justify-end items-center">
              <button
                type="button" // Changed from "submit" to "button"
                onClick={() => handleRemoveClick(favorite)}
                className="flex cursor-pointer text-sm items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                <span>Remove as favorite</span>
                <IoTrashBin />
              </button>

              <button
                onClick={() => {}}
                className="flex cursor-pointer text-sm items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                <span>Download</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            </CardFooter>
          </Card>
        ))
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this thesis from your favorites?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
            </DialogClose>
            <Form method="post">
              <input type="hidden" name="userId" value={userData.id} />
              <input
                type="hidden"
                name="thesisId"
                value={selectedFavorite?.thesisId?._id}
              />{" "}
              {/* Fixed reference to selectedFavorite */}
              <button
                type="submit"
                className="flex cursor-pointer text-sm items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                <span>Remove</span>
              </button>
            </Form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Favorites;

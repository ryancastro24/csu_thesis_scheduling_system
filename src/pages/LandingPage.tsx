import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import { Form, useLoaderData, ActionFunction } from "react-router-dom";
import { getApprovedThesisDocuments } from "@/backend_api/thesisDocument";
import {
  addFavorites,
  getUserFavorites,
  removeFavorites,
} from "@/backend_api/favorites";
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

export const loader = async () => {
  const user = localStorage.getItem("user");
  const userData: any = JSON.parse(user as any);
  const thesisDocuments = await getApprovedThesisDocuments();
  const favorites = await getUserFavorites(userData.id);
  return { userData, thesisDocuments, favorites };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries()
  );
  console.log("submitted data:", data);
  if (data?.action === "add") {
    const favorites = await addFavorites(data);

    return favorites;
  }

  if (data?.action === "remove") {
    const favorites = await removeFavorites(data);
    return favorites;
  }
};

const LandingPage = () => {
  const { userData, thesisDocuments, favorites } = useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedThesis, setSelectedThesis] = useState<any>(null);

  const handleStarClick = (thesis: any) => {
    setSelectedThesis(thesis);
    setIsDialogOpen(true);
  };

  const isFavorite = (thesisId: string) => {
    return favorites.some(
      (favorite: any) => favorite.thesisId?._id === thesisId
    );
  };

  const handleDownload = (documentLink: string) => {
    window.open(documentLink, "_blank");
  };

  return (
    <div className="w-full h-full flex flex-col gap-10 p-4">
      <div className="grid grid-cols-3 gap-5">
        {thesisDocuments.slice(0, 3).map((thesis: any) => (
          <Card
            key={thesis?._id}
            className="dark:bg-[#303030] bg-slate-100 flex flex-col h-full"
          >
            <CardHeader className="flex-1">
              <CardTitle className="line-clamp-2">
                {thesis?.thesisTitle}
              </CardTitle>

              <CardDescription>
                Authors:{" "}
                <span className="font-bold">
                  {thesis?.students
                    .map((student: any) => student.lastname)
                    .join(", ")}
                </span>
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between items-center mt-auto">
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handleStarClick(thesis)}
                  className="text-2xl cursor-pointer transition-colors"
                >
                  {isFavorite(thesis?._id) ? (
                    <FaStar className="text-yellow-500" />
                  ) : (
                    <FaRegStar className="text-gray-400" />
                  )}
                </button>
                <span className="mt-1">{thesis?.ratingCount || 0}</span>
              </div>
              <button
                onClick={() => handleDownload(thesis.documentLink)}
                className="flex text-sm items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
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
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <h2>Available Thesis</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search thesis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full max-w-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {thesisDocuments.slice(3).map((thesis: any) => (
          <Card
            key={thesis._id}
            className="dark:bg-[#303030] bg-slate-100 flex flex-col"
          >
            <CardHeader className="flex-1">
              <CardTitle className="text-sm line-clamp-2">
                {thesis.thesisTitle}
              </CardTitle>
              <CardDescription>
                Authors:{" "}
                <span className="font-bold">
                  {thesis.students
                    .map((student: any) => student.lastname)
                    .join(", ")}
                </span>
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between items-center pt-0">
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handleStarClick(thesis)}
                  className="text-2xl cursor-pointer hover:text-yellow-500 transition-colors"
                >
                  {isFavorite(thesis._id) ? (
                    <FaStar className="text-yellow-500" />
                  ) : (
                    <FaRegStar className="text-gray-400" />
                  )}
                </button>
                <span className="mt-1">{thesis.ratingCount || 0}</span>
              </div>
              <button
                onClick={() => handleDownload(thesis.documentLink)}
                className="flex text-xs items-center gap-1 px-2 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                <span>Download</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
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
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {isFavorite(selectedThesis?._id || "")
                ? "Remove from Favorites"
                : "Add to Favorites"}
            </DialogTitle>
            <DialogDescription>
              {isFavorite(selectedThesis?._id || "")
                ? "Are you sure you want to remove this thesis from your favorites?"
                : "Are you sure you want to add this thesis to your favorites?"}
            </DialogDescription>
          </DialogHeader>
          {isFavorite(selectedThesis?._id || "") ? (
            <Form method="post">
              <input type="hidden" name="userId" value={userData.id} />
              <input
                type="hidden"
                name="thesisId"
                value={selectedThesis?._id}
              />
              <input type="hidden" name="action" value="remove" />
              <DialogFooter className="flex gap-2">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 cursor-pointer"
                >
                  Remove
                </Button>
              </DialogFooter>
            </Form>
          ) : (
            <Form method="post">
              <input type="hidden" name="userId" value={userData.id} />
              <input
                type="hidden"
                name="thesisId"
                value={selectedThesis?._id}
              />
              <input type="hidden" name="action" value="add" />
              <DialogFooter className="flex gap-2">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 cursor-pointer"
                >
                  Add to favorites
                </Button>
              </DialogFooter>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;

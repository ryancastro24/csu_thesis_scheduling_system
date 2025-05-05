import { useState, ChangeEvent, useEffect, useRef } from "react";
import { toast } from "sonner";
import { RiEdit2Fill, RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Form,
  ActionFunction,
  useLoaderData,
  useActionData,
} from "react-router-dom";
import { updateUserProfile } from "@/backend_api/users";
import { getUserProfile } from "@/backend_api/users";
export const loader = async () => {
  const user = localStorage.getItem("user");
  const userData: any = JSON.parse(user as any);

  const userProfile = await getUserProfile(userData.id);
  return { userData, userProfile };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries()
  );

  const updatedProfile = await updateUserProfile(data.userId, formData);

  return { updatedProfile };
};

const ManageProfile = () => {
  const { userData, userProfile } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profile, setProfile] = useState({
    photo: userData.photo || "",
    email: userData.email || "",
    password: "",
    confirmPassword: "",
  });
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (actionData?.updatedProfile && !hasShownToast.current) {
      if (actionData.updatedProfile.message) {
        toast.success(actionData.updatedProfile.message, {
          style: {
            backgroundColor: "green",
            color: "white",
            border: "none",
            fontSize: "16px",
          },
        });
      } else if (actionData.updatedProfile.error) {
        toast.error(actionData.updatedProfile.error, {
          style: {
            backgroundColor: "red",
            color: "white",
            border: "none",
            fontSize: "16px",
          },
        });
      }
      hasShownToast.current = true;
    }
  }, [actionData]);

  console.log("user profile", userData.profilePicture);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-full p-4 flex flex-col gap-10">
      {/* Profile Section */}
      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          {/* Profile Image */}
          <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden group">
            {userProfile.profilePicture ? (
              <img
                src={userProfile.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-gray-500">
                No Image
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div className="flex flex-col gap-2">
            <h1 className="text-xl">
              Name: {userData.firstname} {userData.middlename.charAt(0)}.{" "}
              {userData.lastname}
            </h1>
            <h2 className="text-xs dark:text-[#ffffff91]">
              {userData.id_number} | {userData.userType}
            </h2>
            <h2 className="text-xs dark:text-[#ffffff91]">{userData.email}</h2>
          </div>
        </div>

        {/* Edit Profile Button */}
        <Button
          className="cursor-pointer dark:bg-[#121212]"
          variant="outline"
          onClick={() => setIsEditOpen(true)}
        >
          <RiEdit2Fill /> Edit Profile
        </Button>
      </div>

      {/* Charts Section */}
      <div className="flex  flex-col gap-10">
        <h2>Profile Details</h2>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-10">
            <span className="text-sm ">
              <strong>Id Number: </strong> {userData.id_number}
            </span>
          </div>
          <div className="flex items-center gap-10">
            <span className="text-sm ">
              <strong>Department Code: </strong> {userData.departmentAcronym}
            </span>
          </div>
          <div className="flex items-center gap-10">
            <span className="text-smt">
              <strong>Department: </strong> {userData.departmentName}
            </span>
          </div>

          <div className="flex items-center gap-10">
            <span className="text-sm ">
              <strong>Role: </strong>
              {userData.userType}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <Form
            method="post"
            encType="multipart/form-data"
            className="space-y-6"
          >
            {/* Profile Picture Upload (Rounded & Centered) */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden group border border-gray-300 dark:border-gray-600">
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : userProfile.profilePicture ? (
                  <img
                    src={userProfile.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                    No Image
                  </div>
                )}

                {/* Edit Icon on Hover */}
                <label
                  htmlFor="photoUploadModal"
                  className="absolute inset-0 bg-[#121212] bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <RiEdit2Fill className="text-white text-lg" />
                  <input
                    type="file"
                    name="file"
                    id="photoUploadModal"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
            </div>

            {/* Email Input */}

            <Input type="hidden" name="userId" value={userData.id} />
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
              />
            </div>

            {/* Password Input with Toggle */}
            <div className="relative">
              <Label htmlFor="password">Old Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="oldPassword"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute cursor-pointer right-1 top-6"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
              </Button>
            </div>

            {/* Confirm Password Input with Toggle */}
            <div className="relative">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                type={showConfirmPassword ? "text" : "password"} // Use showPassword for both fields
                id="newPassword"
                name="newPassword"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 cursor-pointer top-6"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <RiEyeOffFill /> : <RiEyeFill />}
              </Button>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant={"outline"}
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600"
              >
                {navigation.state === "submitting" ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageProfile;

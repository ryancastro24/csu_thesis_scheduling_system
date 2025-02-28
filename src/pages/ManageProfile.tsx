import { useState, ChangeEvent } from "react";
import ProfilePieChart from "@/systemComponents/ProfilePieChart";
import { ProfileBarChart } from "@/systemComponents/ProfileBarChart";
import { RiEdit2Fill, RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Ensure you have a utility function for conditional classNames

interface Profile {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  photo: string | null;
}

const ManageProfile = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    name: "Juan Dela Cruz",
    email: "juan123@gmail.com",
    password: "",
    confirmPassword: "",
    photo: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile picture upload
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile((prev) => ({
        ...prev,
        photo: URL.createObjectURL(file),
      }));
    }
  };

  return (
    <div className="w-full h-full p-4 flex flex-col gap-10">
      {/* Profile Section */}
      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          {/* Profile Image */}
          <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden group">
            {profile.photo ? (
              <img
                src={profile.photo}
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
            <h1 className="text-xl">Name: {profile.name}</h1>
            <h2 className="text-xs dark:text-[#ffffff91]">
              211-02048 | CCIS Instructor I
            </h2>
            <h2 className="text-xs dark:text-[#ffffff91]">{profile.email}</h2>
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
      <div className="grid grid-cols-2 gap-10 pb-10">
        <ProfilePieChart />
        <ProfileBarChart />
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Profile Picture Upload (Rounded & Centered) */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden group border border-gray-300 dark:border-gray-600">
                {profile.photo ? (
                  <img
                    src={profile.photo}
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
                    id="photoUploadModal"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
            </div>

            {/* Email Input */}
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
              <Label htmlFor="password">New Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={profile.password}
                onChange={handleInputChange}
                className=""
              />
              <Button
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
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={profile.confirmPassword}
                onChange={handleInputChange}
                className=""
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 cursor-pointer top-6"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <RiEyeOffFill /> : <RiEyeFill />}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant={"outline"} onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => setIsEditOpen(false)}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageProfile;

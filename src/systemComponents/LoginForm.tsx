import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
const baseAPI = import.meta.env.VITE_BACKEND_API_ENDPOINT;
import bg from "@/assets/bg.png";
import csulogo from "@/assets/3dlogo.png";
console.log(baseAPI);
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Form,
  ActionFunction,
  useNavigation,
  useActionData,
} from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { login } from "@/backend_api/auth";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"; // Import Dialog component
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";

import axios from "axios";
import { addUsertData } from "@/backend_api/users";
import { useFetcher } from "react-router-dom";
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries()
  );

  console.log(data);
  if (data.submitTransaction === "addUser") {
    const addUser = await addUsertData(data);

    console.log("add user action function", addUser);
    return addUser;
  }

  if (data.submitTransaction === "login") {
    const userData = await login(data);
    return userData;
  }
};

export function LoginForm({}: React.ComponentPropsWithoutRef<"div">) {
  const fetcher = useFetcher();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [sentOtpLoading, setSentOtpLoading] = useState(false);
  const navigation = useNavigation();
  const actionData = useActionData();
  const [resetEmail, setResetEmail] = useState("");
  const [departments, setDepartments] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetPasswordFlag, setResetPasswordFlag] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [signupErrorMessage, setSignupErrorMessage] = useState<string | null>(
    null
  );

  console.log(signupErrorMessage);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog
  const [otpVerification, setOtpVerification] = useState(""); // New state for OTP
  const [otVerified, setOtpVerified] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [newpassword, setNewPassword] = useState("");
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [otpSentMessage, setOtpSentMessage] = useState(false);
  const [otpSentErrorMessage, setOtpSentErrorMessage] = useState(false);
  const [otpVerifiedMessage, setOtpVerifiedMessage] = useState(false);
  const [otpVerifiedErrorMessage, setOtpVerifiedErrorMessage] = useState(false);
  const [changePasswordMessage, setChangePasswordMessage] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState(false);
  console.log(otpVerification);
  const [newUser, setNewUser] = useState<{
    firstname: string;
    middlename: string;
    lastname: string;
    suffix: string;
    email: string;
    id_number: string;
    departmentId: string;
    userType: string;
    username: string;
    password: string;
    submitTransaction: string;
  }>({
    firstname: "",
    middlename: "",
    lastname: "",
    suffix: "",
    email: "",
    id_number: "",
    departmentId: "",
    userType: "",
    username: "",
    password: "",
    submitTransaction: "addUser",
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(); // Create FormData to handle file upload

    // Check if newUser has any values before appending to formData
    if (Object.values(newUser).some((value) => value !== null)) {
      Object.entries(newUser).forEach(([key, value]) => {
        if (value !== null) {
          formData.append(key, value);
        }
      });

      // Log the FormData values for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
    } else {
      console.warn("FormData is empty. No values to submit."); // Log a warning if formData is empty
    }

    console.log("Submitting FormData:", formData); // Log to confirm FormData submission
    fetcher.submit(formData, { method: "POST" }); // Submit FormData
  };

  const handleCloseDialog = () => {
    setNewUser({
      firstname: "",
      middlename: "",
      lastname: "",
      suffix: "",
      email: "",
      id_number: "",
      departmentId: "",
      userType: "",
      username: "",
      password: "",
      submitTransaction: "addUser",
    });
    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (actionData && actionData.error) {
      setErrorMessage(actionData.error);
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [actionData]);

  useEffect(() => {
    if (fetcher.data && fetcher.data.message == "User added successfully") {
      setIsDialogOpen(false);
      setSuccessMessage(fetcher.data.message);

      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 10000);
      return () => clearTimeout(timer);
    }

    if (
      fetcher.data?.message == "Email already exists!" ||
      fetcher.data?.message == "User already exists"
    ) {
      setSignupErrorMessage(fetcher.data.message);
    }
  }, [fetcher.data]);

  const handleSignupClick = () => {
    setIsDialogOpen(true); // Open dialog on signup click
  };

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await axios.get(`${baseAPI}/departments`);
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    }

    fetchDepartments();
  }, []); // Empty dependency array to run only once on component mount

  const handleResetPassword = async () => {
    setSentOtpLoading(true);
    try {
      const response = await axios.post(`${baseAPI}/users/sendOTP`, {
        email: resetEmail,
      });

      if (response.data) {
        setResetPasswordFlag(true);
        setSentOtpLoading(false);
        setOtpSentMessage(true);
        setOtpSentErrorMessage(false);
        console.log(response.data);
      }
    } catch (error) {
      setOtpSentErrorMessage(true);
      setOtpSentMessage(false);
      setSentOtpLoading(false);
    } finally {
      setSentOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setVerifyOtpLoading(true);
    try {
      const response = await axios.post(`${baseAPI}/users/verifyOTP`, {
        email: resetEmail,
        otp: otpVerification,
      });

      if (response.data) {
        setOtpVerified(true);
        setVerifyOtpLoading(false);
        setOtpVerifiedMessage(true);
        setOtpVerifiedErrorMessage(false);
      }
    } catch (error) {
      console.log(error);
      setOtpVerifiedErrorMessage(true);
      setOtpVerifiedMessage(false);
      setVerifyOtpLoading(false);
    } finally {
      setVerifyOtpLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setChangePasswordLoading(true);
    try {
      const response = await axios.post(`${baseAPI}/users/changePassword`, {
        email: resetEmail,
        newPassword: newpassword,
      });

      if (response.data) {
        setChangePasswordLoading(false);
        setChangePasswordMessage(true);
        setResetPasswordFlag(false);
        setOtpVerified(false);
        setOtpVerifiedMessage(false);
        setOtpVerifiedErrorMessage(false);
        setOtpSentMessage(false);
        setOtpSentErrorMessage(false);
        setResetEmail("");
        setNewPassword("");
        setOtpVerification("");
      }
    } catch (error) {
      console.log(error);
      setChangePasswordLoading(false);
    } finally {
      setChangePasswordLoading(false);
      setIsResetPasswordDialogOpen(false);
    }
  };

  return (
    <div className="flex relative w-full  h-screen items-center justify-center overflow-hidden">
      <img
        src={bg}
        alt="background image"
        className="absolute inset-0 w-full z-[-1]"
      />

      <div className="grid grid-cols-2 w-full">
        <div className="w-full  h-screen flex items-center justify-center flex-col gap-2">
          <img src={csulogo} alt="csu logo" className="w-[280px]" />
          <h1 className="text-3xl font-bold text-center font-[Poppins]">
            CARAGA STATE UNIVERSITY
          </h1>
          <h2 className="text-2xl  text-center italic">
            Thesis Scheduling System
          </h2>
        </div>

        <div className="w-full flex items-center justify-center">
          <Card
            className=" bg-white/20
  backdrop-blur-md
  border border-white/30
  shadow-lg
  rounded-2xl"
          >
            <CardHeader>
              <CardTitle>Welcome Back!</CardTitle>
              <CardDescription className="text-base-300 text-sm">
                Enter your Username below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post">
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      value={loginData.username}
                      onChange={(e) =>
                        setLoginData({ ...loginData, username: e.target.value })
                      }
                      id="username"
                      type="text"
                      placeholder="m@example.com"
                      required
                      name="username"
                    />
                  </div>
                  <div className="grid gap-2 relative">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>

                      <Dialog
                        open={isResetPasswordDialogOpen}
                        onOpenChange={setIsResetPasswordDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <span className="ml-auto inline-block text-sm underline-offset-4 hover:underline hover:cursor-pointer">
                            {" "}
                            Forgot your password?
                          </span>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Reset Password</DialogTitle>
                            <DialogDescription>
                              Enter your email address to receive a password
                              reset OTP.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className="w-full"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                              />
                            </div>
                            {otpSentMessage && (
                              <span className="text-sm text-green-500">
                                "An OTP has been sent to your email"
                              </span>
                            )}
                            {otpSentErrorMessage && (
                              <span className="text-sm text-red-500">
                                "Email is not registered"
                              </span>
                            )}

                            {resetPasswordFlag && (
                              <>
                                <div className="grid gap-2">
                                  <Label htmlFor="otp">OTP Verification</Label>
                                  <InputOTP
                                    maxLength={6}
                                    value={otpVerification}
                                    onChange={(value) =>
                                      setOtpVerification(value)
                                    }
                                  >
                                    <InputOTPGroup>
                                      <InputOTPSlot index={0} />
                                      <InputOTPSlot index={1} />
                                      <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                      <InputOTPSlot index={3} />
                                      <InputOTPSlot index={4} />
                                      <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                  </InputOTP>
                                </div>
                                {otpVerifiedMessage && (
                                  <span className="text-sm text-green-500">
                                    "OTP verified successfully"
                                  </span>
                                )}
                                {otpVerifiedErrorMessage && (
                                  <span className="text-sm text-red-500">
                                    "Invalid OTP"
                                  </span>
                                )}
                              </>
                            )}

                            {otVerified && (
                              <>
                                <div className="grid gap-2">
                                  <Label htmlFor="newpassword">
                                    New Password
                                  </Label>
                                  <Input
                                    id="newpassword"
                                    type="password"
                                    placeholder="Enter your new password"
                                    className="w-full"
                                    value={newpassword}
                                    onChange={(e) =>
                                      setNewPassword(e.target.value)
                                    }
                                  />
                                </div>

                                {changePasswordMessage && (
                                  <span className="text-sm text-green-500">
                                    "Password changed successfully"
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          <DialogFooter>
                            {otVerified ? (
                              <Button onClick={handleChangePassword}>
                                {changePasswordLoading ? (
                                  <>
                                    <Loader2 className="animate-spin" />
                                    loading
                                  </>
                                ) : (
                                  "Change Password"
                                )}
                              </Button>
                            ) : resetPasswordFlag ? (
                              <Button onClick={handleVerifyOTP}>
                                {verifyOtpLoading ? (
                                  <>
                                    <Loader2 className="animate-spin" />
                                    loading
                                  </>
                                ) : (
                                  "Verify OTP"
                                )}
                              </Button>
                            ) : (
                              <Button onClick={handleResetPassword}>
                                {sentOtpLoading ? (
                                  <>
                                    <Loader2 className="animate-spin" />
                                    loading
                                  </>
                                ) : (
                                  "Send OTP"
                                )}
                              </Button>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="relative">
                      <Input
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        name="password"
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="pr-10" // Add padding to prevent text overlap with the icon
                      />
                      {/* Show/Hide Password Button */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      name="submitTransaction"
                      value={"login"}
                      disabled={
                        loginData.username === "" ||
                        loginData.password === "" ||
                        navigation.state === "submitting"
                      }
                      type="submit"
                      className="w-full h-[50px]"
                    >
                      {navigation.state === "submitting" ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Please wait
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>

                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        Don't have an account yet?
                      </span>
                      <span
                        onClick={handleSignupClick}
                        className="text-sm cursor-pointer font-bold"
                      >
                        Sign Up
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  {errorMessage && (
                    <span className="text-red-500">{errorMessage}</span>
                  )}
                </div>
              </Form>
            </CardContent>
          </Card>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="w-[550px]">
              <fetcher.Form
                className="flex flex-col gap-5"
                method="POST"
                onSubmit={handleSubmit}
              >
                <DialogHeader>
                  <DialogTitle>Sign Up</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="Details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="Details">Details</TabsTrigger>
                    <TabsTrigger value="Education">Education</TabsTrigger>
                    <TabsTrigger value="Credentials">Credentials</TabsTrigger>
                  </TabsList>

                  {/* Details Tab */}
                  <TabsContent value="Details">
                    <Card>
                      <CardHeader>
                        <CardTitle>User Details</CardTitle>
                        <CardDescription>
                          Enter correct information.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Firstname</Label>
                            <Input
                              required
                              defaultValue={newUser.firstname}
                              onChange={(e) =>
                                setNewUser({
                                  ...newUser,
                                  firstname: e.target.value,
                                })
                              }
                              name="firstname"
                              placeholder="Enter Firsname"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Middlename</Label>
                            <Input
                              required
                              defaultValue={newUser.middlename}
                              onChange={(e) =>
                                setNewUser({
                                  ...newUser,
                                  middlename: e.target.value,
                                })
                              }
                              name="middlename"
                              placeholder="Enter Middlename"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-[1fr_100px] gap-3">
                          <div className="space-y-2">
                            <Label>Lastname</Label>
                            <Input
                              required
                              defaultValue={newUser.lastname}
                              onChange={(e) =>
                                setNewUser({
                                  ...newUser,
                                  lastname: e.target.value,
                                })
                              }
                              name="lastname"
                              placeholder="Enter Lastname"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Suffix</Label>
                            <Input
                              defaultValue={newUser.suffix}
                              onChange={(e) =>
                                setNewUser({
                                  ...newUser,
                                  suffix: e.target.value,
                                })
                              }
                              name="suffix"
                              placeholder="e.g Jr, Sr"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            required
                            defaultValue={newUser.email}
                            onChange={(e) =>
                              setNewUser({ ...newUser, email: e.target.value })
                            }
                            name="email"
                            placeholder="sample@gmail.com"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Education Tab */}
                  <TabsContent value="Education">
                    <Card>
                      <CardHeader>
                        <CardTitle>Education</CardTitle>
                        <CardDescription>
                          Enter your education details.
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-2">
                        <div className="space-y-3">
                          <Label className="flex items-center justify-between">
                            <span>Id Number</span>{" "}
                          </Label>

                          <Input
                            required
                            name="id_number"
                            defaultValue={newUser.id_number}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                id_number: e.target.value,
                              })
                            }
                            placeholder="Enter Valid Id Number"
                          />
                        </div>

                        <div className="space-y-3 w-full">
                          <Label>Department</Label>

                          <Select
                            required
                            name="deparmentId"
                            defaultValue={newUser.departmentId}
                            onValueChange={(value) =>
                              setNewUser({ ...newUser, departmentId: value })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Departments</SelectLabel>
                                {departments.map((dept: any) => (
                                  <SelectItem key={dept._id} value={dept._id}>
                                    {dept.acronym}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3 w-full">
                          <Label>User Type</Label>

                          <Select
                            required
                            name="userType"
                            defaultValue={newUser.userType}
                            onValueChange={(value) =>
                              setNewUser({ ...newUser, userType: value })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select User Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="chairperson">
                                  Chairperson
                                </SelectItem>
                                <SelectItem value="faculty">Faculty</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Credentials Tab */}
                  <TabsContent value="Credentials">
                    <Card>
                      <CardHeader>
                        <CardTitle>User Credentials</CardTitle>
                        <CardDescription>
                          Enter user credentials for user login.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-2">
                          <Label className="flex items-center justify-between">
                            <span>Username</span>{" "}
                            <span className="text-orange-500">
                              (Set idnumber as your username)
                            </span>
                          </Label>

                          <Input
                            required
                            name="username"
                            defaultValue={newUser.username}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                username: e.target.value,
                              })
                            }
                            placeholder="Enter Username"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Password</Label>
                          <Input
                            required
                            name="password"
                            defaultValue={newUser.password}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                password: e.target.value,
                              })
                            }
                            placeholder="Enter Password"
                            type="password"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <DialogFooter>
                  <Button
                    type="button"
                    className="cursor-pointer"
                    variant="ghost"
                    onClick={handleCloseDialog}
                  >
                    Cancel
                  </Button>
                  <Button
                    name="submitTrasaction"
                    value={"addUser"}
                    disabled={
                      newUser.firstname == "" ||
                      newUser.middlename == "" ||
                      newUser.lastname == "" ||
                      newUser.email == "" ||
                      newUser.id_number == "" ||
                      newUser.departmentId == "" ||
                      newUser.userType == "" ||
                      newUser.username == "" ||
                      newUser.password == "" ||
                      fetcher.state === "submitting"
                    }
                    type="submit"
                    className="cursor-pointer"
                  >
                    {fetcher.state === "submitting" ? (
                      <>
                        {" "}
                        <Loader2 className="animate-spin" />
                        Please wait
                      </>
                    ) : (
                      "Sign up"
                    )}
                  </Button>
                </DialogFooter>
              </fetcher.Form>
            </DialogContent>
          </Dialog>

          {successMessage && (
            <AlertDialog open={!!successMessage}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Congratulations!</AlertDialogTitle>
                  <AlertDialogDescription>
                    You have successfully signed in. You will receive an email
                    if your account is approved.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction onClick={() => setSuccessMessage(null)}>
                    OK
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {signupErrorMessage && (
            <AlertDialog open={!!signupErrorMessage}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Registration Error!</AlertDialogTitle>
                  <AlertDialogDescription>
                    {signupErrorMessage}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction
                    onClick={() => setSignupErrorMessage(null)}
                  >
                    Try Again
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}

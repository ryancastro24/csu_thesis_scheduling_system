import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react"; // Import Lucide icon
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  getDepartments,
  addUsertData,
  getUsers,
  updateUserData,
} from "@/backend_api/users";
import { useLoaderData, useFetcher, ActionFunction } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

// loader function
export async function loader() {
  const departments = await getDepartments();
  const users = await getUsers();
  console.log(departments);
  return { departments, users };
}

//action function
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data: Record<string, FormDataEntryValue> = Object.fromEntries(
    formData.entries()
  );

  console.log(request.method);

  if (request.method === "POST") {
    const userData = await addUsertData(data);

    return userData;
  }

  if (request.method === "PUT") {
    const userData = await updateUserData(data?.id, data);

    return userData;
  }
};

export default function UsersPage() {
  const { departments, users } = useLoaderData();
  console.log(users);

  const fetcher = useFetcher();

  console.log("fetcher data:", fetcher.data);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUser, setSelectedUser] = useState({
    id: "",
    firstname: "",
    middlename: "",
    lastname: "",
    suffix: "",
    email: "",
    id_number: "",
    college: "",
    departmentId: "",
    userType: "",
    username: "",
    password: "",
  });

  const [newUser, setNewUser] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    suffix: "",
    email: "",
    id_number: "",
    college: "",
    departmentId: "",
    userType: "",
    username: "",
    password: "",
  });

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter(
    (user: any) =>
      user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.middlename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id_number
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) // Ensure idnumber is a string
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle opening and closing the dialog
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setNewUser({
      firstname: "",
      middlename: "",
      lastname: "",
      suffix: "",
      email: "",
      id_number: "",
      college: "",
      departmentId: "",
      userType: "",
      username: "",
      password: "",
    });
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault(); // Prevent default form submission
    console.log("Submitting Form:", newUser);
    fetcher.submit(newUser, { method: "POST" });
  };

  const handleSubmitUpdate = (e: any) => {
    e.preventDefault(); // Prevent default form submission
    fetcher.submit(selectedUser, { method: "PUT" });
  };
  useEffect(() => {
    if (!fetcher.data || !fetcher.data.message) {
      return console.log("No Fetcher Data Available");
    } // Ensure fetcher.data exists

    console.log("Fetcher data message:", fetcher.data.message); // Debugging log

    if (fetcher.data.message.includes("User added successfully")) {
      console.log("this works!");
      toast.success(fetcher.data.message);
      setNewUser({
        firstname: "",
        middlename: "",
        lastname: "",
        suffix: "",
        email: "",
        id_number: "",
        college: "",
        departmentId: "",
        userType: "",
        username: "",
        password: "",
      });
      setIsDialogOpen(false);
    } else if (fetcher.data.message.includes("User deleted successfully")) {
      toast.success(fetcher.data.message);
      setDeleteModal(false);
    } else if (fetcher.data.message.includes("User updated successfully")) {
      toast.success(fetcher.data.message);
      setUpdateModal(false);
      setSelectedUser({
        id: "",
        firstname: "",
        middlename: "",
        lastname: "",
        suffix: "",
        email: "",
        id_number: "",
        college: "",
        departmentId: "",
        userType: "",
        username: "",
        password: "",
      });
    } else {
      toast.error("An error occurred!");
    }
  }, [fetcher.data]);

  const handleUpdateModal = (data: any) => {
    setUpdateModal(true);
    setSelectedUser({
      id: data._id,
      firstname: data.firstname,
      middlename: data.middlename,
      lastname: data.lastname,
      suffix: data.suffix,
      email: data.email,
      id_number: data.id_number,
      college: data.college,
      departmentId: data.departmentId._id,
      userType: data.userType,
      username: data.username,
      password: data.password,
    });
  };

  const handleUpdateModalClose = () => {
    setUpdateModal(false);
    setSelectedUser({
      id: "",
      firstname: "",
      middlename: "",
      lastname: "",
      suffix: "",
      email: "",
      id_number: "",
      college: "",
      departmentId: "",
      userType: "",
      username: "",
      password: "",
    });
  };
  return (
    <div className="space-y-4 mt-5">
      {/* Search & Add Invoice Button (Swapped Order) */}
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10" // Add padding to prevent overlap
          />
        </div>
        <Button className="cursor-pointer" onClick={handleOpenDialog}>
          Add User
        </Button>
      </div>

      {/* Invoice Table */}
      <Table>
        <TableCaption>List of users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead className="text-center">Id Number</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-center">Type</TableHead>
            <TableHead className="text-center">Department</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.length > 0 ? (
            currentUsers.map((val: any) => (
              <TableRow key={val._id}>
                <TableCell className="col-span-2 text-left flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>{" "}
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span>{val.firstname}</span>
                    <span>{val.middlename.split("")[0]}.</span>
                    <span>{val.lastname} </span>
                    <span>{val.suffix}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{val.id_number}</TableCell>
                <TableCell className="text-center">{val.email}</TableCell>
                <TableCell className="text-center">{val.userType}</TableCell>
                <TableCell className="text-center">
                  {val.departmentId.acronym}
                </TableCell>
                <TableCell className="text-center flex justify-end pr-5 items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="text-lg cursor-pointer">
                      <BsThreeDotsVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => {
                          setDeleteModal(true);
                          setSelectedUserId(val._id);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateModal(val)}>
                        Update
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent className="flex justify-end">
            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <PaginationPrevious />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <span className="px-3 py-1 text-sm">
                {currentPage} / {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <PaginationNext />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Add user Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <fetcher.Form
            className="flex flex-col gap-5"
            method="POST"
            onSubmit={handleSubmit}
          >
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="students" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="Details">Details</TabsTrigger>
                <TabsTrigger value="Education">Education</TabsTrigger>
                <TabsTrigger value="Credentials">Credentials</TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="Details">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Details</CardTitle>
                    <CardDescription>
                      Enter correct student details.
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
                            setNewUser({ ...newUser, lastname: e.target.value })
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
                            setNewUser({ ...newUser, suffix: e.target.value })
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
                      Enter details of panel members for thesis evaluation.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div className="space-y-3">
                      <Label>Id Number</Label>

                      <Input
                        required
                        name="id_number"
                        defaultValue={newUser.id_number}
                        onChange={(e) =>
                          setNewUser({ ...newUser, id_number: e.target.value })
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
                      <Label>Username</Label>

                      <Input
                        required
                        name="username"
                        defaultValue={newUser.username}
                        onChange={(e) =>
                          setNewUser({ ...newUser, username: e.target.value })
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
                          setNewUser({ ...newUser, password: e.target.value })
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
                  "Add user"
                )}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </DialogContent>
      </Dialog>

      {/* delete modal */}
      <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove User Data</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this user?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              className="cursor-pointer"
              variant="ghost"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </Button>

            <fetcher.Form
              method="post"
              action={`/dashboard/users/${selectedUserId}/destroy`}
            >
              <Button
                disabled={fetcher.state === "submitting"}
                className="cursor-pointer"
                variant={"destructive"}
              >
                {fetcher.state === "submitting" ? (
                  <>
                    {" "}
                    <Loader2 className="animate-spin" />
                    Deleting
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </fetcher.Form>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* update user data  */}
      <Dialog open={updateModal} onOpenChange={setUpdateModal}>
        <DialogContent>
          <fetcher.Form
            className="flex flex-col gap-5"
            method="POST"
            onSubmit={handleSubmitUpdate}
          >
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="students" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="Details">Details</TabsTrigger>
                <TabsTrigger value="Education">Education</TabsTrigger>
                <TabsTrigger value="Credentials">Credentials</TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="Details">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Details</CardTitle>
                    <CardDescription>
                      Enter correct student details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        required
                        name="id"
                        defaultValue={selectedUser.id}
                        type="hidden"
                      />
                      <div className="space-y-2">
                        <Label>Firstname</Label>
                        <Input
                          required
                          defaultValue={selectedUser.firstname}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
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
                          defaultValue={selectedUser.middlename}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
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
                          defaultValue={selectedUser.lastname}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
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
                          defaultValue={selectedUser.suffix}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
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
                        defaultValue={selectedUser.email}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            email: e.target.value,
                          })
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
                    <CardTitle>Panel Members</CardTitle>
                    <CardDescription>
                      Enter details of panel members for thesis evaluation.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div className="space-y-3">
                      <Label>Id Number</Label>

                      <Input
                        required
                        name="id_number"
                        defaultValue={selectedUser.id_number}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
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
                        defaultValue={selectedUser.departmentId}
                        onValueChange={(value) =>
                          setSelectedUser({
                            ...selectedUser,
                            departmentId: value,
                          })
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
                        defaultValue={selectedUser.userType}
                        onValueChange={(value) =>
                          setSelectedUser({ ...selectedUser, userType: value })
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
                      <Label>Username</Label>

                      <Input
                        required
                        name="username"
                        defaultValue={selectedUser.username}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            username: e.target.value,
                          })
                        }
                        placeholder="Enter Username"
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
                onClick={handleUpdateModalClose}
              >
                Cancel
              </Button>
              <Button
                disabled={
                  selectedUser.firstname == "" ||
                  selectedUser.middlename == "" ||
                  selectedUser.lastname == "" ||
                  selectedUser.email == "" ||
                  selectedUser.id_number == "" ||
                  selectedUser.departmentId == "" ||
                  selectedUser.userType == "" ||
                  selectedUser.username == "" ||
                  selectedUser.password == "" ||
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
                  "Update user"
                )}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
import { getDepartments, addUsertData, getUsers } from "@/backend_api/users";
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

  console.log("action data: ", data);

  const userData = await addUsertData(data);

  console.log(userData);

  return "hello world";
};

export default function UsersPage() {
  const { departments, users } = useLoaderData();
  console.log(users);

  const fetcher = useFetcher();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  console.log("fetcher state: ", fetcher.state);
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
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault(); // Prevent default form submission
    console.log("Submitting Form:", newUser);
    fetcher.submit(newUser, { method: "POST" });
  };
  useEffect(() => {
    if (!fetcher.data || !fetcher.data.message) return; // Ensure fetcher.data exists

    console.log("Fetcher data message:", fetcher.data.message); // Debugging log

    if (fetcher.data.message.includes("User added successfully")) {
      console.log("this works!");
      toast.success(fetcher.data.message);
      setIsDialogOpen(false);
    } else if (fetcher.data.message.includes("User deleted successfully")) {
      toast.success(fetcher.data.message);
      setDeleteModal(false);
    } else {
      toast.error("An error occurred!");
    }
  }, [fetcher.data]);

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
            placeholder="Search invoices..."
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
                <TableCell className="w-1/4 text-left">
                  {val.firstname} {val.middlename.split("")[0]} {val.lastname}
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
                      <DropdownMenuItem onClick={() => setUpdateModal(true)}>
                        Update
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No vals found.
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
          <fetcher.Form method="POST" onSubmit={handleSubmit}>
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
                    <CardTitle>Panel Members</CardTitle>
                    <CardDescription>
                      Enter details of panel members for thesis evaluation.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div className="space-y-3">
                      <Label>Id Number</Label>

                      <Input
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
                className="cursor-pointer"
                variant="ghost"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer">
                {fetcher.state === "submitting" ? "Loading..." : "Add user"}
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
              <Button className="cursor-pointer" variant={"destructive"}>
                {fetcher.state === "submitting" ? "Deleting..." : "Delete"}
              </Button>
            </fetcher.Form>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* update user data  */}
      <Dialog open={updateModal} onOpenChange={setUpdateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Data</DialogTitle>
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
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input placeholder="Enter Name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input placeholder="Subdivision | Barangay | City" />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input placeholder="juan@example.com" />
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
                    <Input placeholder="Enter Valid Id Number" />
                  </div>

                  <div className="space-y-3 w-full">
                    <Label>College</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a College" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fruits</SelectLabel>
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="banana">Banana</SelectItem>
                          <SelectItem value="blueberry">Blueberry</SelectItem>
                          <SelectItem value="grapes">Grapes</SelectItem>
                          <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 w-full">
                    <Label>Department</Label>

                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fruits</SelectLabel>
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="banana">Banana</SelectItem>
                          <SelectItem value="blueberry">Blueberry</SelectItem>
                          <SelectItem value="grapes">Grapes</SelectItem>
                          <SelectItem value="pineapple">Pineapple</SelectItem>
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
                    <Input placeholder="Enter Username" />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input placeholder="Enter Password" type="password" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              className="cursor-pointer"
              variant="ghost"
              onClick={() => setUpdateModal(false)}
            >
              Cancel
            </Button>
            <Button className="cursor-pointer">Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

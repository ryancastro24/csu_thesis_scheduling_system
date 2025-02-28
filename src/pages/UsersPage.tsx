import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { invoices as sampleInvoices } from "@/lib/sampleData";

const ITEMS_PER_PAGE = 10;

export default function UsersPage() {
  const [invoices, setInvoices] = useState(sampleInvoices);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    invoice: "",
    paymentStatus: "",
    paymentMethod: "",
    totalAmount: "",
  });

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.paymentStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
  const currentItems = filteredInvoices.slice(
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
    setNewInvoice({
      invoice: "",
      paymentStatus: "",
      paymentMethod: "",
      totalAmount: "",
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // Handle adding a new invoice
  const handleAddInvoice = () => {
    if (
      !newInvoice.invoice ||
      !newInvoice.paymentStatus ||
      !newInvoice.paymentMethod ||
      !newInvoice.totalAmount
    ) {
      alert("Please fill in all fields.");
      return;
    }

    setInvoices([newInvoice, ...invoices]); // Add new invoice at the top
    handleCloseDialog();
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
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.length > 0 ? (
            currentItems.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell className="text-right">
                  {invoice.totalAmount}
                </TableCell>
                <TableCell className="flex justify-end pr-5 items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="text-lg cursor-pointer">
                      <BsThreeDotsVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => setDeleteModal(true)}
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
                No invoices found.
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
              onClick={handleCloseDialog}
            >
              Cancel
            </Button>
            <Button className="cursor-pointer" onClick={handleAddInvoice}>
              Add User
            </Button>
          </DialogFooter>
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
            <Button className="cursor-pointer" variant={"destructive"}>
              Delete
            </Button>
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

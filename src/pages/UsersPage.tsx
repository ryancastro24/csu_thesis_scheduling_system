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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  DialogTitle,
} from "@/components/ui/dialog";
import { invoices as sampleInvoices } from "@/lib/sampleData";

const ITEMS_PER_PAGE = 10;

export default function UsersPage() {
  const [invoices, setInvoices] = useState(sampleInvoices);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
                      <DropdownMenuLabel>User Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                      <DropdownMenuItem>Update</DropdownMenuItem>
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

      {/* Add Invoice Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Invoice</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Invoice ID"
              value={newInvoice.invoice}
              onChange={(e) =>
                setNewInvoice({ ...newInvoice, invoice: e.target.value })
              }
            />
            <Input
              placeholder="Payment Status"
              value={newInvoice.paymentStatus}
              onChange={(e) =>
                setNewInvoice({ ...newInvoice, paymentStatus: e.target.value })
              }
            />
            <Input
              placeholder="Payment Method"
              value={newInvoice.paymentMethod}
              onChange={(e) =>
                setNewInvoice({ ...newInvoice, paymentMethod: e.target.value })
              }
            />
            <Input
              placeholder="Total Amount ($)"
              value={newInvoice.totalAmount}
              onChange={(e) =>
                setNewInvoice({ ...newInvoice, totalAmount: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button className="cursor-pointer" onClick={handleAddInvoice}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Thesis {
  id: string;
  thesisTitle: string;
  students: string[];
  type: string;
  status: string;
  scheduleDate: string | null;
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const initialThesisData: Thesis[] = [
  {
    id: "THS-001",
    thesisTitle: "AI-Powered Chatbots in Education",
    students: ["Alice Johnson", "Bob Smith"],
    type: "Proposal",
    status: "Ongoing",
    scheduleDate: null,
  },
  {
    id: "THS-002",
    thesisTitle: "Blockchain for Secure Voting Systems",
    students: ["Charlie Brown", "David White"],
    type: "Final Defense",
    status: "Scheduled",
    scheduleDate: "2025-03-10",
  },
  {
    id: "THS-003",
    thesisTitle: "IoT-Based Smart Farming Solutions",
    students: ["Eva Green", "Frank Black", "Rodulf Barkclay"],
    type: "Proposal",
    status: "Completed",
    scheduleDate: "2025-02-15",
  },
  {
    id: "THS-004",
    thesisTitle: "Cybersecurity Threat Detection Using AI",
    students: ["Grace Hall", "Henry Adams"],
    type: "Final Defense",
    status: "Pending",
    scheduleDate: null,
  },
  {
    id: "THS-005",
    thesisTitle: "Augmented Reality for Online Shopping",
    students: ["Isabella King", "Jack Miller"],
    type: "Proposal",
    status: "Ongoing",
    scheduleDate: null,
  },
];

const studentList = [
  "Alice Johnson",
  "Bob Smith",
  "Charlie Brown",
  "David White",
  "Eva Green",
  "Frank Black",
  "Rodulf Barkclay",
  "Grace Hall",
  "Henry Adams",
  "Isabella King",
  "Jack Miller",
];

const ITEMS_PER_PAGE = 6;

const MyStudent: React.FC = () => {
  const [thesisData, setThesisData] = useState<Thesis[]>(initialThesisData);
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    thesisTitle: "",
    status: "",
    students: ["", "", ""], // Holds three student names
  });

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(thesisData.length / ITEMS_PER_PAGE);
  const paginatedData = thesisData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const openEditModal = (thesis: Thesis) => {
    setSelectedThesis(thesis);
    setFormData({
      thesisTitle: thesis.thesisTitle,
      status: thesis.status,
      students: [...thesis.students, "", ""].slice(0, 3), // Ensure exactly 3 slots
    });
    setEditModalOpen(true);
  };

  const openDeleteModal = (thesis: Thesis) => {
    setSelectedThesis(thesis);
    setDeleteModalOpen(true);
  };

  const handleEditSave = () => {
    setThesisData((prevData) =>
      prevData.map((item) =>
        item.id === selectedThesis?.id
          ? {
              ...item,
              thesisTitle: formData.thesisTitle,
              status: formData.status,
              students: formData.students.filter((s) => s),
            }
          : item
      )
    );
    setEditModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    setThesisData((prevData) =>
      prevData.filter((item) => item.id !== selectedThesis?.id)
    );
    setDeleteModalOpen(false);
  };

  return (
    <div className="w-full h-full p-4 space-y-4">
      <h1 className="text-2xl font-bold">My Students</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedData.map((val) => (
          <div key={val.id} className="relative">
            <Card className="dark:bg-[#303030] bg-slate-100 group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="p-1 bg-orange-500 hover:bg-orange-600 dark:hover:bg-orange-600 cursor-pointer"
                  onClick={() => openEditModal(val)}
                >
                  <Pencil className="text-white" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="p-1 cursor-pointer bg-red-500 dark:bg-red-500 hover:bg-red-600 dark:hover:bg-red-600"
                  onClick={() => openDeleteModal(val)}
                >
                  <Trash className="text-white" />
                </Button>
              </div>
              <CardHeader>
                <CardTitle>{val.thesisTitle}</CardTitle>
                <CardDescription>
                  Type: {val.type} | Status: {val.status}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  <strong>Students:</strong> {val.students.join(", ")}
                </p>
              </CardContent>
              <CardFooter>
                <p>
                  <strong>Schedule Date:</strong>{" "}
                  {val.scheduleDate ? val.scheduleDate : "Not Scheduled"}
                </p>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-4">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Thesis</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Thesis Title"
                value={formData.thesisTitle}
                onChange={(e) =>
                  setFormData({ ...formData, thesisTitle: e.target.value })
                }
              />
              <Input
                type="text"
                placeholder="Status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              />

              {formData.students.map((student, index) => (
                <Select
                  key={index}
                  onValueChange={(value) => {
                    const updatedStudents = [...formData.students];
                    updatedStudents[index] = value;
                    setFormData({ ...formData, students: updatedStudents });
                  }}
                  value={student}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select Student ${index + 1}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {studentList.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSave}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedThesis?.thesisTitle}</strong>?
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MyStudent;

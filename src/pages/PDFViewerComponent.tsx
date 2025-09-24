import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { useLocation } from "react-router-dom";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FiMoreVertical } from "react-icons/fi";
export async function loader() {
  const user = localStorage.getItem("user");
  const userData: any = JSON.parse(user as any);

  return { userData };
}

const PDFViewer = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const location = useLocation();
  const { thesisFile, title, student1, student2, student3 } =
    location.state || {};

  console.log("student1:", student1);
  console.log("student2:", student2);
  console.log("student3:", student3);
  console.log("PDF thesisFile URL:", thesisFile);

  return (
    <div className="h-[750px] overflow-auto bg-background p-4 rounded shadow">
      <div className="flex items-center justify-between mb-2">
        <h1 className="dark:text-white light:text-black"> {title}</h1>
        <Dialog>
          <DialogTrigger>
            <Button variant={"secondary"} className="cursor-pointer">
              <FiMoreVertical />
              More Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto w-[900px]">
            <DialogHeader>
              <DialogTitle className="dark:text-black">
                Thesis Title: {title}
              </DialogTitle>

              <h1 className="font-bold mt-4">Authors</h1>
              <div className="w-full grid grid-cols-3 gap-5 h-full dark:bg-[#1E1E1E] bg-slate-50 p-2 rounded-lg shadow">
                <div className="w-full flex gap-3  items-center dark:bg-[#141414] bg-slate-50 p-4 rounded-lg shadow">
                  <Avatar className="w-15 h-16">
                    <AvatarImage src={student1?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="font-bold text-[18px]">
                      {student1?.firstname} {student1?.lastname}
                    </h1>
                    <h2 className="text-xs">{student1?.id_number}</h2>
                  </div>
                </div>
                <div className="w-full flex gap-3 items-center dark:bg-[#141414] bg-slate-50 p-4 rounded-lg shadow">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={student2?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="font-bold text-[18px]">
                      {student2?.firstname} {student2?.lastname}
                    </h1>
                    <h2 className="text-xs">{student2?.id_number}</h2>
                  </div>
                </div>

                <div className="w-full flex gap-3  items-center dark:bg-[#141414] bg-slate-50 p-4 rounded-lg shadow">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={student3?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="font-bold text-[18px]">
                      {student3?.firstname} {student3?.lastname}
                    </h1>
                    <h2 className="text-xs">{student3?.id_number}</h2>
                  </div>
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <Worker
        workerUrl={
          "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js"
        }
      >
        <Viewer fileUrl={thesisFile} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  );
};

export default PDFViewer;

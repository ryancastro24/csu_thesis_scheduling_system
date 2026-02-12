import { useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getStudents, getfaculty, getChairpersons } from "@/backend_api/users";
import { getThesisDocuments } from "@/backend_api/thesisDocument";
const ITEMS_PER_PAGE = 6;

export async function loader() {
  const students = await getStudents();
  const faculty = await getfaculty();
  const chairpersons = await getChairpersons();
  const user = localStorage.getItem("user");
  const userData: any = JSON.parse(user as any);

  const thesisSchedules = await getThesisDocuments(userData.departmentAcronym);

  return { students, faculty, chairpersons, thesisSchedules, userData };
}

const StudentActualDefense = () => {
  const { thesisSchedules } = useLoaderData() as any;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxFutureDate = new Date(today);
  maxFutureDate.setDate(today.getDate() + 5);

  // ---------------- FILTER & NORMALIZE ----------------
  const filteredSchedules = useMemo(() => {
    return thesisSchedules
      .filter((val: any) => val.schedule?.date) // must be scheduled
      .filter((val: any) => {
        const scheduleDate = new Date(val.schedule.date);
        scheduleDate.setHours(0, 0, 0, 0);

        const matchesSearch = val.thesisTitle
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesCategory =
          category === "All" || val.type === category.toLowerCase();

        return (
          matchesSearch && matchesCategory && scheduleDate <= maxFutureDate
        );
      });
  }, [thesisSchedules, search, category]);

  // ---------------- TODAY ----------------
  const todaySchedules = filteredSchedules.filter(
    (val: any) =>
      new Date(val.schedule.date).toDateString() === today.toDateString(),
  );

  // ---------------- UPCOMING (EXCLUDE TODAY) ----------------
  const upcomingSchedules = filteredSchedules.filter((val: any) => {
    const scheduleDate = new Date(val.schedule.date);
    scheduleDate.setHours(0, 0, 0, 0);

    return scheduleDate > today; // strictly after today
  });

  // ---------------- PAGINATION ----------------
  const totalPages = Math.ceil(upcomingSchedules.length / ITEMS_PER_PAGE);

  const paginatedUpcoming = upcomingSchedules.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-8">
      {/* SEARCH & FILTER */}
      <div className="flex flex-col md:flex-row gap-3">
        <Input
          placeholder="Search thesis title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="border rounded-md px-3 py-2 md:w-52"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">All</option>
          <option value="Proposal">Proposal</option>
          <option value="Final">Final Defense</option>
        </select>
      </div>

      {/* TODAY */}
      <section>
        <h2 className="text-xl font-semibold mb-3">
          📌 Today’s Thesis Defense
        </h2>

        {todaySchedules.length === 0 ? (
          <p className="text-muted-foreground">
            No thesis defense scheduled today.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {todaySchedules.slice(0, 6).map((val: any) => (
              <DefenseCard key={val._id} val={val} highlight />
            ))}
          </div>
        )}
      </section>

      {/* UPCOMING */}
      <section>
        <h2 className="text-xl font-semibold mb-3">
          ⏳ Coming Soon (Next 3–5 Days)
        </h2>

        {paginatedUpcoming.length === 0 ? (
          <p className="text-muted-foreground">No upcoming thesis defenses.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paginatedUpcoming.map((val: any) => (
                <DefenseCard key={val._id} val={val} />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-4">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Prev
                </Button>

                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

// ---------------- CARD ----------------
const DefenseCard = ({ val }: { val: any; highlight?: boolean }) => (
  <Card className="dark:bg-[#303030] bg-slate-100">
    <CardHeader>
      <CardTitle>{val.thesisTitle}</CardTitle>
      <CardDescription>
        {val.type === "proposal" ? "Proposal Defense" : "Final Defense"}
      </CardDescription>
    </CardHeader>

    <CardContent className="text-sm space-y-1">
      <p>Date: {val.schedule?.date}</p>
      <p>Time: {val.schedule?.time}</p>
      <p>Venue: {val.venue || "TBA"}</p>
    </CardContent>
  </Card>
);

export default StudentActualDefense;

import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTables } from "../https";
import { enqueueSnackbar } from "notistack";

const Tables = () => {
  const [status, setStatus] = useState("all");

  useEffect(() => {
    document.title = "POS | Tables"
  }, [])

  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      return await getTables();
    },
    placeholderData: keepPreviousData,
  });

  if(isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" })
  }

  // Only log if data exists
  if (resData) {
    console.log(resData);
  }

  // Filter tables based on selected status
  const filteredTables = resData?.data?.data?.filter(table => {
    if (status === "all") return true;
    if (status === "booked") return table.status === "Occupied";
    return true;
  }) || [];

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">
      <div className="flex items-center justify-between px-10 py-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
            Tables
          </h1>
        </div>
        <div className="flex items-center justify-around gap-4">
          <button
            onClick={() => setStatus("all")}
            className={`text-[#ababab] text-lg ${
              status === "all" && "bg-[#383838] rounded-lg px-5 py-2"
            }  rounded-lg px-5 py-2 font-semibold`}
          >
            All
          </button>
          <button
            onClick={() => setStatus("booked")}
            className={`text-[#ababab] text-lg ${
              status === "booked" && "bg-[#383838] rounded-lg px-5 py-2"
            }  rounded-lg px-5 py-2 font-semibold`}
          >
            Booked
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 px-16 py-4 h-[650px] overflow-y-scroll scrollbar-hide">
        {isLoading ? (
          <div className="text-[#f5f5f5] col-span-5 text-center py-10">Loading tables...</div>
        ) : filteredTables.length > 0 ? (
          filteredTables.map((table) => (
            <TableCard
              key={table._id} // Added unique key prop
              id={table._id}
              name={table.tableNo}
              status={table.status}
              initials={table?.currentOrder?.customerDetails?.name}
              seats={table.seats}
            />
          ))
        ) : (
          <div className="text-[#f5f5f5] col-span-5 text-center py-10">
            {status === "booked" ? "No booked tables found" : "No tables found"}
          </div>
        )}
      </div>

      <BottomNav />
    </section>
  );
};

export default Tables;
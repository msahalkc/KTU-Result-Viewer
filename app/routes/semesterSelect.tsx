import type { LoaderFunction, MetaFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useLoaderData, Form } from "@remix-run/react";
import { Button, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { FaHome } from "react-icons/fa";

export const meta: MetaFunction = () => {
  return [
    { title: "KTU Result Viewer: Semester Selection" },
    { name: "description", content: "Select a semester" },
  ];
};

export let loader: LoaderFunction = async ({ request }) => {
  const queryParams = new URLSearchParams(request.url.split("?")[1]);
  const program = queryParams.get("program");

  if (!program) {
    return json({ error: "No program provided" }, 400);
  }

  try {
    const jsonData = { program: program };

    const response = await fetch(
      "https://api.ktu.edu.in/ktu-web-service/anon/result",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
        body: JSON.stringify(jsonData), // Stringify the JSON object
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    let responseData = await response.json();

    // Remove null properties from response data
    responseData = removeNullProperties(responseData);
    return json(responseData); // Return the whole response data
  } catch (error) {
    console.error("Error:", error);
    return json({ error: "Failed to fetch data" }, 500);
  }
};

function removeNullProperties(obj) {
  for (var prop in obj) {
    if (obj[prop] === null) {
      delete obj[prop];
    } else if (typeof obj[prop] === "object") {
      removeNullProperties(obj[prop]);
    }
  }
  return obj;
}

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let semester = formData.get("semester");
  const [examDefId, schemeId] = semester.split(",");
  return redirect(`/individualResult?data=${examDefId}+${schemeId}`);
};

export default function SemesterSelect() {
  const semData = useLoaderData();

  return (
    <div className="flex-1 flex flex-col pt-10 items-center gap-5">
      <div className="flex-1 flex items-center justify-center">
        <Table
          aria-label="Example static collection table"
          className="w-fit px-10"
          radius="none"
          removeWrapper
        >
          <TableHeader className="">
            <TableColumn className="bg-[#111] font-semibold text-white text-md">
              Result Name
            </TableColumn>
            {/* Hide "Publish Date" column on smaller screens */}
            <TableColumn className="bg-[#111] font-semibold text-white text-md hidden md:table-cell">
              Publish Date
            </TableColumn>
            <TableColumn className="bg-[#111] font-semibold text-white text-md">
              View Result
            </TableColumn>
          </TableHeader>
          <TableBody>
            {semData.map((sem, index) => (
              <TableRow key={`${sem.examDefId},${sem.schemeId}`}>
                <TableCell>{sem.resultName}</TableCell>
                {/* Hide "Publish Date" column on smaller screens */}
                <TableCell className="hidden md:table-cell">
                  {sem.publishDate}
                </TableCell>
                <TableCell>
                  <Form method="post">
                    <input
                      type="hidden"
                      name="semester"
                      value={`${sem.examDefId},${sem.schemeId}`}
                    />
                    <Button
                      className="bg-transparent border-1 border-[#111] rounded-none"
                      type="submit"
                    >
                      View Result
                    </Button>
                  </Form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Link
        to="/"
        className="flex items-center gap-5 bg-[#111] text-white px-5 mb-10"
      >
        Back to Home
        <FaHome />
      </Link>
    </div>
  );
}

import axios from "axios";
import type {
  LoaderFunction,
  MetaFunction,
  ActionFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";

import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { FaHome } from "react-icons/fa";

export const meta: MetaFunction = () => {
  return [
    { title: "KTU Result Viewer: Semester Selection" },
    { name: "description", content: "Select a semester" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const queryParams = new URLSearchParams(request.url.split("?")[1]);
    const program = queryParams.get("program");

    if (!program) {
      return json({ error: "No program provided" }, 400);
    }

    const response = await axios.post(
      "https://api.ktu.edu.in/ktu-web-service/anon/result",
      { program }, // Simplified syntax for sending JSON data
      {
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
      }
    );

    if (!response.data) {
      throw new Error("Network response was not ok");
    }

    let responseData = response.data;

    // Remove null properties from response data
    responseData = removeNullProperties(responseData);
    return json(responseData); // Return the whole response data
  } catch (error) {
    console.error("Error in loader function:", error);
    return json({ error: "Failed to fetch data" }, 500);
  }
};

function removeNullProperties(obj) {
  for (const prop in obj) {
    if (obj[prop] === null) {
      delete obj[prop];
    } else if (typeof obj[prop] === "object") {
      removeNullProperties(obj[prop]);
    }
  }
  return obj;
}

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const semester = formData.get("semester");
    const [examDefId, schemeId] = semester.split(",");
    return redirect(`/individualResult?data=${examDefId}+${schemeId}`);
  } catch (error) {
    console.error("Error in action function:", error);
    return json({ error: "Failed to process the action" }, 500);
  }
};

export default function SemesterSelect() {
  const semData: any[] = useLoaderData();

  return (
      <Table
        aria-label="Example static collection table"
        className="w-full md:w-fit px-10"
        removeWrapper
      >
        <TableHeader>
          <TableColumn className="bg-[#befec1] font-semibold text-[#003632]  text-md">
            Result Name
          </TableColumn>
          {/* Hide "Publish Date" column on smaller screens */}
          <TableColumn className="bg-[#befec1] font-semibold text-[#003632]  text-md hidden md:table-cell">
            Publish Date
          </TableColumn>
          <TableColumn className="bg-[#befec1] font-semibold text-[#003632]  text-md">
            View Result
          </TableColumn>
        </TableHeader>
        <TableBody items={semData}>
          {(sem) => (
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
                    className="bg-transparent border-1 border-[#befec1] text-white font-semibold"
                    type="submit"
                  >
                    View Result
                  </Button>
                </Form>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
  );
}

import axios from "axios";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Card, CardBody } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { FaHome } from "react-icons/fa";

export const meta: MetaFunction = () => {
  return [
    { title: "KTU Result Viewer: View Result" },
    { name: "description", content: "Individual Result Page" },
  ];
};

export let loader: LoaderFunction = async ({ request }) => {
  try {
    const queryParams = new URLSearchParams(request.url.split("?")[1]);
    const registerNo = queryParams.get("registerNo");
    const dateOfBirth = queryParams.get("dateOfBirth");
    const schemeId = queryParams.get("schemeId");
    const examDefId = queryParams.get("examDefId");

    if (!registerNo || !dateOfBirth || !schemeId || !examDefId) {
      return json({ error: "Required parameters missing" }, 400);
    }

    const jsonData = {
      registerNo: registerNo,
      dateOfBirth: dateOfBirth,
      examDefId: examDefId,
      schemeId: schemeId,
    };

    const response = await axios.post(
      "https://api.ktu.edu.in/ktu-web-service/anon/individualresult",
      jsonData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let responseData = response.data;

    // Remove key-value pairs with null values
    responseData = removeNullProperties(responseData);
    return json({ responseData });
  } catch (error) {
    console.error("Error in loader function:", error);
    return json({ error: "Failed to fetch data" }, 500);
  }
};

// Function to remove key-value pairs with null values recursively
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

export default function ViewResult() {
  const { responseData } = useLoaderData();

  if (!responseData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-5">
        <Card className="md:w-96 md:h-96 flex items-center justify-center">
          <p className="text-danger">
            Register number and date of birth do not match.
          </p>
        </Card>
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

  const resultDetails = responseData.resultDetails;
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-5 w-full gap-5">
      <div className="w-full md:w-[75%] flex-1 flex flex-col items-center justify-center  gap-5">
        <h2 className="font-semibold text-center">{responseData.resultName}</h2>
        <Card className="w-full">
          <CardBody className="flex flex-col gap-2">
            <div className="flex md:flex-row flex-col">
              <p className="md:w-[50%]">Name</p>
              <p className="hidden md:block">:</p>
              <p className="md:w-[50%] font-semibold">
                {responseData.firstName}
              </p>
            </div>
            {/* Add similar blocks for other details */}
          </CardBody>
        </Card>
        <Table aria-label="Example static collection table">
          <TableHeader>
            <TableColumn className="hidden md:table-cell">Sl. no</TableColumn>
            <TableColumn>Course</TableColumn>
            <TableColumn>Grade</TableColumn>
            <TableColumn>Credits</TableColumn>
          </TableHeader>
          <TableBody>
            {resultDetails.map((subResult, index) => (
              <TableRow key={index}>
                <TableCell className="hidden md:table-cell">
                  {index + 1}
                </TableCell>
                <TableCell>{subResult.courseName}</TableCell>
                <TableCell>{subResult.grade}</TableCell>
                <TableCell>{subResult.credits}</TableCell>
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

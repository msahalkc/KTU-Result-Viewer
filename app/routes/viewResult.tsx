import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
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

export let loader: LoaderFunction = async ({ request }) => {
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

  const response = await fetch(
    "https://api.ktu.edu.in/ktu-web-service/anon/individualresult",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    }
  );

  let responseData = await response.json();

  // Remove key-value pairs with null values
  responseData = removeNullProperties(responseData);
  return json({ responseData });
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
            <div className="flex md:flex-row flex-col">
              <p className="md:w-[50%]">College</p>
              <p className="hidden md:block">:</p>
              <p className="md:w-[50%] font-semibold">
                {responseData.institutionName}
              </p>
            </div>
            <div className="flex md:flex-row flex-col">
              <p className="md:w-[50%]">Register Number</p>
              <p className="hidden md:block">:</p>
              <p className="md:w-[50%] font-semibold">
                {responseData.registerNo}
              </p>
            </div>
            <div className="flex md:flex-row flex-col">
              <p className="md:w-[50%]">Semester</p>
              <p className="hidden md:block">:</p>
              <p className="md:w-[50%] font-semibold">
                {responseData.semesterName}
              </p>
            </div>
            <div className="flex md:flex-row flex-col">
              <p className="md:w-[50%]">Branch</p>
              <p className="hidden md:block">:</p>
              <p className="md:w-[50%] font-semibold">
                {responseData.branchName}
              </p>
            </div>
            <div className="flex md:flex-row flex-col">
              <p className="md:w-[50%]">Exam Month and Year</p>
              <p className="hidden md:block">:</p>
              <p className="md:w-[50%] font-semibold">
                {responseData.examYearAndMonth}
              </p>
            </div>
            <div className="flex md:flex-row flex-col">
              <p className="md:w-[50%]">Exam</p>
              <p className="hidden md:block">:</p>
              <p className="md:w-[50%] font-semibold">
                {responseData.resultName}
              </p>
            </div>
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
                <TableCell className="hidden md:table-cell">{index+1}</TableCell>
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

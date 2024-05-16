import axios from "axios";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Card,
  CardBody,
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

export const loader: LoaderFunction = async ({ request }) => {
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
  for (const prop in obj) {
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
          className="flex items-center gap-5 bg-[#befec1] text-white px-5 mb-10"
        >
          Back to Home
          <FaHome />
        </Link>
      </div>
    );
  }

  const resultDetails = responseData.resultDetails;
  let index = 0;

  return (
    <div className="flex flex-col items-center justify-center p-5 w-full md:w-[75%] gap-5">
      <h2 className="font-semibold text-center bg-[#eef2ee] w-full py-2 text-[#003632] rounded-lg">
        {responseData.resultName}
      </h2>
      <Card className="w-full bg-transparent text-white" shadow="none">
        <CardBody className="flex flex-col gap-2">
          <div className="flex md:flex-row flex-col">
            <p className="md:w-[50%]">Name</p>
            <p className="hidden md:block">:&nbsp;&nbsp;</p>
            <p className="md:w-[50%]">{responseData.fullName}</p>
          </div>
          <div className="flex md:flex-row flex-col">
            <p className="md:w-[50%]">College</p>
            <p className="hidden md:block">:&nbsp;&nbsp;</p>
            <p className="md:w-[50%]">{responseData.institutionName}</p>
          </div>
          <div className="flex md:flex-row flex-col">
            <p className="md:w-[50%]">Register Number</p>
            <p className="hidden md:block">:&nbsp;&nbsp;</p>
            <p className="md:w-[50%]">{responseData.registerNo}</p>
          </div>
          <div className="flex md:flex-row flex-col">
            <p className="md:w-[50%]">Semester</p>
            <p className="hidden md:block">:&nbsp;&nbsp;</p>
            <p className="md:w-[50%]">{responseData.semesterName}</p>
          </div>
          <div className="flex md:flex-row flex-col">
            <p className="md:w-[50%]">Branch</p>
            <p className="hidden md:block">:&nbsp;&nbsp;</p>
            <p className="md:w-[50%]">{responseData.branchName}</p>
          </div>
          <div className="flex md:flex-row flex-col">
            <p className="md:w-[50%]">Exam Month and Year</p>
            <p className="hidden md:block">:&nbsp;&nbsp;</p>
            <p className="md:w-[50%]">{responseData.examYearAndMonth}</p>
          </div>
          <div className="flex md:flex-row flex-col">
            <p className="md:w-[50%]">Exam</p>
            <p className="hidden md:block">:&nbsp;&nbsp;</p>
            <p className="md:w-[50%]">{responseData.resultName}</p>
          </div>
        </CardBody>
      </Card>
      <Table aria-label="Example static collection table" removeWrapper>
        <TableHeader>
          <TableColumn className="bg-[#eef2ee] text-[#003632]">
            Sl. no
          </TableColumn>
          <TableColumn className="bg-[#eef2ee] text-[#003632]">
            Course
          </TableColumn>
          <TableColumn className="bg-[#eef2ee] text-[#003632]">
            Grade
          </TableColumn>
          <TableColumn className="bg-[#eef2ee] text-[#003632]">
            Credits
          </TableColumn>
        </TableHeader>
        <TableBody items={resultDetails}>
          {(subResult: any) => (
            <TableRow key={subResult.courseName}>
              <TableCell>{++index}</TableCell>
              <TableCell>{subResult.courseName}</TableCell>
              <TableCell>{subResult.grade}</TableCell>
              <TableCell>{subResult.credits}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

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
import _ from 'lodash';
import { removeNullProperties } from "../utils/helper";

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
    // const dateOfBirth = queryParams.get("dateOfBirth");
    const schemeId = queryParams.get("program");
    // const examDefId = queryParams.get("examDefId");

    // if (!registerNo || !dateOfBirth || !schemeId || !examDefId) {
    //   return json({ error: "Required parameters missing" }, 400);
    // }

    const jsonData = {
      registerNo: registerNo,
      // dateOfBirth: dateOfBirth,
      // examDefId: examDefId,
      // examDefId: "",
      schemeId: schemeId,
    };

    const response = await axios.post(
      `${process.env.KTU_API_INDIVIDUAL_RESULT_URL}`,
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

export default function ViewResult() {
  const { responseData } = useLoaderData();
  // console.log(responseData);
  
  

  if (!responseData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-5">
        <Card className="p-5 flex items-center justify-center">
          <p className="">
            Register number doesn&apos;t exist!
          </p>
        </Card>
        <Link
          to="/"
          className="flex items-center gap-2 bg-[#befec1] text-[#003632] p-2 mb-10 rounded-lg"
        >
          Back to Home
          <FaHome />
        </Link>
      </div>
    );
  }

  console.log(responseData.resultDetails.sort);
  const resultDetails = _.groupBy(responseData.resultDetails, 'resultName');
  const semesters = Object.keys(resultDetails).sort()
  
  

  return (
    <div className="flex flex-col items-center justify-center p-5 w-full md:w-[75%] gap-10">
      <div className="w-full">
      <h2 className="font-semibold text-center bg-[#eef2ee] w-full py-2 text-[#003632] rounded-lg">
        KTU All Semester Exam Results
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
            <p className="md:w-[50%]">Branch</p>
            <p className="hidden md:block">:&nbsp;&nbsp;</p>
            <p className="md:w-[50%]">{responseData.branchName}</p>
          </div>
        </CardBody>
      </Card>
      </div>
      
      {semesters.map((semester)=>
      <div key={semester} className="w-full flex flex-col border-2 border-[#eef2ee] rounded-lg">
      <h2 className="font-semibold text-center w-full py-2 text-[#eef2ee] rounded-lg">
        {semester}
      </h2>
      <Table aria-label="Example static collection table" removeWrapper isStriped>
        <TableHeader>
          {/* <TableColumn className="bg-[#eef2ee] text-[#003632]">
            Sl. no
          </TableColumn> */}
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
        <TableBody items={resultDetails[semester]}>
          {(subResult: any) => (
            <TableRow key={subResult.courseName}>
              {/* <TableCell>{++index}</TableCell> */}
              <TableCell>{subResult.courseName}</TableCell>
              <TableCell>{subResult.grade}</TableCell>
              <TableCell>{subResult.credits}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
      )}
    </div>
  );
}

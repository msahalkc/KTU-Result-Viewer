import type {
  LoaderFunction,
  MetaFunction,
  ActionFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useLoaderData, Form } from "@remix-run/react";
import {
  Button,
  Select,
  SelectItem,
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
    { title: "Semester Selection" },
    { name: "description", content: "Select a semester" },
  ];
};

export let loader: LoaderFunction = async ({ request }) => {
  if (!request.url) {
    return json({ error: "No URL provided" }, 400);
  }

  const queryParams = new URLSearchParams(request.url.split("?")[1]);
  const data = queryParams.get("data");

  if (!data) {
    return json({ error: "No data provided" }, 400);
  }

  const parsedData = JSON.parse(data);
  return json(parsedData);
};

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
      <Table aria-label="Example static collection table" className='w-fit' radius='none' removeWrapper>
        <TableHeader className=''>
          <TableColumn className='bg-[#111] font-semibold text-white text-md'>Result Name</TableColumn>
          <TableColumn className='bg-[#111] font-semibold text-white text-md'>Publish Date</TableColumn>
          <TableColumn className='bg-[#111] font-semibold text-white text-md'>View Result</TableColumn>
        </TableHeader>
        <TableBody>
          {semData.map((sem, index) => (
            <TableRow key={`${sem.examDefId},${sem.schemeId}`}>
              <TableCell>{sem.resultName}</TableCell>
              <TableCell>{sem.publishDate}</TableCell>
              <TableCell>
                <Form method="post">
                  <input
                    type="hidden"
                    name="semester"
                    value={`${sem.examDefId},${sem.schemeId}`}
                  />
                  <Button className='bg-transparent border-1 border-[#111] rounded-none' type="submit">
                    View Result
                  </Button>
                </Form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
      <Link to="/" className="flex items-center gap-5 bg-[#111] text-white px-5 mb-10">Back to Home<FaHome /></Link>
    </div>
  );
}

import type { LoaderFunction, MetaFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useLoaderData, Form } from "@remix-run/react";
import { Button, Select, SelectItem } from "@nextui-org/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Semester Selection" },
    { name: "description", content: "Select a semester" },
  ];
};

export let loader: LoaderFunction = async ({ request }) => {
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
    <div className="flex flex-col min-h-screen justify-center items-center gap-5">
      <Form method="post" className="w-96 flex flex-col gap-5">
        <Select label="Select semester" className="w-full" name="semester">
          {semData.map((sem) => (
            <SelectItem
              key={`${sem.examDefId},${sem.schemeId}`}
              value={sem.resultName}
            >
              {sem.resultName}
            </SelectItem>
          ))}
        </Select>
        <Button color="primary" type="submit">
          View Results
        </Button>
      </Form>
      <Link to="/">Back to Index</Link>
    </div>
  );
}

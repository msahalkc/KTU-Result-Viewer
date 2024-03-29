import axios from 'axios';
import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { Button, Select, SelectItem, Card, CardBody } from "@nextui-org/react";

export const meta: MetaFunction = () => {
  return [
    { title: "KTU Result Viewer" },
    { name: "description", content: "Your own KTU Result Viewer" },
  ];
};

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let program = formData.get("program");
  return redirect(`/semesterSelect?program=${encodeURIComponent(program)}`);
};

export async function loader() {
  try {
    const formData = new FormData();
    formData.append("data", "programs");

    const response = await axios.post(
      "https://api.ktu.edu.in/ktu-web-service/anon/masterData",
      formData
    );

    if (!response.data) {
      throw new Error("Network response was not ok");
    }

    let responseData = response.data;

    // Remove null properties from response data
    responseData = removeNullProperties(responseData);

    return json(responseData); // Return the whole response data
  } catch (error) {
    console.error("Error:", error);
    return json({ error: "Failed to fetch data" }, 500);
  }
}

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

export default function Index() {
  const { program } = useLoaderData();

  return (
    <div className="flex-1 flex flex-col gap-5 items-center">
      <div className="flex-1 flex items-center my-16 flex-col gap-10 md:justify-start md:my-24 w-full">
      <div className="text-center fontBungee text-2xl md:text-5xl drop-shadow-lg">
        KTU Results Made
        <br />
        Simple: Instant
        <br />
        Access Anytime,
        <br /> Anywhere
      </div>
      <Form className="flex flex-col md:flex-row gap-5 items-center w-full" method="post">
        <Select
          label="Select a program"
          className="md:w-96"
          name="program"
          isRequired
          radius="none"
        >
          {program.map((programItem) => (
            <SelectItem key={programItem.id} value={programItem.name}>
              {programItem.name}
            </SelectItem>
          ))}
        </Select>
        <Button
          className="bg-[#111] text-white w-full md:w-fit"
          type="submit"
          radius="none"
          size="lg"
        >
          View Results
        </Button>
      </Form>
      </div>
    </div>
  );
}

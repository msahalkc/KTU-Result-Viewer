import axios from "axios";
import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { Button, Card, Select, SelectItem, CardBody } from "@nextui-org/react";
import { removeNullProperties } from "../utils/helper";

export const meta: MetaFunction = () => {
  return [
    { title: "KTU Result Viewer" },
    { name: "description", content: "Your own KTU Result Viewer" },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const program = parseInt(formData.get("program")?.toString() ?? "");
    return redirect(`/individualResult?program=${encodeURIComponent(program)}`);
  } catch (error) {
    console.error("Error in action function:", error);
    return json({ error: "Failed to process the action" }, 500);
  }
};

export async function loader() {
  try {
    const formData = new FormData();
    formData.append("data", "programs");

    const response = await axios.post(
      `${process.env.KTU_API_PROGRAM_FETCH_URL}`,
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
    console.error("Error in loader function:", error);
    return json({ error: "Failed to fetch data" }, 500);
  }
}

export default function Index() {
  const { program } = useLoaderData<typeof loader>();

  if (!program) {
    return (
      <Card>
        <CardBody>
          <h5>KTU API down</h5>
        </CardBody>
      </Card>
    );
  }

  return (
    <Form
      className="flex flex-col md:flex-row gap-5 justify-center w-full px-5 items-center"
      method="post"
    >
      <Select
        color="success"
        label="Select a program"
        className="md:w-96"
        name="program"
        isRequired
      >
        {program.map((programItem: any) => (
          <SelectItem
            color="success"
            className="text-[#003632]"
            key={programItem.id}
            value={programItem.name}
          >
            {programItem.name}
          </SelectItem>
        ))}
      </Select>
      <Button
        className="bg-[#befec1] text-[#003632] font-semibold w-full md:w-fit"
        type="submit"
        size="lg"
      >
        View Results
      </Button>
    </Form>
  );
}

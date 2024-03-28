import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { Button, Select, SelectItem } from "@nextui-org/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let program = formData.get("program");
  console.log(program);
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
  const responseData = await response.json();
  console.log(responseData);
  
  // Redirect to another page with the response data
  return redirect(`/semesterSelect?data=${JSON.stringify(responseData)}`);
};

export async function loader() {
  try {
    const formData = new FormData();
    formData.append("data", "programs");

    const response = await fetch(
      "https://api.ktu.edu.in/ktu-web-service/anon/masterData",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const responseData = await response.json();
    return json(responseData); // Return the whole response data
  } catch (error) {
    console.error("Error:", error);
    return json({ error: "Failed to fetch data" }, 500);
  }
}

export default function Index() {
  const { program } = useLoaderData();

  return (
    <div
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}
      className="flex flex-col pt-10 gap-5 min-w-96 items-center justify-center"
    >
      <Form className="w-96 flex flex-col gap-5" method="post">
        <Select label="Select a program" className="w-full" name="program">
          {program.map((programItem) => (
            <SelectItem key={programItem.id} value={programItem.name}>
              {programItem.name}
            </SelectItem>
          ))}
        </Select>
        <Button color="primary" type="submit">
          View Results
        </Button>
      </Form>
    </div>
  );
}

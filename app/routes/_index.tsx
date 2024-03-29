import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { Button, Select, SelectItem, Card, CardBody } from "@nextui-org/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let program = formData.get("program");
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

  // Remove null properties from response data
  const cleanedData = removeNullProperties(responseData);

  // Redirect to another page with the cleaned data
  return redirect(`/semesterSelect?data=${JSON.stringify(cleanedData)}`);
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

    let responseData = await response.json();

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
      <div className="text-center fontBungee text-5xl sm:my-16">
        KTU Results Made
        <br />
        Simple: Instant
        <br />
        Access Anytime,
        <br /> Anywhere
      </div>
      <Form className="flex gap-5 items-center" method="post">
        <Select
          label="Select a program"
          className="w-96"
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
          className="bg-[#111] text-white"
          type="submit"
          radius="none"
          size="lg"
        >
          View Results
        </Button>
      </Form>
      <footer className="absolute bottom-10">
        <Card shadow='none' className='bg-[#111] text-white' radius='none'>
          <CardBody>
            <p>Created by: <a href="https://github.com/msahalkc">Muhammed Sahal K C</a></p>
          </CardBody>
        </Card>
      </footer>
    </div>
  );
}

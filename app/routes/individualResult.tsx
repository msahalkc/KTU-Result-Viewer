import type { LoaderFunction, MetaFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useLoaderData, Form } from "@remix-run/react";
import { Input, Button } from "@nextui-org/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Individual Result" },
    { name: "description", content: "Individual Result Page" },
  ];
};

export let loader: LoaderFunction = async ({ request }) => {
  const queryParams = new URLSearchParams(request.url.split("?")[1]);
  const data = queryParams.get("data");

  if (!data) {
    return json({ error: "No data provided" }, 400);
  }

  const [examDefId, schemeId] = data.split(" ");

  return json({ examDefId, schemeId });
};

// Function to remove key-value pairs with null values recursively
function removeNullProperties(obj) {
  for (var prop in obj) {
    if (obj[prop] === null) {
      delete obj[prop];
    } else if (typeof obj[prop] === 'object') {
      removeNullProperties(obj[prop]);
    }
  }
  return obj;
}

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let registerNo = formData.get("registerNo");
  let dateOfBirth = formData.get("dateOfBirth");
  let schemeId = parseInt(formData.get("schemeId"));
  let examDefId = parseInt(formData.get("examDefId"));

  // Convert date of birth to the server-compatible format (YYYY-DD-MM)
  const dobParts = dateOfBirth.split('/');
  const formattedDOB = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;

  const jsonData = {
    "registerNo": registerNo,
    "dateOfBirth": formattedDOB,
    "examDefId": examDefId,
    "schemeId": schemeId
  };

  console.log(jsonData);

  const response = await fetch(
    'https://api.ktu.edu.in/ktu-web-service/anon/individualresult',
    {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify(jsonData),
    }
  );

  let responseData = await response.json();

  // Remove key-value pairs with null values
  responseData = removeNullProperties(responseData);
  console.log(responseData);
  return json(responseData)
};

export default function IndividualResult() {
  const { examDefId, schemeId } = useLoaderData();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen">
      <Form method="post" className="flex gap-5 flex-col w-[50%]">
        <Input
          type="text"
          label="Register Number"
          name="registerNo"
          pattern="[A-Z]{3}\d{2}[A-Z]{2}\d{3}"
          title="Please enter a valid register number in the format ABC12AB123"
          required
        />
        <Input
          type="text"
          label="Date of Birth"
          name="dateOfBirth"
          pattern="(0[1-9]|[12][0-9]|3[01])\-(0[1-9]|1[0-2])\-(19|20)\d{2}"
          title="Please enter a valid date of birth in the format MM/DD/YYYY"
          required
        />
        <Input
          type="number"
          label="Exam Def Id"
          name="examDefId"
          value={examDefId}
          className="hidden"
        />
        <Input
          type="number"
          label="Scheme Id"
          name="schemeId"
          value={schemeId}
          className="hidden"
        />
        <Button type="submit" color="primary">
          Submit
        </Button>
      </Form>
      <Link to="/">Back to Index</Link>
    </div>
  );
}

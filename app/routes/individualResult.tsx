import type {
  LoaderFunction,
  MetaFunction,
  ActionFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useLoaderData, Form } from "@remix-run/react";
import { Input, Button } from "@nextui-org/react";
import { FaHome } from "react-icons/fa";

export const meta: MetaFunction = () => {
  return [
    { title: "KTU Result Viewer: Result Form" },
    { name: "description", content: "Result Form" },
  ];
};

export let loader: LoaderFunction = async ({ request }) => {
  try {
    const queryParams = new URLSearchParams(request.url.split("?")[1]);
    const data = queryParams.get("data");

    if (!data) {
      return json({ error: "No data provided" }, 400);
    }

    const [examDefId, schemeId] = data.split(" ");

    return json({ examDefId, schemeId });
  } catch (error) {
    console.error("Error in loader function:", error);
    return json({ error: "Failed to load data" }, 500);
  }
};

export let action: ActionFunction = async ({ request }) => {
  try {
    let formData = await request.formData();
    let registerNo = formData.get("registerNo");
    let dateOfBirth = formData.get("dateOfBirth");
    let schemeId = parseInt(formData.get("schemeId"));
    let examDefId = parseInt(formData.get("examDefId"));

    // Convert date of birth to the server-compatible format (YYYY-DD-MM)
    const dobParts = dateOfBirth.split("/");
    const formattedDOB = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;

    // Redirect to viewResult page with query parameters
    return redirect(
      `/viewResult?registerNo=${registerNo}&dateOfBirth=${formattedDOB}&schemeId=${schemeId}&examDefId=${examDefId}`
    );
  } catch (error) {
    console.error("Error in action function:", error);
    return json({ error: "Failed to process the action" }, 500);
  }
};

export default function IndividualResult() {
  const { examDefId, schemeId } = useLoaderData();

  return (
    <div className="flex-1 flex flex-col w-full items-center justify-center">
      <Form
        method="post"
        className="flex-1 flex gap-5 flex-col sm:w-[25%] items-center justify-center"
      >
        <Input
          type="text"
          label="Register Number"
          name="registerNo"
          pattern="[A-Z]{3}\d{2}[A-Z]{2}\d{3}"
          title="Please enter a valid register number in the format ABC12AB123"
          isRequired
          radius="none"
        />
        <Input
          type="text"
          label="Date of Birth"
          name="dateOfBirth"
          pattern="(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/(19|20)\d{2}"
          title="Please enter a valid date of birth in the format MM/DD/YYYY"
          isRequired
          radius="none"
        />
        <Input
          type="number"
          label="Exam Def Id"
          name="examDefId"
          value={examDefId}
          className="hidden"
          isRequired
          radius="none"
        />
        <Input
          type="number"
          label="Scheme Id"
          name="schemeId"
          value={schemeId}
          className="hidden"
          isRequired
          radius="none"
        />
        <Button
          className="bg-[#111] text-white w-full"
          type="submit"
          radius="none"
        >
          Submit
        </Button>
      </Form>
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

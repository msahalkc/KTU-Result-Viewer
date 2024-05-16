import type {
  LoaderFunction,
  MetaFunction,
  ActionFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { Input, Button, DateInput } from "@nextui-org/react";

export const meta: MetaFunction = () => {
  return [
    { title: "KTU Result Viewer: Result Form" },
    { name: "description", content: "Result Form" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
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

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const registerNo = formData.get("registerNo");
    const dateOfBirth = formData.get("dateOfBirth");
    const schemeId = parseInt(formData.get("schemeId")?.toString() ?? '');
    const examDefId = parseInt(formData.get("examDefId")?.toString() ?? '');

    // Redirect to viewResult page with query parameters
    return redirect(
      `/viewResult?registerNo=${registerNo}&dateOfBirth=${dateOfBirth}&schemeId=${schemeId}&examDefId=${examDefId}`
    );
  } catch (error) {
    console.error("Error in action function:", error);
    return json({ error: "Failed to process the action" }, 500);
  }
};

export default function IndividualResult() {
  const { examDefId, schemeId } = useLoaderData();

  return (
    <div className="flex flex-col w-full md:w-96 items-center">
      <Form
        method="post"
        className="flex gap-5 flex-col w-full items-center justify-center p-5 rounded-lg"
      >
        <Input
          type="text"
          label="Register Number"
          name="registerNo"
          pattern="[A-Z]{3}\d{2}[A-Z]{2}\d{3}"
          title="Please enter a valid register number in the format ABC12AB123"
          isRequired
          className='text-[#003632]'
        />
        <DateInput
          label="Date of Birth"
          name="dateOfBirth"
          title="Please enter a valid date of birth in the format MM/DD/YYYY"
          isRequired
          className='text-[#003632]'
        />
        <Input
          type="number"
          label="Exam Def Id"
          name="examDefId"
          value={examDefId}
          className="hidden"
          isRequired
        />
        <Input
          type="number"
          label="Scheme Id"
          name="schemeId"
          value={schemeId}
          className="hidden"
          isRequired
        />
        <Button
          className="bg-[#befec1] text-[#003632] font-semibold w-full py-6"
          type="submit"
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}

import React, { useState, useEffect } from "react";
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

const Ktu = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [SemesterResults, setSemesterResults] = useState([]);

  const fetchPrograms = async () => {
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
      const programData = responseData.program; // Access the program array
      console.log("Response data:", programData);
      setPrograms(programData); // Set fetched programs to state
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchPrograms(); // Fetch programs on component mount
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const jsonData = { program: selectedProgram }; // Creating JSON object
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

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      setSemesterResults(responseData);
      console.log("Response data:", SemesterResults);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    setSelectedProgram(e.target.value);
  };

  const handleViewResult = (examDefId,schemeId) => {
    // please pass this through to another page '/result' with both these parameters
  };

  const columns = [
    {
      key: "resultName",
      label: "Result Name",
    },
    {
      key: "publishDate",
      label: "Publish Date",
    },
    {
      key: "viewResultButton", // Adding a key for the button column
      label: "View Result", // Label for the button column
    },
  ];

  return (
    <div className="flex flex-col gap-5 min-w-96 items-center justify-center">
      <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
        <Select
          label="Select a program"
          value={selectedProgram}
          onChange={handleChange}
          className="w-full"
        >
          {programs.map((program) => (
            <SelectItem key={program.id} value={program.name}>
              {program.name}
            </SelectItem>
          ))}
        </Select>
        <Button color="primary" type="submit">
          View Results
        </Button>
      </form>

      <Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={SemesterResults}>
          {(item) => (
            <TableRow key={item.id}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.key !== "viewResultButton" ? (
                    // Render table cell content based on the column key
                    item[column.key]
                  ) : (
                    // Render the button in the button column
                    <Button
                      color="primary"
                      onClick={() => handleViewResult(item.examDefId, item.schemeId)}
                    >
                      View Result
                    </Button>
                  )}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Ktu;

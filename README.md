# KTU Result Viewer

KTU Result Viewer is an application that allows users to view individual examination results from the Kerala Technological University (KTU). Users can select their program, semester, and enter their register number and date of birth to view their results.

## Installation

To run the KTU Result Viewer locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/msahalkc/KTU-Result-Viewer
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. Open your web browser and visit `http://localhost:3000` to view the application.

## Components

### Navbar Component (`app/components/Navbar.tsx`)

The Navbar component provides navigation links to the portfolio and GitHub repository of the project creator, Muhammed Sahal K C.

### Index Route (`app/routes/_index.tsx`)

The Index route displays the main page of the application where users can select their program and proceed to select the semester.

### SemesterSelect Route (`app/routes/semesterSelect.tsx`)

The SemesterSelect route allows users to select the semester for which they want to view the results. It fetches the available semesters from the KTU API and displays them in a table format.

### IndividualResult Route (`app/routes/individualResult.tsx`)

The IndividualResult route enables users to enter their register number and date of birth to view their individual examination results for a specific semester.

### ViewResult Route (`app/routes/viewResult.tsx`)

The ViewResult route displays the individual examination results for the specified register number, date of birth, semester, exam definition ID, and scheme ID.

## Technologies Used

- React
- Remix
- NextUI (Next.js UI Component Library)
- KTU Result API

## Contributors

- Muhammed Sahal K C

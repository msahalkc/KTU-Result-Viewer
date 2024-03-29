// app/routes.tsx

import { loader } from './individualResult';

export let routes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/individualResult" element={<IndividualResult />} />
      <Route path="/viewResult" element={<ViewResult />} />
      {/* Add other routes as needed */}
    </Routes>
  );
};

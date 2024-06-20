import { useNavigate } from "react-router-dom";

import DefaultLayout from "@/layouts/default";

export default function Home() {
  const navigate = useNavigate();

  return (
    <DefaultLayout supabase={null}>
      <div>
        <h1>Home</h1>
      </div>
    </DefaultLayout>
  );
}

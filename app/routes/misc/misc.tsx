import { Outlet } from "react-router";

//Using this to group all misc routes like legal stuff, sitemap, etc.
export default function Misc() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}

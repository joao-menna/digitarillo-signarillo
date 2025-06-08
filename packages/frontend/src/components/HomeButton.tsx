import { Link } from "react-router";

export function HomeButton() {
  return (
    <Link className="bg-slate-200 hover:bg-slate-200/60 p-1" to={"/dashboard"}>
      Início
    </Link>
  );
}

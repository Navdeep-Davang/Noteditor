
import NotEditor from "@/dir/components/Noteditor";
import { ThemeToggler } from "@/dir/components/ThemeToggler";

export default function Home() {
 
  return (
    <div className="w-full min-h-screen p-20">
      <ThemeToggler/>
      <NotEditor />
    </div>
  );
}

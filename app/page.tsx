import { Button } from "@/components/ui/button";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-3xl font-bold">📝 Note Taking App</h1>
      <Button>
        <Link href="/notes">Go to notes</Link>
      </Button>
    </div>
  );
};

export default HomePage;

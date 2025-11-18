import { Button } from "@/components/ui/button";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <Button>
        <Link href="/notes">Go to notes</Link>
      </Button>
    </div>
  );
};

export default HomePage;

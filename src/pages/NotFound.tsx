import { Link } from "react-router-dom";
import { PawPrint, ArrowLeft } from "lucide-react";

const NotFound = () => (
  <div className="min-h-dvh flex flex-col items-center justify-center text-center px-6">
    <PawPrint className="h-12 w-12 text-neon mb-6" />
    <h1 className="font-display text-6xl sm:text-8xl font-bold text-gradient">404</h1>
    <p className="mt-4 text-white/60 max-w-sm">
      Looks like this fursona wandered off the trail. Let's get you back home.
    </p>
    <Link to="/" className="btn-pill mt-8">
      Back to Home
      <span className="btn-pill-arrow">
        <ArrowLeft className="h-4 w-4" />
      </span>
    </Link>
  </div>
);

export default NotFound;

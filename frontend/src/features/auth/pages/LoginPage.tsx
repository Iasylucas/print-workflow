import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Logo } from "@/features/company-info/components/Logo";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [imgLoaded, setImageLoaded] = useState(false);
  const handleSuccess = () => {
    navigate("/orders", { replace: true });
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Logo variant="icon" className="w-30" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        {!imgLoaded && <Skeleton className="absolute inset-0 h-full w-full" />}
        <img
          src="https://images.unsplash.com/photo-1527031169734-cc605463fe17?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          onLoad={() => setImageLoaded(true)}
          alt="LoadingSideImage"
          className={cn(
            "absolute inset-0 h-full w-full object-cover dark:brightness-[0.4] transition-opacity duration-500",
            imgLoaded ? "opacity-100" : "opacity-0",
          )}
          loading="eager"
        />
      </div>
    </div>
  );
};

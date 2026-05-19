import bgImage from "../../assets/bg.png";

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4 sm:p-6">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-105 object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-transparent to-slate-900/30" />
      </div>

      {/* Centered card */}
      <div className="relative z-10 w-full max-w-[440px]">
        <div className="rounded-3xl bg-white px-8 py-10 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] ring-1 ring-white/80 sm:px-10 sm:py-12">
          <header className="mb-8 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">
              Inventory System
            </p>
            <h1 className="mt-3 text-[1.75rem] font-bold leading-tight text-slate-900">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{subtitle}</p>
            )}
          </header>

          {children}

          {footer && (
            <footer className="mt-4 pt-6">{footer}</footer>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;

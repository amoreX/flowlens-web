export function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="mx-auto max-w-[1000px] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
        <span>&copy; {new Date().getFullYear()} FlowLens</span>
        <div className="flex gap-4">
          <a href="https://github.com/amoreX/flowlens" className="hover:text-accent transition-colors cursor-pointer">GitHub</a>
          <a href="/docs" className="hover:text-accent transition-colors cursor-pointer">Docs</a>
        </div>
      </div>
    </footer>
  );
}

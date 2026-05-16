type RivetPanelProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  className?: string;
};

export function RivetPanel({ children, className = "", ...props }: RivetPanelProps) {
  return (
    <section className={`rivet-panel ${className}`} {...props}>
      {children}
    </section>
  );
}

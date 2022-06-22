interface PanelProps {
  children: React.ReactNode;
}

const BasePanel = ({ children }: PanelProps): JSX.Element => {
  return (
    <div className="bg-slate-50 rounded flex flex-col gap-1 p-6">
      {children}
    </div>
  );
};

export default BasePanel;

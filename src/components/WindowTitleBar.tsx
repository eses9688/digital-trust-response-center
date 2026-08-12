type Props = {
  title: string;
  onBack?: () => void;
  onClose: () => void;
};

function WindowTitleBar({ title, onBack, onClose }: Props) {
  return (
    <>
      <div className="w-16">
        {onBack && (
          <button
            onClick={onBack}
            className="text-slate-400 text-xs cursor-pointer hover:text-slate-200"
          >
            ◀ 뒤로
          </button>
        )}
      </div>
      <span className="text-slate-500 text-xs">{title}</span>
      <div className="w-16 flex justify-end">
        <button
          onClick={onClose}
          className="text-slate-400 text-xs cursor-pointer hover:text-slate-200"
        >
          ✕ 닫기
        </button>
      </div>
    </>
  );
}

export default WindowTitleBar;

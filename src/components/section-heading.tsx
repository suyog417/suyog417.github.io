type Props = {
  index: string;
  title: string;
  note?: string;
  id?: string;
};

export function SectionHeading({ index, title, note, id }: Props) {
  return (
    <div className="mb-12 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mono-label mb-3">{index}</p>
        <h2 id={id} className="display text-[clamp(2rem,5vw,3.25rem)] text-ink">
          {title}
        </h2>
      </div>
      {note ? <p className="max-w-sm text-sm text-muted">{note}</p> : null}
    </div>
  );
}

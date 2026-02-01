interface TagProps {
  name: string;
  color: string;
}

export function Tag({ name, color }: TagProps) {
  return (
    <div
      className="px-4 py-2 rounded-full text-xs font-medium text-center"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {name}
    </div>
  );
}

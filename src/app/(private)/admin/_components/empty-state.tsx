export const EmptyState = ({ message }: { message: string }) => {
  return (
    <p className="px-4 py-16 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
};

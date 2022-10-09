const SubHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <h3 className="py-2 text-xl font-semibold  text-emerald-900 underline sm:text-2xl">
      {children}
    </h3>
  );
};

export default SubHeader;

export function DisplayBox(f?: File) {
  return (
    <div className="w-48 bg-cyan-900 text-center">
      {f != null && <p> Display Box </p>}
      {f == null && (
        <p>
          {" name "} + f.name + {" with size of : "} + (file.size / 1024 **
          2).toFixed(2) +{" MB"}
        </p>
      )}
    </div>
  );
}

export function isObjectWithLength(
  obj: any
): obj is { [key: string]: any; length: number } {
  return (
    typeof obj === "object" && obj !== null && "length" in obj && obj.length > 0
  );
}

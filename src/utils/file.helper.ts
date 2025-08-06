export const readMembers = async (): Promise<Array<string>> => {
  const res = await fetch("members.txt");
  const text = await res.text();
  const data = text.split("\n");

  return data;
};

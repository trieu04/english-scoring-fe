export interface IExamItem {
  id: number;
  code: number;
  name: string;
}

export interface IExamSessionItem {
  id: number;
  name: string;
}

const mockExamListData: IExamItem[] = [
  { id: 1, code: 100, name: "Phách 100" },
  { id: 2, code: 101, name: "Phách 101" },
  { id: 3, code: 102, name: "Phách 102" },
  { id: 4, code: 103, name: "Phách 103" },
  { id: 5, code: 104, name: "Phách 104" },
  { id: 6, code: 105, name: "Phách 105" },
];

const mockExamSessionListData: IExamSessionItem[] = [
  { id: 1, name: "Kíp 1 - 09/10/2024" },
  { id: 2, name: "Kíp 2 - 09/10/2024" },
  { id: 3, name: "Kíp 3 - 09/10/2024" },
  { id: 4, name: "Kíp 4 - 09/10/2024" },
  { id: 5, name: "Kíp 1 - 10/10/2024" },
];

export async function getExamListData(_examSessionId: number) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockExamListData;
}

export async function getExamSessionListData() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockExamSessionListData;
}

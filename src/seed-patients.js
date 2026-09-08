const today = new Date();
const todayDisplayDate = displayDate(today);

function displayDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function daysAgo(days) {
  const date = new Date(today);
  date.setDate(date.getDate() - days);
  return displayDate(date);
}

export const seedPatients = [
  {
    id: "p7770",
    chartNo: "1001",
    name: "샘플A",
    guardian: "보호자A",
    photoUrl: "",
    species: "개",
    breed: "포메라니안",
    age: "14년 8개월",
    sex: "중성화수컷",
    ward: "강아지 ICU-1",
    admitDay: 2,
    weight: "5.5kg",
    cc: "호흡기 모니터링 샘플",
    dx: "입원 경과 관찰",
    doctor: "데모수의사A",
    status: "current",
    importance: "high",
    room: "-",
    date: todayDisplayDate,
    admitDate: daysAgo(1),
    surgeryDate: daysAgo(6),
    tags: ["입원 2일차", "강아지 ICU-1", "CPR"]
  },
  {
    id: "p2161",
    chartNo: "1002",
    name: "샘플B",
    guardian: "보호자B",
    photoUrl: "",
    species: "고양이",
    breed: "MIX",
    age: "15년 8개월",
    sex: "중성화암컷",
    ward: "고양이 ICU-1",
    admitDay: 3,
    weight: "3.26kg",
    cc: "식욕 및 활력 확인 샘플",
    dx: "진단 메모 샘플",
    doctor: "데모수의사B",
    status: "current",
    importance: "normal",
    room: "-",
    date: todayDisplayDate,
    admitDate: daysAgo(2),
    surgeryDate: "",
    tags: ["입원 3일차", "고양이 ICU-1", "CPR"]
  },
  {
    id: "p5947",
    chartNo: "1003",
    name: "샘플C",
    guardian: "보호자C",
    photoUrl: "",
    species: "고양이",
    breed: "MIX",
    age: "7년 11개월",
    sex: "중성화수컷",
    ward: "고양이 ICU-2",
    admitDay: 3,
    weight: "4.8kg",
    cc: "수술 후 처치 확인 샘플",
    dx: "수술 후 회복 모니터링",
    doctor: "데모수의사C",
    status: "delayed",
    importance: "high",
    room: "-",
    date: todayDisplayDate,
    admitDate: daysAgo(2),
    surgeryDate: daysAgo(2),
    tags: ["입원 3일차", "고양이 ICU-2", "CPR"]
  }
];

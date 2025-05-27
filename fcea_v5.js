const furryWordTable = [
  "젖은 혀끝", "숨겨진 발바닥", "부풀어 오른 귀끝", "부비적이는 가슴털", "뒤척이는 엉덩결",
  "희미한 숨소리", "말라붙은 꼬리끝", "뜨거운 손바닥", "가느다란 허리선", "흔들리는 꼬리관절",
  "야릇한 혓바닥놀림", "땀배인 털뭉치", "실룩이는 꼬리근육", "핥고 간 털결", "짙어진 체취",
  "부드럽게 눌린 손목", "느릿한 눈빛", "열기 머금은 이마", "거칠게 스친 발톱", "낮게 깔린 목소리",
  "달콤한 콧김", "타오르는 뒷덜미", "스치듯 흐른 턱밑", "입술에 닿은 손등", "비집고 들어온 체온",
  "늘어진 허리라인", "간질이는 눈썹 끝", "밀착된 가슴팍", "느껴지는 맥박", "은밀한 침대 바닥",
  "번들거리는 귀바닥", "달뜬 채 떠는 팔뚝", "휘감긴 꼬리덮개", "꿈틀대는 등줄기", "눌린 쿠션자국",
  "흔들린 귓속", "가늘게 떨린 입술", "진동하는 허리중심", "지그시 누른 손끝", "열기 서린 털결",
  "낮게 앉은 자세", "부풀어 있는 눈꺼풀", "사르르 감긴 눈동자", "쿡 찌른 손등", "천천히 퍼지는 온기",
  "깨물린 목덜미", "흘러내리는 땀방울", "은근히 젖은 발끝", "깊숙이 파고든 숨결", "잔잔하게 흔들리는 꼬리",
  "움찔한 뒷다리", "다정히 스친 발등", "쓱 밀어낸 앞발", "따뜻한 속삭임", "짧게 다문 입꼬리",
  "떨리는 발끝", "부풀어오른 숨결", "퍼지는 털향기", "어스룩한 발자국", "닿을 듯 말 듯한 귀끝",
  "천천히 다가온 눈빛", "살며시 쓸린 발바닥", "속삭이듯 스친 털", "느릿한 꼬리흔들림"
].map(w => w + "..♥");

const delimiter = " 멍..♥ ";

function textToFurry(text) {
  const utf8Bytes = new TextEncoder().encode(text);
  const b64 = btoa(String.fromCharCode(...utf8Bytes));
  const binary = [...b64].map(c =>
    c.charCodeAt(0).toString(2).padStart(8, "0")
  ).join("");
  const chunks = binary.match(/.{1,6}/g).map(b => b.padEnd(6, "0"));
  return chunks.map(b => furryWordTable[parseInt(b, 2)]).join(delimiter);
}

function furryToText(furry) {
  const words = furry.split(delimiter).map(w => w.trim());
  const reverseMap = Object.fromEntries(
    furryWordTable.map((w, i) => [w, i])
  );
  const binary = words.map(w => {
    if (!(w in reverseMap)) throw new Error(`단어 매핑 실패: ${w}`);
    return reverseMap[w].toString(2).padStart(6, "0");
  }).join("");

  const byteStrs = binary.match(/.{1,8}/g)?.filter(b => b.length === 8);
  if (!byteStrs) return "[복호화 실패: 이진 변환 오류]";
  const b64string = String.fromCharCode(...byteStrs.map(b => parseInt(b, 2)));

  try {
    const decodedBytes = Uint8Array.from(atob(b64string), c => c.charCodeAt(0));
    return new TextDecoder().decode(decodedBytes);
  } catch {
    return "[복호화 실패: Base64 디코딩 오류]";
  }
}

function convert(mode) {
  const input = document.getElementById("input").value;
  const output = document.getElementById("output");
  try {
    output.value = mode === "encrypt" ? textToFurry(input) : furryToText(input);
  } catch (e) {
    output.value = `[실패] ${e.message}`;
  }
}

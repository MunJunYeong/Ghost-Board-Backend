export const generateRandomName = (): string => {
    // 성격, 색깔, 동물 목록
    const personalities = [
        "용감한",
        "소심한",
        "친절한",
        "날카로운",
        "수줍은",
        "활발한",
        "차분한",
        "낙천적인",
        "냉정한",
        "흥분한",
        "자유로운",
        "성숙한",
        "유머러스한",
        "귀여운",
        "열정적인",
        "진지한",
        "유연한",
        "극적인",
        "탐험가",
        "대담한",
    ];
    const colors = [
        "빨간",
        "파란",
        "초록",
        "노란",
        "보라",
        "주황",
        "검정",
        "분홍",
        "회색",
        "하늘색",
        "갈색",
        "금색",
        "은색",
        "하얀",
        "자주색",
        "연두색",
        "갈대색",
        "자색",
        "올리브색",
    ];
    const animals = [
        "사자",
        "호랑이",
        "코끼리",
        "원숭이",
        "팬더",
        "곰",
        "기린",
        "캥거루",
        "치타",
        "오리",
        "토끼",
        "강아지",
        "고양이",
        "말",
        "하마",
        "코알라",
        "코뿔소",
        "쿼카",
        "바다표범",
        "앵무새",
    ];

    // 랜덤으로 성격, 색깔, 동물 선택
    const randomPersonality = personalities[Math.floor(Math.random() * personalities.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

    // 조합하여 이름 생성
    const randomName = `${randomPersonality} ${randomColor} ${randomAnimal}`;

    return randomName;
};

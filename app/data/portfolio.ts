export const categoryOrder = [
  "people",
  "event",
  "fashion",
  "product",
  "space",
] as const;

export type CategoryKey = (typeof categoryOrder)[number];
export type RouteKey = "home" | CategoryKey | "video" | "about";

export interface PortfolioImage {
  readonly id: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}

export interface Category {
  readonly key: CategoryKey;
  readonly zh: string;
  readonly en: string;
  readonly statement: string;
  readonly images: readonly PortfolioImage[];
}

export const homeImages = [
  { id: "home-01", width: 2400, height: 1600, alt: "車廂窗邊手持相機的女子肖像" },
  { id: "home-02", width: 2400, height: 1600, alt: "復古遊樂設施旁的時尚女子肖像" },
  { id: "home-03", width: 2400, height: 1600, alt: "荒廢庭院中的女子時尚肖像" },
  { id: "home-04", width: 2400, height: 1600, alt: "木質室內空間裡的女子概念肖像" },
  { id: "home-05", width: 2400, height: 1600, alt: "紅門與藤蔓前的女子環境肖像" },
] as const satisfies readonly PortfolioImage[];

export const categories = {
  people: {
    key: "people",
    zh: "人物",
    en: "People",
    statement: "凝視、光線與城市邊緣，構成每一張人物的內在風景。",
    images: [
      { id: "people-01", width: 2048, height: 1365, alt: "紅綠霓虹光線中的女子近身肖像" },
      { id: "people-02", width: 1000, height: 1500, alt: "白色木牆前穿吊帶短褲的女子肖像" },
      { id: "people-03", width: 1000, height: 1500, alt: "紅色室內與老式音響前的女子肖像" },
      { id: "people-04", width: 1000, height: 1500, alt: "海岸遠景前穿藍色洋裝的女子肖像" },
      { id: "people-05", width: 1000, height: 1500, alt: "工業管線牆前的女子時尚肖像" },
      { id: "people-06", width: 1000, height: 1500, alt: "港灣夜色前的女子全身肖像" },
    ],
  },
  event: {
    key: "event",
    zh: "活動",
    en: "Event",
    statement: "在儀式與現場之間，保存那些不可重演的情緒與節奏。",
    images: [
      { id: "event-01", width: 3000, height: 2000, alt: "婚禮現場相擁而泣的兩位女子" },
      { id: "event-02", width: 3000, height: 2000, alt: "婚禮新人與家人的正式合影" },
      { id: "event-03", width: 3000, height: 2000, alt: "室內射箭競賽中持弓的年輕選手" },
      { id: "event-04", width: 3000, height: 2000, alt: "體育館內進行中的射箭競賽" },
      { id: "event-05", width: 3000, height: 2000, alt: "體育場草地上的大型儀隊表演" },
      { id: "event-06", width: 3000, height: 2000, alt: "儀隊表演前方的少年隊員" },
    ],
  },
  fashion: {
    key: "fashion",
    zh: "時尚",
    en: "Fashion",
    statement: "服裝、身體與場域互相定義，讓日常成為編輯語言。",
    images: [
      { id: "fashion-01", width: 6000, height: 4000, alt: "灰色幾何建築牆前的黑衣男子" },
      { id: "fashion-02", width: 6000, height: 4000, alt: "強烈日光與人影中的黑衣男子" },
      { id: "fashion-03", width: 6000, height: 4000, alt: "陰雲海岸岩石上的男裝時尚肖像" },
    ],
  },
  product: {
    key: "product",
    zh: "商品",
    en: "Product",
    statement: "精準控制質地、比例與留白，將物件轉化為品牌印象。",
    images: [
      { id: "product-01", width: 1365, height: 2048, alt: "黑衣模特兒手提黑色硬殼箱商品照" },
      { id: "product-02", width: 2048, height: 1365, alt: "白色背景上的彩色復古相機包系列" },
      { id: "product-03", width: 2048, height: 1365, alt: "粉藍皮革配件與皮夾系列商品照" },
      { id: "product-04", width: 2048, height: 1365, alt: "白色背景上的藍色透明跟鞋" },
      { id: "product-05", width: 3000, height: 2000, alt: "紫色包裝禮盒與點心系列商品照" },
      { id: "product-06", width: 2000, height: 2500, alt: "黑色背景上的紫色寶石戒指" },
      { id: "product-07", width: 2000, height: 3000, alt: "黑色背景上的珍珠鑽石耳環" },
      { id: "product-08", width: 2000, height: 3000, alt: "黑色背景上的銀白鑽飾珠寶" },
    ],
  },
  space: {
    key: "space",
    zh: "空間",
    en: "Space",
    statement: "以秩序、材質與人的尺度，重新閱讀建築及商業空間。",
    images: [
      { id: "space-01", width: 3504, height: 2336, alt: "高樓觀景空間與玻璃帷幕中的訪客" },
      { id: "space-02", width: 2048, height: 1365, alt: "木質天花與大理石櫃台的醫療接待區" },
      { id: "space-03", width: 2048, height: 1152, alt: "明亮醫療空間中的大型影像設備" },
      { id: "space-04", width: 2048, height: 1368, alt: "暖色木質陳列櫃的精品商店室內" },
    ],
  },
} as const satisfies Record<CategoryKey, Category>;

export const about = {
  awards: [
    "2017 Tokyo International Foto Awards, Book: Fine Art, Bronze",
    "2016 Prix de la Photographie Paris, People: Fine Art, Honorable Mention",
    "2015 Moscow International Foto Awards, Beauty, Honorable Mention",
    "2015 International Photography Awards, Editorial : Personality, Honorable Mention",
    "2015 International Photography Awards, Book(Self-published) : People, Honorable Mention",
    "2015 Prix de la Photographie Paris, People: Personality, Honorable Mention",
    "2014 Moscow International Foto Awards, Portrait, Honorable Mention",
    "2014 Photographer's Forum Best of Photography Contest, Portrait, Finalist",
    "2013 KL International Photoawards, Portrait, Finalist",
    "2008 NTDTV International Photography Competition, Portrait, Bronze Award",
  ],
  exhibitions: [
    "2017 A Joint Photography Exhibition of Yu, Hsiang and Lin, Yu Li @ Zhongshan Assembly Hall",
    "2016 Solo Exhibition @ Oven Coffee Zhishan",
    "2015 Solo Exhibition @ Moonlight Art",
  ],
  books: ["2017 Cinderellas"],
} as const;

export const navigation: ReadonlyArray<{ route: RouteKey; zh: string; en: string }> = [
  ...categoryOrder.map((key) => ({ route: key, zh: categories[key].zh, en: categories[key].en })),
  { route: "video", zh: "影片", en: "Video" },
  { route: "about", zh: "關於", en: "About" },
];

export const expectedCounts: Readonly<Record<"home" | CategoryKey, number>> = {
  home: 5,
  people: 6,
  event: 6,
  fashion: 3,
  product: 8,
  space: 4,
};

export function assertPortfolioManifest(): void {
  const actual = {
    home: homeImages.length,
    ...Object.fromEntries(categoryOrder.map((key) => [key, categories[key].images.length])),
  } as Record<"home" | CategoryKey, number>;

  for (const [key, expected] of Object.entries(expectedCounts)) {
    if (actual[key as keyof typeof actual] !== expected) {
      throw new Error(`Portfolio manifest mismatch for ${key}: expected ${expected}`);
    }
  }

  if (Object.values(actual).reduce((sum, count) => sum + count, 0) !== 32) {
    throw new Error("Portfolio manifest must contain exactly 32 works.");
  }
}

assertPortfolioManifest();

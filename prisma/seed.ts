// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始预置数据...')

  // 1. 预置社区数据（基础演示版）
  const communities = [
    // 港岛 - 中西区
    { code: '81010101', name: '中環', districtCode: '810101', districtName: '中西區', regionCode: '810100', regionName: '港島' },
    { code: '81010102', name: '半山東', districtCode: '810101', districtName: '中西區', regionCode: '810100', regionName: '港島' },
    { code: '81010103', name: '衛城', districtCode: '810101', districtName: '中西區', regionCode: '810100', regionName: '港島' },
    { code: '81010104', name: '山頂', districtCode: '810101', districtName: '中西區', regionCode: '810100', regionName: '港島' },
    { code: '81010105', name: '大學', districtCode: '810101', districtName: '中西區', regionCode: '810100', regionName: '港島' },
    { code: '81010106', name: '觀龍', districtCode: '810101', districtName: '中西區', regionCode: '810100', regionName: '港島' },
    { code: '81010107', name: '堅摩', districtCode: '810101', districtName: '中西區', regionCode: '810100', regionName: '港島' },
    { code: '81010108', name: '西環', districtCode: '810101', districtName: '中西區', regionCode: '810100', regionName: '港島' },
    { code: '81010109', name: '寶翠', districtCode: '810101', districtName: '中西區', regionCode: '810100', regionName: '港島' },
    { code: '81010110', name: '石塘咀', districtCode: '810101', districtName: '中西區', regionCode: '810100', regionName: '港島' },
    { code: '81010111', name: '西營盤', districtCode: '810101', districtName: '中西區', regionCode: '810100', regionName: '港島' },
    { code: '81010112', name: '上環', districtCode: '810101', districtName: '中西區', regionCode: '810100', regionName: '港島' },
    { code: '81010113', name: '東華', districtCode: '810101', districtName: '中西區', regionCode: '810100', regionName: '港島' },
    { code: '81010114', name: '正街', districtCode: '810101', districtName: '中西區', regionCode: '810100', regionName: '港島' },
    { code: '81010115', name: '水街', districtCode: '810101', districtName: '中西區', regionCode: '810100', regionName: '港島' },
    // 湾仔区
    { code: '81010201', name: '軒尼詩', districtCode: '810102', districtName: '灣仔', regionCode: '810100', regionName: '港島' },
    { code: '81010202', name: '愛群', districtCode: '810102', districtName: '灣仔', regionCode: '810100', regionName: '港島' },
    { code: '81010203', name: '鵝頸', districtCode: '810102', districtName: '灣仔', regionCode: '810100', regionName: '港島' },
    { code: '81010204', name: '銅鑼灣', districtCode: '810102', districtName: '灣仔', regionCode: '810100', regionName: '港島' },
    { code: '81010205', name: '維園', districtCode: '810102', districtName: '灣仔', regionCode: '810100', regionName: '港島' },
    { code: '81010206', name: '天后', districtCode: '810102', districtName: '灣仔', regionCode: '810100', regionName: '港島' },
    { code: '81010207', name: '大坑', districtCode: '810102', districtName: '灣仔', regionCode: '810100', regionName: '港島' },
    { code: '81010208', name: '渣甸山', districtCode: '810102', districtName: '灣仔', regionCode: '810100', regionName: '港島' },
    { code: '81010209', name: '樂活', districtCode: '810102', districtName: '灣仔', regionCode: '810100', regionName: '港島' },
    { code: '81010210', name: '跑馬地', districtCode: '810102', districtName: '灣仔', regionCode: '810100', regionName: '港島' },
    { code: '81010211', name: '司徒拔道', districtCode: '810102', districtName: '灣仔', regionCode: '810100', regionName: '港島' },
    { code: '81010212', name: '修頓', districtCode: '810102', districtName: '灣仔', regionCode: '810100', regionName: '港島' },
    { code: '81010213', name: '大佛口', districtCode: '810102', districtName: '灣仔', regionCode: '810100', regionName: '港島' },
    // 东区
    { code: '81010301', name: '太古城西', districtCode: '810103', districtName: '東區', regionCode: '810100', regionName: '港島' },
    { code: '81010302', name: '太古城東', districtCode: '810103', districtName: '東區', regionCode: '810100', regionName: '港島' },
    { code: '81010303', name: '鯉景灣', districtCode: '810103', districtName: '東區', regionCode: '810100', regionName: '港島' },
    { code: '81010304', name: '西灣河', districtCode: '810103', districtName: '東區', regionCode: '810100', regionName: '港島' },
    { code: '81010305', name: '愛秩序灣', districtCode: '810103', districtName: '東區', regionCode: '810100', regionName: '港島' },
    { code: '81010306', name: '筲箕灣', districtCode: '810103', districtName: '東區', regionCode: '810100', regionName: '港島' },
    { code: '81010307', name: '阿公岩', districtCode: '810103', districtName: '東區', regionCode: '810100', regionName: '港島' },
    { code: '81010308', name: '杏花邨', districtCode: '810103', districtName: '東區', regionCode: '810100', regionName: '港島' },
    { code: '81010309', name: '翠灣', districtCode: '810103', districtName: '東區', regionCode: '810100', regionName: '港島' },
    { code: '81010310', name: '欣藍', districtCode: '810103', districtName: '東區', regionCode: '810100', regionName: '港島' },
    { code: '81010311', name: '小西灣', districtCode: '810103', districtName: '東區', regionCode: '810100', regionName: '港島' },
    { code: '81010312', name: '景怡', districtCode: '810103', districtName: '東區', regionCode: '810100', regionName: '港島' },
    { code: '81010313', name: '環翠', districtCode: '810103', districtName: '東區', regionCode: '810100', regionName: '港島' },
    { code: '81010314', name: '翡翠', districtCode: '810103', districtName: '東區', regionCode: '810100', regionName: '港島' },
    { code: '81010315', name: '柏架山', districtCode: '810103', districtName: '東區', regionCode: '810100', regionName: '港島' },
    // 南区
    { code: '81010401', name: '香港仔', districtCode: '810104', districtName: '南區', regionCode: '810100', regionName: '港島' },
    { code: '81010402', name: '鴨脷洲邨', districtCode: '810104', districtName: '南區', regionCode: '810100', regionName: '港島' },
    { code: '81010403', name: '鴨脷洲北', districtCode: '810104', districtName: '南區', regionCode: '810100', regionName: '港島' },
    { code: '81010404', name: '利東一', districtCode: '810104', districtName: '南區', regionCode: '810100', regionName: '港島' },
    { code: '81010405', name: '利東二', districtCode: '810104', districtName: '南區', regionCode: '810100', regionName: '港島' },
    { code: '81010406', name: '海怡東', districtCode: '810104', districtName: '南區', regionCode: '810100', regionName: '港島' },
    { code: '81010407', name: '海怡西', districtCode: '810104', districtName: '南區', regionCode: '810100', regionName: '港島' },
    { code: '81010408', name: '華貴', districtCode: '810104', districtName: '南區', regionCode: '810100', regionName: '港島' },
    { code: '81010409', name: '華富南', districtCode: '810104', districtName: '南區', regionCode: '810100', regionName: '港島' },
    { code: '81010410', name: '華富北', districtCode: '810104', districtName: '南區', regionCode: '810100', regionName: '港島' },
    { code: '81010411', name: '薄扶林', districtCode: '810104', districtName: '南區', regionCode: '810100', regionName: '港島' },
    { code: '81010412', name: '置富', districtCode: '810104', districtName: '南區', regionCode: '810100', regionName: '港島' },
    { code: '81010413', name: '田灣', districtCode: '810104', districtName: '南區', regionCode: '810100', regionName: '港島' },
    { code: '81010414', name: '石漁', districtCode: '810104', districtName: '南區', regionCode: '810100', regionName: '港島' },
    { code: '81010415', name: '黃竹坑', districtCode: '810104', districtName: '南區', regionCode: '810100', regionName: '港島' },
    // 九龙 - 油尖旺
    { code: '81020101', name: '尖沙咀西', districtCode: '810201', districtName: '油尖旺', regionCode: '810200', regionName: '九龍' },
    { code: '81020102', name: '九龍站', districtCode: '810201', districtName: '油尖旺', regionCode: '810200', regionName: '九龍' },
    { code: '81020103', name: '佐敦西', districtCode: '810201', districtName: '油尖旺', regionCode: '810200', regionName: '九龍' },
    { code: '81020104', name: '油麻地南', districtCode: '810201', districtName: '油尖旺', regionCode: '810200', regionName: '九龍' },
    { code: '81020105', name: '富榮', districtCode: '810201', districtName: '油尖旺', regionCode: '810200', regionName: '九龍' },
    { code: '81020106', name: '旺角西', districtCode: '810201', districtName: '油尖旺', regionCode: '810200', regionName: '九龍' },
    { code: '81020107', name: '富柏', districtCode: '810201', districtName: '油尖旺', regionCode: '810200', regionName: '九龍' },
    { code: '81020108', name: '奧運', districtCode: '810201', districtName: '油尖旺', regionCode: '810200', regionName: '九龍' },
    { code: '81020109', name: '櫻桃', districtCode: '810201', districtName: '油尖旺', regionCode: '810200', regionName: '九龍' },
    { code: '81020110', name: '大角咀南', districtCode: '810201', districtName: '油尖旺', regionCode: '810200', regionName: '九龍' },
    // 新界 - 沙田区（部分）
    { code: '81030301', name: '沙田市中心', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030302', name: '瀝源', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030303', name: '禾輋邨', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030304', name: '第一城', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030305', name: '愉城', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030306', name: '王屋', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030307', name: '沙角', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030308', name: '博康', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030309', name: '水泉澳', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030310', name: '乙泉', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030311', name: '秦豐', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030312', name: '新田圍', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030313', name: '翠田', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030314', name: '顯嘉', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030315', name: '下城門', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030316', name: '雲城', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030317', name: '徑口', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030318', name: '田心', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030319', name: '翠嘉', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030320', name: '大圍', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030321', name: '松田', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030322', name: '穗禾', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030323', name: '火炭', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030324', name: '駿馬', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030325', name: '海嵐', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030326', name: '頌安', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030327', name: '錦濤', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030328', name: '馬鞍山市中心', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030329', name: '烏溪沙', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030330', name: '利安', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030331', name: '富龍', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030332', name: '錦英', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030333', name: '耀安', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030334', name: '恆安', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030335', name: '大水坑', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
    { code: '81030336', name: '鞍泰', districtCode: '810303', districtName: '沙田區', regionCode: '810300', regionName: '新界' },
  ]

  for (const c of communities) {
    await prisma.community.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    })
  }
  console.log(`✅ 已预置 ${communities.length} 个社区`)

  // 2. 预置行业分类
  const categories = [
    { code: 'info', name: '資訊服務', level: 1 },
    { code: 'trade', name: '物品交易', level: 1 },
    { code: 'biz', name: '商業服務', level: 1 },
    { code: 'community', name: '社區服務', level: 1 },
    { code: 'edu', name: '教育服務', level: 1 },
    { code: 'health', name: '醫療健康', level: 1 },
    { code: 'booking', name: '預約服務', level: 1 },
    { code: 'entertainment', name: '娛樂休閒', level: 1 },
    { code: 'property', name: '房產與交通', level: 1 },
    { code: 'others', name: '其他核心分類', level: 1 },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { code: cat.code },
      update: {},
      create: cat,
    })
  }
  console.log(`✅ 已预置 ${categories.length} 个行业分类`)

  // 3. 预置分会类型配置
  const branchTypes = [
    { type: MEDIATION, label: '調解分會', description: '處理社區糾紛調解', requireCategory: false },
    { type: LEGAL, label: '法律服務分會', description: '提供法律諮詢與援助', requireCategory: false },
    { type: CHARITY, label: '慈善分會', description: '組織慈善活動與物資捐贈', requireCategory: false },
    { type: COMMUNITY, label: '社區分會', description: '服務特定社區居民', requireCategory: false },
    { type: PROFESSIONAL, label: '專業分會', description: '行業專業人士聯合會', requireCategory: true },
    { type: SUPPLY_CHAIN, label: '供應鏈分會', description: '供應鏈與貿易合作', requireCategory: false },
  ]

  for (const bt of branchTypes) {
    await prisma.branchTypeConfig.upsert({
      where: { type: bt.type },
      update: {},
      create: bt,
    })
  }
  console.log(`✅ 已预置 ${branchTypes.length} 个分会类型`)

  console.log('🎉 数据预置完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
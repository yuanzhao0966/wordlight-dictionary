"use strict";

const curatedFamilies = [
  [
    ["light","n","光；光线","Warm light filled the kitchen.","温暖的光线洒满了厨房。"],
    ["light","v","点亮；点燃","Light a candle before the guests arrive.","客人到之前点一支蜡烛。"],
    ["light","adj","轻的；明亮的","I packed a light bag for the trip.","我为这趟旅行收拾了一个轻便的包。"],
    ["lighten","v","使变亮；使变轻；减轻","Paint the walls white to lighten the room.","把墙刷成白色，让房间更亮。"],
    ["lightness","n","轻盈；重量轻","The lightness of the jacket makes it easy to carry.","这件夹克很轻，携带起来很方便。"],
    ["lightly","adv","轻轻地；轻微地","Tap the screen lightly.","轻轻点一下屏幕。"],
    ["lighting","n","照明；灯光布置","The soft lighting makes the room feel cozy.","柔和的灯光让房间显得很温馨。"],
  ],
  [
    ["decide","v","决定；作出选择","We need to decide where to eat.","我们需要决定去哪儿吃饭。"],
    ["decision","n","决定；选择","She made a decision after talking to her family.","和家人商量后，她作出了决定。"],
    ["decisive","adj","果断的；决定性的","The captain took decisive action.","队长采取了果断行动。"],
    ["decisively","adv","果断地；决定性地","He acted decisively when the plan failed.","计划失败时，他采取了果断行动。"],
    ["indecisive","adj","优柔寡断的","I get indecisive when there are too many choices.","选择太多时，我会犹豫不决。"],
  ],
  [
    ["happy","adj","快乐的；高兴的","I'm happy to see you again.","我很高兴再次见到你。"],
    ["happiness","n","快乐；幸福","Music brings her a lot of happiness.","音乐给她带来了很多快乐。"],
    ["happily","adv","高兴地；愉快地","They chatted happily over lunch.","他们午餐时聊得很开心。"],
    ["unhappy","adj","不开心的；不满意的","He was unhappy with the result.","他对结果不满意。"],
    ["unhappiness","n","不愉快；不幸福","She spoke honestly about her unhappiness.","她坦诚地谈起自己的不快乐。"],
  ],
  [
    ["beauty","n","美；美丽","We admired the beauty of the mountains.","我们欣赏着群山之美。"],
    ["beautiful","adj","美丽的；美好的","What a beautiful garden!","多美的花园啊！"],
    ["beautifully","adv","优美地；出色地","She sang beautifully at the concert.","她在音乐会上唱得很动听。"],
    ["beautify","v","美化；使更好看","The neighbors planted trees to beautify the street.","邻居们种树来美化这条街。"],
  ],
  [
    ["learn","v","学习；学会","I want to learn how to cook.","我想学做饭。"],
    ["learner","n","学习者","This book is useful for English learners.","这本书对英语学习者很有用。"],
    ["learning","n","学习；学识","Online learning gives her more flexibility.","线上学习让她有更多安排时间的自由。"],
    ["learned","adj","博学的；有学问的","A learned professor gave the lecture.","一位博学的教授作了这场讲座。"],
  ],
  [
    ["create","v","创造；创作","They create games for children.","他们为孩子们制作游戏。"],
    ["creation","n","创作；创造；作品","The sculpture is her latest creation.","这座雕塑是她的最新作品。"],
    ["creator","n","创作者；创造者","The creator of the app answered our questions.","这款应用的创作者回答了我们的问题。"],
    ["creative","adj","有创造力的；富有创意的","We need a creative solution.","我们需要一个有创意的解决办法。"],
    ["creatively","adv","有创意地","The students used the materials creatively.","学生们很有创意地使用了这些材料。"],
    ["creativity","n","创造力；创意","The project gives children room for creativity.","这个项目给孩子们留出了发挥创造力的空间。"],
  ],
  [
    ["success","n","成功；成功的人或事","The event was a great success.","这次活动很成功。"],
    ["succeed","v","成功；达到目的","She worked hard to succeed.","她为了成功而努力。"],
    ["successful","adj","成功的","They built a successful business.","他们创办了一家成功的企业。"],
    ["successfully","adv","成功地","We successfully completed the project.","我们成功完成了项目。"],
  ],
  [
    ["act","v","行动；表演","We need to act quickly.","我们需要迅速行动。"],
    ["action","n","行动；行为","The team took action immediately.","团队立即采取了行动。"],
    ["actor","n","演员","He became an actor after college.","大学毕业后，他成了一名演员。"],
    ["active","adj","活跃的；积极的","She plays an active role in the club.","她在俱乐部里发挥着积极作用。"],
    ["actively","adv","积极地；主动地","They actively look for new ideas.","他们积极寻找新点子。"],
    ["activity","n","活动；行为","Swimming is my favorite outdoor activity.","游泳是我最喜欢的户外活动。"],
  ],
  [
    ["develop","v","发展；开发","The team will develop a new app.","团队将开发一款新应用。"],
    ["developer","n","开发者；开发商","She works as a software developer.","她是一名软件开发人员。"],
    ["development","n","发展；开发；进展","The development of the app took six months.","这款应用的开发耗时六个月。"],
    ["developmental","adj","发展的；发育的","The doctor checked the child's developmental progress.","医生检查了孩子的发育进展。"],
  ],
  [
    ["educate","v","教育；培养","The campaign aims to educate people about recycling.","这项活动旨在向人们普及回收知识。"],
    ["education","n","教育；培养","Every child deserves a good education.","每个孩子都应该接受良好的教育。"],
    ["educator","n","教育工作者","She is an experienced educator.","她是一位经验丰富的教育工作者。"],
    ["educational","adj","教育的；有教育意义的","The museum runs educational programs.","博物馆开设了教育项目。"],
  ],
  [
    ["help","v","帮助；帮忙","Could you help me carry this box?","你能帮我搬这个箱子吗？"],
    ["help","n","帮助；援助","Thank you for your help.","谢谢你的帮助。"],
    ["helper","n","帮手；助手","My little helper set the table.","我的小帮手摆好了餐具。"],
    ["helpful","adj","有帮助的；乐于助人的","Your advice was very helpful.","你的建议很有帮助。"],
    ["helpless","adj","无助的","I felt helpless when I lost my phone abroad.","在国外弄丢手机时，我感到很无助。"],
    ["helpfully","adv","热心地；有帮助地","She helpfully showed us where to park.","她热心地告诉我们可以在哪里停车。"],
  ],
  [
    ["run","v","跑；运行；经营","I run in the park before work.","我上班前在公园跑步。"],
    ["runner","n","跑步者；赛跑运动员","The runner crossed the finish line first.","这名跑步者第一个冲过终点线。"],
    ["running","n","跑步；运转","Running helps me clear my mind.","跑步能帮我理清思绪。"],
    ["running","adj","流动的；运行着的","The house has running water.","这栋房子有自来水。"],
    ["runnable","adj","可运行的","The developer shared a runnable example.","开发者分享了一个可以运行的示例。"],
  ],
  [
    ["book","n","书；账簿","I borrowed a book from the library.","我从图书馆借了一本书。"],
    ["book","v","预订；预约","We booked a table for six.","我们订了一张六人桌。"],
    ["booking","n","预订；预约","I received an email confirming my booking.","我收到了一封确认预订的邮件。"],
    ["bookable","adj","可预订的","These seats are bookable online.","这些座位可以在网上预订。"],
    ["bookish","adj","爱读书的；书呆子气的","She was quiet and bookish as a child.","她小时候很安静，也很爱读书。"],
  ],
  [
    ["employ","v","雇用；使用","The company employs fifty people.","这家公司雇用了五十人。"],
    ["employee","n","雇员；员工","Every employee received a copy of the guide.","每位员工都拿到了一份指南。"],
    ["employer","n","雇主","Her new employer offers flexible hours.","她的新雇主提供弹性工作时间。"],
    ["employment","n","就业；雇用","The course helped him find employment.","这门课帮助他找到了工作。"],
    ["employable","adj","有就业能力的；适合雇用的","The training made the graduates more employable.","这项培训提高了毕业生的就业能力。"],
  ],
];

const familyByWord = new Map();
const wordVisuals = new Map([
  ["light",["visual-light","卡通示意：阳光从窗户照进来，表示光线"]],
  ["run",["visual-run","卡通示意：一个人正在跑步"]],
  ["runner",["visual-run","卡通示意：一名跑步者正在向前跑"]],
  ["running",["visual-run","卡通示意：一个人正做跑步动作"]],
  ["book",["visual-book","卡通示意：桌上放着一本摊开的书"]],
  ["butterfly",["visual-butterfly","卡通示意：一只蝴蝶落在一朵花上"]],
]);
for (const family of curatedFamilies) {
  for (const [word] of family) {
    if (!familyByWord.has(word)) familyByWord.set(word, []);
    if (!familyByWord.get(word).includes(family)) familyByWord.get(word).push(family);
  }
}

function getWordFamily(word, dictionary) {
  const rows = (familyByWord.get(word) ?? []).flat();
  const source = Object.hasOwn(dictionary,word) ? dictionary[word] : null;
  const parts = source?.[1].filter(([pos])=>pos!=="other") ?? [];
  if (source?.[3]?.length && parts.length===1) {
    const [pos,meaning] = parts[0];
    if (["n","v","adj","adv"].includes(pos)) rows.push([word,pos,meaning,...source[3][0]]);
  }
  for (const [term, pos] of globalThis.wordFamilyLinks?.[word] ?? []) {
    const entry = dictionary[term];
    const meaning = entry?.[1].find(item=>item[0]===pos)?.[1];
    const example = entry?.[3]?.[0];
    if (meaning && example) rows.push([term,pos,meaning,...example]);
  }
  const seen = new Set();
  return rows.filter(([term,pos])=>{
    const key = term+":"+pos;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

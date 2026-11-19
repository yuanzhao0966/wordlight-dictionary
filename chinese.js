"use strict";

const chinesePhrases = {
  "开心": [
    ["happy","最常见，表示心情愉快","I felt happy after talking to you.","和你聊过以后，我觉得很开心。"],
    ["glad","常用于听到好消息或见到某人","I'm glad you could come.","我很开心你能来。"],
    ["delighted","比 happy 更强烈","She was delighted to hear the news.","她听到这个消息特别开心。"],
    ["have fun","指做一件事时玩得开心","We had fun at the party.","我们在聚会上玩得很开心。"]
  ],
  "努力": [
    ["work hard","投入时间和精力","She works hard to improve her English.","她努力提高自己的英语水平。"],
    ["make an effort","强调愿意为某事付出努力","He made an effort to arrive on time.","他努力做到准时到达。"],
    ["do your best","尽自己所能","Just do your best and see what happens.","尽力而为，看看结果怎样。"]
  ],
  "谢谢": [
    ["Thanks!","简短、口语","Thanks for your help!","谢谢你的帮助！"],
    ["Thank you.","通用","Thank you for waiting.","谢谢你等我。"],
    ["I appreciate it.","强调感谢对方做的事","I really appreciate your advice.","我真的很感谢你的建议。"]
  ],
  "你好": [
    ["Hello!","通用问候","Hello! It's nice to meet you.","你好！很高兴认识你。"],
    ["Hi!","轻松、口语","Hi! How's it going?","你好！最近怎么样？"],
    ["Hey!","熟人之间的随意问候","Hey! Good to see you.","嗨！见到你真好。"]
  ],
  "没关系": [
    ["No worries.","轻松地回应道歉","No worries. It happens.","没关系，这种事难免。"],
    ["It's okay.","通用","It's okay. We still have time.","没关系，我们还有时间。"],
    ["That's all right.","礼貌地表示不介意","That's all right. I can wait.","没关系，我可以等。"]
  ],
  "很高兴认识你": [
    ["Nice to meet you.","初次见面，最常用","Hi, I'm Alex. Nice to meet you.","你好，我是亚历克斯。很高兴认识你。"],
    ["Pleased to meet you.","更正式","Pleased to meet you, Ms. Chen.","陈女士，很高兴认识您。"],
    ["It's great to meet you.","更热情","It's great to meet you in person.","很高兴能和你见面。"]
  ],
  "我喜欢你": [
    ["I like you.","直接表达喜欢","I like you, and I enjoy spending time with you.","我喜欢你，也喜欢和你在一起。"],
    ["I'm fond of you.","语气温柔，侧重喜爱","I've grown quite fond of you.","我越来越喜欢你了。"],
    ["I'm into you.","口语，通常表示有好感","To be honest, I'm really into you.","说实话，我真的对你有好感。"]
  ],
  "再见": [
    ["Goodbye.","通用告别","Goodbye, and have a safe trip.","再见，祝你一路平安。"],
    ["See you later!","日常、口语","See you later! I'll text you tonight.","回头见！我今晚给你发消息。"],
    ["Take care!","告别时表示关心","Take care, and keep in touch.","保重，保持联系。"]
  ],
  "不好意思": [
    ["Excuse me.","打扰别人或引起注意","Excuse me, is this seat taken?","不好意思，这个座位有人吗？"],
    ["Sorry about that.","为刚发生的事道歉","I sent the wrong file. Sorry about that.","我发错文件了，不好意思。"],
    ["I'm sorry.","通用道歉","I'm sorry I'm late.","不好意思，我迟到了。"]
  ],
  "我不知道": [
    ["I don't know.","直接说不知道","I don't know where she went.","我不知道她去了哪里。"],
    ["I'm not sure.","语气比较委婉","I'm not sure what time it starts.","我不确定几点开始。"],
    ["I have no idea.","强调完全不知道","I have no idea how this happened.","我完全不知道这事是怎么发生的。"]
  ],
  "加油": [
    ["You can do it!","给正在努力的人打气","Keep going. You can do it!","继续努力，你能做到！"],
    ["Keep it up!","鼓励对方保持好状态","You're making great progress. Keep it up!","你进步很大，继续加油！"],
    ["Go for it!","鼓励对方大胆尝试","If you really want to apply, go for it!","如果你真的想申请，就大胆去试吧！"]
  ],
  "辛苦了": [
    ["Thanks for all your hard work.","感谢对方付出的努力","Thanks for all your hard work on this project.","这个项目辛苦你了。"],
    ["I really appreciate your effort.","认可对方的投入","I really appreciate your effort this week.","这周辛苦你了。"],
    ["You did a great job.","侧重肯定工作成果","You did a great job handling that situation.","你把那件事处理得很好，辛苦了。"]
  ],
  "我爱你": [
    ["I love you.","直接表达爱意","I love you more than words can say.","我爱你，言语无法表达。"],
    ["I'm in love with you.","强调浪漫爱意","I think I'm in love with you.","我想我爱上你了。"],
    ["You mean the world to me.","强调对方非常重要","You mean the world to me, and I'm glad we met.","你对我来说无比重要，我很高兴我们相识。"]
  ],
};

const hanPattern = /\p{Script=Han}/u;
const glossSeparator = /[，,、；;。！!？?：:\n/]+/g;
const glossAnnotations = /[（(][^()（）]*[）)]|\[.*?\]|【.*?】/g;
function chineseKey(value) {
  return value.replace(/[\s。！!？?，,；;]+$/g,"").replace(/\s+/g,"");
}

let chineseGlosses;
function matchChinese(query) {
  if (!chineseGlosses) {
    chineseGlosses = new Map();
    for (const [word, entry] of Object.entries(globalThis.lexicon ?? {})) {
      for (const [pos, meaning] of entry[1]) {
        const terms = meaning.replace(glossAnnotations,"").split(glossSeparator);
        for (const term of new Set(terms.map(chineseKey))) {
          if (!hanPattern.test(term) || term.length > 24) continue;
          if (!chineseGlosses.has(term)) chineseGlosses.set(term, []);
          chineseGlosses.get(term).push({word,pos,meaning,rank:entry[2],exact:true});
        }
      }
    }
  }
  const candidates = [...(chineseGlosses.get(query) ?? [])];
  if (candidates.length < 5 && query.length >= 2) {
    for (const [term, matches] of chineseGlosses) {
      if (term !== query && term.length <= query.length + 5 && term.includes(query)) {
        candidates.push(...matches.map(item=>({...item,exact:false})));
      }
    }
  }
  const seen = new Set();
  return candidates.sort((a,b)=>Number(b.exact)-Number(a.exact) || a.rank-b.rank || a.word.length-b.word.length)
    .filter(item=>{
      if (seen.has(item.word)) return false;
      seen.add(item.word);
      return true;
    }).slice(0,8);
}

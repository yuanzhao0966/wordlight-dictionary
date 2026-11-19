"use strict";

const query = document.querySelector("#query");
const results = document.querySelector("#results");
const info = document.querySelector("#info");
const install = document.querySelector("#install");
const posNames = {n:["n.","名词"],v:["v.","动词"],adj:["adj.","形容词"],adv:["adv.","副词"],prep:["prep.","介词"],conj:["conj.","连词"],pron:["pron.","代词"],int:["interj.","感叹词"],det:["det.","限定词"],art:["art.","冠词"],num:["num.","数词"],aux:["aux.","助动词"],modal:["modal","情态动词"],abbr:["abbr.","缩写"],pref:["prefix","前缀"],suff:["suffix","后缀"],other:["","释义"]};
const lexicon = globalThis.lexicon ?? {};
const featured = globalThis.featured;
const words = [...new Set([...Object.keys(featured), ...Object.keys(lexicon), ...familyByWord.keys()])];
const byLength = new Map();
for (const word of words) {
  if (!byLength.has(word.length)) byLength.set(word.length, []);
  byLength.get(word.length).push(word);
}
const normalize = value => value.normalize("NFKC").trim().toLowerCase().replace(/[‘’]/g,"'").replace(/\s+/g," ");
const hasWord = word => Object.hasOwn(featured, word) || Object.hasOwn(lexicon, word) || familyByWord.has(word);
const knownTypos = {recieve:"receive",teh:"the",hte:"the",wierd:"weird",enviroment:"environment",definately:"definitely",accomodate:"accommodate",seperate:"separate",becuase:"because",beutiful:"beautiful",neccessary:"necessary",aple:"apple",helo:"hello",ligh:"light",helllo:"hello",serendipty:"serendipity",goverment:"government",grammer:"grammar",pronounciation:"pronunciation"};
const simpleForms = word => [word+"s",word+"es",word+"ed",word+"ing",word+"d",word+"n",word+"ning",word+"ted",word.replace(/e$/,"")+"ing",word.replace(/y$/,"ies"),word.replace(/y$/,"ied")];

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function distance(a, b) {
  let older = [];
  let previous = Array.from({length:b.length+1}, (_, j) => j);
  for (let i=1; i<=a.length; i++) {
    const row = [i];
    for (let j=1; j<=b.length; j++) {
      row[j] = Math.min(row[j-1]+1, previous[j]+1, previous[j-1]+(a[i-1]!==b[j-1]));
      if (i>1 && j>1 && a[i-1]===b[j-2] && a[i-2]===b[j-1]) row[j] = Math.min(row[j],older[j-2]+1);
    }
    older = previous;
    previous = row;
  }
  return previous[b.length];
}

function suggestions(word) {
  if (word.length > 32) return [];
  const limit = word.length <= 4 ? 1 : word.length <= 8 ? 2 : 3;
  const typo = Object.hasOwn(knownTypos, word) ? knownTypos[word] : "";
  const candidates = [];
  for (let len=Math.max(1,word.length-limit); len<=word.length+limit; len++) {
    for (const item of byLength.get(len) ?? []) {
      const edits = distance(word,item);
      if (edits > limit) continue;
      const rank = Object.hasOwn(lexicon,item) ? lexicon[item][2] : 750;
      const score = edits*2.5 + (item[0] !== word[0] ? .6 : 0) + Math.log10(rank+1)*.52;
      candidates.push({item,score: item === typo ? -1 : score});
    }
  }
  if (typo && hasWord(typo) && !candidates.some(({item})=>item===typo)) candidates.push({item:typo,score:-1});
  return candidates.sort((a,b)=>a.score-b.score || a.item.localeCompare(b.item)).slice(0,5).map(({item})=>item);
}

function speak(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function example(en, zh, word, credit) {
  const block = element("blockquote","example");
  const english = element("p");
  english.lang = "en";
  const forms = new Set([word,...simpleForms(word),...(word==="light"?["lit"]:[]),...(word==="spring"?["sprang"]:[])]);
  if (credit && en.toLowerCase().includes(word) && word.includes(" ")) {
    const start = en.toLowerCase().indexOf(word);
    english.append(en.slice(0,start),element("mark","",en.slice(start,start+word.length)),en.slice(start+word.length));
  } else {
    for (const fragment of en.split(/([a-z]+(?:['’][a-z]+)?)/ig)) {
      english.append(forms.has(fragment.toLowerCase()) ? element("mark","",fragment) : fragment);
    }
  }
  block.append(english,element("p","",zh));
  if (credit) {
    const cite = element("figcaption","attribution");
    const link = element("a","","Tatoeba · "+credit);
    link.href = "https://tatoeba.org/en/sentences/show/"+credit.match(/^\d+/)?.[0];
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    cite.append(link);
    const figure = element("figure","example-figure");
    figure.append(block,cite);
    return figure;
  }
  return block;
}

function renderEntry(word) {
  const local = Object.hasOwn(featured,word) ? featured[word] : null;
  const imported = Object.hasOwn(lexicon,word) ? lexicon[word] : null;
  const senses = local ? [...local[1]] : [];
  const preferred = new Set(senses.map(([pos])=>pos));
  for (const sense of imported?.[1] ?? []) {
    if (!preferred.has(sense[0]) && !(sense[0]==="other" && senses.length)) senses.push(sense);
  }
  if (!senses.length) {
    for (const [term,...sense] of getWordFamily(word,lexicon)) if (term===word) senses.push(sense);
  }
  const card = element("article","entry");
  const head = element("div","entry-head");
  const label = element("div");
  const title = element("h2","",word);
  title.lang = "en";
  label.append(title);
  const phonetic = local?.[0] || imported?.[0];
  if (phonetic) label.append(element("p","","/"+phonetic+"/"));
  const audio = element("button","icon-button");
  audio.type = "button";
  audio.setAttribute("aria-label","播放 "+word+" 的发音");
  audio.title = "播放发音";
  audio.append(document.querySelector("#audio-icon").content.cloneNode(true));
  audio.disabled = !("speechSynthesis" in window);
  audio.addEventListener("click",()=>speak(word));
  const tools = element("div","entry-tools");
  const visual = wordVisuals.get(word);
  if (visual) {
    const [position,alt] = visual;
    const illustration = element("div","word-visual "+position);
    illustration.setAttribute("role","img");
    illustration.setAttribute("aria-label",alt);
    tools.append(illustration);
  }
  tools.append(audio);
  head.append(label,tools);
  card.append(head);
  for (const [kind,meaning,en,zh] of senses) {
    const sense = element("section","sense");
    const [short,long] = posNames[kind] ?? posNames.other;
    const heading = element("h3","sense-title");
    if (short) heading.append(element("span","pos",short));
    heading.append(element("span","",long));
    sense.append(heading,element("p","meaning",meaning));
    if (en) sense.append(example(en,zh,word));
    card.append(sense);
  }
  if (!senses.some(([, ,en])=>en) || senses.some(([, ,en])=>!en) && imported?.[3]?.length) {
    const section = element("section","sense");
    section.append(element("h3","sense-title","双语例句"));
    if (!imported?.[3]?.length) section.append(element("p","example-empty","这个词暂时没有收录双语例句。"));
    for (const [en,zh,credit] of imported?.[3] ?? []) section.append(example(en,zh,word,credit));
    card.append(section);
  }
  card.append(renderWordFamily(word));
  results.append(card);
}

function renderWordFamily(word) {
  const rows = getWordFamily(word,lexicon);
  const section = element("section","sense family");
  section.append(element("h3","family-title","衍生词"));
  const filters = element("div","family-filters");
  filters.setAttribute("role","group");
  filters.setAttribute("aria-label","选择衍生词词性");
  const list = element("div","family-list");
  list.setAttribute("aria-live","polite");
  const choices = [["all","全部"],["n","名词"],["v","动词"],["adj","形容词"],["adv","副词"]];
  const buttons = [];
  for (const [pos,label] of choices) {
    const button = element("button","chip",label);
    button.type = "button";
    button.addEventListener("click",()=>show(pos));
    buttons.push(button);
    filters.append(button);
  }
  function show(kind) {
    for (let i=0;i<buttons.length;i++) buttons[i].setAttribute("aria-pressed",String(choices[i][0]===kind));
    list.replaceChildren();
    const matches = rows.filter(([term,pos])=>kind==="all" ? term!==word : pos===kind);
    if (!matches.length) {
      const name = choices.find(([pos])=>pos===kind)[1];
      list.append(element("p","family-empty",kind==="all" ? "暂未收录这个词的衍生词和例句。" : "暂未收录对应的"+name+"形式和例句。"));
      return;
    }
    for (const [term,pos,meaning,en,zh,credit] of matches) {
      const row = element("div","family-row");
      const title = element("h4","sense-title expression");
      const link = element(term===word?"span":"button",term===word?"":"word-link",term);
      link.lang = "en";
      if (term!==word) {
        link.type = "button";
        link.addEventListener("click",()=>lookup(term,true));
      }
      title.append(link,element("span","pos",posNames[pos][0]));
      if (term===word) title.append(element("span","similar-gloss","原词拼写"));
      row.append(title,element("p","meaning",meaning),example(en,zh,term,credit));
      list.append(row);
    }
  }
  section.append(filters,list);
  show("all");
  return section;
}

function notice(title, message, candidates=[]) {
  const card = element("div","notice");
  card.append(element("h2","",title),element("p","",message));
  if (candidates.length) {
    const buttons = element("div","suggestions");
    for (const word of candidates) {
      const button = element("button","chip",word);
      button.lang = "en";
      button.type = "button";
      button.addEventListener("click",()=>lookup(word,true));
      buttons.append(button);
    }
    card.append(buttons);
  }
  results.append(card);
}

function renderChinese(value) {
  const key = chineseKey(value);
  const phrases = chinesePhrases[key];
  const matches = phrases ? [] : matchChinese(key);
  if (!phrases && !matches.length) {
    notice("没有找到 “"+value+"”","可以试试更短的中文词语或常用短语。");
    return;
  }
  const card = element("article","entry");
  const head = element("div","entry-head");
  const label = element("div");
  label.append(element("h2","",value),element("p","",phrases?"常用英文表达":"词典中的英文候选"));
  head.append(label);
  card.append(head);
  if (phrases) {
    for (const [english,usage,en,zh] of phrases) {
      const sense = element("section","sense");
      const heading = element("h3","sense-title expression",english);
      heading.lang = "en";
      sense.append(heading,element("p","meaning",usage),example(en,zh,""));
      card.append(sense);
    }
  } else {
    for (const {word,pos,meaning,exact} of matches) {
      const sense = element("section","sense");
      const heading = element("h3","sense-title expression");
      const button = element("button","word-link",word);
      button.type = "button";
      button.lang = "en";
      button.addEventListener("click",()=>lookup(word,true));
      heading.append(button);
      const short = posNames[pos]?.[0];
      if (short) heading.append(element("span","pos",short));
      if (!exact) heading.append(element("span","similar-gloss","相关释义"));
      sense.append(heading,element("p","meaning",meaning));
      const localExample = Object.hasOwn(featured,word) ? featured[word][1].find(item=>item[0]===pos && item[2]) : null;
      const corpusExample = lexicon[word][3]?.[0];
      if (localExample) sense.append(example(localExample[2],localExample[3],word));
      else if (corpusExample) sense.append(example(corpusExample[0],corpusExample[1],word,corpusExample[2]));
      card.append(sense);
    }
  }
  results.append(card);
}

function lookup(value, updateQuery=false) {
  const trimmed = value.trim();
  const word = normalize(trimmed);
  if (updateQuery) query.value = trimmed;
  results.replaceChildren();
  if (!word) {
    notice("输入英文或中文词语","可以先试试搜索 light、谢谢或开心。");
    query.focus();
    return;
  }
  if (hanPattern.test(word)) {
    renderChinese(word);
    return;
  }
  if (!/^[a-z][a-z .'-]*$/.test(word)) {
    notice("请输入英文或中文词语","例如 light、谢谢或开心。");
    return;
  }
  if (hasWord(word)) {
    renderEntry(word);
    return;
  }
  const matches = suggestions(word);
  if (!matches.length) {
    notice("没有找到 “"+word+"”","请检查拼写，或试试单词的原形。");
    return;
  }
  notice("你是不是想查 “"+matches[0]+"”？","未找到 “"+word+"”。以下先显示最接近的结果。",matches);
  renderEntry(matches[0]);
}

document.querySelector("#lookup").addEventListener("submit",event=>{
  event.preventDefault();
  lookup(query.value);
});
for (const button of document.querySelectorAll("[data-word]")) {
  button.addEventListener("click",()=>lookup(button.dataset.word,true));
}

function dialog(title,...items) {
  document.querySelector("#dialog-title").textContent = title;
  document.querySelector("#dialog-copy").replaceChildren(...items);
  info.showModal();
}

function sourceLink(label,href) {
  const link = element("a","",label);
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

document.querySelector("#sources").addEventListener("click",()=>{
  const dictionary = element("p");
  dictionary.append("词性、音标与中文释义参考 ",sourceLink("ECDICT","https://github.com/skywind3000/ECDICT"),"（",sourceLink("MIT 许可","ECDICT-LICENSE.txt"),"），收录 "+words.length.toLocaleString("zh-CN")+" 个词条。");
  const sentences = element("p");
  sentences.append("部分双语例句由词灯编写，其余选自 ",sourceLink("Tatoeba","https://tatoeba.org/"),"（",sourceLink("CC BY 2.0 FR","https://creativecommons.org/licenses/by/2.0/fr/"),"）。语料由 ",sourceLink("ManyThings","https://www.manythings.org/anki/")," 整理，作者见例句下方。");
  const derivatives = element("p");
  derivatives.append("衍生词由词灯整理，并参考 ",sourceLink("Princeton WordNet","https://wordnet.princeton.edu/"),"（",sourceLink("WordNet 许可","WORDNET-LICENSE.txt"),"）。");
  dialog("词库来源",dictionary,sentences,derivatives);
});

let installPrompt;
if (matchMedia("(display-mode: standalone)").matches || location.protocol === "file:" || location.hostname === "wordlight.local") install.hidden = true;
window.addEventListener("beforeinstallprompt",event=>{
  event.preventDefault();
  installPrompt = event;
});
window.addEventListener("appinstalled",()=>{install.hidden = true;});
install.addEventListener("click",async ()=>{
  if (installPrompt) {
    await installPrompt.prompt();
    installPrompt = null;
    return;
  }
  dialog("安装词灯",
    element("p","","电脑：在 Chrome 或 Edge 的地址栏或浏览器菜单中，选择“安装词灯”或“将此站点安装为应用”。"),
    element("p","","手机：在 Safari 或 Chrome 的分享或浏览器菜单中，选择“添加到主屏幕”。"));
});
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol) && location.hostname !== "wordlight.local") {
  navigator.serviceWorker.register("./sw.js").catch(()=>{});
}
renderEntry("light");

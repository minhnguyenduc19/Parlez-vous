import fs from 'fs';

const topicsContent = fs.readFileSync('src/data/topics.ts', 'utf-8');

const match = topicsContent.match(/export const topics: Topic\[\] = (\[[\s\S]*\]);?/);
if (!match) {
  console.error("Could not find topics array");
  process.exit(1);
}

let topicsStr = match[1];
let topics;
eval("topics = " + topicsStr);

const getCategory = (titleEn: string) => {
  const t = titleEn.toLowerCase();
  if (t.includes('travel') || t.includes('tourism') || t.includes('transport') || t.includes('map') || t.includes('mountain') || t.includes('city')) return 'Travel';
  if (t.includes('food') || t.includes('gastronomy') || t.includes('cheese') || t.includes('pasta') || t.includes('beverage')) return 'Food';
  if (t.includes('culture') || t.includes('art') || t.includes('history') || t.includes('religion') || t.includes('tradition') || t.includes('museum') || t.includes('custom') || t.includes('architecture')) return 'Culture';
  if (t.includes('tech') || t.includes('science') || t.includes('internet') || t.includes('video game') || t.includes('object') || t.includes('innovation') || t.includes('energy') || t.includes('crypto')) return 'Science & Tech';
  if (t.includes('work') || t.includes('study') || t.includes('job') || t.includes('education') || t.includes('school') || t.includes('trade')) return 'Work & Study';
  if (t.includes('health') || t.includes('disease') || t.includes('body') || t.includes('medicine') || t.includes('addiction') || t.includes('prosthetic')) return 'Health';
  if (t.includes('environment') || t.includes('nature') || t.includes('animal') || t.includes('weather') || t.includes('season') || t.includes('waste') || t.includes('climate') || t.includes('plant') || t.includes('pet')) return 'Nature';
  if (t.includes('society') || t.includes('politic') || t.includes('economy') || t.includes('money') || t.includes('gender') || t.includes('generation') || t.includes('social') || t.includes('media') || t.includes('refugee') || t.includes('death penalty') || t.includes('immigration') || t.includes('issue')) return 'Current Events';
  if (t.includes('hobby') || t.includes('sport') || t.includes('game') || t.includes('music') || t.includes('cinema') || t.includes('show') || t.includes('party') || t.includes('leisure') || t.includes('read')) return 'Hobbies';
  if (t.includes('family') || t.includes('love') || t.includes('relationship') || t.includes('friend') || t.includes('wedding')) return 'Relationships';
  if (t.includes('daily') || t.includes('house') || t.includes('routine') || t.includes('chore') || t.includes('time') || t.includes('color') || t.includes('day') || t.includes('month') || t.includes('emotion') || t.includes('dream') || t.includes('fear') || t.includes('happiness') || t.includes('style') || t.includes('fashion') || t.includes('smell') || t.includes('pleasure') || t.includes('failure') || t.includes('riddle')) return 'Daily Life';
  return 'Other';
};

topics = topics.map((t: any) => {
  if (!t.category) {
    t.category = getCategory(t.titleEn);
  }
  return t;
});

const newTopicsStr = JSON.stringify(topics, null, 2);
const newContent = topicsContent.replace(/export const topics: Topic\[\] = \[[\s\S]*\];?/, `export const topics: Topic[] = ${newTopicsStr};`);

let finalContent = newContent;
if (!finalContent.includes('category: string;')) {
  finalContent = finalContent.replace('level: string;', 'level: string;\n  category: string;');
}

fs.writeFileSync('src/data/topics.ts', finalContent);
console.log("Updated topics.ts");

// Also update topicsDe.ts
const topicsDeContent = fs.readFileSync('src/data/topicsDe.ts', 'utf-8');
const matchDe = topicsDeContent.match(/export const topicsDe: Topic\[\] = (\[[\s\S]*\]);?/);
if (matchDe) {
  let topicsDeStr = matchDe[1];
  let topicsDe;
  eval("topicsDe = " + topicsDeStr);
  topicsDe = topicsDe.map((t: any) => {
    if (!t.category) {
      t.category = getCategory(t.titleEn);
    }
    return t;
  });
  const newTopicsDeStr = JSON.stringify(topicsDe, null, 2);
  const newDeContent = topicsDeContent.replace(/export const topicsDe: Topic\[\] = \[[\s\S]*\];?/, `export const topicsDe: Topic[] = ${newTopicsDeStr};`);
  fs.writeFileSync('src/data/topicsDe.ts', newDeContent);
  console.log("Updated topicsDe.ts");
}

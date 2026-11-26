<script setup>
import { ArrowUpRight } from 'lucide-vue-next'
import { activities } from '../data/activities'
</script>

<template>
  <main class="profile">
    <header class="intro">
      <div>
        <p class="identity">个人研究主页</p>
        <h1>HITnzh</h1>
        <p class="field">信号处理与优化</p>
        <p class="bio">我关注低旁瓣非连续谱信号。这里收着我的研究笔记，从公式背后的直觉，到实验用过的参数和观察到的结果。我也在这里记下自己做过的小工具。</p>
      </div>
      <figure class="notation">
        <div class="equation">
          <math display="block" aria-label="傅里叶变换。X(f) 等于 x(t) 乘以 e 的负 j 二πft 次方，对时间从负无穷到正无穷积分。">
            <mrow><mi>X</mi><mo stretchy="false">(</mo><mi>f</mi><mo stretchy="false">)</mo></mrow><mo>=</mo>
            <msubsup><mo>∫</mo><mrow><mo>−</mo><mi>∞</mi></mrow><mi>∞</mi></msubsup>
            <mrow><mi>x</mi><mo stretchy="false">(</mo><mi>t</mi><mo stretchy="false">)</mo></mrow>
            <msup><mi>e</mi><mrow><mo>−</mo><mi>j</mi><mn>2</mn><mi>π</mi><mi>f</mi><mi>t</mi></mrow></msup>
            <mspace width="0.15em" /><mi mathvariant="normal">d</mi><mi>t</mi>
          </math>
        </div>
        <figcaption><span>傅里叶变换</span><span>时域信号与频域表示</span></figcaption>
      </figure>
    </header>

    <section id="research" class="profile-section" aria-labelledby="research-title">
      <h2 id="research-title">研究方向</h2>
      <div class="research-copy">
        <h3>低旁瓣非连续谱信号</h3>
        <p>当可用频带被分成几段，怎样设计信号，让自相关函数的旁瓣保持较低？我围绕这个问题整理信号处理与优化方面的学习笔记。</p>
        <p>记录实验时，我会写下目标函数、约束条件和参数，再把结果与最初的判断放在一起，方便回头查找差异。</p>
      </div>
    </section>

    <section id="activity" class="profile-section" aria-labelledby="activity-title">
      <h2 id="activity-title">近期动态</h2>
      <ol class="activity-list">
        <li v-for="item in activities" :key="item.title">
          <time :datetime="item.date">{{ item.date.replaceAll('-', '.') }}</time>
          <div>
            <h3>
              <a v-if="item.url" :href="item.url">{{ item.title }} <ArrowUpRight :size="14" aria-hidden="true" /></a>
              <template v-else>{{ item.title }}</template>
            </h3>
            <p>{{ item.text }}</p>
          </div>
        </li>
      </ol>
    </section>
  </main>
</template>

<style scoped>
.profile {
  width: var(--shell-width);
  margin: 0 auto;
  color: #202b35;
  --serif: Georgia, "Noto Serif SC", "Songti SC", SimSun, serif;
}
h1, h2, h3, p, figure, ol { margin: 0; }
.intro {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(290px, .85fr);
  align-items: center;
  gap: clamp(34px, 7vw, 100px);
  padding: clamp(50px, 6vw, 84px) 0;
}
.identity { display: flex; align-items: center; gap: 10px; color: var(--shell-muted); font-size: 13px; letter-spacing: .11em; }
.identity::before { content: ''; width: 27px; height: 1px; background: #648386; }
h1 { margin: 10px 0 12px; font: 400 clamp(64px, 7vw, 90px)/1.04 var(--serif); letter-spacing: -.055em; }
.field { color: var(--shell-ink); font: 500 clamp(21px, 2vw, 27px)/1.4 var(--serif); letter-spacing: .055em; }
.bio, .research-copy p { color: #425159; font-size: 16px; line-height: 1.95; }
.bio { max-width: 34em; margin-top: 17px; }
.notation { align-self: center; }
.equation {
  display: grid;
  place-items: center;
  padding: clamp(37px, 4.5vw, 65px) 5px;
  border-block: 1px solid #c5d4d2;
  background-color: #f0f4ef;
  background-image: linear-gradient(#d9e4df75 1px, transparent 1px), linear-gradient(90deg, #d9e4df75 1px, transparent 1px);
  background-size: 17px 17px;
  color: #254a51;
}
math { font-size: clamp(21px, 2vw, 30px); }
.notation figcaption { display: flex; justify-content: space-between; gap: 8px; margin-top: 9px; color: var(--shell-muted); font-size: 12px; }
.profile-section { display: grid; grid-template-columns: minmax(150px, .32fr) minmax(0, 1fr); gap: clamp(24px, 4vw, 60px); padding-block: clamp(32px, 3.5vw, 52px); border-top: 1px solid var(--shell-line); }
.profile-section h2 { font: 500 clamp(24px, 2.2vw, 31px)/1.4 var(--serif); }
.research-copy h3 { font: 500 23px/1.5 var(--serif); }
.research-copy p { max-width: 45em; margin-top: 10px; }
.activity-list { list-style: none; padding: 0; }
.activity-list li { display: grid; grid-template-columns: 100px minmax(0, 1fr); gap: 12px; padding: 17px 0; border-top: 1px solid var(--shell-line); }
.activity-list li:first-child { padding-top: 2px; border: 0; }
.activity-list li:last-child { padding-bottom: 0; }
.activity-list time { padding-top: 4px; color: var(--shell-muted); font: 13px/1.6 ui-monospace, Consolas, monospace; }
.activity-list h3 { font-size: 17px; font-weight: 600; line-height: 1.6; }
.activity-list a { color: var(--shell-ink); }
.activity-list a:hover { text-decoration: underline; text-underline-offset: 3px; }
.activity-list a:focus-visible { outline: 2px solid var(--shell-ink); outline-offset: 3px; }
.activity-list svg { vertical-align: -1px; }
.activity-list p { margin-top: 4px; color: var(--shell-muted); font-size: 14px; line-height: 1.8; }
@media (max-width: 760px) {
  .intro { gap: 25px; }
  .profile-section { grid-template-columns: minmax(0, 1fr); gap: 18px; }
}
@media (max-width: 680px) {
  .intro { grid-template-columns: minmax(0, 1fr); gap: 25px; padding: 35px 0; }
  .equation { padding-block: 25px; }
  .bio, .research-copy p { font-size: 15px; }
  .activity-list li { grid-template-columns: minmax(0, 1fr); gap: 4px; }
}
</style>

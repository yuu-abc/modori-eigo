"use client";

import { useEffect, useState } from "react";

type Mood = "good" | "okay" | "tired";

const moodOptions: { id: Mood; label: string; note: string; count: number }[] = [
  { id: "good", label: "元気", note: "10語やってみる", count: 10 },
  { id: "okay", label: "ふつう", note: "5語だけ進める", count: 5 },
  { id: "tired", label: "疲れた", note: "1語だけ見る", count: 1 },
];

const wordBank = [
  { word: "accomplish", pronunciation: "/əkɑ́mpliʃ/", meaning: "達成する、成し遂げる", example: "We accomplished our goal." },
  { word: "approach", pronunciation: "/əpróutʃ/", meaning: "近づく、取り組み方", example: "We need a new approach." },
  { word: "benefit", pronunciation: "/bénəfit/", meaning: "利益、恩恵を受ける", example: "Exercise benefits your health." },
  { word: "contribute", pronunciation: "/kəntríbjuːt/", meaning: "貢献する、寄付する", example: "Everyone can contribute." },
  { word: "decline", pronunciation: "/dikláin/", meaning: "減少する、断る", example: "The number began to decline." },
  { word: "essential", pronunciation: "/isénʃəl/", meaning: "必要不可欠な", example: "Water is essential for life." },
  { word: "feature", pronunciation: "/fíːtʃər/", meaning: "特徴、特集する", example: "The app has a useful feature." },
  { word: "maintain", pronunciation: "/meintéin/", meaning: "維持する、主張する", example: "It is hard to maintain focus." },
  { word: "opportunity", pronunciation: "/ɑ̀pərtjúːnəti/", meaning: "機会、好機", example: "This is a great opportunity." },
  { word: "require", pronunciation: "/rikwáiər/", meaning: "必要とする、要求する", example: "The job requires patience." },
  { word: "significant", pronunciation: "/signífikənt/", meaning: "重要な、かなりの", example: "We made significant progress." },
  { word: "variety", pronunciation: "/vəráiəti/", meaning: "多様性、さまざまな種類", example: "The shop sells a variety of books." },
];

export default function Home() {
  const [mood, setMood] = useState<Mood>("okay");
  const [wordIndex, setWordIndex] = useState(0);
  const [answerOpen, setAnswerOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const selectedMood = moodOptions.find((item) => item.id === mood)!;
  const word = wordBank[wordIndex];

  useEffect(() => {
    const updateConnection = () => setIsOffline(!navigator.onLine);

    updateConnection();
    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);

    return () => {
      window.removeEventListener("online", updateConnection);
      window.removeEventListener("offline", updateConnection);
    };
  }, []);

  const nextWord = () => {
    setWordIndex((current) => (current + 1) % wordBank.length);
    setAnswerOpen(false);
  };

  return (
    <main>
      <header className="topbar simple-topbar">
        <a className="brand" href="#top" aria-label="もどり英語 ホーム">
          <span className="brand-mark" aria-hidden="true">m</span>
          <span>もどり英語</span>
        </a>
        <span className="simple-message">休んでも、また戻れば大丈夫。</span>
        {isOffline && (
          <span className="offline-status" role="status" aria-label="オフラインです">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9.5a12 12 0 0 1 13.4-2.18M2.8 5.8 21.2 18.2M7.3 13.1A7.3 7.3 0 0 1 12 11.4c1.42 0 2.74.4 3.87 1.1M10.1 16.1a3.1 3.1 0 0 1 3.55.2M12 20h.01" />
            </svg>
            <span>オフライン</span>
          </span>
        )}
      </header>

      <div className="simple-shell" id="top">
        <section className="simple-hero">
          <div>
            <p className="eyebrow"><span /> WELCOME BACK</p>
            <h1>今日も、<br /><em>ここから。</em></h1>
            <p>気分に合わせて、英単語を少しだけ。<br />覚えられなくても大丈夫です。</p>
          </div>
          <div className="simple-orbit" aria-hidden="true">
            <i>A</i><i>hello</i><i>2</i>
            <strong>↩</strong>
          </div>
        </section>

        <section className="simple-study" aria-labelledby="study-title">
          <div className="simple-intro">
            <p className="section-kicker">STEP 1</p>
            <h2 id="study-title">いまの気分を選ぶ</h2>
            <div className="simple-moods">
              {moodOptions.map((item) => (
                <button
                  key={item.id}
                  className={mood === item.id ? "selected" : ""}
                  onClick={() => setMood(item.id)}
                  aria-pressed={mood === item.id}
                >
                  <span className={`mood-face ${item.id}`} aria-hidden="true">●</span>
                  <span><strong>{item.label}</strong><small>{item.note}</small></span>
                </button>
              ))}
            </div>
          </div>

          <article className="simple-word-card">
            <div className="simple-word-head">
              <div>
                <p className="section-kicker">STEP 2</p>
                <h2>今日は{selectedMood.count}語</h2>
              </div>
              <span>{wordIndex + 1} / {wordBank.length}</span>
            </div>

            <div className="simple-word">
              <p>{word.word}</p>
              <span>{word.pronunciation}</span>
            </div>

            <div className={`simple-answer ${answerOpen ? "open" : ""}`}>
              {answerOpen ? (
                <>
                  <strong>{word.meaning}</strong>
                  <small>{word.example}</small>
                </>
              ) : (
                <p>まず英単語を見て、意味を考えてみましょう。</p>
              )}
            </div>

            <div className="simple-actions">
              <button className="secondary" onClick={() => setAnswerOpen((current) => !current)}>
                {answerOpen ? "意味を隠す" : "意味を見る"}
              </button>
              <button className="primary" onClick={nextWord}>次の単語 <span aria-hidden="true">→</span></button>
            </div>
          </article>
        </section>

        <p className="simple-note"><span aria-hidden="true">↩</span> 今日はここまででも大丈夫。また開けば、そこが続きです。</p>
      </div>

      <footer className="simple-footer">
        <a className="brand footer-brand" href="#top"><span className="brand-mark" aria-hidden="true">m</span><span>もどり英語</span></a>
        <p>英語学習に、戻れる場所を。</p>
      </footer>
    </main>
  );
}

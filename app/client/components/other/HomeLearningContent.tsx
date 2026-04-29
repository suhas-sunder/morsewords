import * as React from "react";

import styles from "~/client/components/home/styles";

type CardProps = {
  title: string;
  children: React.ReactNode;
  tone?: "default" | "muted";
};

function ContentCard({ title, children, tone = "default" }: CardProps) {
  const titleStyle: React.CSSProperties = {
    margin: 0,
    color: "#0b2447",
    fontSize: "1.12rem",
    lineHeight: 1.25,
    letterSpacing: 0.1,
  };

  const bodyStyle: React.CSSProperties = {
    color: tone === "muted" ? "#5a616c" : "#555",
    margin: 0,
    lineHeight: 1.65,
  };

  return (
    <div style={{ ...styles.card, ...styles.cardPad }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <h2 style={titleStyle}>{title}</h2>
        <div style={bodyStyle}>{children}</div>
      </div>
    </div>
  );
}

function MiniGridCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div
      style={{
        background: "#f7f8fb",
        border: "1px solid #e6e8ef",
        borderRadius: 12,
        padding: 12,
      }}
    >
      <div style={{ fontWeight: 800, color: "#0b2447", marginBottom: 6 }}>
        {title}
      </div>
      <p style={{ color: "#555", margin: 0, lineHeight: 1.55 }}>{desc}</p>
    </div>
  );
}

export default function HomeLearningContent() {
  const stack: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginBottom: "3rem",
  };

  return (
    <>
      {/* Learn / SEO content */}
      <section style={styles.section} aria-labelledby="learn-title">
        <h2 id="learn-title" style={styles.sectionTitle}>
          Learn and Practice Morse Code
        </h2>
        <div style={{ ...styles.card, ...styles.cardPad }}>
          <p style={{ margin: 0, color: "#5a616c", fontSize: "1.02rem" }}>
            Begin with short phrases and listen for rhythm at 15 to 20 WPM.
            Increase speed as your recognition improves. This interactive
            learning tool provides structured daily practice to help you build
            real Morse proficiency.
          </p>
        </div>
      </section>

      <section style={stack} aria-label="learning-features">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 12,
          }}
        >
          <div style={{ gridColumn: "span 12" }}>
            <div
              style={{
                color: "#0b2447",
                fontWeight: 900,
                fontSize: "1rem",
                letterSpacing: 0.2,
                marginBottom: 8,
              }}
            >
              Instant Text-to-Morse Conversion
            </div>
            <p style={{ color: "#555", margin: 0, lineHeight: 1.65 }}>
              Instantly convert any word or sentence into International Morse
              Code. Whether you’re learning the fundamentals or exploring
              historical communication, this educational translator provides fast,
              accurate results with clear audio feedback.
            </p>
          </div>

          <div style={{ gridColumn: "span 12" }}>
            <div
              style={{
                color: "#0b2447",
                fontWeight: 900,
                fontSize: "1rem",
                letterSpacing: 0.2,
                marginBottom: 8,
              }}
            >
              Accurate Morse-to-Text Translation
            </div>
            <p style={{ color: "#555", margin: 0, lineHeight: 1.65 }}>
              Paste or type Morse code to decode it back into readable text. The
              converter supports letters, numbers, and punctuation, making it
              ideal for both classroom learning and real-world radio practice.
            </p>
          </div>

          <div style={{ gridColumn: "span 12" }}>
            <div
              style={{
                color: "#0b2447",
                fontWeight: 900,
                fontSize: "1rem",
                letterSpacing: 0.2,
                marginBottom: 8,
              }}
            >
              Morse Translator with Audio Training
            </div>
            <p style={{ color: "#555", margin: 0, lineHeight: 1.65 }}>
              Learning Morse is easier when you can hear it. Use audio playback to
              listen to dits and dahs at adjustable speeds and tones. Training
              your ear through sound builds recognition, rhythm, and long-term
              memory.
            </p>
          </div>

          <div style={{ gridColumn: "span 12" }}>
            <div
              style={{
                color: "#0b2447",
                fontWeight: 900,
                fontSize: "1rem",
                letterSpacing: 0.2,
                marginBottom: 8,
              }}
            >
              Practice and Learn Anywhere
            </div>
            <p style={{ color: "#555", margin: 0, lineHeight: 1.65 }}>
              The MorseWords translator runs directly in your browser, no
              installation required. Translate text, practice decoding, and review
              results from desktop, tablet, or mobile. Always accessible when
              you’re ready to learn.
            </p>
          </div>
        </div>
      </section>

      <section style={stack} aria-label="how-it-works">
        <ContentCard title="How the Morse Translator Works">
          <p style={{ color: "#555", marginTop: 0 }}>
            The converter maps letters, numbers, and punctuation to
            International Morse Code and applies standard timing. One dit
            equals one unit, and a dah equals three. Spacing inside a letter
            is one unit, between letters is three, and between words is seven.
            This ensures both visual output and audio playback remain
            consistent and accurate.
          </p>
          <ol style={{ color: "#555", lineHeight: 1.65, paddingLeft: 18 }}>
            <li>
              Type text to create Morse instantly, or paste Morse to decode it
              back to text.
            </li>
            <li>
              Use the Convert buttons to lock in the result, then copy or
              listen with audio playback.
            </li>
            <li>
              Adjust WPM and tone to train your ear at comfortable learning
              speeds.
            </li>
          </ol>
        </ContentCard>
      </section>

      <section style={stack} aria-label="reference">
        <ContentCard title="Supported Characters and Punctuation">
          <p style={{ color: "#555", marginTop: 0 }}>
            Letters A–Z and digits 0–9 are fully supported, along with the
            most common punctuation marks. Unsupported symbols are ignored to
            keep translations clean and readable.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                background: "#f7f8fb",
                border: "1px solid #e6e8ef",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}>
                Letters and Numbers
              </div>
              <div
                style={{
                  color: "#333",
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
                  fontSize: "0.95rem",
                }}
              >
                A–Z, 0–9
              </div>
            </div>
            <div
              style={{
                background: "#f7f8fb",
                border: "1px solid #e6e8ef",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}>
                Punctuation
              </div>
              <div
                style={{
                  color: "#333",
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
                  fontSize: "0.95rem",
                }}
              >
                . , ? / ' ! - @ : ; = + ( ) "
              </div>
            </div>
          </div>
        </ContentCard>

        <ContentCard title="Timing and Spacing">
          <ul
            style={{
              color: "#555",
              lineHeight: 1.65,
              paddingLeft: 18,
              margin: 0,
            }}
          >
            <li>Dit length equals one unit, dah length equals three units.</li>
            <li>The gap inside a character is one unit.</li>
            <li>The gap between letters is three units.</li>
            <li>The gap between words is seven units.</li>
          </ul>
          <p style={{ color: "#555", marginTop: 12 }}>
            For best decoding, keep three spaces between letters and seven
            between words when pasting Morse.
          </p>
        </ContentCard>

        <ContentCard title="Examples to Try">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {[
              {
                text: "HELLO WORLD",
                code: ".... . .-.. .-.. --- .-- --- .-. .-.. -..",
              },
              { text: "MORSE CODE", code: "-- --- .-. ... . -.-. --- -.. ." },
              { text: "GOOD LUCK", code: "--. --- --- -.. .-.. ..- -.- -.-" },
              { text: "CQ", code: "-.-. --.-" },
            ].map((ex, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid #e6e8ef",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div
                  style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
                >
                  {ex.text}
                </div>
                <div
                  style={{
                    color: "#333",
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
                  }}
                >
                  {ex.code}
                </div>
              </div>
            ))}
          </div>
        </ContentCard>

        <ContentCard title="Troubleshooting">
          <ul
            style={{
              color: "#555",
              lineHeight: 1.65,
              paddingLeft: 18,
              margin: 0,
            }}
          >
            <li>
              If output looks merged, add spaces: three between letters and
              seven between words.
            </li>
            <li>
              If a character does not appear, it is likely unsupported
              punctuation. Remove the symbol and try again.
            </li>
            <li>
              For clearer audio, try a tone near 600–700 Hz and start near 20
              WPM.
            </li>
          </ul>
        </ContentCard>
      </section>

      <section style={stack} aria-label="background-and-benefits">
        <ContentCard title="A Brief History of Morse Code">
          <p style={{ color: "#555", marginTop: 0 }}>
            Morse code was developed in the 1830s by Samuel Morse and Alfred
            Vail as a method to transmit messages across telegraph lines. It
            soon became the backbone of long-distance communication, used in
            railroads, maritime signaling, aviation, and emergency services.
            Today, students and radio operators continue to learn and practice
            it through modern educational tools.
          </p>
        </ContentCard>

        <div style={{ ...styles.card, ...styles.cardPad }}>
          <h2
            style={{
              margin: 0,
              color: "#0b2447",
              fontSize: "1.12rem",
              lineHeight: 1.25,
              letterSpacing: 0.1,
            }}
          >
            Why Learn Morse Code?
          </h2>
          <div style={{ height: 10 }} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: 12,
            }}
          >
            <div style={{ gridColumn: "span 12" }}>
              <MiniGridCard
                title="Emergency Use"
                desc="SOS (... --- ...) remains a recognized international distress signal."
              />
            </div>
            <div style={{ gridColumn: "span 12" }}>
              <MiniGridCard
                title="Brain Training"
                desc="Learning Morse strengthens memory, concentration, and auditory pattern recognition."
              />
            </div>
            <div style={{ gridColumn: "span 12" }}>
              <MiniGridCard
                title="Cultural Heritage"
                desc="Preserve a communication system that helped shape modern technology and global contact."
              />
            </div>
          </div>
        </div>

        <ContentCard title="Educational Uses of Morse Code">
          <p style={{ color: "#555", marginTop: 0 }}>
            Teachers often use Morse code to spark interest in history,
            physics, and language learning. From understanding sound waves to
            practicing rhythm and timing, Morse brings an interactive element
            into classrooms. Our translator and learning activities make it
            easy to introduce students to these timeless communication
            concepts.
          </p>
        </ContentCard>

        <div style={{ ...styles.card, ...styles.cardPad }}>
          <h2
            style={{
              margin: 0,
              color: "#0b2447",
              fontSize: "1.12rem",
              lineHeight: 1.25,
              letterSpacing: 0.1,
            }}
          >
            MorseWords vs Other Translators
          </h2>
          <div style={{ height: 10 }} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: 12,
            }}
          >
            <div style={{ gridColumn: "span 6" }}>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e6e8ef",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div
                  style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
                >
                  MorseWords
                </div>
                <ul
                  style={{
                    color: "#555",
                    margin: 0,
                    paddingLeft: 18,
                    lineHeight: 1.65,
                  }}
                >
                  <li>Text-to-Morse and Morse-to-text translation</li>
                  <li>Audio playback for real listening practice</li>
                  <li>Interactive learning modules for ongoing study</li>
                </ul>
              </div>
            </div>
            <div style={{ gridColumn: "span 6" }}>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e6e8ef",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div
                  style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}
                >
                  Other Tools
                </div>
                <ul
                  style={{
                    color: "#555",
                    margin: 0,
                    paddingLeft: 18,
                    lineHeight: 1.65,
                  }}
                >
                  <li>Basic text conversion only</li>
                  <li>No structured learning or listening support</li>
                  <li>Limited accuracy for punctuation and symbols</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <ContentCard title="Mobile-Friendly Morse Learning">
          <p style={{ color: "#555", marginTop: 0 }}>
            MorseWords is designed for both mobile and desktop browsers.
            Translate, listen, and practice from any device. Whether you have
            a minute on your phone or want to dedicate longer sessions on your
            computer, the same clean and accessible experience is always
            available.
          </p>
        </ContentCard>

        <ContentCard title="Advanced Morse Practice">
          <p style={{ color: "#555", marginTop: 0 }}>
            Once you master basic letters and numbers, explore advanced
            practice sessions. The translator supports punctuation, symbols,
            and custom phrases, allowing you to simulate real radio messages
            and challenge your comprehension. Suitable for students,
            hobbyists, and radio operators refining their skills.
          </p>
        </ContentCard>

        <ContentCard title="Guided Morse Practice">
          <p style={{ color: "#555", marginTop: 0 }}>
            Learning Morse code can be engaging and goal-oriented. The
            MorseWords interactive training modules combine typing accuracy
            with listening exercises, creating a balanced way to study at your
            own pace. Track your progress, improve recognition, and build
            speed naturally through daily use.
          </p>
        </ContentCard>

        <ContentCard title="Morse Typing and Speed Training">
          <p style={{ color: "#555", marginTop: 0 }}>
            Practice typing Morse while maintaining high accuracy. Adjustable
            WPM targets and real-time feedback help you build speed, rhythm,
            and confidence. This focused approach develops strong coordination
            between hearing and writing, leading to true Morse fluency.
          </p>
        </ContentCard>

        <ContentCard title="Real-World Applications of Morse Code">
          <p style={{ color: "#555", marginTop: 0 }}>
            Morse code continues to serve practical roles today, including
            emergency signaling, survival communication, and accessibility
            support for individuals with limited mobility or speech.
            Understanding Morse provides a versatile skill that connects
            history, technology, and communication practice.
          </p>
        </ContentCard>

        <ContentCard title="Free Online Morse Translator and Interactive Learning Interface">
          <p style={{ color: "#555", marginTop: 0 }}>
            MorseWords is completely free to use. No downloads or sign-ups are
            required. Translate text to Morse instantly, listen to clean
            audio, and practice using our structured interactive interface.
            Whether you are a beginner searching for “free Morse code
            practice” or an advanced learner seeking an accurate “online Morse
            translator,” this educational tool delivers reliable, high-quality
            results.
          </p>
        </ContentCard>

        <ContentCard title="Accessible Morse Learning">
          <p style={{ color: "#555", marginTop: 0 }}>
            MorseWords is designed with accessibility in mind. Clear fonts,
            high-contrast colors, and intuitive audio controls make it
            suitable for learners of all ages and abilities. The site supports
            both visual and auditory learning styles, and it is screen reader
            friendly to ensure inclusive access for all users. Following key
            WCAG principles, the interface promotes focus, simplicity, and
            comfort for every learning environment.
          </p>
        </ContentCard>

        <ContentCard title="Learn Morse the Smart Way">
          <ol
            style={{
              color: "#555",
              lineHeight: 1.65,
              paddingLeft: 18,
              margin: 0,
            }}
          >
            <li>Begin with the most common letters: E, T, A, I, N, and O.</li>
            <li>
              Add pairs with distinct rhythms, for example K and R, or M and
              S.
            </li>
            <li>
              Introduce numbers and punctuation once letters become automatic.
            </li>
            <li>
              Practice with short words and phrases to reinforce memory
              patterns.
            </li>
          </ol>
          <p style={{ color: "#555", marginTop: 12 }}>
            Keep character speed between 15 and 20 WPM and increase it
            gradually. Consistent pacing builds strong recognition for both
            reading and listening.
          </p>
        </ContentCard>

        <ContentCard title="Audio Training Tips">
          <ul
            style={{
              color: "#555",
              lineHeight: 1.65,
              paddingLeft: 18,
              margin: 0,
            }}
          >
            <li>Use a tone near 600 to 700 Hz for comfortable listening.</li>
            <li>Keep practice sessions short to prevent fatigue.</li>
            <li>Focus on rhythm and timing rather than counting symbols.</li>
            <li>
              Repeat difficult letters in isolation, then embed them in words.
            </li>
          </ul>
        </ContentCard>

        <ContentCard title="About the MorseWords Interactive Learning Interface">
          <p style={{ color: "#555", marginTop: 0 }}>
            The MorseWords Interactive Learning Interface provides structured,
            daily practice. Decode Morse, type the correct word, and review
            feedback to improve over time. Each exercise emphasizes pattern
            recognition and speed through familiar words and short phrases.
          </p>
          <ul style={{ color: "#555", lineHeight: 1.65, paddingLeft: 18 }}>
            <li>Short daily exercises for consistent progress.</li>
            <li>Difficulty adapts naturally to your current level.</li>
            <li>Built on precise timing and spacing standards.</li>
          </ul>
        </ContentCard>

        <ContentCard title="How to Practice with the MorseWords Training Interface">
          <ol
            style={{
              color: "#555",
              lineHeight: 1.65,
              paddingLeft: 18,
              margin: 0,
            }}
          >
            <li>
              Listen to the audio or read the Morse sequence shown on screen.
            </li>
            <li>
              Type your answer in plain text. Use hints for assistance if
              needed.
            </li>
            <li>
              Check your results to compare your decoding accuracy and timing.
            </li>
          </ol>
          <p style={{ color: "#555", marginTop: 12 }}>
            Each round reinforces letter patterns and rhythm groups, helping
            you develop long-term recognition and fluency in Morse code.
          </p>
        </ContentCard>

        <div style={{ ...styles.card, ...styles.cardPad }}>
          <h2
            style={{
              margin: 0,
              color: "#0b2447",
              fontSize: "1.12rem",
              lineHeight: 1.25,
              letterSpacing: 0.1,
            }}
          >
            Interactive Learning Modes
          </h2>
          <div style={{ height: 10 }} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <MiniGridCard
              title="Daily Challenge"
              desc="A focused, one-puzzle-a-day format designed to build steady improvement."
            />
            <MiniGridCard
              title="Practice Pack"
              desc="Unlimited drills covering letters, numbers, and commonly used words."
            />
          </div>
        </div>

        <ContentCard title="Progress and Personal Goals">
          <p style={{ color: "#555", marginTop: 0 }}>
            Set small, measurable goals each week. For example, aim for two
            complete practice sessions per day, or increase your WPM while
            maintaining 95 percent accuracy. Small, consistent steps lead to
            meaningful progress.
          </p>
          <div style={{ height: 12 }} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: 12,
            }}
          >
            <div style={{ gridColumn: "span 4" }}>
              <MiniGridCard
                title="Consistency"
                desc="Practice daily to strengthen recognition and retention."
              />
            </div>
            <div style={{ gridColumn: "span 4" }}>
              <MiniGridCard
                title="Accuracy"
                desc="Keep error rates low before increasing speed."
              />
            </div>
            <div style={{ gridColumn: "span 4" }}>
              <MiniGridCard
                title="Speed"
                desc="Gradually raise WPM once decoding feels natural."
              />
            </div>
          </div>
        </ContentCard>

        <ContentCard title="Sample Practice Exercises">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}>
                Common Words
              </div>
              <div
                style={{
                  color: "#333",
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
                }}
              >
                .... . .-.. .-.. --- .-- --- .-. .-.. -..
              </div>
              <p style={{ color: "#555", marginTop: 8, marginBottom: 0 }}>
                Decode this Morse sequence and check your translation accuracy.
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e8ef",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6, color: "#0b2447" }}>
                Numbers and Symbols
              </div>
              <div
                style={{
                  color: "#333",
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New"',
                }}
              >
                .---- ..--- ...-- .-.-.- --..-- ..--..
              </div>
              <p style={{ color: "#555", marginTop: 8, marginBottom: 0 }}>
                Practice decoding digits and punctuation through short,
                structured sets.
              </p>
            </div>
          </div>
        </ContentCard>
      </section>
    </>
  );
}

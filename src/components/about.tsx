import { SectionHeading } from "./section-heading";
import { ScrubText } from "./scrub-text";
import { Reveal } from "./reveal";

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="border-b border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading id="about-heading" index="04 / About" title="Who's typing" />

        <Reveal className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div className="space-y-6 text-lg leading-relaxed text-ink/90">
            <ScrubText>
              Final-year IT student at VIIT Pune who spends most of his time
              building things instead of attending lectures about building
              things. Started with a diploma at Government Polytechnic Nashik,
              did a Flutter internship at kGamify that ended with an actual app
              on the Play Store, and it has been a mix of client work and my own
              half-obsessions since.
            </ScrubText>
            <p>
              What I like is the part before the code: working out what the
              product has to be, what it can&apos;t afford to do, and which single
              decision the whole thing hinges on. Qwish exists because a score
              is easier to trust than a résumé. AfterCollege prefetches its deck
              because a swipe should never wait on a network. Daichi hashes its
              batches because an unverifiable provenance claim is just
              marketing.
            </p>
            <p>
              I&apos;m most fluent in Flutter and Dart, comfortable across Go,
              TypeScript, Python, Java and C#, and I&apos;d rather learn a stack
              properly than list ten I&apos;ve only read about.
            </p>
          </div>

          <div className="space-y-8 border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <div>
              <p className="mono-label mb-3">Currently</p>
              <p className="text-ink">
                Final year B.Tech IT at VIIT Pune, building Qwish, taking client
                engagements.
              </p>
            </div>
            <div>
              <p className="mono-label mb-3">Looking for</p>
              <p className="text-ink">
                Software developer roles — mobile, backend or full-stack. Pune,
                elsewhere in India, or remote.
              </p>
            </div>
            <div>
              <p className="mono-label mb-3">Away from the editor</p>
              <p className="text-ink">
                Reading product teardowns, redrawing interfaces that annoy me,
                and arguing about typography.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

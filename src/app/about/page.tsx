"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.12, duration: 0.6, ease: "easeOut" },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const glow: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const AboutPage = () => {
  return (
    <div className="bg-slate-950 text-white overflow-hidden min-h-full">
      <section className="relative overflow-hidden pb-0">
        <motion.div
          variants={glow}
          initial="hidden"
          animate="show"
          className="absolute -top-24 right-[-10%] h-80 w-80 rounded-full bg-cyan-500/30 blur-[120px]"
        />
        <motion.div
          variants={glow}
          initial="hidden"
          animate="show"
          className="absolute -bottom-24 left-[-10%] h-80 w-80 rounded-full bg-emerald-500/20 blur-[120px]"
        />
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-6xl mx-auto px-6 py-20"
        >
          <motion.p variants={item} className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            About SeaBasket
          </motion.p>
          <motion.h1
            variants={item}
            className="mt-4 text-4xl md:text-6xl font-semibold leading-tight"
          >
            Fresh seafood, curated with coastal obsession.
          </motion.h1>
          <motion.p variants={item} className="mt-6 max-w-2xl text-lg text-slate-300">
            SeaBasket is built by seafood lovers who want freshness without the fuss. We partner
            with trusted fisheries, move fast, and keep every order traceable from dock to doorstep.
          </motion.p>
          <motion.div variants={item} className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Coastal Partners", value: "48+" },
              { label: "Daily Fresh Batches", value: "120+" },
              { label: "Cities Delivered", value: "15" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={item}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <p className="text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-slate-900">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-6xl mx-auto px-6 py-16"
        >
          <motion.h2 variants={item} className="text-2xl md:text-3xl font-semibold">
            What makes us different
          </motion.h2>
          <motion.p variants={item} className="mt-3 text-slate-300 max-w-2xl">
            We keep quality predictable by combining transparent sourcing with cold-chain discipline
            and a chef-led quality checklist.
          </motion.p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Same-day harvests",
                copy: "Orders are packed within hours of landing for peak flavor.",
              },
              {
                title: "Zero guesswork",
                copy: "Every product includes origin, catch method, and best use.",
              },
              {
                title: "Seafood concierge",
                copy: "Need a cut or recipe? Our team helps you prep like a pro.",
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                variants={item}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-6"
              >
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{card.copy}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="max-w-6xl mx-auto px-6 py-16"
        >
          <motion.h2 variants={item} className="text-2xl md:text-3xl font-semibold">
            Our promise
          </motion.h2>
          <motion.p variants={item} className="mt-4 text-slate-300 max-w-3xl">
            We believe seafood should be effortless, honest, and exciting. From sustainable sourcing
            to fast delivery windows, we hold every step to a high standard so you can cook with
            confidence.
          </motion.p>
          <motion.div variants={item} className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Temperature-controlled logistics on every delivery.",
              "Transparent pricing with no hidden handling fees.",
              "Curated seasonal drops and chef-tested recipes.",
              "Support team available 7 days a week.",
            ].map((point) => (
              <motion.div
                key={point}
                variants={item}
                className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
              >
                {point}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-slate-900">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-6xl mx-auto px-6 py-14"
        >
          <motion.h2 variants={item} className="text-2xl md:text-3xl font-semibold">
            Visit or reach us
          </motion.h2>
          <motion.p variants={item} className="mt-3 text-slate-300 max-w-3xl">
            We’d love to welcome you at our headquarters or connect over email anytime you need
            sourcing or order support.
          </motion.p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <motion.div
              variants={item}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-6"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Address</p>
              <p className="mt-3 text-sm text-slate-200">
                Salister, Rajpath Rangoli Rd, Bodakdev, Ahmedabad
              </p>
            </motion.div>
            <motion.div
              variants={item}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-6"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Email</p>
              <p className="mt-3 text-sm text-slate-200">hrconnects@seaflux.tech</p>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;

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

const ContactPage = () => {
  return (
    <div className="bg-slate-950 text-white min-h-full">
      <section className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[120px]"
        />
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-6xl mx-auto px-6 py-20"
        >
          <motion.p variants={item} className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Contact
          </motion.p>
          <motion.h1 variants={item} className="mt-4 text-4xl md:text-6xl font-semibold">
            We’re here when you need us.
          </motion.h1>
          <motion.p variants={item} className="mt-6 max-w-2xl text-lg text-slate-300">
            Questions about your order, sourcing, or how to cook your catch? Reach out and our team
            will get back quickly.
          </motion.p>
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
            Talk to SeaBasket
          </motion.h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Email us",
                copy: "hrconnects@seabasket.com",
                note: "We reply within 2 hours.",
              },
              {
                title: "Call us",
                copy: "+91 9876543210",
                note: "Available 9 AM – 9 PM IST.",
              },
              {
                title: "Visit us",
                copy: "Salister, Rajpath Rangoli Rd, Bodakdev, Ahmedabad",
                note: "Mon–Fri, 10 AM – 6 PM.",
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                variants={item}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-6"
              >
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="mt-3 text-sm text-slate-200">{card.copy}</p>
                <p className="mt-2 text-xs text-slate-400">{card.note}</p>
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
            Quick answers
          </motion.h2>
          <motion.p variants={item} className="mt-3 text-slate-300 max-w-2xl">
            If you’re looking for order status, delivery windows, or storage tips, these are the
            most common topics our team helps with.
          </motion.p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Track an order in your profile dashboard.",
              "Delivery windows are confirmed at checkout.",
              "Store seafood on ice or refrigerate immediately.",
              "Need a bulk order? We can arrange it in advance.",
            ].map((point) => (
              <motion.div
                key={point}
                variants={item}
                className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
              >
                {point}
              </motion.div>
            ))}
          </div>
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
            Our headquarters
          </motion.h2>
          <motion.p variants={item} className="mt-3 text-slate-300 max-w-3xl">
            Prefer an in-person visit? Drop by our Ahmedabad office or email our team and we’ll
            respond quickly.
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

export default ContactPage;

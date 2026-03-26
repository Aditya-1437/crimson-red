"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="py-24 md:py-40 bg-white">
      <div className="container mx-auto px-6 md:px-12 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl border-2 border-crimson/20 rounded-[3rem] p-12 md:p-24 shadow-[0_20px_50px_rgb(153,0,0,0.05)] text-center relative"
        >
          {/* Decorative Quote mark */}
          <span className="absolute top-8 left-8 text-8xl font-serif text-crimson/10 leading-none">
            "
          </span>
          
          <span className="text-crimson font-bold tracking-widest uppercase text-sm mb-8 block relative z-10">
            Our Mission
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-crimson font-bold leading-tight mb-10 relative z-10">
            Crimson Red is a sanctuary for <span className="italic">long-form fiction.</span> <br /> A space where stories aren't just consumed, but lived.
          </h2>
          <p className="text-xl md:text-2xl text-crimson/80 leading-relaxed max-w-3xl mx-auto font-light relative z-10">
            In an era of fleeting attention spans and micro-content, we stand as a testament to the power of the written word. We believe in slow burning plots, intricate character development, and worlds so rich they bleed through the page. Join our community of dedicated readers and visionary authors.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

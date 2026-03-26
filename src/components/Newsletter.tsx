"use client";

import { motion } from "framer-motion";

export default function Newsletter() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="bg-crimson rounded-[4rem] px-8 py-20 md:py-32 shadow-[0_30px_60px_rgb(153,0,0,0.2)] text-center max-w-6xl mx-auto relative overflow-hidden"
        >
           {/* Abstract minimalist circles to replace gradient glow */}
           <div className="absolute top-[-50px] right-[-50px] w-64 h-64 border-[40px] border-white/10 rounded-full"></div>
           <div className="absolute bottom-[-80px] left-[-20px] w-80 h-80 border-[20px] border-white/10 rounded-full"></div>

           <div className="relative z-10 max-w-3xl mx-auto">
             <h2 className="font-serif text-5xl md:text-7xl text-white font-bold mb-8">
               Join the Inner Circle
             </h2>
             <p className="text-white/90 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
               Subscribe to receive exclusive short stories, early access to new serials, and dispatches from our finest authors directly to your inbox.
             </p>
             
             <form className="flex flex-col md:flex-row shadow-2xl rounded-full overflow-hidden bg-white p-2 border-2 border-white focus-within:border-crimson-light transition-colors" onSubmit={(e) => e.preventDefault()}>
               <input 
                 type="email" 
                 placeholder="Enter your email address..." 
                 className="flex-grow px-8 py-5 md:py-6 bg-transparent text-crimson focus:outline-none text-xl placeholder-crimson/40 font-medium"
                 required
               />
               <button 
                 type="submit" 
                 className="px-10 py-5 md:py-6 bg-crimson text-white font-bold tracking-widest uppercase hover:bg-crimson-light transition-colors duration-300 rounded-full whitespace-nowrap text-sm mt-2 md:mt-0"
               >
                 Subscribe Now
               </button>
             </form>
             <p className="text-white/60 text-sm mt-8 tracking-wide">
               We respect your privacy. No spam, ever. Unsubscribe at any time.
             </p>
           </div>
        </motion.div>
      </div>
    </section>
  );
}

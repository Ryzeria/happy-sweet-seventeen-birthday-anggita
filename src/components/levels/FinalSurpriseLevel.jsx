import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Heart, 
  Star, 
  Gift, 
  Camera, 
  BookOpen, 
  Sparkles,
  Download,
  Share2,
  ArrowRight,
  ArrowLeft,
  ImageIcon
} from 'lucide-react';
import Button from '../ui/Button';

const FinalSurpriseLevel = ({ level, onComplete }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [imageErrors, setImageErrors] = useState(new Set());
  
  // Personalized sections untuk Anggita
  const personalizedSections = [
    {
      title: "Dear Anggita Azaria Ramadhani",
      type: "letter",
      content: "Hari ini, 6 September 2025, Gita genap berusia 17 tahun. Tujuh belas tahun Gita jadi berkah di dunia ini, dan Mas Za merasa sangat beruntung bisa jadi bagian dari journey hidup Gita.\n\nDari bocah SD yang Mas Za ajarin olimpiade IPA, sekarang udah jadi remaja cantik yang jadi ketua Mahardika di SMAN 1 Magetan. Dari Shiro-Mochizuki jadi Za-Anggita. Journey kita emang nggak biasa, tapi justru itu yang bikin spesial.\n\nHappy 17th birthday, bocah Tambran favoritku. Semoga di usia yang matang ini, semua cita-cita Gita mulai terwujud, terutama jadi dokter gigi di Unair. Mas Za akan selalu support Gita! 💕\n\n- Mas Za yang sayang banget sama Gita"
    },
    {
      title: "Our Journey Together",
      type: "photo-collage",
      photos: [
        { 
          src: "/images/photos/memory-photo.jpg", 
          caption: "2019 - Roleplay era: Shiro meets Mochizuki 🎮",
          alt: "First photo together from roleplay era"
        },
        { 
          src: "/images/photos/rangking-1.jpg", 
          caption: "2019-2020 - Study sessions: Mas Za ngajarin olimpiade 📚",
          alt: "Study sessions and first dates"
        },
        { 
          src: "/images/photos/lost-contact.jpg", 
          caption: "2022 - Reunion: Ketemu lagi setelah lost contact ✨",
          alt: "Reunion after lost contact"
        },
        { 
          src: "/images/photos/anniversary-1.jpg", 
          caption: "10 Maret 2023 - Jadian day: Best day ever! 💖",
          alt: "Anniversary celebration"
        },
        { 
          src: "/images/photos/recent-photo.jpg", 
          caption: "2025 - Now: Discord dates & happy together 💻",
          alt: "Recent photo together"
        }
      ]
    },
    {
      title: "17 Reasons Why Anggita is Amazing",
      type: "list",
      items: [
        "Pinter banget dari SD udah ikut olimpiade biologi 🧬",
        "Jadi ketua Mahardika dengan leadership skills yang keren 👑",
        "Punya cita-cita mulia jadi dokter gigi di Unair 🦷",
        "Suka baca novel, especially Aroma Karsa yang bagus itu 📚",
        "Cinta banget sama budaya Indonesia 🇮🇩",
        "Sayang sama hewan, pengen pelihara musang bulan 🌙",
        "Suka anggrek bulan yang cantik kayak namamu 🌸",
        "Unik banget suka nasi alpukat (meskipun Mas Za bingung) 🥑",
        "Nggak suka manis dan bakso, beda dari kebanyakan orang 🚫🍰",
        "Suka dimsum, makanan yang kita berdua enjoy 🥟",
        "Punya kenangan indah di Papua dari masa kecil 🏝️",
        "Tinggi 150cm yang pas banget dan lagi diet sehat ⚖️",
        "Sabar banget tunggu Mas Za dari SMA sampai kuliah di ITS 💙",
        "Bisa survive Discord dates tanpa bosan 💻",
        "Always remember detail kecil tentang kita 💭",
        "Berani ambil tanggung jawab jadi ketua ekskul 🌟",
        "Simply being you - bocah Tambran yang perfect! 💖"
      ]
    },
    {
      title: "Wishes for Your 17th Year",
      type: "wishes",
      content: [
        "Semoga tahun ini bawa Gita closer to your dream jadi dokter gigi 🦷",
        "May Unair welcome you dengan open arms nanti 🎓",
        "Semoga Mahardika makin sukses under your leadership 📰",
        "May you find time to read more amazing novels 📚",
        "Semoga someday kita bisa date IRL, nggak cuma Discord 💕",
        "May your dreams of having musang bulan & iguana come true 🌙🦎",
        "Semoga kita bisa traveling ke Papua bareng suatu hari 🏝️",
        "May this year be filled with happiness dan achievement baru ✨"
      ]
    },
    {
      title: "A Promise from Mas Za",
      type: "promise",
      content: "Di hari istimewa ini, Mas Za mau berjanji sama bocah Tambran favoritku:\n\nMas Za akan selalu support mimpi Gita jadi dokter gigi, dari sekarang sampai Gita wisuda di Unair nanti\nMas Za akan be there untuk celebrate every small wins, dari nilai bagus sampai achievement di Mahardika\nMas Za akan sabar nunggu sampe kita bisa date IRL, nggak cuma lewat Discord\nMas Za akan help you see betapa amazing-nya Gita ketika self-doubt comes\nMas Za akan create more beautiful memories sama Gita, both virtual dan real\nDan yang paling penting, Mas Za akan love you exactly as you are - dengan semua keunikan Gita, dari hobi baca novel sampai obsesi musang bulan\n\nHappy 17th Birthday, Anggita Azaria Ramadhani. Here's to another year of being the most wonderful person I know! 🎂💕\n\n- Mas Za, from ITS with love"
    }
  ];

  // Use personalized sections or fall back to level content
  const sections = personalizedSections;

  useEffect(() => {
    // Auto-complete after viewing all sections
    if (completedSections.size === sections.length) {
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  }, [completedSections, sections.length, onComplete]);

  useEffect(() => {
    // Mark current section as completed after 3 seconds
    const timer = setTimeout(() => {
      setCompletedSections(prev => new Set([...prev, currentSection]));
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentSection]);

  useEffect(() => {
    // Show confetti on last section
    if (currentSection === sections.length - 1) {
      setShowConfetti(true);
    }
  }, [currentSection, sections.length]);

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const goToSection = (index) => {
    setCurrentSection(index);
  };

  // Manual complete for testing
  const handleManualComplete = () => {
    onComplete();
  };

  // Component untuk render image dengan fallback
  const PhotoFrame = ({ photo, index }) => {
    const hasError = imageErrors.has(photo.src);
    
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.2 }}
        className="group relative"
      >
        <div className="aspect-square rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-gradient-to-br from-pink-300 to-purple-400">
          {!hasError ? (
            <div className="relative w-full h-full">
              <Image
                src={photo.src}
                alt={photo.alt || photo.caption}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => handleImageError(photo.src)}
                onLoadingComplete={() => {
                  // Remove from error set if image loads successfully
                  setImageErrors(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(photo.src);
                    return newSet;
                  });
                }}
              />
              
              {/* Overlay for hover effect */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Heart icon overlay */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <Heart className="text-white" size={16} />
                </div>
              </div>
            </div>
          ) : (
            // Fallback design yang cantik kalau gambar error
            <div className="w-full h-full flex flex-col items-center justify-center text-white">
              <div className="mb-3">
                <ImageIcon size={48} className="opacity-70" />
              </div>
              <div className="text-center px-3">
                <p className="text-sm font-medium mb-1">Memory Photo</p>
                <p className="text-xs opacity-80 leading-tight">
                  {photo.caption.split(' - ')[0]}
                </p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-3 left-3 text-white/30">
                <Camera size={20} />
              </div>
              <div className="absolute bottom-3 right-3 text-white/30">
                <Sparkles size={16} />
              </div>
            </div>
          )}
        </div>
        
        {/* Caption */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.2 + 0.5 }}
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent backdrop-blur-sm text-white text-sm p-4 rounded-b-2xl"
        >
          <p className="font-medium leading-tight">{photo.caption}</p>
        </motion.div>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
      </motion.div>
    );
  };

  const renderSection = (section) => {
    if (!section || !section.type) {
      return (
        <div className="text-center text-white">
          <p>Section not found or invalid type</p>
        </div>
      );
    }

    switch (section.type) {
      case 'letter':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  💌
                </motion.div>
                <h2 className="text-3xl font-dancing text-white mb-4">
                  {section.title}
                </h2>
              </div>

              <div className="prose prose-invert max-w-none">
                {section.content.split('\n').map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.5 }}
                    className="text-white/90 text-lg leading-relaxed mb-6"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>
        );

      case 'photo-collage':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                📸
              </motion.div>
              <h2 className="text-3xl font-dancing text-white mb-4">
                {section.title}
              </h2>
              <p className="text-white/70 text-lg">
                Journey indah kita dalam gambar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.photos?.map((photo, index) => (
                <PhotoFrame key={index} photo={photo} index={index} />
              )) || (
                <div className="col-span-full text-center text-white/70">
                  <p>No photos available</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity },
                  rotate: { duration: 10, repeat: Infinity, ease: "linear" }
                }}
                className="text-6xl mb-4"
              >
                ⭐
              </motion.div>
              <h2 className="text-3xl font-dancing text-white mb-4">
                {section.title}
              </h2>
            </div>

            <div className="space-y-4">
              {section.items?.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl min-w-[3rem] h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <p className="text-white/90 text-lg flex-1">
                      {item}
                    </p>
                  </div>
                </motion.div>
              )) || <p className="text-white">No items available</p>}
            </div>
          </div>
        );

      case 'wishes':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🌟
              </motion.div>
              <h2 className="text-3xl font-dancing text-white mb-4">
                {section.title}
              </h2>
              <p className="text-white/70 text-lg">
                Harapan dan doa dari Mas Za untuk tahun ke-17 Gita
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {section.content?.map((wish, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-sm border border-purple-300/30 rounded-2xl p-6"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-3">🌠</div>
                    <p className="text-white/90 text-lg leading-relaxed">
                      {wish}
                    </p>
                  </div>
                </motion.div>
              )) || <p className="text-white">No wishes available</p>}
            </div>
          </div>
        );

      case 'promise':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-rose-400/20 to-gold/20 backdrop-blur-md border border-rose-300/50 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🤝
                </motion.div>
                <h2 className="text-3xl font-dancing text-white mb-4">
                  {section.title}
                </h2>
              </div>

              <div className="prose prose-invert max-w-none text-center">
                {section.content?.split('\n').map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.3 }}
                    className="text-white/90 text-xl leading-relaxed mb-6"
                  >
                    {paragraph}
                  </motion.p>
                )) || <p className="text-white">Promise content not available</p>}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-center mt-8"
              >
                <div className="inline-flex items-center gap-3 bg-gold/20 border border-gold/50 px-6 py-3 rounded-full">
                  <Heart className="text-gold" size={20} />
                  <span className="text-gold font-medium">With all my love</span>
                  <Heart className="text-gold" size={20} />
                </div>
              </motion.div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-white">
            <p>Unknown section type: {section.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Testing Button */}
      <div className="fixed top-20 right-4 z-50">
        <Button
          variant="success"
          size="sm"
          onClick={handleManualComplete}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          ✅ Complete Level
        </Button>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#FFB6C1', '#E8B4B8', '#E6E6FA', '#FF7F7F', '#FFD700'][Math.floor(Math.random() * 5)]
              }}
              initial={{
                y: -20,
                rotate: 0,
                scale: 0
              }}
              animate={{
                y: window.innerHeight + 20,
                rotate: Math.random() * 360,
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 3,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="text-center py-12 relative z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="text-8xl mb-4">🎁</div>
          <h1 className="text-5xl md:text-7xl font-dancing text-white mb-4">
            The Ultimate Gift
          </h1>
          <p className="text-xl text-white/80">
            Digital Scrapbook untuk Bocah Tambran Favorit
          </p>
        </motion.div>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center gap-2 mb-8 relative z-10">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSection(index)}
            className={`
              w-4 h-4 rounded-full transition-all duration-300
              ${index === currentSection 
                ? 'bg-gold scale-125 shadow-gold' 
                : completedSections.has(index)
                ? 'bg-green-400'
                : 'bg-white/30'
              }
            `}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
          >
            {renderSection(sections[currentSection])}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-3 shadow-2xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevSection}
            disabled={currentSection === 0}
            className="p-3 rounded-full"
            icon={<ArrowLeft size={20} />}
          />

          <div className="text-white text-sm font-medium px-4">
            {currentSection + 1} / {sections.length}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextSection}
            disabled={currentSection === sections.length - 1}
            className="p-3 rounded-full"
            icon={<ArrowRight size={20} />}
          />
        </div>
      </div>

      {/* Completion Message */}
      {completedSections.size === sections.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center max-w-2xl mx-4">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-4xl font-dancing text-white mb-6">
              Happy 17th Birthday Anggita!
            </h2>
            <p className="text-white/90 text-xl leading-relaxed mb-8">
              Gita udah complete seluruh journey of love ini! Website ini, semua games, 
              setiap kata dan surprise - semuanya dibuat dengan satu tujuan: 
              to show you betapa spesialnya Gita dan betapa besar cinta Mas Za buat Gita.
            </p>
            <div className="bg-gradient-to-r from-gold/20 to-pink-400/20 border border-gold/50 rounded-2xl p-6">
              <p className="text-gold text-lg font-medium">
                Semoga tahun ke-17 Gita dipenuhi kebahagiaan, cinta, dan magic sebanyak yang Gita bawa ke hidup Mas Za. 
                From roleplay to reality, from Tambran to my heart - I love you, Anggita! 💕
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FinalSurpriseLevel;
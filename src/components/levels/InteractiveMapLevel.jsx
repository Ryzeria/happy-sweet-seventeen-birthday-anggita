import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart, Eye } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const InteractiveMapLevel = ({ level, onComplete }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [visitedLocations, setVisitedLocations] = useState(new Set());
  const [showModal, setShowModal] = useState(false);

  // Personalized locations untuk Anggita
  const personalizedLocations = [
    {
      name: "Papua - Tanah Kenangan",
      coordinate: { lat: -4.269, lng: 138.080 },
      memory: "Tempat yang special banget buat Gita! Masa yang indah waktu Pak Niam kerja di Sampoerna Papua. Mas Za tau Gita kangen banget sama Papua, makanya someday kita harus kesana bareng. Mas Za pengen liat tempat yang bikin childhood Gita jadi memorable ✈️",
      image: "/images/photos/special-place-1.jpg",
      date: "Childhood Memories",
      icon: "🏝️"
    },
    {
      name: "Tambran Magetan - Kampung Halaman Bocah Favorit",
      coordinate: { lat: -7.647, lng: 111.317 },
      memory: "Home sweet home! Tempat dimana bocah Tambran favoritku dibesarkan. Mas Za belum pernah kesana, tapi pengen banget suatu hari main ke rumah Gita, ketemu Pak Niam sama Bu Nita, dan liat lingkungan yang ngebentuk Gita jadi amazing kayak sekarang 🏘️",
      image: "/images/photos/special-place-2.jpg",
      date: "Hometown Visit (Soon!)",
      icon: "🏠"
    },
    {
      name: "SMAN 1 Magetan - Tempat Gita Bersinar",
      coordinate: { lat: -7.650, lng: 111.350 },
      memory: "Sekolah dimana Gita jadi ketua Mahardika yang keren! Tempat Gita develop leadership skills, belajar biologi yang Gita suka, dan jadi remaja yang inspiring. Bangga banget sama semua achievement Gita di sekolah 🏫",
      image: "/images/photos/recent-photo.jpg",
      date: "School Days",
      icon: "🎓"
    },
    {
      name: "Surabaya ITS - Tempat Mas Za Kuliah",
      coordinate: { lat: -7.282, lng: 112.795 },
      memory: "Kampus dimana Mas Za belajar sambil mikirin Gita terus. Dari sini Mas Za kirim pesan-pesan manis, video call sama Gita, dan dreaming about our future together. Distance makes the heart grow fonder! 💙",
      image: "/images/photos/special-place-3.jpg",
      date: "College Life",
      icon: "🎓"
    },
    {
      name: "Unair Surabaya - Future Campus Anggita",
      coordinate: { lat: -7.269, lng: 112.781 },
      memory: "Kampus impian Gita untuk jadi dokter gigi! Mas Za yakin banget Gita bakal diterima di sini. Nanti kalau Gita kuliah di Unair, kita bisa lebih deket dan date IRL lebih sering. Can't wait untuk support Gita achieve this dream! 🦷",
      image: "/images/photos/special-place-4.jpg",
      date: "Future Dream",
      icon: "🦷"
    }
  ];

  const locations = level?.content?.locations || personalizedLocations;

  useEffect(() => {
    if (visitedLocations.size === locations.length && locations.length > 0) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [visitedLocations, locations.length, onComplete]);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setShowModal(true);
    setVisitedLocations(prev => new Set([...prev, location.name]));
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="text-6xl mb-4"
        >
          🗺️
        </motion.div>
        
        <h2 className="text-3xl font-dancing text-white mb-4">
          Peta Perjalanan Hidup Kita
        </h2>
        
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Jelajahi tempat-tempat spesial dalam hidup kita - dari Papua masa kecilmu, 
          Tambran hometown-mu, sampai future dreams kita bersama
        </p>
      </div>

      {/* Progress */}
      <div className="flex justify-center gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <MapPin size={16} />
            <span>Explored: {visitedLocations.size}/{locations.length}</span>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="mb-8">
        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mx-auto overflow-hidden" style={{ height: '500px', maxWidth: '800px' }}>
          {/* Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-2xl">
            <div className="absolute inset-4 bg-white/5 rounded-xl flex items-center justify-center text-white/40">
              <div className="text-center">
                <MapPin size={48} className="mx-auto mb-2" />
                <p className="text-lg font-dancing">Peta Kenangan & Impian</p>
                <p className="text-sm">Indonesia - Jawa & Papua</p>
              </div>
            </div>
          </div>

          {/* Location Markers */}
          {locations.map((location, index) => {
            const isVisited = visitedLocations.has(location.name);
            
            // Position markers berdasarkan lokasi geografis yang disederhanakan
            const positions = [
              { left: '10%', top: '20%' }, // Papua (kiri atas)
              { left: '65%', top: '60%' }, // Magetan (tengah)
              { left: '70%', top: '70%' }, // SMAN 1 Magetan
              { left: '75%', top: '65%' }, // ITS Surabaya
              { left: '78%', top: '68%' }  // Unair Surabaya
            ];
            
            return (
              <motion.button
                key={location.name}
                onClick={() => handleLocationClick(location)}
                className={`absolute z-10 p-4 rounded-full border-2 transition-all duration-300 ${
                  isVisited 
                    ? 'bg-green-400 border-green-300 text-white shadow-lg' 
                    : 'bg-pink-400 border-pink-300 text-white hover:scale-110 shadow-md'
                } `}
                style={positions[index] || { left: `${20 + index * 150}px`, top: `${100 + Math.sin(index) * 80}px` }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.3 }}
              >
                <div className="text-2xl">{location.icon || '📍'}</div>
                
                {/* Location Label */}
                <div className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full whitespace-nowrap border border-white/20">
                  {location.name.split(' - ')[0]}
                </div>

                {/* Pulse Animation for Unvisited */}
                {!isVisited && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-pink-400/30"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Check Mark for Visited */}
                {isVisited && (
                  <motion.div
                    className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.button>
            );
          })}

          {/* Map Grid Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Location List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {locations.map((location, index) => {
          const isVisited = visitedLocations.has(location.name);
          
          return (
            <motion.div
              key={location.name}
              onClick={() => handleLocationClick(location)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                isVisited 
                  ? 'bg-green-400/20 border border-green-400/30' 
                  : 'bg-white/10 border border-white/20 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">{location.icon}</div>
                <div className="flex-1">
                  <h3 className={`font-medium ${isVisited ? 'text-green-300' : 'text-white'}`}>
                    {location.name.split(' - ')[0]}
                  </h3>
                  <p className="text-sm text-white/60">{location.name.split(' - ')[1]}</p>
                </div>
                {isVisited && <span className="text-green-300 text-lg">✓</span>}
              </div>
              <p className="text-white/70 text-sm">{location.date}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Instructions */}
      {visitedLocations.size === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 max-w-2xl mx-auto"
        >
          <h3 className="text-lg font-dancing text-white mb-3">
            Explore Our Special Places
          </h3>
          <p className="text-white/80 mb-4">
            Click pada setiap location marker untuk discover kenangan dan impian kita 
            di tempat-tempat yang meaningful dalam hidup kita!
          </p>
          <p className="text-white/70 text-sm">
            From your childhood in Papua to our future dreams together 💕
          </p>
        </motion.div>
      )}

      {/* Completion Message */}
      {visitedLocations.size === locations.length && visitedLocations.size > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mt-8"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-dancing text-white mb-4">
            All Locations Explored!
          </h3>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Gita udah explore semua tempat spesial dalam hidup kita! 
            Dari Papua masa kecil Gita, Tambran hometown, sampai future dreams kita di Surabaya. 
            Di manapun kita berada, yang penting kita bareng! 🌍💕
          </p>
        </motion.div>
      )}

      {/* Location Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        size="lg"
      >
        {selectedLocation && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-4">{selectedLocation.icon}</div>
              <h2 className="text-2xl font-dancing text-white mb-2">
                {selectedLocation.name.split(' - ')[0]}
              </h2>
              <p className="text-white/70 text-lg mb-2">
                {selectedLocation.name.split(' - ')[1]}
              </p>
              <div className="flex items-center justify-center gap-2 text-white/70">
                <Calendar size={16} />
                <span>{selectedLocation.date}</span>
              </div>
            </div>

            {/* FIXED: Memory Image with proper img tag */}
            <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
              <img 
                src={selectedLocation.image} 
                alt={selectedLocation.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback jika gambar tidak ditemukan
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-pink-300 to-purple-400 rounded-xl hidden items-center justify-center mb-4">
                <div className="text-center text-white">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-sm">Photo: {selectedLocation.image}</p>
                </div>
              </div>
            </div>

            {/* Memory Description */}
            <div className="bg-white/10 p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="text-pink-400" size={20} />
                <h3 className="text-white font-medium">Kenangan & Impian Kita</h3>
              </div>
              <p className="text-white/90 leading-relaxed">
                {selectedLocation.memory}
              </p>
            </div>

            <div className="text-center">
              <Button
                variant="primary"
                onClick={() => setShowModal(false)}
                className="px-8"
              >
                Beautiful Memory ❤️
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InteractiveMapLevel;
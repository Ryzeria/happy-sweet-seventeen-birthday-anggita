export const levels = [
  // Level 1: Memory Lane - Our Journey
  {
    id: 1,
    title: "Journey Kita Dimulai",
    subtitle: "Dari Roleplay Sampai Jadian",
    type: "timeline",
    category: "Memory Lane",
    description: "Mari kita lihat perjalanan unik kita, dari Shiro-Mochizuki sampai Za-Anggita",
    icon: "📅",
    color: "from-pink-400 to-rose-400",
    unlocked: true,
    content: {
      timeline: [
        {
          date: "2019",
          title: "Ketemu di Grup Roleplay",
          description: "Awal segalanya! Gita jadi Shiro, Mas Za jadi Mochizuki. Dari sini mulai panggilan 'Kang Gojek Jeli' karena kenyal kayak mochi 😂",
          image: "/images/photos/shiro-mochi.jpg",
          emoji: "🎮"
        },
        {
          date: "2019-2020", 
          title: "Era Tutor Olimpiade",
          description: "Masa-masa Mas Za bantuin bocah SD pinter dari Tambran belajar olimpiade IPA. Siapa sangka murid Mas Za bakal jadi pacarku 📚",
          image: "/images/photos/osn-date.jpg",
          emoji: "🏆"
        },
        {
          date: "2022",
          title: "Ketemu Lagi!",
          description: "Plot twist! Setelah lost contact, kita bertemu lagi. Mas Za udah kuliah di ITS, Gita kelas IX SMP. Takdir emang nggak bisa ditolak",
          image: "/images/photos/lost-contact.jpg", 
          emoji: "✨"
        },
        {
          date: "10 Maret 2023",
          title: "Akhirnya Jadian!",
          description: "Tanggal bersejarah! Dari roleplay buddies jadi real couple. Journey 4 tahun finally berbuah manis 💕",
          image: "/images/photos/recent-photo.jpg",
          emoji: "💖"
        }
      ]
    },
    completionMessage: "Thank you udah mau nunggu journey panjang kita sampai jadian. Love you, bocah Tambran favorit ❤️"
  },

  {
    id: 2,
    title: "Puzzle Foto Kita",
    subtitle: "Susun Momen Bersejarah",
    type: "jigsaw",
    category: "Memory Lane", 
    description: "Susun puzzle foto dari salah satu momen penting kita",
    icon: "🧩",
    color: "from-purple-400 to-pink-400",
    unlocked: true,
    content: {
      image: "/images/photos/puzzle-photo.jpg",
      pieces: 16,
      difficulty: "easy"
    },
    completionMessage: "Perfect! Kayak puzzle ini, kita juga perfect kalau udah jadi satu 🧩💕"
  },

  {
    id: 3,
    title: "Memory Matching",
    subtitle: "Cocokkan Kenangan Kita",
    type: "memory-cards",
    category: "Memory Lane",
    description: "Temukan pasangan kartu yang berisi moment-moment spesial kita",
    icon: "🃏", 
    color: "from-rose-400 to-pink-400",
    unlocked: true,
    content: {
      cards: [
        { id: 1, image: "/images/photos/first-date.jpg", title: "Roleplay Era" },
        { id: 2, image: "/images/photos/cute-moment-1.jpg", title: "Study Sessions" },
        { id: 3, image: "/images/photos/special-place-1.jpg", title: "Lost Contact" },
        { id: 4, image: "/images/photos/anniversary-1.jpg", title: "Reunion 2022" },
        { id: 5, image: "/images/photos/birthday-last-year.jpg", title: "Jadian Day" },
        { id: 6, image: "/images/photos/favorite-date.jpg", title: "Discord Dates" }
      ]
    },
    completionMessage: "Gita emang punya memory yang baik! Makanya bisa inget semua detail tentang kita 💝"
  },

  // Level 4-6: Getting to Know You (About Anggita)
  {
    id: 4,
    title: "17 Hal Tentang Anggita",
    subtitle: "Quiz Kepribadian Bocah Tambran",
    type: "personality-quiz",
    category: "Getting to Know You",
    description: "Seberapa baik Gita kenal diri sendiri, Anggita Azaria Ramadhani?",
    icon: "❓",
    color: "from-indigo-400 to-purple-400",
    unlocked: true,
    content: {
      questions: [
        {
          question: "Apa cita-cita utama Gita?",
          options: [
            "Jadi dokter gigi di Universitas Airlangga",
            "Jadi penulis novel seperti Aroma Karsa", 
            "Jadi pemimpin organisasi besar",
            "Travelling keliling Indonesia"
          ],
          correctAnswer: 0,
          explanation: "Yep! Cita-cita jadi dokter gigi di Unair. Mas Za yakin Gita pasti bisa achieve it! 🦷✨"
        },
        {
          question: "Hewan apa yang paling pengen Gita pelihara?",
          options: [
            "Kucing persia yang fluffy",
            "Musang bulan yang lucu",
            "Iguana yang eksotis", 
            "Anjing golden retriever"
          ],
          correctAnswer: 1,
          explanation: "Musang bulan! Sayang Pak Niam sama Bu Nita belum ngizinin. Someday ya sayang 🌙"
        },
        {
          question: "Makanan apa yang Gita suka tapi orang lain anggap aneh?",
          options: [
            "Es krim dengan kerupuk",
            "Nasi dengan alpukat",
            "Pizza dengan nanas",
            "Coklat dengan keju"
          ],
          correctAnswer: 1,
          explanation: "Nasi alpukat! Emang aneh sih menurut Mas Za, tapi ya udahlah asal Gita suka 😂🥑"
        }
      ]
    },
    completionMessage: "Gita emang amazing dan unik! That's why you're my bocah Tambran favorit 🌟"
  },

  {
    id: 5,
    title: "Favorite Things Anggita",
    subtitle: "Hal-hal yang Bikin Gita Spesial",
    type: "bingo",
    category: "Getting to Know You",
    description: "Temukan semua hal yang Gita suka dan bikin Gita jadi diri sendiri",
    icon: "🎯",
    color: "from-pink-400 to-red-400", 
    unlocked: true,
    content: {
      items: [
        { name: "Novel Aroma Karsa", emoji: "📚" },
        { name: "Olimpiade Biologi", emoji: "🧬" },
        { name: "Majalah Mahardika", emoji: "📰" },
        { name: "Musang Bulan", emoji: "🌙" },
        { name: "Anggrek Bulan", emoji: "🌸" },
        { name: "Nasi Alpukat", emoji: "🥑" },
        { name: "Dimsum Enak", emoji: "🥟" },
        { name: "Liburan Papua", emoji: "🏝️" },
        { name: "Discord Date", emoji: "💻" },
        { name: "Iguana Lucu", emoji: "🦎" },
        { name: "Budaya Indonesia", emoji: "🇮🇩" },
        { name: "SMAN 1 Magetan", emoji: "🏫" },
        { name: "FREE 💕", emoji: "💕" },
        { name: "Ketua Ekskul", emoji: "👑" },
        { name: "Diet 47kg", emoji: "⚖️" },
        { name: "Unair Dreams", emoji: "🎓" }
      ]
    },
    completionMessage: "Mas Za hafal semua kesukaan dan keunikan Gita. That's what boyfriends do! 💕"
  },

  {
    id: 6, 
    title: "Word Search Anggita",
    subtitle: "Temukan Kata-kata yang Menggambarkan Gita",
    type: "word-search",
    category: "Getting to Know You",
    description: "Cari kata-kata yang describe kepribadian Gita yang amazing",
    icon: "🔍",
    color: "from-teal-400 to-blue-400",
    unlocked: true,
    content: {
      words: [
        "PINTER", "CANTIK", "UNIK", "LUCU", "BAIK", "SAYANG", 
        "LEADER", "KUAT", "HEBAT", "TAMBRAN", "ANGGITA", "PERFECT"
      ],
      grid: 12
    },
    completionMessage: "Semua kata bagus di dunia pun nggak cukup untuk describe Gita 🔍💖"
  },

  // Level 7-9: Adventures Together  
  {
    id: 7,
    title: "Peta Impian Kita",
    subtitle: "Tempat-tempat yang Pengen Kita Kunjungi",
    type: "interactive-map", 
    category: "Adventures Together",
    description: "Explore tempat-tempat yang pengen kita kunjungi bareng",
    icon: "🗺️",
    color: "from-green-400 to-blue-400",
    unlocked: true,
    content: {
      locations: [
        {
          name: "Papua - Tanah Kenangan",
          coordinate: { lat: -4.269, lng: 138.080 },
          memory: "Tempat yang Gita kangen dari masa kecil waktu Pak Niam kerja di Sampoerna. Pengen banget kesana bareng suatu hari nanti",
          image: "/images/photos/special-place-1.jpg",
          date: "Future Trip"
        },
        {
          name: "Tambran Magetan - Home Sweet Home", 
          coordinate: { lat: -7.647, lng: 111.317 },
          memory: "Kampung halaman bocah Tambran favoritku. Someday Mas Za pengen main kesana",
          image: "/images/photos/special-place-2.jpg", 
          date: "Hometown Visit"
        },
                {
          name: "ITS Surabaya - Tempat Mas Za Kuliah", 
          coordinate: { lat: -7.282, lng: 112.795 },
          memory: "Kampung halaman bocah Tambran favoritku. Someday Mas Za pengen main kesana",
          image: "/images/photos/special-place-3.jpg", 
          date: "College Life"
        },
                        {
          name: "Unair Surabaya - Future Campus Anggita", 
          coordinate: { lat: -7.269, lng: 112.781 },
          memory: "Kampus impian Gita untuk jadi dokter gigi! Mas Za yakin banget Gita bakal diterima di sini. Nanti kalau Gita kuliah di Unair, kita bisa lebih deket dan date IRL lebih sering. Can't wait untuk support Gita achieve this dream! 🦷",
          image: "/images/photos/special-place-4.jpg", 
          date: "Future Dream"
        },
      ]
    },
    completionMessage: "Di manapun kita pergi nanti, yang penting kita bareng 🌍💕"
  },

  {
    id: 8,
    title: "Photo Memory Hunt",
    subtitle: "Treasure Hunt Kenangan Virtual",
    type: "treasure-hunt",
    category: "Adventures Together", 
    description: "Temukan detail tersembunyi dalam 'foto' kenangan kita",
    icon: "📷",
    color: "from-yellow-400 to-orange-400",
    unlocked: true,
    content: {
      photos: [
        {
          image: "/images/photos/bebek.jpg",
          clue: "Di masa study session, Mas Za pernah gambarin hewan apa buat Gita?",
          answer: "bebek",
          hint: "Hewan yang lucu dan Mas Za suka gambar waktu ngajarin matematika"
        },
        {
          image: "/images/photos/discord.jpg",
          clue: "Aplikasi apa yang kita pake buat date online?",
          answer: "discord",
          hint: "Platform gaming yang jadi tempat kita nongkrong virtual"
        },
        {
          image: "/images/photos/jadian.jpg",
          clue: "Tahun berapa kita jadian?",
          answer: "2023",
          hint: "Bulan Maret, tanggal yang double digit dan sama"
        },
                {
          image: "/images/photos/binturong.jpg",
          clue: "Hewan favorit yang pengen Gita pelihara tapi Pak Niam sama Bu Nita belum ngizinin?",
          answer: "binturong",
          hint: "Hewan nokturnal yang cute banget"
        },
                        {
          image: "/images/photos/nasi-alpukat.jpg",
          clue: "Makanan aneh yang Gita suka tapi bikin Mas Za bingung?",
          answer: "nasi alpukat",
          hint: "Kombinasi weird antara carb dan buah hijau"
        },
      ]
    },
    completionMessage: "Gita detective terbaik untuk mengingat detail-detail manis kita! 🕵️‍♀️💕"
  },

  {
    id: 9,
    title: "Future Date Ideas", 
    subtitle: "Rencana Kencan Masa Depan",
    type: "roulette",
    category: "Adventures Together",
    description: "Spin the wheel untuk lihat ide kencan kita yang akan datang!",
    icon: "🎡",
    color: "from-purple-400 to-pink-500",
    unlocked: true,
    content: { 
      dateIdeas: [
        "Ke kebun binatang buat liat musang bulan 🌙",
        "Jalan-jalan ke Papua, nostalgia masa kecil Gita 🏝️", 
        "Makan dimsum bareng (makanan yang kita berdua suka) 🥟",
        "Ke perpustakaan, beli novel baru buat Gita 📚",
        "Visit kampus Unair, liat tempat kuliah impian Gita 🎓",
        "Ke taman anggrek, foto-foto sama anggrek bulan 🌸",
        "Keliling Magetan, explore hometown Gita 🏘️",
        "Ke museum budaya, sesuai passion Gita 🏛️"
      ]
    },
    completionMessage: "Nggak sabar buat semua adventure kita yang akan datang! 🚀💕"
  },

  // Level 10-12: Fun & Games
  {
    id: 10,
    title: "Crossword Kita",
    subtitle: "TTS Inside Jokes Anggita-Za", 
    type: "crossword",
    category: "Fun & Games",
    description: "Solve crossword yang isinya tentang kita berdua",
    icon: "🧩",
    color: "from-blue-400 to-purple-500",
    unlocked: true,
    content: { 
      clues: {
        across: [
          "Panggilan sayang buat Gita dari Mas Za (6)",
          "Hewan favorit yang pengen dipelihara (6)",
          "Makanan aneh yang Gita suka (4)"
        ],
        down: [
          "Aplikasi buat date online (7)", 
          "Cita-cita Gita (6)",
          "Kampung halaman Gita (7)"
        ]
      }
    },
    completionMessage: "Gita tau semua inside jokes dan detail tentang kita! 🤭💕"
  },

  {
    id: 11,
    title: "Advanced Memory Challenge",
    subtitle: "Level Memory Game yang Lebih Susah",
    type: "advanced-memory",
    category: "Fun & Games",
    description: "Test memory Gita dengan game yang lebih challenging",
    icon: "🧠",
    color: "from-indigo-500 to-purple-600",
    unlocked: true,
    content: { 
      cards: [
        "/images/photos/roleplay-era.jpg",
        "/images/photos/study-session.jpg", 
        "/images/photos/reunion-2022.jpg",
        "/images/photos/jadian-day.jpg",
        "/images/photos/discord-date.jpg",
        "/images/photos/birthday-celebration.jpg"
      ],
      timeLimit: 120
    },
    completionMessage: "Memory Gita luar biasa! Makanya bisa inget semua detail tentang kita 🧠💖"
  },

  {
    id: 12,
    title: "Catch the Hearts",
    subtitle: "Mini Game Tangkap Hati",
    type: "arcade-game",
    category: "Fun & Games", 
    description: "Tangkap hati-hati yang berjatuhan, seperti cara Gita tangkap hati Mas Za",
    icon: "💝",
    color: "from-pink-500 to-red-500",
    unlocked: true,
    content: {
      gameType: "catch-hearts",
      targetScore: 1700, // sesuai umur 17
      timeLimit: 60
    },
    completionMessage: "Gita berhasil tangkap semua hati! Just like how you caught mine 💕🎯"
  },

  // Level 13-15: Hidden Treasures
  {
    id: 13,
    title: "100 Folder Surprise", 
    subtitle: "Eksplorasi Kejutan dari Mas Za",
    type: "folder-explorer",
    category: "Hidden Treasures",
    description: "Explore 100 folder yang berisi surprise dan pesan cinta",
    icon: "📁",
    color: "from-gold to-yellow-500",
    unlocked: true,
    content: { folderCount: 100 },
    completionMessage: "Setiap folder berisi sepotong kecil cinta Mas Za buat bocah Tambran favorit 📁💕"
  },

  {
    id: 14,
    title: "Secret Code dari Mas Za",
    subtitle: "Decode Pesan Rahasia Cinta",
    type: "cipher-game",
    category: "Hidden Treasures", 
    description: "Pecahkan kode rahasia yang berisi pesan spesial",
    icon: "🔐",
    color: "from-indigo-600 to-blue-600",
    unlocked: true,
    content: { 
      ciphers: [
        {
          type: "caesar",
          message: "DQX FLQWD ERFDK WDPEUDQ IDYRULWNX",
          solution: "AKU CINTA BOCAH TAMBRAN FAVORITKU",
          hint: "Geser 3 huruf ke belakang"
        }
      ]
    },
    completionMessage: "Gita berhasil decode semua pesan rahasia cinta Mas Za! 🔓💕"
  },

  {
    id: 15,
    title: "Escape Room Virtual",
    subtitle: "Escape to Our Love Story",
    type: "escape-room",
    category: "Hidden Treasures",
    description: "Solve puzzle untuk 'escape' dan temukan surprise terakhir",
    icon: "🚪",
    color: "from-purple-600 to-indigo-600", 
    unlocked: true,
    content: { room: "love-chamber" },
    completionMessage: "Congratulations! Gita berhasil escape dan nemuin jalan menuju hati Mas Za 🚪💕"
  },

  // Level 16-17: Grand Finale
  {
    id: 16,
    title: "Choose Your Adventure",
    subtitle: "Interactive Love Story Kita",
    type: "interactive-story",
    category: "Grand Finale",
    description: "Buat pilihan dalam cerita interaktif tentang future kita", 
    icon: "📖",
    color: "from-rose-500 to-pink-600",
    unlocked: true,
    content: { story: "anggita-za-future" },
    completionMessage: "Apapun pilihan yang Gita buat, ending kita akan selalu happy 💕📚"
  },

  {
    id: 17,
    title: "Ultimate Birthday Gift",
    subtitle: "Surprise Terbesar untuk Ulang Tahun ke-17",
    type: "final-surprise",
    category: "Grand Finale", 
    description: "Surprise terakhir dan terbesar untuk hari istimewa Gita",
    icon: "🎁",
    color: "from-gold to-yellow-600",
    unlocked: true,
    content: {
      surpriseType: "digital-scrapbook",
      title: "17 Years of Amazing Anggita",
      sections: [
        {
          title: "Dear Anggita Azaria Ramadhani",
          type: "letter",
          content: "Happy 17th birthday bocah Tambran favoritku! Dari roleplay 2019 sampai jadian 2023, journey kita emang unik. Semoga di usia 17 ini, semua mimpi Gita mulai terwujud, especially jadi dokter gigi di Unair. Love you so much! 💕"
        }
      ]
    },
    completionMessage: "🎉 Selamat! Gita udah selesaiin semua 17 level birthday surprise! Happy 17th birthday Anggita! 🎂✨"
  }
];

export const getLevel = (id) => {
  return levels.find(level => level.id === id);
};

export const getUnlockedLevels = () => {
  return levels.filter(level => level.unlocked);
};

export const unlockLevel = (id) => {
  const level = levels.find(level => level.id === id);
  if (level) {
    level.unlocked = true;
  }
};
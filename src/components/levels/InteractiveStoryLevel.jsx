import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, BookOpen } from 'lucide-react';
import Button from '../ui/Button';

const InteractiveStoryLevel = ({ level, onComplete }) => {
  const [currentScene, setCurrentScene] = useState('start');
  const [storyPath, setStoryPath] = useState(['start']);
  const [showRestart, setShowRestart] = useState(false);

  // Default story if level.content is empty or malformed
  const defaultStory = {
    start: {
      text: "Di hari ulang tahun ke-17 yang istimewa ini, Gita duduk di kamar sambil prepare untuk celebration. Tiba-tiba, phone Gita bunyi dengan notification dari Mas Za. Ada pesan: 'Happy birthday bocah Tambran favorit! Ada surprise special nih...' Apa yang akan Gita lakukan?",
      choices: [
        { text: "Langsung excited buka website surprise dari Mas Za", next: "excited" },
        { text: "Video call dulu sama Mas Za untuk thank you", next: "call_first" },
        { text: "Share ke story IG dulu tentang birthday surprise", next: "social_media" }
      ]
    },
    excited: {
      text: "Gita langsung buka laptop dan akses website yang Mas Za kirim. WOW! Ternyata ada 17 level games yang specially made untuk ulang tahun ke-17 Gita! Setiap level berisi kenangan kalian dari roleplay era sampai sekarang. Mata Gita berbinar melihat effort yang Mas Za put into this.",
      choices: [
        { text: "Langsung mulai main level 1 dengan semangat", next: "start_gaming" },
        { text: "Screenshot dulu untuk memories", next: "screenshot" }
      ]
    },
    call_first: {
      text: "Gita video call Mas Za via Discord. Dia appear di screen dengan senyum lebar! 'Surprise!' katanya sambil waving. 'Mas Za udah prepare something special banget buat ulang tahun ke-17 Gita. It's a whole interactive website with games about us!'",
      choices: [
        { text: "Bilang 'OMG ini amazing banget Za!'", next: "appreciation" },
        { text: "Jokingly bilang 'Wah Mas Za jadi programmer nih'", next: "joking" }
      ]
    },
    social_media: {
      text: "Gita post di IG story: 'Someone made me the most creative birthday surprise ever! 17 levels of love 💕 #BestBoyfriendEver #17thBirthday'. Responses langsung berdatangan dari teman-teman yang curious dan impressed!",
      choices: [
        { text: "Reply semua comments dengan excited", next: "social_buzz" },
        { text: "Focus ke surprise dari Mas Za dulu", next: "focus_surprise" }
      ]
    },
    start_gaming: {
      text: "Level 1 dimulai dengan timeline perjalanan kalian. Dari roleplay Shiro-Mochizuki, era study sessions, lost contact, sampai jadian 10 Maret 2023. Setiap memory ditampilkan dengan detail yang sweet banget. Gita realize betapa Mas Za remember every little detail tentang relationship kalian.",
      choices: [
        { text: "Continue ke level selanjutnya", next: "level_progress" },
        { text: "Chat Mas Za dulu: 'Za, this is so sweet!'", next: "mid_game_chat" }
      ]
    },
    screenshot: {
      text: "Gita screenshot homepage website yang beautiful itu. The design is so aesthetic dengan warna pink dan purple yang Gita suka. Gita save juga screenshot dari each level sebagai digital scrapbook. This is definitely going into your 'Special Memories' folder!",
      choices: [
        { text: "Start playing the games", next: "delayed_start" },
        { text: "Send screenshots ke Mas Za with heart emojis", next: "send_screenshots" }
      ]
    },
    appreciation: {
      text: "Mas Za's face lights up! 'I spent weeks working on this, especially during semester break. Every level represents something special about you atau about us. Ada puzzle, games, memory lane, everything! Mas Za want your 17th birthday to be unforgettable.'",
      choices: [
        { text: "Say 'I love you so much, this is perfect'", next: "love_confession" },
        { text: "Ask 'How did you learn to make websites?'", next: "curious_tech" }
      ]
    },
    joking: {
      text: "Mas Za ketawa! 'Haha iya, I had to learn coding just for this project! YouTube university jadi teman setia. Worth it banget though, seeing your reaction right now. Programmer dadakan demi bocah Tambran favorit!'",
      choices: [
        { text: "Tease him: 'My boyfriend the coding genius!'", next: "teasing" },
        { text: "Be touched: 'You learned coding just for me?'", next: "touched" }
      ]
    },
    social_buzz: {
      text: "Teman-teman Gita pada comment 'Relationship goals banget!', 'Mas Za the best bf ever!', 'We need boyfriends like this!'. Gita jadi proud banget dan reply dengan excited. Even ketua kelas Mahardika comment 'Wah kreatif banget pacarmu git!'",
      choices: [
        { text: "Feel proud dan start playing the website", next: "proud_start" },
        { text: "Tag Mas Za di story untuk appreciation", next: "tag_appreciation" }
      ]
    },
    focus_surprise: {
      text: "Gita decide untuk focus ke surprise dari Mas Za first before social media. You open the website dan immediately fall in love dengan the design. Every detail shows his thoughtfulness dan effort yang dia put untuk bikin birthday Gita special.",
      choices: [
        { text: "Start the journey with full attention", next: "focused_gaming" }
      ]
    },
    level_progress: {
      text: "Setelah beberapa level, Gita sampai di puzzle tentang favorite things Gita. Mulai dari musang bulan yang pengen dipelihara, anggrek bulan favorit, sampai nasi alpukat yang Mas Za anggap aneh. Everything is so accurate dan detailed, prove betapa dia pay attention to everything about you.",
      choices: [
        { text: "Feel emotional karena sweet gesture ini", next: "emotional" },
        { text: "Continue gaming with bigger smile", next: "happy_gaming" }
      ]
    },
    mid_game_chat: {
      text: "Gita quick chat ke Mas Za: 'Za this is SO SWEET! I can't believe you remember every detail about us 🥺💕'. Dia reply instantly: 'Everything about you is worth remembering, birthday girl! Keep playing, there's more surprises ahead!'",
      choices: [
        { text: "Continue dengan hati yang touched", next: "touched_continue" }
      ]
    },
    delayed_start: {
      text: "After documenting everything, Gita finally start playing. Each level unfolds like a love letter dalam bentuk interactive games. You realize this isn't just a birthday gift - this is months of work, love, dan attention to detail.",
      choices: [
        { text: "Appreciate every moment of the journey", next: "slow_appreciation" }
      ]
    },
    send_screenshots: {
      text: "Gita send screenshots ke Mas Za dengan caption 'BABY THIS IS AMAZING 😭💕 I'm crying happy tears rn'. Dia reply: 'Jangan nangis dong, ini baru permulaan! Enjoy every level ya sayang 🥰'",
      choices: [
        { text: "Start playing dengan excitement penuh", next: "excited_start" }
      ]
    },
    love_confession: {
      text: "Mata Mas Za jadi soft dan loving. 'I love you too, Anggita. You deserve all the best things in life, dan Mas Za want to be part of making your days special. This website is just a small way to show how much you mean to me. Happy 17th birthday, my amazing girlfriend.'",
      choices: [
        { text: "End call dan start playing with full heart", next: "ending1" }
      ]
    },
    curious_tech: {
      text: "Mas Za explains enthusiastically: 'I learned React, JavaScript, everything from scratch! Spent nights watching tutorials, debugging code, designing every pixel. Worth every sleepless night to see you smile like this. Technology untuk love ya!'",
      choices: [
        { text: "Be amazed by his dedication", next: "amazed_dedication" }
      ]
    },
    teasing: {
      text: "Mas Za blushing: 'Jangan digini dong, Mas Za masih newbie programmer! Tapi kalau untuk Gita, Mas Za bisa belajar apapun. Next time mungkin Mas Za bikin app khusus buat kita!'",
      choices: [
        { text: "Sweet banget! Start exploring the website", next: "sweet_start" }
      ]
    },
    touched: {
      text: "Gita genuinely touched: 'You learned a whole new skill just for my birthday?' Mas Za nods: 'Seeing you happy is worth any effort. Plus now I have new skills untuk future surprises!'",
      choices: [
        { text: "Feel incredibly loved and start playing", next: "loved_start" }
      ]
    },
    // Multiple ending paths
    ending1: {
      text: "Gita spend the entire afternoon playing through all 17 levels. Each one is more creative dan sweet than the last. When you finally finish, you feel so loved dan appreciated. You immediately call Mas Za back: 'Za, this is the best birthday gift ever! Mas Za nggak akan pernah lupa ini. Thank you for loving me in such a beautiful way.' This birthday will forever be remembered as the day love was expressed through code dan creativity.",
      ending: true
    },
    emotional: {
      text: "Tears of joy mulai keluar. This isn't just a birthday surprise - this is a love letter dalam bentuk interactive website. Every click, every level, every detail shows just how much Mas Za cares dan how well he knows you. This is the most thoughtful gift you've ever received.",
      choices: [
        { text: "Take a moment to appreciate this blessing", next: "ending2" }
      ]
    },
    happy_gaming: {
      text: "Gita continue gaming dengan hati yang full of joy. Setiap level brings new surprises, memories, dan inside jokes yang bikin Gita ketawa dan smile. By the time you reach level 17, you realize this has been the most perfect birthday celebration ever.",
      choices: [
        { text: "Complete all levels dengan happiness", next: "ending3" }
      ]
    },
    touched_continue: {
      text: "Dengan hati yang touched, Gita continue journey through every level. Each surprise makes you fall in love more dengan thoughtfulness Mas Za. This is definitely the most romantic gesture anyone has ever done for you.",
      choices: [
        { text: "Finish dengan gratitude yang mendalam", next: "ending4" }
      ]
    },
    ending2: {
      text: "Sitting there dengan tears of happiness, you realize how blessed you are to have someone who puts this much thought dan effort into making you feel special. You screenshot your favorite moments from the website dan create a photo album titled 'Best Birthday Ever - Made with Love by Mas Za'. This becomes your go-to reminder of how loved you are.",
      ending: true
    },
    ending3: {
      text: "Level 17 ends dengan a digital scrapbook filled with promises dan dreams for your future together. You finish the website feeling like the luckiest girl in the world. You post a long IG caption: 'To anyone wondering what real love looks like - it looks like someone spending weeks creating 17 levels of happiness just to make you smile on your birthday. Thank you @mas_za for the most incredible surprise ever. 17 and loved beyond words 💕'",
      ending: true
    },
    ending4: {
      text: "You complete the entire website dengan heart full of gratitude. This isn't just a birthday gift - it's a testament to love, dedication, dan how much someone can care. You save every screenshot, every memory, knowing this will be a story you tell for years to come about the most creative, thoughtful, loving birthday surprise ever.",
      ending: true
    }
  };

  // Use level content if available, otherwise use default
  const story = (level?.content?.story && typeof level.content.story === 'object') 
    ? level.content.story 
    : defaultStory;

  useEffect(() => {
    // Check if we've reached an ending
    const currentStoryNode = story[currentScene];
    if (currentStoryNode?.ending) {
      setShowRestart(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  }, [currentScene, story, onComplete]);

  const makeChoice = (choice) => {
    if (choice && choice.next && story[choice.next]) {
      setCurrentScene(choice.next);
      setStoryPath(prev => [...prev, choice.next]);
    }
  };

  const restartStory = () => {
    setCurrentScene('start');
    setStoryPath(['start']);
    setShowRestart(false);
  };

  const currentStoryNode = story[currentScene];

  if (!currentStoryNode) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-6xl mb-4">📖</div>
        <h2 className="text-2xl font-dancing text-white mb-4">Loading Story...</h2>
        <p className="text-white/80 mb-4">Preparing your interactive adventure...</p>
        <Button onClick={restartStory} className="mt-4">
          Start Story
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          animate={{ 
            rotateY: [0, 10, -10, 0] 
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="text-6xl mb-4"
        >
          📖
        </motion.div>
        
        <h2 className="text-3xl font-dancing text-white mb-4">
          Create Your Own Adventure
        </h2>
        
        <p className="text-white/80 text-lg">
          Choose your path dalam interactive birthday story kita!
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-white/70 text-sm mb-2">
          <span>Story Progress</span>
          <span>Scene {storyPath.length}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <motion.div 
            className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((storyPath.length / 8) * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Story Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 mb-8"
        >
          {/* Story Text */}
          <div className="mb-8">
            <motion.p 
              className="text-white/90 text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {currentStoryNode.text}
            </motion.p>
          </div>

          {/* Choices */}
          {currentStoryNode.choices && (
            <div className="space-y-4">
              <h3 className="text-white font-medium mb-4">What do you choose, Anggita?</h3>
              {currentStoryNode.choices.map((choice, index) => (
                <motion.button
                  key={index}
                  onClick={() => makeChoice(choice)}
                  className="w-full p-4 text-left bg-white/5 border border-white/20 rounded-2xl text-white/90 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-400/30 rounded-full flex items-center justify-center text-purple-300 font-bold">
                      {index + 1}
                    </div>
                    <span className="flex-1">{choice.text}</span>
                    <ArrowRight className="text-white/50" size={20} />
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Ending Message */}
          {currentStoryNode.ending && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-8 p-6 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-2xl border border-pink-300/30"
            >
              <div className="text-4xl mb-4">💕</div>
              <h3 className="text-xl font-dancing text-white mb-3">
                The End... or is it?
              </h3>
              <p className="text-white/80">
                This is just one of many possible stories we could write together dalam real life. 
                The real adventure adalah journey kita setiap hari, bocah Tambran favorit!
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Story Path */}
      <div className="mb-8">
        <h3 className="text-white font-medium mb-4 text-center">Your Story Path</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {storyPath.map((scene, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="px-3 py-1 bg-white/20 rounded-full text-white/70 text-sm"
            >
              Scene {index + 1}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <Button
          variant="secondary"
          onClick={restartStory}
          icon={<RotateCcw size={16} />}
        >
          Start Over
        </Button>

        {showRestart && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Button
              variant="primary"
              icon={<BookOpen size={16} />}
              disabled
            >
              Story Complete!
            </Button>
          </motion.div>
        )}
      </div>

      {/* Instructions */}
      {currentScene === 'start' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
        >
          <h3 className="text-lg font-dancing text-white mb-3">
            How to Play
          </h3>
          <p className="text-white/80 text-sm">
            Read the story dan choose your path by clicking pada options. 
            Setiap choice leads to different part of our special birthday story!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default InteractiveStoryLevel;
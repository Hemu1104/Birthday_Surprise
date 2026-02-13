// --- SETUP VARIABLES ---
    const bgAudio = document.getElementById('bgAudio');
    const mainSong = document.getElementById('mainSong');
    const manualBtn = document.getElementById('manualPlayBtn');
    let currentSlide = 1;
    let audioStarted = false;

    // Set initial volumes
    bgAudio.volume = 0.5;
    mainSong.volume = 0.7;

    // --- AUTO-START MUSIC WHEN PAGE LOADS ---
    window.addEventListener('load', function() {
      // Try to play automatically
      bgAudio.play()
        .then(() => {
          console.log("✅ Background music started automatically!");
          audioStarted = true;
          manualBtn.style.display = 'none';
        })
        .catch(error => {
          console.log("⚠️ Autoplay prevented by browser. Will start after user clicks Enter.");
          // Don't show manual button yet, wait for enter click
        });
    });

    // --- THE "TAP TO REVEAL" FIX ---
    document.getElementById('enterBtn').addEventListener('click', () => {
      // Hide the overlay
      document.getElementById('intro-overlay').style.opacity = '0';
      setTimeout(() => { 
        document.getElementById('intro-overlay').style.display = 'none'; 
      }, 800);

      // FORCE PLAY MUSIC if not already playing
      if (!audioStarted) {
        attemptAudioStart();
      }
    });

    // Helper function to try playing music
    function attemptAudioStart() {
      const playPromise = bgAudio.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log("✅ Music started after user click!");
          audioStarted = true;
          manualBtn.style.display = 'none';
        }).catch(error => {
          console.log("❌ Still can't play. Showing manual button.");
          manualBtn.style.display = 'block';
        });
      }
    }

    // Manual Backup Function
    window.forcePlayMusic = function() {
      bgAudio.play()
        .then(() => {
          console.log("✅ Music started manually!");
          manualBtn.style.display = 'none';
          audioStarted = true;
        })
        .catch(error => {
          alert("Please check if the audio file 'background.mp3' exists in the same folder.");
        });
    }

    // --- SLIDESHOW NAVIGATION ---
    window.nextSlide = function(slideNumber) {
      const current = document.getElementById(`card${currentSlide}`);
      current.classList.remove('active');
      current.classList.add('exit');
      setTimeout(() => { 
        document.getElementById(`card${slideNumber}`).classList.add('active'); 
      }, 300);
      currentSlide = slideNumber;
    }

    // --- FINAL REVEAL ---
    const playMainBtn = document.getElementById('playMainBtn');
    const vinyl = document.getElementById('vinyl');
    const msg = document.getElementById('msg');

    playMainBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Fade out background music
      fadeAudio(bgAudio);
      
      // Play main song
      mainSong.volume = 1.0;
      mainSong.currentTime = 0; // Start from beginning
      mainSong.play()
        .then(() => {
          console.log("✅ Main song started!");
        })
        .catch(error => {
          console.log("❌ Main song failed to play. Check if song.mp3 exists.");
          msg.innerText = "Please add song.mp3 to the folder";
        });

      vinyl.classList.add('spinning');
      playMainBtn.innerHTML = "<i class='fas fa-pause'></i>";
      playMainBtn.style.animation = "none";
      playMainBtn.style.background = "#ff8fab";
      
      blastHearts();
      
      const msgs = ["Celebrating You...", "Every beat of this song...", "Is a memory of us.", "Happy Birthday Jyothi! ❤️"];
      let i = 0;
      msg.style.opacity = 1; 
      msg.innerText = msgs[0];
      
      setInterval(() => {
        i = (i + 1) % msgs.length;
        msg.style.opacity = 0;
        setTimeout(() => { 
          msg.innerText = msgs[i]; 
          msg.style.opacity = 1; 
        }, 500);
      }, 3000);
    });

    function fadeAudio(audio) {
      let vol = audio.volume;
      const interval = setInterval(() => {
        if(vol > 0.05) { 
          vol -= 0.05; 
          audio.volume = vol; 
        }
        else { 
          audio.pause(); 
          clearInterval(interval); 
        }
      }, 200);
    }

    // Ensure main song loops
    mainSong.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    });

    // --- VISUALS (Hearts) ---
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let hearts = [];
    
    function initCanvas() { 
      canvas.width = window.innerWidth; 
      canvas.height = window.innerHeight; 
      createHearts(); 
    }
    
    function createHearts() { 
      hearts = []; 
      for(let i=0; i<45; i++) {
        hearts.push({
          x: Math.random()*canvas.width, 
          y: Math.random()*canvas.height, 
          size: Math.random()*8+4, 
          speed: Math.random()*1.5+0.5, 
          opacity: Math.random()*0.5+0.2
        });
      }
    }
    
    function drawHeart(x, y, size, opacity) {
      ctx.globalAlpha = opacity; 
      ctx.fillStyle = "#ff8fab"; 
      ctx.beginPath();
      let top = size * 0.3;
      ctx.moveTo(x, y + top);
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + top);
      ctx.bezierCurveTo(x - size / 2, y + (size + top) / 2, x, y + (size + top) / 2, x, y + size);
      ctx.bezierCurveTo(x, y + (size + top) / 2, x + size / 2, y + (size + top) / 2, x + size / 2, y + top);
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + top);
      ctx.fill(); 
      ctx.globalAlpha = 1;
    }
    
    function animateCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hearts.forEach(h => { 
        h.y += h.speed; 
        if(h.y > canvas.height) { 
          h.y = -10; 
          h.x = Math.random() * canvas.width; 
        } 
        drawHeart(h.x, h.y, h.size, h.opacity); 
      });
      requestAnimationFrame(animateCanvas);
    }
    
    window.addEventListener('resize', initCanvas); 
    initCanvas(); 
    animateCanvas();
    
    function blastHearts() { 
      for(let i=0; i<80; i++) { 
        hearts.push({
          x: Math.random()*canvas.width, 
          y: canvas.height+10, 
          size: Math.random()*12+4, 
          speed: -(Math.random()*6+3), 
          opacity: 1
        }); 
      } 
    }

    // Console message to help with setup
    console.log("📁 Place these files in the same folder as this HTML:");
    console.log("   - background.mp3 (background music)");
    console.log("   - song.mp3 (main birthday song)");
    console.log("   - image_971816.jpg, image_972339.jpg, video.mp4");
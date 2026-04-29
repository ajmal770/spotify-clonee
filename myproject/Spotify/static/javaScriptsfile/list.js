document.addEventListener("DOMContentLoaded", function () {

  /* ============================================================
     ELEMENTS
  ============================================================ */
  var modal       = document.getElementById("playlist-modal");
  var modalBody   = document.getElementById("modal-body");
  var modalEmpty  = document.getElementById("modal-empty");
  var modalCount  = document.getElementById("modal-count");
  var openBtn     = document.getElementById("open-playlist-btn");
  var closeBtn    = document.getElementById("modal-close-btn");
  var countBadge  = document.getElementById("liked-count-badge");

  var allAudios   = document.querySelectorAll("audio");
  var allCards    = document.querySelectorAll(".audio-card");
  var allHeart    = document.querySelectorAll(".side-btn");
  var allPlayBtns = document.querySelectorAll(".card-play-btn");

  /* ============================================================
     SEE ALL / SHOW LESS TOGGLE
  ============================================================ */
  document.querySelectorAll(".section-see-all").forEach(function(btn) {
    btn.onclick = function() {
      var section = this.closest(".home-section");
      if (!section) return;
      var isExpanded = section.classList.toggle("expanded");
      this.textContent = isExpanded ? "Show less" : "See all";
    };
  });

  /* ============================================================
     LIKED SONGS  –  stored in localStorage
  ============================================================ */
  var liked = [];
  try {
    liked = JSON.parse(localStorage.getItem("sp_liked")) || [];
  } catch (e) {
    liked = [];
  }

  function save() {
    localStorage.setItem("sp_liked", JSON.stringify(liked));
  }

  /* ---------- update count badges – HIDE when 0 ---------- */
  function updateBadges() {
    var n = liked.length;

    /* sidebar button badge */
    if (countBadge) {
      if (n === 0) {
        countBadge.style.display = "none";
      } else {
        countBadge.style.display = "inline-block";
        countBadge.textContent = n;
      }
    }

    /* modal header badge */
    if (modalCount) {
      if (n === 0) {
        modalCount.style.display = "none";
      } else {
        modalCount.style.display = "inline-block";
        modalCount.textContent = n;
      }
    }
  }

  /* ---------- render the modal list ---------- */
  function renderModal() {
    var old = modalBody.querySelectorAll(".playlist-item");
    old.forEach(function (el) { el.remove(); });

    if (liked.length === 0) {
      modalEmpty.style.display = "block";
    } else {
      modalEmpty.style.display = "none";

      liked.forEach(function (song, i) {
        var row = document.createElement("div");
        row.className = "playlist-item";

        var img = document.createElement("img");
        img.src = song.img;
        img.alt = song.title;

        var info = document.createElement("div");
        info.className = "pitem-info";
        info.innerHTML =
          '<div class="pitem-title">' + song.title + '</div>' +
          '<div class="pitem-section">' + song.section + '</div>';

        var removeBtn = document.createElement("button");
        removeBtn.className = "pitem-remove";
        removeBtn.title = "Remove";
        removeBtn.textContent = "✕";

        removeBtn.addEventListener("click", function () {
          liked.splice(i, 1);
          save();
          updateBadges();
          refreshAllHearts();
          renderModal();
        });

        row.appendChild(img);
        row.appendChild(info);
        row.appendChild(removeBtn);
        modalBody.appendChild(row);
      });
    }

    updateBadges();
  }

  /* ---------- sync heart button visuals ---------- */
  function refreshAllHearts() {
    allHeart.forEach(function (btn) {
      var card = btn.closest(".audio-card");
      if (!card) return;
      var title = card.dataset.title || "";
      var isLiked = liked.some(function (s) { return s.title === title; });
      if (isLiked) {
        btn.style.color = "#1db954";
        btn.dataset.liked = "1";
      } else {
        btn.style.color = "";
        btn.dataset.liked = "0";
      }
    });
  }

  /* ============================================================
     HEART BUTTON – click handler
  ============================================================ */
  allHeart.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();

      var card = btn.closest(".audio-card");
      if (!card) return;

      var title   = (card.dataset.title   || "Unknown").trim();
      var section = (card.dataset.section || "Songs").trim();
      var imgEl   = card.querySelector("img");
      var img     = imgEl ? imgEl.src : "";

      var idx = liked.findIndex(function (s) { return s.title === title; });

      if (idx === -1) {
        /* ADD to playlist */
        liked.push({ title: title, section: section, img: img });
        btn.style.color = "#1db954";
        btn.dataset.liked = "1";

        /* remove dim from this card now that it's liked */
        card.classList.remove("dimmed");

        /* badge pop */
        if (countBadge) {
          countBadge.style.transform = "scale(1.5)";
          setTimeout(function () {
            countBadge.style.transform = "scale(1)";
          }, 300);
        }
      } else {
        /* REMOVE from playlist */
        liked.splice(idx, 1);
        btn.style.color = "";
        btn.dataset.liked = "0";
      }

      save();
      updateBadges();

      if (modal.classList.contains("open")) {
        renderModal();
      }
    });
  });

  /* ============================================================
     MODAL – open / close
  ============================================================ */
  if (openBtn) {
    openBtn.addEventListener("click", function () {
      renderModal();
      modal.classList.add("open");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      modal.classList.remove("open");
    });
  }

  modal.addEventListener("click", function (e) {
    if (e.target === modal) modal.classList.remove("open");
  });

  /* ============================================================
     AUDIO – Custom Play Button & Card states
     Liked cards are NEVER dimmed
  ============================================================ */
  /* 1. Sync button icon with audio state */
  function syncPlayIcon(card, isPlaying) {
    if (!card) return;
    var icon = card.querySelector(".card-play-btn i");
    if (icon) {
      if (isPlaying) {
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
      } else {
        icon.classList.remove("fa-pause");
        icon.classList.add("fa-play");
      }
    }
  }

  /* 2. Handle Custom Play Button Click */
  allPlayBtns.forEach(function(btn) {
    btn.addEventListener("click", function(e) {
      e.stopPropagation();
      var card = btn.closest(".audio-card");
      if (!card) return;
      var audio = card.querySelector("audio");
      if (!audio) return;

      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    });
  });

  /* 3. Handle Audio Events */
  allAudios.forEach(function (audio) {
    audio.addEventListener("play", function () {
      /* pause all other audios */
      allAudios.forEach(function (a) {
        if (a !== audio && !a.paused) {
          a.pause();
          a.currentTime = 0;
        }
      });

      var active = audio.closest(".audio-card");
      if (active) syncPlayIcon(active, true);

      /* dim non-liked, non-active cards */
      allCards.forEach(function (c) {
        c.classList.remove("playing");
        /* never dim a liked card */
        var heartBtn = c.querySelector(".side-btn");
        var isLiked  = heartBtn && heartBtn.dataset.liked === "1";
        if (!isLiked) {
          c.classList.add("dimmed");
        }
      });

      /* highlight active card */
      if (active) {
        active.classList.remove("dimmed");
        active.classList.add("playing");
      }
    });

    audio.addEventListener("pause", function() {
      var active = audio.closest(".audio-card");
      if (active) syncPlayIcon(active, false);
      resetCards();
    });

    audio.addEventListener("ended", function() {
      var active = audio.closest(".audio-card");
      if (active) syncPlayIcon(active, false);
      resetCards();
      
      /* Auto-play next song when current ends (respect repeat) */
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNextTrack();
      }
    });
  });


  /* User Dropdown */
  if (userPillBtn && userDropdown) {
    userPillBtn.addEventListener("click", function(e) {
      userPillBtn.classList.toggle("active");
      userDropdown.classList.toggle("show");
      e.stopPropagation();
    });
    document.addEventListener("click", function(e) {
      if (!userPillBtn.contains(e.target)) {
        userDropdown.classList.remove("show");
        userPillBtn.classList.remove("active");
      }
    });
  }



  function resetCards() {
    // Only reset dimming if NO audio is currently playing globally
    var isAnyPlaying = Array.from(allAudios).some(function(a) { return !a.paused; });
    if (!isAnyPlaying) {
      allCards.forEach(function (c) {
        c.classList.remove("playing", "dimmed");
      });
    }
  }

  /* ============================================================
     FILTER PILLS – active state toggle
  ============================================================ */
  document.querySelectorAll(".lib-pill").forEach(function (pill) {
    pill.addEventListener("click", function () {
      document.querySelectorAll(".lib-pill").forEach(function (p) {
        p.classList.remove("active");
      });
      pill.classList.add("active");
    });
  });

  /* ============================================================
     GLOBAL PLAYBAR LOGIC
  ============================================================ */
  var pbImg = document.getElementById("pb-img");
  var pbTitle = document.getElementById("pb-title");
  var pbArtist = document.getElementById("pb-artist");
  var pbShuffleBtn = document.getElementById("pb-shuffle-btn");
  var pbPlayBtn = document.getElementById("pb-play-btn");
  var pbNextBtn = document.getElementById("pb-next-btn");
  var pbPrevBtn = document.getElementById("pb-prev-btn");
  var pbRepeatBtn = document.getElementById("pb-repeat-btn");
  var pbProgress = document.getElementById("pb-progress");
  var pbTimeCurrent = document.getElementById("pb-time-current");
  var pbTimeTotal = document.getElementById("pb-time-total");
  var currentActiveAudio = null;
  var pbVolume = document.getElementById("pb-volume");
  var userPillBtn = document.getElementById("user-pill-btn");
  var userDropdown = document.getElementById("user-dropdown");

  
  /* Fullscreen Now Playing Overlay elements */
  var npView = document.getElementById("now-playing-view");
  var npBg = document.getElementById("np-bg");
  var npCover = document.getElementById("np-cover");
  var npTitle = document.getElementById("np-title");
  var npArtist = document.getElementById("np-artist");
  var npCloseBtn = document.getElementById("np-close-btn");
  
  var isShuffle = false;
  var isRepeat = false;

  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    if (s < 10) s = "0" + s;
    return m + ":" + s;
  }

  /* Sync global play/pause button icon */
  function syncGlobalPlayIcon(isPlaying) {
    if (!pbPlayBtn) return;
    var icon = pbPlayBtn.querySelector("i");
    if (icon) {
      if (isPlaying) {
        icon.classList.remove("fa-play");
        icon.classList.add("fa-pause");
      } else {
        icon.classList.remove("fa-pause");
        icon.classList.add("fa-play");
      }
    }
  }

  /* Global play button click */
  if (pbPlayBtn) {
    pbPlayBtn.addEventListener("click", function() {
      if (currentActiveAudio) {
        if (currentActiveAudio.paused) {
          currentActiveAudio.play();
        } else {
          currentActiveAudio.pause();
        }
      }
    });
  }

  /* Shuffle and Repeat toggles */
  if (pbShuffleBtn) {
    pbShuffleBtn.addEventListener("click", function() {
      isShuffle = !isShuffle;
      pbShuffleBtn.classList.toggle("active", isShuffle);
    });
  }
  
  if (pbRepeatBtn) {
    pbRepeatBtn.addEventListener("click", function() {
      isRepeat = !isRepeat;
      pbRepeatBtn.classList.toggle("active", isRepeat);
    });
  }

  /* Fullscreen Overlay click logic */
  if (pbImg) {
    pbImg.addEventListener("click", function() {
      if (npView && pbImg.src) {
        npView.style.display = "flex";
        setTimeout(function() { npView.classList.add("open"); }, 10);
      }
    });
  }
  if (npCloseBtn) {
    npCloseBtn.addEventListener("click", function() {
      if (npView) {
        npView.classList.remove("open");
        setTimeout(function() { npView.style.display = "none"; }, 400);
      }
    });
  }

  /* Core logic for Next and Previous jumping */
  function playNextTrack() {
    if (!currentActiveAudio) return;
    var currentCard = currentActiveAudio.closest(".audio-card");
    if (!currentCard) return;
    
    var nextCard = null;
    
    if (isShuffle) {
      /* Pick a random card from the same row */
      var row = currentCard.parentElement;
      var allRowCards = Array.from(row.querySelectorAll(".audio-card"));
      if (allRowCards.length > 1) {
        var otherCards = allRowCards.filter(function(c) { return c !== currentCard; });
        var randIdx = Math.floor(Math.random() * otherCards.length);
        nextCard = otherCards[randIdx];
      }
    } else {
      nextCard = currentCard.nextElementSibling;
      while(nextCard && !nextCard.classList.contains("audio-card")) {
         nextCard = nextCard.nextElementSibling;
      }
    }
    
    if (nextCard) {
       var nextAudio = nextCard.querySelector("audio");
       if (nextAudio) {
           if (currentActiveAudio) currentActiveAudio.pause();
           nextAudio.play();
       }
    }
  }

  function playPrevTrack() {
    if (!currentActiveAudio) return;
    var currentCard = currentActiveAudio.closest(".audio-card");
    if (!currentCard) return;
    var prevCard = currentCard.previousElementSibling;
    while(prevCard && !prevCard.classList.contains("audio-card")) {
       prevCard = prevCard.previousElementSibling;
    }
    if (prevCard) {
       var prevAudio = prevCard.querySelector("audio");
       if (prevAudio) {
           if (currentActiveAudio) currentActiveAudio.pause();
           prevAudio.play();
       }
    }
  }

  /* Global Next/Prev button listeners */
  if (pbNextBtn) pbNextBtn.addEventListener("click", playNextTrack);
  if (pbPrevBtn) pbPrevBtn.addEventListener("click", playPrevTrack);

  /* Scrubber input change */
  if (pbProgress) {
    pbProgress.addEventListener("input", function() {
      if (currentActiveAudio && currentActiveAudio.duration) {
        var pct = parseFloat(pbProgress.value);
        var seekTime = (pct / 100) * currentActiveAudio.duration;
        currentActiveAudio.currentTime = seekTime;
        pbTimeCurrent.textContent = formatTime(seekTime);
        var colorStr = "linear-gradient(to right, #1db954 " + pct + "%, #4d4d4d " + pct + "%)";
        pbProgress.style.background = colorStr;
      }
    });
  }

  /* Attach listeners to ALL audio tags to update global bar when playing */
  allAudios.forEach(function(a) {
    a.addEventListener("play", function() {
      currentActiveAudio = a;
      if (currentActiveAudio === a) syncGlobalPlayIcon(true);
      var mBars = document.getElementById("music-bars-anim");
      if (mBars) mBars.style.display = "inline-flex";
      
      var pbGlobal = document.getElementById("global-playbar");
      if (pbGlobal) {
        pbGlobal.classList.add("visible");
        document.body.classList.add("has-playbar");
      }
      
      var card = a.closest(".audio-card");
      if (card) {
        var title = card.dataset.title || "Unknown Track";
        var section = card.dataset.section || "";
        var imgEl = card.querySelector(".cover");

        pbTitle.textContent = title;
        pbTitle.style.display = "block";
        pbArtist.textContent = section;
        pbArtist.style.display = "block";
        
        if (imgEl && pbImg) {
          pbImg.src = imgEl.src;
          pbImg.style.display = "block";
          if (npCover) npCover.src = imgEl.src;
          if (npBg) npBg.style.backgroundImage = "url('" + imgEl.src + "')";
        }
        
        if (npTitle) npTitle.textContent = title;
        if (npArtist) npArtist.textContent = section;
      }
    });

    a.addEventListener("pause", function() {
      if (currentActiveAudio === a) {
        syncGlobalPlayIcon(false);
        var mBars = document.getElementById("music-bars-anim");
        if (mBars) mBars.style.display = "none";
      }
    });

    a.addEventListener("timeupdate", function() {
      if (currentActiveAudio === a) {
        pbTimeCurrent.textContent = formatTime(a.currentTime);
        if (a.duration) {
          pbTimeTotal.textContent = formatTime(a.duration);
          var pct = (a.currentTime / a.duration) * 100;
          if (pbProgress) {
            pbProgress.value = pct;
            /* dynamic green fill */
            var colorStr = "linear-gradient(to right, #fff " + pct + "%, #4d4d4d " + pct + "%)";
            pbProgress.style.background = colorStr;
          }
        }
      }
    });

    a.addEventListener("loadedmetadata", function() {
      if (currentActiveAudio === a) {
         pbTimeTotal.textContent = formatTime(a.duration);
      }
    });
  });

  /* ============================================================
     INIT
  ============================================================ */
  updateBadges();
  refreshAllHearts();

  /* ============================================================
     LIVE TRENDING UPDATES – Simulation
  ============================================================ */
  function updateLiveTrending() {
    var bars = document.querySelectorAll(".live-bar-fill");
    bars.forEach(function(bar) {
      // Randomly adjust width by +/- 5%
      var currentWidth = parseFloat(bar.style.width) || 80;
      var change = (Math.random() * 10) - 5;
      var newWidth = Math.max(30, Math.min(98, currentWidth + change));
      bar.style.width = newWidth + "%";
    });
  }
  setInterval(updateLiveTrending, 3000);

  /* ============================================================
     STORY VIEWER LOGIC
  ============================================================ */
  var storyModal = document.getElementById("story-viewer");
  var storyImg = document.getElementById("story-img");
  var storyArtistThumb = document.getElementById("story-artist-thumb");
  var storyArtistName = document.getElementById("story-artist-name");
  var storyClose = document.querySelector(".story-close-btn");
  var storyProgressFill = document.querySelector(".story-progress-fill");
  var storyTimer;

  document.querySelectorAll(".story-card").forEach(function(card) {
    card.addEventListener("click", function() {
      var img = this.querySelector("img").src;
      var name = this.querySelector(".story-artist").textContent;
      
      storyArtistThumb.src = img;
      storyArtistName.textContent = name;
      storyImg.src = img; // Use artist img as story content
      storyModal.style.display = "flex";
      
      storyProgressFill.style.transition = "none";
      storyProgressFill.style.width = "0%";
      clearTimeout(storyTimer);
      
      setTimeout(function() {
        storyProgressFill.style.transition = "width 5s linear";
        storyProgressFill.style.width = "100%";
      }, 50);

      storyTimer = setTimeout(function() {
        storyModal.style.display = "none";
      }, 5050);
    });
  });

  if (storyClose) {
    storyClose.addEventListener("click", function() {
      storyModal.style.display = "none";
      clearTimeout(storyTimer);
    });
  }

  /* ============================================================
     SEARCH FILTER LOGIC
  ============================================================ */
  var searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", function() {
      var query = this.value.toLowerCase();
      var allContent = document.querySelectorAll(".audio-card, .poster_card, .bio-card, .live-song-item");
      
      allContent.forEach(function(item) {
        var text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.classList.remove("search-hidden");
        } else {
          item.classList.add("search-hidden");
        }
      });
    });
  }
});

  /* ============================================================
     ACCOUNT MODAL LOGIC
  ============================================================ */
  var accountBtn = document.getElementById("account-btn");
  var accountModal = document.getElementById("account-modal");
  var accountClose = document.getElementById("account-close-btn");

  if (accountBtn && accountModal) {
    accountBtn.addEventListener("click", function(e) {
      e.preventDefault();
      accountModal.style.display = "flex";
      if (userDropdown) {
        userDropdown.classList.remove("show");
        userPillBtn.classList.remove("active");
      }
    });
  }

  if (accountClose) {
    accountClose.addEventListener("click", function() {
      accountModal.style.display = "none";
    });
  }

  if (accountModal) {
    accountModal.addEventListener("click", function(e) {
      if (e.target === accountModal) {
        accountModal.style.display = "none";
      }
    });
  }

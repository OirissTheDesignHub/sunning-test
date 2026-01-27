const slides = document.querySelectorAll('.slide');
    let current = 0;

    function showSlide(index) {
      // Remove 'active' from all slides
      slides.forEach(slide => slide.classList.remove('active'));

      // Add 'active' to the current slide
      slides[index].classList.add('active');

      // Remove 'prev' from all slides, then add to the one before current
      slides.forEach(slide => slide.classList.remove('prev'));
      const prevIndex = (index - 1 + slides.length) % slides.length;
      slides[prevIndex].classList.add('prev');
    }

    function nextSlide() {
      current = (current + 1) % slides.length;
      showSlide(current);
    }

    setInterval(nextSlide, 5000); // Auto slide every 5 seconds

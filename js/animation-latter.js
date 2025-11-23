// Daftar peran yang ingin ditampilkan
    const roles = [
      "DATA ANALYST",
      "DATA ENGINEER",
      "BACKEND DEVELOPER",
      "UI/UX DESIGNER",
      "GRAPHIC DESIGNER",
    ];

    const rotator = document.getElementById('rotator');
    let currentIndex = 0;

    // Fungsi untuk membuat elemen teks
    function createTextElement(text) {
      const span = document.createElement('span');
      span.className = 'rotating-text';
      span.textContent = text;
      return span;
    }

    // Tambahkan elemen pertama
    const firstText = createTextElement(roles[0]);
    firstText.classList.add('active');
    rotator.appendChild(firstText);

    // Ganti teks setiap 2.5 detik
    setInterval(() => {
      const currentElement = rotator.querySelector('.active');
      currentElement.classList.remove('active');

      setTimeout(() => {
        currentElement.remove();

        currentIndex = (currentIndex + 1) % roles.length;
        const newText = createTextElement(roles[currentIndex]);
        rotator.appendChild(newText);

        // Trigger reflow agar transisi opacity berjalan
        void newText.offsetWidth;
        newText.classList.add('active');
      }, 500); // Sesuaikan dengan durasi transisi CSS
    }, 1000);
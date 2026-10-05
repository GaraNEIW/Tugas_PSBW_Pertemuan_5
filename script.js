
// Tugas Individu 2 - JavaScript Dasar
// Studi Kasus: Rekap Nilai Akhir Mahasiswa


// 1. ARRAY OF OBJECT (minimal 5 data)
// Data diambil dari tabel Output pada index.html
const mahasiswa = [
  { nim: "001", nama: "Gara",  tugas: 90, quiz: 85, uts: 75, uas: 80 },
  { nim: "002", nama: "Farel", tugas: 85, quiz: 75, uts: 60, uas: 70 },
  { nim: "003", nama: "Yudha", tugas: 90, quiz: 70, uts: 80, uas: 85 },
  { nim: "004", nama: "David", tugas: 90, quiz: 80, uts: 75, uas: 70 },
  { nim: "005", nama: "Indira", tugas: 80, quiz: 85, uts: 90, uas: 80 },
];

// 2. FUNCTION 1: menghitung nilai akhir
// Rumus: Nilai akhir = (0.2*Tugas)+(0.2*Quiz)+(0.3*UTS)+(0.3*UAS)
function hitungNilaiAkhir(tugas, quiz, uts, uas) {
  const nilaiAkhir = 0.2 * tugas + 0.2 * quiz + 0.3 * uts + 0.3 * uas;
  return nilaiAkhir;
}

// 3. FUNCTION 2: menentukan grade berdasarkan nilai akhir
// Ketentuan (sesuai keterangan di index.html):
// A > 85, B > 70, C > 60, D > 40, E > 30, F > 0
function tentukanGrade(nilaiAkhir) {
  if (nilaiAkhir > 85) {
    return "A";
  } else if (nilaiAkhir > 70) {
    return "B";
  } else if (nilaiAkhir > 60) {
    return "C";
  } else if (nilaiAkhir > 40) {
    return "D";
  } else if (nilaiAkhir > 30) {
    return "E";
  } else {
    return "F";
  }
}

// 4. FUNCTION 3 (tambahan): mencari mahasiswa dengan nilai tertinggi
function cariMahasiswaTerbaik(daftarHasil) {
  let terbaik = daftarHasil[0];
  for (const m of daftarHasil) {
    if (m.nilaiAkhir > terbaik.nilaiAkhir) {
      terbaik = m;
    }
  }
  return terbaik;
}

// PROSES DATA
// Menggunakan perulangan for...of, operator perbandingan (>, >=)
// dan operator logika (&&) untuk mengolah setiap data mahasiswa

const hasilRekap = []; // menampung hasil olahan (array of object baru)
let totalNilai = 0;

console.log("=== REKAP NILAI AKHIR MAHASISWA ===");

for (const m of mahasiswa) {
  const nilaiAkhir = hitungNilaiAkhir(m.tugas, m.quiz, m.uts, m.uas);
  const grade = tentukanGrade(nilaiAkhir);

  // operator logika: cek status lulus (nilai akhir >= 60 DAN grade bukan F)
  const lulus = nilaiAkhir >= 60 && grade !== "F";

  hasilRekap.push({
    nim: m.nim,
    nama: m.nama,
    nilaiAkhir: parseFloat(nilaiAkhir.toFixed(2)),
    grade: grade,
    lulus: lulus,
  });

  totalNilai += nilaiAkhir;

  console.log(
    `${m.nim} - ${m.nama}: Nilai Akhir = ${nilaiAkhir.toFixed(2)}, Grade = ${grade}, Status = ${lulus ? "Lulus" : "Tidak Lulus"}`
  );
}

// Rata-rata nilai akhir seluruh mahasiswa
const rataRata = totalNilai / mahasiswa.length;
console.log(`\nRata-rata Nilai Akhir Kelas: ${rataRata.toFixed(2)}`);

// Menggunakan filter() untuk mencari mahasiswa yang lulus
const yangLulus = hasilRekap.filter((m) => m.lulus);
console.log(`\nJumlah Mahasiswa Lulus: ${yangLulus.length} dari ${mahasiswa.length}`);
console.log(
  "Nama yang Lulus:",
  yangLulus.map((m) => m.nama).join(", ")
);

// Mahasiswa dengan nilai tertinggi
const terbaik = cariMahasiswaTerbaik(hasilRekap);
console.log(
  `\nMahasiswa dengan Nilai Tertinggi: ${terbaik.nama} (${terbaik.nilaiAkhir}, Grade ${terbaik.grade})`
);

console.log("\n=== SELESAI ===");

// BAGIAN 2 - DOM & EVENTS
// Menampilkan data mahasiswa ke tabel, plus interaksi pengguna

// ---------- 1. Ambil elemen yang dibutuhkan (querySelector) ----------
const tbody = document.querySelector("#tbodyNilai");
const inputCari = document.querySelector("#cari");
const filterGrade = document.querySelector("#filterGrade");
const ringkasan = document.querySelector("#ringkasan");
const formNilai = document.querySelector("#formNilai");
const pesan = document.querySelector("#pesan");

// id input angka pada form (dipakai saat validasi)
const inputAngka = ["tugas", "quiz", "uts", "uas"];

// ---------- 2. Fungsi bantu ----------
// Hitung nilai akhir & grade dari satu objek mahasiswa (memakai fungsi Bagian 1)
function nilaiAkhirDari(m) {
  return hitungNilaiAkhir(m.tugas, m.quiz, m.uts, m.uas);
}

function gradeDari(m) {
  return tentukanGrade(nilaiAkhirDari(m));
}

// ---------- 3. Membuat satu baris tabel dengan createElement ----------
function buatBaris(m) {
  const nilaiAkhir = nilaiAkhirDari(m);
  const grade = tentukanGrade(nilaiAkhir);
  const lulus = nilaiAkhir >= 60 && grade !== "F";

  const tr = document.createElement("tr");
  tr.dataset.nim = m.nim; // disimpan di data-nim, dipakai saat tombol Hapus diklik

  if (!lulus) {
    tr.classList.add("tidak-lulus"); // tampilan diatur CSS, bukan style inline
  }

  const kolom = [m.nim, m.nama, m.tugas, m.quiz, m.uts, m.uas, nilaiAkhir.toFixed(2), grade];

  kolom.forEach((isi) => {
    const td = document.createElement("td");
    td.textContent = isi; // textContent (bukan innerHTML) karena nama dari input pengguna
    tr.append(td);
  });

  const tdAksi = document.createElement("td");
  const tombolHapus = document.createElement("button");
  tombolHapus.type = "button";
  tombolHapus.textContent = "Hapus";
  tombolHapus.classList.add("btn-hapus");
  tdAksi.append(tombolHapus);
  tr.append(tdAksi);

  return tr;
}

// ---------- 4. Menampilkan tabel (pencarian + filter grade) ----------
function tampilkanTabel() {
  const kata = inputCari.value.trim().toLowerCase();
  const gradeDipilih = filterGrade.value;

  const tampil = mahasiswa.filter((m) => {
    const cocokKata =
      m.nama.toLowerCase().includes(kata) || m.nim.includes(kata);
    const cocokGrade = gradeDipilih === "semua" || gradeDari(m) === gradeDipilih;
    return cocokKata && cocokGrade;
  });

  tbody.replaceChildren(); // kosongkan tabel sebelum digambar ulang

  if (tampil.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 9;
    td.textContent = "Data tidak ditemukan";
    td.classList.add("kosong");
    tr.append(td);
    tbody.append(tr);
  } else {
    tampil.forEach((m) => tbody.append(buatBaris(m)));
  }

  if (tampil.length > 0) {
    const total = tampil.reduce((jumlah, m) => jumlah + nilaiAkhirDari(m), 0);
    ringkasan.textContent =
      `Menampilkan ${tampil.length} dari ${mahasiswa.length} mahasiswa | ` +
      `Rata-rata nilai akhir: ${(total / tampil.length).toFixed(2)}`;
  } else {
    ringkasan.textContent = `Menampilkan 0 dari ${mahasiswa.length} mahasiswa`;
  }
}

// ---------- 5. Validasi form ----------
// Mengembalikan array pesan error. Kosong = semua input valid.
function validasiForm() {
  const errors = [];

  formNilai.querySelectorAll("input").forEach((el) => {
    el.classList.remove("input-error");
  });

  const nimEl = document.querySelector("#nim");
  const namaEl = document.querySelector("#nama");
  const nim = nimEl.value.trim();
  const nama = namaEl.value.trim();

  if (nim === "") {
    errors.push("NIM wajib diisi");
    nimEl.classList.add("input-error");
  } else if (!/^\d+$/.test(nim)) {
    errors.push("NIM hanya boleh berisi angka");
    nimEl.classList.add("input-error");
  } else if (mahasiswa.some((m) => m.nim === nim)) {
    errors.push("NIM sudah terdaftar");
    nimEl.classList.add("input-error");
  }

  if (nama.length < 3) {
    errors.push("Nama minimal 3 karakter");
    namaEl.classList.add("input-error");
  }

  inputAngka.forEach((id) => {
    const el = document.querySelector("#" + id);
    const teks = el.value.trim();
    const angka = Number(teks);

    if (teks === "" || Number.isNaN(angka) || angka < 0 || angka > 100) {
      errors.push(`${id.toUpperCase()} harus berupa angka 0-100`);
      el.classList.add("input-error");
    }
  });

  return errors;
}

// ---------- 6. EVENT: submit form (tombol Proses) ----------
formNilai.addEventListener("submit", (e) => {
  e.preventDefault(); // cegah halaman reload

  const errors = validasiForm();

  if (errors.length > 0) {
    pesan.textContent = errors[0];
    pesan.className = "pesan text-danger";
    return;
  }

  const mhsBaru = {
    nim: document.querySelector("#nim").value.trim(),
    nama: document.querySelector("#nama").value.trim(),
    tugas: Number(document.querySelector("#tugas").value),
    quiz: Number(document.querySelector("#quiz").value),
    uts: Number(document.querySelector("#uts").value),
    uas: Number(document.querySelector("#uas").value),
  };
  mahasiswa.push(mhsBaru);

  const nilaiAkhir = nilaiAkhirDari(mhsBaru);
  const grade = tentukanGrade(nilaiAkhir);

  // kosongkan form, lalu tampilkan hasil hitung di field readonly
  formNilai.reset();
  document.querySelector("#nilai_akhir").value = nilaiAkhir.toFixed(2);
  document.querySelector("#grade").value = grade;

  pesan.textContent = `Data ${mhsBaru.nama} berhasil ditambahkan`;
  pesan.className = "pesan text-success";

  // reset filter supaya baris baru pasti terlihat
  inputCari.value = "";
  filterGrade.value = "semua";
  tampilkanTabel();
});

// ---------- 7. EVENT: pencarian & filter grade ----------
inputCari.addEventListener("input", tampilkanTabel);
filterGrade.addEventListener("change", tampilkanTabel);

// ---------- 8. EVENT DELEGATION: tombol Hapus ----------
tbody.addEventListener("click", (e) => {
  if (e.target.matches(".btn-hapus")) {
    const nim = e.target.closest("tr").dataset.nim;
    const index = mahasiswa.findIndex((m) => m.nim === nim);

    if (index !== -1) {
      mahasiswa.splice(index, 1);
    }
    tampilkanTabel();
  }
});

// ---------- 9. Tampilkan data awal saat halaman dibuka ----------
tampilkanTabel();
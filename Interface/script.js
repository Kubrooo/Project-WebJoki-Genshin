/**
 * @fileoverview Skrip untuk mengelola data daftar Jokian, termasuk menambah, mengedit, menghapus, mencari, dan menyortir data.
 */

/**
 * @type {HTMLInputElement} Input untuk memasukkan nama.
 */
const inputNama = document.getElementById("inputNama");

/**
 * @type {HTMLInputElement} Input untuk memasukkan nickname.
 */
const inputNickname = document.getElementById("inputNickname");

/**
 * @type {HTMLInputElement} Input untuk memasukkan adventure rank.
 */
const inputAdventureRank = document.getElementById("inputAdventureRank");

/**
 * @type {HTMLInputElement} Input untuk memasukkan tanggal mulai.
 */
const inputDimulaiPada = document.getElementById("inputDimulaiPada");

/**
 * @type {HTMLInputElement} Input untuk memasukkan layanan.
 */
const inputServices = document.getElementById("services");

/**
 * @type {HTMLButtonElement} Tombol untuk mengirimkan formulir.
 */
const btnSubmit = document.getElementById("Submit");

/**
 * @type {HTMLButtonElement} Tombol untuk membatalkan input formulir.
 */
const btnCancel = document.getElementById("Cancel");

/**
 * @type {HTMLInputElement} Input untuk mencari dalam daftar.
 */
const searchBar = document.getElementById("searchBar");

/**
 * @type {HTMLDivElement} Elemen div untuk menampilkan daftar Jokian.
 */
const tableList = document.getElementById("table_wrapper");

/**
 * @type {HTMLButtonElement} Tombol untuk menyortir daftar dalam urutan naik.
 */
const btnAsc = document.getElementById("btnAsc");

/**
 * @type {HTMLButtonElement} Tombol untuk menyortir daftar dalam urutan turun.
 */
const btnDesc = document.getElementById("btnDesc");

/**
 * @type {Array<Object>} Array untuk menyimpan daftar Jokian dari local storage.
 */
let listJokian = JSON.parse(localStorage.getItem('listJokian')) || [];

/**
 * @type {number} Variabel untuk menyimpan ID item yang sedang diedit. -1 menunjukkan tidak ada item yang sedang diedit.
 */
let editId = -1;

/**
 * @type {number} Variabel untuk menghasilkan ID baru untuk item Jokian baru.
 */
let idJokian = listJokian.length > 0 ? Math.max(...listJokian.map(akun => akun.id)) + 1 : 1;

/**
 * Fungsi untuk menyimpan daftar Jokian saat ini ke local storage.
 */
const simpanKeLocalStorage = () => {
    localStorage.setItem('listJokian', JSON.stringify(listJokian));
}

/**
 * Fungsi untuk menampilkan daftar Jokian.
 * @param {Array<Object>} [filteredJokian=listJokian] - Array opsional untuk menampilkan daftar yang sudah difilter.
 */
const tampilkanListJokian = (filteredJokian = listJokian) => {
    tableList.innerHTML = "";
    filteredJokian.forEach(akun => {
        tableList.innerHTML += `
        <table class="tbody">
            <tbody>
                <tr>
                    <td>${akun.nama}</td>
                    <td>${akun.nickname}</td>
                    <td>${akun.adventureRank}</td>
                    <td>${akun.dimulaiPada}</td>
                    <td>${akun.services}</td>
                    <td>
                        <i class="fa-solid fa-pen-to-square" onClick="editItem(${akun.id})"></i>
                        <i class="fa-solid fa-trash" onclick="hapusAkun(${akun.id})"></i>
                    </td>
                </tr>
            </tbody>
        </table>`;
    });
}

/**
 * Fungsi untuk mengosongkan semua input.
 */
const clearInputs = () => {
    inputNama.value = "";
    inputNickname.value = "";
    inputAdventureRank.value = "";
    inputDimulaiPada.value = "";
    inputServices.value = "";
}

/**
 * Event listener untuk tombol submit. Menambahkan atau memperbarui item Jokian.
 */
btnSubmit.addEventListener("click", (event) => {
    event.preventDefault();
    if (inputNama.value.trim() === "" || inputNickname.value.trim() === "" || inputAdventureRank.value.trim() === "" || inputDimulaiPada.value === "" ||
        inputServices.value.trim() === "") {
        alert("Mohon mengisi semua input yang tersedia");
        return;
    }

    const jokianBaru = {
        id: editId === -1 ? idJokian++ : editId,
        nama: inputNama.value,
        nickname: inputNickname.value,
        adventureRank: inputAdventureRank.value,
        dimulaiPada: inputDimulaiPada.value,
        services: inputServices.value
    }

    if (editId == -1) {
        listJokian.unshift(jokianBaru);
    } else {
        const index = listJokian.findIndex(akun => akun.id === editId);
        if (index !== -1) {
            listJokian[index] = jokianBaru;
        }
        editId = -1;
        btnSubmit.innerHTML = "Tambah";
    }

    simpanKeLocalStorage();
    tampilkanListJokian();
    clearInputs();
});

/**
 * Event listener untuk tombol cancel. Mengosongkan input dan mereset status edit.
 */
btnCancel.addEventListener("click", (event) => {
    event.preventDefault();
    clearInputs();
    editId = -1;
    btnSubmit.innerHTML = "Tambah";
});

/**
 * Fungsi untuk mengedit item Jokian.
 * @param {number} id - ID dari item Jokian yang akan diedit.
 */
const editItem = (id) => {
    const akun = listJokian.find(akun => akun.id === id);
    if (!akun) return;

    inputNama.value = akun.nama;
    inputNickname.value = akun.nickname;
    inputAdventureRank.value = akun.adventureRank;
    inputDimulaiPada.value = akun.dimulaiPada;
    inputServices.value = akun.services;
    editId = id;
    btnSubmit.innerHTML = "Update";
}

/**
 * Fungsi untuk menghapus item Jokian.
 * @param {number} id - ID dari item Jokian yang akan dihapus.
 */
const hapusAkun = (id) => {
    listJokian = listJokian.filter(akun => akun.id !== id);
    simpanKeLocalStorage();
    filteredJokian = listJokian.filter(akun => akun.nama.toLowerCase().includes(searchBar.value.toLowerCase()));
    tampilkanListJokian(filteredJokian);
}

/**
 * Event listener untuk search bar. Memfilter daftar Jokian berdasarkan istilah pencarian.
 */
searchBar.addEventListener("input", () => {
    const searchTerm = searchBar.value.toLowerCase();
    const filteredJokian = listJokian.filter(akun => akun.nama.toLowerCase().includes(searchTerm));
    tampilkanListJokian(filteredJokian);
});

/**
 * Fungsi untuk menyortir daftar Jokian berdasarkan tanggal mulai.
 * @param {string} order - Urutan untuk menyortir ('asc' untuk naik, 'desc' untuk turun).
 */
const sortListJokian = (order) => {
    listJokian.sort((a, b) => {
        const dateA = new Date(a.dimulaiPada);
        const dateB = new Date(b.dimulaiPada);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
    filteredJokian = listJokian.filter(akun => akun.nama.toLowerCase().includes(searchBar.value.toLowerCase()));
    tampilkanListJokian(filteredJokian);
}

/**
 * Event listener untuk tombol sorting ascending. Menyortir daftar dalam urutan naik.
 */
btnAsc.addEventListener("click", () => sortListJokian('asc'));

/**
 * Event listener untuk tombol sorting descending. Menyortir daftar dalam urutan turun.
 */
btnDesc.addEventListener("click", () => sortListJokian('desc'));

// Menampilkan daftar Jokian awal.
tampilkanListJokian();

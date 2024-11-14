import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [NIM, setNIM] = useState('');
  const [namaMataKuliah, setNamaMataKuliah] = useState('');
  const [nilai, setNilai] = useState('');
  const [sks, setSKS] = useState('');
  const [semester, setSemester] = useState('');
  const [tahun, setTahun] = useState('');
  const [ips, setIPS] = useState(null);
  const [mataKuliahList, setMataKuliahList] = useState([]);
  const [newMataKuliah, setNewMataKuliah] = useState('');
  const [newSKS, setNewSKS] = useState('');

  // Mengambil data mata kuliah (nama dan SKS) dari backend
  useEffect(() => {
    const fetchMataKuliah = async () => {
      try {
        const response = await axios.get('http://localhost:5000/mata-kuliah');
        setMataKuliahList(response.data);
      } catch (error) {
        console.error('Gagal mengambil data mata kuliah:', error);
      }
    };

    fetchMataKuliah();
  }, []);

  // Menambahkan mata kuliah baru secara manual
  const handleAddMataKuliah = async () => {
    if (newMataKuliah && newSKS) {
      try {
        const response = await axios.post('http://localhost:5000/add-mata-kuliah', {
          nama_mk: newMataKuliah,
          sks: newSKS,
        });
        setMataKuliahList([...mataKuliahList, response.data]); // Menambahkan mata kuliah yang baru ditambahkan ke list
        setNewMataKuliah('');
        setNewSKS('');
      } catch (error) {
        console.error('Gagal menambahkan mata kuliah:', error);
      }
    } else {
      alert('Nama Mata Kuliah dan SKS harus diisi!');
    }
  };

  // Menambahkan KRS
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!NIM || !namaMataKuliah || !nilai || !sks || !semester || !tahun) {
      alert('Semua field harus diisi!');
      return;
    }

    // Pastikan nilai, sks, semester, dan tahun adalah angka
    if (!parseFloat(nilai) || !parseInt(sks) || !parseInt(semester) || !parseInt(tahun)) {
      alert('Pastikan semua input angka valid!');
      return;
    }

    // Cari mata kuliah yang sesuai dengan nama yang dipilih
    const mataKuliah = mataKuliahList.find(mk => mk.nama_mk === namaMataKuliah);
    if (!mataKuliah) {
      alert('Mata kuliah tidak ditemukan!');
      return;
    }

    try {
      await axios.post('http://localhost:5000/add-krs', {
        NIM,
        id_mk: mataKuliah.id_mk,  // Mengirimkan id_mk, bukan nama mata kuliah
        nilai: parseFloat(nilai),
        sks: parseInt(sks),
        semester: parseInt(semester),
        tahun: parseInt(tahun),
      });
      alert('Nilai berhasil ditambahkan');
    } catch (error) {
      console.error('Gagal menambahkan nilai:', error);
    }
  };

  // Menghitung IPS
  const handleHitungIPS = async () => {
    if (!NIM) {
      alert('NIM harus diisi!');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/hitung-ips/${NIM}`);
      setIPS(response.data.ips);
    } catch (error) {
      console.error('Gagal menghitung IPS:', error);
    }
  };

  return (
    <div>
      <h1>Input Nilai KRS</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="NIM"
          value={NIM}
          onChange={(e) => setNIM(e.target.value)}
        />
        <select
          value={namaMataKuliah}
          onChange={(e) => setNamaMataKuliah(e.target.value)}
        >
          <option value="">Pilih Mata Kuliah</option>
          {mataKuliahList.map((mk) => (
            <option key={mk.id_mk} value={mk.nama_mk}>
              {mk.nama_mk} - {mk.sks} SKS
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nilai"
          value={nilai}
          onChange={(e) => setNilai(e.target.value)}
        />
        <input
          type="text"
          placeholder="SKS"
          value={sks}
          onChange={(e) => setSKS(e.target.value)}
        />
        <input
          type="text"
          placeholder="Semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tahun"
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
        />
        <button type="submit">Tambah KRS</button>
      </form>

      <button onClick={handleHitungIPS}>Hitung IPS</button>
      {ips && <div>IPS: {ips}</div>}

      <h2>Tambah Mata Kuliah Baru</h2>
      <input
        type="text"
        placeholder="Nama Mata Kuliah"
        value={newMataKuliah}
        onChange={(e) => setNewMataKuliah(e.target.value)}
      />
      <input
        type="text"
        placeholder="SKS"
        value={newSKS}
        onChange={(e) => setNewSKS(e.target.value)}
      />
      <button onClick={handleAddMataKuliah}>Tambah Mata Kuliah</button>
    </div>
  );
}

export default App;